import Link from 'next/link';

export default function Wordmark() {
  return (
    <Link href="/" className="wm" aria-label="RevOps HQ — home">
      <span className="mark" aria-hidden="true" />
      RevOps&nbsp;HQ
    </Link>
  );
}
