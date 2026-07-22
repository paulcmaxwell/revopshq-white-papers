# Revenue Foundations — Case Studies (anonymized)

Real RevOps HQ engagements, written up as **architecture case studies** for a
HubSpot-savvy audience (AEs, solutions engineers, RevOps buyers). Each answers:
*here is a hard HubSpot problem most people misjudge, and here is exactly how it
was solved.*

## Hard rules (read before drafting any of these)
1. **Anonymize completely.** No client name, people, city, product names, or
   identifying combinations (e.g. "415 lease contracts + a sport" is identifying —
   round or drop). Refer to industry + model only. Per-brief anonymization notes
   are in the source briefs.
2. **No fabricated outcomes.** Across every engagement, **hard ROI/results metrics
   were NOT in the source** — most builds were in progress or proposal-stage
   (spring–summer 2026). Write these as *how-we-solved-it* stories, not
   *N% lift* stories. To publish any number, get it confirmed by the account owner.
3. **Audience = HubSpot sales reps.** The value is teaching a HubSpot problem most
   reps don't understand well (custom objects, association labels, Enterprise-vs-Pro
   lines, integration limits, Commerce Hub edges). Not generic "we did RevOps."
4. **Positioning caution.** Some engagements propose RevOps HQ products that replace
   HubSpot modules (e.g. Commerce Hub → RevCPQ). For a HubSpot-rep audience, lead
   with the in-HubSpot expertise and the integration/architecture story; frame any
   "we replaced a HubSpot module" angle carefully.

Each maps to a **series** (content/series.ts) and would ship as a `type: 'Case Study'`
paper on the /downloads shelf (gated PDF), same as white papers.

---

## CS-01 · RIA leaves Redtail for HubSpot — Series I (Rev Systems Arch)
**Angle:** Migrating a compliance-heavy wealth CRM into HubSpot without losing
householding, relationships, or the audit trail.
**Archetype:** mid-market RIA + tax practice. ~11k contacts, ~3,300 investment
accounts, ~3,300 households, ~9,000 relationships, ~180k notes.
**Hard HubSpot problem reps miss:** Redtail is one "contact" table split by a type
flag → must shard into multiple objects; no native object for **Accounts** or
**Households** → custom objects → **forces Enterprise, not Pro** (reps who quote
Pro are wrong); householding + trustee/beneficiary/COI webs need **custom
association labels + multiple labeled associations (Enterprise-only)**; compliance
approval routing and audit trail; Redtail keyword/UDF blobs parsed into typed
properties; idempotent, re-runnable loads at volume.
**What we did:** custom Redtail API extraction; Account + Household custom objects;
200+ properties; ~9,000 labeled associations; ~180k notes with dedup keys;
activities→Tasks (idempotent via external-ID); "Move Money" pipeline with
threshold compliance routing (≥$250k → principal approval); 69→33 processes,
0→10 ticket pipelines, 22 workflows, 7 playbooks, 4 dashboards.
**Rep lesson:** custom objects + association labels are the Pro-vs-Enterprise line;
external-ID properties enable idempotent migration.
**Caveat:** verify Enterprise was purchased before claiming "custom objects live." ROI [not in source].

## CS-02 · Dealer-channel equipment manufacturer — Series I / III
**Angle:** Closing the end-customer data gap when you sell through dealers.
**Archetype:** mid-market ag/off-highway equipment maker; serial-numbered units;
sells via independent dealers, markets to end operators; NetSuite + WooCommerce.
**Hard HubSpot problem:** you sell to dealers, not users → end customer vanishes at
close; contact→company→deal assumes you sell to the buyer; channel breaks the
association model (dealer vs. employee vs. customer on one company); ERP catalog ≠
sales catalog; revenue is order/unit-based, not deal-based.
**What we did:** NetSuite↔HubSpot connector (~11k records); custom **Equipment**
object (one per unit); warranty QR/URL form ties operator→unit; fulfillment/tracking
sync (NetSuite script→webhook→serverless→HubSpot Order); filtered "quotable" product
views; association labels + role property; custom cards.
**Rep lesson:** custom objects for serial units, the Orders object as ERP bridge,
association labels for channel, filtered product views, connector + serverless for gaps.
**Caveat:** Phase 1 in progress; ROI [not in source].

## CS-03 · Project-based fabricator rebuilds its pipeline — Series III (GTM Ops)
**Angle:** A bid-driven fabricator's HubSpot rebuild **without a Project custom object.**
**Archetype:** custom design-and-fabrication / architectural millwork-and-metal
studio; project-based, long custom cycles; off a legacy PSA (Scoro-class).
**Hard HubSpot problem:** no clean lead→deal→won; PSA pipeline carried 1:1 mixing
sales + production stages → forecasting meaningless; the deal ≠ the work; quoting
lives in a specialized CPQ (HubSpot only gets totals); **HubSpot rejects negative
line items** so deduct change-orders can't be quote revisions; margin/capacity
gating before a bid goes out.
**What we did:** "Project = **Ticket** pipeline" (no Project custom object); one
discriminator property on Company instead of parallel custom objects; separate
Change-Order **Deal** pipeline (parent/child deals, 4 CO types); deduct-scope
workaround (manual value adjust + accounting credit memo + one-way sync); pipeline
**stage requirements** as hard gates incl. file-type requirements; calculated P&L
property on the Ticket fed by the PM tool; one Location custom object (many-to-many).
**Rep lesson:** repurpose Tickets as projects; discriminator props protect the
Enterprise object budget; stage requirements as gates; know CPQ-sync limits.
**Caveat:** "Approved for Build" — not executed; ROI [not in source].

