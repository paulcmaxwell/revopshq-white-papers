import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { bySlug } from '@/content/papers';
import { loadPdf } from '@/lib/papers';
import { unlockCookie } from '@/lib/gate';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug') ?? '';
  const paper = bySlug(slug);
  if (!paper) {
    return NextResponse.json({ error: 'Unknown white paper.' }, { status: 404 });
  }

  const jar = await cookies();
  if (jar.get(unlockCookie(slug))?.value !== '1') {
    // Not unlocked — send them back to the paper to complete the form.
    return NextResponse.redirect(new URL(`/papers/${slug}?gate=1`, req.url), 303);
  }

  const file = await loadPdf(slug);
  if (!file) {
    return NextResponse.json({ error: 'PDF not available yet.' }, { status: 404 });
  }

  const filename = `RevOpsHQ-${slug}.pdf`;
  return new NextResponse(new Uint8Array(file), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': String(file.length),
      'Cache-Control': 'private, no-store',
    },
  });
}
