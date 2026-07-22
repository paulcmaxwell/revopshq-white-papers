'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Paper } from '@/content/papers';
import type { Series } from '@/content/series';

const fmtDate = (iso: string) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

export default function LibraryFilter({ papers, series }: { papers: Paper[]; series: Series[] }) {
  const [q, setQ] = useState('');
  const [ser, setSer] = useState<string>('all');

  // series that actually have papers, for the chip row
  const activeSeries = useMemo(
    () => series.filter((s) => papers.some((p) => p.series === s.slug)),
    [papers, series],
  );

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return papers.filter((p) => {
      if (ser !== 'all' && p.series !== ser) return false;
      if (!needle) return true;
      const hay = [p.title, p.deck, p.abstract, p.category, p.type, ...p.tags].join(' ').toLowerCase();
      return hay.includes(needle);
    });
  }, [papers, q, ser]);

  return (
    <>
      <div className="lib-controls">
        <div className="lib-search">
          <span className="lib-search-icon" aria-hidden="true">⌕</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search titles, topics, tags…"
            aria-label="Search papers"
          />
        </div>
        <div className="lib-chips" role="group" aria-label="Filter by series">
          <button type="button" aria-pressed={ser === 'all'} onClick={() => setSer('all')}>All</button>
          {activeSeries.map((s) => (
            <button key={s.slug} type="button" aria-pressed={ser === s.slug} onClick={() => setSer(s.slug)}>
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <p className="lib-empty">No papers match “{q}”.</p>
      ) : (
        <ol className="contents">
          {results.map((p) => (
            <li key={p.slug}>
              <Link href={`/papers/${p.slug}`}>
                <span className="ct-no">No.&nbsp;{p.number}</span>
                <span className="ct-main">
                  <span className="ct-title">{p.title}</span>
                  <span className="ct-deck">{p.deck}</span>
                  <span className="ct-meta">
                    {p.category} <span aria-hidden="true">·</span> {fmtDate(p.date)}{' '}
                    <span aria-hidden="true">·</span> {p.readingMinutes} min
                  </span>
                </span>
                <span className="ct-arr" aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
