---
name: brand-system
description: The RevOps HQ visual system — palette, type, the green-squares mark, motion language, and rules for extending it across papers, the site, PDFs, and future products (e.g. Revenue Foundations). Load before designing anything RevOps HQ.
---

# RevOps HQ brand system

Editorial-academic meets modern-technical. Think a well-set journal that a
private-equity firm would be comfortable handing to an LP: quiet, precise,
confident. Emerald + paper, generous measure, real typographic hierarchy,
restrained motion.

## The mark (the atom)
An **emerald rounded square with a mint square offset behind it, down-right.**
It reads as "layered foundations." It is the favicon, the wordmark glyph, and
the OG motif. Reuse it; don't redraw it per surface.

- accent square on top-left, mint square offset ~30% down-right, both rounded.
- Source of truth: `app/icon.svg`.

## Palette
```
--paper   #F7F8F6   ground        --ink    #14201C   text
--paper-2 #FFFFFF   raised        --ink-2  #4A5A53   secondary text
--rule    #D8DED8   hairlines     --ink-3  #74847C   muted
--accent  #0E6B4E   emerald (brand)   --accent-2 #0B5A41  hover
--mint    #8FD3B6   offset / accents
--clay    #A8603C   constraints/warn  --amber #B08419  "moderate"
```
Neutrals are green-biased on purpose (not pure grey). Full dark theme + all
`[data-theme]` overrides live in `app/globals.css` — **edit tokens there only.**
Semantic colors (clay/amber = states) are separate from the accent.

## Type
- **Serif** `--serif` (Iowan Old Style / Palatino → Source Serif 4 fallback):
  all reading text, display headlines, card titles. This carries the academic
  feel.
- **Sans** `--sans` (Avenir Next → system): eyebrows, labels, table data, UI
  chrome. Uppercase labels get `letter-spacing: 0.12–0.18em`.
- **Mono** `--mono`: data, code, figure micro-labels.
- Keep running measure ~34rem (~65ch). Type scale is set in `globals.css` /
  `paper.css`; stay on it. Headings `text-wrap: balance`.

## Structure devices (use only when they encode meaning)
Numbered sections (`No. 01`, `§3`) = real sequence. Eyebrows = section kind.
Hairline rules = separation. `.note` callouts (clay border) = constraints;
`.note.good` (emerald) = affirmations. Don't decorate with numbers that aren't
a sequence.

## Motion language (for the site + future WebGL work)
**Volumetric, slow, subtle.** A single low-frequency ambient field — think a
slow-drifting emerald/mint gradient volume or particle depth fog — never fast,
never flashy. One orchestrated ambient moment beats scattered effects.
Reduced-motion: kill it. When building the WebGL background (Revenue
Foundations): low saturation, long periods (>20s cycles), depth via layered
translucency, accent hue pulled toward `--accent`/`--mint`. If the accent fights
the ground, drop saturation rather than swapping hue.

## Extending the system
- **New component:** add it to `content/paper.css` (scoped `.paper …`) and the
  standalone source; or `app/globals.css` for chrome. Never inline hex.
- **PDFs:** authored from the same standalone HTML → identical to the web.
- **New product (Revenue Foundations):** import THESE tokens; introduce at most
  one new accent and justify it. Keep the mark. The goal is one family, many
  products.

## Assets
- `app/icon.svg` — favicon / mark
- `app/apple-icon.png` — 180×180 touch icon
- `app/opengraph-image.png` — 1200×630 social card
Regenerate images from the templates in `scripts/brand/` (render via headless
Chrome at the exact pixel size).
