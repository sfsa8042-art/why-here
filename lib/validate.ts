/**
 * Why Here? — An Atlas of Industrial Advantage
 * lib/validate.ts — Increment 2: the cross-entity content validator.
 *
 * Implements V1–V20 from docs/VALIDATION_SPEC.md. Zod (lib/schemas.ts)
 * remains the authoritative structural contract; this module assumes its
 * inputs have already parsed and enforces only the rules that require
 * seeing the whole corpus at once.
 *
 * Every failure is structured: { ruleId, entityId, message }. Overlapping
 * rules are disambiguated by a field → rule mapping so each defect is
 * reported once under its most specific rule (e.g. an unresolved
 * limitation claim is V12, not V1).
 */

import type {
  AlternativeExplanation,
  Case,
  Claim,
  ClaimPlaceLink,
  Locator,
  MechanismEdge,
  MechanismNode,
  Place,
  ResearchQuestion,
  Source,
} from './schemas.ts';

/* ------------------------------------------------------------------ *
 * Public types
 * ------------------------------------------------------------------ */

export type RuleId =
  | 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7' | 'V8' | 'V9' | 'V10'
  | 'V11' | 'V12' | 'V13' | 'V14' | 'V15' | 'V16' | 'V17' | 'V18' | 'V19' | 'V20'
  /* citation identity + geographic layer (Increment M0) */
  | 'V21' | 'G1' | 'G2' | 'G3' | 'G4' | 'G5' | 'G6' | 'G7' | 'G8' | 'G9'
  | 'G10' | 'G11' | 'G12' | 'G13' | 'G14';

export interface ValidationFailure {
  ruleId: RuleId;
  entityId: string;
  message: string;
}

/** One case's content module, mirroring content/cases/<case>/. */
export interface CaseContentModule {
  caseId: string;
  case: Case;
  claims: Claim[];
  researchQuestions: ResearchQuestion[];
  nodes: MechanismNode[];
  edges: MechanismEdge[];
  alternativeExplanations: AlternativeExplanation[];
  /* Geographic layer (Increment M0). Optional so existing corpora/fixtures
     that pre-date the geographic layer need no change; absent means none. */
  places?: Place[];
  claimPlaceLinks?: ClaimPlaceLink[];
}

export interface Corpus {
  sources: Source[];
  modules: CaseContentModule[];
}

export interface ValidateOptions {
  /** V18 claim ceiling for preview cases. */
  previewClaimCeiling?: number;
}

/**
 * V18 "configured claim ceiling" default. The spec names the ceiling but
 * fixes no number; 10 keeps a preview well below flagship depth while
 * leaving room for honest insufficient-status documentation.
 */
export const PREVIEW_CLAIM_CEILING = 10;

/* ------------------------------------------------------------------ *
 * V5 — locator precision
 * ------------------------------------------------------------------ */

/** Values that name no real place inside a source. */
export const PLACEHOLDER_LOCATOR_VALUES: ReadonlySet<string> = new Set([
  '', '-', '?', '...', 'tbd', 'tba', 'todo', 'n/a', 'na', 'none',
  'unknown', 'passim', 'various', 'xx', 'см', 'см.',
]);

export function isPlaceholderLocator(locator: Locator): boolean {
  return PLACEHOLDER_LOCATOR_VALUES.has(locator.value.trim().toLowerCase());
}

/* ------------------------------------------------------------------ *
 * V7 — identifier normalization
 * ------------------------------------------------------------------ */

export function normalizeDoi(doi: string): string {
  return doi
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//, '')
    .replace(/^doi:\s*/, '');
}

/**
 * Hyphens/whitespace removed; ISBN-10 converted to its ISBN-13 form
 * (978 prefix, recomputed check digit) so the two encodings of one book
 * collide, per CONTENT_MODEL.md.
 */
export function normalizeIsbn(isbn: string): string {
  const raw = isbn.replace(/[-\s]/g, '').toUpperCase();
  if (raw.length === 10 && /^\d{9}[\dX]$/.test(raw)) {
    const core = `978${raw.slice(0, 9)}`;
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += Number(core[i]) * (i % 2 === 0 ? 1 : 3);
    }
    const check = (10 - (sum % 10)) % 10;
    return `${core}${check}`;
  }
  return raw;
}

export function normalizeArchiveRef(ref: string): string {
  return ref.trim().toLowerCase();
}

// Unambiguous tracking parameters only. A name like `source` or `page`
// can select real content; stripping it would risk declaring two genuinely
// distinct documents duplicates (a build failure), so ambiguous names stay.
const TRACKING_PARAM_NAMES = new Set([
  'fbclid', 'gclid', 'dclid', 'msclkid', 'igshid', 'spm',
  'mc_cid', 'mc_eid', 'ref', 'ref_src',
]);

function isTrackingParam(name: string): boolean {
  const lower = name.toLowerCase();
  return lower.startsWith('utm_') || TRACKING_PARAM_NAMES.has(lower);
}

/**
 * Scheme (http/https treated as equivalent) and fragment dropped, host
 * lowercased with `www.` removed, trailing slash stripped, tracking
 * query parameters removed. Remaining query parameters are kept in
 * their original order.
 */
