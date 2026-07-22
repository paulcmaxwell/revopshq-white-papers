import Link from 'next/link';

export default function Wordmark() {
  return (
    <Link href="/" className="wm" aria-label="Revenue Foundations — home">
      <span className="mark" aria-hidden="true" />
      Revenue&nbsp;Foundations
    </Link>
  );
}
