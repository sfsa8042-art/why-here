/**
 * Case-lifecycle amendment tests: preview | research | flagship.
 *
 * The research state holds verified claims at the statuses they
 * actually earn, without a thesis, without the preview ceiling, and
 * without weakening any evidence floor.
 */

import { describe, expect, it } from 'vitest';

import { CaseSchema, ResearchCaseSchema } from '@/lib/schemas';
import { validateCorpus, type CaseContentModule, type Corpus } from '@/lib/validate';
import { loadCorpus } from '@/lib/loadContent';
import { productionRegistry } from '@/content/index';
import {
  defaultClaims,
  makeCitation,
  makeCorpus,
  makeEdge,
  makeFactual,
  makeFlagshipCase,
  makeInterpretive,
  makeNode,
  makeQuestion,
  makeResearchCase,
} from '@/content/__fixtures__/builders';
import { v18PreviewStatusTooHigh } from '@/content/__fixtures__/invalid/preview';

/** Claims that earn their statuses honestly, with no causal claim. */
const nonCausalClaims = () => defaultClaims().filter((c) => c.claimType !== 'causal');

/** A research-case corpus: earned statuses, no thesis, no causal claims. */
function researchCorpus(): Corpus {
  return makeCorpus({
    case: makeResearchCase(),
    claims: nonCausalClaims(),
    edges: [], // the default edge references the removed causal claim
  });
}

describe('research case — schema', () => {
  it('parses with at least one research question and no thesis', () => {
    expect(CaseSchema.safeParse(makeResearchCase()).success).toBe(true);
  });

  it('rejects a thesisClaimId (structurally absent, .strict())', () => {
    expect(ResearchCaseSchema.safeParse({
      ...makeResearchCase(),
      thesisClaimId: 'builder-thesis',
    }).success).toBe(false);
  });

  it('rejects zero research questions', () => {
    expect(ResearchCaseSchema.safeParse({
      ...makeResearchCase(),
      researchQuestionIds: [],
    }).success).toBe(false);
  });
});

describe('research case — validator', () => {
  it('carries well_supported factual and interpretive claims without a thesis (req 2)', () => {
    const corpus = researchCorpus();
    expect(validateCorpus(corpus)).toEqual([]);
    const claims = corpus.modules[0]!.claims;
    expect(claims.some((c) => c.claimType === 'factual' && c.epistemicStatus === 'well_supported')).toBe(true);
    expect(claims.some((c) => c.claimType === 'interpretive' && c.epistemicStatus === 'well_supported')).toBe(true);
  });

  it('may contain zero causal or counterfactual claims (req 3)', () => {
    const corpus = researchCorpus();
    expect(corpus.modules[0]!.claims.every(
      (c) => c.claimType !== 'causal' && c.claimType !== 'counterfactual',
    )).toBe(true);
    expect(validateCorpus(corpus)).toEqual([]);
  });

  it('is exempt from the preview claim ceiling', () => {
    const corpus = researchCorpus();
    expect(validateCorpus(corpus, { previewClaimCeiling: 1 })).toEqual([]);
  });

  it('cannot contain cross-case references (req 4)', () => {
    const otherModule: CaseContentModule = {
      caseId: 'builder-other-case',
      case: makeFlagshipCase({
        id: 'builder-other-case',
        thesisClaimId: 'other-thesis',
        researchQuestionIds: ['other-question'],
      }),
      claims: [
        makeInterpretive({ id: 'other-thesis', caseId: 'builder-other-case' }),
      ],
      researchQuestions: [makeQuestion({ id: 'other-question', caseId: 'builder-other-case' })],
      nodes: [makeNode({ id: 'other-node', caseId: 'builder-other-case' })],
      edges: [],
      alternativeExplanations: [],
    };
    const corpus = makeCorpus({
      case: makeResearchCase(),
      claims: nonCausalClaims(),
      edges: [makeEdge({
        id: 'builder-edge',
        toNodeId: 'other-node',
        claimId: 'builder-thesis',
      })],
      extraModules: [otherModule],
    });
    const failures = validateCorpus(corpus);
    expect(failures.map((f) => f.ruleId)).toEqual(['V3']);
  });
});

describe('lifecycle invariants', () => {
  it('a preview case still cannot carry a well-supported finding (req 1)', () => {
    const failures = validateCorpus(v18PreviewStatusTooHigh);
    expect(failures.map((f) => f.ruleId)).toEqual(['V18']);
  });

  it('a flagship case still requires an interpretive or causal thesis (req 5)', () => {
    const corpus = makeCorpus({
      case: makeFlagshipCase({ thesisClaimId: 'builder-factual' }),
    });
    expect(validateCorpus(corpus).map((f) => f.ruleId)).toEqual(['V15']);
  });

  it('status conversion does not change claim evidence requirements (req 6)', () => {
    // an established claim missing its floor: fails V9 identically in a
    // research case and a flagship case — floors are status-independent
    const underFloored = () => [
      ...nonCausalClaims(),
      makeFactual({
        id: 'under-floored',
        epistemicStatus: 'established',
        citations: [makeCitation({ sourceId: 'builder-academic-a' })],
      }),
    ];
    const asResearch = validateCorpus(makeCorpus({
      case: makeResearchCase(),
      claims: underFloored(),
      edges: [],
    }));
    const asFlagship = validateCorpus(makeCorpus({
      claims: [...underFloored(),
        // flagship needs its causal claim back for the default edge
        ...defaultClaims().filter((c) => c.claimType === 'causal')],
    }));
    expect(asResearch).toEqual(asFlagship);
    expect(asResearch.map((f) => [f.ruleId, f.entityId])).toEqual([['V9', 'under-floored']]);
  });

  it('the existing Netherlands preview remains valid before conversion (req 7)', () => {
    const result = loadCorpus(productionRegistry);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(validateCorpus(result.corpus)).toEqual([]);
    expect(result.corpus.modules[0]?.case.status).toBe('preview');
  });
});
