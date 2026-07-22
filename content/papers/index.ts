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
  {
    slug: 'hubspot-credit-reference',
    number: '03',
    series: 'revenue-systems-architecture',
    type: 'Reference',
    category: 'Revenue Systems Architecture',
    title: 'The HubSpot Credit Consumption Reference',
    deck:
      'What actually consumes HubSpot Credits, how many, and how to estimate a month — in plain English, for the moment credit usage comes up on a call.',
    abstract:
      'HubSpot folded its AI and data usage into one currency — HubSpot Credits — and reps are routinely caught flat-footed when credit usage comes up. This reference gives the plain-English answer first, then the facts: what credits are, what you get included by tier, exactly what each action costs from HubSpot’s official rate sheet, worked monthly estimates, and how to monitor and cap usage.',
    tags: ['HubSpot', 'Breeze', 'Credits', 'Pricing'],
    authors: ['Paul Maxwell'],
    date: '2026-07-22',
    readingMinutes: 9,
    pages: 9,
  },
];

// Case studies — same shape as papers, kept in their own list so the homepage
// "White Papers" index stays papers-only while the reader and /downloads shelf
// can serve both. Case studies carry client-attested (representative) results;
// white papers stay first-principles.
export const caseStudies: Paper[] = [
  {
    slug: 'case-ria-hubspot-migration',
    number: 'C1',
    series: 'revenue-systems-architecture',
    type: 'Case Study',
    category: 'Revenue Systems Architecture',
    title: 'Migrating an RIA from Redtail to HubSpot without losing the relationships',
    deck:
      'A registered investment advisor left Redtail for HubSpot. The hard part was householding, the account book, and the audit trail — a data-model exercise, not a data export.',
    abstract:
      'A mid-market RIA ran a decade of client history in Redtail — ~11,000 contacts, ~3,300 accounts, ~3,300 households, ~9,000 relationships, ~180,000 notes. This walks the migration as a first-principles data-modeling problem: map the source model, find what has no native HubSpot object (accounts, households), and treat labeled relationships as the Enterprise-deciding data they are.',
    tags: ['HubSpot', 'Migration', 'Custom Objects', 'Wealth / RIA'],
    authors: ['Paul Maxwell'],
    date: '2026-07-22',
    readingMinutes: 9,
    pages: 8,
  },
];

export const bySlug = (slug: string): Paper | undefined =>
  papers.find((p) => p.slug === slug);

/** Look up a paper OR a case study by slug (the reader serves both). */
export const anyBySlug = (slug: string): Paper | undefined =>
  papers.find((p) => p.slug === slug) ?? caseStudies.find((c) => c.slug === slug);
