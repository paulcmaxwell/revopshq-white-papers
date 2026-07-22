'use client';

import { useState } from 'react';
import { citation, identifier } from '@/lib/journal';

const SITE = 'https://revenuefoundations.com';

/** Format authors APA-style: "Maxwell, P.", joined with ", " and "& " before the last. */
function authorsApa(authors: string[]): string {
  const fmt = (name: string) => {
    const parts = name.trim().split(/\s+/);
    const last = parts.pop() ?? name;
    const initials = parts.map((p) => `${p[0]}.`).join(' ');
    return initials ? `${last}, ${initials}` : last;
  };
  const list = authors.map(fmt);
  if (list.length <= 1) return list[0] ?? '';
  return `${list.slice(0, -1).join(', ')}, & ${list[list.length - 1]}`;
}

export default function CiteThis({
  slug, title, authors, date, number,
}: { slug: string; title: string; authors: string[]; date: string; number: string }) {
  const [copied, setCopied] = useState(false);
  const year = date.slice(0, 4);
  const url = `${SITE}/papers/${slug}`;
  const cite = `${authorsApa(authors)} (${year}). ${title}. ${citation(date)}. ${url}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cite);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the text is selectable below */
    }
  };

  return (
    <aside className="cite" aria-label="How to cite this paper">
      <div className="cite-head">
        <span className="cite-kicker">Cite this paper</span>
        <span className="cite-id">{identifier(date, number)}</span>
      </div>
      <p className="cite-text">{cite}</p>
      <button type="button" className="cite-copy" onClick={copy}>
        {copied ? 'Copied' : 'Copy citation'} <span aria-hidden="true">{copied ? '✓' : '⧉'}</span>
      </button>
    </aside>
  );
}
