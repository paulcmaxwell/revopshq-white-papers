import 'server-only';

export type Lead = {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  hubspotUser: boolean;
  paperSlug: string;
  paperTitle: string;
};

export type SubmitContext = {
  hutk?: string; // hubspotutk cookie, associates the submission with the visitor
  pageUri?: string;
  pageName?: string;
};

type SubmitResult = { submitted: boolean; reason?: string };

// HubSpot Forms Submission API — unauthenticated, no private-app token needed.
const PORTAL_ID = process.env.HUBSPOT_PORTAL_ID ?? '21204085';
const FORM_GUID = process.env.HUBSPOT_FORM_GUID ?? 'e79ed75a-3f79-43cd-b1e4-6648c332a828';
const ENDPOINT = `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_GUID}`;

/**
 * Post a captured lead to the RevOps HQ HubSpot form. email / first / last /
 * company map to their own contact fields; everything else (HubSpot-user
 * answer + which paper) is compiled into the single standard `message` field
 * rather than becoming its own form field.
 *
 * Best-effort: never throws, so a HubSpot hiccup can't block the download.
 */
export async function submitLeadToHubSpotForm(
  lead: Lead,
  ctx: SubmitContext = {},
): Promise<SubmitResult> {
  console.log('[lead]', JSON.stringify({ ...lead, at: new Date().toISOString() }));

  const message = [
    `White paper: ${lead.paperTitle} (${lead.paperSlug})`,
    `Currently a HubSpot user: ${lead.hubspotUser ? 'Yes' : 'No'}`,
    ctx.pageUri ? `Source: ${ctx.pageUri}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const payload = {
    fields: [
      { name: 'email', value: lead.email },
      { name: 'firstname', value: lead.firstName },
      { name: 'lastname', value: lead.lastName },
      { name: 'company', value: lead.company },
      { name: 'message', value: message },
    ],
    context: {
      ...(ctx.hutk ? { hutk: ctx.hutk } : {}),
      pageUri: ctx.pageUri ?? 'https://revopshq-white-papers.vercel.app',
      pageName: ctx.pageName ?? `RevOps HQ White Paper — ${lead.paperTitle}`,
    },
  };

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) return { submitted: true };
    const text = await res.text().catch(() => '');
    console.error('[hubspot] form submit failed', res.status, text.slice(0, 400));
    return { submitted: false, reason: `http-${res.status}` };
  } catch (err) {
    console.error('[hubspot] network error', err);
    return { submitted: false, reason: 'network' };
  }
}
