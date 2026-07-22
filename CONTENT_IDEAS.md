# Revenue Foundations — Content Ideas

Two kinds of content, one standard: **information-forward, first-principles,
model-first.** No curiosity-gap headlines, no "the mistake everyone makes," no
gating the ideas. A title should describe the model the piece builds.

- **Educational resources** (white papers, references, calculators): teach a
  transferable model from first principles. Illustrative worked examples, not
  client results.
- **Case studies** (`CASE_STUDIES.md`): the same models, grounded in a real
  anonymized engagement, carrying representative results.

Each maps to a **series** (`content/series.ts`). Publish via the
`new-white-paper` skill. Interactive companions are educational, **ungated**;
only the PDF download sits behind the email form.

Status: `[ ]` idea · `[~]` drafting · `[x]` shipped

## Shipped
- [x] No. 01 · White Paper — Integration Modeling for HubSpot Data Hub
- [x] No. 02 · Comparative Review — Attribution & Channel Economics (+ model simulator)
- [x] No. 03 · Reference — HubSpot Credit Consumption Reference (+ estimator)
- [x] No. C1 · Case Study — RIA wealth CRM: Redtail → HubSpot object model

## Series I — Revenue Systems Architecture
- [ ] **A model for CRM migration:** inventory the source model → map entities to
      objects → identify what has no native home. The general framework behind C1.
- [ ] **Deduplication as an identity model:** match keys, survivorship rules, and
      idempotence — why "merge duplicates" is a data-modeling decision, not a button.
- [ ] **Custom objects vs. properties vs. associations:** a decision model for what
      becomes an object, and the Enterprise object budget as a real constraint.
- [ ] **Reference:** HubSpot API rate limits and the batch/backoff patterns that
      respect them — a working model for reliable bulk operations.

## Series II — Attribution & Measurement
- [ ] **Attribution windows as a decision model:** matching the window to the sales
      motion, and the bias each choice introduces (worked, illustrative).
- [ ] **Sourced vs. influenced pipeline:** a definitional model finance will accept,
      with the association logic that produces each number.
- [ ] **Reference:** the metric family — CPA, CAC, LTV, payback, LTV:CAC — defined
      from first principles with one consistent worked example.

## Series III — GTM Operations
- [ ] **A model for lifecycle stages:** entry/exit criteria, ownership, and how the
      stage set encodes the revenue definition (not a "best practices" listicle).
- [ ] **Lead routing as an allocation model:** weighted round-robin, capacity, and
      SLA enforcement expressed as rules a system can hold.
- [ ] **The intake layer as a data contract:** what a booking/scheduling system must
      write back to the CRM for the funnel to be measurable at all.

## Series IV — Revenue Intelligence
- [ ] **What a forecast can and cannot know:** a model of the pipeline data quality a
      trustworthy forecast depends on.
- [ ] **Signal vs. noise in intent data:** a model for wiring first- and third-party
      signals into a queue without drowning reps.

## Series V — Commercial Strategy
- [ ] **Pricing & packaging as an architecture:** tiers, add-ons, and the structural
      ceiling they set on ASP.
- [ ] **Segmentation as a coverage model:** how the segmentation you choose determines
      routing, CS coverage, and reporting.

## Tools (interactive, educational, ungated)
- [x] HubSpot credit estimator (on No. 03)
- [x] Attribution model simulator (on No. 02)
- [ ] Unit-economics model: CPA / CAC / LTV / payback in one worked calculator
- [ ] Attribution-readiness model: score the conditions your CPA numbers depend on
- [ ] RevOps maturity model: a four-dimension self-assessment with a dimension map

## Explainer covers ("NNN 101" template)
Template: `cpa-101-thumbnail.html` in the Drive root (1280×720, render via headless
Chrome). Plain-language term explainers: CAC, TAM, LTV, MQL/SQL, payback.
