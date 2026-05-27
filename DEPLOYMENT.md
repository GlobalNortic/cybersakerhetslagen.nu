# Deploying cybersakerhetslagen.nu to Vercel

This project is a public, frontend-only lead-generation site. No database, no auth, no SaaS backend. Lead and partner submissions are forwarded by **two small Vercel Serverless Functions** (`api/lead.ts`, `api/partner.ts`) to a private webhook URL — no lead data is stored in this app.

## Framework

- **Framework:** TanStack Start (Vite + React 19), shipped to Vercel as a static SPA build.
- **The repo also contains a Cloudflare Worker config (`wrangler.jsonc`)** used by the Lovable preview sandbox. Vercel ignores it — you don't need to remove it.

## 1. Build settings (Vercel project → Settings → Build & Development)

- **Framework preset:** Vite
- **Build command:** `vite build`
- **Output directory:** `dist`
- **Install command:** `npm install` (or `bun install`)
- **Node version:** 20.x or newer

A `vercel.json` is included with the same settings, plus a SPA rewrite so client-side TanStack Router routes (e.g. `/branscher/energi`, `/stad/stockholm`) work on hard reload. The rewrite excludes `/api/*` so serverless functions are reachable.

## 2. Environment variables

All variables are **server-side only** — set them in **Vercel → Project → Settings → Environment Variables** for `Production` (and optionally `Preview`). They are read by the Node serverless functions in `api/`. Do NOT prefix with `VITE_` or `NEXT_PUBLIC_` — that would expose them in the client bundle.

| Variable | Required | Purpose |
| --- | --- | --- |
| `LEAD_WEBHOOK_URL` | Optional | If set, `POST /api/lead` forwards JSON to this URL. If unset, the endpoint accepts the submission and returns `{ ok: true, mode: "mock" }`. |
| `PARTNER_WEBHOOK_URL` | Optional | Same, for `POST /api/partner`. |

A `.env.example` is included for reference. Re-deploy after changing env vars.

### Webhook payload shape

```json
// POST to LEAD_WEBHOOK_URL
{ "type": "lead", "namn": "...", "foretag": "...", "epost": "...", "telefon": "...", "roll": "...", "sektor": "...", "kommentar": "...", "resultat": "vasentlig|viktig|behover_granskas|ej_omfattas", "titel": "..." }

// POST to PARTNER_WEBHOOK_URL
{ "type": "partner", "namn": "...", "foretag": "...", "epost": "...", "telefon": "...", "tjansteomrade": "...", "geografi": "...", "beskrivning": "..." }
```

No PII is stored in localStorage, cookies, or any Lovable backend.

## 3. Production lead capture status

- **Without env vars set:** active end-to-end (browser → `/api/lead` or `/api/partner` → 200 ok), but the submission is **not delivered anywhere** — effectively mock mode. The user still sees the success message.
- **With env vars set:** active end-to-end and forwarded to your private webhook.

## 4. SEO files

- `/robots.txt` and `/sitemap.xml` are shipped as **static files in `public/`** so they are always served correctly on Vercel without any server runtime.
- If you add or remove industries / cities in `src/lib/industries.ts`, regenerate `public/sitemap.xml`.

## 5. Custom domain `cybersakerhetslagen.nu`

In Vercel → Project → Settings → Domains:

1. Click **Add** and enter `cybersakerhetslagen.nu`. Add `www.cybersakerhetslagen.nu` too and let Vercel redirect one to the other (recommend apex as primary).
2. At your DNS registrar, set the records Vercel shows:
   - Apex (`@`): **A** record → `76.76.21.21`
   - `www`: **CNAME** → `cname.vercel-dns.com`
3. Wait for DNS propagation. Vercel auto-provisions HTTPS (Let's Encrypt).
4. Verify `https://cybersakerhetslagen.nu/sitemap.xml` and `/robots.txt` return 200 with the right content type.
5. In **Google Search Console**, add the property and submit `https://cybersakerhetslagen.nu/sitemap.xml`.

## 6. Adding the webhook later (no code change required)

1. Create a webhook endpoint in Make / n8n / Zapier / HubSpot / your CRM.
2. Copy its URL.
3. In Vercel env vars, set `LEAD_WEBHOOK_URL` and/or `PARTNER_WEBHOOK_URL`.
4. Trigger a redeploy. The serverless functions will start forwarding submissions on success.

## 7. Vercel readiness checklist

- [x] Static `public/robots.txt` present
- [x] Static `public/sitemap.xml` present
- [x] `vercel.json` with SPA rewrite (excludes `/api/*`) + correct content types
- [x] Build command `vite build`, output `dist`
- [x] Serverless functions `api/lead.ts` and `api/partner.ts` (Node runtime)
- [x] Webhook URLs read from server-side `process.env` only — never bundled into the client
- [x] No Supabase, no auth, no DB, no Lovable Cloud
- [x] No lead data stored anywhere in the app
- [x] All routes reachable on hard refresh (SPA fallback)
- [x] OG/Twitter metadata + JSON-LD per route

## 8. Remaining setup outside Lovable

1. Create the Vercel project and connect this Git repo.
2. Configure `LEAD_WEBHOOK_URL` and `PARTNER_WEBHOOK_URL` (when you have a CRM endpoint).
3. Add and verify the custom domain in Vercel.
4. Update DNS at the registrar.
5. Submit sitemap to Google Search Console + Bing Webmaster Tools.
6. (Optional) Add a cookie/analytics banner before enabling any analytics script.
7. (Optional) Add signature verification / rate limiting / spam filtering inside `api/lead.ts` and `api/partner.ts` if abuse becomes an issue.
