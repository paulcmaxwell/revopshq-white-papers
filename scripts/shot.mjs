// True device-emulated screenshot via CDP (matches the responsive auditor's
// viewport, unlike Chrome's --screenshot which mis-sizes small windows).
//   node scripts/shot.mjs <path> <width> <outfile>
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = process.env.BASE || 'http://localhost:3100';
const [route = '/', width = '390', out = '/tmp/shot.png'] = process.argv.slice(2);
const PORT = Number(process.env.CDP_PORT || 9344);

const proc = spawn(CHROME, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`, '--user-data-dir=/tmp/rf-shot', 'about:blank'], { stdio: 'ignore' });
await sleep(1800);
const t = await (await fetch(`http://localhost:${PORT}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(t.webSocketDebuggerUrl);
await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
let id = 0; const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Emulation.setDeviceMetricsOverride', { width: Number(width), height: 800, deviceScaleFactor: 2, mobile: Number(width) < 700 });
await send('Page.enable');
await send('Page.navigate', { url: BASE + route });
await sleep(1500);
const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: undefined });
writeFileSync(out, Buffer.from(shot.result.data, 'base64'));
ws.close(); proc.kill();
console.log('wrote', out);
