/**
 * AtlasCase registry contract (Public Atlas V2, Stage 1). Pure logic: schema,
 * R-series validation, selectors, filtering/selection recovery, and the
 * navigation GeoJSON — asserting the navigation layer stays separate from the
 * evidence corpus.
 */

import { describe, expect, it } from 'vitest';

import {
  casesByIndustry,
  casesByStatus,
  caseBySlug,
  getAtlasCases,
  hasEvidenceCta,
  hasExploreCta,
  industryOptions,
  navigationFeatureCollection,
  validateAtlasRegistry,
  type AtlasCase,
} from '@/lib/atlasCases';
import {
  atlasIndexReducer,
  initialAtlasIndexState,
  recoverSelection,
  visibleCases,
} from '@/lib/atlasIndexState';
import { loadCorpus } from '@/lib/loadContent';
import { productionRegistry } from '@/content/index';

const cases = getAtlasCases();
const bySlug = (slug: string) => caseBySlug(cases, slug)!;

describe('AtlasCase registry — content', () => {
  it('has exactly 3 initial cases', () => {
    expect(cases.length).toBe(3);
  });

  it('has unique ids and slugs', () => {
    expect(new Set(cases.map((c) => c.id)).size).toBe(3);
    expect(new Set(cases.map((c) => c.slug)).size).toBe(3);
  });

  it('Netherlands is in_research with Explore launched (availableModes exactly ["explore", "evidence"])', () => {
    const nl = bySlug('netherlands-semiconductor-equipment');
    expect(nl.status).toBe('in_research');
    expect(nl.availableModes).toEqual(['explore', 'evidence']);
    expect(hasEvidenceCta(nl)).toBe(true);
    expect(hasExploreCta(nl)).toBe(true);
  });

  it('Taiwan and France are planned with availableModes exactly []', () => {
    const tw = bySlug('taiwan-semiconductor-manufacturing');
    const fr = bySlug('france-luxury');
    expect(tw.status).toBe('planned');
    expect(fr.status).toBe('planned');
    expect(tw.availableModes).toEqual([]);
    expect(fr.availableModes).toEqual([]);
  });

  it('planned cases expose no Explore or Evidence CTA', () => {
    for (const c of cases.filter((x) => x.status === 'planned')) {
      expect(hasExploreCta(c)).toBe(false);
      expect(hasEvidenceCta(c)).toBe(false);
    }
  });

  it('only the Netherlands exposes an Explore CTA; planned cases never do', () => {
    const explorers = cases.filter(hasExploreCta).map((c) => c.slug);
    expect(explorers).toEqual(['netherlands-semiconductor-equipment']);
  });
});

describe('AtlasCase registry — validation (R-series)', () => {
  it('the shipped registry is valid', () => {
    expect(validateAtlasRegistry(cases)).toEqual([]);
    expect(() => getAtlasCases()).not.toThrow();
  });

  const base = (): AtlasCase => ({
    id: 'case-x',
    slug: 'x-y',
    country: 'X',
    industry: 'Widgets',
    title: 'X × Widgets',
    shortQuestion: 'Why X?',
    summary: 'Summary.',
    status: 'in_research',
    navigationGeometry: { type: 'point', longitude: 0, latitude: 0, precision: 'country', source: 's', attributionText: 'a' },
    availableModes: ['evidence'],
  });

  const ruleIds = (failures: { ruleId: string }[]) => failures.map((f) => f.ruleId);

  it('rejects duplicate ids and slugs', () => {
    const a = base();
    const b = { ...base(), country: 'Y' };
    expect(ruleIds(validateAtlasRegistry([a, b]))).toEqual(expect.arrayContaining(['R1-unique-id', 'R1-unique-slug']));
  });

  it('rejects planned case with non-empty availableModes', () => {
    const c = { ...base(), status: 'planned' as const, availableModes: ['evidence' as const] };
    expect(ruleIds(validateAtlasRegistry([c]))).toContain('R4-planned-no-modes');
  });

  it("rejects 'explore' without 'evidence'", () => {
    const c = { ...base(), availableModes: ['explore' as const] };
    expect(ruleIds(validateAtlasRegistry([c]))).toContain('R5-explore-needs-evidence');
  });

  it('rejects a malformed record via schema (R0)', () => {
    const c = { ...base(), navigationGeometry: { type: 'point', longitude: 999, latitude: 0, precision: 'country', source: 's', attributionText: 'a' } };
    expect(validateAtlasRegistry([c]).length).toBeGreaterThan(0);
  });

  it('rejects a Netherlands case that is not exactly [explore, evidence]', () => {
    const nl = { ...base(), slug: 'netherlands-semiconductor-equipment', availableModes: ['evidence' as const] };
    expect(ruleIds(validateAtlasRegistry([nl]))).toContain('R7-nl-explore-evidence');
    const ok = { ...base(), slug: 'netherlands-semiconductor-equipment', availableModes: ['explore' as const, 'evidence' as const] };
    expect(ruleIds(validateAtlasRegistry([ok]))).not.toContain('R7-nl-explore-evidence');
  });
});

