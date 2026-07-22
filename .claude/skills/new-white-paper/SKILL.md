---
name: new-white-paper
description: Publish a new RevOps HQ white paper end-to-end — author the standalone HTML in the design system, extract the web body + CSS, render the gated PDF, register it, and deploy. Use whenever adding/updating a paper in this repo.
---

# Publish a white paper

Goal: go from "here's the content" to a live, gated, downloadable paper with
**one registry entry** and no bespoke pages.

## 0. Load the design system
Read the `brand-system` skill first so the paper matches every other one.

## 1. Author the standalone HTML
Write `content/sources/<slug>.html` as a **complete standalone document** using
the RevOps HQ paper design system (same structure as
`content/sources/datahub-integration.html`):

- `<head>` with `<title>`, then `<body><!-- ARTIFACT-BODY-START --><style>…tokens+paper CSS…</style><article class="doc">…</article>`.
- Masthead (brandbar + `h1` + `.deck` + `.byline`), `.abstract`, numbered
  `section`s with `h2 > .num`, `.lede` drop-cap on the first paragraph, `.note`
  callouts, `figure > .frame > svg` diagrams, `.tablewrap > table`, glossary,
  `footer`. SVGs use the `.box/.flow/.fill-*` token classes — never hard-code
  hex in the paper.
- Keep the running measure ~34rem; diagrams max ~700px wide inside `.frame`.

Pick a short kebab-case `<slug>` (e.g. `datahub-dedup`).

## 2. Extract the web body + refresh the scoped CSS
```bash
npm run extract -- content/sources/<slug>.html <slug>
```
This writes `content/papers/<slug>.body.html` and regenerates
`content/paper.css` (scoped under `.paper`, tokens stripped — they live in
`globals.css`). If you changed shared component CSS, verify `paper.css` still
looks right.

## 3. Render the gated PDF (needs local Chrome)
```bash
npm run build:pdfs -- <slug>
```
Writes `content/pdfs/<slug>.pdf` from the SAME standalone source, so the PDF and
the web reader are byte-for-byte the same design. Then shrink losslessly if
large (pikepdf in a venv works; keep committed PDFs lean).

Sanity-check page count and that it opens.

## 4. Register it
Add one entry to the array in `content/papers/index.ts`:
```ts
{ slug, number, title, deck, abstract, category, tags, authors, date,
  readingMinutes, pages, featured }
```
`number` is the "No." on the card; `abstract` is the 2–3 sentence card summary
(distinct from `deck`, the one-liner). `date` is ISO.

## 5. Verify locally
```bash
npm run build && npm run start
```
Check: card appears on `/`, `/papers/<slug>` renders the design, the download
bar gates → HubSpot submit → PDF streams (see the `deploy-and-verify` skill for
the curl flow).

## 6. Ship
```bash
git add -A && git commit -m "Add paper: <title>" && git push
```
Vercel auto-deploys. Confirm with `deploy-and-verify`.

## Guardrails
- One design system. If the new paper needs a new component, add it to
  `content/paper.css` (scoped `.paper …`) AND the standalone source, not inline.
- The PDF must be produced from the standalone source, never hand-built, so web
  and PDF never drift.
- Don't inline the PDF into a Vercel deploy call — it ships via Git.
