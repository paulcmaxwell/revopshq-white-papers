'use client';

import { useState } from 'react';

// Open, ungated self-assessment. Rate four foundations 1–5; get a stage and the
// dimension holding you back. Neutral chrome per the design system.

type Dim = { key: string; name: string; blurb: string; levels: string[] };

const DIMS: Dim[] = [
  {
    key: 'data', name: 'Data foundation', blurb: 'how trustworthy the underlying data is',
    levels: [
      'Spreadsheets and manual entry; duplicates everywhere',
      'A CRM of record, but dirty and inconsistent',
      'Defined fields and owners; dedup is occasional',
      'Governed properties, routine dedup, few gaps',
      'One governed source of truth, continuously maintained',
    ],
  },
  {
    key: 'process', name: 'Process & lifecycle', blurb: 'how consistently work actually runs',
    levels: [
      'Ad hoc and tribal; it lives in people’s heads',
      'Written down but not followed',
      'Defined stages and lifecycle, loosely enforced',
      'Enforced by required fields and gates',
      'Automated, measured, and improved on a cadence',
    ],
  },
  {
    key: 'tooling', name: 'Tooling & integration', blurb: 'how connected the stack is',
    levels: [
      'Disconnected point tools; copy-paste between them',
      'A core CRM with manual exports around it',
      'Some native integrations; gaps filled by hand',
      'Integrated stack, mostly one source of truth',
      'Orchestrated integrations with monitoring and retries',
    ],
  },
  {
    key: 'insight', name: 'Measurement & insight', blurb: 'how much the numbers can be trusted',
    levels: [
      'Vanity metrics; no one trusts the dashboard',
      'Basic reporting, argued over monthly',
      'Consistent definitions; reporting is believed',
      'Attribution and unit economics inform decisions',
      'Forecasts and models that reliably drive action',
    ],
  },
];

const STAGES = ['Nascent', 'Developing', 'Defined', 'Managed', 'Optimized'];

export default function MaturityAssessment() {
  const [scores, setScores] = useState<Record<string, number>>({ data: 2, process: 2, tooling: 2, insight: 2 });

  const avg = DIMS.reduce((n, d) => n + scores[d.key], 0) / DIMS.length;
  const stage = STAGES[Math.min(4, Math.max(0, Math.round(avg) - 1))];
  const weakest = [...DIMS].sort((a, b) => scores[a.key] - scores[b.key])[0];

  return (
    <div className="ma">
      <div className="ma-grid">
        <div className="ma-inputs">
          {DIMS.map((d) => (
            <div className="ma-dim" key={d.key}>
              <div className="ma-dim-head">
                <span className="ma-dim-name">{d.name} <span className="ma-dim-blurb">{d.blurb}</span></span>
                <span className="ma-dim-score">{scores[d.key]}/5</span>
              </div>
              <div className="ma-scale" role="radiogroup" aria-label={d.name}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={scores[d.key] === n}
                    className={scores[d.key] === n ? 'on' : undefined}
                    onClick={() => setScores((s) => ({ ...s, [d.key]: n }))}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <p className="ma-level">{d.levels[scores[d.key] - 1]}</p>
            </div>
          ))}
        </div>

        <div className="ma-out">
          <div className="ma-result">
            <span className="ma-result-lab">Overall stage</span>
            <span className="ma-result-val">{stage}</span>
            <span className="ma-result-sub">{avg.toFixed(1)} / 5 across four foundations</span>
          </div>
          <div className="ma-bars">
            {DIMS.map((d) => (
              <div className="ma-bar-row" key={d.key}>
                <span className="ma-bar-lab">{d.name}</span>
                <span className="ma-bar-track"><span className="ma-bar-fill" style={{ width: `${(scores[d.key] / 5) * 100}%` }} /></span>
              </div>
            ))}
          </div>
          <p className="ma-callout">
            Your weakest foundation is <b>{weakest.name.toLowerCase()}</b>. Maturity is gated by the
            lowest one — that’s the next move, not the highest one.
          </p>
        </div>
      </div>
      <p className="ue-note">
        A self-assessment, not a score to defend — the value is seeing which foundation lags. The
        pattern shows up across the <a href="/#case-studies">case studies</a>: fix the foundation first.
      </p>
    </div>
  );
}