describe('AtlasCase — selectors and filters', () => {
  it('filters by status', () => {
    expect(casesByStatus(cases, 'planned').map((c) => c.slug).sort()).toEqual(['france-luxury', 'taiwan-semiconductor-manufacturing']);
    expect(casesByStatus(cases, 'in_research').length).toBe(1);
    expect(casesByStatus(cases, 'published').length).toBe(0);
    expect(casesByStatus(cases, 'all').length).toBe(3);
  });

  it('filters by industry and derives industry options from the registry only', () => {
    expect(industryOptions(cases)).toEqual(['Luxury', 'Semiconductor equipment', 'Semiconductor manufacturing']);
    expect(casesByIndustry(cases, 'Luxury').map((c) => c.slug)).toEqual(['france-luxury']);
    expect(casesByIndustry(cases, null).length).toBe(3);
  });

  it('recovers the selection when the selected case is filtered out', () => {
    const state = { ...initialAtlasIndexState(cases[0]!.id), statusFilter: 'planned' as const };
    const visible = visibleCases(cases, state);
    // NL (first case) is filtered out by 'planned' → recover to first visible
    expect(recoverSelection(visible, cases[0]!.id)).toBe(visible[0]!.id);
    expect(visible.every((c) => c.status === 'planned')).toBe(true);
  });

  it('reducer keeps a still-visible selection but recovers a filtered-out one', () => {
    let s = initialAtlasIndexState(bySlug('netherlands-semiconductor-equipment').id);
    // select Taiwan, then filter to in_research → Taiwan gone → recover to NL
    s = atlasIndexReducer(cases, s, { type: 'selectCase', caseId: bySlug('taiwan-semiconductor-manufacturing').id });
    s = atlasIndexReducer(cases, s, { type: 'setStatusFilter', status: 'in_research' });
    expect(s.selectedCaseId).toBe(bySlug('netherlands-semiconductor-equipment').id);
    // reset restores all + keeps a visible selection
    s = atlasIndexReducer(cases, s, { type: 'reset' });
    expect(s.statusFilter).toBe('all');
    expect(s.industryFilter).toBe(null);
  });
});

describe('Navigation geometry — separate from evidence geography', () => {
  const fc = navigationFeatureCollection(cases);

  it('every navigation feature carries role: "navigation" and only navigation props', () => {
    expect(fc.features.length).toBe(3);
    for (const f of fc.features) {
      expect(f.properties.role).toBe('navigation');
      expect(Object.keys(f.properties).sort()).toEqual(
        ['caseId', 'country', 'industry', 'role', 'slug', 'status', 'title'].sort(),
      );
    }
  });

  it('contains no Claim, Place or ClaimPlaceLink identifiers', () => {
    const loaded = loadCorpus(productionRegistry);
    if (!loaded.ok) throw new Error('corpus failed to load');
    const module = loaded.corpus.modules.find((m) => m.caseId === 'netherlands-semiconductor-equipment')!;
    const evidenceIds = [
      ...(module.places ?? []).map((p) => p.id),
      ...(module.claimPlaceLinks ?? []).map((l) => l.id),
      ...module.claims.map((c) => c.id),
    ];
    const json = JSON.stringify(fc);
    for (const id of evidenceIds) expect(json.includes(id)).toBe(false);
  });

  it('navigation points are not evidence Place coordinates', () => {
    const loaded = loadCorpus(productionRegistry);
    if (!loaded.ok) throw new Error('corpus failed to load');
    const module = loaded.corpus.modules.find((m) => m.caseId === 'netherlands-semiconductor-equipment')!;
    const placePoints = (module.places ?? [])
      .filter((p) => p.geometry.type === 'point')
      .map((p) => `${(p.geometry as { longitude: number }).longitude},${(p.geometry as { latitude: number }).latitude}`);
    for (const f of fc.features) {
      expect(placePoints).not.toContain(`${f.geometry.coordinates[0]},${f.geometry.coordinates[1]}`);
    }
  });
});
