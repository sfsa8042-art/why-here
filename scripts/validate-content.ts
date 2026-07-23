/**
 * scripts/validate-content.ts — Increment 2.
 *
 * Runs both validation layers (Zod schema parse, then the cross-entity
 * validator) and exits non-zero on any failure. Wired to `prebuild`, so
 * a failing corpus blocks `next build`.
 *
 * Until the Increment 3 content loader exists there is no real research
 * content to load; the pipeline is exercised against the valid synthetic
 * fixture case so that the command, exit codes and reporting are real
 * from day one. The loader will replace the fixture import, not this
 * structure.
 */

import {
  AlternativeExplanationSchema,
  CaseSchema,
  ClaimSchema,
  MechanismEdgeSchema,
  MechanismNodeSchema,
  ResearchQuestionSchema,
  SourceSchema,
} from '../lib/schemas.ts';
import { validateCorpus, type Corpus } from '../lib/validate.ts';
import {
  alternativeExplanations,
  claims,
  edges,
  flagshipCase,
  nodes,
  researchQuestions,
  sources,
  CASE_ID,
} from '../content/__fixtures__/valid/minimal-case.ts';

let schemaFailures = 0;

function parseAll<T>(
  label: string,
  schema: { safeParse: (v: unknown) => { success: boolean; error?: { message: string } } },
  entities: readonly T[],
): void {
  for (const entity of entities) {
    const result = schema.safeParse(entity);
    if (!result.success) {
      schemaFailures += 1;
      const id = (entity as { id?: string }).id ?? '(no id)';
      console.error(`SCHEMA ${label} ${id}: ${result.error?.message ?? 'parse failed'}`);
    }
  }
}

parseAll('Source', SourceSchema, sources);
parseAll('Claim', ClaimSchema, claims);
parseAll('ResearchQuestion', ResearchQuestionSchema, researchQuestions);
parseAll('MechanismNode', MechanismNodeSchema, nodes);
parseAll('MechanismEdge', MechanismEdgeSchema, edges);
parseAll('AlternativeExplanation', AlternativeExplanationSchema, alternativeExplanations);
parseAll('Case', CaseSchema, [flagshipCase]);

if (schemaFailures > 0) {
  console.error(`validate-content: ${schemaFailures} schema failure(s).`);
  process.exit(1);
}

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

const failures = validateCorpus(corpus);

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`${failure.ruleId} ${failure.entityId}: ${failure.message}`);
  }
  console.error(`validate-content: ${failures.length} validator failure(s).`);
  process.exit(1);
}

console.log(
  `validate-content: OK — ${sources.length} sources, ${claims.length} claims, ` +
  '1 case validated against V1-V20.',
);