## CS-04 · Membership business behind middleware — Series I (integration)
**Angle:** When native connectors can't cut it — building a membership CRM in
HubSpot behind middleware (RevOps Connect).
**Archetype:** multi-location membership/workspace business (~30+ locations,
multiple U.S. markets); B2C recurring subscriptions + physical door-access check-ins.
**Hard HubSpot problem:** the billing platform mints a NEW customer ID on every
cancel+resignup → native HubSpot–Stripe sync treats each as a new person →
~5,000 contacts blocked, LTV/subscription history shattered; webhook race
conditions (invoice before customer); door-scan usage events have no native
connector; membership model isn't deal-centric.
**What we did:** single **middleware** layer (RevOps Connect) as the one data path;
custom objects (member Contact, Club w/ Club→Area→Market hierarchy, Payment, Visit,
+ a bridge object mapping many billing IDs → one Contact = the dedup fix);
subscription attributes flattened onto Contact; door-scan → app DB → middleware →
Visit records; embedded Stripe action card on the record sidebar; retries + audit
logs + rerun-failed-sync.
**Rep lesson:** the Custom-Code-action vs. middleware decision; custom objects +
association hierarchy for a non-deal business; UI extension cards; webhooks landing
in middleware (ordering/retries/dedup) not pointed straight at HubSpot.
**Confirmed in source:** ~5,000 previously blocked contacts addressed. Other ROI [not in source].

## CS-05 · High-volume legal intake as a HubSpot system of record — Series III
**Angle:** When the scheduler is the bottleneck — rebuilding high-velocity intake.
**Archetype:** high-volume, multi-office consumer law firm (family/probate/criminal),
~11 offices, distributed intake team.
**Hard HubSpot problem:** the booking tool didn't sync meeting context or
auto-associate meeting↔contact↔deal → manual entry, spreadsheet reporting, broken
dashboards; assignment was pure availability round-robin (no weighting by tier/
office/practice, no buffer times, no per-office calendar sync); generic legal
case-management tools ignore sales/top-of-funnel.
**What we did:** Client Engagement Center as a **Ticket pipeline** for the year-long
post-sale lifecycle (~22 workflows, lifecycle emails, SLAs); **lifecycle deal
gating** (block SQL→Prospect until a qualifying consult completes); **deal-recycle
workflow** (no activity 30d + close date >90d past → revert to Lead, round-robin
reassign) against 400–500 stale deals; native intake-conversion dashboard;
owner-sync workflow; custom lead scoring on case economics (assets/trust size/court
date) not engagement; weighted round-robin routing model; a HubSpot-native
scheduler replacement (conditional intake forms, auto-association, two-way per-office
calendar sync).
**Rep lesson:** Tickets as a lifecycle object; activity-based deal gating + recycle
as accountability levers; custom-property scoring for consumer services; the
booking layer must write structured data back or the funnel is invisible.
**Caveat:** scheduler replacement at proposal stage; ROI [not in source].

## CS-06 · Hardware company: B2B lease + D2C in one portal — Series V / I
**Angle:** One HubSpot portal, two businesses — fixing CPQ, invoicing, and
e-commerce sync where transactional D2C collides with high-touch contract sales.
**Archetype:** sports-tech hardware company leasing devices to institutions on
multi-year contracts + a D2C web store.
**Hard HubSpot problem:** two motions in one Commerce Hub portal broke: blank
invoices (no customer/line items); e-commerce sync duplicated orders by lease term
and multiplied ship quantities (4yr × 6 items → 24 shipped); hard-coded lease docs;
D2C web-only products selectable in B2B quotes; no Shipped/Paid stages or
first-order flag for expansion reporting.
**What we did (in HubSpot):** custom line-item/quoting logic; PandaDoc contract gen;
custom React components; **custom-coded workflow actions** to reshape Shopify order
data (dedupe by term, preserve addresses, fix quantities); invoice logic; migration
of existing leases. Proposed later phase moves quoting off Commerce Hub — frame
carefully for a HubSpot-rep audience.
**Rep lesson:** custom-coded workflow actions as the escape hatch when the native
e-commerce connector maps wrong; required-field validation as an integrity gate;
product-catalog visibility to separate two motions; fulfillment-aware deal stages.
**Caveat:** later phase proposed; ROI [not in source].

---

## Series-fit summary
- Series I (Rev Systems Arch): CS-01, CS-02, CS-04, CS-06
- Series III (GTM Ops): CS-03, CS-05 (+CS-02 channel)
- Series V (Commercial Strategy): CS-06

## Product tie-ins (RevOps HQ / RevPlatform) — see MEMORY note
Publicly the products present as their own brands (RevPlatform, RevOps Connect),
not cross-branded to RevOps HQ. **RevOps Connect** (middleware, revopsconnect.io) is
the natural hero of any "HubSpot + [system]" integration story (CS-04, CS-02).
Safe-to-reference shipped modules: RevOps Connect, RevCPQ, Field Pro, Schedule Pro,
MiniMap, RevGTM, RevAudit. Treat the five "July 2026" modules (Cortex, RevERP,
RevPortal, RevAgents, RevChat) as roadmap until GA-confirmed.

## Next actions
- Pick 1–2 to author first (CS-01 RIA/Redtail and CS-04 middleware are the strongest,
  most rep-educational). Author standalone HTML → extract → PDF → registry (type
  'Case Study') → they appear on /downloads.
- Get Paul to confirm any metric before it's published (all ROI is currently
  [not in source]).
