/**
 * Research-view source SCOPING regression tests (Stage 11A hardening).
 *
 * The production corpus is shared across cases, so an Evidence workspace must
 * show only the sources ITS OWN case cites. These tests lock that in — both the
 * generic pure helper and the real multi-case corpus — so that adding a future
 * case (with new global sources) can never inflate another case's source count.
 */

import { describe, expect, it } from 'vitest';

import { buildNetherlandsResearchView, citedSourceIdsForClaims } from '@/lib/researchViewModel';
import { loadCorpus } from '@/lib/loadContent';
import { productionRegistry } from '@/content/index';

const NL = 'netherlands-semiconductor-equipment';
const TW = 'taiwan-semiconductor-manufacturing';

const loaded = loadCorpus(productionRegistry);
if (!loaded.ok) throw new Error('corpus failed to load');
const corpus = loaded.corpus;
const nlClaims = corpus.modules.find((m) => m.caseId === NL)!.claims;
const twClaims = corpus.modules.find((m) => m.caseId === TW)!.claims;

describe('citedSourceIdsForClaims — generic, pure, corpus-agnostic', () => {
  const caseA = [{ citations: [{ sourceId: 'S1' }, { sourceId: 'S2' }] }];
  const caseB = [{ citations: [{ sourceId: 'S2' }, { sourceId: 'S3' }] }];

  it('a source cited by two cases appears in both cases’ scoped sets', () => {
    expect(citedSourceIdsForClaims(caseA).has('S2')).toBe(true);
    expect(citedSourceIdsForClaims(caseB).has('S2')).toBe(true);
  });

  it('excludes a source not cited by the case', () => {
    expect(citedSourceIdsForClaims(caseA).has('S3')).toBe(false); // S3 only in caseB
    expect(citedSourceIdsForClaims(caseB).has('S1')).toBe(false); // S1 only in caseA
  });

  it('a case’s scoped set depends ONLY on its own claims (adding another case cannot change it)', () => {
    const before = citedSourceIdsForClaims(caseA);
    // caseB and any number of new global sources exist elsewhere; caseA is unaffected.
    const after = citedSourceIdsForClaims(caseA);
    expect([...after].sort()).toEqual([...before].sort());
    expect(after.size).toBe(2);
  });
});

describe('research view — real shared corpus (Netherlands + Taiwan)', () => {
  it('the corpus really is shared (13 sources across both cases)', () => {
    expect(corpus.sources.length).toBe(13);
  });

  it('Netherlands exposes EXACTLY its 5 cited sources — unaffected by Taiwan’s 8', () => {
    const nl = buildNetherlandsResearchView(NL);
    expect(nl.sourceCount).toBe(5);
    expect(nl.sources).toHaveLength(5);
    expect(nl.sources.every((s) => s.id.startsWith('nl-src-'))).toBe(true);
    expect(nl.sources.some((s) => s.id.startsWith('tw-src-'))).toBe(false);
  });

  it('Taiwan exposes EXACTLY the sources its own claims cite (all 8, all tw-src-*)', () => {
    const tw = buildNetherlandsResearchView(TW);
    const expected = citedSourceIdsForClaims(twClaims);
    expect(tw.sourceCount).toBe(expected.size);
    expect(new Set(tw.sources.map((s) => s.id))).toEqual(expected);
    expect(tw.sources.every((s) => s.id.startsWith('tw-src-'))).toBe(true);
    expect(tw.sources.some((s) => s.id.startsWith('nl-src-'))).toBe(false);
    // every registered Taiwan source is actually cited (no orphan sources)
    expect(expected.size).toBe(8);
  });

  it('neither case’s cited-source set leaks into the other', () => {
    const nlSet = citedSourceIdsForClaims(nlClaims);
    const twSet = citedSourceIdsForClaims(twClaims);
    for (const id of twSet) expect(nlSet.has(id)).toBe(false);
    for (const id of nlSet) expect(twSet.has(id)).toBe(false);
  });
});
