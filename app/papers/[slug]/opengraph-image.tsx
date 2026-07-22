import { ImageResponse } from 'next/og';
import { anyBySlug, papers, caseStudies } from '@/content/papers';
import { volIssue } from '@/lib/journal';

export const alt = 'Revenue Foundations paper';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Prerender one card per paper and case study.
export function generateStaticParams() {
  return [...papers, ...caseStudies].map((p) => ({ slug: p.slug }));
}

// Brand tokens (light) — the edge image runtime has no CSS vars.
const PAPER = '#F7F8F6';
const INK = '#14201C';
const INK2 = '#4A5A53';
const INK3 = '#74847C';
const RULE = '#D8DED8';
const ACCENT = '#0E6B4E';
const MINT = '#8FD3B6';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const paper = anyBySlug(slug);
  const title = paper?.title ?? 'Revenue Foundations';
  const category = paper?.category ?? 'Research';
  const number = paper?.number ?? '';
  const cite = paper ? volIssue(paper.date) : '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: PAPER,
          padding: '64px 72px',
          borderLeft: `12px solid ${ACCENT}`,
          fontFamily: 'sans-serif',
        }}
      >
        {/* top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 22, letterSpacing: 3, color: INK3, textTransform: 'uppercase', fontWeight: 600 }}>
          <span style={{ display: 'flex' }}>Revenue Foundations</span>
          <span style={{ display: 'flex' }}>{cite}</span>
        </div>
        <div style={{ display: 'flex', height: 2, background: RULE, marginTop: 20 }} />

        {/* number + category */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginTop: 48 }}>
          {number ? <span style={{ display: 'flex', fontSize: 26, color: ACCENT, fontWeight: 700, letterSpacing: 1 }}>No. {number}</span> : <span style={{ display: 'flex' }} />}
          <span style={{ display: 'flex', fontSize: 22, color: INK3, textTransform: 'uppercase', letterSpacing: 3, fontWeight: 600 }}>{category}</span>
        </div>

        {/* title */}
        <div style={{ display: 'flex', marginTop: 24, fontSize: 72, lineHeight: 1.05, fontWeight: 700, color: INK, letterSpacing: -1, maxWidth: 980 }}>
          {title}
        </div>

        {/* footer mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 'auto' }}>
          <div style={{ display: 'flex', position: 'relative', width: 40, height: 40 }}>
            <div style={{ display: 'flex', position: 'absolute', left: 10, top: 10, width: 30, height: 30, borderRadius: 6, background: MINT }} />
            <div style={{ display: 'flex', position: 'absolute', left: 0, top: 0, width: 30, height: 30, borderRadius: 6, background: ACCENT }} />
          </div>
          <span style={{ display: 'flex', fontSize: 24, color: INK2, fontWeight: 600 }}>revenuefoundations.com</span>
        </div>
      </div>
    ),
    size,
  );
}
