import { papers } from '@/content/papers';
import { citation } from '@/lib/journal';

const SITE = 'https://revenuefoundations.com';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const dynamic = 'force-static';

export function GET() {
  const items = [...papers]
    .sort((a, b) => b.date.localeCompare(a.date) || b.number.localeCompare(a.number))
    .map((p) => {
      const url = `${SITE}/papers/${p.slug}`;
      const pub = new Date(p.date + 'T12:00:00Z').toUTCString();
      const desc = `${p.deck} — ${citation(p.date)}`;
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pub}</pubDate>
      <category>${esc(p.category)}</category>
      ${p.authors.map((a) => `<author>${esc(a)}</author>`).join('\n      ')}
      <description>${esc(desc)}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Revenue Foundations</title>
    <link>${SITE}</link>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Applied research on the systems that move revenue. From RevOps HQ.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(papers[0]?.date + 'T12:00:00Z').toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
