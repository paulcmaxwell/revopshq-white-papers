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
  core: { starter: 500, pro: 3000, enterprise: 5000 },
  data: { starter: 500, pro: 5000, enterprise: 10000 },
} as const;

// Per-action lines (Table 2). rate = credits each. max/step size the slider.
type NumKey = 'prospecting' | 'customer' | 'data' | 'content' | 'intent' | 'workflow';
const LINES: { key: NumKey; label: string; unit: string; one: string; rate: number; max: number; step: number }[] = [
  { key: 'prospecting', label: 'Prospecting agent', unit: 'leads', one: 'lead', rate: 100, max: 500, step: 10 },
  { key: 'customer', label: 'Customer agent', unit: 'conversations', one: 'conversation', rate: 50, max: 1000, step: 25 },
  { key: 'data', label: 'Data agent', unit: 'prompts', one: 'prompt', rate: 10, max: 2000, step: 25 },
  { key: 'content', label: 'Content agent', unit: 'pieces', one: 'piece', rate: 1000, max: 100, step: 1 },
  { key: 'intent', label: 'Buyer intent', unit: 'companies', one: 'company', rate: 10, max: 1000, step: 25 },
  { key: 'workflow', label: 'Breeze workflow actions', unit: 'runs', one: 'run', rate: 10, max: 5000, step: 50 },
];

// Data Studio: credits per sync by dataset size × syncs per month by frequency.
const DS_SIZE = [
  { key: 'small', label: '< 500K rows', rate: 25 },
  { key: 'mid', label: '500K–5M', rate: 75 },
  { key: 'large', label: '> 5M', rate: 200 },
] as const;
const DS_FREQ = [
  { key: 'none', label: 'No sync', perMo: 0 },
  { key: 'daily', label: 'Daily', perMo: 30 },
  { key: 'hourly', label: 'Hourly', perMo: 24 * 30 },
  { key: 'q15', label: 'Every 15 min', perMo: 96 * 30 },
] as const;

const fmt = (n: number) => n.toLocaleString('en-US');
const usd = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: n < 100 ? 2 : 0 });

// --- non-linear (log) slider mapping: fine control at low volumes, still
// reaches the max. Position runs 0..1; value snaps to human-friendly grains. ---
const LOG_BASE = 60;
const POS_STEPS = 1000;
function niceRound(v: number): number {
  if (v <= 0) return 0;
  if (v < 20) return Math.round(v);
  if (v < 100) return Math.round(v / 5) * 5;
  const p = Math.pow(10, Math.floor(Math.log10(v)) - 1);
  return Math.round(v / p) * p;
}
function posToValue(f: number, max: number): number {
  const raw = (max * (Math.pow(LOG_BASE, f) - 1)) / (LOG_BASE - 1);
  return niceRound(raw);
}
function valueToPos(v: number, max: number): number {
  if (v <= 0) return 0;
  const f = Math.log(1 + (Math.min(v, max) / max) * (LOG_BASE - 1)) / Math.log(LOG_BASE);
  return Math.max(0, Math.min(1, f));
}

/** A labelled editorial log-slider whose value is also click-to-type. */
function SliderRow({
  label, hint, value, max, unit, onChange, credits,
}: {
  label: string; hint: string; value: number; max: number; unit: string;
  onChange: (v: number) => void; credits: number;
}) {
  const pos = valueToPos(value, max);
  return (
    <div className="cc-row">
      <div className="cc-row-head">
        <span className="cc-row-label">{label} <span className="cc-row-hint">{hint}</span></span>
        <span className="cc-row-cr">{credits > 0 ? `${fmt(credits)} cr` : '—'}</span>
      </div>
      <div className="cc-row-ctl">
        <input
          className="cc-slider"
          type="range"
          min={0}
          max={POS_STEPS}
          step={1}
          value={Math.round(pos * POS_STEPS)}
          onChange={(e) => onChange(posToValue(Number(e.target.value) / POS_STEPS, max))}
          style={{ ['--pct' as string]: `${pos * 100}%`, ['--fill' as string]: 'var(--accent)' }}
          aria-label={label}
        />
        <span className="cc-row-val">
          <input
            type="number"
            min={0}
            inputMode="numeric"
            value={value || 0}
            onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
            aria-label={`${label} exact value`}
          />
          <span>{unit}/mo</span>
        </span>
      </div>
    </div>
  );
}

