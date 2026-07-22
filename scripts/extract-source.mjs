// One-time-ish extractor: pulls the <style> + <article> out of the standalone
// white-paper HTML, scopes the component CSS under `.paper`, and emits:
//   content/paper.css                     (scoped design-system CSS, no tokens)
//   content/papers/<slug>.body.html       (the <article> markup, verbatim)
// Tokens (:root / prefers-color-scheme) are intentionally dropped here — they
// live once in app/globals.css so the whole site shares them.
import { readFileSync, writeFileSync } from 'node:fs';

const [, , srcPath, slug] = process.argv;
if (!srcPath || !slug) {
  console.error('usage: node scripts/extract-source.mjs <html> <slug>');
  process.exit(1);
}
const html = readFileSync(srcPath, 'utf8');

const styleText = html
  .slice(html.indexOf('<style>') + 7, html.indexOf('</style>'))
  .replace(/\/\*[\s\S]*?\*\//g, ''); // drop comments so they can't fuse into selectors
const bodyStart = html.indexOf('<article');
const bodyEnd = html.indexOf('</article>') + '</article>'.length;
const body = html.slice(bodyStart, bodyEnd);

// --- walk top-level CSS constructs by brace matching ---
function* constructs(css) {
  let i = 0;
  while (i < css.length) {
    while (i < css.length && /\s/.test(css[i])) i++;
    if (i >= css.length) break;
    const start = i;
    let depth = 0;
    while (i < css.length) {
      const c = css[i];
      if (c === '{') depth++;
      else if (c === '}') { depth--; if (depth === 0) { i++; break; } }
      i++;
    }
    yield css.slice(start, i).trim();
  }
}

function prefixSelector(selList) {
  return selList
    .split(',')
    .map((s) => {
      const t = s.trim();
      if (!t) return t;
      if (t === 'body') return '.paper';
      return `.paper ${t}`;
    })
    .join(', ');
}

function scopeRule(rule) {
  const brace = rule.indexOf('{');
  const sel = rule.slice(0, brace).trim();
  const bodyCss = rule.slice(brace); // includes braces
  return `${prefixSelector(sel)} ${bodyCss}`;
}

const out = [];
for (const c of constructs(styleText)) {
  if (c.startsWith('@media')) {
    if (c.includes('prefers-color-scheme')) continue; // tokens -> globals.css
    // @media print { ...rules... } : scope the inner rules
    const open = c.indexOf('{');
    const head = c.slice(0, open).trim();
    const inner = c.slice(open + 1, c.lastIndexOf('}'));
    const innerScoped = [...constructs(inner)].map(scopeRule).join('\n  ');
    out.push(`${head} {\n  ${innerScoped}\n}`);
  } else if (c.startsWith(':root')) {
    continue; // tokens -> globals.css
  } else {
    out.push(scopeRule(c));
  }
}

writeFileSync(new URL('../content/paper.css', import.meta.url), out.join('\n\n') + '\n');
writeFileSync(new URL(`../content/papers/${slug}.body.html`, import.meta.url), body + '\n');
console.log(`wrote content/paper.css (${out.length} rules) and content/papers/${slug}.body.html (${body.length} bytes)`);
