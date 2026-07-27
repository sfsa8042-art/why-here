/**
 * Increment M0 — Citation ids + geographic layer.
 *
 * Schema-level (Citation.id, Place geometry) and validator-level (V21,
 * G1–G14) rules, plus the two production ClaimPlaceLinks and the guarantee
 * that unlinked claims stay non-mappable and no place-to-place edge exists.
 */

import { describe, expect, it } from 'vitest';

import * as schemas from '@/lib/schemas';
import { CitationSchema, PlaceSchema } from '@/lib/schemas';
import {
  validateCorpus,
  type Corpus,
  type RuleId,
} from '@/lib/validate';
import { loadCorpus } from '@/lib/loadContent';
import { productionRegistry } from '@/content/index';
import { buildNetherlandsResearchView } from '@/lib/researchViewModel';
import {
  makeClaimPlaceLink,
  makeCitation,
  makeCorpus,
  makeFactual,
  makeGeoCorpus,
  makePlace,
  makeResearchCase,
  makeQuestion,
} from '@/content/__fixtures__/builders';

function rulesOf(corpus: Corpus): RuleId[] {
  return validateCorpus(corpus).map((f) => f.ruleId);
}
function expectClean(corpus: Corpus): void {
  expect(validateCorpus(corpus)).toEqual([]);
}
function expectHasRule(corpus: Corpus, rule: RuleId): void {
  const failures = validateCorpus(corpus);
  expect(failures.map((f) => f.ruleId), JSON.stringify(failures, null, 2)).toContain(rule);
}
function expectOnlyRule(corpus: Corpus, rule: RuleId): void {
  const failures = validateCorpus(corpus);
  expect(failures.length, JSON.stringify(failures, null, 2)).toBeGreaterThan(0);
  expect(failures.map((f) => f.ruleId)).toEqual(failures.map(() => rule));
}

/* ------------------------------------------------------------------ *
 * Citation ids
 * ------------------------------------------------------------------ */

describe('Citation ids', () => {
  it('Citation id is required and non-empty', () => {
    const base = { sourceId: 's', locator: { kind: 'page', value: '1' }, evidenceRole: 'supports' };
    expect(CitationSchema.safeParse(base).success).toBe(false); // no id
    expect(CitationSchema.safeParse({ ...base, id: '' }).success).toBe(false);
    expect(CitationSchema.safeParse({ ...base, id: 'ok-1' }).success).toBe(true);
  });

  it('global Citation id uniqueness is build-blocking (V21)', () => {
    const dup = makeGeoCorpus({
      claims: [
        makeFactual({ id: 'c1', citations: [makeCitation({ id: 'dup-cit', sourceId: 'builder-academic-a' })] }),
        makeFactual({ id: 'c2', citations: [makeCitation({ id: 'dup-cit', sourceId: 'builder-academic-b' })] }),
      ],
      claimPlaceLinks: [],
      places: [],
    });
    expect(rulesOf(dup)).toContain('V21');
  });

  it('migrated production Citations load successfully', () => {
    const result = loadCorpus(productionRegistry);
    expect(result.ok, JSON.stringify(result.ok ? [] : result.failures, null, 2)).toBe(true);
    if (!result.ok) return;
    expect(validateCorpus(result.corpus)).toEqual([]);
  });
});

/* ------------------------------------------------------------------ *
 * Place geometry (schema)
 * ------------------------------------------------------------------ */

describe('Place geometry schema', () => {
  const geo = (over: Record<string, unknown>) => ({
    type: 'point', longitude: 5, latitude: 52, precision: 'city',
    coordinateSource: 'src', attributionText: 'attr', ...over,
  });
  const place = (g: unknown) => ({
    id: 'p', caseId: 'k', name: 'City', countryCode: 'NL', kind: 'city', geometry: g,
  });

  it('rejects invalid latitude / longitude', () => {
    expect(PlaceSchema.safeParse(place(geo({ latitude: 200 }))).success).toBe(false);
    expect(PlaceSchema.safeParse(place(geo({ longitude: -999 }))).success).toBe(false);
  });
  it('rejects missing coordinate source', () => {
    expect(PlaceSchema.safeParse(place(geo({ coordinateSource: '' }))).success).toBe(false);
  });
  it('rejects missing attribution', () => {
    expect(PlaceSchema.safeParse(place(geo({ attributionText: '' }))).success).toBe(false);
  });
  it('accepts a valid city point', () => {
    expect(PlaceSchema.safeParse(place(geo({}))).success).toBe(true);
  });
});

/* ------------------------------------------------------------------ *
 * Validator — geographic rules
 * ------------------------------------------------------------------ */

