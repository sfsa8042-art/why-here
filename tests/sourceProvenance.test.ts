/**
 * Source-provenance amendment tests.
 *
 * Covers: the three-dimensional source classification (type ×
 * temporal relation × subject relationship), citation-level provenance
 * (schema refinements, resolution, cycles, claim-scoped dependence),
 * and the corrected factual/established evidence floor.
 */

import { describe, expect, it } from 'vitest';

import { CitationSchema, SourceSchema } from '@/lib/schemas';
import {
  buildAncestorMap,
  claimScopedDependence,
  validateCorpus,
  type Corpus,
  type RuleId,
} from '@/lib/validate';
import {
  makeCausal,
  makeCitation,
  makeSource,
} from '@/content/__fixtures__/builders';
import * as prov from '@/content/__fixtures__/invalid/source-provenance';

function expectOnlyRule(corpus: Corpus, ruleId: RuleId): void {
  const failures = validateCorpus(corpus);
  expect(failures.length).toBeGreaterThan(0);
  expect(
    failures.map((f) => f.ruleId),
    JSON.stringify(failures, null, 2),
  ).toEqual(failures.map(() => ruleId));
}

function expectClean(corpus: Corpus): void {
  expect(validateCorpus(corpus)).toEqual([]);
}

describe('source classification dimensions', () => {
  it('temporalRelation and subjectRelationship are mandatory', () => {
    const base = makeSource({ id: 'probe' });
    expect(SourceSchema.safeParse(base).success).toBe(true);
    const { temporalRelation, ...noTemporal } = base;
    expect(SourceSchema.safeParse(noTemporal).success).toBe(false);
    const { subjectRelationship, ...noSubject } = base;
    expect(SourceSchema.safeParse(noSubject).success).toBe(false);
  });

  it('parses a contemporaneous subject-authored documentary source (test 1)', () => {
    expect(SourceSchema.safeParse(makeSource({
      id: 'probe-doc',
      sourceType: 'documentary',
      temporalRelation: 'contemporaneous',
      subjectRelationship: 'subject_authored',
    })).success).toBe(true);
  });

  it('parses a retrospective subject-authored institutional history (test 2)', () => {
    expect(SourceSchema.safeParse(makeSource({
      id: 'probe-hist',
      sourceType: 'institutional_history',
      temporalRelation: 'retrospective',
      subjectRelationship: 'subject_authored',
    })).success).toBe(true);
  });

  it('the retired "primary" source type no longer parses', () => {
    expect(SourceSchema.safeParse({
      ...makeSource({ id: 'probe-legacy' }),
      sourceType: 'primary',
    }).success).toBe(false);
  });
});

describe('citation-level provenance — schema', () => {
  const base = makeCitation({ sourceId: 'src-a' });

  it('accepts a citation deriving from another source, with a note', () => {
    expect(CitationSchema.safeParse({
      ...base,
      derivedFromSourceIds: ['src-b'],
      provenanceNote: 'this passage restates src-b',
    }).success).toBe(true);
  });

  it('rejects a citation deriving from its own source', () => {
    expect(CitationSchema.safeParse({
      ...base,
      derivedFromSourceIds: ['src-a'],
    }).success).toBe(false);
  });

  it('rejects duplicate entries in derivedFromSourceIds', () => {
    expect(CitationSchema.safeParse({
      ...base,
      derivedFromSourceIds: ['src-b', 'src-b'],
    }).success).toBe(false);
  });
});

describe('factual/established floor (amended)', () => {
  it('a retrospective institutional history alone does not earn established (test 7)', () => {
    expectOnlyRule(prov.v9InstitutionalHistoryEstablished, 'V9');
  });

  it('contemporaneous subject-authored documentary evidence establishes (tests 1, 8)', () => {
    expectClean(prov.nearMissContemporaneousDocumentaryEstablished);
  });

  it('the same institutional history carries well_supported (test 2)', () => {
    expectClean(prov.nearMissInstitutionalHistoryWellSupported);
  });
});

describe('citation-level provenance — validator', () => {
  it('rejects an unresolved citation-level derivation (test 6)', () => {
    expectOnlyRule(prov.v6CitationDerivationUnresolved, 'V6');
  });

  it('rejects a citation-level cycle inside ONE claim (test 6)', () => {
    expectOnlyRule(prov.v6CitationDerivationCycle, 'V6');
    expect(validateCorpus(prov.v6CitationDerivationCycle)[0]?.entityId).toBe('prv-claim');
  });

  it('allows opposite citation-level derivations on two separate claims', () => {
    expectClean(prov.nearMissOppositeDerivationsAcrossClaims);
  });

  it('a derived passage breaks independence for that claim only (tests 3, 4, 5)', () => {
    const failures = validateCorpus(prov.v9CitationDerivedPair);
    expect(failures, JSON.stringify(failures, null, 2)).toHaveLength(1);
    expect(failures[0]?.ruleId).toBe('V9');
    expect(failures[0]?.entityId).toBe('cp-derived');
    // the sibling claim using the SAME sources without derivation passed
    expect(failures.some((f) => f.entityId === 'cp-clean')).toBe(false);
  });

  it('claimScopedDependence: globally independent, citation-derived dependent (test 3)', () => {
    const a = makeSource({ id: 'src-a', institution: 'Inst A', authors: ['X'] });
    const b = makeSource({ id: 'src-b', institution: 'Inst B', authors: ['Y'] });
    const sourceById = new Map([['src-a', a], ['src-b', b]]);
    const ancestors = buildAncestorMap([a, b]);

    const derivedClaim = makeCausal({
      id: 'probe-derived',
      citations: [
        makeCitation({ sourceId: 'src-a', derivedFromSourceIds: ['src-b'] }),
        makeCitation({ sourceId: 'src-b' }),
      ],
    });
    const cleanClaim = makeCausal({
      id: 'probe-clean',
      citations: [
        makeCitation({ sourceId: 'src-a' }),
        makeCitation({ sourceId: 'src-b' }),
      ],
    });

    expect(claimScopedDependence(derivedClaim, sourceById, ancestors)(a, b)).toBe(true);
    expect(claimScopedDependence(cleanClaim, sourceById, ancestors)(a, b)).toBe(false);
  });
});