export function canonicalizeUrl(url: string): string {
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return url.trim().toLowerCase();
  }
  const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
  const path = parsed.pathname.replace(/\/+$/, '');
  const kept = [...parsed.searchParams.entries()].filter(
    ([name]) => !isTrackingParam(name),
  );
  const query = kept.length > 0
    ? `?${kept.map(([n, v]) => `${n}=${v}`).join('&')}`
    : '';
  return `${host}${path}${query}`;
}

/* ------------------------------------------------------------------ *
 * Provenance graph & V8 dependence
 * ------------------------------------------------------------------ */

export function provenanceParents(source: Source): string[] {
  const parents: string[] = [];
  if (source.originalSourceId !== undefined) parents.push(source.originalSourceId);
  for (const id of source.derivedFromSourceIds ?? []) parents.push(id);
  return parents;
}

/**
 * Transitive ancestor closure over an arbitrary parent relation:
 * id → set of every ancestor id (including ids that resolve to no
 * Source; V6 reports those separately). Guarded against cycles, which
 * V6 also rejects.
 */
export function computeAncestors(
  ids: Iterable<string>,
  parentsOf: (id: string) => string[],
): Map<string, Set<string>> {
  const memo = new Map<string, Set<string>>();
  const inProgress = new Set<string>();

  const visit = (id: string): Set<string> => {
    const cached = memo.get(id);
    if (cached) return cached;
    if (inProgress.has(id)) return new Set(); // cycle guard; V6 reports it
    inProgress.add(id);
    const ancestors = new Set<string>();
    for (const parent of parentsOf(id)) {
      ancestors.add(parent);
      for (const a of visit(parent)) ancestors.add(a);
    }
    inProgress.delete(id);
    memo.set(id, ancestors);
    return ancestors;
  };

  for (const id of ids) visit(id);
  return memo;
}

/** Source-level (global) provenance closure. */
export function buildAncestorMap(sources: Source[]): Map<string, Set<string>> {
  const byId = new Map(sources.map((s) => [s.id, s]));
  return computeAncestors(byId.keys(), (id) => {
    const source = byId.get(id);
    return source ? provenanceParents(source) : [];
  });
}

/**
 * The citation-level derivation edges of ONE claim: source id → the
 * source ids its passages explicitly derive from. Passage-specific by
 * design — these edges never leave the claim that carries them.
 */
export function citationDerivationEdges(claim: Claim): Map<string, Set<string>> {
  const edges = new Map<string, Set<string>>();
  for (const citation of claim.citations) {
    for (const derivedId of citation.derivedFromSourceIds ?? []) {
      let set = edges.get(citation.sourceId);
      if (set === undefined) {
        set = new Set();
        edges.set(citation.sourceId, set);
      }
      set.add(derivedId);
    }
  }
  return edges;
}

/**
 * Citation-level provenance scopes dependence to ONE claim: a passage
 * in source A relying on source B makes A and B dependent for every
 * claim carrying that citation, while the same pair may remain
 * independent on a claim whose citations carry no such derivation.
 * Global source-level provenance is always included.
 */
export function claimScopedDependence(
  claim: Claim,
  sourceById: Map<string, Source>,
  globalAncestors: Map<string, Set<string>>,
): (a: Source, b: Source) => boolean {
  const citationEdges = citationDerivationEdges(claim);
  if (citationEdges.size === 0) {
    return (a, b) => areSourcesDependent(a, b, globalAncestors);
  }
  const augmented = computeAncestors(sourceById.keys(), (id) => {
    const source = sourceById.get(id);
    const base = source ? provenanceParents(source) : [];
    const extra = citationEdges.get(id);
    return extra ? [...base, ...extra] : base;
  });
  return (a, b) => areSourcesDependent(a, b, augmented);
}

/**
 * V8. Dependent if: one reaches the other in the provenance closure;
 * they share a common provenance ancestor; or they share an institution
 * with a non-empty author intersection. Conservative by construction —
 * a dependence detector, not an independence proof.
 */
export function areSourcesDependent(
  a: Source,
  b: Source,
  ancestorMap: Map<string, Set<string>>,
): boolean {
  if (a.id === b.id) return true;
  const ancestorsA = ancestorMap.get(a.id) ?? new Set<string>();
  const ancestorsB = ancestorMap.get(b.id) ?? new Set<string>();
  if (ancestorsA.has(b.id) || ancestorsB.has(a.id)) return true;
  for (const ancestor of ancestorsA) {
    if (ancestorsB.has(ancestor)) return true;
  }
  if (
    a.institution !== undefined &&
    a.institution === b.institution &&
    (a.authors ?? []).some((author) => (b.authors ?? []).includes(author))
  ) {
    return true;
  }
  return false;
}

/* ------------------------------------------------------------------ *
 * Deterministic bounded independent-source selection
 * ------------------------------------------------------------------ */

export interface SelectionOptions {
  /**
   * Causal-claim mode: the pair enumeration continues past independent
   * pairs lacking an academic member. The requirement applies to the
   * pair, not to individual candidates.
   */
  requireAcademicMember?: boolean;
}

