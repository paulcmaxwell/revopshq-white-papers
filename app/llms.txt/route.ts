import { papers } from '@/content/papers';
import { series } from '@/content/series';
import { JOURNAL, citation, identifier } from '@/lib/journal';

export const dynamic = 'force-static';

const BASE = 'https://revenuefoundations.com';

// llms.txt (llmstxt.org) — a concise, machine-readable map of the journal for
// AI answer engines. Regenerates from the registry, so it stays current.
export function GET() {
  const sorted = [...papers].sort((a, b) => b.date.localeCompare(a.date));

  const articles = sorted
    .map((p) => {
      const cite = `${citation(p.date)} · ${identifier(p.date, p.number)}`;
      return `- [${p.title}](${BASE}/papers/${p.slug}) — ${p.type}. ${cite}. ${p.abstract}`;
    })
    .join('\n');

  const departments = series
    .map((s) => `- **${s.name}** — ${s.tagline} ${s.description}`)
    .join('\n');

  const body = `# ${JOURNAL.name}

> ${JOURNAL.subtitle}. ${JOURNAL.blurb} An independent research project funded by ${JOURNAL.publisher}.

Revenue Foundations publishes practitioner research for people who build and run
revenue systems — revenue operations, marketing operations, and RevOps leaders,
including HubSpot growth specialists. Every article is free to read, cite, and
share, and is available as a formatted PDF.

## Articles
${articles}

## Series
${departments}

## About
${JOURNAL.name} is published by ${JOURNAL.publisher} (https://revopshq.com).
Volume = year (Vol. I = 2026); Issue = month. Contact: https://revopshq.com
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
