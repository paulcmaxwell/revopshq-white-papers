'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

// ============================================================
// Interactive companion to White Paper No. 03 (HubSpot Credits).
// Web-only: portals into a #credit-calculator marker near the top of the
// static paper body, so the PDF/print artifact is unaffected. Rates from the
// paper's rate sheet (Table 2) + allowances (Table 1). 1 credit = $0.01.
// ============================================================

const CREDIT_PRICE = 0.01;

const ALLOWANCE = {
  core: { starter: 500, pro: 3000, enterprise: 5000 },
  data: { starter: 500, pro: 5000, enterprise: 10000 },
} as const;

type NumKey = 'prospecting' | 'customer' | 'data' | 'content' | 'intent' | 'workflow';
const LINES: { key: NumKey; label: string; unit: string; one: string; rate: number; max: number }[] = [
  { key: 'prospecting', label: 'Prospecting agent', unit: 'leads', one: 'lead', rate: 100, max: 500 },
  { key: 'customer', label: 'Customer agent', unit: 'conversations', one: 'conversation', rate: 50, max: 1000 },
  { key: 'data', label: 'Data agent', unit: 'prompts', one: 'prompt', rate: 10, max: 2000 },
  { key: 'content', label: 'Content agent', unit: 'pieces', one: 'piece', rate: 1000, max: 100 },
  { key: 'intent', label: 'Buyer intent', unit: 'companies', one: 'company', rate: 10, max: 1000 },
  { key: 'workflow', label: 'Workflow actions', unit: 'runs', one: 'run', rate: 10, max: 5000 },
];

const DS_SIZE = [
  { label: '< 500K rows', rate: 25 },
  { label: '500K–5M', rate: 75 },
  { label: '> 5M', rate: 200 },
];
const DS_FREQ = [
  { label: 'No sync', perMo: 0 },
  { label: 'Daily', perMo: 30 },
  { label: 'Hourly', perMo: 24 * 30 },
  { label: 'Every 15 min', perMo: 96 * 30 },
];

const fmt = (n: number) => n.toLocaleString('en-US');
const usd = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: n < 100 ? 2 : 0 });

// non-linear (log) slider: fine control low, still reaches max
const LOG_BASE = 60;
const STEPS = 1000;
function niceRound(v: number): number {
  if (v <= 0) return 0;
  if (v < 20) return Math.round(v);
  if (v < 100) return Math.round(v / 5) * 5;
  const p = Math.pow(10, Math.floor(Math.log10(v)) - 1);
  return Math.round(v / p) * p;
}
const posToValue = (f: number, max: number) => niceRound((max * (Math.pow(LOG_BASE, f) - 1)) / (LOG_BASE - 1));
const valueToPos = (v: number, max: number) =>
  v <= 0 ? 0 : Math.min(1, Math.log(1 + (Math.min(v, max) / max) * (LOG_BASE - 1)) / Math.log(LOG_BASE));

function SliderRow({
  label, hint, value, max, unit, onChange,
}: { label: string; hint: string; value: number; max: number; unit: string; onChange: (v: number) => void }) {
  const pos = valueToPos(value, max);
  return (
    <label className="cc-row">
      <span className="cc-row-head">
        <span className="cc-row-label">{label}</span>
        <span className="cc-row-val"><b>{fmt(value)}</b> {unit}/mo</span>
      </span>
      <input
        className="cc-slider"
        type="range"
        min={0}
        max={STEPS}
        step={1}
        value={Math.round(pos * STEPS)}
        onChange={(e) => onChange(posToValue(Number(e.target.value) / STEPS, max))}
        style={{ ['--pct' as string]: `${pos * 100}%` }}
        aria-label={`${label} — ${hint}`}
      />
    </label>
  );
}

function Calculator() {
  const [platform, setPlatform] = useState<'core' | 'data'>('data');
  const [tier, setTier] = useState<'starter' | 'pro' | 'enterprise'>('pro');
  const [vol, setVol] = useState<Record<NumKey, number>>({
    prospecting: 0, customer: 0, data: 0, content: 0, intent: 0, workflow: 0,
  });
  const [dsSize, setDsSize] = useState(0);
  const [dsFreq, setDsFreq] = useState(0);

  const total = useMemo(() => {
    const agents = LINES.reduce((n, l) => n + (vol[l.key] || 0) * l.rate, 0);
    return agents + DS_SIZE[dsSize].rate * DS_FREQ[dsFreq].perMo;
  }, [vol, dsSize, dsFreq]);

  const included = ALLOWANCE[platform][tier];
  const overage = Math.max(0, total - included);
  const cost = overage * CREDIT_PRICE;
  const usedPct = Math.min(100, (Math.min(total, included) / Math.max(total, included, 1)) * 100);
  const overPct = (overage / Math.max(total, included, 1)) * 100;

  return (
    <figure className="credit-calc" aria-label="Interactive HubSpot Credit estimator">
      <figcaption>
        <span className="cc-kicker">Interactive · Estimate a month</span>
      </figcaption>

      {/* headline result */}
      <div className="cc-result">
        <div className="cc-result-num">
          <span className="cc-result-val">{usd(cost)}</span>
          <span className="cc-result-lab">estimated monthly overage</span>
        </div>
        <p className="cc-result-sub">
          {overage > 0
            ? <>{fmt(total)} credits used · {fmt(included)} included · {fmt(overage)} over, at $0.01 each</>
            : <>{fmt(total)} of {fmt(included)} included credits used — nothing over</>}
        </p>
        <div className="cc-bar" role="img" aria-label={`${fmt(total)} used against ${fmt(included)} included`}>
          <div className="cc-bar-inc" style={{ width: `${usedPct}%` }} />
          {overage > 0 && <div className="cc-bar-over" style={{ width: `${overPct}%` }} />}
        </div>
      </div>

      {/* inputs */}
      <div className="cc-plan">
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

      <div className="cc-rows">
        {LINES.map((l) => (
          <SliderRow
            key={l.key}
            label={l.label}
            hint={`${fmt(l.rate)} cr / ${l.one}`}
            value={vol[l.key] || 0}
            max={l.max}
            unit={l.unit}
            onChange={(v) => setVol((s) => ({ ...s, [l.key]: v }))}
          />
        ))}
      </div>

      <div className="cc-ds">
        <div className="cc-row-head">
          <span className="cc-row-label">Data Studio <span className="cc-ds-hint">the usual surprise</span></span>
        </div>
        <div className="cc-segs cc-segs-sm">
          {DS_SIZE.map((s, i) => (
            <button key={s.label} type="button" aria-pressed={dsSize === i} onClick={() => setDsSize(i)}>{s.label}</button>
          ))}
        </div>
        <div className="cc-segs cc-segs-sm">
          {DS_FREQ.map((f, i) => (
            <button key={f.label} type="button" aria-pressed={dsFreq === i} onClick={() => setDsFreq(i)}>{f.label}</button>
          ))}
        </div>
      </div>
    </figure>
  );
}

/** Portals the calculator into the `#credit-calculator` marker near the top of the paper. */
export default function CreditCalculator() {
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => { setHost(document.getElementById('credit-calculator')); }, []);
  if (!host) return null;
  return createPortal(<Calculator />, host);
}
