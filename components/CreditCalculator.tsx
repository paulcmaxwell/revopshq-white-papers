'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

// ============================================================
// Interactive companion to White Paper No. 03 (HubSpot Credits).
// Web-only: it portals into a marker div rendered inside the static
// paper body, so the PDF/print artifact is unaffected. All rates come
// from the paper's rate sheet (Table 2) and included allowances (Table 1),
// current as of July 2026. 1 credit = $0.01.
// ============================================================

const CREDIT_PRICE = 0.01;

// Included monthly allowance by highest subscription tier (Table 1).
const ALLOWANCE = {
  core: { label: 'Core Hub (Marketing/Sales/Service/Content)', tiers: { starter: 500, pro: 3000, enterprise: 5000 } },
  data: { label: 'Data Hub / Customer Platform', tiers: { starter: 500, pro: 5000, enterprise: 10000 } },
} as const;

// Per-action rates (Table 2), credits each.
const RATE = {
  prospecting: 100, // Breeze Prospecting agent — per lead
  customer: 50, // Breeze Customer agent — per conversation
  data: 10, // Breeze Data agent — per prompt
  content: 1000, // Breeze Content agent — per piece
  intent: 10, // Buyer intent — per company
  workflow: 10, // one Breeze action in a workflow — per run
} as const;

// Data Studio: credits per sync, by dataset size.
const DS_SIZE = { small: 25, mid: 75, large: 200 } as const; // <500K / 500K–5M / >5M rows
const DS_FREQ = { none: 0, daily: 30, hourly: 24 * 30, q15: 96 * 30 } as const; // syncs / month

type NumKey = 'prospecting' | 'customer' | 'data' | 'content' | 'intent' | 'workflow';

const LINES: { key: NumKey; label: string; unit: string; rate: number }[] = [
  { key: 'prospecting', label: 'Prospecting agent', unit: 'leads', rate: RATE.prospecting },
  { key: 'customer', label: 'Customer agent', unit: 'conversations', rate: RATE.customer },
  { key: 'data', label: 'Data agent', unit: 'prompts', rate: RATE.data },
  { key: 'content', label: 'Content agent', unit: 'pieces', rate: RATE.content },
  { key: 'intent', label: 'Buyer intent', unit: 'companies', rate: RATE.intent },
  { key: 'workflow', label: 'Breeze workflow actions', unit: 'runs', rate: RATE.workflow },
];

const fmt = (n: number) => n.toLocaleString('en-US');
const usd = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: n < 100 ? 2 : 0 });

