# Revenue Foundations — Backlog

Brand/website (white papers primary; articles + tools/products alongside; the
journal Vol./No. is a citation detail, not the identity). Design bar:
`DESIGN_PHILOSOPHY.md`. Deploy: push `main` → Vercel → www.revenuefoundations.com.

Status: `[ ]` todo · `[~]` in progress · `[x]` done

## Live / shipped
- [x] Next.js site, gated PDF downloads, HubSpot Forms API lead capture
- [x] Lead fields fixed (company + HubSpot-user + paper → Message field)
- [x] White paper No. 01 — Integration Modeling for HubSpot Data Hub (+ PDF)
- [x] SEO/AEO/GEO: sitemap.xml, robots.txt, dynamic llms.txt
- [x] Brand mark (green squares) — favicon, OG, apple icon
- [x] Live on revenuefoundations.com (apex → www)

## NOW — make it a genuinely good site (not patches)
- [~] Homepage rebuild to DESIGN_PHILOSOPHY: editorial publication front page,
      near-monochrome (green = punctuation), NO clipped decoration, real grid +
      featured lead item + typeset index. Verify against the live render.
- [~] Kill the "journal" over-branding in copy (brand-first; white papers primary)
- [~] Motion: full-bleed fixed neutral ambient field (cannot clip) OR none
- [ ] White paper No. 02 — Attribution & Channel Economics (from new-content.md:
      CPA + HubSpot multi-touch attribution + platform comparison matrix) + PDF
- [ ] Article page: clickable TOC that collapses on scroll + citation / Cite-this

## Next
- [ ] Brand-first IA sections: White Papers → Tools & Downloads → Articles
- [ ] Tools & Downloads product system (calculators + downloadable assets,
      AgencyHabits-style) with cover images
- [ ] Search / filter across resources; optional table view
- [ ] CONTENT_IDEAS.md + daily publishing workflow (assign issue/vol/series/authors)
- [ ] Per-paper OG images

## Content ideas (seed — move to CONTENT_IDEAS.md)
- Deduplication & data quality in HubSpot (from the Data Hub session)
- Lifecycle stage architecture; lead routing SLAs; forecasting hygiene
- Tools: CAC payback calculator, attribution-readiness checklist, RevOps maturity

## Hygiene / gotchas
- Keep `next` on a patched release (Vercel blocks CVE versions)
- Repo lives in Google Drive: `White Papers/revopshq-white-papers/`
- Verify the LIVE render (screenshot) before claiming a design is done
