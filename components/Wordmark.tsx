import Link from 'next/link';

export default function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="wm" aria-label="Revenue Foundations — home">
      <span className="mark" aria-hidden="true" />
      <span className="wm-name">Revenue&nbsp;Foundations</span>
    </Link>
  );
}
