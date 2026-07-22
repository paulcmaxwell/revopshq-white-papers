import Link from 'next/link';
import CoverArt from '@/components/CoverArt';
import { papers } from '@/content/papers';
import { series as allSeries } from '@/content/series';
import { authorByName } from '@/content/authors';
import { seriesBySlug } from '@/content/series';

function Byline({ names }: { names: string[] }) {
  return (
    <>
      Words by{' '}
      {names.map((name, i) => {
        const a = authorByName(name);
        return (
          <span key={name}>
            {i > 0 && (i === names.length - 1 ? ' & ' : ', ')}
            {a?.linkedin ? (
              <a href={a.linkedin} target="_blank" rel="noopener noreferrer">{name}</a>
            ) : (
              name
            )}
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
    <div className="container">
      <p className="intro">
        Field research for the people who build and run revenue systems. An independent research
        project from <a href="https://revopshq.com" target="_blank" rel="noopener noreferrer">RevOps HQ</a> —
        free to read, cite, and share.
      </p>

      {/* feature */}
      {featured && (
        <section className="feature" id="papers">
          <div className="fgrid">
            <figure className="art">
              <div className="capbar">
                <span>Featured — No. {featured.number}</span>
                <span>{seriesBySlug(featured.series)?.name}</span>
              </div>
              <div className="canvas-wrap"><CoverArt /></div>
            </figure>
            <div className="fcap">
              <div className="kick">
                <span className="tag">Featured</span>
                <span className="kseries">{featured.type}</span>
              </div>
              <h1 className="ftitle"><Link href={`/papers/${featured.slug}`}>{featured.title}</Link></h1>
              <p className="byline"><Byline names={featured.authors} /> — {featured.readingMinutes} min — {fmt(featured.date)}</p>
              <p className="dek">{featured.abstract}</p>
              <Link className="readmore" href={`/papers/${featured.slug}`}>Read the paper →</Link>
            </div>
          </div>
        </section>
      )}

      {/* index */}
      <div className="cols">
        <div>
          <div className="col-head"><span>{rest.length > 0 ? 'More' : 'Recent'}</span><span>White Papers</span></div>
          {rest.length > 0 ? (
            rest.map((p) => (
              <Link key={p.slug} href={`/papers/${p.slug}`} className="item">
                <div className="it-t">{p.title}</div>
                <div className="it-b"><Byline names={p.authors} /> — {p.type} — {p.readingMinutes} min</div>
                <div className="it-d">{p.deck}</div>
              </Link>
            ))
          ) : (
            <p className="tools-note">More white papers are on the way — one new title per issue.</p>
          )}
        </div>
        <div id="series">
          <div className="col-head"><span>Series</span><span>Standing lines of inquiry</span></div>
          {allSeries.map((s) => {
            const n = papers.filter((p) => p.series === s.slug).length;
            return (
              <div className="srow" key={s.slug}>
                <span className="rn">{s.roman}</span>
                <span><span className="sn">{s.name}</span> <span className="sg">— {s.tagline.replace(/\.$/, '').toLowerCase()}</span></span>
                <span className="sc">{n > 0 ? `${n} paper${n > 1 ? 's' : ''}` : 'Soon'}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* tools */}
      <section id="tools">
        <div className="col-head" style={{ marginTop: '1.5rem' }}><span>Tools &amp; Downloads</span><span>Forthcoming</span></div>
        <p className="tools-note">
          <strong>Calculators, checklists, and assessments</strong> built from the same research —
          a CAC-payback calculator, an attribution-readiness checklist, and a RevOps maturity
          assessment are in progress.
        </p>
      </section>

      {/* colophon */}
      <section className="colophon-section">
        <p className="colophon-line">
          <strong>Revenue Foundations</strong> is an independent research project from{' '}
          <a href="https://revopshq.com" target="_blank" rel="noopener noreferrer">RevOps HQ</a>,
          written by practitioners for the people who build and run revenue systems.
        </p>
      </section>
    </div>
  );
}
