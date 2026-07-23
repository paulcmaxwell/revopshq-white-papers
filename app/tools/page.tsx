import type { Metadata } from 'next';
import UnitEconomicsCalculator from '@/components/UnitEconomicsCalculator';
import MaturityAssessment from '@/components/MaturityAssessment';
import AttributionReadiness from '@/components/AttributionReadiness';

export const metadata: Metadata = {
  title: 'Tools',
  description: 'Open, first-principles calculators for revenue operators. No email wall.',
};

export default function Tools() {
  return (
    <>
      <header className="masthead container">
        <p className="eyebrow">Tools</p>
        <h1>Models you can run, free.</h1>
        <p className="masthead-lede">
          First-principles calculators — no sign-up, no email wall. Change the inputs and watch the
          model move. Built to teach the relationship, not to gate a download.
        </p>
      </header>

      <section className="container tool-block">
        <div className="section-head">
          <h2>Unit economics</h2>
          <span className="count">CAC payback · LTV : CAC</span>
        </div>
        <p className="tool-intro">
          The two numbers that decide whether growth is affordable: how long a customer takes to pay
          back what it cost to acquire them, and how much they return over their life.
        </p>
        <UnitEconomicsCalculator />
      </section>

      <section className="container tool-block">
        <div className="section-head">
          <h2>RevOps maturity</h2>
          <span className="count">4 foundations · 1–5</span>
        </div>
        <p className="tool-intro">
          Rate four foundations — data, process, tooling, insight. Your maturity is gated by the
          weakest one, so the assessment points at the next move rather than the average.
        </p>
        <MaturityAssessment />
      </section>

      <section className="container tool-block">
        <div className="section-head">
          <h2>Attribution readiness</h2>
          <span className="count">10 conditions</span>
        </div>
        <p className="tool-intro">
          Channel-level CPA is only as trustworthy as the attribution beneath it. Check the
          conditions you actually meet; the gaps are what to fix before you reallocate budget.
        </p>
        <AttributionReadiness />
      </section>
    </>
  );
}
