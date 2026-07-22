import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
      <p className="eyebrow" style={{ justifyContent: 'center' }}>Error 404</p>
      <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2.5rem', fontWeight: 600, margin: '0.75rem 0 1rem', letterSpacing: '-0.02em' }}>
        This page isn’t in the library.
      </h1>
      <p style={{ color: 'var(--ink-2)', maxWidth: '38ch', margin: '0 auto 1.75rem' }}>
        The white paper you’re looking for may have moved or been renamed.
      </p>
      <Link className="btn btn-primary" href="/">
        Back to the library
      </Link>
    </section>
  );
}
