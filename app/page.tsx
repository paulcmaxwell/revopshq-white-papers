import PaperCard from '@/components/PaperCard';
import { papers } from '@/content/papers';

export default function Home() {
  const sorted = [...papers].sort((a, b) => b.date.localeCompare(a.date));
  const totalPages = papers.reduce((n, p) => n + p.pages, 0);

  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="eyebrow">Revenue Foundations · Research</p>
          <h1>White papers on revenue systems that actually ship.</h1>
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
    </>
  );
}
