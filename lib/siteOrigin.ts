/**
 * lib/siteOrigin.ts — the single source of truth for the public site origin.
 *
 * Metadata (canonical URLs, Open Graph / Twitter images) must be ABSOLUTE in
 * production. Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL              (explicit, any environment)
 *   2. https://${VERCEL_PROJECT_PRODUCTION_URL}  (Vercel production domain)
 *   3. http://localhost:3000            (local development only)
 *
 * Configured values are validated as absolute http(s) URLs; a malformed value
 * THROWS rather than silently emitting a broken canonical/OG URL. No deployment
 * URL is hardcoded in source — production origin comes from the environment.
 */

function assertHttpOrigin(value: string, name: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${name} is not a valid absolute URL: "${value}"`);
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error(`${name} must be an http(s) URL: "${value}"`);
  }
  return url.origin; // normalised — scheme + host (+ port), no path/query/hash
}

/** Resolve the site origin from an env-like object (injectable for tests). */
export function resolveSiteOrigin(env: Record<string, string | undefined> = process.env): string {
  const explicit = env['NEXT_PUBLIC_SITE_URL']?.trim();
  if (explicit) return assertHttpOrigin(explicit, 'NEXT_PUBLIC_SITE_URL');

  const vercel = env['VERCEL_PROJECT_PRODUCTION_URL']?.trim();
  if (vercel) return assertHttpOrigin(`https://${vercel}`, 'VERCEL_PROJECT_PRODUCTION_URL');

  return 'http://localhost:3000';
}

/** The resolved absolute site origin (e.g. "https://why-here.example"). */
export function siteOrigin(): string {
  return resolveSiteOrigin();
}

/** Absolute URL for a root-relative path against the resolved origin. */
export function absoluteUrl(path: string): string {
  return new URL(path, `${siteOrigin()}/`).toString();
}
