import PaperCard from '@/components/PaperCard';
import { papers } from '@/content/papers';
import { series as allSeries } from '@/content/series';

export default function Home() {
  const sorted = [...papers].sort((a, b) => b.date.localeCompare(a.date));
  const totalPages = papers.reduce((n, p) => n + p.pages, 0);

  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="eyebrow">Revenue Foundations · Research</p>
          <h1>Applied research on revenue systems and operations.</h1>
          <p>
            Field notes from the work — HubSpot architecture, integration design, and the trade-offs
            that only show up at production volume. Written for the people who have to build it, and
            the people who have to sell it.
          </p>
          <div className="stats">
            <div className="stat">
              <b>{papers.length}</b>
              <span>{papers.length === 1 ? 'Paper' : 'Papers'}</span>
            </div>
            <div className="stat">
              <b>{totalPages}</b>
              <span>Pages</span>
            </div>
            <div className="stat">
              <b>Free</b>
              <span>PDF downloads</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container" id="library">
        <div className="section-head">
          <h2>The Library</h2>
          <span className="count">
            {papers.length} {papers.length === 1 ? 'title' : 'titles'}
          </span>
        </div>
        <div className="lib-grid">
          {sorted.map((p) => (
            <PaperCard paper={p} key={p.slug} />
          ))}
        </div>
      </section>

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
