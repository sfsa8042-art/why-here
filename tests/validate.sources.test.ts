/**
 * Increment 2 — source-level machinery.
 * V6 (provenance graph), V7 (duplicate sources), V8 (dependence),
 * identifier normalization, and deterministic bounded selection.
 */

import { describe, expect, it } from 'vitest';

import type { Source } from '@/lib/schemas';
import {
  areSourcesDependent,
  buildAncestorMap,
  canonicalizeUrl,
  findCycles,
  normalizeArchiveRef,
  normalizeDoi,
  normalizeIsbn,
  selectIndependentSources,
  validateCorpus,
  type Corpus,
  type RuleId,
} from '@/lib/validate';
import { makeCorpus, makeSource } from '@/content/__fixtures__/builders';
import * as provenance from '@/content/__fixtures__/invalid/provenance';
import * as duplicates from '@/content/__fixtures__/invalid/duplicate-sources';

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

describe('V6 — provenance graph', () => {
  it('rejects an unresolved originalSourceId', () => {
    expectOnlyRule(provenance.v6UnresolvedParent, 'V6');
  });

  it('rejects a direct provenance cycle', () => {
    expectOnlyRule(provenance.v6DirectCycle, 'V6');
  });

  it('rejects a transitive provenance cycle', () => {
    expectOnlyRule(provenance.v6TransitiveCycle, 'V6');
  });

  it('near-miss: an acyclic derivation chain is accepted', () => {
    expectClean(provenance.nearMissAcyclicProvenance);
  });
});

describe('V7 — duplicate sources by normalized identifier', () => {
  it('rejects two ids sharing a normalized DOI', () => {
    expectOnlyRule(duplicates.v7SharedDoi, 'V7');
  });

  it('rejects the same book as ISBN-10 and ISBN-13', () => {
    expectOnlyRule(duplicates.v7SharedIsbn, 'V7');
  });

  it('rejects archive references differing only by case and padding', () => {
    expectOnlyRule(duplicates.v7SharedArchiveRef, 'V7');
  });

  it('rejects URLs differing only by scheme, www, tracking params, slash, fragment', () => {
    expectOnlyRule(duplicates.v7SharedUrl, 'V7');
  });

  it('near-miss: genuinely distinct sources are accepted', () => {
    expectClean(duplicates.nearMissDistinctSources);
  });
});

describe('validator hardening', () => {
  it('cycle detection finds a cycle in a disconnected graph', () => {
    // component 1: a -> b (acyclic); component 2: x -> y -> x
    const edges = new Map<string, string[]>([
      ['a', ['b']], ['b', []],
      ['x', ['y']], ['y', ['x']],
    ]);
    const cycles = findCycles(edges.keys(), (id) => edges.get(id) ?? []);
    expect(cycles.length).toBe(1);
    expect(new Set(cycles[0])).toEqual(new Set(['x', 'y']));
  });

  it('selection is deterministic regardless of input order', () => {
    const sources = [
      makeSource({ id: 'src-b' }),
      makeSource({ id: 'src-a' }),
      makeSource({ id: 'src-c' }),
    ];
    const forward = selectIndependentSources(sources, 2, () => true);
    const reversed = selectIndependentSources([...sources].reverse(), 2, () => true);
    expect(forward?.map((s) => s.id)).toEqual(reversed?.map((s) => s.id));
  });

  it('validateCorpus does not mutate the input corpus', () => {
    const corpus = makeCorpus();
    const before = JSON.stringify(corpus);
    validateCorpus(corpus);
    expect(JSON.stringify(corpus)).toBe(before);
  });

  it('failures are deterministically ordered across runs', () => {
    const corpus = duplicates.v7SharedDoi;
    expect(validateCorpus(corpus)).toEqual(validateCorpus(corpus));
  });
});

describe('identifier normalization', () => {
  it('normalizes DOI prefixes and case', () => {
    expect(normalizeDoi('DOI: 10.1234/ABC')).toBe('10.1234/abc');
    expect(normalizeDoi('https://dx.doi.org/10.1234/abc')).toBe('10.1234/abc');
    expect(normalizeDoi('10.1234/abc')).toBe('10.1234/abc');
  });

  it('treats ISBN-10 and ISBN-13 of one book as equivalent', () => {
    expect(normalizeIsbn('0-306-40615-2')).toBe(normalizeIsbn('978-0-306-40615-7'));
  });

  it('does not conflate different ISBNs', () => {
    expect(normalizeIsbn('978-0-306-40615-7')).not.toBe(normalizeIsbn('978-0-306-40616-4'));
  });

  it('normalizes archive references by trim and case', () => {
    expect(normalizeArchiveRef('  NA-HaNA-2.06.087 ')).toBe('na-hana-2.06.087');
  });

  it('canonicalizes URL variants to one key', () => {
    const canonical = canonicalizeUrl('https://example.org/report/annex');
    expect(canonicalizeUrl('http://www.example.org/report/annex/')).toBe(canonical);
    expect(canonicalizeUrl('https://example.org/report/annex?utm_source=x#frag')).toBe(canonical);
  });

  it('keeps meaningful query parameters distinct', () => {
    expect(canonicalizeUrl('https://example.org/doc?page=2'))
      .not.toBe(canonicalizeUrl('https://example.org/doc?page=3'));
  });
});

