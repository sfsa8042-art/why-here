/**
 * Explore publication gate (Public Atlas V2, Stage 7). A case may expose the
 * `explore` mode only when it is genuinely backed: supported chapters exist,
 * prose resolves to production Claims (enforced chapter-side), and every rendered
 * image passes the public rights gate. Cases that do not declare `explore` are
 * never gated, so a planned case can never pass accidentally.
 */

import { describe, expect, it } from 'vitest';

import { exploreGateFailures } from '@/lib/exploreGate';
import { getAtlasCases } from '@/lib/atlasCases';
import type { AtlasCase } from '@/lib/atlasCases';

const nav = { type: 'point', longitude: 0, latitude: 0, precision: 'country', source: 's', attributionText: 'a' } as const;
const mk = (over: Partial<AtlasCase>): AtlasCase => ({
  id: 'case-x', slug: 'x-y', country: 'X', industry: 'W', title: 'X', shortQuestion: 'Why?',
  summary: 'S', status: 'in_research', navigationGeometry: nav, availableModes: [], ...over,
});

describe('Explore gate', () => {
  it('the shipped registry passes the gate (Netherlands is genuinely backed)', () => {
    expect(exploreGateFailures(getAtlasCases())).toEqual([]);
  });

  it('a case that declares explore without any chapters fails the gate', () => {
    const fabricated = mk({ slug: 'taiwan-semiconductor-manufacturing', availableModes: ['explore', 'evidence'] });
    const ids = exploreGateFailures([fabricated]).map((f) => f.ruleId);
    expect(ids).toContain('E2-no-chapters');
    expect(ids).toContain('E3-no-supported-chapter');
  });

  it('a case that declares explore without evidence fails E1', () => {
    // netherlands slug has chapters, but explore alone (no evidence) must fail
    const noEvidence = mk({ slug: 'netherlands-semiconductor-equipment', availableModes: ['explore'] });
    expect(exploreGateFailures([noEvidence]).map((f) => f.ruleId)).toContain('E1-evidence-available');
  });

  it('cases that do not declare explore are never gated', () => {
    const planned = mk({ slug: 'france-luxury', status: 'planned', availableModes: [] });
    expect(exploreGateFailures([planned])).toEqual([]);
  });
});
