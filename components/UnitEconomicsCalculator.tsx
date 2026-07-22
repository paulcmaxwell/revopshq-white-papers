'use client';

import { useState } from 'react';

// Open, ungated educational tool — unit economics from first principles.
// Neutral chrome per the design system (green budget): no accent on controls.

const usd = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

function Field({
  label, hint, value, min, max, step, suffix, onChange,
}: {
  label: string; hint: string; value: number; min: number; max: number; step: number; suffix: string; onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="ue-field">
      <span className="ue-head">
        <span className="ue-label">{label} <span className="ue-hint">{hint}</span></span>
        <span className="ue-val"><b>{value.toLocaleString('en-US')}</b>{suffix}</span>
      </span>
      <input
        className="ue-slider" type="range" min={min} max={max} step={step} value={value}
        style={{ ['--pct' as string]: `${pct}%` }}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
    </label>
  );
}

export default function UnitEconomicsCalculator() {
  const [acv, setAcv] = useState(12000);
  const [gm, setGm] = useState(75);
  const [cac, setCac] = useState(9000);
  const [churn, setChurn] = useState(12);

  const grossPerYear = acv * (gm / 100);
  const paybackMonths = grossPerYear > 0 ? cac / (grossPerYear / 12) : Infinity;
  const lifetimeYears = churn > 0 ? 100 / churn : Infinity;
  const ltv = grossPerYear * lifetimeYears;
  const ltvCac = cac > 0 ? ltv / cac : Infinity;

  const paybackOk = paybackMonths <= 12;
  const ratioOk = ltvCac >= 3;

  return (
    <div className="ue">
      <div className="ue-grid">
        <div className="ue-inputs">
          <Field label="New ARR per customer" hint="ACV" value={acv} min={1000} max={200000} step={1000} suffix="" onChange={setAcv} />
          <Field label="Gross margin" hint="on that revenue" value={gm} min={10} max={95} step={1} suffix="%" onChange={setGm} />
          <Field label="Customer acquisition cost" hint="fully loaded" value={cac} min={500} max={100000} step={500} suffix="" onChange={setCac} />
          <Field label="Annual logo churn" hint="lower = longer life" value={churn} min={2} max={50} step={1} suffix="%" onChange={setChurn} />
        </div>

        <div className="ue-out">
          <div className="ue-result">
            <span className="ue-result-val">{paybackMonths === Infinity ? '∞' : paybackMonths.toFixed(1)}</span>
            <span className="ue-result-lab">months to pay back CAC</span>
            <span className={`ue-flag ${paybackOk ? 'ok' : 'warn'}`}>{paybackOk ? 'within 12 months' : 'over 12 months'}</span>
          </div>
          <div className="ue-result">
            <span className="ue-result-val">{ltvCac === Infinity ? '∞' : `${ltvCac.toFixed(1)}×`}</span>
            <span className="ue-result-lab">LTV : CAC ratio</span>
            <span className={`ue-flag ${ratioOk ? 'ok' : 'warn'}`}>{ratioOk ? 'at or above 3×' : 'below 3×'}</span>
          </div>
          <dl className="ue-derived">
            <div><dt>Gross profit / customer / year</dt><dd>{usd(grossPerYear)}</dd></div>
            <div><dt>Avg. customer lifetime</dt><dd>{lifetimeYears === Infinity ? '∞' : `${lifetimeYears.toFixed(1)} yrs`}</dd></div>
            <div><dt>Lifetime value (gross)</dt><dd>{ltv === Infinity ? '∞' : usd(ltv)}</dd></div>
          </dl>
        </div>
      </div>

      <div className="ue-math">
        <p><b>The model, in plain terms.</b> A customer is worth their yearly gross profit — ARR × gross margin — for as long as they stay, and they stay <span className="ue-mono">1 ÷ churn</span> years on average.</p>
        <ul>
          <li><span className="ue-mono">Payback = CAC ÷ (annual gross profit ÷ 12)</span> — months of margin to earn back what acquisition cost. Under ~12 is healthy.</li>
          <li><span className="ue-mono">LTV = annual gross profit × lifetime</span>, and <span className="ue-mono">LTV : CAC</span> is the return on an acquisition dollar. 3× or better is the common bar.</li>
        </ul>
        <p className="ue-note">Illustrative — a first-principles model, not a benchmark dataset. Blended inputs hide the channel-level gaps that <a href="/papers/attribution-channel-economics">Attribution &amp; Channel Economics</a> unpacks.</p>
      </div>
    </div>
  );
}
