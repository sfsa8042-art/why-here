/**
 * Increment 1 schema tests.
 *
 * Scope: SCHEMA-level validation only. Cross-entity rules (reference
 * integrity, limitation-graph acyclicity, provenance cycles, independent
 * subsets, duplicate sources) arrive with the validator in Increment 2
 * and are not asserted here.
 */

import { describe, expect, it } from 'vitest';

import {
  AlternativeExplanationSchema,
  CaseSchema,
  ClaimSchema,
  MechanismEdgeSchema,
  MechanismNodeSchema,
  ResearchQuestionSchema,
  SourceSchema,
} from '@/lib/schemas';

import {
  alternativeExplanations,
  claims,
  edges,
  flagshipCase,
  nodes,
  researchQuestions,
  sources,
} from '@/content/__fixtures__/valid/minimal-case';

import {
  causalClaimEmptyLimitations,
  causalClaimMissingLimitations,
} from '@/content/__fixtures__/invalid/causal-claim-missing-limitations';

describe('valid fixture parses successfully', () => {
  it('parses every source', () => {
    for (const source of sources) {
      expect(SourceSchema.safeParse(source).success).toBe(true);
    }
  });

  it('parses every claim', () => {
    for (const claim of claims) {
      const result = ClaimSchema.safeParse(claim);
      expect(result.success, `claim ${claim.id} failed to parse`).toBe(true);
    }
  });

  it('parses research questions, nodes, edges and alternatives', () => {
    for (const q of researchQuestions) {
      expect(ResearchQuestionSchema.safeParse(q).success).toBe(true);
    }
    for (const n of nodes) {
      expect(MechanismNodeSchema.safeParse(n).success).toBe(true);
    }
    for (const e of edges) {
      expect(MechanismEdgeSchema.safeParse(e).success).toBe(true);
    }
    for (const a of alternativeExplanations) {
      expect(AlternativeExplanationSchema.safeParse(a).success).toBe(true);
    }
  });

  it('parses the flagship case', () => {
    expect(CaseSchema.safeParse(flagshipCase).success).toBe(true);
  });

  it('contains no counterfactual claim (v2.1 D20: capability, not quota)', () => {
    expect(claims.some((c) => c.claimType === 'counterfactual')).toBe(false);
  });
});

describe('invalid fixture: causal claim without limitationClaimIds', () => {
  it('rejects a causal claim with the field absent', () => {
    const result = ClaimSchema.safeParse(causalClaimMissingLimitations);
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join('.'));
      expect(paths).toContain('limitationClaimIds');
    }
  });

  it('rejects a causal claim with an empty limitationClaimIds array', () => {
    const result = ClaimSchema.safeParse(causalClaimEmptyLimitations);
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join('.'));
      expect(paths).toContain('limitationClaimIds');
    }
  });

  it('near-miss: the same claim WITH a limitation id is accepted', () => {
    const repaired = {
      ...(causalClaimMissingLimitations as Record<string, unknown>),
      limitationClaimIds: ['fixture-claim-limitation'],
    };
    expect(ClaimSchema.safeParse(repaired).success).toBe(true);
  });
});
