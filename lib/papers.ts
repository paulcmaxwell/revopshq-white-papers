import { readFile } from 'node:fs/promises';
import path from 'node:path';
import 'server-only';

const CONTENT = path.join(process.cwd(), 'content');

// The approved PDFs are large binaries that live in the Git repo, not in the
// Vercel deploy payload. In production the download route fetches them from the
// repo's raw URL (once, then cached in memory); in local dev the committed file
// under content/pdfs is used directly.
const ASSET_BASE =
  process.env.PDF_ASSET_BASE ??
  'https://raw.githubusercontent.com/paulcmaxwell/revopshq-white-papers/main/content/pdfs';

const cache = new Map<string, Buffer>();

/** The <article> markup for a paper, read from content/papers/<slug>.body.html. */
export async function loadBody(slug: string): Promise<string | null> {
  try {
    return await readFile(path.join(CONTENT, 'papers', `${slug}.body.html`), 'utf8');
  } catch {
    return null;
  }
}

/** The approved PDF for a paper: committed file in dev, published asset in prod. */
export async function loadPdf(slug: string): Promise<Buffer | null> {
  if (cache.has(slug)) return cache.get(slug)!;

  // Local committed file (present in dev and in the Git checkout).
  try {
    const buf = await readFile(path.join(CONTENT, 'pdfs', `${slug}.pdf`));
    cache.set(slug, buf);
    return buf;
  } catch {
    /* not on disk in the serverless bundle — fall through to remote */
  }

  try {
    const res = await fetch(`${ASSET_BASE}/${slug}.pdf`, { cache: 'force-cache' });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.subarray(0, 4).toString() !== '%PDF') return null;
    cache.set(slug, buf);
    return buf;
  } catch {
    return null;
  }
}
