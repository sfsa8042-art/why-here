/**
 * Increment 2 — structural cross-entity rules.
 * V1–V4 (references, ids, containment, module agreement),
 * V12–V13 (limitations), V14–V17 (relational/thesis types),
 * V19–V20 (question and node references), failure shape.
 */

import { describe, expect, it } from 'vitest';

import { validateCorpus, type Corpus, type RuleId } from '@/lib/validate';
import { ResearchQuestionSchema } from '@/lib/schemas';
import { makeCorpus, makeQuestion } from '@/content/__fixtures__/builders';
import * as structure from '@/content/__fixtures__/invalid/structure';
import * as limitations from '@/content/__fixtures__/invalid/limitations';

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

describe('baseline', () => {
  it('the unmodified builder corpus is clean', () => {
    expectClean(makeCorpus());
  });

  it('a valid two-case corpus with only in-case references is clean', () => {
    expectClean(structure.nearMissTwoCases);
  });

  it('failures are structured as { ruleId, entityId, message }', () => {
    const failures = validateCorpus(structure.v1MissingSourceRef);
    expect(failures.length).toBeGreaterThan(0);
    for (const failure of failures) {
      expect(typeof failure.ruleId).toBe('string');
      expect(typeof failure.entityId).toBe('string');
      expect(typeof failure.message).toBe('string');
      expect(failure.message.length).toBeGreaterThan(0);
    }
  });
});

describe('V1 — reference integrity', () => {
  it('rejects a citation whose sourceId resolves to nothing', () => {
    expectOnlyRule(structure.v1MissingSourceRef, 'V1');
    expect(validateCorpus(structure.v1MissingSourceRef)[0]?.entityId).toBe('builder-dangling');
  });
});

describe('V2 — global id uniqueness', () => {
  it('rejects a duplicated id in the global id-space', () => {
    expectOnlyRule(structure.v2DuplicateId, 'V2');
  });
});

describe('V3 — case containment', () => {
  it('rejects an edge referencing another case\'s node', () => {
    expectOnlyRule(structure.v3CrossCaseNodeRef, 'V3');
  });
});

describe('V4 — module agreement', () => {
  it('rejects a claim whose caseId mismatches its module', () => {
    expectOnlyRule(structure.v4ModuleMismatch, 'V4');
    expect(validateCorpus(structure.v4ModuleMismatch)[0]?.entityId).toBe('builder-mismatched');
  });
});

describe('V12 — limitation claim integrity', () => {
  it('rejects an unresolved limitation claim', () => {
    expectOnlyRule(limitations.v12MissingLimitation, 'V12');
  });

  it('rejects a self-referencing limitation', () => {
    expectOnlyRule(limitations.v12SelfReference, 'V12');
  });

  it('rejects a counterfactual limitation claim', () => {
    expectOnlyRule(limitations.v12CounterfactualLimitation, 'V12');
  });

  it('near-miss: a factual limitation claim is accepted', () => {
    expectClean(limitations.nearMissFactualLimitation);
  });
});

describe('V13 — limitation graph acyclicity', () => {
  it('rejects a direct limitation cycle', () => {
    expectOnlyRule(limitations.v13DirectCycle, 'V13');
  });

  it('rejects a transitive limitation cycle', () => {
    expectOnlyRule(limitations.v13TransitiveCycle, 'V13');
  });

  it('near-miss: an acyclic limitation chain is accepted', () => {
    expectClean(limitations.nearMissAcyclicChain);
  });
});

describe('V14 — relational claim type on mechanism edges', () => {
  it('rejects an edge whose claim is factual', () => {
    expectOnlyRule(structure.v14FactualEdgeClaim, 'V14');
  });

  it('near-miss: an interpretive edge claim is accepted', () => {
    expectClean(structure.nearMissInterpretiveEdgeClaim);
  });
});

describe('V15 — flagship thesis type', () => {
  it('rejects a factual flagship thesis', () => {
    expectOnlyRule(structure.v15FactualThesis, 'V15');
  });

  it('near-miss: a causal flagship thesis is accepted', () => {
    expectClean(structure.nearMissCausalThesis);
  });
});

describe('V16 — alternative-explanation thesis type', () => {
  it('rejects a factual alternative thesis', () => {
    expectOnlyRule(structure.v16FactualAltThesis, 'V16');
  });
});

describe('V17 — alternative completeness', () => {
  it('rejects an unresolved supporting claim', () => {
    expectOnlyRule(structure.v17UnresolvedSupporting, 'V17');
  });
});

describe('V19 — research question integrity', () => {
  it('rejects a cross-case rationale claim', () => {
    expectOnlyRule(structure.v19CrossCaseRationale, 'V19');
  });

  it('near-miss: a question with no rationaleClaimIds validates cleanly', () => {
    expectClean(structure.nearMissQuestionWithoutRationale);
  });

  it('a research question carries no epistemic status field', () => {
    const parsed = ResearchQuestionSchema.parse({
      ...makeQuestion({ id: 'q-status-probe' }),
      epistemicStatus: 'established', // unknown key: stripped, never carried
    });
    expect('epistemicStatus' in parsed).toBe(false);
  });
});

describe('V20 — node description integrity', () => {
  it('rejects an unresolved description claim', () => {
    expectOnlyRule(structure.v20UnresolvedDescription, 'V20');
  });
});
