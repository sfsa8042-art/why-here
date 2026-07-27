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
  ClaimPlaceLink,
  FactualClaim,
  InterpretiveClaim,
  CausalClaim,
  CounterfactualClaim,
  MechanismEdge,
  MechanismNode,
  Place,
  ResearchQuestion,
  Source,
} from '../../lib/schemas.ts';
import type { CaseContentModule, Corpus } from '../../lib/validate.ts';

export const FIXTURE_CASE_ID = 'builder-case';

export function makeSource(over: Partial<Source> & { id: string }): Source {
  return {
    title: `Synthetic source ${over.id}`,
    sourceType: 'academic',
    temporalRelation: 'retrospective',
    subjectRelationship: 'independent',
    lengthClass: 'short_form',
    url: `https://example.org/${over.id}`,
    ...over,
  };
}

/**
 * Fixture citation ids.
 *
 * Any fixture citation that is REFERENCED by another entity (a
 * ClaimPlaceLink, or a cross-entity reference test) MUST pass an explicit
 * semantic `id`. When none is given, a clearly TEST-ONLY placeholder is
 * generated. This placeholder is NOT stable — it is an order-dependent
 * counter — so no test may ever assert on its value; it exists only to
 * satisfy the required Citation.id schema for citations nothing points at.
 * (A fixture built once and reused keeps the same generated ids, which is
 * all the loader-determinism test needs — it never inspects the values.)
 */
let _testOnlyCitationSeq = 0;

export function makeCitation(over: Partial<Citation> & { sourceId: string }): Citation {
  return {
    id: `cit-testonly-${(_testOnlyCitationSeq += 1)}`,
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

export function makeResearchCase(over: Partial<Case> & { id?: string } = {}): Case {
  return {
    id: FIXTURE_CASE_ID,
    country: 'Synthetic Country',
    industry: 'Synthetic Industry',
    status: 'research',
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
      sourceType: 'documentary',
      temporalRelation: 'contemporaneous',
      subjectRelationship: 'subject_authored',
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
  places?: Place[];
  claimPlaceLinks?: ClaimPlaceLink[];
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
    places: over.places ?? [],
    claimPlaceLinks: over.claimPlaceLinks ?? [],
  };
  return {
    sources: over.sources ?? defaultSources(),
    modules: [module, ...(over.extraModules ?? [])],
  };
}

/* ------------------------------------------------------------------ *
 * Geographic builders (Increment M0)
 * ------------------------------------------------------------------ */

export function makePlace(over: Partial<Place> & { id: string }): Place {
  return {
    caseId: FIXTURE_CASE_ID,
    name: 'Synthetic City',
    countryCode: 'NL',
    kind: 'city',
    geometry: {
      type: 'point',
      longitude: 5.0,
      latitude: 52.0,
      precision: 'city',
      coordinateSource: 'Synthetic gazetteer',
      attributionText: 'Synthetic attribution',
    },
    ...over,
  };
}

export function makeClaimPlaceLink(
  over: Partial<ClaimPlaceLink> & { id: string },
): ClaimPlaceLink {
  return {
    caseId: FIXTURE_CASE_ID,
    claimId: 'builder-factual',
    placeId: 'builder-place',
    relationship: 'organization_registered_address',
    temporalScope: { year: 1988, endYear: 1991 },
    citationIds: ['builder-geo-cit'],
    evidencePrecision: 'city',
    locatorNote: 'Synthetic address record.',
    epistemicStatus: 'well_supported',
    ...over,
  };
}

/**
 * A corpus with one factual claim carrying a KNOWN-id citation, one city
 * Place, and one link between them — valid unless overridden. Uses a
 * research case (no thesis required) to keep the geographic fixtures small.
 */
export function makeGeoCorpus(over: CorpusOver = {}): Corpus {
  const geoClaim = makeFactual({
    id: 'builder-geo-claim',
    citations: [makeCitation({ id: 'builder-geo-cit', sourceId: 'builder-academic-a' })],
  });
  return makeCorpus({
    case: makeResearchCase(),
    claims: [geoClaim],
    nodes: [],
    edges: [],
    alternativeExplanations: [],
    places: [makePlace({ id: 'builder-place' })],
    claimPlaceLinks: [makeClaimPlaceLink({
      id: 'builder-link',
      claimId: 'builder-geo-claim',
      placeId: 'builder-place',
      citationIds: ['builder-geo-cit'],
    })],
    ...over,
  });
}
