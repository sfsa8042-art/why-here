/**
 * lib/atlasCases.ts — the AtlasCase registry contract (Public Atlas V2, Stage 1).
 *
 * Zod is the source of truth; TypeScript types are inferred. This is the
 * NAVIGATION / discovery layer, deliberately separate from the evidence corpus:
 * it never reuses Place or ClaimPlaceLink. `navigationGeometry` locates and opens
 * a case; it is NOT evidence that an event occurred at that point/centroid.
 *
 * `getAtlasCases()` validates the registry (schema + R-series rules) and THROWS
 * on any failure, so a malformed registry is build-blocking (the /atlas server
 * component loads it at build time). Selectors and GeoJSON generation are pure.
 */

import { z } from 'zod';
import { atlasCases as rawAtlasCases } from '../content/atlas/cases.ts';

/* ------------------------------------------------------------------ *
 * Schema (authoritative)
 * ------------------------------------------------------------------ */

export const AtlasCaseStatusSchema = z.enum(['published', 'in_research', 'planned']);
export type AtlasCaseStatus = z.infer<typeof AtlasCaseStatusSchema>;

export const AtlasAvailableModeSchema = z.enum(['explore', 'evidence']);
export type AtlasAvailableMode = z.infer<typeof AtlasAvailableModeSchema>;

const NavigationPointSchema = z.object({
  type: z.literal('point'),
  longitude: z.number().min(-180).max(180),
  latitude: z.number().min(-90).max(90),
  precision: z.enum(['country', 'region']),
  source: z.string().min(1),
  attributionText: z.string().min(1),
});

const NavigationCountrySchema = z.object({
  type: z.literal('country'),
  countryCode: z.string().regex(/^[A-Z]{2}$/, 'ISO 3166-1 alpha-2 code'),
  source: z.string().min(1),
  attributionText: z.string().min(1),
});

export const AtlasNavigationGeometrySchema = z.discriminatedUnion('type', [
  NavigationPointSchema,
  NavigationCountrySchema,
]);
export type AtlasNavigationGeometry = z.infer<typeof AtlasNavigationGeometrySchema>;

export const AtlasCaseSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'lowercase-kebab slug'),
  country: z.string().min(1),
  region: z.string().min(1).optional(),
  industry: z.string().min(1),
  title: z.string().min(1),
  shortQuestion: z.string().min(1),
  summary: z.string().min(1),
  status: AtlasCaseStatusSchema,
  navigationGeometry: AtlasNavigationGeometrySchema,
  coverMediaId: z.string().min(1).optional(),
  availableModes: z.array(AtlasAvailableModeSchema),
});
export type AtlasCase = z.infer<typeof AtlasCaseSchema>;

/** The launched public case (Stage 7): Explore + Evidence. */
const LAUNCHED_EXPLORE_SLUG = 'netherlands-semiconductor-equipment';

/* ------------------------------------------------------------------ *
 * Validation — R-series (build-blocking via getAtlasCases)
 * ------------------------------------------------------------------ */

export interface AtlasRegistryFailure {
  ruleId: string;
  caseId: string;
  message: string;
}

export function validateAtlasRegistry(input: unknown): AtlasRegistryFailure[] {
  const failures: AtlasRegistryFailure[] = [];

  const parsed = z.array(AtlasCaseSchema).safeParse(input);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      failures.push({
        ruleId: 'R0-schema',
        caseId: String(issue.path[0] ?? '?'),
        message: `${issue.path.join('.')}: ${issue.message}`,
      });
    }
    return failures; // semantic rules require well-formed data
  }

  const cases = parsed.data;
  const idCounts = new Map<string, number>();
  const slugCounts = new Map<string, number>();
  for (const c of cases) {
    idCounts.set(c.id, (idCounts.get(c.id) ?? 0) + 1);
    slugCounts.set(c.slug, (slugCounts.get(c.slug) ?? 0) + 1);
  }

  for (const c of cases) {
    // R1 — unique ids and slugs
    if ((idCounts.get(c.id) ?? 0) > 1)
      failures.push({ ruleId: 'R1-unique-id', caseId: c.id, message: `duplicate id "${c.id}"` });
    if ((slugCounts.get(c.slug) ?? 0) > 1)
      failures.push({ ruleId: 'R1-unique-slug', caseId: c.id, message: `duplicate slug "${c.slug}"` });

    // R2/R3 — valid navigation coordinates/country code + source + attribution
    // (coordinate ranges, country-code shape, and non-empty source/attribution
    // are enforced by the schema above; this is a guard for the 'country' variant
    // which Stage 1 does not use but must still carry a code.)
    const g = c.navigationGeometry;
    if (g.type === 'country' && !/^[A-Z]{2}$/.test(g.countryCode))
      failures.push({ ruleId: 'R2-nav-geometry', caseId: c.id, message: 'invalid ISO country code' });

    // R4 — planned cases have availableModes: []
    if (c.status === 'planned' && c.availableModes.length !== 0)
      failures.push({ ruleId: 'R4-planned-no-modes', caseId: c.id, message: 'planned case must have availableModes: []' });

    // R5 — 'explore' cannot exist without 'evidence'
    if (c.availableModes.includes('explore') && !c.availableModes.includes('evidence'))
      failures.push({ ruleId: 'R5-explore-needs-evidence', caseId: c.id, message: "'explore' cannot exist without 'evidence'" });

    // R6 — no duplicate modes
    if (new Set(c.availableModes).size !== c.availableModes.length)
      failures.push({ ruleId: 'R6-no-dup-modes', caseId: c.id, message: 'duplicate availableModes entries' });
  }

  // R7 — the launched public case (Netherlands, Stage 7) exposes exactly
  // ['explore', 'evidence']. The Explore GATE (supported chapters, prose→Claims,
  // media rights) is enforced separately + build-blocking by lib/exploreGate.ts.
  const nl = cases.find((c) => c.slug === LAUNCHED_EXPLORE_SLUG);
  if (nl) {
    const modes = [...nl.availableModes].sort().join(',');
    if (modes !== 'evidence,explore')
      failures.push({
        ruleId: 'R7-nl-explore-evidence',
        caseId: nl.id,
        message: "Netherlands must have availableModes exactly ['explore', 'evidence']",
      });
  }

  return failures;
}

