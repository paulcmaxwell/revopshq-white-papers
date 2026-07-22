---
name: deploy-and-verify
description: Deploy this site to Vercel and confirm the live gated-download + HubSpot flow actually works. Use after any push, or when a deploy fails. Includes the exact failure modes seen on this project.
---

# Deploy & verify

Vercel is Git-linked: **push to `main` → auto-deploy**. Do not use
`deploy_to_vercel` (inline files) — large binaries can't be transcribed and it
hit team-permission 403s. Git is the deploy channel.

## Ship
```bash
git add -A && git commit -m "…" && git push
```

## Watch the deploy
Use the Vercel MCP tools with project `revopshq-white-papers`, team
`team_cnyxerJh4mFeK0B6I6XEXnpB`:
- `list_deployments` → newest deployment `state` should reach `READY`.
- If `state: ERROR`, `get_deployment_build_logs` (try `errorsOnly`, then a full
  `tail`).

## Known failure modes (check in this order)
1. **`next` version CVE block.** If the build log says *"Build Completed"* but
   the deployment state is `ERROR`, it's almost always Vercel refusing a Next
   version with an open advisory (e.g. CVE-2025-66478 on 15.5.4). Fix:
   `npm view next versions` → bump to the patched backport (e.g. 15.5.21) →
   `npm install` → commit `package.json` + `package-lock.json` → push.
2. **Type/build error.** Reproduce locally with `npm run build`; fix; push.
3. **Missing asset at runtime.** `loadBody`/`loadPdf` fall back to the repo raw
   URL — make sure `content/papers/<slug>.body.html` and
   `content/pdfs/<slug>.pdf` are committed.

## Verify the live flow (production URL)
```bash
B="https://revopshq-white-papers.vercel.app"
curl -s -o /dev/null -w "%{http_code}\n" "$B/"                                  # 200
curl -s -o /dev/null -w "%{http_code}\n" "$B/api/download?slug=<slug>"          # 303 (gated)
curl -s -c /tmp/j.txt -X POST "$B/api/lead" -H 'Content-Type: application/json' \
  -H "referer: $B/papers/<slug>" \
  -d '{"slug":"<slug>","firstName":"Live","lastName":"Check","email":"you@revopshq.com","company":"RevOps HQ","hubspotUser":"no"}'
# expect {"ok":true,"synced":true,...}  (synced=true means HubSpot Forms API 200)
curl -s -b /tmp/j.txt -o /tmp/live.pdf -w "%{http_code} %{content_type} %{size_download}\n" \
  "$B/api/download?slug=<slug>"                                                  # 200 application/pdf
head -c4 /tmp/live.pdf                                                           # %PDF
```
`synced:false` just means HubSpot didn't 200 (bad field name / form change) —
the download still works and the lead is logged. Investigate via the function
logs, not by blocking the user.
