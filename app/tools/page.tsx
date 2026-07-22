import type { Metadata } from 'next';
import UnitEconomicsCalculator from '@/components/UnitEconomicsCalculator';

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
    </>
  );
}