function Calculator() {
  const [platform, setPlatform] = useState<'core' | 'data'>('data');
  const [tier, setTier] = useState<'starter' | 'pro' | 'enterprise'>('pro');
  const [vol, setVol] = useState<Record<NumKey, number>>({
    prospecting: 0, customer: 0, data: 0, content: 0, intent: 0, workflow: 0,
  });
  const [dsSize, setDsSize] = useState<keyof typeof DS_SIZE>('small');
  const [dsFreq, setDsFreq] = useState<keyof typeof DS_FREQ>('none');

  const rows = useMemo(() => {
    const base = LINES.map((l) => ({ label: l.label, unit: l.unit, credits: (vol[l.key] || 0) * l.rate }));
    const dsCredits = DS_SIZE[dsSize] * DS_FREQ[dsFreq];
    base.push({ label: 'Data Studio syncs', unit: 'syncs/mo', credits: dsCredits });
    return base;
  }, [vol, dsSize, dsFreq]);

  const total = rows.reduce((n, r) => n + r.credits, 0);
  const included = ALLOWANCE[platform].tiers[tier];
  const overage = Math.max(0, total - included);
  const cost = overage * CREDIT_PRICE;
  const max = Math.max(total, included, 1);

  return (
    <figure className="credit-calc" aria-label="Interactive HubSpot Credit estimator">
      <figcaption>
        <span className="cc-kicker">Interactive · Estimate a month</span>
        <span className="cc-note">Companion to the rate sheet above. Rates as of July 2026 — confirm before quoting.</span>
      </figcaption>

      <div className="cc-grid">
        <div className="cc-inputs">
          <div className="cc-field cc-plan">
            <label>Account tier <span>(sets the included allowance)</span></label>
            <div className="cc-segs">
              {(['core', 'data'] as const).map((p) => (
                <button key={p} type="button" aria-pressed={platform === p} onClick={() => setPlatform(p)}>
                  {p === 'core' ? 'Core Hub' : 'Data Hub'}
                </button>
              ))}
            </div>
            <div className="cc-segs">
              {(['starter', 'pro', 'enterprise'] as const).map((t) => (
                <button key={t} type="button" aria-pressed={tier === t} onClick={() => setTier(t)}>
                  {t[0].toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {LINES.map((l) => (
            <div className="cc-field" key={l.key}>
              <label htmlFor={`cc-${l.key}`}>
                {l.label} <span>{fmt(l.rate)} credits / {l.unit.replace(/s$/, '')}</span>
              </label>
              <div className="cc-num">
                <input
                  id={`cc-${l.key}`}
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={vol[l.key] || ''}
                  placeholder="0"
                  onChange={(e) => setVol((v) => ({ ...v, [l.key]: Math.max(0, Number(e.target.value) || 0) }))}
                />
                <span className="cc-unit">{l.unit} / mo</span>
              </div>
            </div>
          ))}

          <div className="cc-field cc-plan">
            <label>Data Studio <span>the usual credit surprise</span></label>
            <div className="cc-segs">
              {([['small', '< 500K rows'], ['mid', '500K–5M'], ['large', '> 5M']] as const).map(([k, lab]) => (
                <button key={k} type="button" aria-pressed={dsSize === k} onClick={() => setDsSize(k)}>{lab}</button>
              ))}
            </div>
            <div className="cc-segs">
              {([['none', 'No sync'], ['daily', 'Daily'], ['hourly', 'Hourly'], ['q15', 'Every 15 min']] as const).map(([k, lab]) => (
                <button key={k} type="button" aria-pressed={dsFreq === k} onClick={() => setDsFreq(k)}>{lab}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="cc-out">
          <div className="cc-bar" role="img" aria-label={`${fmt(total)} credits used against ${fmt(included)} included`}>
            <div className="cc-bar-included" style={{ width: `${(Math.min(total, included) / max) * 100}%` }} />
            {overage > 0 && (
              <div className="cc-bar-over" style={{ width: `${(overage / max) * 100}%` }} />
            )}
            <div className="cc-bar-mark" style={{ left: `${(included / max) * 100}%` }} title="Included allowance" />
          </div>
          <div className="cc-legend">
            <span><i className="cc-sw-inc" /> Included {fmt(included)}</span>
            {overage > 0 && <span><i className="cc-sw-over" /> Overage {fmt(overage)}</span>}
          </div>

          <dl className="cc-totals">
            <div><dt>Credits used / mo</dt><dd>{fmt(total)}</dd></div>
            <div><dt>Included</dt><dd>−{fmt(included)}</dd></div>
            <div className="cc-over-row"><dt>Overage</dt><dd>{fmt(overage)}</dd></div>
          </dl>

          <div className="cc-cost">
            <span className="cc-cost-label">Est. monthly overage</span>
            <span className="cc-cost-val">{usd(cost)}</span>
            <span className="cc-cost-sub">at $0.01 / credit{overage === 0 ? ' — within allowance' : ''}</span>
          </div>

          {rows.some((r) => r.credits > 0) && (
            <ul className="cc-break">
              {rows.filter((r) => r.credits > 0).sort((a, b) => b.credits - a.credits).map((r) => (
                <li key={r.label}>
                  <span>{r.label}</span>
                  <span className="cc-break-n">{fmt(r.credits)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </figure>
  );
}

/** Portals the calculator into the `#credit-calculator` marker inside the paper body. */
export default function CreditCalculator() {
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setHost(document.getElementById('credit-calculator'));
  }, []);
  if (!host) return null;
  return createPortal(<Calculator />, host);
}
