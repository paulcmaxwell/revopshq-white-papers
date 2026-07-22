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
      <div className="tags">
        {paper.tags.slice(0, 4).map((t) => (
          <span className="tag" key={t}>
            {t}
          </span>
        ))}
      </div>
      <div className="meta">
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
