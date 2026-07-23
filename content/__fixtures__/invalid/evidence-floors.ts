/**
 * INVALID fixtures — evidence rules (V5, V9, V10, V11).
 *
 * NOT RESEARCH CONTENT — synthetic corpora for validator tests.
 * Each `v*` corpus violates exactly one rule; each `nearMiss*` is the
 * closest valid variant.
 */

import type { Claim, Source } from '../../../lib/schemas.ts';
import type { Corpus } from '../../../lib/validate.ts';
import {
  defaultClaims,
  defaultSources,
  makeCausal,
  makeCitation,
  makeCorpus,
  makeCounterfactual,
  makeFactual,
  makeInterpretive,
  makeSource,
} from '../builders.ts';

/** Source palette exercising every floor distinction. */
export function floorSources(): Source[] {
  return [
    ...defaultSources(), // builder-academic-a/b (independent), builder-primary
    makeSource({
      id: 'flr-academic-dep',
      authors: ['Author Alpha'], // shares author AND institution with academic-a
      institution: 'Institution Alpha',
      doi: '10.9999/builder.dep',
    }),
    makeSource({
      id: 'flr-press-expert',
      sourceType: 'reputable_press',
      authors: ['Reporter One'],
      institution: 'Synthetic Journal',
    }),
    makeSource({
      id: 'flr-press-expert-2',
      sourceType: 'reputable_press',
      authors: ['Reporter Two'],
      institution: 'Synthetic Gazette',
    }),
    makeSource({ id: 'flr-press-anon', sourceType: 'reputable_press' }),
    makeSource({ id: 'flr-other', sourceType: 'other' }),
    makeSource({ id: 'flr-longform', lengthClass: 'long_form' }),
    makeSource({ id: 'flr-academic-anon' }), // academic, no authors, no institution
    makeSource({ id: 'flr-academic-inst-only', institution: 'Institution Gamma' }),
  ];
}

function floorCorpus(claims: Claim[]): Corpus {
  return makeCorpus({ sources: floorSources(), claims });
}

/* ---------------- V5 — locator precision ---------------- */

export const v5PlaceholderLongFormLocator: Corpus = floorCorpus([
  ...defaultClaims(),
  makeFactual({
    id: 'flr-claim',
    citations: [
      makeCitation({ sourceId: 'flr-longform', locator: { kind: 'page', value: 'TBD' } }),
    ],
  }),
]);

/* near-miss: the same placeholder on a short_form source is accepted */
export const nearMissPlaceholderShortForm: Corpus = floorCorpus([
  ...defaultClaims(),
  makeFactual({
    id: 'flr-claim',
    citations: [
      makeCitation({ sourceId: 'flr-press-anon', locator: { kind: 'page', value: 'TBD' } }),
    ],
  }),
]);

/* ---------------- V9 — status floors ---------------- */

/* factual/established with a single academic source: just fails */
export const v9FactualEstablishedSingleAcademic: Corpus = floorCorpus([
  ...defaultClaims(),
  makeFactual({
    id: 'flr-claim',
    epistemicStatus: 'established',
    citations: [makeCitation({ sourceId: 'builder-academic-a' })],
  }),
]);

/* factual/established on a DEPENDENT academic pair: just fails */
export const v9FactualEstablishedDependentPair: Corpus = floorCorpus([
  ...defaultClaims(),
  makeFactual({
    id: 'flr-claim',
    epistemicStatus: 'established',
    citations: [
      makeCitation({ sourceId: 'builder-academic-a' }),
      makeCitation({ sourceId: 'flr-academic-dep' }),
    ],
  }),
]);

/* near-miss: one primary supporting source suffices */
export const nearMissFactualEstablishedPrimary: Corpus = floorCorpus([
  ...defaultClaims(),
  makeFactual({
    id: 'flr-claim',
    epistemicStatus: 'established',
    citations: [makeCitation({ sourceId: 'builder-primary' })],
  }),
]);

/* near-miss: an independent academic pair suffices */
export const nearMissFactualEstablishedIndependentPair: Corpus = floorCorpus([
  ...defaultClaims(),
  makeFactual({
    id: 'flr-claim',
    epistemicStatus: 'established',
    citations: [
      makeCitation({ sourceId: 'builder-academic-a' }),
      makeCitation({ sourceId: 'builder-academic-b' }),
    ],
  }),
]);

/* factual/well_supported resting only on an `other` source: just fails */
export const v9FactualWellSupportedOtherOnly: Corpus = floorCorpus([
  ...defaultClaims(),
  makeFactual({
    id: 'flr-claim',
    citations: [makeCitation({ sourceId: 'flr-other' })],
  }),
]);

/* near-miss: anonymous reputable press meets the factual floor */
export const nearMissFactualWellSupportedPress: Corpus = floorCorpus([
  ...defaultClaims(),
  makeFactual({
    id: 'flr-claim',
    citations: [makeCitation({ sourceId: 'flr-press-anon' })],
  }),
]);

/* interpretive/well_supported on an ANONYMOUS academic source: just fails —
   anonymous or provenance-poor sources do not qualify as expert */
export const v9InterpretiveAnonymousAcademic: Corpus = floorCorpus([
  ...defaultClaims(),
  makeInterpretive({
    id: 'flr-claim',
    citations: [makeCitation({ sourceId: 'flr-academic-anon' })],
  }),
]);

