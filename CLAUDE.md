# RevOps HQ — White Paper Library

A Next.js (App Router) site that hosts RevOps HQ research papers using the
**RevOps HQ design system**, with **email-gated PDF downloads** that push leads
into HubSpot. Built to scale to many papers with near-zero per-paper effort.

**Live:** https://revopshq-white-papers.vercel.app
**Repo:** https://github.com/paulcmaxwell/revopshq-white-papers (auto-deploys on push to `main`)

---

## How this project works (read before editing)

- **Papers are data, not pages.** One registry (`content/papers/index.ts`) drives
  the homepage cards, the reader route, and the gated download. Add a paper =
  add a file + one registry entry. Nothing else changes.
- **The design system is the product.** The paper CSS (`content/paper.css`) is
  a scoped copy of the same system used to author each standalone paper. Site
  chrome + tokens live in `app/globals.css`. Both share the token block — edit
  tokens in ONE place (`:root` in `globals.css`).
- **Large assets ship via Git, not the deploy payload.** The approved PDF and the
  paper body HTML are committed binaries/large files. In production they're read
  from the Git checkout; `lib/papers.ts` also has a raw-URL fetch fallback.
- **Lead capture is the unauthenticated HubSpot Forms API** (`lib/hubspot.ts`) —
  no private-app token. `email`/`firstname`/`lastname`/`company` map to their
  fields; the "HubSpot user?" answer + which paper are compiled into the
  standard `message` field. The `hubspotutk` cookie is forwarded for attribution.

## Architecture map

```
app/
  layout.tsx                Nav + Footer + theme script + HubSpot tracking pixel
  page.tsx                  library homepage (hero + card grid)
  papers/[slug]/page.tsx    reader (renders paper body) + gated download bar
  api/lead/route.ts         validate → HubSpot Forms API → set unlock cookie
  api/download/route.ts     serve the PDF only when the unlock cookie is present
  icon.svg                  favicon (green-squares mark) — Next auto-wires it
  opengraph-image.png       social card — Next auto-wires it
components/
  DownloadGate.tsx          the gated modal form (client)
  Nav / Footer / Wordmark / ThemeToggle / PaperCard
content/
  papers/index.ts           THE REGISTRY — edit to publish
  papers/<slug>.body.html   extracted <article> markup (generated)
  paper.css                 scoped design-system CSS (generated)
  sources/<slug>.html       standalone authored source (truth for web + PDF)
  pdfs/<slug>.pdf           approved PDF (committed)
lib/
  papers.ts   loadBody / loadPdf (local file → raw-URL fallback)
  hubspot.ts  submitLeadToHubSpotForm (Forms API)
  gate.ts     unlock cookie + email validation
scripts/
  extract-source.mjs   standalone HTML → body.html + paper.css
  build-pdfs.mjs        standalone HTML → committed PDF (needs local Chrome)
```

## Design tokens (single source: `app/globals.css`)

| token | light | meaning |
|---|---|---|
| `--paper` / `--paper-2` | `#F7F8F6` / `#FFFFFF` | grounds |
| `--ink` / `--ink-2` / `--ink-3` | `#14201C` / `#4A5A53` / `#74847C` | text ramp |
| `--accent` / `--accent-2` | `#0E6B4E` / `#0B5A41` | RevOps emerald |
| `--mint` | `#8FD3B6` | the offset square / accents |
| `--clay` | `#A8603C` | constraints / warnings |
| `--amber` | `#B08419` | "moderate" state |

Type: `--serif` (Iowan/Palatino → Source Serif fallback) for reading; `--sans`
(Avenir Next → system) for chrome/labels; `--mono` for data/code. Full light +
dark + `[data-theme]` overrides are defined once in `globals.css`.

**The mark:** an emerald rounded square with a mint square offset behind it
(down-right). It is the brand's atom — favicon, wordmark, OG. Keep it.

## Commands

```bash
npm run dev            # local dev
npm run build          # production build (run before pushing risky changes)
npm run extract -- content/sources/<slug>.html <slug>   # regen web body + css
npm run build:pdfs -- <slug>                            # regen the gated PDF (needs Chrome)
```

## Deploy

Push to `main` → Vercel auto-builds and promotes to production. Verify with the
`deploy-and-verify` skill. The project lives on Vercel team
`paulcmaxwellgmailcoms-projects`.

## Gotchas (learned the hard way — do not repeat)

- **Next.js version:** Vercel HARD-BLOCKS production deploys on versions with an
  open CVE (the build "completes" then the deploy state goes `ERROR` with no
  obvious log line). Keep `next` on a patched release. This cost a full debug
  loop — check the Next version FIRST if a build completes but deploy errors.
- **Never inline large binaries into `deploy_to_vercel`.** The Read tool caps
  long single-line files, so base64 blobs can't be transcribed reliably. Ship
  binaries through Git (that's why the project is git-linked to Vercel).
- **Tokens live once.** Don't fork palette values into `paper.css`; it only
  consumes the vars.
- **Downloads must never block on HubSpot.** `submitLeadToHubSpotForm` is
  best-effort and always logs the lead; the unlock cookie is set regardless.

## Adding a white paper

Use the **`new-white-paper`** skill. In short: author the standalone HTML in the
design system → `npm run extract` → `npm run build:pdfs` → add a registry entry
→ commit + push.