/**
 * Deterministic bounded selection per VALIDATION_SPEC.md. Sources are
 * sorted by id ascending before any search, so results are reproducible
 * and testable by exact membership. Complexity O(n²), n bounded by
 * MAX_CITATIONS_PER_CLAIM. Explicitly NOT a maximum-independent-set
 * search.
 *
 * The spec signature omits the dependence relation; it is passed in as
 * `isDependent` because independence (V8) requires the corpus-level
 * provenance closure, which a pure selection function cannot rebuild.
 */
export function selectIndependentSources(
  sources: Source[],
  k: 1 | 2,
  predicate: (source: Source) => boolean,
  isDependent: (a: Source, b: Source) => boolean = () => false,
  options: SelectionOptions = {},
): Source[] | null {
  const seen = new Set<string>();
  const candidates = [...sources]
    .sort((x, y) => (x.id < y.id ? -1 : x.id > y.id ? 1 : 0))
    .filter((s) => {
      if (seen.has(s.id)) return false;
      seen.add(s.id);
      return predicate(s);
    });

  if (k === 1) {
    const first = candidates[0];
    return first !== undefined ? [first] : null;
  }

  for (let i = 0; i < candidates.length; i++) {
    for (let j = i + 1; j < candidates.length; j++) {
      const a = candidates[i]!;
      const b = candidates[j]!;
      if (isDependent(a, b)) continue;
      if (
        options.requireAcademicMember === true &&
        a.sourceType !== 'academic' &&
        b.sourceType !== 'academic'
      ) {
        continue;
      }
      return [a, b];
    }
  }
  return null;
}

/* ------------------------------------------------------------------ *
 * Generic cycle detection (V6, V13)
 * ------------------------------------------------------------------ */

/** Returns each detected cycle as the list of ids along it. */
export function findCycles(
  ids: Iterable<string>,
  edgesOf: (id: string) => string[],
): string[][] {
  const idSet = new Set(ids);
  const state = new Map<string, 1 | 2>(); // 1 = in progress, 2 = done
  const stack: string[] = [];
  const cycles: string[][] = [];

  const visit = (id: string): void => {
    state.set(id, 1);
    stack.push(id);
    for (const next of edgesOf(id)) {
      if (!idSet.has(next)) continue;
      const s = state.get(next);
      if (s === undefined) visit(next);
      else if (s === 1) cycles.push(stack.slice(stack.indexOf(next)));
    }
    stack.pop();
    state.set(id, 2);
  };

  for (const id of idSet) {
    if (!state.has(id)) visit(id);
  }
  return cycles;
}

/* ------------------------------------------------------------------ *
 * validateCorpus — V1..V20
 * ------------------------------------------------------------------ */

type ClaimType = Claim['claimType'];

const RELATIONAL_CLAIM_TYPES: ReadonlySet<ClaimType> = new Set(['causal', 'interpretive']);
const LIMITATION_CLAIM_TYPES: ReadonlySet<ClaimType> = new Set([
  'factual', 'interpretive', 'causal',
]);
/** Types that can carry factual/well_supported on a single citation. */
const WELL_SUPPORTED_FACTUAL_TYPES: ReadonlySet<Source['sourceType']> = new Set([
  'documentary', 'academic', 'reputable_press', 'institutional_history',
]);

/** Types admitted to the factual/established independent-pair route. */
const ESTABLISHED_PAIR_TYPES: ReadonlySet<Source['sourceType']> = new Set([
  'documentary', 'academic', 'reputable_press',
]);

