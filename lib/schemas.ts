/**
 * Why Here? — An Atlas of Industrial Advantage
 * lib/schemas.ts — the authoritative content contract.
 *
 * Zod is the source of truth; all TypeScript types are inferred via z.infer
 * so the runtime contract and the compile-time types cannot drift.
 *
 * Governing invariant (Spec v2 §1, v2.1 D8/D15/D19):
 *   Every substantive factual, interpretive, causal or counterfactual
 *   assertion visible in the UI resolves to a Claim carrying >= 1 located
 *   Citation. There is no free-text assertion field in this model.
 *
 * Scope note: this module contains SCHEMA-level (single-entity) validation
 * only. Cross-entity rules — reference integrity, case containment,
 * limitation-graph acyclicity, provenance graph, independent-subset
 * selection, duplicate-source detection — belong to the validator
 * (Increment 2) because Zod cannot see the whole corpus from one object.
 */

import { z } from 'zod';

/* ------------------------------------------------------------------ *
 * Constants
 * ------------------------------------------------------------------ */

/**
 * General content sanity limit (v2.1 F32). Per the implementation-level
 * correction, this is NOT a justification for an NP-hard search: the
 * independent-subset rules require at most k = 2, implemented as bounded
 * pair enumeration in Increment 2.
 */
export const MAX_CITATIONS_PER_CLAIM = 24;

/** Upper bound on a neutral MechanismNode label (v2.1 §H). */
export const MAX_NODE_LABEL_LENGTH = 60;

/**
 * Relational-verb denylist for MechanismNode labels (v2.1 §H).
 * A node names an entity; it never asserts what that entity did.
 * This catches the common failure. It cannot detect an evaluative noun
 * phrase such as "decisive state intervention" — an acknowledged limit,
 * stated in the methodology rather than papered over.
 */
export const NODE_LABEL_RELATIONAL_TERMS = [
  'caused', 'causing', 'causes',
  'led to', 'leads to', 'leading to',
  'enabled', 'enables', 'enabling',
  'drove', 'drives', 'driving',
  'contributed', 'contributes', 'contributing',
  'resulted in', 'results in', 'resulting in',
  'because',
] as const;

/* ------------------------------------------------------------------ *
 * Enumerations
 * ------------------------------------------------------------------ */

export const EpistemicStatusSchema = z.enum([
  'established',
  'well_supported',
  'contested',
  'insufficient',
]);

/**
 * Statuses available to interpretive, causal and counterfactual claims.
 * Spec v2 D2: academic agreement does not convert a historical causal
 * interpretation into a documented fact. Only factual claims may be
 * 'established', and that ceiling is enforced here at parse time rather
 * than by a downstream check.
 */
export const NonEstablishedStatusSchema = z.enum([
  'well_supported',
  'contested',
  'insufficient',
]);

export const EvidenceRoleSchema = z.enum(['supports', 'contradicts', 'context']);

export const SourceTypeSchema = z.enum([
  'primary',
  'academic',
  'reputable_press',
  'other',
]);

export const LengthClassSchema = z.enum(['short_form', 'long_form']);

export const LensFacetSchema = z.enum([
  'factor_conditions',
  'demand_conditions',
  'related_supporting',
  'firm_strategy_rivalry',
  'government',
  'chance',
]);

export const NodeTypeSchema = z.enum([
  'actor',
  'institution',
  'capability',
  'policy',
  'event',
]);

/* ------------------------------------------------------------------ *
 * Locator & Citation
 * ------------------------------------------------------------------ */

/**
 * A locator resolves to a PLACE inside a source, not to a document
 * (Spec v2 D5). A source homepage is not verifiable evidence.
 */
export const LocatorSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('page'), value: z.string().min(1) }),
  z.object({ kind: z.literal('section'), value: z.string().min(1) }),
  z.object({ kind: z.literal('table'), value: z.string().min(1) }),
  z.object({ kind: z.literal('figure'), value: z.string().min(1) }),
  z.object({ kind: z.literal('chapter'), value: z.string().min(1) }),
  z.object({ kind: z.literal('paragraph'), value: z.string().min(1) }),
  z.object({ kind: z.literal('timestamp'), value: z.string().min(1) }),
  z.object({ kind: z.literal('url_fragment'), value: z.string().min(1) }),
]);

export const CitationSchema = z.object({
  sourceId: z.string().min(1),
  locator: LocatorSchema,
  evidenceRole: EvidenceRoleSchema,
  note: z.string().min(1).optional(),
  accessedAt: z.string().datetime().optional(),
});

/* ------------------------------------------------------------------ *
 * Source
 * ------------------------------------------------------------------ */

/**
 * Provenance fields (authors, institution, originalSourceId,
 * derivedFromSourceIds) exist so the independence heuristic can model
 * likely dependence (Spec v2 D7). Reference resolution, cycle detection
 * and transitive dependence are validator concerns (Increment 2).
 *
 * Identity fields (doi, isbn, archiveRef, url) additionally serve
 * duplicate-source detection across differing internal ids — a validator
 * rule, since it compares sources pairwise across the corpus.
 */
