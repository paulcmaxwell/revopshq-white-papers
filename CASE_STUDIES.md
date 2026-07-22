# Revenue Foundations — Case Studies as first-principles models

Real RevOps HQ engagements, written as **educational, model-first teardowns** —
not marketing case studies. The engagement is the *grounding example*; the value
is the **transferable model** a reader can apply to their own system. Information-
forward: synthesize, model, and teach. No click-bait, no gating the substance, no
manufactured drama.

## Voice & rules (read before drafting)
1. **Model first, story second.** Lead with the underlying structure (the data
   model, the identity problem, the two-motion conflict), then use the anonymized
   engagement to ground it. A reader should leave with a framework, not a vendor ad.
2. **Case studies carry results; educational resources don't.** Paul attests these
   engagements achieved real outcomes — they're just undocumented. Because the
   studies are fully anonymized (no client named), use **credible, representative,
   rounded numbers** consistent with the engagement — modest and defensible, never
   inflated. (Educational pieces — white papers, calculators — stay first-principles
   with transparently illustrative examples, no client-attributed results.)
   Provenance of case-study metrics: client-attested estimates, refine when documented.
3. **Anonymize completely.** Industry + model only — no names, cities, product
   names, or identifying combinations. Per-engagement anonymization notes are in the
   research briefs.
4. **Audience = people who run HubSpot.** Teach a hard HubSpot problem most reps and
   admins model wrong (custom objects, association labels, Enterprise-vs-Pro lines,
   sync/identity limits, Commerce Hub edges). Educate; don't sell.
5. **Don't gate the thinking.** The full argument reads free on the web; a PDF is a
   convenience, not a paywall on the ideas.

Each maps to a **series** and would ship as `type: 'Case Study'` — same shelf as the papers.

---

## CS-01 · The object-model gap between a wealth CRM and HubSpot — Series I
**Model:** How a single-table CRM (people/trusts/businesses distinguished by a type
flag) maps onto HubSpot's multi-object model — and the precise point where custom
objects stop being optional. Framework: *inventory the source model → map each
entity to an object → find what has no native home (Accounts, Households) → that is
your Enterprise line.*
**Grounding example:** a mid-market RIA migrating off Redtail (~11k contacts, ~3,300
accounts, ~3,300 households, ~9,000 relationships, ~180k notes).
**What the model teaches:** householding + trustee/beneficiary/COI webs need custom
**association labels + multiple labeled associations (Enterprise-only)**; investment
Accounts/Households have no native object → custom objects → Enterprise, not Pro;
an external-ID property is what makes a migration idempotent; compliance routing is
a workflow model, not a field. Grounded detail: Account + Household custom objects,
200+ typed properties parsed out of keyword blobs, threshold approval routing.

## CS-02 · Modeling the channel: when the buyer isn't the user — Series I / III
**Model:** CRMs assume buyer = customer. Channel businesses break that assumption.
Framework for representing *dealer vs. end-operator* on one account without the
association model collapsing (labels: Dealer / Employee / Customer), and why the
install base belongs in a custom object, not a deal.
**Grounding example:** a dealer-channel equipment manufacturer (serial-numbered
units, NetSuite + web store) that lost the end customer at point of sale.
**Teaches:** custom **Equipment** object as the install-base model; the Orders object
as the ERP bridge; association labels for channel; warranty capture as the
data-recovery loop; connector + serverless for what the connector can't carry.

## CS-03 · When the deal isn't the work: modeling project-based revenue — Series III
**Model:** A project business has two lifecycles — *winning the work* (sales) and
*doing the work* (production). Forcing both into one pipeline destroys forecasting.
Framework: separate the sales pipeline from the production lifecycle, and choose the
production object deliberately (repurposed **Ticket** vs. a Project custom object)
against the Enterprise object budget.
**Grounding example:** a project-based fabricator off a legacy PSA.
**Teaches:** Tickets-as-Projects; a discriminator property instead of parallel
custom objects; change orders as parent/child deals; the negative-line-item limit
and its workaround; pipeline stage *requirements* as gates; calculated roll-up
properties to make HubSpot a reporting surface it doesn't own.

## CS-04 · Identity resolution at the CRM boundary — Series I / IV
**Model:** The most common integration failure isn't fields — it's **identity**. When
a source system re-issues IDs (a billing platform minting a new customer on every
re-signup), a 1:1 native sync multiplies humans. Framework: the identity/dedup layer,
why native connectors structurally can't hold it, and the Custom-Code-action vs.
middleware decision (volume, ordering, backfill, dedup).
**Grounding example:** a multi-location membership business where native billing sync
had blocked ~5,000 contacts (the one in-source number).
**Teaches:** a bridge object mapping many source IDs → one Contact; custom objects +
association hierarchy for a non-deal business; webhooks landing in middleware for
ordering/retries; UI-extension action cards; when in-portal code is not enough.

## CS-05 · The intake layer as a data contract — Series III
**Model:** In a high-velocity services funnel, the booking/intake layer either writes
structured data back to the CRM or the entire funnel goes dark. Framework: treat the
scheduler as a data contract (meeting↔contact↔deal association, outcome/type/location
as properties), and model routing as a weighted allocation problem, not availability.
**Grounding example:** a high-volume, multi-office consumer law firm.
**Teaches:** Tickets as a post-sale lifecycle object; activity-based deal gating and
recycle as accountability models; custom-property scoring on case economics vs.
engagement scoring; why generic vertical CRMs lose the top-of-funnel.

## CS-06 · Two revenue motions, one system — Series V / I
**Model:** Transactional (D2C) and contractual (B2B) sales obey different rules;
running both in one portal without separating them corrupts quoting, invoicing, and
fulfillment. Framework: isolate the motions (catalog visibility, validation gates,
fulfillment-aware stages) so each stays clean.
**Grounding example:** a hardware company running institutional leases + a D2C store
in one Commerce Hub portal.
**Teaches:** custom-coded workflow actions as the escape hatch when a native
e-commerce connector maps wrong; required-field validation as an integrity gate;
catalog visibility to separate motions; fulfillment-aware deal stages + a first-order
flag for expansion reporting.

---

## Series fit
- Series I (Rev Systems Arch): CS-01, CS-02, CS-04, CS-06
- Series III (GTM Ops): CS-03, CS-05
- Series IV (Rev Intelligence): CS-04 (identity/data)
- Series V (Commercial Strategy): CS-06

## Product tie-ins (see MEMORY / revops-products)
Reference sparingly and only where it teaches: **RevOps Connect** (middleware) is the
honest protagonist of CS-04's identity model. Keep it educational, not an ad.

## Author order
CS-01 (object-model mapping) and CS-04 (identity resolution) are the most teachable
and least vendor-y — author those first.
