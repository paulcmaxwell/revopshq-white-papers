// Soft gate: a successful form submit sets an httpOnly cookie that the download
// route checks. This is lead-capture friction, not hard security.
export const unlockCookie = (slug: string) => `wp_unlock_${slug}`;
export const UNLOCK_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Reject obvious throwaway/role inboxes to keep the lead list useful.
const BAD_DOMAINS = new Set([
  'example.com',
  'test.com',
  'mailinator.com',
  'tempmail.com',
]);

export function validateEmail(email: string): string | null {
  const e = email.trim().toLowerCase();
  if (!EMAIL_RE.test(e)) return 'Enter a valid email address.';
  const domain = e.split('@')[1];
  if (BAD_DOMAINS.has(domain)) return 'Use a work email address.';
  return null;
}
