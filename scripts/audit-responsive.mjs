// Responsive overflow auditor. Loads each route at several widths via headless
// Chrome (CDP over Node's built-in WebSocket) and reports any element whose box
// extends past the viewport — i.e. the thing causing horizontal scroll / lost
// margins on mobile. Exit code 1 if any overflow is found (usable as a test).
//
//   node scripts/audit-responsive.mjs            # against http://localhost:3100
//   BASE=http://localhost:3000 node scripts/audit-responsive.mjs
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const CHROME =
  process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = process.env.BASE || 'http://localhost:3100';
const PORT = Number(process.env.CDP_PORT || 9333);
const ROUTES = (process.env.ROUTES || [
  '/',
  '/downloads',
  '/papers/case-ria-hubspot-migration',
  '/papers/attribution-channel-economics',
  '/papers/hubspot-credit-reference',
].join(',')).split(',');
const WIDTHS = [360, 390, 768, 1024, 1280];

// Report an element as a REAL overflow only if nothing between it and <body>
// clips the x-axis (a proper overflow-x:auto/scroll/hidden wrapper). body/html
// are excluded on purpose: body{overflow-x:hidden} only MASKS overflow, so we
// still want to catch content that relies on that mask.
const FINDER = `(() => {
  const vw = document.documentElement.clientWidth;
  const clipsX = (el) => { const o = getComputedStyle(el).overflowX; return o==='auto'||o==='scroll'||o==='hidden'||o==='clip'; };
  const seen = new Set(); const bad = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.right <= vw + 1 && r.left >= -1) continue;
    if (/^hs-/.test(el.id) || el.closest('[id^="hs-"]')) continue; // third-party HubSpot embed DOM (not ours)
    let a = el.parentElement, contained = false;
    while (a && a !== document.body) { if (clipsX(a)) { contained = true; break; } a = a.parentElement; }
    if (contained) continue;
    const cls = (typeof el.className === 'string' && el.className.trim())
      ? '.' + el.className.trim().split(/\\s+/).slice(0,3).join('.') : '';
    const sel = (el.tagName.toLowerCase() + (el.id ? '#'+el.id : '') + cls).slice(0, 70);
    if (seen.has(sel)) continue; seen.add(sel);
    bad.push({ sel, left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width) });
  }
  return { vw, scrollW: document.documentElement.scrollWidth, bad: bad.slice(0, 15) };
})()`;

const proc = spawn(
  CHROME,
  ['--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`, '--user-data-dir=/tmp/rf-audit', 'about:blank'],
  { stdio: 'ignore' },
);
await sleep(1800);

async function evalAt(width, url) {
  const t = await (await fetch(`http://localhost:${PORT}/json/new?about:blank`, { method: 'PUT' })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0; const pending = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
  const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 700 });
  await send('Page.enable');
  await send('Page.navigate', { url });
  await sleep(1300);
  const res = await send('Runtime.evaluate', { expression: FINDER, returnByValue: true });
  ws.close();
  await fetch(`http://localhost:${PORT}/json/close/${t.id}`).catch(() => {});
  return res.result?.result?.value;
}

let failures = 0;
for (const route of ROUTES) {
  for (const w of WIDTHS) {
    let r;
    try { r = await evalAt(w, BASE + route); } catch (e) { console.log(`ERR  ${route} @${w}: ${e.message}`); continue; }
    const overflow = r && r.bad.length > 0;
    if (overflow) {
      failures++;
      console.log(`✗ OVERFLOW ${route} @${w}px  (${r.bad.length} uncontained; scrollWidth ${r.scrollW}, viewport ${r.vw})`);
      for (const b of r.bad) console.log(`      ${b.sel}  [left ${b.left}, right ${b.right}, w ${b.w}]`);
    } else {
      console.log(`✓ ok       ${route} @${w}px`);
    }
  }
}
proc.kill();
console.log(failures ? `\n${failures} overflow(s) found.` : `\nNo overflow. All routes clean.`);
process.exit(failures ? 1 : 0);
