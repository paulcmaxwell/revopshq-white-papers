# Revenue Foundations — Backlog

Brand/website. **White papers primary**; case studies, articles, and tools/downloads
alongside. Journal apparatus (Vol./No./series/issue) is a **citation detail, a
credibility signal — it must NOT dominate the branding.** Brand-first everywhere.
Design bar: `DESIGN_PHILOSOPHY.md`. Deploy: push `main` → Vercel → www.revenuefoundations.com.

Status: `[ ]` todo · `[~]` in progress · `[x]` done

## Live / shipped
- [x] Next.js site, gated PDF downloads, HubSpot Forms API lead capture
- [x] Lead fields fixed (company + HubSpot-user + paper → Message field)
- [x] SEO/AEO/GEO: sitemap.xml, robots.txt, dynamic llms.txt
- [x] Brand mark (green squares) — favicon, OG, apple icon
- [x] Live on revenuefoundations.com (apex → www)
- [x] Journal apparatus in code (`lib/journal.ts`, `content/series.ts`) — Vol/No/series
- [x] White Paper No. 01 — Integration Modeling for HubSpot Data Hub (+ PDF)
- [x] White Paper No. 02 — Attribution & Channel Economics (+ PDF)
- [x] White Paper No. 03 — HubSpot Credit Consumption Reference (+ PDF)

## NOW (this session)
- [x] **Interactive credit calculator on No. 03** — `components/CreditCalculator.tsx`.
      Log-scale sliders + click-to-type, live per-line credits, Data Studio block,
      scenario presets, slide-out drawer + persistent launcher. Shipped.
- [~] **Attribution model charts + simulator (No. 02)** — a set of "model charts"
      that visually explain each attribution model (first-touch, last-touch, linear,
      time-decay, U/W-shaped, data-driven): what credit each touch gets, shown as a
      chart. Add a **model switcher** and an interactive **simulator with fake data**
      (a sample journey → live credit split per model). Same design language.
- [x] **AgencyHabits-style packaging** — `/downloads` shelf of 3D book covers
      (`components/BookCover.tsx`, restrained journal-issue treatment, emerald spine +
      mark), each → `/papers/<slug>?gate=1` gated download. Nav: Downloads. Verify live.
- [~] **Case Studies content type** — packaging slot ready (Case Studies section on
      /downloads marked Forthcoming). CONTENT: Paul provides real engagement details;
      DO NOT fabricate. When content arrives: add registry entries (type 'Case Study'),
      author standalone HTML → extract → PDF → they appear on the shelf automatically.

## Bugs
- [x] **No. 02 attribution** — "the number on the board slide" SVG label overflowed
      the 150px blended-CAC box; wrapped into stacked tspans. Fixed (source + body).

## Homepage / design
- [x] Homepage rebuilt as editorial front page — masthead + featured lead (monochrome
      typeset cover plate, green = mark only) + typeset Contents index + Series index.
      Card grid retired on homepage (`PaperCard` now unused there). VERIFY live render.
- [ ] Nav IA: update `Nav.tsx` links to match (White Papers / Series) — still Library
- [x] Kill "journal" over-branding in copy (brand-first; white papers primary)
- [x] Article page: clickable TOC (scroll-spy rail, collapsible on mobile) + Cite-this

## Case study backlog (draft — same design/voice, gated ebook download)
Map each to a series; ground in real archetypes (the Forge $25M example in
`new-content.md` is a ready anchor for the attribution one).
- [ ] CS · Attribution — "Killing $9,200-CPA events spend with multi-touch" (Forge)
- [ ] CS · Attribution — first-touch → multi-touch migration, 24% CAC drop
- [ ] CS · Revenue Systems Arch — rebuilding a broken HubSpot↔Salesforce sync at scale
- [ ] CS · Revenue Systems Arch — dedup / data-quality remediation on a dirty CRM
- [ ] CS · GTM Ops — lead-routing SLA overhaul (speed-to-lead 19h → minutes)
- [ ] CS · GTM Ops — lifecycle-stage rearchitecture that unblocked reporting
- [ ] CS · Revenue Intelligence — forecast hygiene, accuracy 60% → 90%
- [ ] CS · Revenue Intelligence — buyer-intent signals wired into the SDR queue
- [ ] CS · Commercial Strategy — repackaging pricing tiers to lift ASP

## Next
- [ ] Brand-first IA: White Papers → Case Studies → Tools & Downloads → Articles
- [ ] Tools & Downloads product system (calculators + downloadable assets) w/ covers
- [x] Search / filter across resources (homepage: live search + series chips)
- [ ] CONTENT_IDEAS.md + daily publishing workflow (assign issue/vol/series/authors)
- [x] Per-paper OG images (dynamic next/og card per paper)

## Content ideas (seed — move to CONTENT_IDEAS.md)
- Deduplication & data quality in HubSpot; lifecycle architecture; routing SLAs
- Tools: CAC payback calculator, attribution-readiness checklist, RevOps maturity

## Hygiene / gotchas
- Keep `next` on a patched release (Vercel blocks CVE versions)
- Repo lives in Google Drive: `White Papers/revopshq-white-papers/`
- Verify the LIVE render (screenshot) before claiming a design is done
- Local dev :3000 was a DIFFERENT app this session — don't trust it blindly
- Orphaned components (from reverted editorial homepage): `CoverArt.tsx`,
  `VolumetricBackground.tsx` — reuse `CoverArt` for ebook covers; else delete
