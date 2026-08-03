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
import { validateMediaPack } from '../lib/media.ts';
import { netherlandsMedia } from '../content/media/netherlands-semiconductor-equipment.media.ts';
import { validateChapters } from '../lib/chapters.ts';
import { netherlandsChapters } from '../content/chapters/netherlands-semiconductor-equipment.chapters.ts';
import { getAtlasCases } from '../lib/atlasCases.ts';
import { exploreGateFailures } from '../lib/exploreGate.ts';
import { validateAtlasPreviews } from '../lib/atlasPreview.ts';
import { atlasPreviews } from '../content/atlas/previews.ts';
import { validateCountryPresentations } from '../lib/atlasPresentation.ts';
import { countryPresentations } from '../content/atlas/presentation.ts';

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

// Media pack (Stage 2) — validated against the loaded corpus, build-blocking.
const mediaFailures = validateMediaPack(netherlandsMedia, corpus);
if (mediaFailures.length > 0) {
  for (const f of mediaFailures) console.error(`${f.ruleId} ${f.entityId}: ${f.message}`);
  console.error(`validate-content: ${mediaFailures.length} media failure(s).`);
  process.exit(1);
}

// Chapter pack (Stage 3) — validated against the loaded corpus + media, build-blocking.
const chapterFailures = validateChapters(netherlandsChapters, corpus);
if (chapterFailures.length > 0) {
  for (const f of chapterFailures) console.error(`${f.ruleId} ${f.entityId}: ${f.message}`);
  console.error(`validate-content: ${chapterFailures.length} chapter failure(s).`);
  process.exit(1);
}

// Explore publication gate (Stage 7) — any case exposing `explore` must be backed
// by supported chapters + public-renderable media, build-blocking.
const exploreFailures = exploreGateFailures(getAtlasCases());
if (exploreFailures.length > 0) {
  for (const f of exploreFailures) console.error(`${f.ruleId} ${f.caseId}: ${f.message}`);
  console.error(`validate-content: ${exploreFailures.length} explore-gate failure(s).`);
  process.exit(1);
}

// Atlas story previews (Stage 7.1) — beats must link to real, in-case, non-fake
// chapters in order, build-blocking.
const previewFailures = validateAtlasPreviews(atlasPreviews);
if (previewFailures.length > 0) {
  for (const f of previewFailures) console.error(`${f.ruleId} ${f.slug}: ${f.message}`);
  console.error(`validate-content: ${previewFailures.length} atlas-preview failure(s).`);
  process.exit(1);
}

// Country presentation copy (Stage 9.1) — Atlas summary specialisation + question,
// linked to real cases and complete for every case, build-blocking.
const presentationFailures = validateCountryPresentations(countryPresentations, getAtlasCases().map((c) => c.slug));
if (presentationFailures.length > 0) {
  for (const f of presentationFailures) console.error(`${f.ruleId} ${f.slug}: ${f.message}`);
  console.error(`validate-content: ${presentationFailures.length} country-presentation failure(s).`);
  process.exit(1);
}

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
    `${module.alternativeExplanations.length} alternative(s), ` +
    `${(module.places ?? []).length} place(s), ` +
    `${(module.claimPlaceLinks ?? []).length} place-link(s)`,
  );
}
const publicMedia = netherlandsMedia.assets.filter((a) => a.rights.permittedForPublicWebsite).length;
console.log(
  `  media netherlands-semiconductor-equipment: ` +
  `${netherlandsMedia.assets.length} asset(s) (${publicMedia} public), ${netherlandsMedia.links.length} link(s)`,
);
console.log(
  `  chapters netherlands-semiconductor-equipment: ` +
  `${netherlandsChapters.chapters.length} chapter(s), ${netherlandsChapters.researchGaps.length} research gap(s)`,
);
