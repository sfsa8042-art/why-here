/**
 * lib/taiwanResearchGuard.ts — Stage 11A build-blocking invariants (TW1–TW12).
 *
 * The Taiwan case is a RESEARCH FOUNDATION, not a launched public story. These
 * rules run in scripts/validate-content.ts and make it impossible to silently
 * degrade that posture: they prove the evidence resolves and is honestly
 * located, that no causal/established/thesis over-claim has crept in, that the
 * declared provenance is present, and that no public Taiwan surface (chapters,
 * Explore/Sources routes, Atlas modes) has been switched on by accident.
 *
 * Zod (lib/schemas.ts) and the cross-entity validator (lib/validate.ts) remain
 * authoritative for structure; this guard adds Taiwan-specific, corpus- and
 * filesystem-aware assertions the general validator does not encode.
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { AtlasCase } from './atlasCases.ts';
import { isPlaceholderLocator, type Corpus } from './validate.ts';

export const TAIWAN_CASE_ID = 'taiwan-semiconductor-manufacturing';

/** Minimum evidence-pack floor for this stage (Stage 11A brief §8). */
export const TAIWAN_MIN_SOURCES = 8;
export const TAIWAN_MIN_FACTUAL_CLAIMS = 12;
export const TAIWAN_MIN_PLACES = 3;
export const TAIWAN_MIN_RESEARCH_GAPS = 6;

/** Firm/participant sources whose provenance MUST read subject_authored + retrospective. */
const TAIWAN_SUBJECT_AUTHORED_SOURCE_IDS = [
  'tw-src-chang-oral-2007',
  'tw-src-itri-history',
  'tw-src-tsmc-20f-2023',
  'tw-src-umc-20f-2023',
];

/** Independent (non-subject) scholarly sources. */
const TAIWAN_INDEPENDENT_SOURCE_IDS = [
  'tw-src-saxenian-2001',
  'tw-src-nrc-securing-2003',
  'tw-src-lai-innovation-policy',
];

export interface TaiwanGuardFailure {
  ruleId: string;
  entityId: string;
  message: string;
}

export interface TaiwanGuardOptions {
  /** Repo root; defaults to process.cwd(). Injectable for tests. */
  cwd?: string;
}

/**
 * Returns [] when every Taiwan invariant holds. Pure over (corpus, atlasCases)
 * plus a few filesystem existence checks (chapters/route absence, gaps doc).
 */
