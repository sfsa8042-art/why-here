/**
 * lib/atlasPresentation.ts — the typed country-presentation layer for the
 * map-first Atlas (Public Atlas V2, Stage 9.1).
 *
 * The Atlas country summary resolves its "Specialisation" label + atlas question
 * from this validated content record (linked to a case by slug), NOT from copy
 * hardcoded in the page or the client shell. Reading meta for an Explore-capable
 * case is derived live from its production chapters.
 *
 * `getCountryPresentations()` validates and THROWS on any failure (build-blocking):
 *   CP0 — schema + unique slugs;
 *   CP1 — every presentation links to a real atlas case;
 *   CP2 — every atlas case has a presentation (no country renders without one).
 */

import { z } from 'zod';
import { getAtlasCases } from './atlasCases.ts';
import { buildChaptersView } from './chapters.ts';
import { countryPresentations as rawCountryPresentations } from '../content/atlas/presentation.ts';

export const CountryPresentationSchema = z.object({
  slug: z.string().min(1),
  specialisation: z.string().min(1),
  question: z.string().min(1),
});
export type CountryPresentation = z.infer<typeof CountryPresentationSchema>;

/** The resolved Atlas country-summary view (specialisation + question + reading meta). */
export interface CountrySummaryView { specialisation: string; question: string; chapters?: number; minutes?: number }

export interface CountryPresentationFailure { ruleId: string; slug: string; message: string; }

export function validateCountryPresentations(input: unknown, caseSlugs: readonly string[]): CountryPresentationFailure[] {
  const failures: CountryPresentationFailure[] = [];
  const parsed = z.array(CountryPresentationSchema).safeParse(input);
  if (!parsed.success) {
    for (const i of parsed.error.issues) failures.push({ ruleId: 'CP0-schema', slug: String(i.path[0] ?? '?'), message: `${i.path.join('.')}: ${i.message}` });
    return failures;
  }
  const rows = parsed.data;
  const known = new Set(caseSlugs);
  const seen = new Set<string>();
  for (const p of rows) {
    if (seen.has(p.slug)) failures.push({ ruleId: 'CP0-unique', slug: p.slug, message: `duplicate presentation for "${p.slug}"` });
    seen.add(p.slug);
    // CP1 — every presentation must link to a real atlas case
    if (!known.has(p.slug)) failures.push({ ruleId: 'CP1-case-ref', slug: p.slug, message: `presentation slug "${p.slug}" has no matching atlas case` });
  }
  // CP2 — every atlas case must carry a presentation (so no country renders bare)
  const present = new Set(rows.map((r) => r.slug));
  for (const slug of caseSlugs) {
    if (!present.has(slug)) failures.push({ ruleId: 'CP2-complete', slug, message: `atlas case "${slug}" has no country presentation` });
  }
  return failures;
}

let cached: CountryPresentation[] | null = null;

export function getCountryPresentations(): readonly CountryPresentation[] {
  if (cached !== null) return cached;
  const caseSlugs = getAtlasCases().map((c) => c.slug);
  const failures = validateCountryPresentations(rawCountryPresentations, caseSlugs);
  if (failures.length > 0) {
    const detail = failures.map((f) => `  ${f.ruleId} [${f.slug}]: ${f.message}`).join('\n');
    throw new Error(`Country presentation content invalid (${failures.length} failure(s)):\n${detail}`);
  }
  cached = z.array(CountryPresentationSchema).parse(rawCountryPresentations);
  return cached;
}

export function getCountryPresentation(slug: string): CountryPresentation | null {
  return getCountryPresentations().find((p) => p.slug === slug) ?? null;
}

/**
 * Resolve the Atlas country-summary view for a case from the typed presentation
 * record. For the launched (Explore-capable) case, reading meta is derived LIVE
 * from its production chapters — never hardcoded.
 */
export function buildCountrySummaryView(slug: string): CountrySummaryView | null {
  const pres = getCountryPresentation(slug);
  if (pres === null) return null;
  const view: CountrySummaryView = { specialisation: pres.specialisation, question: pres.question };
  const c = getAtlasCases().find((x) => x.slug === slug);
  if (c !== undefined && c.availableModes.includes('explore')) {
    const chaptersView = buildChaptersView(slug);
    view.chapters = chaptersView.chapters.length;
    view.minutes = chaptersView.chapters.reduce((n, ch) => n + ch.readingTimeMinutes, 0);
  }
  return view;
}