export function validateCorpus(
  corpus: Corpus,
  options: ValidateOptions = {},
): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  const fail = (ruleId: RuleId, entityId: string, message: string): void => {
    failures.push({ ruleId, entityId, message });
  };

  const previewCeiling = options.previewClaimCeiling ?? PREVIEW_CLAIM_CEILING;

  /* ---------- indexes; V2 global id uniqueness ---------- */

  const sourceById = new Map<string, Source>();
  const claimById = new Map<string, Claim>();
  const questionById = new Map<string, ResearchQuestion>();
  const nodeById = new Map<string, MechanismNode>();

  const idOwners = new Map<string, number>();
  const recordId = (id: string): void => {
    idOwners.set(id, (idOwners.get(id) ?? 0) + 1);
  };

  for (const source of corpus.sources) {
    recordId(source.id);
    if (!sourceById.has(source.id)) sourceById.set(source.id, source);
  }
  for (const module of corpus.modules) {
    recordId(module.case.id);
    for (const claim of module.claims) {
      recordId(claim.id);
      if (!claimById.has(claim.id)) claimById.set(claim.id, claim);
    }
    for (const question of module.researchQuestions) {
      recordId(question.id);
      if (!questionById.has(question.id)) questionById.set(question.id, question);
    }
    for (const node of module.nodes) {
      recordId(node.id);
      if (!nodeById.has(node.id)) nodeById.set(node.id, node);
    }
    for (const edge of module.edges) recordId(edge.id);
    for (const alt of module.alternativeExplanations) recordId(alt.id);
  }

  for (const [id, count] of idOwners) {
    if (count > 1) {
      fail('V2', id, `id "${id}" occurs ${count} times in the global id-space`);
    }
  }

  /* ---------- V6/V8 groundwork: provenance graph ---------- */

  for (const source of corpus.sources) {
    for (const parent of provenanceParents(source)) {
      if (!sourceById.has(parent)) {
        fail('V6', source.id,
          `provenance reference "${parent}" does not resolve to a Source`);
      }
    }
  }

  /* source-level cycle check: the GLOBAL graph uses only Source fields.
     Citation-level edges are passage-specific and never enter it — two
     publications may legitimately rely on one another in different
     passages addressing different claims. Citation-level resolution and
     per-claim cycle checks happen in the claims loop below. */
  for (const cycle of findCycles(
    sourceById.keys(),
    (id) => {
      const s = sourceById.get(id);
      return s ? provenanceParents(s) : [];
    },
  )) {
    fail('V6', cycle[0] ?? '(unknown)',
      `source-level provenance cycle: ${[...cycle, cycle[0]].join(' -> ')}`);
  }

  const ancestorMap = buildAncestorMap(corpus.sources);

  /* ---------- V7 duplicate sources ---------- */

  const duplicateBuckets: Array<[string, (s: Source) => string | undefined]> = [
    ['DOI', (s) => (s.doi !== undefined ? normalizeDoi(s.doi) : undefined)],
    ['ISBN', (s) => (s.isbn !== undefined ? normalizeIsbn(s.isbn) : undefined)],
    ['archive reference',
      (s) => (s.archiveRef !== undefined ? normalizeArchiveRef(s.archiveRef) : undefined)],
    ['canonical URL', (s) => (s.url !== undefined ? canonicalizeUrl(s.url) : undefined)],
  ];
  for (const [label, keyOf] of duplicateBuckets) {
    const byKey = new Map<string, string>();
    for (const source of corpus.sources) {
      const key = keyOf(source);
      if (key === undefined) continue;
      const holder = byKey.get(key);
      if (holder !== undefined && holder !== source.id) {
        fail('V7', source.id,
          `shares normalized ${label} "${key}" with source "${holder}"`);
      } else {
        byKey.set(key, source.id);
      }
    }
  }

  /* ---------- per-module structural rules ---------- */

  // field → rule mapping: each reference is reported once, under the
  // most specific rule that governs it.
  const resolveClaim = (
    ruleMissing: RuleId,
    ruleCase: RuleId,
    referrerId: string,
    referrerCaseId: string,
    refId: string,
    fieldName: string,
  ): Claim | undefined => {
    const target = claimById.get(refId);
    if (target === undefined) {
      fail(ruleMissing, referrerId,
        `${fieldName} "${refId}" does not resolve to a Claim`);
      return undefined;
    }
    if (target.caseId !== referrerCaseId) {
      fail(ruleCase, referrerId,
        `${fieldName} "${refId}" belongs to case "${target.caseId}", not "${referrerCaseId}"`);
      return undefined;
    }
    return target;
  };

  for (const module of corpus.modules) {
    const caseEntity = module.case;
    const caseId = module.caseId;

    /* V4 — module agreement */
    if (caseEntity.id !== caseId) {
      fail('V4', caseEntity.id,
        `case id "${caseEntity.id}" does not match its module caseId "${caseId}"`);
    }
    const checkModuleAgreement = (entityId: string, entityCaseId: string): void => {
      if (entityCaseId !== caseId) {
        fail('V4', entityId,
          `caseId "${entityCaseId}" does not match its content module "${caseId}"`);
      }
    };
    for (const c of module.claims) checkModuleAgreement(c.id, c.caseId);
    for (const q of module.researchQuestions) checkModuleAgreement(q.id, q.caseId);
    for (const n of module.nodes) checkModuleAgreement(n.id, n.caseId);
    for (const e of module.edges) checkModuleAgreement(e.id, e.caseId);
    for (const a of module.alternativeExplanations) checkModuleAgreement(a.id, a.caseId);

    /* claims: citations (V1), limitations (V12), evidence (V5, V9, V10, V11) */
    for (const claim of module.claims) {
      for (const citation of claim.citations) {
        const source = sourceById.get(citation.sourceId);
        if (source === undefined) {
          fail('V1', claim.id,
            `citation sourceId "${citation.sourceId}" does not resolve to a Source`);
          continue;
        }
        /* V5 — locator precision */
        if (source.lengthClass === 'long_form' && isPlaceholderLocator(citation.locator)) {
          fail('V5', claim.id,
            `citation of long_form source "${source.id}" carries placeholder locator "${citation.locator.value}"`);
        }
      }

      /* V12 — limitation claim integrity */
      if (claim.claimType === 'causal' || claim.claimType === 'counterfactual') {
        for (const limitationId of claim.limitationClaimIds) {
          if (limitationId === claim.id) {
            fail('V12', claim.id, 'limitation claim must not be a self-reference');
            continue;
          }
          const limitation = claimById.get(limitationId);
          if (limitation === undefined) {
            fail('V12', claim.id,
              `limitationClaimId "${limitationId}" does not resolve to a Claim`);
            continue;
          }
          if (limitation.caseId !== claim.caseId) {
            fail('V12', claim.id,
              `limitation claim "${limitationId}" belongs to case "${limitation.caseId}", not "${claim.caseId}"`);
            continue;
          }
          if (!LIMITATION_CLAIM_TYPES.has(limitation.claimType)) {
            fail('V12', claim.id,
              `limitation claim "${limitationId}" has claimType "${limitation.claimType}"; a limitation may not be counterfactual`);
          }
          if (limitation.citations.length === 0) {
            // Unrepresentable after schema parse; guarded regardless.
            fail('V12', claim.id,
              `limitation claim "${limitationId}" carries no citation`);
          }
        }
      }

      /* citation-level provenance — scoped to THIS claim: references
         must resolve, and the claim's EFFECTIVE provenance graph
         (source-level edges + this claim's citation edges) must be
         acyclic. Opposite derivations on two different claims are two
         different passages and are NOT a cycle. */
      const derivationEdges = citationDerivationEdges(claim);
      for (const [fromId, targets] of derivationEdges) {
        for (const derivedId of targets) {
          if (!sourceById.has(derivedId)) {
            fail('V6', claim.id,
              `citation of "${fromId}" derives from "${derivedId}", which does not resolve to a Source`);
          }
        }
      }
      if (derivationEdges.size > 0) {
        const sourceParents = (id: string): string[] => {
          const s = sourceById.get(id);
          return s ? provenanceParents(s) : [];
        };
        for (const cycle of findCycles(
          sourceById.keys(),
          (id) => {
            const extra = derivationEdges.get(id);
            return extra ? [...sourceParents(id), ...extra] : sourceParents(id);
          },
        )) {
          // report only cycles that need a citation edge; pure
          // source-level cycles are already rejected globally
          const usesCitationEdge = cycle.some((id, i) => {
            const next = cycle[(i + 1) % cycle.length]!;
            return derivationEdges.get(id)?.has(next) === true
              && !sourceParents(id).includes(next);
          });
          if (usesCitationEdge) {
            fail('V6', claim.id,
              `citation-level provenance cycle in this claim's effective provenance graph: ${[...cycle, cycle[0]].join(' -> ')}`);
          }
        }
      }

      /* evidence rules — dependence is claim-scoped: citation-level
         provenance on THIS claim's citations counts against independence
         here, without contaminating other claims (V8) */
      const claimDependent = claimScopedDependence(claim, sourceById, ancestorMap);
      const supportSources = uniqueSources(
        claim.citations.filter((c) => c.evidenceRole === 'supports'),
        sourceById,
      );
      const contradictSources = uniqueSources(
        claim.citations.filter((c) => c.evidenceRole === 'contradicts'),
        sourceById,
      );
      const allContext = claim.citations.every((c) => c.evidenceRole === 'context');

      /* V10 — context-only bar (when it fires, V9 is subsumed: the
         context-only defect is the specific cause of the unmet floor) */
      let contextOnlyReported = false;
      if (
        allContext &&
        (claim.epistemicStatus === 'established' || claim.epistemicStatus === 'well_supported')
      ) {
        fail('V10', claim.id,
          `${claim.epistemicStatus} claim rests on context-only citations`);
        contextOnlyReported = true;
      }

      /* V11 — contested rule */
      if (claim.epistemicStatus === 'contested') {
        if (supportSources.length === 0 || contradictSources.length === 0) {
          fail('V11', claim.id,
            'contested claim requires at least one supports and one contradicts citation');
        } else if (!hasIndependentCrossPair(supportSources, contradictSources, claimDependent)) {
          fail('V11', claim.id,
            'contested claim requires mutually independent supporting and contradicting sources');
        }
      }

      /* V9 — status floors (supports citations only) */
      if (!contextOnlyReported) {
        const floorFailure = checkStatusFloor(claim, supportSources, claimDependent);
        if (floorFailure !== null) fail('V9', claim.id, floorFailure);
      }
    }

    /* research questions — V19 */
    for (const question of module.researchQuestions) {
      for (const rationaleId of question.rationaleClaimIds ?? []) {
        resolveClaim('V19', 'V19', question.id, question.caseId, rationaleId, 'rationaleClaimId');
      }
    }

    /* nodes — V20 */
    for (const node of module.nodes) {
      for (const descriptionId of node.descriptionClaimIds ?? []) {
        resolveClaim('V20', 'V20', node.id, node.caseId, descriptionId, 'descriptionClaimId');
      }
    }

    /* edges — V1/V3 node refs, V1/V3 + V14 claim ref */
    for (const edge of module.edges) {
      for (const [field, nodeId] of [
        ['fromNodeId', edge.fromNodeId],
        ['toNodeId', edge.toNodeId],
      ] as const) {
        const node = nodeById.get(nodeId);
        if (node === undefined) {
          fail('V1', edge.id, `${field} "${nodeId}" does not resolve to a MechanismNode`);
        } else if (node.caseId !== edge.caseId) {
          fail('V3', edge.id,
            `${field} "${nodeId}" belongs to case "${node.caseId}", not "${edge.caseId}"`);
        }
      }
      const relational = resolveClaim('V1', 'V3', edge.id, edge.caseId, edge.claimId, 'claimId');
      if (relational !== undefined && !RELATIONAL_CLAIM_TYPES.has(relational.claimType)) {
        fail('V14', edge.id,
          `claimId "${relational.id}" is ${relational.claimType}; a mechanism edge requires a causal or interpretive claim`);
      }
    }

    /* alternatives — V16, V17, V12 */
    for (const alt of module.alternativeExplanations) {
      const thesis = resolveClaim('V1', 'V3', alt.id, alt.caseId, alt.thesisClaimId, 'thesisClaimId');
      if (thesis !== undefined && !RELATIONAL_CLAIM_TYPES.has(thesis.claimType)) {
        fail('V16', alt.id,
          `thesisClaimId "${thesis.id}" is ${thesis.claimType}; an alternative-explanation thesis must be interpretive or causal`);
      }
      for (const [field, ids] of [
        ['supportingClaimIds', alt.supportingClaimIds],
        ['opposingClaimIds', alt.opposingClaimIds],
      ] as const) {
        for (const refId of ids) {
          resolveClaim('V17', 'V17', alt.id, alt.caseId, refId, field);
        }
      }
      // min 1 on both sides is schema-enforced; belt and braces:
      if (alt.supportingClaimIds.length === 0 || alt.opposingClaimIds.length === 0) {
        fail('V17', alt.id,
          'alternative explanation requires at least one supporting and one opposing claim');
      }
      for (const limitationId of alt.limitationClaimIds) {
        const limitation = resolveClaim('V12', 'V12', alt.id, alt.caseId, limitationId, 'limitationClaimId');
        if (limitation !== undefined && !LIMITATION_CLAIM_TYPES.has(limitation.claimType)) {
          fail('V12', alt.id,
            `limitation claim "${limitationId}" has claimType "${limitation.claimType}"; a limitation may not be counterfactual`);
        }
      }
    }

    /* case — V1/V3 question refs, V15 thesis, V18 preview honesty */
    for (const questionId of caseEntity.researchQuestionIds) {
      const question = questionById.get(questionId);
      if (question === undefined) {
        fail('V1', caseEntity.id,
          `researchQuestionId "${questionId}" does not resolve to a ResearchQuestion`);
      } else if (question.caseId !== caseEntity.id) {
        fail('V3', caseEntity.id,
          `researchQuestionId "${questionId}" belongs to case "${question.caseId}", not "${caseEntity.id}"`);
      }
    }

    if (caseEntity.status === 'flagship') {
      const thesis = resolveClaim('V1', 'V3', caseEntity.id, caseEntity.id, caseEntity.thesisClaimId, 'thesisClaimId');
      if (thesis !== undefined && !RELATIONAL_CLAIM_TYPES.has(thesis.claimType)) {
        fail('V15', caseEntity.id,
          `thesisClaimId "${thesis.id}" is ${thesis.claimType}; a flagship thesis must be interpretive or causal`);
      }
    } else if (caseEntity.status === 'preview') {
      /* V18 — preview honesty. Research cases are deliberately exempt:
         they carry claims at the statuses the evidence actually earns,
         with no preview ceiling and no thesis. Evidence floors (V9)
         apply identically to every lifecycle status. */
      if (module.claims.length > previewCeiling) {
        fail('V18', caseEntity.id,
          `preview case carries ${module.claims.length} claims; ceiling is ${previewCeiling}`);
      }
      for (const claim of module.claims) {
        if (claim.epistemicStatus !== 'insufficient') {
          fail('V18', caseEntity.id,
            `preview case carries claim "${claim.id}" with status "${claim.epistemicStatus}"; previews may carry nothing above insufficient`);
        }
      }
    }
  }

  /* ---------- V13 — limitation graph acyclicity ---------- */

  const limitationEdges = (id: string): string[] => {
    const claim = claimById.get(id);
    if (claim === undefined) return [];
    if (claim.claimType === 'causal' || claim.claimType === 'counterfactual') {
      return claim.limitationClaimIds;
    }
    return [];
  };
  for (const cycle of findCycles(claimById.keys(), limitationEdges)) {
    if (cycle.length < 2) continue; // a self-loop is V12's self-reference, not a V13 cycle
    fail('V13', cycle[0] ?? '(unknown)',
      `limitation-reference cycle: ${[...cycle, cycle[0]].join(' -> ')}`);
  }

  /* ---------- V21 — global Citation id uniqueness + ownership map ---------- */

  const citationOwner = new Map<string, string>(); // citationId -> owning claimId
  const citationSeen = new Map<string, number>();
  for (const module of corpus.modules) {
    for (const claim of module.claims) {
      for (const citation of claim.citations) {
        citationSeen.set(citation.id, (citationSeen.get(citation.id) ?? 0) + 1);
        if (!citationOwner.has(citation.id)) citationOwner.set(citation.id, claim.id);
      }
    }
  }
  for (const [id, count] of citationSeen) {
    if (count > 1) {
      fail('V21', id, `Citation id "${id}" occurs ${count} times in the corpus`);
    }
  }

  /* ---------- G1–G14 — geographic layer (Increment M0) ---------- */

  const moduleCaseIds = new Set(corpus.modules.map((m) => m.caseId));
  const placeById = new Map<string, Place>();
  const placeSeen = new Map<string, number>();
  const linkSeen = new Map<string, number>();

  const precisionRank: Record<string, number> = { country: 0, region: 1, city: 2, site: 3 };
  const statusRank: Record<string, number> = {
    insufficient: 0, contested: 1, well_supported: 2, established: 3,
  };
  const ADDRESS_RELATIONSHIPS = new Set<ClaimPlaceLink['relationship']>([
    'project_coordinator_address',
    'project_participant_address',
    'organization_registered_address',
  ]);
  const geomPrecision = (p: Place): string => p.geometry.precision;

  for (const module of corpus.modules) {
    /* Places */
    for (const place of module.places ?? []) {
      placeSeen.set(place.id, (placeSeen.get(place.id) ?? 0) + 1);
      if (!placeById.has(place.id)) placeById.set(place.id, place);

      /* G3 — place caseId resolves and matches its module */
      if (place.caseId !== module.caseId || !moduleCaseIds.has(place.caseId)) {
        fail('G3', place.id,
          `Place caseId "${place.caseId}" does not resolve to its content module "${module.caseId}"`);
      }
      /* G4 — geometry carries a source and attribution (coords are schema-checked) */
      const g = place.geometry;
      const geomSource = g.type === 'point' ? g.coordinateSource : g.geometrySource;
      if (geomSource.trim().length === 0 || g.attributionText.trim().length === 0) {
        fail('G4', place.id, 'Place geometry must carry a non-empty source and attribution');
      }
      /* G5 — kind compatible with geometry type + precision */
      const kindOk =
        ((place.kind === 'city' || place.kind === 'site') &&
          g.type === 'point' && g.precision === place.kind) ||
        ((place.kind === 'country' || place.kind === 'region') &&
          g.type === 'administrative_area' && g.precision === place.kind);
      if (!kindOk) {
        fail('G5', place.id,
          `Place kind "${place.kind}" is incompatible with its geometry (${g.type}/${g.precision})`);
      }
    }

    /* ClaimPlaceLinks */
    for (const link of module.claimPlaceLinks ?? []) {
      linkSeen.set(link.id, (linkSeen.get(link.id) ?? 0) + 1);

      /* G6 — link resolves to an in-case Claim and Place */
      const claim = claimById.get(link.claimId);
      const place = placeById.get(link.placeId);
      if (claim === undefined || claim.caseId !== link.caseId) {
        fail('G6', link.id,
          `ClaimPlaceLink claimId "${link.claimId}" does not resolve to an in-case Claim`);
      }
      if (place === undefined || place.caseId !== link.caseId) {
        fail('G6', link.id,
          `ClaimPlaceLink placeId "${link.placeId}" does not resolve to an in-case Place`);
      }
      /* G7 — at least one citation id (schema min 1; belt-and-braces) */
      if (link.citationIds.length === 0) {
        fail('G7', link.id, 'ClaimPlaceLink must cite at least one Citation');
      }
      /* G8/G9 — every citation exists and belongs to the linked Claim */
      for (const cid of link.citationIds) {
        const owner = citationOwner.get(cid);
        if (owner === undefined) {
          fail('G8', link.id, `cited Citation id "${cid}" does not exist in the corpus`);
        } else if (owner !== link.claimId) {
          fail('G9', link.id,
            `cited Citation "${cid}" belongs to Claim "${owner}", not the linked Claim "${link.claimId}"`);
        }
      }
      /* G10 — epistemicStatus cannot exceed the linked Claim's status */
      if (claim !== undefined &&
          (statusRank[link.epistemicStatus] ?? 0) > (statusRank[claim.epistemicStatus] ?? 0)) {
        fail('G10', link.id,
          `ClaimPlaceLink epistemicStatus "${link.epistemicStatus}" exceeds the linked Claim's "${claim.epistemicStatus}"`);
      }
      /* G11 — evidencePrecision cannot exceed the Place geometry precision */
      if (place !== undefined &&
          (precisionRank[link.evidencePrecision] ?? 0) > (precisionRank[geomPrecision(place)] ?? 0)) {
        fail('G11', link.id,
          `evidencePrecision "${link.evidencePrecision}" exceeds the Place geometry precision "${geomPrecision(place)}"`);
      }
      /* G12 — temporal scope compatible with a structured Claim period (if any) */
      if (claim?.timeline !== undefined) {
        const cStart = claim.timeline.year;
        const cEnd = claim.timeline.endYear ?? claim.timeline.year;
        const lStart = link.temporalScope.year;
        const lEnd = link.temporalScope.endYear ?? link.temporalScope.year;
        if (lStart < cStart || lEnd > cEnd) {
          fail('G12', link.id,
            `temporalScope ${lStart}-${lEnd} falls outside the linked Claim period ${cStart}-${cEnd}`);
        }
      }
      /* G13 — an address record must not be rendered at site precision
         (that would present a postal address as a physical event/research/
         production site without site-level evidence) */
      if (ADDRESS_RELATIONSHIPS.has(link.relationship) && link.evidencePrecision === 'site') {
        fail('G13', link.id,
          `${link.relationship} may not claim site precision; an address record is not a site location`);
      }
      /* G14 — site precision requires an explicit site-level provenance note */
      if (link.evidencePrecision === 'site' &&
          (link.provenanceNote === undefined || link.provenanceNote.trim().length === 0)) {
        fail('G14', link.id,
          'site-precision link requires an explicit provenanceNote asserting the site-level source');
      }
    }
  }

  /* G1 — Place id uniqueness; G2 — ClaimPlaceLink id uniqueness */
  for (const [id, count] of placeSeen) {
    if (count > 1) fail('G1', id, `Place id "${id}" occurs ${count} times`);
  }
  for (const [id, count] of linkSeen) {
    if (count > 1) fail('G2', id, `ClaimPlaceLink id "${id}" occurs ${count} times`);
  }

  return failures;
}

