# RevOps HQ White Papers — Backlog

Status legend: `[ ]` todo · `[~]` in progress · `[x]` done

## Shipped
- [x] Next.js library site with the RevOps HQ design system
- [x] Email-gated PDF downloads (first/last/work email/company/HubSpot-user)
- [x] Lead capture via unauthenticated HubSpot Forms API (portal 21204085)
- [x] HubSpot tracking pixel site-wide
- [x] Paper No. 01 — Integration Modeling for HubSpot Data Hub
- [x] Live on Vercel, auto-deploy on push
- [x] Brand assets: green-squares favicon + OG image
- [x] `CLAUDE.md`, skills, this backlog

## Content
- [ ] Paper No. 02 — pick the next topic (candidate: "Deduplication & data
      quality in HubSpot", spun from the same meeting)
- [ ] Per-paper OG images (dynamic, title on the card) via `opengraph-image.tsx`
- [ ] Case study companion to Paper 01 (from the Fathom transcript + Miro)
- [ ] "Where DataHub plays best" one-pager for sales enablement

## Product / platform
- [ ] Author's guide page (internal) documenting the design system in-situ
- [ ] Search / tag filtering on the library once >6 papers
- [ ] RSS / email-notify on new paper
- [ ] Analytics: dashboard of downloads by paper (HubSpot list + a `/admin` view)
- [ ] Custom domain (papers.revopshq.com) — add in Vercel + DNS

## Revenue Foundations (net-new site — separate track)
- [ ] Firecrawl agency-habits + PE/WebGL reference sites; extract motion, color,
      type language
- [ ] Design-system spec artifact: palette, type scale, the volumetric shader
      concept (subtle, slow, "private-equity crisp")
- [ ] Build the site shell with the WebGL volumetric background
- [ ] PDF template system (academic + modern, slow volumetric bg) that shares
      ONE design system across the whole product line — matched to the
      screenshots in the repo root
- [ ] Roll the shared system back into this white-paper site so both feel like
      one brand

## Design system → product system
- [ ] Extract tokens into a shared package/file both sites import
- [ ] Cover + section-divider PDF templates
- [ ] Slide/one-pager templates from the same tokens

## Hygiene
- [ ] Keep `next` on a patched release (Vercel blocks CVE versions)
- [ ] Add `npm run lint` to CI intent; wire a GitHub Action for typecheck+build
- [ ] Optional: set `HUBSPOT_PORTAL_ID` / `HUBSPOT_FORM_GUID` as env vars if the
      form GUID changes (defaults are baked in)
