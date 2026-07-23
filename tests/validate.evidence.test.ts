/**
 * Increment 2 — evidence rules.
 * V5 (locator precision), V9 (status floors), V10 (context-only bar),
 * V11 (contested rule), V18 (preview honesty), plus the Increment 1
 * valid fixture passing the whole validator.
 */

import { describe, expect, it } from 'vitest';

import {
  PREVIEW_CLAIM_CEILING,
  validateCorpus,
  type Corpus,
  type RuleId,
} from '@/lib/validate';
import * as floors from '@/content/__fixtures__/invalid/evidence-floors';
import * as preview from '@/content/__fixtures__/invalid/preview';
import {
  alternativeExplanations,
  claims,
  edges,
  flagshipCase,
  nodes,
  researchQuestions,
  sources,
  CASE_ID,
} from '@/content/__fixtures__/valid/minimal-case';

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

describe('integration — the Increment 1 valid fixture passes V1–V20', () => {
  it('validates the whole minimal case with zero failures', () => {
    const corpus: Corpus = {
      sources,
      modules: [{
        caseId: CASE_ID,
        case: flagshipCase,
        claims,
        researchQuestions,
        nodes,
        edges,
        alternativeExplanations,
      }],
    };
    expect(validateCorpus(corpus)).toEqual([]);
  });
});

describe('V5 — locator precision', () => {
  it('rejects a placeholder locator on a long_form source', () => {
    expectOnlyRule(floors.v5PlaceholderLongFormLocator, 'V5');
  });

  it('near-miss: the same placeholder on a short_form source is accepted', () => {
    expectClean(floors.nearMissPlaceholderShortForm);
  });
});

describe('V9 — status floors', () => {
  it('factual/established: single academic source just fails', () => {
    expectOnlyRule(floors.v9FactualEstablishedSingleAcademic, 'V9');
  });

  it('factual/established: dependent academic pair just fails', () => {
    expectOnlyRule(floors.v9FactualEstablishedDependentPair, 'V9');
  });

  it('factual/established: one primary source just passes', () => {
    expectClean(floors.nearMissFactualEstablishedPrimary);
  });

  it('factual/established: independent academic pair just passes', () => {
    expectClean(floors.nearMissFactualEstablishedIndependentPair);
  });

  it('factual/well_supported: `other`-only support just fails', () => {
    expectOnlyRule(floors.v9FactualWellSupportedOtherOnly, 'V9');
  });

  it('factual/well_supported: reputable press just passes', () => {
    expectClean(floors.nearMissFactualWellSupportedPress);
  });

  it('interpretive/well_supported: an anonymous academic source just fails', () => {
    expectOnlyRule(floors.v9InterpretiveAnonymousAcademic, 'V9');
  });

  it('interpretive/well_supported: an institution-only academic just passes', () => {
    expectClean(floors.nearMissInterpretiveInstitutionOnlyAcademic);
  });

  it('interpretive/well_supported: non-expert press pair just fails', () => {
    expectOnlyRule(floors.v9InterpretiveNonExpertPair, 'V9');
  });

  it('interpretive/well_supported: independent expert pair just passes', () => {
    expectClean(floors.nearMissInterpretiveExpertPair);
  });

  it('causal: independent pair without an academic member just fails', () => {
    expectOnlyRule(floors.v9CausalNoAcademicMember, 'V9');
  });

  it('causal: dependent academic pair just fails', () => {
    expectOnlyRule(floors.v9CausalDependentPair, 'V9');
  });

  it('causal: independent press + academic pair just passes', () => {
    expectClean(floors.nearMissCausalMixedPair);
  });

  it('counterfactual: no supporting academic source just fails', () => {
    expectOnlyRule(floors.v9CounterfactualNoAcademic, 'V9');
  });

  it('counterfactual: one supporting academic source just passes', () => {
    expectClean(floors.nearMissCounterfactualAcademic);
  });
});

describe('V10 — context-only bar', () => {
  it('rejects context-only citations for well_supported', () => {
    expectOnlyRule(floors.v10ContextOnlyWellSupported, 'V10');
  });

  it('rejects context-only citations for established', () => {
    expectOnlyRule(floors.v10ContextOnlyEstablished, 'V10');
  });

  it('near-miss: context-only citations are accepted for insufficient', () => {
    expectClean(floors.nearMissContextOnlyInsufficient);
  });
});

describe('V11 — contested rule', () => {
  it('rejects a contested claim with no contradicting citation', () => {
    expectOnlyRule(floors.v11ContestedNoContradiction, 'V11');
  });

  it('rejects a contested claim whose two sides are mutually dependent', () => {
    expectOnlyRule(floors.v11ContestedDependentSides, 'V11');
  });

  it('near-miss: independent supporting and contradicting sources pass', () => {
    expectClean(floors.nearMissContestedIndependent);
  });
});

describe('V18 — preview honesty', () => {
  it('rejects a preview carrying a claim above insufficient', () => {
    expectOnlyRule(preview.v18PreviewStatusTooHigh, 'V18');
  });

  it('rejects a preview exceeding the claim ceiling', () => {
    expectOnlyRule(preview.v18PreviewOverCeiling, 'V18');
  });

  it('the ceiling is configurable via options', () => {
    const failures = validateCorpus(preview.nearMissHonestPreview, {
      previewClaimCeiling: 1,
    });
    expect(failures.map((f) => f.ruleId)).toEqual(['V18']);
    expect(PREVIEW_CLAIM_CEILING).toBe(10);
  });

  it('near-miss: an honest preview (questions + insufficient claims) passes', () => {
    expectClean(preview.nearMissHonestPreview);
  });
});
