// Serialize the source tree into the {file,data,encoding} array the Vercel
// deploy tool expects. Excludes build output and deps (Vercel rebuilds them).
import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

// Exclude build output, deps, and files only needed for local authoring
// (Vercel neither runs the scripts nor needs the standalone HTML sources).
const EXCLUDE_DIRS = new Set(['node_modules', '.next', '.git', '.vercel', 'out', 'scripts', 'sources']);
const EXCLUDE_FILES = new Set([
  'package-lock.json', // Vercel regenerates from package.json
  '.DS_Store',
  'next-env.d.ts',
  'README.md',
  '.env.example',
  '.gitignore',
]);
const BINARY_EXT = new Set(['.pdf', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.woff', '.woff2']);

const files = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const abs = path.join(dir, name);
    const rel = path.relative(root, abs);
    if (statSync(abs).isDirectory()) {
      if (EXCLUDE_DIRS.has(name)) continue;
      walk(abs);
    } else {
      if (EXCLUDE_FILES.has(name)) continue;
      const ext = path.extname(name).toLowerCase();
      // The assembled .pdf ships as base64 part.NNN text files instead.
      if (ext === '.pdf') continue;
      if (BINARY_EXT.has(ext)) {
        files.push({ file: rel, data: readFileSync(abs).toString('base64'), encoding: 'base64' });
      } else {
        files.push({ file: rel, data: readFileSync(abs, 'utf8') });
      }
    }
  }
}
walk(root);

const out = process.argv[2] || '/tmp/wp-deploy.json';
writeFileSync(out, JSON.stringify(files));
const bytes = files.reduce((n, f) => n + f.data.length, 0);
console.log(`${files.length} files -> ${out} (${(bytes / 1024).toFixed(0)} KB of data)`);
for (const f of files) console.log(`  ${f.encoding === 'base64' ? '[bin]' : '     '} ${f.file} (${f.data.length}b)`);