/* ------------------------------------------------------------------ *
 * Loader (build-blocking) + selectors (pure)
 * ------------------------------------------------------------------ */

let cached: readonly AtlasCase[] | null = null;

export function getAtlasCases(): readonly AtlasCase[] {
  if (cached !== null) return cached;
  const failures = validateAtlasRegistry(rawAtlasCases);
  if (failures.length > 0) {
    const detail = failures.map((f) => `  ${f.ruleId} [${f.caseId}]: ${f.message}`).join('\n');
    throw new Error(`AtlasCase registry invalid (${failures.length} failure(s)):\n${detail}`);
  }
  cached = z.array(AtlasCaseSchema).parse(rawAtlasCases);
  return cached;
}

export type StatusFilterValue = 'all' | AtlasCaseStatus;

export function casesByStatus(cases: readonly AtlasCase[], status: StatusFilterValue): AtlasCase[] {
  return status === 'all' ? [...cases] : cases.filter((c) => c.status === status);
}

export function casesByIndustry(cases: readonly AtlasCase[], industry: string | null): AtlasCase[] {
  return industry === null ? [...cases] : cases.filter((c) => c.industry === industry);
}

/** Distinct industries present in the registry, sorted — the only filter dataset. */
export function industryOptions(cases: readonly AtlasCase[]): string[] {
  return [...new Set(cases.map((c) => c.industry))].sort();
}

export function caseBySlug(cases: readonly AtlasCase[], slug: string): AtlasCase | null {
  return cases.find((c) => c.slug === slug) ?? null;
}

/** Whether a case exposes a public Explore CTA (only if it passed the Explore gate). */
export function hasExploreCta(c: AtlasCase): boolean {
  return c.availableModes.includes('explore');
}
export function hasEvidenceCta(c: AtlasCase): boolean {
  return c.availableModes.includes('evidence');
}

/* ------------------------------------------------------------------ *
 * Navigation GeoJSON — role: 'navigation' ONLY, never evidence geometry.
 * ------------------------------------------------------------------ */

export interface NavigationFeature {
  type: 'Feature';
  geometry: { type: 'Point'; coordinates: [number, number] };
  properties: {
    role: 'navigation';
    caseId: string;
    slug: string;
    status: AtlasCaseStatus;
    industry: string;
    title: string;
    country: string;
  };
}

export interface NavigationFeatureCollection {
  type: 'FeatureCollection';
  features: NavigationFeature[];
}

/**
 * Build the navigation GeoJSON from (already-filtered) cases. Every feature is
 * tagged `role: 'navigation'` and carries ONLY navigation properties — no Claim,
 * Place, or ClaimPlaceLink identifiers ever enter this collection.
 */
export function navigationFeatureCollection(cases: readonly AtlasCase[]): NavigationFeatureCollection {
  const features: NavigationFeature[] = [];
  for (const c of cases) {
    const g = c.navigationGeometry;
    if (g.type !== 'point') continue; // Stage 1 uses representative points only
    features.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [g.longitude, g.latitude] },
      properties: {
        role: 'navigation',
        caseId: c.id,
        slug: c.slug,
        status: c.status,
        industry: c.industry,
        title: c.title,
        country: c.country,
      },
    });
  }
  return { type: 'FeatureCollection', features };
}
