// ============================================================
// Tools registry. Free-to-use interactive tools, email-gated for the detailed
// results ("freemium"). The lead capture compiles the tool + the user's inputs
// into the HubSpot message field (see lib/hubspot.ts / app/api/lead).
// ============================================================

export type Tool = {
  slug: string;
  number: string; // shelf ordinal, like papers' "No."
  title: string;
  deck: string; // one-line
  abstract: string; // card summary
  category: string;
  cta: string; // button label on the tool
  minutes: number; // rough time to complete
};

export const tools: Tool[] = [
  {
    slug: 'cac-payback',
    number: 'T1',
    title: 'CAC Payback Calculator',
    deck: 'How many months until a new customer pays back what it cost to acquire them — and whether the unit economics actually work.',
    abstract:
      'Enter ACV, gross margin, CAC, and churn. Get CAC payback in months and your LTV:CAC ratio against the benchmarks that decide whether to scale spend or fix efficiency first.',
    category: 'Commercial Strategy',
    cta: 'Calculate payback',
    minutes: 2,
  },
  {
    slug: 'attribution-readiness',
    number: 'T2',
    title: 'Attribution-Readiness Checklist',
    deck: 'Ten questions that tell you whether your attribution can be trusted to move budget — or whether it will quietly misprice every channel.',
    abstract:
      'A fast readiness check across tracking, modeling, windows, and governance. Get a score, a tier, and the specific gaps to close before you reallocate spend on the numbers.',
    category: 'Attribution & Measurement',
    cta: 'Score my readiness',
    minutes: 3,
  },
  {
    slug: 'revops-maturity',
    number: 'T3',
    title: 'RevOps Maturity Assessment',
    deck: 'Where your revenue operation sits across data, process, tooling, and insight — and the next move that raises the ceiling.',
    abstract:
      'Twelve questions across four dimensions produce a maturity level (1–5) and a dimension breakdown, so you can see which foundation is holding the others back.',
    category: 'Revenue Systems Architecture',
    cta: 'Assess maturity',
    minutes: 4,
  },
];

export const toolBySlug = (slug: string): Tool | undefined => tools.find((t) => t.slug === slug);
