'use client';

import { useEffect, useState } from 'react';

type Item = { id: string; num: string; label: string };

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

/**
 * A contents rail for the paper reader. Reads the section headings out of the
 * rendered `.paper` body after hydration, gives each an id, and tracks the
 * active section on scroll. Sticky on wide screens; a collapsible panel on
 * narrow ones.
 */
export default function ArticleTOC() {
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState<string>('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const heads = Array.from(document.querySelectorAll<HTMLElement>('.paper .doc h2, .paper h2'));
    const list: Item[] = heads.map((h) => {
      const numEl = h.querySelector('.num');
      const num = numEl?.textContent?.trim() ?? '';
      const label = (h.textContent ?? '').replace(num, '').trim();
      if (!h.id) h.id = slugify(label) || slugify(h.textContent ?? 'section');
      h.style.scrollMarginTop = '5rem';
      return { id: h.id, num, label };
    });
    setItems(list);

    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: '-10% 0px -70% 0px', threshold: 0 },
    );
    heads.forEach((h) => obs.observe(h));
    return () => obs.disconnect();
  }, []);

  if (items.length < 3) return null;

  const onJump = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActive(id);
    setOpen(false);
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <nav className={`toc${open ? ' toc-open' : ''}`} aria-label="Contents">
      <button type="button" className="toc-toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        Contents <span aria-hidden="true">{open ? '▴' : '▾'}</span>
      </button>
      <div className="toc-head">On this page</div>
      <ol className="toc-list">
        {items.map((it) => (
          <li key={it.id} className={active === it.id ? 'is-active' : undefined}>
            <a href={`#${it.id}`} onClick={(e) => onJump(e, it.id)}>
              {it.num && <span className="toc-num">{it.num}</span>}
              <span className="toc-label">{it.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
