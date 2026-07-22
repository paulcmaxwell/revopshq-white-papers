import Link from 'next/link';
import { papers } from '@/content/papers';
import { series as allSeries } from '@/content/series';
import { volIssue } from '@/lib/journal';
import LibraryFilter from '@/components/LibraryFilter';
import { authorByName } from '@/content/authors';

function Byline({ authors }: { authors: string[] }) {
  return (
    <>
      {authors.map((name, i) => {
        const a = authorByName(name);
        return (
          <span key={name}>
            {i > 0 && <span aria-hidden="true"> &amp; </span>}
            {a?.linkedin ? (
              <a href={a.linkedin} target="_blank" rel="noopener noreferrer" className="byline-link">{name}</a>
            ) : (
              name
            )}
          </span>
        );
      })}
    </>
  );
}

const fmtDate = (iso: string) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

export default function Home() {
  const sorted = [...papers].sort((a, b) => b.date.localeCompare(a.date) || b.number.localeCompare(a.number));
  const lead =
    sorted.find((p) => p.featured) ?? sorted[0];

  return (
    <>
      {/* ---- masthead ---- */}
      <header className="masthead container">
        <p className="eyebrow">Revenue Foundations</p>
        <h1>Applied research on the systems that move revenue.</h1>
        <p className="masthead-lede">
          Field notes from the work — HubSpot architecture, integration design, attribution, and the
          trade-offs that only surface at production volume. An independent research project from{' '}
          <a href="https://revopshq.com" target="_blank" rel="noopener noreferrer">RevOps&nbsp;HQ</a> —
          free to read, cite, and share.
        </p>
        <p className="masthead-meta">
          <span>{volIssue(sorted[0].date)}</span>
          <span aria-hidden="true">·</span>
          <span>{papers.length} {papers.length === 1 ? 'paper' : 'papers'}</span>
          <span aria-hidden="true">·</span>
          <span>Published by RevOps&nbsp;HQ</span>
        </p>
      </header>

      {/* ---- featured lead ---- */}
      {lead && (
        <section className="container lead" aria-labelledby="lead-title">
          <Link href={`/papers/${lead.slug}`} className="lead-cover" aria-hidden="true" tabIndex={-1}>
            <span className="lc-top">
              <span className="lc-no">No.&nbsp;{lead.number}</span>
              <span className="lc-mark" />
            </span>
            <span className="lc-series">{lead.category}</span>
            <span className="lc-title">{lead.title}</span>
            <span className="lc-foot">{volIssue(lead.date)}</span>
          </Link>

          <div className="lead-body">
            <p className="eyebrow">Featured · {lead.type}</p>
            <h2 id="lead-title">
              <Link href={`/papers/${lead.slug}`}>{lead.title}</Link>
            </h2>
            <p className="lead-deck">{lead.abstract}</p>
            <p className="lead-byline">
              Words by <Byline authors={lead.authors} /> <span aria-hidden="true">—</span> {lead.readingMinutes} min
              read <span aria-hidden="true">—</span> {fmtDate(lead.date)}
            </p>
            <Link href={`/papers/${lead.slug}`} className="lead-read">
              Read the paper <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      )}

      {/* ---- contents index ---- */}
      <section className="container" id="library">
        <div className="section-head">
          <h2>Contents</h2>
          <span className="count">{papers.length} {papers.length === 1 ? 'title' : 'titles'}</span>
        </div>
        <LibraryFilter papers={sorted} series={allSeries} />
      </section>

      {/* ---- series index ---- */}
      <section className="container" id="series">
        <div className="section-head">
          <h2>Series</h2>
          <span className="count">{allSeries.length} standing lines of inquiry</span>
        </div>
        <ul className="series-list">
          {allSeries.map((s) => {
            const n = papers.filter((p) => p.series === s.slug).length;
            return (
              <li className="series-row" key={s.slug}>
                <span className="sr-roman">{s.roman}</span>
                <span className="sr-main">
                  <span className="sr-name">{s.name}</span>
                  <span className="sr-tag"> — {s.tagline}</span>
                </span>
                <span className="sr-count">{n > 0 ? `${n} paper${n > 1 ? 's' : ''}` : 'Forthcoming'}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
