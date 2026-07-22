'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  slug: string;
  title: string;
  pages: number;
  unlocked: boolean;
  autoOpen?: boolean;
};

type Fields = { firstName?: string; lastName?: string; email?: string; company?: string; hubspotUser?: string };

const downloadUrl = (slug: string) => `/api/download?slug=${slug}`;

export default function DownloadGate({ slug, title, pages, unlocked, autoOpen }: Props) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(unlocked);
  const [busy, setBusy] = useState(false);
  const [hubspotUser, setHubspotUser] = useState<'yes' | 'no' | ''>('');
  const [errors, setErrors] = useState<Fields>({});
  const [formError, setFormError] = useState<string | null>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoOpen && !unlocked) setOpen(true);
  }, [autoOpen, unlocked]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    firstFieldRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const startDownload = useCallback(() => {
    window.location.assign(downloadUrl(slug));
  }, [slug]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setFormError(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      slug,
      firstName: String(fd.get('firstName') ?? ''),
      lastName: String(fd.get('lastName') ?? ''),
      email: String(fd.get('email') ?? ''),
      company: String(fd.get('company') ?? ''),
      website: String(fd.get('website') ?? ''), // honeypot
      hubspotUser,
    };

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        setDone(true);
        // Kick off the download immediately; success panel offers a re-download.
        setTimeout(startDownload, 250);
        return;
      }
      if (res.status === 422 && data.fields) {
        setErrors(data.fields as Fields);
      } else {
        setFormError(data.error ?? 'Something went wrong. Please try again.');
      }
    } catch {
      setFormError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  // Already unlocked (or just completed): straight download button.
  if (done && !open) {
    return (
      <div className="dl-bar">
        <span className="lbl">
          <span className="lbl-strong">{title}</span> — {pages}-page PDF, unlocked.
        </span>
        <a className="btn btn-primary" href={downloadUrl(slug)}>
          <DownloadIcon /> Download PDF
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="dl-bar">
        <span className="lbl">
          Read the full <span className="lbl-strong">{pages}-page</span> paper as a formatted PDF.
        </span>
        <button className="btn btn-primary" type="button" onClick={() => setOpen(true)}>
          <DownloadIcon /> Download PDF
        </button>
      </div>

      {open && (
        <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="gate-title" style={{ position: 'relative' }}>
            <button className="close" type="button" aria-label="Close" onClick={() => setOpen(false)}>
              ✕
            </button>

            {done ? (
              <div className="success">
                <div className="check" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h2>Your download is starting</h2>
                <p>If it didn’t begin automatically, use the button below. Thanks for reading.</p>
                <a className="btn btn-primary btn-block" href={downloadUrl(slug)}>
                  <DownloadIcon /> Download PDF
                </a>
              </div>
            ) : (
              <>
                <div className="kicker">
                  <span className="wm" style={{ fontSize: '0.68rem' }}>
                    <span className="mark" aria-hidden="true" />
                    RevOps HQ
                  </span>
                </div>
                <h2 id="gate-title">Get the PDF</h2>
                <p className="sub">
                  Tell us where to credit the download of <em>{title}</em>. The {pages}-page formatted PDF
                  unlocks instantly.
                </p>

                <form className="form" onSubmit={onSubmit} noValidate>
                  <div className="row2">
                    <div className="field">
                      <label htmlFor="firstName">
                        First name <span className="req">*</span>
                      </label>
                      <input ref={firstFieldRef} id="firstName" name="firstName" autoComplete="given-name" aria-invalid={!!errors.firstName} placeholder="Paul" />
                      {errors.firstName && <span className="err">{errors.firstName}</span>}
                    </div>
                    <div className="field">
                      <label htmlFor="lastName">
                        Last name <span className="req">*</span>
                      </label>
                      <input id="lastName" name="lastName" autoComplete="family-name" aria-invalid={!!errors.lastName} placeholder="Maxwell" />
                      {errors.lastName && <span className="err">{errors.lastName}</span>}
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="email">
                      Work email <span className="req">*</span>
                    </label>
                    <input id="email" name="email" type="email" inputMode="email" autoComplete="email" aria-invalid={!!errors.email} placeholder="paul@company.com" />
                    {errors.email && <span className="err">{errors.email}</span>}
                  </div>

                  <div className="field">
                    <label htmlFor="company">
                      Company <span className="req">*</span>
                    </label>
                    <input id="company" name="company" autoComplete="organization" aria-invalid={!!errors.company} placeholder="Acme Inc." />
                    {errors.company && <span className="err">{errors.company}</span>}
                  </div>

                  <div className="seg">
                    <label>
                      Are you currently a HubSpot user? <span className="req">*</span>
                    </label>
                    <div className="opts" role="group" aria-label="HubSpot user">
                      <button type="button" className="opt" data-on={hubspotUser === 'yes'} onClick={() => setHubspotUser('yes')}>
                        Yes
                      </button>
                      <button type="button" className="opt" data-on={hubspotUser === 'no'} onClick={() => setHubspotUser('no')}>
                        No
                      </button>
                    </div>
                    {errors.hubspotUser && <span className="err">{errors.hubspotUser}</span>}
                  </div>

                  {/* honeypot */}
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />

                  {formError && <span className="err">{formError}</span>}

                  <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
                    {busy ? 'Unlocking…' : (<><DownloadIcon /> Unlock &amp; download</>)}
                  </button>
                  <p className="consent">
                    We’ll email occasional RevOps HQ research. Unsubscribe anytime. No spam.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
    </svg>
  );
}
