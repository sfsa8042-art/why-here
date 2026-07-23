/**
 * INVALID fixtures — preview honesty (V18).
 *
 * NOT RESEARCH CONTENT — synthetic corpora for validator tests.
 * Each `v*` corpus violates exactly one rule.
 */

import type { Case, Claim } from '../../../lib/schemas.ts';
import type { CaseContentModule, Corpus } from '../../../lib/validate.ts';
import {
  defaultSources,
  makeCitation,
  makeFactual,
  makeQuestion,
} from '../builders.ts';

const PREVIEW_CASE_ID = 'builder-preview-case';

const previewCase: Case = {
  id: PREVIEW_CASE_ID,
  country: 'Synthetic Preview Country',
  industry: 'Synthetic Preview Industry',
  status: 'preview',
  researchQuestionIds: ['pv-question'],
};

function insufficientClaim(id: string): Claim {
  return makeFactual({
    id,
    caseId: PREVIEW_CASE_ID,
    epistemicStatus: 'insufficient',
    citations: [makeCitation({ sourceId: 'builder-academic-a', evidenceRole: 'context' })],
  });
}

function previewCorpus(claims: Claim[]): Corpus {
  const module: CaseContentModule = {
    caseId: PREVIEW_CASE_ID,
    case: previewCase,
    claims,
    researchQuestions: [makeQuestion({ id: 'pv-question', caseId: PREVIEW_CASE_ID })],
    nodes: [],
    edges: [],
    alternativeExplanations: [],
  };
  return { sources: defaultSources(), modules: [module] };
}

/* V18 — a preview carrying a claim above insufficient */
export const v18PreviewStatusTooHigh: Corpus = previewCorpus([
  insufficientClaim('pv-claim-1'),
  makeFactual({ id: 'pv-claim-2', caseId: PREVIEW_CASE_ID }), // well_supported
]);

/* V18 — a preview exceeding the claim ceiling (11 > default 10) */
export const v18PreviewOverCeiling: Corpus = previewCorpus(
  Array.from({ length: 11 }, (_, i) => insufficientClaim(`pv-claim-${i}`)),
);

/* near-miss: an honest preview — questions plus insufficient claims only */
export const nearMissHonestPreview: Corpus = previewCorpus([
  insufficientClaim('pv-claim-1'),
  insufficientClaim('pv-claim-2'),
]);
