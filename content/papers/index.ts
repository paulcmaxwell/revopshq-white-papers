// ============================================================
// White-paper registry.
//
// To publish a new paper:
//   1. Render its standalone HTML with the RevOps HQ design system.
//   2. Run:  npm run extract -- <path/to.html> <slug>
//        -> writes content/papers/<slug>.body.html
//   3. Run:  npm run build:pdfs         (regenerates gated PDFs)
//   4. Add an entry to the array below and redeploy.
// The homepage, reader page and gated download route all read from here.
// ============================================================

import type { ArticleType } from '@/lib/journal';

export type Paper = {
  slug: string;
  number: string; // e.g. "01" — the "No." on the card
  series: string; // series slug — see content/series.ts
  type: ArticleType; // article format label
  category: string; // shown on the card
  title: string;
  deck: string; // one-line subtitle
  abstract: string; // 2–3 sentence card summary
  tags: string[];
  authors: string[];
  date: string; // ISO
  readingMinutes: number;
  pages: number;
  featured?: boolean;
};

export const papers: Paper[] = [
  {
    slug: 'datahub-integration',
    number: '01',
    series: 'revenue-systems-architecture',
    type: 'White Paper',
    category: 'Revenue Systems Architecture',
    title: 'Integration Modeling for HubSpot Data Hub',
    deck:
      "What Data Hub's two integration paths actually do, where each one stops, and how to choose an architecture that survives production volume.",
    abstract:
      'HubSpot Data Hub offers two ways to move data across a system boundary — custom code workflow actions and Data Studio — each with a hard constraint. This paper scores both native paths, and every external alternative, against a cost / centralization / complexity taxonomy, and gives a five-question qualification framework for discovery.',
    tags: ['HubSpot', 'Data Hub', 'Integrations', 'RevOps'],
    authors: ['Paul Maxwell', 'James Bond'],
    date: '2026-07-21',
    readingMinutes: 18,
    pages: 21,
    featured: true,
  },
  {
    slug: 'attribution-channel-economics',
    number: '02',
    series: 'attribution-measurement',
    type: 'Comparative Review',
    category: 'Attribution & Measurement',
    title: 'Attribution & Channel Economics',
    deck:
      'Why cost-per-acquisition means nothing without multi-touch attribution — and how HubSpot compares with Salesforce, Adobe, and GA4.',
    abstract:
      'Blended CAC hides a 5–15× efficiency gap between a company’s best and worst channels. This paper connects channel-level CPA to the multi-touch attribution it depends on, integrates CPA with LTV and channel saturation, and scores HubSpot’s attribution against Salesforce, Adobe Marketo Measure, and GA4 on a capability-to-complexity basis.',
    tags: ['Attribution', 'CPA', 'HubSpot', 'Marketing Analytics'],
    authors: ['Paul Maxwell'],
    date: '2026-07-22',
    readingMinutes: 22,
    pages: 15,
    featured: true,
  },
];

export const bySlug = (slug: string): Paper | undefined =>
  papers.find((p) => p.slug === slug);
