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

type SyncResult = { synced: boolean; reason?: string };

const API = 'https://api.hubapi.com/crm/v3/objects/contacts';

/**
 * Best-effort push of a captured lead into HubSpot as a contact.
 *
 * Never throws — a CRM hiccup must not block a download. Sends only standard
 * contact properties by default; if HUBSPOT_EXTRA_PROPERTIES lists custom
 * property names that exist in the portal, they are attempted and the call
 * retries with standard props only on a 400 (unknown property).
 */
export async function syncLeadToHubSpot(lead: Lead): Promise<SyncResult> {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;

  // Always leave a durable trace in the function logs regardless of CRM state.
  console.log('[lead]', JSON.stringify({ ...lead, at: new Date().toISOString() }));

  if (!token) return { synced: false, reason: 'no-token' };

  const standard: Record<string, string> = {
    email: lead.email,
    firstname: lead.firstName,
    lastname: lead.lastName,
    company: lead.company,
  };

  // Optional custom properties, only if the operator opted in.
  const extra: Record<string, string> = {};
  const userProp = process.env.HUBSPOT_HUBSPOT_USER_PROPERTY;
  const paperProp = process.env.HUBSPOT_PAPER_PROPERTY;
  if (userProp) extra[userProp] = lead.hubspotUser ? 'true' : 'false';
  if (paperProp) extra[paperProp] = lead.paperSlug;

  async function post(properties: Record<string, string>) {
    return fetch(API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ properties }),
    });
  }

  try {
    let res = await post({ ...standard, ...extra });

    // Unknown custom property -> retry with standard fields only.
    if (res.status === 400 && Object.keys(extra).length) {
      res = await post(standard);
    }

    // Already a contact — the lead is known; count it as captured.
    if (res.status === 409) return { synced: true, reason: 'existing' };

    if (res.ok) return { synced: true };

    const text = await res.text().catch(() => '');
    console.error('[hubspot] create failed', res.status, text.slice(0, 300));
    return { synced: false, reason: `http-${res.status}` };
  } catch (err) {
    console.error('[hubspot] network error', err);
    return { synced: false, reason: 'network' };
  }
}