export function taiwanResearchGuardFailures(
  corpus: Corpus,
  atlasCases: readonly AtlasCase[],
  options: TaiwanGuardOptions = {},
): TaiwanGuardFailure[] {
  const failures: TaiwanGuardFailure[] = [];
  const fail = (ruleId: string, entityId: string, message: string): void => {
    failures.push({ ruleId, entityId, message });
  };
  const cwd = options.cwd ?? process.cwd();

  const module = corpus.modules.find((m) => m.caseId === TAIWAN_CASE_ID);
  const sourceById = new Map(corpus.sources.map((s) => [s.id, s]));
  const taiwanSources = corpus.sources.filter((s) => s.id.startsWith('tw-src-'));

  /* TW1 — the case exists and is a `research` case (no thesis is structural). */
  if (module === undefined) {
    fail('TW1', TAIWAN_CASE_ID, 'Taiwan research case is not present in the corpus');
    return failures; // nothing else is checkable
  }
  if (module.case.status !== 'research') {
    fail('TW1', TAIWAN_CASE_ID,
      `Taiwan case status is "${module.case.status}"; the Stage-11A foundation must be a "research" case (no thesis)`);
  }
  // ResearchCaseSchema forbids thesisClaimId, but assert defensively against any drift.
  if ('thesisClaimId' in module.case) {
    fail('TW8-no-thesis', TAIWAN_CASE_ID, 'Taiwan case must not carry a thesisClaimId (no unsupported thesis)');
  }

  const claims = module.claims;
  const factual = claims.filter((c) => c.claimType === 'factual');
  const interpretive = claims.filter((c) => c.claimType === 'interpretive');

  /* TW2/TW3 — every Taiwan citation resolves and carries an EXACT locator. */
  for (const claim of claims) {
    for (const cit of claim.citations) {
      if (!sourceById.has(cit.sourceId)) {
        fail('TW2', claim.id, `citation "${cit.id}" sourceId "${cit.sourceId}" does not resolve to a Source`);
      }
      if (isPlaceholderLocator(cit.locator)) {
        fail('TW3', claim.id, `citation "${cit.id}" carries a placeholder locator "${cit.locator.value}"`);
      }
    }
  }

  /* TW4 — no causal or counterfactual claims in this foundation pack. */
  for (const claim of claims) {
    if (claim.claimType === 'causal' || claim.claimType === 'counterfactual') {
      fail('TW4', claim.id, `Taiwan pack must contain no ${claim.claimType} claims in Stage 11A`);
    }
  }

  /* TW5 — epistemic ceiling: no Taiwan claim is `established`. Also guarantees
     the brief's "no causal claim can be established" (there are no causal
     claims, and none is established). */
  for (const claim of claims) {
    if (claim.epistemicStatus === 'established') {
      fail('TW5', claim.id,
        'Taiwan claim must not be "established" in this pack (no contemporaneous documentary or independent-pair basis established)');
    }
  }

  /* TW6 — at most three interpretive claims. */
  if (interpretive.length > 3) {
    fail('TW6', TAIWAN_CASE_ID, `Taiwan pack carries ${interpretive.length} interpretive claims; the ceiling is 3`);
  }

  /* TW7 — declared provenance: subject-authored firm/participant sources are
     marked subject_authored + retrospective; scholarly sources independent. */
  for (const id of TAIWAN_SUBJECT_AUTHORED_SOURCE_IDS) {
    const s = sourceById.get(id);
    if (s === undefined) { fail('TW7', id, 'expected Taiwan subject-authored source is missing'); continue; }
    if (s.subjectRelationship !== 'subject_authored') {
      fail('TW7', id, `source "${id}" must be subject_authored (it is a firm/participant account), got "${s.subjectRelationship}"`);
    }
    if (s.temporalRelation !== 'retrospective') {
      fail('TW7', id, `source "${id}" must be retrospective, got "${s.temporalRelation}"`);
    }
  }
  for (const id of TAIWAN_INDEPENDENT_SOURCE_IDS) {
    const s = sourceById.get(id);
    if (s === undefined) { fail('TW7', id, 'expected Taiwan independent source is missing'); continue; }
    if (s.subjectRelationship !== 'independent') {
      fail('TW7', id, `scholarly source "${id}" must be independent, got "${s.subjectRelationship}"`);
    }
  }

  /* TW9 — no Taiwan narrative chapters registered yet. */
  if (existsSync(join(cwd, 'content/chapters/taiwan-semiconductor-manufacturing.chapters.ts'))) {
    fail('TW9', TAIWAN_CASE_ID, 'a Taiwan chapters module exists; no narrative chapters may exist in Stage 11A');
  }

  /* TW10 — the public Atlas keeps Taiwan `planned` with no modes. */
  const atlas = atlasCases.find((c) => c.slug === TAIWAN_CASE_ID);
  if (atlas === undefined) {
    fail('TW10', TAIWAN_CASE_ID, 'Taiwan atlas case is missing');
  } else {
    if (atlas.status !== 'planned') {
      fail('TW10', TAIWAN_CASE_ID, `Taiwan atlas status must remain "planned", got "${atlas.status}"`);
    }
    if (atlas.availableModes.length !== 0) {
      fail('TW10', TAIWAN_CASE_ID, `Taiwan atlas availableModes must be [], got [${atlas.availableModes.join(', ')}]`);
    }
  }

  /* TW11 — no public Taiwan route launched (Explore or Evidence). */
  for (const route of [
    'app/atlas/taiwan-semiconductor-manufacturing',
    'app/evidence/taiwan-semiconductor-manufacturing',
  ]) {
    if (existsSync(join(cwd, route))) {
      fail('TW11', TAIWAN_CASE_ID, `public Taiwan route "${route}" exists; none may be launched in Stage 11A`);
    }
  }

  /* TW12 — minimum evidence-pack floor. */
  if (taiwanSources.length < TAIWAN_MIN_SOURCES) {
    fail('TW12', TAIWAN_CASE_ID, `Taiwan has ${taiwanSources.length} sources; minimum is ${TAIWAN_MIN_SOURCES}`);
  }
  if (factual.length < TAIWAN_MIN_FACTUAL_CLAIMS) {
    fail('TW12', TAIWAN_CASE_ID, `Taiwan has ${factual.length} factual claims; minimum is ${TAIWAN_MIN_FACTUAL_CLAIMS}`);
  }
  if ((module.places ?? []).length < TAIWAN_MIN_PLACES) {
    fail('TW12', TAIWAN_CASE_ID, `Taiwan has ${(module.places ?? []).length} places; minimum is ${TAIWAN_MIN_PLACES}`);
  }
  if (countResearchGaps(cwd) < TAIWAN_MIN_RESEARCH_GAPS) {
    fail('TW12', TAIWAN_CASE_ID,
      `Taiwan RESEARCH_GAPS.md lists fewer than ${TAIWAN_MIN_RESEARCH_GAPS} gaps (or is missing)`);
  }

  return failures;
}

/** Count `G1`/`G2`-style gap headings in the Taiwan RESEARCH_GAPS.md, if present. */
export function countResearchGaps(cwd: string): number {
  const path = join(cwd, 'docs/research/taiwan-semiconductor-manufacturing/RESEARCH_GAPS.md');
  if (!existsSync(path)) return 0;
  const text = readFileSync(path, 'utf8');
  // Gap headings look like "## G1 — …" (also tolerate a bullet form "- G1 …").
  const matches = text.match(/^\s*(?:#{1,6}\s*|[-*]\s*)?G\d+\b/gm);
  return matches ? matches.length : 0;
}
