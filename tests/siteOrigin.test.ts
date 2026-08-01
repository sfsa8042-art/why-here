/**
 * Site-origin resolution (Public Atlas V2, Stage 7.1). Canonical + Open Graph
 * URLs must be absolute in production; the origin resolves NEXT_PUBLIC_SITE_URL →
 * Vercel production domain → localhost, and a malformed configured value throws.
 */

import { describe, expect, it } from 'vitest';
import { resolveSiteOrigin, absoluteUrl } from '@/lib/siteOrigin';
import { metadata as exploreMetadata } from '@/app/atlas/netherlands-semiconductor-equipment/page';

describe('resolveSiteOrigin', () => {
  it('prefers an explicit NEXT_PUBLIC_SITE_URL', () => {
    expect(resolveSiteOrigin({ NEXT_PUBLIC_SITE_URL: 'https://why-here.example' })).toBe('https://why-here.example');
    // normalised to origin (path/trailing slash stripped)
    expect(resolveSiteOrigin({ NEXT_PUBLIC_SITE_URL: 'https://why-here.example/atlas/' })).toBe('https://why-here.example');
  });

  it('falls back to the Vercel production domain (https)', () => {
    expect(resolveSiteOrigin({ VERCEL_PROJECT_PRODUCTION_URL: 'why-here.vercel.app' })).toBe('https://why-here.vercel.app');
  });

  it('uses localhost only for local development', () => {
    expect(resolveSiteOrigin({})).toBe('http://localhost:3000');
  });

  it('throws on a malformed configured origin (never silently emits a broken URL)', () => {
    expect(() => resolveSiteOrigin({ NEXT_PUBLIC_SITE_URL: 'not a url' })).toThrow(/NEXT_PUBLIC_SITE_URL/);
    expect(() => resolveSiteOrigin({ NEXT_PUBLIC_SITE_URL: 'ftp://why-here.example' })).toThrow(/http/);
    expect(() => resolveSiteOrigin({ VERCEL_PROJECT_PRODUCTION_URL: 'has spaces here' })).toThrow();
  });

  it('the precedence order is explicit → vercel → localhost', () => {
    expect(resolveSiteOrigin({ NEXT_PUBLIC_SITE_URL: 'https://a.example', VERCEL_PROJECT_PRODUCTION_URL: 'b.vercel.app' })).toBe('https://a.example');
  });
});

describe('metadata resolves from the selected origin', () => {
  const ORIGIN = 'https://why-here.example';
  const canonical = (exploreMetadata.alternates as { canonical?: string }).canonical!;
  const ogImage = (exploreMetadata.openGraph as { images?: { url: string }[] }).images![0]!.url;

  it('the canonical Explore URL is absolute under a production origin', () => {
    expect(new URL(canonical, `${ORIGIN}/`).toString()).toBe('https://why-here.example/atlas/netherlands-semiconductor-equipment');
  });

  it('the Open Graph / Twitter image is a local asset that becomes absolute under the origin', () => {
    expect(ogImage.startsWith('http')).toBe(false); // stored as a local path, not an external URL
    expect(absoluteUrl(ogImage)).toBe('http://localhost:3000/media/netherlands-semiconductor-equipment/Binnenstad_Eindhoven.jpg');
    expect(new URL(ogImage, `${ORIGIN}/`).toString()).toBe('https://why-here.example/media/netherlands-semiconductor-equipment/Binnenstad_Eindhoven.jpg');
  });
});