describe('geographic validator (G1–G14)', () => {
  it('the baseline geo corpus is clean', () => {
    expectClean(makeGeoCorpus());
  });

  it('G1 — duplicate Place id', () => {
    expectOnlyRule(makeGeoCorpus({
      places: [makePlace({ id: 'builder-place' }), makePlace({ id: 'builder-place', name: 'Other' })],
    }), 'G1');
  });

  it('G2 — duplicate ClaimPlaceLink id', () => {
    expectOnlyRule(makeGeoCorpus({
      claimPlaceLinks: [
        makeClaimPlaceLink({ id: 'dupe', claimId: 'builder-geo-claim', placeId: 'builder-place', citationIds: ['builder-geo-cit'] }),
        makeClaimPlaceLink({ id: 'dupe', claimId: 'builder-geo-claim', placeId: 'builder-place', citationIds: ['builder-geo-cit'] }),
      ],
    }), 'G2');
  });

  it('G6 — unresolved Place', () => {
    expectHasRule(makeGeoCorpus({
      claimPlaceLinks: [makeClaimPlaceLink({ id: 'l', claimId: 'builder-geo-claim', placeId: 'no-such-place', citationIds: ['builder-geo-cit'] })],
    }), 'G6');
  });

  it('G6 — unresolved Claim', () => {
    expectHasRule(makeGeoCorpus({
      claimPlaceLinks: [makeClaimPlaceLink({ id: 'l', claimId: 'no-such-claim', placeId: 'builder-place', citationIds: ['builder-geo-cit'] })],
    }), 'G6');
  });

  it('G6 — cross-case ClaimPlaceLink (claim in another case)', () => {
    const corpus = makeGeoCorpus({
      extraModules: [{
        caseId: 'other-case',
        case: makeResearchCase({ id: 'other-case', researchQuestionIds: ['other-q'] }),
        claims: [makeFactual({ id: 'other-claim', caseId: 'other-case', citations: [makeCitation({ id: 'other-cit', sourceId: 'builder-academic-a' })] })],
        researchQuestions: [makeQuestion({ id: 'other-q', caseId: 'other-case' })],
        nodes: [], edges: [], alternativeExplanations: [], places: [], claimPlaceLinks: [],
      }],
      claimPlaceLinks: [makeClaimPlaceLink({ id: 'l', claimId: 'other-claim', placeId: 'builder-place', citationIds: ['builder-geo-cit'] })],
    });
    expectHasRule(corpus, 'G6');
  });

  it('G8 — cited Citation does not exist', () => {
    expectHasRule(makeGeoCorpus({
      claimPlaceLinks: [makeClaimPlaceLink({ id: 'l', claimId: 'builder-geo-claim', placeId: 'builder-place', citationIds: ['no-such-cit'] })],
    }), 'G8');
  });

  it('G9 — cited Citation belongs to a different Claim', () => {
    const corpus = makeGeoCorpus({
      claims: [
        makeFactual({ id: 'builder-geo-claim', citations: [makeCitation({ id: 'builder-geo-cit', sourceId: 'builder-academic-a' })] }),
        makeFactual({ id: 'sibling', citations: [makeCitation({ id: 'sibling-cit', sourceId: 'builder-academic-b' })] }),
      ],
      claimPlaceLinks: [makeClaimPlaceLink({ id: 'l', claimId: 'builder-geo-claim', placeId: 'builder-place', citationIds: ['sibling-cit'] })],
    });
    expectHasRule(corpus, 'G9');
  });

  it('G10 — epistemicStatus inflation above the linked Claim', () => {
    expectOnlyRule(makeGeoCorpus({
      claimPlaceLinks: [makeClaimPlaceLink({
        id: 'l', claimId: 'builder-geo-claim', placeId: 'builder-place',
        citationIds: ['builder-geo-cit'], epistemicStatus: 'established',
      })],
    }), 'G10');
  });

  it('G11 — evidencePrecision inflation above the Place geometry (city → site)', () => {
    expectHasRule(makeGeoCorpus({
      claimPlaceLinks: [makeClaimPlaceLink({
        id: 'l', claimId: 'builder-geo-claim', placeId: 'builder-place',
        citationIds: ['builder-geo-cit'], evidencePrecision: 'site',
      })],
    }), 'G11');
  });

  it('G12 — temporal scope incompatible with a structured Claim period', () => {
    const corpus = makeGeoCorpus({
      claims: [makeFactual({
        id: 'builder-geo-claim', timeline: { year: 1994 },
        citations: [makeCitation({ id: 'builder-geo-cit', sourceId: 'builder-academic-a' })],
      })],
      claimPlaceLinks: [makeClaimPlaceLink({
        id: 'l', claimId: 'builder-geo-claim', placeId: 'builder-place',
        citationIds: ['builder-geo-cit'], temporalScope: { year: 1980 },
      })],
    });
    expectOnlyRule(corpus, 'G12');
  });

  it('G5 — a city Place may not carry site-precision geometry', () => {
    expectHasRule(makeGeoCorpus({
      places: [makePlace({
        id: 'builder-place',
        geometry: {
          type: 'point', longitude: 5, latitude: 52, precision: 'site',
          coordinateSource: 'src', attributionText: 'attr',
        },
      })],
    }), 'G5');
  });
});

