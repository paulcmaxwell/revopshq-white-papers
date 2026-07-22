'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

// ============================================================
// Interactive companion to White Paper No. 02 (Attribution & Channel
// Economics). Web-only: portals into an #attribution-simulator marker inside
// the static paper body, so the PDF/print artifact is unaffected.
// One fixed sample B2B journey; switch the model to watch credit — and each
// channel's resulting CPA — move. Fake but realistic data.
// ============================================================

type Touch = { channel: string; day: number; spend: number; role?: 'first' | 'lead' | 'last' };

// A typical enterprise converting path (fake). spend = program/team cost booked
// against this channel over a period that produced CONVERSIONS conversions.
const JOURNEY: Touch[] = [
  { channel: 'Paid Search', day: 0, spend: 210_000, role: 'first' },
  { channel: 'Content / Blog', day: 6, spend: 90_000 },
  { channel: 'Webinar', day: 21, spend: 60_000, role: 'lead' },
  { channel: 'Email Nurture', day: 38, spend: 15_000 },
  { channel: 'Sales Demo', day: 52, spend: 120_000, role: 'last' },
];
const CONVERSIONS = 100;

const MODELS = [
  { key: 'first', name: 'First-touch', desc: '100% of the credit to the first interaction. Flatters awareness channels; blind to everything that actually closes the deal.' },
  { key: 'last', name: 'Last-touch', desc: '100% to the final touch before conversion. Flatters closers; erases the demand that created the opportunity.' },
  { key: 'linear', name: 'Linear', desc: 'Equal credit to every touch. Even-handed, but it underweights the peak-influence moments.' },
  { key: 'decay', name: 'Time-decay', desc: 'Credit rises toward the conversion (7-day half-life). Usually the most defensible single-model default.' },
  { key: 'position', name: 'Position (U)', desc: '40% to the first touch, 40% to the last, 20% split across the middle. Rewards demand creation and closing.' },
  { key: 'w', name: 'W-shaped', desc: '30% each to first touch, lead creation, and last touch; 10% split across the rest. Built for long B2B cycles.' },
] as const;
type ModelKey = (typeof MODELS)[number]['key'];

function credits(model: ModelKey): number[] {
  const n = JOURNEY.length;
  const conv = JOURNEY[n - 1].day;
  let w = JOURNEY.map(() => 0);
  switch (model) {
    case 'first': w[0] = 1; break;
    case 'last': w[n - 1] = 1; break;
    case 'linear': w = JOURNEY.map(() => 1 / n); break;
    case 'decay': {
      const hl = 7;
      const raw = JOURNEY.map((t) => Math.pow(2, -(conv - t.day) / hl));
      const s = raw.reduce((a, b) => a + b, 0);
      w = raw.map((x) => x / s);
      break;
    }
    case 'position': {
      w[0] = 0.4; w[n - 1] = 0.4;
      const mid = n - 2;
      for (let i = 1; i < n - 1; i++) w[i] = 0.2 / mid;
      break;
    }
    case 'w': {
      const leadIdx = JOURNEY.findIndex((t) => t.role === 'lead');
      const key = new Set([0, n - 1, leadIdx >= 0 ? leadIdx : Math.floor(n / 2)]);
      key.forEach((i) => { w[i] += 0.3; });
      const used = [...key].reduce((a, i) => a + w[i], 0);
      const rest = [...Array(n).keys()].filter((i) => !key.has(i));
      if (rest.length) rest.forEach((i) => { w[i] = (1 - used) / rest.length; });
      break;
    }
  }
  return w;
}

const usd = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const pct = (f: number) => `${(f * 100).toFixed(f > 0 && f < 0.001 ? 2 : f < 0.1 ? 1 : 0)}%`;
// emerald ramp by touch order (time → depth), theme-aware via color-mix
const shade = (i: number, n: number) =>
  `color-mix(in srgb, var(--accent) ${Math.round(38 + (i / (n - 1)) * 62)}%, var(--paper-2))`;

function Simulator() {
  const [model, setModel] = useState<ModelKey>('last');
  const w = useMemo(() => credits(model), [model]);
  const activeDesc = MODELS.find((m) => m.key === model)!.desc;

  return (
    <figure className="attr-sim" aria-label="Interactive attribution-model simulator">
      <figcaption>
        <span className="as-kicker">Interactive · One journey, six models</span>
        <span className="as-note">Same converting path and the same spend. Switch the model and watch the credit — and every channel’s CPA — move.</span>
      </figcaption>

      <div className="as-switch" role="tablist" aria-label="Attribution model">
        {MODELS.map((m) => (
          <button key={m.key} type="button" role="tab" aria-selected={model === m.key} onClick={() => setModel(m.key)}>
            {m.name}
          </button>
        ))}
      </div>
      <p className="as-desc">{activeDesc}</p>

      {/* credit bar */}
      <div className="as-bar" role="img" aria-label={`Credit split under the ${model} model`}>
        {JOURNEY.map((t, i) =>
          w[i] > 0.004 ? (
            <div key={t.channel} className="as-seg" style={{ width: `${w[i] * 100}%`, background: shade(i, JOURNEY.length) }} title={`${t.channel} — ${pct(w[i])}`}>
              {w[i] >= 0.1 && <span>{pct(w[i])}</span>}
            </div>
          ) : null,
        )}
      </div>

      {/* per-channel table: credit -> attributed conversions -> CPA */}
      <table className="as-table">
        <thead>
          <tr>
            <th scope="col">Channel</th>
            <th scope="col" className="as-r">Spend</th>
            <th scope="col" className="as-r">Credit</th>
            <th scope="col" className="as-r">Attrib. conv.</th>
            <th scope="col" className="as-r">CPA</th>
          </tr>
        </thead>
        <tbody>
          {JOURNEY.map((t, i) => {
            const conv = w[i] * CONVERSIONS;
            const cpa = conv > 0 ? t.spend / conv : null;
            return (
              <tr key={t.channel}>
                <th scope="row">
                  <span className="as-dot" style={{ background: shade(i, JOURNEY.length) }} aria-hidden="true" />
                  {t.channel}
                  <span className="as-day">day {t.day}</span>
                </th>
                <td className="as-r">{usd(t.spend)}</td>
                <td className="as-r">{pct(w[i])}</td>
                <td className="as-r">{conv > 0 ? conv.toFixed(conv < 10 ? 1 : 0) : '—'}</td>
                <td className="as-r as-cpa">{cpa ? usd(cpa) : '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="as-foot">
        {usd(JOURNEY.reduce((n, t) => n + t.spend, 0))} of spend · {CONVERSIONS} conversions · the blended CAC is{' '}
        {usd(JOURNEY.reduce((n, t) => n + t.spend, 0) / CONVERSIONS)} in every model — only the per-channel CPA moves.
      </p>
    </figure>
  );
}

/** Portals the simulator into the `#attribution-simulator` marker in the paper body. */
export default function AttributionSimulator() {
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => { setHost(document.getElementById('attribution-simulator')); }, []);
  if (!host) return null;
  return createPortal(<Simulator />, host);
}
