/**
 * Why Here? — An Atlas of Industrial Advantage
 * lib/loadContent.ts — Increment 3: the typed content loader.
 *
 * The production corpus is assembled from an EXPLICIT registry
 * (content/index.ts), not from filesystem scanning: statically
 * discoverable, deterministic and Next.js-build compatible. Every
 * registered entity is parsed through the authoritative Zod schemas
 * (lib/schemas.ts) before it enters the corpus, so nothing malformed or
 * unregistered can be silently carried along.
 *
 * Load failures are structured with the ORIGINATING MODULE, the entity
 * id where one is extractable, and the schema issues — the layer of
 * attribution the cross-entity validator (which sees only the finished
 * corpus) cannot provide.
 */

import { z } from 'zod';

import {
  AlternativeExplanationSchema,
  CaseSchema,
  ClaimSchema,
  MechanismEdgeSchema,
  MechanismNodeSchema,
  ResearchQuestionSchema,
  SourceSchema,
} from './schemas.ts';
import type { CaseContentModule, Corpus } from './validate.ts';

/* ------------------------------------------------------------------ *
 * Registry contract
 * ------------------------------------------------------------------ */

/** One sources file, e.g. content/sources/<case>.sources.ts. */
export interface RegisteredSourceModule {
  moduleId: string;
  sources: readonly unknown[];
}

/** One case directory, e.g. content/cases/<case>/. */
export interface RegisteredCaseModule {
  moduleId: string;
  caseId: string;
  case: unknown;
  claims: readonly unknown[];
  researchQuestions: readonly unknown[];
  nodes: readonly unknown[];
  edges: readonly unknown[];
  alternativeExplanations: readonly unknown[];
}

export interface ContentRegistry {
  sourceModules: readonly RegisteredSourceModule[];
  caseModules: readonly RegisteredCaseModule[];
}

export interface LoadFailure {
  moduleId: string;
  entityId: string | null;
  message: string;
}

export type LoadResult =
  | { ok: true; corpus: Corpus; failures: readonly [] }
  | { ok: false; corpus: null; failures: readonly LoadFailure[] };

/* ------------------------------------------------------------------ *
 * Loader
 * ------------------------------------------------------------------ */

const byModuleId = <T extends { moduleId: string }>(xs: readonly T[]): T[] =>
  [...xs].sort((a, b) => (a.moduleId < b.moduleId ? -1 : a.moduleId > b.moduleId ? 1 : 0));

function extractId(entity: unknown): string | null {
  if (typeof entity === 'object' && entity !== null && 'id' in entity) {
    const id = (entity as { id: unknown }).id;
    if (typeof id === 'string') return id;
  }
  return null;
}

function describeIssues(error: z.ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
    .join('; ');
}

/**
 * Assembly reconciliation: every registered case module must appear in
 * the assembled corpus exactly once, and every source module's entities
 * must be present in full. Structurally the loader cannot drop a
 * module, but the contract is asserted rather than assumed.
 */
export function verifyAssemblyComplete(
  registry: ContentRegistry,
  corpus: Corpus,
): LoadFailure[] {
  const failures: LoadFailure[] = [];
  for (const registered of registry.caseModules) {
    const matches = corpus.modules.filter((m) => m.caseId === registered.caseId);
    if (matches.length === 0) {
      failures.push({
        moduleId: registered.moduleId,
        entityId: null,
        message: 'registered case module is missing from the assembled corpus',
      });
    } else if (matches.length > 1) {
      failures.push({
        moduleId: registered.moduleId,
        entityId: null,
        message: 'registered case module appears more than once in the assembled corpus',
      });
    }
  }
  const registeredSourceCount = registry.sourceModules
    .reduce((n, m) => n + m.sources.length, 0);
  if (corpus.sources.length !== registeredSourceCount) {
    failures.push({
      moduleId: '(registry)',
      entityId: null,
      message: `assembled corpus holds ${corpus.sources.length} sources but ${registeredSourceCount} were registered`,
    });
  }
  return failures;
}

