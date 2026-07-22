// ============================================================
// Series registry.
//
// Revenue Foundations publishes research in named series. Every paper belongs
// to exactly one series (by slug). The homepage groups the library by series;
// add a series here, then set `series: '<slug>'` on papers in content/papers.
// ============================================================

export type Series = {
  slug: string;
  roman: string; // display index, e.g. "I"
  name: string;
  tagline: string; // one line, shown under the series name
  description: string; // 1–2 sentences for the series header
};

export const series: Series[] = [
  {
    slug: 'revenue-systems-architecture',
    roman: 'I',
    name: 'Revenue Systems Architecture',
    tagline: 'How revenue data actually moves.',
    description:
      'Integration design, data infrastructure, and the systems that connect the revenue stack — and where they break at production volume.',
  },
  {
    slug: 'attribution-measurement',
    roman: 'II',
    name: 'Attribution & Measurement',
    tagline: 'What marketing spend actually returns.',
    description:
      'Channel economics, multi-touch attribution, and the measurement rigor that separates real marketing efficiency from activity.',
  },
  {
    slug: 'gtm-operations',
    roman: 'III',
    name: 'GTM Operations',
    tagline: 'The machinery between a lead and a booking.',
    description:
      'Lifecycle, routing, territory, and the operational plumbing that turns demand into predictable pipeline.',
  },
  {
    slug: 'revenue-intelligence',
    roman: 'IV',
    name: 'Revenue Intelligence',
    tagline: 'Signal over noise in the pipeline.',
    description:
      'Forecasting, buying signals, and applied AI for revenue teams — what the data can and cannot tell you.',
  },
  {
    slug: 'commercial-strategy',
    roman: 'V',
    name: 'Commercial Strategy',
    tagline: 'Pricing, packaging, and the shape of the deal.',
    description:
      'Segmentation, pricing architecture, and the commercial decisions that set the ceiling on revenue efficiency.',
  },
];

export const seriesBySlug = (slug: string): Series | undefined =>
  series.find((s) => s.slug === slug);
