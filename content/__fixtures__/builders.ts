/**
 * Synthetic fixture builders — Increment 2.
 *
 * NOT RESEARCH CONTENT. Everything produced here is a structural
 * placeholder for validator tests; no statement refers to any real
 * subject, and every default is deliberately generic.
 *
 * Defaults are chosen so that an unmodified corpus built from these
 * helpers passes validateCorpus cleanly; each invalid fixture then
 * overrides exactly one aspect to violate exactly one rule.
 */

import type {
  AlternativeExplanation,
  Case,
  Citation,
  Claim,
  FactualClaim,
  InterpretiveClaim,
  CausalClaim,
  CounterfactualClaim,
  MechanismEdge,
  MechanismNode,
  ResearchQuestion,
  Source,
} from '../../lib/schemas.ts';
import type { CaseContentModule, Corpus } from '../../lib/validate.ts';

export const FIXTURE_CASE_ID = 'builder-case';

export function makeSource(over: Partial<Source> & { id: string }): Source {
  return {
    title: `Synthetic source ${over.id}`,
    sourceType: 'academic',
    lengthClass: 'short_form',
    url: `https://example.org/${over.id}`,
    ...over,
  };
}

export function makeCitation(over: Partial<Citation> & { sourceId: string }): Citation {
  return {
    locator: { kind: 'section', value: '1.1' },
    evidenceRole: 'supports',
    ...over,
  };
}

type ClaimBaseOver = {
  id: string;
  caseId?: string;
  statement?: string;
  citations?: Citation[];
  lensFacets?: FactualClaim['lensFacets'];
  timeline?: FactualClaim['timeline'];
};

function claimBase(over: ClaimBaseOver) {
  return {
    caseId: FIXTURE_CASE_ID,
    statement: `Synthetic fixture statement for ${over.id}.`,
    citations: [makeCitation({ sourceId: 'builder-academic-a' })],
    lensFacets: [],
    ...over,
  };
}

export function makeFactual(
  over: ClaimBaseOver & { epistemicStatus?: FactualClaim['epistemicStatus'] },
): FactualClaim {
  return { claimType: 'factual', epistemicStatus: 'well_supported', ...claimBase(over) };
}

export function makeInterpretive(
  over: ClaimBaseOver & { epistemicStatus?: InterpretiveClaim['epistemicStatus'] },
): InterpretiveClaim {
  return { claimType: 'interpretive', epistemicStatus: 'well_supported', ...claimBase(over) };
}

export function makeCausal(
  over: ClaimBaseOver & {
    epistemicStatus?: CausalClaim['epistemicStatus'];
    limitationClaimIds?: string[];
  },
): CausalClaim {
  return {
    claimType: 'causal',
    epistemicStatus: 'well_supported',
    limitationClaimIds: ['builder-limitation'],
    ...claimBase({
      citations: [
        makeCitation({ sourceId: 'builder-academic-a' }),
        makeCitation({ sourceId: 'builder-academic-b' }),
      ],
      ...over,
    }),
  };
}

export function makeCounterfactual(
  over: ClaimBaseOver & {
    epistemicStatus?: CounterfactualClaim['epistemicStatus'];
    limitationClaimIds?: string[];
    analyticalMethod?: string;
  },
): CounterfactualClaim {
  return {
    claimType: 'counterfactual',
    epistemicStatus: 'well_supported',
    limitationClaimIds: ['builder-limitation'],
    speculativeMarker: true,
    analyticalMethod: 'synthetic comparison of fixture trajectories',
    ...claimBase(over),
  };
}

export function makeQuestion(
  over: Partial<ResearchQuestion> & { id: string },
): ResearchQuestion {
  return {
    caseId: FIXTURE_CASE_ID,
    question: `Synthetic question ${over.id}?`,
    ...over,
  };
}

export function makeNode(over: Partial<MechanismNode> & { id: string }): MechanismNode {
  return {
    caseId: FIXTURE_CASE_ID,
    label: `Synthetic Entity ${over.id}`,
    nodeType: 'institution',
    ...over,
  };
}

export function makeEdge(over: Partial<MechanismEdge> & { id: string }): MechanismEdge {
  return {
    caseId: FIXTURE_CASE_ID,
    fromNodeId: 'builder-node-a',
    toNodeId: 'builder-node-b',
    claimId: 'builder-causal',
    ...over,
  };
}

export function makeAlternative(
  over: Partial<AlternativeExplanation> & { id: string },
): AlternativeExplanation {
  return {
    caseId: FIXTURE_CASE_ID,
    thesisClaimId: 'builder-thesis',
    supportingClaimIds: ['builder-factual'],
    opposingClaimIds: ['builder-limitation'],
    limitationClaimIds: [],
    ...over,
  };
}

export function makeFlagshipCase(over: Partial<Case> & { id?: string } = {}): Case {
  return {
    id: FIXTURE_CASE_ID,
    country: 'Synthetic Country',
    industry: 'Synthetic Industry',
    status: 'flagship',
    thesisClaimId: 'builder-thesis',
    researchQuestionIds: ['builder-question'],
    ...over,
  } as Case;
}

/** Default sources: two mutually independent academics + one primary. */
export function defaultSources(): Source[] {
  return [
    makeSource({
      id: 'builder-academic-a',
      authors: ['Author Alpha'],
      institution: 'Institution Alpha',
      doi: '10.9999/builder.a',
    }),
    makeSource({
      id: 'builder-academic-b',
      authors: ['Author Beta'],
      institution: 'Institution Beta',
      doi: '10.9999/builder.b',
    }),
    makeSource({
      id: 'builder-primary',
      sourceType: 'primary',
      institution: 'Synthetic Archive',
      url: 'https://example.org/builder-primary',
    }),
  ];
}

export function defaultClaims(): Claim[] {
  return [
    makeFactual({ id: 'builder-factual' }),
    makeInterpretive({ id: 'builder-thesis' }),
    makeInterpretive({
      id: 'builder-limitation',
      citations: [makeCitation({ sourceId: 'builder-academic-b' })],
    }),
    makeCausal({ id: 'builder-causal' }),
  ];
}

export interface CorpusOver {
  sources?: Source[];
  claims?: Claim[];
  researchQuestions?: ResearchQuestion[];
  nodes?: MechanismNode[];
  edges?: MechanismEdge[];
  alternativeExplanations?: AlternativeExplanation[];
  case?: Case;
  caseId?: string;
  extraModules?: CaseContentModule[];
}

/** A corpus that passes validateCorpus unless overridden. */
export function makeCorpus(over: CorpusOver = {}): Corpus {
  const module: CaseContentModule = {
    caseId: over.caseId ?? FIXTURE_CASE_ID,
    case: over.case ?? makeFlagshipCase(),
    claims: over.claims ?? defaultClaims(),
    researchQuestions: over.researchQuestions ?? [makeQuestion({ id: 'builder-question' })],
    nodes: over.nodes ?? [makeNode({ id: 'builder-node-a' }), makeNode({ id: 'builder-node-b' })],
    edges: over.edges ?? [makeEdge({ id: 'builder-edge' })],
    alternativeExplanations:
      over.alternativeExplanations ?? [makeAlternative({ id: 'builder-alt' })],
  };
  return {
    sources: over.sources ?? defaultSources(),
    modules: [module, ...(over.extraModules ?? [])],
  };
}
