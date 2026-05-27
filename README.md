# cybersakerhetslagen.nu

Public Swedish lead-generation site for preliminary NIS2 / Cybersakerhetslagen assessment.

This is the source export from Lovable for:

https://cybersakerhetslagen.nu/

## Scope

- Public website
- Preliminary assessment flow
- Industry pages
- Contact and partner forms
- Vercel serverless functions for lead and partner email handling

This is not the `astro-verify` SaaS product. Do not add Supabase, auth, memberships, billing, dashboards, or SaaS data models here.

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The Vercel output directory is `dist`.

## Environment Variables

Server-side only. Never prefix these with `VITE_`.

```bash
BREVO_API_KEY=
LEAD_TO_EMAIL=
PARTNER_TO_EMAIL=
```

Use `.env.example` as a template. Do not commit real `.env` files.

## Deployment

See `DEPLOYMENT.md`.

Vercel project:

`cybersakerhetslagen`