/* ------------------------------------------------------------------ *
 * V9 — status floors (helpers)
 * ------------------------------------------------------------------ */

function uniqueSources(
  citations: Array<{ sourceId: string }>,
  sourceById: Map<string, Source>,
): Source[] {
  const seen = new Set<string>();
  const result: Source[] = [];
  for (const citation of citations) {
    const source = sourceById.get(citation.sourceId);
    if (source !== undefined && !seen.has(source.id)) {
      seen.add(source.id);
      result.push(source);
    }
  }
  return result;
}

function hasIndependentCrossPair(
  left: Source[],
  right: Source[],
  isDependent: (a: Source, b: Source) => boolean,
): boolean {
  const sortById = (xs: Source[]): Source[] =>
    [...xs].sort((x, y) => (x.id < y.id ? -1 : x.id > y.id ? 1 : 0));
  for (const a of sortById(left)) {
    for (const b of sortById(right)) {
      if (a.id !== b.id && !isDependent(a, b)) return true;
    }
  }
  return false;
}

/**
 * Expert source per the METHODOLOGY.md interpretive floor:
 * an academic source with identifiable authors OR an identifiable
 * issuing institution; or a reputable_press source with at least one
 * named author AND an identifiable institution. Anonymous or
 * provenance-poor sources never qualify.
 */