export const SourceSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    sourceType: SourceTypeSchema,
    lengthClass: LengthClassSchema,
    authors: z.array(z.string().min(1)).optional(),
    institution: z.string().min(1).optional(),
    originalSourceId: z.string().min(1).optional(),
    derivedFromSourceIds: z.array(z.string().min(1)).optional(),
    date: z.string().min(1).optional(),
    url: z.string().url().optional(),
    doi: z.string().min(1).optional(),
    isbn: z.string().min(1).optional(),
    archiveRef: z.string().min(1).optional(),
  })
  .refine(
    (s) => Boolean(s.url ?? s.doi ?? s.isbn ?? s.archiveRef),
    {
      message:
        'Source requires >= 1 retrievable identifier (url | doi | isbn | archiveRef)',
      path: ['url'],
    },
  )
  .refine(
    (s) => s.originalSourceId !== s.id,
    { message: 'Source must not reference itself as originalSourceId', path: ['originalSourceId'] },
  )
  .refine(
    (s) => !(s.derivedFromSourceIds ?? []).includes(s.id),
    { message: 'Source must not appear in its own derivedFromSourceIds', path: ['derivedFromSourceIds'] },
  )
  .refine(
    (s) => {
      const ids = s.derivedFromSourceIds ?? [];
      return new Set(ids).size === ids.length;
    },
    { message: 'derivedFromSourceIds must not contain duplicates', path: ['derivedFromSourceIds'] },
  );

/* ------------------------------------------------------------------ *
 * Timeline projection
 * ------------------------------------------------------------------ */

/**
 * v2.1 §G / D18: the authored `label` is REMOVED. Display labels are
 * generated deterministically from the linked claim statement by a pure
 * function, which eliminates the label-smuggling channel entirely rather
 * than policing it with a semantic heuristic.
 *
 * `.strict()` makes a legacy authored `label` a parse error (F35).
 */
export const TimelineProjectionSchema = z
  .object({
    year: z.number().int(),
    endYear: z.number().int().optional(),
  })
  .strict()
  .refine((t) => t.endYear === undefined || t.endYear >= t.year, {
    message: 'endYear must not precede year',
    path: ['endYear'],
  });

/* ------------------------------------------------------------------ *
 * Claim — discriminated union
 * ------------------------------------------------------------------ */

const claimBaseShape = {
  id: z.string().min(1),
  caseId: z.string().min(1),
  statement: z.string().min(1),
  citations: z.array(CitationSchema).min(1).max(MAX_CITATIONS_PER_CLAIM),
  lensFacets: z.array(LensFacetSchema), // may be empty: "outside the Diamond"
  timeline: TimelineProjectionSchema.optional(),
};

/** Factual claims are the only type that may reach 'established'. */
export const FactualClaimSchema = z.object({
  ...claimBaseShape,
  claimType: z.literal('factual'),
  epistemicStatus: EpistemicStatusSchema,
});

export const InterpretiveClaimSchema = z.object({
  ...claimBaseShape,
  claimType: z.literal('interpretive'),
  epistemicStatus: NonEstablishedStatusSchema,
});

/**
 * v2.1 D15: `limitations: string` is replaced by `limitationClaimIds`,
 * so a limitation is itself a sourced Claim rather than a free-text
 * assertion bypassing the model. Structurally required (min 1), so a
 * causal claim without stated limitations is unrepresentable.
 */
export const CausalClaimSchema = z.object({
  ...claimBaseShape,
  claimType: z.literal('causal'),
  epistemicStatus: NonEstablishedStatusSchema,
  limitationClaimIds: z.array(z.string().min(1)).min(1),
});

export const CounterfactualClaimSchema = z.object({
  ...claimBaseShape,
  claimType: z.literal('counterfactual'),
  epistemicStatus: NonEstablishedStatusSchema,
  limitationClaimIds: z.array(z.string().min(1)).min(1),
  /** Must be present and displayed wherever the claim appears. */
  speculativeMarker: z.literal(true),
  /** The reasoning procedure; required for well_supported (v2.1 §C4). */
  analyticalMethod: z.string().min(1),
});

export const ClaimSchema = z.discriminatedUnion('claimType', [
  FactualClaimSchema,
  InterpretiveClaimSchema,
  CausalClaimSchema,
  CounterfactualClaimSchema,
]);

/* ------------------------------------------------------------------ *
 * Research question
 * ------------------------------------------------------------------ */

/**
 * v2.1 D11: a question asserts nothing, so it carries no epistemic
 * status and its text may be free. Any explanation of why the question
 * matters resolves to sourced Claims via rationaleClaimIds.
 */
export const ResearchQuestionSchema = z.object({
  id: z.string().min(1),
  caseId: z.string().min(1),
  question: z.string().min(1),
  rationaleClaimIds: z.array(z.string().min(1)).optional(),
});

/* ------------------------------------------------------------------ *
 * Mechanism graph
 * ------------------------------------------------------------------ */