// One-tap scenario starting points.
type Scenario = { platform: 'core' | 'data'; tier: 'starter' | 'pro' | 'enterprise'; vol: Record<NumKey, number>; dsSize: number; dsFreq: number };
const PRESETS: { key: string; label: string; s: Scenario }[] = [
  {
    key: 'pro', label: 'Typical Pro team',
    s: { platform: 'data', tier: 'pro', vol: { prospecting: 50, customer: 100, data: 200, content: 4, intent: 100, workflow: 200 }, dsSize: 0, dsFreq: 1 },
  },
  {
    key: 'heavy', label: 'Heavy AI user',
    s: { platform: 'data', tier: 'enterprise', vol: { prospecting: 200, customer: 500, data: 1000, content: 40, intent: 300, workflow: 1000 }, dsSize: 1, dsFreq: 2 },
  },
];
const EMPTY: Scenario = { platform: 'data', tier: 'pro', vol: { prospecting: 0, customer: 0, data: 0, content: 0, intent: 0, workflow: 0 }, dsSize: 0, dsFreq: 0 };

function Calculator() {
  const [platform, setPlatform] = useState<'core' | 'data'>('data');
  const [tier, setTier] = useState<'starter' | 'pro' | 'enterprise'>('pro');
  const [vol, setVol] = useState<Record<NumKey, number>>({
    prospecting: 0, customer: 0, data: 0, content: 0, intent: 0, workflow: 0,
  });
  const [dsSize, setDsSize] = useState(0); // index into DS_SIZE
  const [dsFreq, setDsFreq] = useState(0); // index into DS_FREQ

  const apply = (s: Scenario) => {
    setPlatform(s.platform); setTier(s.tier); setVol({ ...s.vol }); setDsSize(s.dsSize); setDsFreq(s.dsFreq);
  };

  const dsCredits = DS_SIZE[dsSize].rate * DS_FREQ[dsFreq].perMo;

  const contribs = useMemo(() => {
    const list = LINES.map((l) => ({ label: l.label, credits: (vol[l.key] || 0) * l.rate }));
    list.push({ label: 'Data Studio syncs', credits: dsCredits });
    return list;
  }, [vol, dsCredits]);

  const total = contribs.reduce((n, r) => n + r.credits, 0);
  const included = ALLOWANCE[platform][tier];
  const overage = Math.max(0, total - included);
  const cost = overage * CREDIT_PRICE;
  const max = Math.max(total, included, 1);
  const dsShare = overage > 0 ? Math.min(dsCredits, overage) / overage : 0;

  return (
    <figure className="credit-calc" aria-label="Interactive HubSpot Credit estimator">
      <figcaption>
        <span className="cc-kicker">Interactive · Estimate a month</span>
        <span className="cc-note">Drag or type. Rates as of July 2026 — confirm against HubSpot before quoting.</span>
      </figcaption>

      <div className="cc-presets">
        <span className="cc-presets-label">Start from</span>
        {PRESETS.map((p) => (
          <button key={p.key} type="button" onClick={() => apply(p.s)}>{p.label}</button>
        ))}
        <button type="button" className="cc-reset" onClick={() => apply(EMPTY)}>Reset</button>
      </div>

      <div className="cc-grid">
        <div className="cc-inputs">
          <div className="cc-field cc-plan">
            <span className="cc-plan-label">Account tier <span>sets the included allowance</span></span>
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
            <SliderRow
              key={l.key}
              label={l.label}
              hint={`${fmt(l.rate)} cr / ${l.one}`}
              value={vol[l.key] || 0}
              max={l.max}
              unit={l.unit}
              credits={(vol[l.key] || 0) * l.rate}
              onChange={(v) => setVol((s) => ({ ...s, [l.key]: v }))}
            />
          ))}

          <div className="cc-field cc-ds">
            <div className="cc-row-head">
              <span className="cc-row-label">Data Studio <span className="cc-row-hint">the usual credit surprise · {fmt(DS_SIZE[dsSize].rate)} cr / sync</span></span>
              <span className="cc-row-cr" style={{ color: dsCredits > 0 ? 'var(--clay)' : undefined }}>
                {dsCredits > 0 ? `${fmt(dsCredits)} cr` : '—'}
              </span>
            </div>
            <div className="cc-segs cc-segs-sm">
              {DS_SIZE.map((s, i) => (
                <button key={s.key} type="button" aria-pressed={dsSize === i} onClick={() => setDsSize(i)}>{s.label}</button>
              ))}
            </div>
            <input
              className="cc-slider cc-slider-ticks"
              type="range"
              min={0}
              max={DS_FREQ.length - 1}
              step={1}
              value={dsFreq}
              onChange={(e) => setDsFreq(Number(e.target.value))}
              style={{ ['--pct' as string]: `${(dsFreq / (DS_FREQ.length - 1)) * 100}%`, ['--fill' as string]: 'var(--clay)' }}
              aria-label="Data Studio sync frequency"
            />
            <div className="cc-ticks">
              {DS_FREQ.map((f, i) => (
                <span key={f.key} className={i === dsFreq ? 'on' : ''}>{f.label}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="cc-out">
          <div className="cc-bar" role="img" aria-label={`${fmt(total)} credits used against ${fmt(included)} included`}>
            <div className="cc-bar-included" style={{ width: `${(Math.min(total, included) / max) * 100}%` }} />
            {overage > 0 && <div className="cc-bar-over" style={{ width: `${(overage / max) * 100}%` }} />}
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

          {overage > 0 && dsShare >= 0.4 && (
            <p className="cc-insight">
              Data Studio alone is <b>{Math.round(dsShare * 100)}%</b> of your overage — the single lever worth pre-empting on a call.
            </p>
          )}

          {contribs.some((r) => r.credits > 0) && (
            <ul className="cc-break">
              {contribs.filter((r) => r.credits > 0).sort((a, b) => b.credits - a.credits).map((r) => (
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

/** Compact inline launcher rendered at the article marker. */
function InlineLauncher({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="cc-launch">
      <div className="cc-launch-txt">
        <span className="cc-kicker">Interactive · Estimate a month</span>
        <span className="cc-launch-sub">Model your credit usage against the included allowance — live.</span>
      </div>
      <button type="button" className="cc-launch-btn" onClick={onOpen}>
        Open the estimator <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}

/**
 * Mounts two access points for the estimator (only on the credits paper):
 *  - an inline launcher card at the `#credit-calculator` marker, and
 *  - a persistent floating launcher that opens a right-side drawer.
 * The calculator itself lives once, inside the drawer.
 */
export default function CreditCalculator() {
  const [open, setOpen] = useState(false);
  const [marker, setMarker] = useState<HTMLElement | null>(null);
  const [body, setBody] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMarker(document.getElementById('credit-calculator'));
    setBody(document.body);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open]);

  return (
    <>
      {marker && createPortal(<InlineLauncher onOpen={() => setOpen(true)} />, marker)}
      {body && createPortal(
        <>
          <button
            type="button"
            className="cc-fab"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            <span className="cc-fab-mark" aria-hidden="true" />
            Estimate a month
          </button>

          <div className={`cc-drawer-root${open ? ' open' : ''}`} aria-hidden={!open}>
            <div className="cc-scrim" onClick={() => setOpen(false)} />
            <aside className="cc-drawer" role="dialog" aria-modal="true" aria-label="HubSpot credit estimator">
              <div className="cc-drawer-bar">
                <span className="cc-kicker">Credit estimator</span>
                <button type="button" className="cc-drawer-close" onClick={() => setOpen(false)} aria-label="Close estimator">✕</button>
              </div>
              {open && <Calculator />}
            </aside>
          </div>
        </>,
        body,
      )}
    </>
  );
}