export function isExpertSource(source: Source): boolean {
  const hasNamedAuthors = (source.authors ?? []).length > 0;
  const hasInstitution = source.institution !== undefined;
  if (source.sourceType === 'academic') return hasNamedAuthors || hasInstitution;
  return source.sourceType === 'reputable_press' && hasNamedAuthors && hasInstitution;
}

/**
 * Returns a failure message, or null when the floor is met. Contested
 * and insufficient are governed by V11 and the schema respectively.
 */
function checkStatusFloor(
  claim: Claim,
  supportSources: Source[],
  isDependent: (a: Source, b: Source) => boolean,
): string | null {
  const status = claim.epistemicStatus;
  if (status === 'contested' || status === 'insufficient') return null;

  switch (claim.claimType) {
    case 'factual': {
      if (status === 'established') {
        // Direct documentary route: the evidence must be CONTEMPORANEOUS.
        // A retrospective institutional history — even the subject's own —
        // never satisfies this route alone; subject authorship is
        // provenance information, but retrospection caps the direct route.
        const contemporaneousDocumentary = selectIndependentSources(
          supportSources, 1,
          (s) => s.sourceType === 'documentary' && s.temporalRelation === 'contemporaneous');
        const pair = selectIndependentSources(
          supportSources, 2,
          (s) => ESTABLISHED_PAIR_TYPES.has(s.sourceType),
          isDependent);
        if (contemporaneousDocumentary === null && pair === null) {
          return 'factual/established requires contemporaneous documentary supporting evidence or two mutually independent documentary/academic/reputable_press supporting sources';
        }
        return null;
      }
      // well_supported
      const single = selectIndependentSources(
        supportSources, 1, (s) => WELL_SUPPORTED_FACTUAL_TYPES.has(s.sourceType));
      return single !== null
        ? null
        : 'factual/well_supported requires one supporting citation from a documentary, academic, reputable_press or institutional_history source';
    }
    case 'interpretive': {
      const expertAcademic = selectIndependentSources(
        supportSources, 1, (s) => s.sourceType === 'academic' && isExpertSource(s));
      const expertPair = selectIndependentSources(
        supportSources, 2, isExpertSource, isDependent);
      return expertAcademic !== null || expertPair !== null
        ? null
        : 'interpretive/well_supported requires one supporting expert academic source or an independent pair of expert sources; anonymous or provenance-poor sources do not qualify';
    }
    case 'causal': {
      const pair = selectIndependentSources(
        supportSources, 2, () => true, isDependent,
        { requireAcademicMember: true });
      return pair !== null
        ? null
        : 'causal/well_supported requires an independent supporting pair including at least one academic source';
    }
    case 'counterfactual': {
      const academic = selectIndependentSources(
        supportSources, 1, (s) => s.sourceType === 'academic');
      return academic !== null
        ? null
        : 'counterfactual/well_supported requires a supporting academic source';
    }
  }
}
