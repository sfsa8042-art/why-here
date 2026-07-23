/**
 * INVALID fixtures — structural/reference rules (V1–V4, V14–V17, V19, V20).
 *
 * NOT RESEARCH CONTENT — synthetic corpora for validator tests.
 * Each exported corpus violates exactly one rule; `nearMiss*` exports
 * are the closest valid variants, guarding against over-broad rules.
 */

import type { Corpus, CaseContentModule } from '../../../lib/validate.ts';
import {
  FIXTURE_CASE_ID,
  defaultClaims,
  makeAlternative,
  makeCausal,
  makeCitation,
  makeCorpus,
  makeEdge,
  makeFactual,
  makeFlagshipCase,
  makeInterpretive,
  makeNode,
  makeQuestion,
} from '../builders.ts';

const OTHER_CASE_ID = 'builder-other-case';

/** A minimal second case module, used by cross-case fixtures. */
function otherModule(): CaseContentModule {
  return {
    caseId: OTHER_CASE_ID,
    case: makeFlagshipCase({
      id: OTHER_CASE_ID,
      thesisClaimId: 'other-thesis',
      researchQuestionIds: ['other-question'],
    }),
    claims: [
      makeInterpretive({ id: 'other-thesis', caseId: OTHER_CASE_ID }),
      makeInterpretive({ id: 'other-limitation', caseId: OTHER_CASE_ID }),
    ],
    researchQuestions: [makeQuestion({ id: 'other-question', caseId: OTHER_CASE_ID })],
    nodes: [makeNode({ id: 'other-node', caseId: OTHER_CASE_ID })],
    edges: [],
    alternativeExplanations: [],
  };
}

/* V1 — a citation whose sourceId resolves to nothing */
export const v1MissingSourceRef: Corpus = makeCorpus({
  claims: [
    ...defaultClaims(),
    makeFactual({
      id: 'builder-dangling',
      citations: [
        makeCitation({ sourceId: 'no-such-source' }),
        // a resolvable second citation keeps the status floor met, so the
        // dangling reference is the corpus's only defect
        makeCitation({ sourceId: 'builder-academic-a' }),
      ],
    }),
  ],
});

/* V2 — the same id used twice in the global id-space */
export const v2DuplicateId: Corpus = makeCorpus({
  claims: [
    ...defaultClaims(),
    makeFactual({ id: 'builder-factual' }), // duplicates an existing claim id
  ],
});

/* V3 — an edge referencing a node that belongs to another case */
export const v3CrossCaseNodeRef: Corpus = makeCorpus({
  edges: [makeEdge({ id: 'builder-edge', toNodeId: 'other-node' })],
  extraModules: [otherModule()],
});

/* V4 — a claim whose caseId does not match its content module */
export const v4ModuleMismatch: Corpus = makeCorpus({
  claims: [
    ...defaultClaims(),
    makeFactual({ id: 'builder-mismatched', caseId: 'some-other-case' }),
  ],
});

/* V14 — a mechanism edge whose claim is factual, not causal/interpretive */
export const v14FactualEdgeClaim: Corpus = makeCorpus({
  edges: [makeEdge({ id: 'builder-edge', claimId: 'builder-factual' })],
});

/* near-miss: an interpretive edge claim is accepted */
export const nearMissInterpretiveEdgeClaim: Corpus = makeCorpus({
  edges: [makeEdge({ id: 'builder-edge', claimId: 'builder-thesis' })],
});

/* V15 — a flagship thesis resolving to a factual claim */
export const v15FactualThesis: Corpus = makeCorpus({
  case: makeFlagshipCase({ thesisClaimId: 'builder-factual' }),
});

/* near-miss: a causal thesis is accepted */
export const nearMissCausalThesis: Corpus = makeCorpus({
  case: makeFlagshipCase({ thesisClaimId: 'builder-causal' }),
});

/* V16 — an alternative-explanation thesis resolving to a factual claim */
export const v16FactualAltThesis: Corpus = makeCorpus({
  alternativeExplanations: [
    makeAlternative({ id: 'builder-alt', thesisClaimId: 'builder-factual' }),
  ],
});

/* V17 — an alternative whose supporting claim does not resolve */
export const v17UnresolvedSupporting: Corpus = makeCorpus({
  alternativeExplanations: [
    makeAlternative({ id: 'builder-alt', supportingClaimIds: ['no-such-claim'] }),
  ],
});

/* V19 — a research question whose rationale claim crosses cases */
export const v19CrossCaseRationale: Corpus = makeCorpus({
  researchQuestions: [
    makeQuestion({ id: 'builder-question', rationaleClaimIds: ['other-limitation'] }),
  ],
  extraModules: [otherModule()],
});

/* near-miss: a question with no rationaleClaimIds validates cleanly */
export const nearMissQuestionWithoutRationale: Corpus = makeCorpus({
  researchQuestions: [makeQuestion({ id: 'builder-question' })],
});

/* V20 — a node whose description claim does not resolve */
export const v20UnresolvedDescription: Corpus = makeCorpus({
  nodes: [
    makeNode({ id: 'builder-node-a', descriptionClaimIds: ['no-such-claim'] }),
    makeNode({ id: 'builder-node-b' }),
  ],
});

/* fully valid two-case corpus: cross-case *shape*, in-case references */
export const nearMissTwoCases: Corpus = makeCorpus({
  extraModules: [otherModule()],
});

export { FIXTURE_CASE_ID, OTHER_CASE_ID, makeCausal };
