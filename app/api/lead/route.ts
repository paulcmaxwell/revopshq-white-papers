import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { bySlug } from '@/content/papers';
import { submitLeadToHubSpotForm } from '@/lib/hubspot';
import { unlockCookie, UNLOCK_MAX_AGE, validateEmail } from '@/lib/gate';

export const runtime = 'nodejs';

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Malformed request.' }, { status: 400 });
  }

  const paper = bySlug(str(data.slug));
  if (!paper) {
    return NextResponse.json({ ok: false, error: 'Unknown white paper.' }, { status: 404 });
  }

  const email = str(data.email);
  const firstName = str(data.firstName);
  const lastName = str(data.lastName);
  const company = str(data.company);
  const hubspotUser = data.hubspotUser === true || data.hubspotUser === 'yes';

  const fields: Record<string, string> = {};
  const emailErr = validateEmail(email);
  if (emailErr) fields.email = emailErr;
  if (!firstName) fields.firstName = 'Required.';
  if (!lastName) fields.lastName = 'Required.';
  if (!company) fields.company = 'Required.';
  if (data.hubspotUser === undefined || data.hubspotUser === null || data.hubspotUser === '') {
    fields.hubspotUser = 'Pick one.';
  }
  if (Object.keys(fields).length) {
    return NextResponse.json({ ok: false, fields }, { status: 422 });
  }

  // Honeypot: real users never fill this hidden field.
  if (str(data.website)) {
    // Pretend success, capture nothing.
    return NextResponse.json({ ok: true, download: `/api/download?slug=${paper.slug}` });
  }

  const jar = await cookies();
  const hdrs = await headers();
  const referer = hdrs.get('referer') ?? undefined;
  const origin = hdrs.get('origin') ?? '';

  const sync = await submitLeadToHubSpotForm(
    {
      email: email.toLowerCase(),
      firstName,
      lastName,
      company,
      hubspotUser,
      paperSlug: paper.slug,
      paperTitle: paper.title,
    },
    {
      hutk: jar.get('hubspotutk')?.value,
      pageUri: referer ?? `${origin}/papers/${paper.slug}`,
      pageName: `RevOps HQ White Paper — ${paper.title}`,
    },
  );

  // Unlock the download regardless of CRM outcome — the lead is already logged.
  jar.set(unlockCookie(paper.slug), '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: UNLOCK_MAX_AGE,
  });

  return NextResponse.json({
    ok: true,
    synced: sync.submitted,
    download: `/api/download?slug=${paper.slug}`,
  });
}
