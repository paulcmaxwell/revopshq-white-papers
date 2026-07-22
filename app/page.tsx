import Link from 'next/link';
import PaperCard from '@/components/PaperCard';
import VolumetricBackground from '@/components/VolumetricBackground';
import { papers } from '@/content/papers';
import { series as allSeries } from '@/content/series';
import { JOURNAL, groupByIssue, volIssue, issueLabel } from '@/lib/journal';

export default function Home() {
  const sorted = [...papers].sort((a, b) => b.date.localeCompare(a.date));
  const issues = groupByIssue(sorted);
  const current = issues[0];

  return (
    <>
      {/* ---------- masthead over the volumetric field ---------- */}
      <section className="masthead-hero">
        <VolumetricBackground className="vbg" />
        <div className="container mh-inner">
          <p className="mh-eyebrow">{JOURNAL.subtitle}</p>
          <h1 className="mh-title">Revenue&nbsp;Foundations</h1>
          <p className="mh-blurb">
            Field research and applied analysis for revenue operators — the systems, the economics,
            and the trade-offs behind how modern revenue teams actually run.
          </p>
          {current && (
            <div className="mh-flag">
              <span className="mh-flag-vol">{volIssue(current.date)}</span>
              <span className="mh-flag-dot" aria-hidden="true">·</span>
              <span>{issueLabel(current.date)}</span>
              <span className="mh-flag-dot" aria-hidden="true">·</span>
              <span className="mh-flag-count">
                {current.items.length} {current.items.length === 1 ? 'article' : 'articles'}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ---------- current issue ---------- */}
      {current && (
        <section className="container" id="issue">
          <div className="section-head">
            <h2>In This Issue</h2>
            <span className="count">
              {volIssue(current.date)} · {issueLabel(current.date)}
            </span>
          </div>
          <div className="lib-grid">
            {current.items.map((p) => (
              <PaperCard paper={p} key={p.slug} />
            ))}
          </div>
        </section>
      )}

      {/* ---------- departments / series ---------- */}
      <section className="container" id="series">
        <div className="section-head">
          <h2>Series</h2>
          <span className="count">{allSeries.length} standing lines of inquiry</span>
        </div>
        <div className="dept-grid">
          {allSeries.map((s) => {
            const n = papers.filter((p) => p.series === s.slug).length;
            return (
              <div className="dept" key={s.slug}>
                <div className="dept-top">
                  <span className="dept-roman">{s.roman}</span>
                  <span className="dept-count">{n > 0 ? `${n} published` : 'Forthcoming'}</span>
                </div>
                <h3>{s.name}</h3>
                <p className="dept-tag">{s.tagline}</p>
                <p className="dept-desc">{s.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- archive ---------- */}
      <section className="container" id="archive">
        <div className="section-head">
          <h2>Archive</h2>
          <span className="count">{issues.length} {issues.length === 1 ? 'issue' : 'issues'}</span>
        </div>
        <ol className="archive-list">
          {issues.map((iss) => (
            <li className="archive-row" key={iss.key}>
              <span className="archive-vol">{volIssue(iss.date)}</span>
              <span className="archive-month">{issueLabel(iss.date)}</span>
              <span className="archive-titles">
                {iss.items.map((p, i) => (
                  <span key={p.slug}>
                    {i > 0 && <span className="archive-sep"> · </span>}
                    <Link href={`/papers/${p.slug}`}>{p.title}</Link>
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- colophon / funding ---------- */}
      <section className="container">
        <div className="colophon">
          <div>
            <p className="eyebrow">About the journal</p>
            <p className="colophon-body">
              <strong>Revenue Foundations</strong> is an independent research project funded by{' '}
              <a href="https://revopshq.com" target="_blank" rel="noopener noreferrer">RevOps HQ</a>.
              Articles are written by practitioners for the people who build and run revenue systems —
              free to read, cite, and share.
            </p>
          </div>
          <div className="colophon-mark" aria-hidden="true">
            <span className="mark-lg" />
          </div>
        </div>
      </section>
    </>
  );
}
