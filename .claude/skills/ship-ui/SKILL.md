---
name: ship-ui
description: Pre-ship gate for ANY visual/UI/CSS/component change on this site. Use before committing a design change — enforces the green budget, no-empty-boxes/no-duplicate rules, mobile-margin safety, and the "look at it before you ship" workflow (responsive audit + real screenshots). Trigger whenever editing globals.css, a component's markup/style, a page layout, book covers, calculators, cards, or anything the user will see rendered.
---

# Ship-UI gate

You are about to change something visible. Do NOT commit until every box below is
true. This exists because shipping design unseen produced a mess.

## 1. Obey the rules (from CLAUDE.md → "UI & design")
- **Green budget:** `--accent` only on the brand mark, inline links, and ≤1 primary
  CTA per view. Banned on eyebrows, numbers, labels, borders, active states, chips,
  sliders, decorative fills — use `--ink*` / `--rule`. Semantic colors only inside a
  data figure, muted, with a legend.
- **No empty boxes, no duplicate content.** Cards/covers filled (title + deck); never
  repeat a title shown adjacent; no hollow tall aspect-ratios.
- **Mobile margins:** flex/grid children get `min-width:0`; wide tables/figures live
  in an `overflow-x:auto` wrapper; `.container` padding is sacred.
- **One cohesive change** to a locked target. If unsure what "good" is, STOP and ask
  the user for a reference instead of guessing/thrashing.

## 2. Build
`npm run build` → must compile clean.

## 3. Audit (start the server first: `PORT=3100 npm run start &`)
`node scripts/audit-responsive.mjs` → must print **"All routes clean."**
If it names an element, fix that element (add `min-width:0` / a scroll wrapper) —
do NOT mask with `overflow:hidden`.

## 4. LOOK
`node scripts/shot.mjs <changed-route> 390 /tmp/m.png` and `... 1280 /tmp/d.png`,
then **Read both PNGs and actually evaluate them** against the rules above. Use
`shot.mjs` (device-emulated CDP), never Chrome `--screenshot --window-size` (it
mis-sizes small viewports and lies).

## 5. Only now
Commit with a clear message and `git push origin main`. Paul reviews on the live
site — never hand him a localhost URL.