const isNeutralNodeLabel = (label: string): boolean => {
  const normalized = label.toLowerCase();
  if (/[.!?]/.test(label)) return false;
  return !NODE_LABEL_RELATIONAL_TERMS.some((term) => normalized.includes(term));
};

export const MechanismNodeSchema = z
  .object({
    id: z.string().min(1),
    caseId: z.string().min(1),
    label: z.string().min(1).max(MAX_NODE_LABEL_LENGTH),
    nodeType: NodeTypeSchema,
    descriptionClaimIds: z.array(z.string().min(1)).optional(),
  })
  .refine((n) => isNeutralNodeLabel(n.label), {
    message:
      'MechanismNode label must be a neutral entity or noun phrase: no terminal punctuation and no relational verbs',
    path: ['label'],
  });

/**
 * An edge carries NO free-text `relationship` (v2.1 D8). Its asserted
 * meaning derives entirely from the referenced relational Claim, so the
 * map cannot draw a relationship that was not researched and sourced.
 * That the claim is causal|interpretive, in-case, and resolvable is a
 * validator rule (Increment 2).
 */
export const MechanismEdgeSchema = z
  .object({
    id: z.string().min(1),
    caseId: z.string().min(1),
    fromNodeId: z.string().min(1),
    toNodeId: z.string().min(1),
    claimId: z.string().min(1),
  })
  .refine((e) => e.fromNodeId !== e.toNodeId, {
    message: 'MechanismEdge must not connect a node to itself',
    path: ['toNodeId'],
  });

/* ------------------------------------------------------------------ *
 * Alternative explanation
 * ------------------------------------------------------------------ */

/**
 * Requires both supporting and opposing claims, so an "alternative"
 * cannot be asserted without genuine contestation on record.
 */
export const AlternativeExplanationSchema = z.object({
  id: z.string().min(1),
  caseId: z.string().min(1),
  thesisClaimId: z.string().min(1),
  supportingClaimIds: z.array(z.string().min(1)).min(1),
  opposingClaimIds: z.array(z.string().min(1)).min(1),
  limitationClaimIds: z.array(z.string().min(1)),
});

/* ------------------------------------------------------------------ *
 * Case — discriminated union
 * ------------------------------------------------------------------ */

/**
 * v2.1 D12: a PreviewCase asserts nothing. `thesisClaimId` is
 * structurally ABSENT (not merely optional) and `.strict()` rejects it,
 * so a preview cannot carry a thesis finding even by authoring error.
 * A preview must instead pose at least one research question.
 */
export const FlagshipCaseSchema = z
  .object({
    id: z.string().min(1),
    country: z.string().min(1),
    industry: z.string().min(1),
    status: z.literal('flagship'),
    thesisClaimId: z.string().min(1),
    researchQuestionIds: z.array(z.string().min(1)),
  })
  .strict();

export const PreviewCaseSchema = z
  .object({
    id: z.string().min(1),
    country: z.string().min(1),
    industry: z.string().min(1),
    status: z.literal('preview'),
    researchQuestionIds: z.array(z.string().min(1)).min(1),
  })
  .strict();

export const CaseSchema = z.discriminatedUnion('status', [
  FlagshipCaseSchema,
  PreviewCaseSchema,
]);

/* ------------------------------------------------------------------ *
 * Inferred TypeScript types (single source of truth)
 * ------------------------------------------------------------------ */

export type EpistemicStatus = z.infer<typeof EpistemicStatusSchema>;
export type EvidenceRole = z.infer<typeof EvidenceRoleSchema>;
export type SourceType = z.infer<typeof SourceTypeSchema>;
export type LengthClass = z.infer<typeof LengthClassSchema>;
export type LensFacet = z.infer<typeof LensFacetSchema>;
export type NodeType = z.infer<typeof NodeTypeSchema>;

export type Locator = z.infer<typeof LocatorSchema>;
export type Citation = z.infer<typeof CitationSchema>;
export type Source = z.infer<typeof SourceSchema>;
export type TimelineProjection = z.infer<typeof TimelineProjectionSchema>;

export type FactualClaim = z.infer<typeof FactualClaimSchema>;
export type InterpretiveClaim = z.infer<typeof InterpretiveClaimSchema>;
export type CausalClaim = z.infer<typeof CausalClaimSchema>;
export type CounterfactualClaim = z.infer<typeof CounterfactualClaimSchema>;
export type Claim = z.infer<typeof ClaimSchema>;
export type ClaimType = Claim['claimType'];

export type ResearchQuestion = z.infer<typeof ResearchQuestionSchema>;
export type MechanismNode = z.infer<typeof MechanismNodeSchema>;
export type MechanismEdge = z.infer<typeof MechanismEdgeSchema>;
export type AlternativeExplanation = z.infer<typeof AlternativeExplanationSchema>;

export type FlagshipCase = z.infer<typeof FlagshipCaseSchema>;
export type PreviewCase = z.infer<typeof PreviewCaseSchema>;
export type Case = z.infer<typeof CaseSchema>;
