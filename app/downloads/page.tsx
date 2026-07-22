import type { Metadata } from 'next';
import Link from 'next/link';
import BookCover from '@/components/BookCover';
import { papers } from '@/content/papers';

export const metadata: Metadata = {
  title: 'Downloads',
  description: 'Every Revenue Foundations paper as a free, email-gated PDF.',
};

export default function Downloads() {
  const sorted = [...papers].sort((a, b) => b.date.localeCompare(a.date) || b.number.localeCompare(a.number));

  return (
    <>
      <header className="masthead container">
        <p className="eyebrow">Downloads</p>
        <h1>The papers, as PDFs.</h1>
        <p className="masthead-lede">
          Every Revenue Foundations paper is free to download — a clean, citable PDF for the reference
          shelf or the deal room. One email unlocks all of them.
        </p>
      </header>

      <section className="container" id="library">
        <div className="section-head">
          <h2>White Papers</h2>
          <span className="count">{papers.length} {papers.length === 1 ? 'title' : 'titles'}</span>
        </div>
        <div className="shelf">
          {sorted.map((p) => (
            <Link key={p.slug} href={`/papers/${p.slug}?gate=1`} className="shelf-item">
              <BookCover paper={p} />
              <span className="shelf-meta">
                <span className="shelf-title">{p.title}</span>
                <span className="shelf-cta">Download PDF <span aria-hidden="true">↓</span></span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container" id="case-studies">
        <div className="section-head">
          <h2>Case Studies</h2>
          <span className="count">Forthcoming</span>
        </div>
        <p className="cs-forthcoming">
          Field write-ups of real engagements — same format, same shelf. In progress.
        </p>
      </section>
    </>
  );
}
