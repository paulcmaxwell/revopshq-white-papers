'use client';

import { useState } from 'react';

// Open, ungated readiness check — the conditions channel-level CPA depends on.
// Neutral chrome per the design system.

const ITEMS: { key: string; text: string }[] = [
  { key: 'mta', text: 'Multi-touch attribution is in place — not last-touch only' },
  { key: 'window', text: 'The attribution window matches the sales motion (≈90d SMB, 180–365d enterprise)' },
  { key: 'spend', text: 'Marketing spend is captured per channel, consistently' },
  { key: 'cost', text: 'Cost basis is defined (program-only vs. fully-loaded) and applied uniformly' },
  { key: 'join', text: 'Closed-won revenue is joined back to its source' },
  { key: 'utm', text: 'Source / UTM tracking is enforced at the point of capture' },
  { key: 'offline', text: 'Offline and sales touches are logged, not just digital' },
  { key: 'dedup', text: 'Deduplication keeps one contact per person, so touches aren’t split' },
  { key: 'doc', text: 'The methodology is documented next to the numbers' },
  { key: 'owner', text: 'Someone owns the attribution model and reviews it on a cadence' },
];

const tierFor = (n: number) => (n >= 8 ? 'Ready' : n >= 5 ? 'Partial' : 'Not ready');

export default function AttributionReadiness() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const score = ITEMS.filter((i) => checked[i.key]).length;
  const gaps = ITEMS.filter((i) => !checked[i.key]);
  const tier = tierFor(score);

  return (
    <div className="ar">
      <div className="ar-grid">
        <ul className="ar-list">
          {ITEMS.map((i) => (
            <li key={i.key}>
              <button
                type="button"
                role="checkbox"
                aria-checked={!!checked[i.key]}
                className={checked[i.key] ? 'on' : undefined}
                onClick={() => setChecked((c) => ({ ...c, [i.key]: !c[i.key] }))}
              >
                <span className="ar-box" aria-hidden="true">{checked[i.key] ? '✓' : ''}</span>
                <span className="ar-text">{i.text}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="ar-out">
          <div className="ar-result">
            <span className="ar-result-lab">Readiness</span>
            <span className="ar-result-val">{tier}</span>
            <span className="ar-result-sub">{score} / {ITEMS.length} conditions met</span>
          </div>
          <div className="ar-meter"><span className="ar-meter-fill" style={{ width: `${(score / ITEMS.length) * 100}%` }} /></div>
          {gaps.length > 0 ? (
            <div className="ar-gaps">
              <span className="ar-gaps-lab">Close these before you trust the CPA:</span>
              <ul>{gaps.slice(0, 6).map((g) => <li key={g.key}>{g.text}</li>)}</ul>
              {gaps.length > 6 && <span className="ar-more">+{gaps.length - 6} more</span>}
            </div>
          ) : (
            <p className="ar-done">Every condition met — your channel-level CPA can carry a budget decision.</p>
          )}
        </div>
      </div>
      <p className="ue-note">
        Attribution is the layer channel CPA rides on; miss these and the number quietly misprices
        every channel. The reasoning is in <a href="/papers/attribution-channel-economics">Attribution &amp; Channel Economics</a>.
      </p>
    </div>
  );
}
