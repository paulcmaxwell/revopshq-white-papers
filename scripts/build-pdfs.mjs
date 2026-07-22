// Render each paper's standalone HTML (content/sources/<slug>.html) to a gated
// PDF (content/pdfs/<slug>.pdf) using the locally installed Chrome. PDFs are
// committed to the repo and served behind the lead-capture gate — Vercel never
// renders them at request time.
//
//   npm run build:pdfs            # all papers
//   npm run build:pdfs -- <slug>  # one paper
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(new URL('../package.json', import.meta.url)));
const sourcesDir = path.join(root, 'content', 'sources');
const pdfsDir = path.join(root, 'content', 'pdfs');

const CHROME =
  process.env.CHROME ||
  [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].find((p) => existsSync(p));

if (!CHROME) {
  console.error('No Chrome/Chromium found. Set CHROME=/path/to/chrome and retry.');
  process.exit(1);
}

const only = process.argv[2];
const slugs = readdirSync(sourcesDir)
  .filter((f) => f.endsWith('.html'))
  .map((f) => f.replace(/\.html$/, ''))
  .filter((s) => !only || s === only);

if (!slugs.length) {
  console.error(only ? `No source for slug "${only}".` : 'No sources in content/sources.');
  process.exit(1);
}

for (const slug of slugs) {
  const src = path.join(sourcesDir, `${slug}.html`);
  const out = path.join(pdfsDir, `${slug}.pdf`);
  execFileSync(
    CHROME,
    [
      '--headless',
      '--disable-gpu',
      '--no-pdf-header-footer',
      `--print-to-pdf=${out}`,
      `file://${src}`,
    ],
    { stdio: 'inherit' },
  );
  console.log(`✓ ${slug} → content/pdfs/${slug}.pdf`);
}