describe('V8 — dependence relation', () => {
  const base = (id: string, over: Partial<Source> = {}): Source =>
    makeSource({ id, ...over });

  it('transitive provenance: A -> B -> C makes A and C dependent', () => {
    const a = base('src-a');
    const b = base('src-b', { originalSourceId: 'src-a' });
    const c = base('src-c', { originalSourceId: 'src-b' });
    const ancestors = buildAncestorMap([a, b, c]);
    expect(areSourcesDependent(a, c, ancestors)).toBe(true);
    expect(areSourcesDependent(c, a, ancestors)).toBe(true);
  });

  it('a shared provenance ancestor makes two derivations dependent', () => {
    const origin = base('src-origin');
    const left = base('src-left', { derivedFromSourceIds: ['src-origin'] });
    const right = base('src-right', { derivedFromSourceIds: ['src-origin'] });
    const ancestors = buildAncestorMap([origin, left, right]);
    expect(areSourcesDependent(left, right, ancestors)).toBe(true);
  });

  it('shared institution plus overlapping authors proves dependence', () => {
    const a = base('src-a', { institution: 'Inst', authors: ['X', 'Y'] });
    const b = base('src-b', { institution: 'Inst', authors: ['Y', 'Z'] });
    expect(areSourcesDependent(a, b, buildAncestorMap([a, b]))).toBe(true);
  });

  it('distinct institutions and authors prove independence', () => {
    const a = base('src-a', { institution: 'Inst A', authors: ['X'] });
    const b = base('src-b', { institution: 'Inst B', authors: ['Y'] });
    expect(areSourcesDependent(a, b, buildAncestorMap([a, b]))).toBe(false);
  });
});

describe('deterministic bounded selection', () => {
  const academic = (id: string, over: Partial<Source> = {}): Source =>
    makeSource({ id, ...over });
  const noDependence = (): boolean => false;

  it('k = 1 returns the lexicographically first satisfying source', () => {
    const picked = selectIndependentSources(
      [academic('src-c'), academic('src-a'), academic('src-b')],
      1,
      () => true,
    );
    expect(picked?.map((s) => s.id)).toEqual(['src-a']);
  });

  it('k = 2 returns exact expected membership (determinism)', () => {
    const picked = selectIndependentSources(
      [academic('src-c'), academic('src-a'), academic('src-b')],
      2,
      () => true,
      noDependence,
    );
    expect(picked?.map((s) => s.id)).toEqual(['src-a', 'src-b']);
  });

  it('continues past a dependent first pair to a valid later pair', () => {
    const a = academic('src-a', { institution: 'Inst', authors: ['X'] });
    const b = academic('src-b', { institution: 'Inst', authors: ['X'] }); // dependent on a
    const c = academic('src-c', { institution: 'Other', authors: ['Y'] });
    const ancestors = buildAncestorMap([a, b, c]);
    const picked = selectIndependentSources(
      [a, b, c], 2, () => true,
      (x, y) => areSourcesDependent(x, y, ancestors),
    );
    expect(picked?.map((s) => s.id)).toEqual(['src-a', 'src-c']);
  });

  it('causal mode continues past an independent pair lacking an academic member', () => {
    const pressA = academic('src-a', { sourceType: 'reputable_press' });
    const pressB = academic('src-b', { sourceType: 'reputable_press' });
    const scholarly = academic('src-c', { sourceType: 'academic' });
    const picked = selectIndependentSources(
      [pressA, pressB, scholarly], 2, () => true, noDependence,
      { requireAcademicMember: true },
    );
    expect(picked?.map((s) => s.id)).toEqual(['src-a', 'src-c']);
  });

  it('returns null when no valid selection exists', () => {
    const a = academic('src-a', { institution: 'Inst', authors: ['X'] });
    const b = academic('src-b', { institution: 'Inst', authors: ['X'] });
    const ancestors = buildAncestorMap([a, b]);
    expect(
      selectIndependentSources([a, b], 2, () => true,
        (x, y) => areSourcesDependent(x, y, ancestors)),
    ).toBeNull();
    expect(selectIndependentSources([a, b], 1, () => false)).toBeNull();
  });
});