/**
 * Parses the registry through the authoritative schemas and assembles
 * the typed corpus. Deterministic: modules are processed in moduleId
 * order and entities keep their authored order. The registry is never
 * mutated; the corpus is built exclusively from Zod parse OUTPUT, so it
 * shares no object identity with the imported content.
 */
export function loadCorpus(registry: ContentRegistry): LoadResult {
  const failures: LoadFailure[] = [];

  /* duplicate module registration */
  const seenModuleIds = new Set<string>();
  for (const module of [...registry.sourceModules, ...registry.caseModules]) {
    if (seenModuleIds.has(module.moduleId)) {
      failures.push({
        moduleId: module.moduleId,
        entityId: null,
        message: 'module is registered twice',
      });
    }
    seenModuleIds.add(module.moduleId);
  }

  /* duplicate entity registration (across the whole registry) */
  const seenEntityIds = new Map<string, string>(); // entityId -> moduleId
  const recordEntity = (moduleId: string, entity: unknown): void => {
    const id = extractId(entity);
    if (id === null) return;
    const holder = seenEntityIds.get(id);
    if (holder !== undefined) {
      failures.push({
        moduleId,
        entityId: id,
        message: `entity "${id}" is already registered by module "${holder}"`,
      });
    } else {
      seenEntityIds.set(id, moduleId);
    }
  };

  const parseAll = <S extends z.ZodTypeAny>(
    moduleId: string,
    kind: string,
    schema: S,
    entities: readonly unknown[],
  ): Array<z.infer<S>> => {
    const parsed: Array<z.infer<S>> = [];
    for (const entity of entities) {
      recordEntity(moduleId, entity);
      const result = schema.safeParse(entity);
      if (result.success) {
        parsed.push(result.data as z.infer<S>);
      } else {
        failures.push({
          moduleId,
          entityId: extractId(entity),
          message: `${kind} failed schema parse — ${describeIssues(result.error)}`,
        });
      }
    }
    return parsed;
  };

  const sources = byModuleId(registry.sourceModules).flatMap((module) =>
    parseAll(module.moduleId, 'Source', SourceSchema, module.sources),
  );

  const modules: CaseContentModule[] = [];
  for (const module of byModuleId(registry.caseModules)) {
    recordEntity(module.moduleId, module.case);
    const caseResult = CaseSchema.safeParse(module.case);
    if (!caseResult.success) {
      failures.push({
        moduleId: module.moduleId,
        entityId: extractId(module.case),
        message: `Case failed schema parse — ${describeIssues(caseResult.error)}`,
      });
    }
    const claims = parseAll(module.moduleId, 'Claim', ClaimSchema, module.claims);
    const researchQuestions = parseAll(
      module.moduleId, 'ResearchQuestion', ResearchQuestionSchema, module.researchQuestions);
    const nodes = parseAll(
      module.moduleId, 'MechanismNode', MechanismNodeSchema, module.nodes);
    const edges = parseAll(
      module.moduleId, 'MechanismEdge', MechanismEdgeSchema, module.edges);
    const alternativeExplanations = parseAll(
      module.moduleId, 'AlternativeExplanation', AlternativeExplanationSchema,
      module.alternativeExplanations);

    if (caseResult.success) {
      modules.push({
        caseId: module.caseId,
        case: caseResult.data,
        claims,
        researchQuestions,
        nodes,
        edges,
        alternativeExplanations,
      });
    }
  }

  if (failures.length > 0) return { ok: false, corpus: null, failures };

  const corpus: Corpus = { sources, modules };
  const assemblyFailures = verifyAssemblyComplete(registry, corpus);
  if (assemblyFailures.length > 0) {
    return { ok: false, corpus: null, failures: assemblyFailures };
  }
  return { ok: true, corpus, failures: [] };
}