/* near-miss: an academic source with an institution alone is expert */
export const nearMissInterpretiveInstitutionOnlyAcademic: Corpus = floorCorpus([
  ...defaultClaims(),
  makeInterpretive({
    id: 'flr-claim',
    citations: [makeCitation({ sourceId: 'flr-academic-inst-only' })],
  }),
]);

/* interpretive/well_supported on press without named authors: just fails */
export const v9InterpretiveNonExpertPair: Corpus = floorCorpus([
  ...defaultClaims(),
  makeInterpretive({
    id: 'flr-claim',
    citations: [
      makeCitation({ sourceId: 'flr-press-expert' }),
      makeCitation({ sourceId: 'flr-press-anon' }),
    ],
  }),
]);

/* near-miss: an independent expert press pair passes */
export const nearMissInterpretiveExpertPair: Corpus = floorCorpus([
  ...defaultClaims(),
  makeInterpretive({
    id: 'flr-claim',
    citations: [
      makeCitation({ sourceId: 'flr-press-expert' }),
      makeCitation({ sourceId: 'flr-press-expert-2' }),
    ],
  }),
]);

/* causal pair that is independent but lacks an academic member: just fails */
export const v9CausalNoAcademicMember: Corpus = floorCorpus([
  ...defaultClaims().filter((c) => c.id !== 'builder-causal'),
  makeCausal({
    id: 'builder-causal',
    citations: [
      makeCitation({ sourceId: 'builder-primary' }),
      makeCitation({ sourceId: 'flr-press-expert' }),
    ],
  }),
]);

/* causal pair that is academic but dependent: just fails */
export const v9CausalDependentPair: Corpus = floorCorpus([
  ...defaultClaims().filter((c) => c.id !== 'builder-causal'),
  makeCausal({
    id: 'builder-causal',
    citations: [
      makeCitation({ sourceId: 'builder-academic-a' }),
      makeCitation({ sourceId: 'flr-academic-dep' }),
    ],
  }),
]);

/* near-miss: press + academic independent pair passes the causal floor */
export const nearMissCausalMixedPair: Corpus = floorCorpus([
  ...defaultClaims().filter((c) => c.id !== 'builder-causal'),
  makeCausal({
    id: 'builder-causal',
    citations: [
      makeCitation({ sourceId: 'flr-press-expert' }),
      makeCitation({ sourceId: 'builder-academic-b' }),
    ],
  }),
]);

/* counterfactual without a supporting academic source: just fails */
export const v9CounterfactualNoAcademic: Corpus = floorCorpus([
  ...defaultClaims(),
  makeCounterfactual({
    id: 'flr-cf',
    citations: [makeCitation({ sourceId: 'flr-press-expert' })],
  }),
]);

/* near-miss: one supporting academic source passes the counterfactual floor */
export const nearMissCounterfactualAcademic: Corpus = floorCorpus([
  ...defaultClaims(),
  makeCounterfactual({
    id: 'flr-cf',
    citations: [makeCitation({ sourceId: 'builder-academic-a' })],
  }),
]);

/* ---------------- V10 — context-only bar ---------------- */

export const v10ContextOnlyWellSupported: Corpus = floorCorpus([
  ...defaultClaims(),
  makeFactual({
    id: 'flr-claim',
    citations: [makeCitation({ sourceId: 'builder-academic-a', evidenceRole: 'context' })],
  }),
]);

export const v10ContextOnlyEstablished: Corpus = floorCorpus([
  ...defaultClaims(),
  makeFactual({
    id: 'flr-claim',
    epistemicStatus: 'established',
    citations: [makeCitation({ sourceId: 'builder-primary', evidenceRole: 'context' })],
  }),
]);

/* near-miss: context-only is the honest home of `insufficient` */
export const nearMissContextOnlyInsufficient: Corpus = floorCorpus([
  ...defaultClaims(),
  makeFactual({
    id: 'flr-claim',
    epistemicStatus: 'insufficient',
    citations: [makeCitation({ sourceId: 'builder-academic-a', evidenceRole: 'context' })],
  }),
]);

/* ---------------- V11 — contested rule ---------------- */

/* contested with no contradicting citation at all: just fails */
export const v11ContestedNoContradiction: Corpus = floorCorpus([
  ...defaultClaims(),
  makeInterpretive({
    id: 'flr-claim',
    epistemicStatus: 'contested',
    citations: [makeCitation({ sourceId: 'builder-academic-a' })],
  }),
]);

/* contested where the two sides are mutually DEPENDENT: just fails */
export const v11ContestedDependentSides: Corpus = floorCorpus([
  ...defaultClaims(),
  makeInterpretive({
    id: 'flr-claim',
    epistemicStatus: 'contested',
    citations: [
      makeCitation({ sourceId: 'builder-academic-a' }),
      makeCitation({ sourceId: 'flr-academic-dep', evidenceRole: 'contradicts' }),
    ],
  }),
]);

/* near-miss: independent supporting and contradicting sources pass */
export const nearMissContestedIndependent: Corpus = floorCorpus([
  ...defaultClaims(),
  makeInterpretive({
    id: 'flr-claim',
    epistemicStatus: 'contested',
    citations: [
      makeCitation({ sourceId: 'builder-academic-a' }),
      makeCitation({ sourceId: 'builder-academic-b', evidenceRole: 'contradicts' }),
    ],
  }),
]);
