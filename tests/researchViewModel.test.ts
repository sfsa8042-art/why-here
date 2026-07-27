/**
 * Research view-model tests (first UI increment).
 *
 * The view-model is a pure selector over the PRODUCTION corpus; these tests
 * assert traceability and shape without touching React.
 */

import { describe, expect, it } from 'vitest';

import { buildNetherlandsResearchView } from '@/lib/researchViewModel';

describe('buildNetherlandsResearchView', () => {
  const vm = buildNetherlandsResearchView();

  it('reports the real production source and claim counts', () => {
    expect(vm.sourceCount).toBe(5);
    expect(vm.claimCount).toBe(17);
    expect(vm.spine).toHaveLength(17);
  });

  it('stays a research case with no thesis and three questions', () => {
    expect(vm.status).toBe('research');
    expect(vm.hasThesis).toBe(false);
    expect(vm.researchQuestions).toHaveLength(3);
  });

  it('carries all seventeen production claim ids on the spine', () => {
    const ids = new Set(vm.spine.map((c) => c.id));
    expect(ids.size).toBe(17);
    for (const id of [
      'nl-f-jv-established-1984',
      'nl-f-contribution-agreement-1984',
      'nl-f-employees-transferred',
      'nl-i-transfer-reluctance',
      'nl-f-mip-non-participation',
      'nl-f-hydraulic-stage-problems-1983',
      'nl-f-pas2000-commercialization-problems-1983',
      'nl-f-philips-advance-1987',
      'nl-f-asm-withdrawal-1988',
      'nl-f-philips-stake-acquisition-1988',
      'nl-f-deepuv-coordination',
      'nl-f-deepuv-participants',
      'nl-f-deepuv-objective',
      'nl-f-deepuv-reported-results',
      'nl-f-pas5500-launched-1991',
      'nl-f-holding-company-incorporated-1994',
      'nl-f-public-company-listings-1995',
    ]) {
      expect(ids.has(id), id).toBe(true);
    }
  });

  it('marks the reluctance claim interpretive and the rest factual', () => {
    const reluctance = vm.spine.find((c) => c.id === 'nl-i-transfer-reluctance');
    expect(reluctance?.claimType).toBe('interpretive');
    const others = vm.spine.filter((c) => c.id !== 'nl-i-transfer-reluctance');
    expect(others.every((c) => c.claimType === 'factual')).toBe(true);
  });

  it('flags the two attributed statements and no others', () => {
    const attributed = vm.spine.filter((c) => c.attributed).map((c) => c.id).sort();
    expect(attributed).toEqual([
      'nl-f-pas5500-launched-1991',
      'nl-f-public-company-listings-1995',
    ]);
  });

  it('orders the spine chronologically', () => {
    const keys = vm.spine.map((c) => c.sortKey);
    const sorted = [...keys].sort((a, b) => a - b);
    expect(keys).toEqual(sorted);
    expect(vm.spine[0]?.id).toBe('nl-f-hydraulic-stage-problems-1983');
    expect(vm.spine.at(-1)?.id).toBe('nl-f-public-company-listings-1995');
  });

  it('exposes locator + full source classification on every citation', () => {
    for (const claim of vm.spine) {
      expect(claim.citations.length).toBeGreaterThan(0);
      for (const c of claim.citations) {
        expect(c.locatorKind.length).toBeGreaterThan(0);
        expect(c.locatorValue.length).toBeGreaterThan(0);
        expect(c.sourceType.length).toBeGreaterThan(0);
        expect(c.temporalRelation.length).toBeGreaterThan(0);
        expect(c.subjectRelationship.length).toBeGreaterThan(0);
      }
    }
  });

  it('builds five evidence phases covering all seventeen claims, showing the post-1988 drop', () => {
    expect(vm.phases).toHaveLength(5);
    const total = vm.phases.reduce((n, p) => n + p.claimCount, 0);
    expect(total).toBe(17);
    const byKey = Object.fromEntries(vm.phases.map((p) => [p.key, p]));
    expect(byKey['founding']?.coverage).toBe('strong');
    expect(byKey['commercial-viability']?.coverage).toBe('insufficient');
    expect(byKey['public-company-transition']?.coverage).toBe('attributed only');
  });
});
