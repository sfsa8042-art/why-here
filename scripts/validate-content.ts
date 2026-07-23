/**
 * scripts/validate-content.ts — Increment 3.
 *
 * The real production pipeline, run by `prebuild` before `next build`:
 *   1. load the production content registry (content/index.ts);
 *   2. parse every registered entity through the authoritative Zod
 *      schemas, with failures attributed to their originating module;
 *   3. run the Increment 2 cross-entity validator (V1–V20);
 *   4. print a concise corpus summary;
 *   5. exit non-zero on any loading, schema or validation failure.
 *
 * Synthetic fixtures (content/__fixtures__/) are test-only and are
 * never consulted here.
 */

import { productionRegistry } from '../content/index.ts';
import { loadCorpus } from '../lib/loadContent.ts';
import { validateCorpus } from '../lib/validate.ts';

const loaded = loadCorpus(productionRegistry);

if (!loaded.ok) {
  for (const failure of loaded.failures) {
    const entity = failure.entityId === null ? '' : ` [${failure.entityId}]`;
    console.error(`LOAD ${failure.moduleId}${entity}: ${failure.message}`);
  }
  console.error(`validate-content: ${loaded.failures.length} loading failure(s).`);
  process.exit(1);
}

const validationFailures = validateCorpus(loaded.corpus);

if (validationFailures.length > 0) {
  for (const failure of validationFailures) {
    console.error(`${failure.ruleId} ${failure.entityId}: ${failure.message}`);
  }
  console.error(`validate-content: ${validationFailures.length} validator failure(s).`);
  process.exit(1);
}

const { corpus } = loaded;
console.log('validate-content: OK — production corpus valid against schemas and V1-V20.');
console.log(`  sources: ${corpus.sources.length}`);
for (const module of corpus.modules) {
  const c = module.case;
  console.log(
    `  case ${c.id} (${c.status}): ` +
    `${module.researchQuestions.length} question(s), ` +
    `${module.claims.length} claim(s), ` +
    `${module.nodes.length} node(s), ` +
    `${module.edges.length} edge(s), ` +
    `${module.alternativeExplanations.length} alternative(s)`,
  );
}
