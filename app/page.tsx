import Link from 'next/link';
import { papers } from '@/content/papers';
import { series as allSeries, seriesBySlug } from '@/content/series';
import { authorByName } from '@/content/authors';
import { JOURNAL, volIssue, issueLabel } from '@/lib/journal';

function Byline({ names }: { names: string[] }) {
  return (
    <>
      By{' '}
      {names.map((name, i) => {
        const a = authorByName(name);
        const node = a?.linkedin ? (
          <a href={a.linkedin} target="_blank" rel="noopener noreferrer">{name}</a>
        ) : (
          <span>{name}</span>
        );
        return (
          <span key={name}>
            {i > 0 && (i === names.length - 1 ? ' and ' : ', ')}
            {node}
            {a?.title ? <span className="byline-role"> ({a.title})</span> : null}
          </span>
        );
      })}
    </>
  );
}

export default function Home() {
  const sorted = [...papers].sort((a, b) => b.date.localeCompare(a.date));
  const featured = sorted[0];
  const rest = sorted.slice(1);
  const fmt = (iso: string) =>
    new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

  return (
    <>
      {/* masthead */}
      <section className="container masthead">
        <div className="mh-kicker">
          <span>{JOURNAL.subtitle}</span>
          {featured && <span className="k-date">{volIssue(featured.date)} · {issueLabel(featured.date)}</span>}
        </div>
        <h1 className="mh-title">Revenue Foundations</h1>
        <p className="mh-desc">
          Field research and applied analysis for the people who build and run revenue systems.
          An independent research project from{' '}
          <a href="https://revopshq.com" target="_blank" rel="noopener noreferrer">RevOps HQ</a> —
          free to read, cite, and share.
        </p>
      </section>

      {/* featured lead paper */}
      {featured && (
        <section className="container featured" id="papers">
          <div className="featured-grid">
            <div className="featured-rail">
              <span className="featured-label">Featured White Paper</span>
              <span className="featured-no">No.&nbsp;{featured.number}</span>
              <span className="featured-meta">
                <strong>{seriesBySlug(featured.series)?.name}</strong><br />
                {featured.type} &middot; {featured.readingMinutes} min &middot; {issueLabel(featured.date)}
              </span>
            </div>
            <div className="featured-body">
              <h2 className="featured-title">
                <Link href={`/papers/${featured.slug}`}>{featured.title}</Link>
              </h2>
              <p className="lead-abstract">{featured.abstract}</p>
              <p className="lead-byline"><Byline names={featured.authors} /></p>
              <div className="lead-actions">
                <Link className="read-link" href={`/papers/${featured.slug}`}>
                  Read the paper <span className="arr" aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* more white papers */}
      {rest.length > 0 && (
        <section className="container">
          <div className="section-head">
            <h2>More White Papers</h2>
            <span className="count">{rest.length}</span>
          </div>
          <ol className="index-list">
            {rest.map((p) => (
              <li key={p.slug}>
                <Link href={`/papers/${p.slug}`} className="index-row link">
                  <span className="index-num">No. {p.number}</span>
                  <span className="index-main">
                    <span className="index-title">{p.title}</span>
                    <span className="index-sub">{seriesBySlug(p.series)?.name} · {p.tags.slice(0, 3).join(' · ')}</span>
                  </span>
                  <span className="index-aside">{p.type} · {fmt(p.date)}</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* series */}
      <section className="container" id="series">
        <div className="section-head">
          <h2>Series</h2>
          <span className="count">Standing lines of inquiry</span>
        </div>
        <ul className="index-list">
          {allSeries.map((s) => {
            const n = papers.filter((p) => p.series === s.slug).length;
            return (
              <li className="index-row" key={s.slug}>
                <span className="index-roman">{s.roman}</span>
                <span className="index-main">
                  <span className="index-title">{s.name}</span>{' '}
                  <span className="index-tag">— {s.tagline}</span>
                  <span className="index-sub">{s.description}</span>
                </span>
                <span className="index-aside">{n > 0 ? `${n} paper${n > 1 ? 's' : ''}` : 'Forthcoming'}</span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* tools */}
      <section className="container" id="tools">
        <div className="section-head">
          <h2>Tools &amp; Downloads</h2>
          <span className="count">Forthcoming</span>
        </div>
        <p className="tools-note">
          <strong>Calculators, checklists, and assessments</strong> built from the same research —
          a CAC-payback calculator, an attribution-readiness checklist, and a RevOps maturity
          assessment are in progress.
        </p>
      </section>

      {/* colophon */}
      <section className="container colophon-section">
        <p className="colophon-line">
          <strong>Revenue Foundations</strong> is an independent research project from{' '}
          <a href="https://revopshq.com" target="_blank" rel="noopener noreferrer">RevOps HQ</a>,
          written by practitioners for the people who build and run revenue systems.
        </p>
      </section>
    </>
  );
}
