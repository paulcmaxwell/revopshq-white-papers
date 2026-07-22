import { readFile } from 'node:fs/promises';
import path from 'node:path';
import 'server-only';

const CONTENT = path.join(process.cwd(), 'content');

// Large content assets (the paper body HTML and the approved PDFs) live in the
// Git repo, not in the Vercel deploy payload. In production they're fetched
// from the repo's raw URL (once, then cached in memory); in local dev the
// committed files under /content are used directly.
const RAW_BASE =
  process.env.CONTENT_ASSET_BASE ??
  'https://raw.githubusercontent.com/paulcmaxwell/revopshq-white-papers/main/content';

const bodyCache = new Map<string, string>();
const pdfCache = new Map<string, Buffer>();

/** The <article> markup for a paper: committed file in dev, published asset in prod. */
export async function loadBody(slug: string): Promise<string | null> {
  if (bodyCache.has(slug)) return bodyCache.get(slug)!;
  try {
    const html = await readFile(path.join(CONTENT, 'papers', `${slug}.body.html`), 'utf8');
    bodyCache.set(slug, html);
    return html;
  } catch {
    /* not in the bundle — fetch from the repo */
  }
  try {
    const res = await fetch(`${RAW_BASE}/papers/${slug}.body.html`, { cache: 'force-cache' });
    if (!res.ok) return null;
    const html = await res.text();
    if (!html.includes('<article')) return null;
    bodyCache.set(slug, html);
    return html;
  } catch {
    return null;
  }
}

/** The approved PDF for a paper: committed file in dev, published asset in prod. */
export async function loadPdf(slug: string): Promise<Buffer | null> {
  if (pdfCache.has(slug)) return pdfCache.get(slug)!;
  try {
    const buf = await readFile(path.join(CONTENT, 'pdfs', `${slug}.pdf`));
    pdfCache.set(slug, buf);
    return buf;
  } catch {
    /* not in the bundle — fetch from the repo */
  }
  try {
    const res = await fetch(`${RAW_BASE}/pdfs/${slug}.pdf`, { cache: 'force-cache' });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.subarray(0, 4).toString() !== '%PDF') return null;
    pdfCache.set(slug, buf);
    return buf;
  } catch {
    return null;
  }
}
