/**
 * INVALID fixture — Increment 1.
 *
 * Violates exactly one rule: a causal claim without `limitationClaimIds`
 * (Spec v2 F18 / v2.1 D15, F25). ClaimSchema MUST reject this.
 *
 * Typed as `unknown` deliberately: the object is invalid by construction,
 * so it cannot be annotated as a Claim — TypeScript would reject the file
 * before Zod ever ran, which would prove nothing about RUNTIME validation.
 * That is the whole point of Zod (Spec v2 D4): content is data, and types
 * vanish at runtime.
 */

/** A causal claim with NO limitationClaimIds field at all. */
export const causalClaimMissingLimitations: unknown = {
  id: 'invalid-claim-causal-no-limitations',
  caseId: 'fixture-case',
  claimType: 'causal',
  statement:
    'Prior fixture capability contributed to the later fixture outcome.',
  epistemicStatus: 'well_supported',
  citations: [
    {
      id: 'invalid-cit-causal-no-limitations',
      sourceId: 'fixture-academic-a',
      locator: { kind: 'section', value: '4.1' },
      evidenceRole: 'supports',
    },
  ],
  lensFacets: ['related_supporting'],
  // limitationClaimIds: MISSING — the violation under test
};

/**
 * Near-miss variant: identical, but `limitationClaimIds` is an EMPTY array.
 * Guards against a rule that only checks field presence: min(1) must also
 * reject an empty list.
 */
export const causalClaimEmptyLimitations: unknown = {
  id: 'invalid-claim-causal-empty-limitations',
  caseId: 'fixture-case',
  claimType: 'causal',
  statement:
    'Prior fixture capability contributed to the later fixture outcome.',
  epistemicStatus: 'well_supported',
  citations: [
    {
      id: 'invalid-cit-causal-empty-limitations',
      sourceId: 'fixture-academic-a',
      locator: { kind: 'section', value: '4.1' },
      evidenceRole: 'supports',
    },
  ],
  lensFacets: ['related_supporting'],
  limitationClaimIds: [],
};
