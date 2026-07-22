import Link from 'next/link';
import type { Paper } from '@/content/papers';
import { seriesBySlug } from '@/content/series';

const fmtDate = (iso: string) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

export default function PaperCard({ paper }: { paper: Paper }) {
  const s = seriesBySlug(paper.series);
  return (
    <Link href={`/papers/${paper.slug}`} className="card">
      <div className="top">
        <span className="num">No. {paper.number}</span>
        <span className="cat">{s?.name ?? 'Research'}</span>
      </div>
      <h3>{paper.title}</h3>
      <p className="dek">{paper.abstract}</p>
      <p className="card-topics">{paper.tags.slice(0, 5).join('  ·  ')}</p>
      <div className="meta">
        <span className="meta-type">{paper.type}</span>
        <span aria-hidden="true">·</span>
        <span>{fmtDate(paper.date)}</span>
        <span aria-hidden="true">·</span>
        <span>{paper.readingMinutes} min</span>
        <span className="go">
          Read <span className="arr" aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