/* ------------------------------------------------------------------ *
 * Production geographic content
 * ------------------------------------------------------------------ */

describe('production geographic content', () => {
  const result = loadCorpus(productionRegistry);
  if (!result.ok) throw new Error('production corpus failed to load');
  const nl = result.corpus.modules.find(
    (m) => m.caseId === 'netherlands-semiconductor-equipment',
  )!;
  const places = nl.places ?? [];
  const links = nl.claimPlaceLinks ?? [];

  it('registers exactly two city Places (Veldhoven, Eindhoven), both NL, city precision', () => {
    expect(places.map((p) => p.id).sort()).toEqual(['nl-place-eindhoven', 'nl-place-veldhoven']);
    for (const p of places) {
      expect(p.kind).toBe('city');
      expect(p.countryCode).toBe('NL');
      expect(p.geometry.type === 'point' && p.geometry.precision).toBe('city');
    }
  });

  it('the Veldhoven link resolves only to nl-f-deepuv-coordination as project_coordinator_address', () => {
    const veld = links.filter((l) => l.placeId === 'nl-place-veldhoven');
    expect(veld).toHaveLength(1);
    expect(veld[0]?.claimId).toBe('nl-f-deepuv-coordination');
    expect(veld[0]?.relationship).toBe('project_coordinator_address');
    expect(veld[0]?.evidencePrecision).toBe('city');
  });

  it('the Eindhoven link resolves only to nl-f-deepuv-participants as project_participant_address', () => {
    const eind = links.filter((l) => l.placeId === 'nl-place-eindhoven');
    expect(eind).toHaveLength(1);
    expect(eind[0]?.claimId).toBe('nl-f-deepuv-participants');
    expect(eind[0]?.relationship).toBe('project_participant_address');
    expect(eind[0]?.evidencePrecision).toBe('city');
  });

  it('each link cites a Citation that belongs to its own Claim', () => {
    const citIdsByClaim = new Map(nl.claims.map((c) => [c.id, new Set(c.citations.map((x) => x.id))]));
    for (const l of links) {
      for (const cid of l.citationIds) {
        expect(citIdsByClaim.get(l.claimId)?.has(cid), `${l.id} → ${cid}`).toBe(true);
      }
    }
  });

  it('all remaining Claims are non-mappable (only the two DEEP-UV claims are linked)', () => {
    const linkedClaimIds = new Set(links.map((l) => l.claimId));
    expect([...linkedClaimIds].sort()).toEqual(['nl-f-deepuv-coordination', 'nl-f-deepuv-participants']);
    const mappable = nl.claims.filter((c) => linkedClaimIds.has(c.id));
    expect(mappable).toHaveLength(2);
    expect(nl.claims.length - mappable.length).toBe(15);
  });
});

/* ------------------------------------------------------------------ *
 * Structural guards
 * ------------------------------------------------------------------ */

describe('structural guards', () => {
  it('no place-to-place edge structure exists in the schema surface', () => {
    const names = Object.keys(schemas);
    expect(names.some((n) => /placeedge|place_edge|placetoplace|placelinkedge/i.test(n))).toBe(false);
    // ClaimPlaceLink is claim↔place; a place↔place field is rejected by .strict()
    const withPlaceEdge = {
      id: 'x', caseId: 'k', claimId: 'c', placeId: 'p', relationship: 'context_only',
      temporalScope: { year: 1990 }, citationIds: ['cit'], evidencePrecision: 'city',
      locatorNote: 'n', epistemicStatus: 'insufficient', toPlaceId: 'p2',
    };
    expect(schemas.ClaimPlaceLinkSchema.safeParse(withPlaceEdge).success).toBe(false);
  });

  it('the existing research UI view-model still exposes all 17 Claims and no geographic data', () => {
    const vm = buildNetherlandsResearchView();
    expect(vm.claimCount).toBe(17);
    expect(vm.spine).toHaveLength(17);
    expect(vm).not.toHaveProperty('places');
    expect(vm).not.toHaveProperty('claimPlaceLinks');
  });
});
