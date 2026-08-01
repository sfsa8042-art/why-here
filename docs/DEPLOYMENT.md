# Deployment

## Public site origin (required for correct metadata)

Canonical URLs and Open Graph / Twitter share images must be **absolute** in
production. The origin is resolved by `lib/siteOrigin.ts` in this order:

1. **`NEXT_PUBLIC_SITE_URL`** — an explicit absolute `http(s)` origin (any
   environment). Example: `https://why-here.example`.
2. **`https://${VERCEL_PROJECT_PRODUCTION_URL}`** — Vercel's production domain,
   injected automatically on Vercel.
3. `http://localhost:3000` — local development fallback only.

A configured value that is not a valid absolute `http(s)` URL **fails the build**
rather than silently emitting a broken canonical/OG URL. No deployment URL is
hardcoded in source.

### Configure on Vercel

Set **one** of the following (Project → Settings → Environment Variables):

- **Recommended — `NEXT_PUBLIC_SITE_URL`** = your canonical production origin,
  e.g. `https://why-here.vercel.app` (or your custom domain,
  `https://why-here.example`). Scope it to the **Production** (and Preview, if
  desired) environments.
- Or rely on Vercel's built-in **`VERCEL_PROJECT_PRODUCTION_URL`** (no manual
  setup needed) — used automatically when `NEXT_PUBLIC_SITE_URL` is unset.

`NEXT_PUBLIC_SITE_URL` takes precedence and is the only variable you normally
need to set.
