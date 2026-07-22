# Revenue Foundations — Content Ideas

Pipeline of papers, references, explainers, and case studies. Each maps to a
**series** (`content/series.ts`) and gets a **type** (`lib/journal.ts`:
White Paper · Comparative Review · Reference · Research Article · Field Note ·
Case Study). Vol = year, No = month at publish time — assign on ship, not now.

Publishing = the `new-white-paper` skill: author standalone HTML → `npm run
extract` → `npm run build:pdfs` → registry entry → push. Interactive companions
(calculators/simulators) are optional per piece, mounted via a marker div.

Status: `[ ]` idea · `[~]` drafting · `[x]` shipped

## Shipped
- [x] No. 01 · White Paper · Rev Systems Arch — Integration Modeling for HubSpot Data Hub
- [x] No. 02 · Comparative Review · Attribution — Attribution & Channel Economics (+ simulator)
- [x] No. 03 · Reference · Rev Systems Arch — HubSpot Credit Consumption Reference (+ calculator)

## Series I — Revenue Systems Architecture
- [ ] Deduplication & data quality in HubSpot (from the Data Hub session)
- [ ] HubSpot ↔ Salesforce sync architecture: patterns that survive volume
- [ ] Object model design: custom objects vs. properties vs. associations
- [ ] Reference: HubSpot API rate limits & the batch patterns that respect them

## Series II — Attribution & Measurement
- [ ] Reference: attribution windows by motion (SMB vs. enterprise) — cheat sheet
- [ ] Marketing-sourced vs. -influenced pipeline: defining it so finance believes it
- [ ] Explainer: CPA vs. CAC vs. LTV:CAC — one page, worked (companion: CPA 101)
- [ ] Field Note: why your GA4 and HubSpot attribution never agree

## Series III — GTM Operations
- [ ] Lifecycle stage architecture: the model most HubSpot portals get wrong
- [ ] Lead routing & speed-to-lead SLAs: design + the reporting that enforces them
- [ ] Territory & round-robin design without the Friday-afternoon black holes
- [ ] Reference: lead-to-account matching approaches, scored

## Series IV — Revenue Intelligence
- [ ] Forecasting hygiene: the pipeline data quality that makes a forecast trustable
- [ ] Buyer intent signals: wiring third-party + first-party intent into the SDR queue
- [ ] Applied AI for revenue teams: what Breeze can and can't do today (companion: credits calc)

## Series V — Commercial Strategy
- [ ] Pricing & packaging architecture: tiers, add-ons, and the ASP ceiling
- [ ] Segmentation models that actually change CS coverage and routing

## Case Studies (anonymized, from real engagements) → see CASE_STUDIES.md
Six extracted + anonymized case studies ready to author (RIA/Redtail migration,
dealer-channel manufacturer, project-based fabricator, membership-behind-middleware,
high-volume legal intake, hardware B2B-lease + D2C). Each is a HARD HubSpot problem
written for reps. **No ROI numbers are in source — architecture stories, not results
stories; confirm any metric before publishing.** Author strongest first (RIA, middleware).

## Tools & Downloads (interactive + downloadable)
- [x] HubSpot Credit calculator (on No. 03)
- [x] Attribution model simulator (on No. 02)
- [ ] CAC payback calculator
- [ ] Attribution-readiness checklist (downloadable)
- [ ] RevOps maturity self-assessment

## Explainer thumbnails (YouTube / social, "NNN 101" template)
Template: `cpa-101-thumbnail.html` in the Drive root (1280×720, render via
headless Chrome). Batch: CAC, TAM, GTM, LTV, MQL/SQL, RevOps Audit.
