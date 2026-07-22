# RevOps HQ — White Paper Library

A Next.js site that hosts RevOps HQ white papers using the RevOps HQ design
system, with email-gated PDF downloads that sync leads to HubSpot.

## Stack

- Next.js (App Router) + React, TypeScript
- No runtime dependencies beyond Next/React — PDFs are pre-rendered and committed
- Leads → HubSpot CRM (best-effort; downloads never block on it)

## Local dev

```bash
npm install
npm run dev        # http://localhost:3000
```

## Adding a white paper

1. Author the paper as a **standalone HTML file** using the RevOps HQ design
   system (same markup/tokens as `content/sources/datahub-integration.html`).
2. Save it to `content/sources/<slug>.html`.
3. Extract the web body and render the gated PDF:
   ```bash
   npm run extract -- content/sources/<slug>.html <slug>
   npm run build:pdfs -- <slug>
   ```
4. Add an entry to the array in `content/papers/index.ts`.
5. Commit and redeploy. The card, reader page, and gated download appear
   automatically.

> `build:pdfs` needs a local Chrome/Chromium. Override the binary with
> `CHROME=/path/to/chrome npm run build:pdfs`.

## Lead capture

The download form collects **first name, last name, work email, company, and
whether they're a current HubSpot user**. On submit the lead is:

1. Logged to the function logs (always).
2. Pushed to HubSpot as a contact if `HUBSPOT_PRIVATE_APP_TOKEN` is set.
3. Granted an httpOnly unlock cookie so the PDF downloads.

See `.env.example` for configuration. A CRM failure never blocks a download.

## Layout

```
app/
  page.tsx                 library homepage
  papers/[slug]/page.tsx   reader + gated download
  api/lead/route.ts        capture + HubSpot sync + unlock cookie
  api/download/route.ts    serves the PDF only when unlocked
content/
  papers/index.ts          the registry (edit to publish)
  sources/<slug>.html      standalone source (truth for web + PDF)
  papers/<slug>.body.html  extracted web body  (generated)
  paper.css                scoped design-system CSS (generated)
  pdfs/<slug>.pdf          gated PDF            (generated, committed)
```
