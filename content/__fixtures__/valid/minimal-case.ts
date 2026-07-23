/**
 * Valid minimal fixture — Increment 1.
 *
 * PURPOSE: prove the schema contract is SATISFIABLE, not merely strict.
 *
 * NOT RESEARCH CONTENT. The statements below are structural placeholders
 * for a synthetic test case ("fixture-case"), not assertions about the
 * Netherlands or any real subject. Real Netherlands research content is
 * out of scope until a later increment and will be authored against
 * actual located sources.
 *
 * Per v2.1 D20, this fixture contains NO counterfactual claim. Support
 * for counterfactual claims is a capability of the contract, not a quota
 * every case must fill; unit fixtures cover all four claim types.
 */

import type {
  AlternativeExplanation,
  Claim,
  FlagshipCase,
  MechanismEdge,
  MechanismNode,
  ResearchQuestion,
  Source,
} from '@/lib/schemas';

export const CASE_ID = 'fixture-case';

export const sources: Source[] = [
  {
    id: 'fixture-primary-doc',
    title: 'Fixture Contemporaneous Document',
    sourceType: 'documentary',
    temporalRelation: 'contemporaneous',
    subjectRelationship: 'subject_authored',
    lengthClass: 'long_form',
    institution: 'Fixture Archive',
    url: 'https://example.org/fixture/primary',
  },
  {
    id: 'fixture-academic-a',
    title: 'Fixture Academic Analysis A',
    sourceType: 'academic',
    temporalRelation: 'retrospective',
    subjectRelationship: 'independent',
    lengthClass: 'long_form',
    authors: ['Author A'],
    institution: 'Institution Alpha',
    doi: '10.0000/fixture.a',
  },
  {
    id: 'fixture-academic-b',
    title: 'Fixture Academic Analysis B',
    sourceType: 'academic',
    temporalRelation: 'retrospective',
    subjectRelationship: 'independent',
    lengthClass: 'long_form',
    authors: ['Author B'],
    institution: 'Institution Beta',
    doi: '10.0000/fixture.b',
  },
];

export const claims: Claim[] = [
  // factual / established — permitted only for factual claims
  {
    id: 'fixture-claim-factual',
    caseId: CASE_ID,
    claimType: 'factual',
    statement: 'The fixture entity was constituted in the fixture year.',
    epistemicStatus: 'established',
    citations: [
      {
        sourceId: 'fixture-primary-doc',
        locator: { kind: 'page', value: '12' },
        evidenceRole: 'supports',
      },
    ],
    lensFacets: ['factor_conditions'],
    timeline: { year: 1984 },
  },

  // interpretive — capped at well_supported; serves as the case thesis
  {
    id: 'fixture-claim-thesis',
    caseId: CASE_ID,
    claimType: 'interpretive',
    statement:
      'The fixture configuration is best read as an accumulation of prior capability.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        sourceId: 'fixture-academic-a',
        locator: { kind: 'section', value: '3.2' },
        evidenceRole: 'supports',
      },
    ],
    lensFacets: ['related_supporting'],
  },

  // limitation claim, referenced by the causal claim below
  {
    id: 'fixture-claim-limitation',
    caseId: CASE_ID,
    claimType: 'interpretive',
    statement:
      'The available fixture evidence does not isolate the contribution of any single factor.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        sourceId: 'fixture-academic-b',
        locator: { kind: 'section', value: '5.1' },
        evidenceRole: 'supports',
      },
    ],
    lensFacets: [],
  },

  // causal — capped at well_supported, limitationClaimIds structurally required
  {
    id: 'fixture-claim-causal',
    caseId: CASE_ID,
    claimType: 'causal',
    statement:
      'Prior fixture capability contributed to the later fixture outcome.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        sourceId: 'fixture-academic-a',
        locator: { kind: 'section', value: '4.1' },
        evidenceRole: 'supports',
      },
      {
        sourceId: 'fixture-academic-b',
        locator: { kind: 'section', value: '2.4' },
        evidenceRole: 'supports',
      },
    ],
    lensFacets: ['related_supporting'],
    limitationClaimIds: ['fixture-claim-limitation'],
  },

  // contested — requires independent supports + contradicts
  {
    id: 'fixture-claim-contested',
    caseId: CASE_ID,
    claimType: 'interpretive',
    statement:
      'The relative weight of fixture policy versus fixture market demand is disputed.',
    epistemicStatus: 'contested',
    citations: [
      {
        sourceId: 'fixture-academic-a',
        locator: { kind: 'section', value: '6.0' },
        evidenceRole: 'supports',
      },
      {
        sourceId: 'fixture-academic-b',
        locator: { kind: 'section', value: '6.0' },
        evidenceRole: 'contradicts',
      },
    ],
    lensFacets: ['government'],
  },
];

export const researchQuestions: ResearchQuestion[] = [
  {
    id: 'fixture-question-1',
    caseId: CASE_ID,
    question: 'How much of the fixture outcome is attributable to prior capability?',
    rationaleClaimIds: ['fixture-claim-limitation'],
  },
];

export const nodes: MechanismNode[] = [
  {
    id: 'fixture-node-institution',
    caseId: CASE_ID,
    label: 'Fixture Research Institution',
    nodeType: 'institution',
  },
  {
    id: 'fixture-node-capability',
    caseId: CASE_ID,
    label: 'Fixture Technical Capability',
    nodeType: 'capability',
  },
];

export const edges: MechanismEdge[] = [
  {
    id: 'fixture-edge-1',
    caseId: CASE_ID,
    fromNodeId: 'fixture-node-institution',
    toNodeId: 'fixture-node-capability',
    claimId: 'fixture-claim-causal',
  },
];

export const alternativeExplanations: AlternativeExplanation[] = [
  {
    id: 'fixture-alt-1',
    caseId: CASE_ID,
    thesisClaimId: 'fixture-claim-thesis',
    supportingClaimIds: ['fixture-claim-factual'],
    opposingClaimIds: ['fixture-claim-contested'],
    limitationClaimIds: ['fixture-claim-limitation'],
  },
];

export const flagshipCase: FlagshipCase = {
  id: CASE_ID,
  country: 'Fixture Country',
  industry: 'Fixture Industry',
  status: 'flagship',
  thesisClaimId: 'fixture-claim-thesis',
  researchQuestionIds: ['fixture-question-1'],
};
