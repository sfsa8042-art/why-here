/**
 * Taiwan × Advanced Semiconductor Foundry Manufacturing — Stage 11A tests.
 *
 * Proves the research foundation is present and honest, and that Taiwan stays an
 * UN-LAUNCHED research case: planned in the Atlas, no modes, no chapters, no
 * thesis, no public route, exact locators, declared provenance — and that the
 * build-blocking guard actually fires when an invariant is broken.
 */

import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { loadCorpus } from '@/lib/loadContent';
import { productionRegistry } from '@/content/index';
import { caseBySlug, getAtlasCases } from '@/lib/atlasCases';
import { getCountryPresentation } from '@/lib/atlasPresentation';
import { isPlaceholderLocator } from '@/lib/validate';
import {
  taiwanResearchGuardFailures,
  TAIWAN_CASE_ID,
  TAIWAN_MIN_SOURCES,
  TAIWAN_MIN_FACTUAL_CLAIMS,
  TAIWAN_MIN_PLACES,
} from '@/lib/taiwanResearchGuard';
import type { CaseContentModule } from '@/lib/validate';

const loaded = loadCorpus(productionRegistry);
if (!loaded.ok) throw new Error('production corpus failed to load: ' + JSON.stringify(loaded.failures));
const corpus = loaded.corpus;
const tw = corpus.modules.find((m) => m.caseId === TAIWAN_CASE_ID)!;
const twSources = corpus.sources.filter((s) => s.id.startsWith('tw-src-'));
const atlasCases = getAtlasCases();
const twAtlas = caseBySlug(atlasCases, TAIWAN_CASE_ID)!;

const factual = tw.claims.filter((c) => c.claimType === 'factual');
const interpretive = tw.claims.filter((c) => c.claimType === 'interpretive');

/** Clone the Taiwan module so a mutation test cannot leak into other tests. */
function cloneTaiwanCorpus(): { corpus: typeof corpus; module: CaseContentModule } {
  const module: CaseContentModule = JSON.parse(JSON.stringify(tw));
  const next = { sources: corpus.sources, modules: corpus.modules.map((m) => (m.caseId === TAIWAN_CASE_ID ? module : m)) };
  return { corpus: next, module };
}

describe('Taiwan Stage 11A — case lifecycle & public posture', () => {
  it('is a research case (verified claims, no thesis) — not flagship/preview', () => {
    expect(tw.case.status).toBe('research');
    expect('thesisClaimId' in tw.case).toBe(false);
  });

  it('stays PLANNED in the public Atlas with availableModes exactly []', () => {
    expect(twAtlas.status).toBe('planned');
    expect(twAtlas.availableModes).toEqual([]);
  });

  it('exposes no public Explore or Sources CTA (no explore/evidence modes)', () => {
    expect(twAtlas.availableModes.includes('explore')).toBe(false);
    expect(twAtlas.availableModes.includes('evidence')).toBe(false);
  });

  it('has no launched public Taiwan route (Atlas story or Evidence)', () => {
    expect(existsSync(join(process.cwd(), 'app/atlas/taiwan-semiconductor-manufacturing'))).toBe(false);
    expect(existsSync(join(process.cwd(), 'app/evidence/taiwan-semiconductor-manufacturing'))).toBe(false);
  });

  it('has no narrative chapters module', () => {
    expect(existsSync(join(process.cwd(), 'content/chapters/taiwan-semiconductor-manufacturing.chapters.ts'))).toBe(false);
  });
});

describe('Taiwan Stage 11A — approved public presentation copy', () => {
  it('the Atlas uses the approved specialisation + question', () => {
    const p = getCountryPresentation(TAIWAN_CASE_ID)!;
    expect(p.specialisation).toBe('Semiconductor foundry manufacturing');
    expect(p.question).toBe('How did Taiwan develop its strength in semiconductor foundry manufacturing?');
    // "advanced" must not appear in the public specialisation until a later
    // evidence pack documents the transition to advanced manufacturing.
    expect(p.specialisation.toLowerCase()).not.toContain('advanced');
  });

  it('avoids unsupported superlatives in the case framing copy', () => {
    const banned = [
      'undisputed global leader', "world's semiconductor capital",
      'dominates the entire semiconductor industry', 'indispensable to the world',
    ];
    const p = getCountryPresentation(TAIWAN_CASE_ID)!;
    const casesSrc = readFileSync(join(process.cwd(), 'content/atlas/cases.ts'), 'utf8');
    for (const phrase of banned) {
      expect(p.specialisation.toLowerCase()).not.toContain(phrase);
      expect(p.question.toLowerCase()).not.toContain(phrase);
      expect(casesSrc.toLowerCase()).not.toContain(phrase);
    }
  });
});

describe('Taiwan Stage 11A — evidence pack integrity', () => {
  it('meets the minimum evidence floor (sources / factual claims / places)', () => {
    expect(twSources.length).toBeGreaterThanOrEqual(TAIWAN_MIN_SOURCES);
    expect(factual.length).toBeGreaterThanOrEqual(TAIWAN_MIN_FACTUAL_CLAIMS);
    expect((tw.places ?? []).length).toBeGreaterThanOrEqual(TAIWAN_MIN_PLACES);
  });

  it('carries at most three interpretive claims and no causal/counterfactual claims', () => {
    expect(interpretive.length).toBeLessThanOrEqual(3);
    expect(tw.claims.some((c) => c.claimType === 'causal' || c.claimType === 'counterfactual')).toBe(false);
  });

  it('has no `established` claim (epistemic ceiling — and so no established causal claim)', () => {
    expect(tw.claims.some((c) => c.epistemicStatus === 'established')).toBe(false);
  });

  it('every citation carries an exact (non-placeholder) locator', () => {
    for (const claim of tw.claims) {
      for (const cit of claim.citations) {
        expect(isPlaceholderLocator(cit.locator), `${cit.id} locator "${cit.locator.value}"`).toBe(false);
      }
    }
  });

  it('all research questions resolve, and every rationale claim is a real in-case claim', () => {
    const claimIds = new Set(tw.claims.map((c) => c.id));
    const questionIds = new Set(tw.researchQuestions.map((q) => q.id));
    for (const id of tw.case.researchQuestionIds) expect(questionIds.has(id)).toBe(true);
    for (const q of tw.researchQuestions) {
      expect(q.caseId).toBe(TAIWAN_CASE_ID);
      for (const rid of q.rationaleClaimIds ?? []) expect(claimIds.has(rid)).toBe(true);
    }
    // there are 6 research questions
    expect(tw.researchQuestions.length).toBe(6);
  });
});

describe('Taiwan Stage 11A — source provenance is declared', () => {
  it('every Taiwan source declares temporalRelation and subjectRelationship', () => {
    for (const s of twSources) {
      expect(s.temporalRelation).toBeTruthy();
      expect(s.subjectRelationship).toBeTruthy();
    }
  });

  it('company/participant sources are marked subject_authored + retrospective', () => {
    for (const id of ['tw-src-chang-oral-2007', 'tw-src-itri-history', 'tw-src-tsmc-20f-2023', 'tw-src-umc-20f-2023']) {
      const s = twSources.find((x) => x.id === id)!;
      expect(s.subjectRelationship).toBe('subject_authored');
      expect(s.temporalRelation).toBe('retrospective');
    }
  });

  it('scholarly sources are marked independent, and retrospective sources are marked retrospective', () => {
    for (const id of ['tw-src-saxenian-2001', 'tw-src-nrc-securing-2003', 'tw-src-lai-innovation-policy']) {
      expect(twSources.find((x) => x.id === id)!.subjectRelationship).toBe('independent');
    }
    // this whole pack is retrospective (no contemporaneous source was inspected)
    for (const s of twSources) expect(s.temporalRelation).toBe('retrospective');
  });
});

describe('Taiwan Stage 11A — research documentation', () => {
  const dir = 'docs/research/taiwan-semiconductor-manufacturing';
  it('the required research documents exist', () => {
    for (const f of [
      'RESEARCH_SCOPE.md', 'SOURCE_REGISTER.md', 'CLAIM_REGISTER.md', 'RESEARCH_GAPS.md',
      'TIMELINE_WORKING_NOTES.md', 'CAUSAL_HYPOTHESES.md', 'TERMINOLOGY.md',
    ]) {
      expect(existsSync(join(process.cwd(), dir, f)), f).toBe(true);
    }
  });

  it('at least six research gaps are documented', () => {
    const text = readFileSync(join(process.cwd(), dir, 'RESEARCH_GAPS.md'), 'utf8');
    const gaps = text.match(/^\s*(?:#{1,6}\s*|[-*]\s*)?G\d+\b/gm) ?? [];
    expect(gaps.length).toBeGreaterThanOrEqual(6);
  });
});

describe('Taiwan Stage 11A — build-blocking guard', () => {
  it('passes on the real corpus', () => {
    expect(taiwanResearchGuardFailures(corpus, atlasCases)).toEqual([]);
  });

  it('fires TW5 if any Taiwan claim is marked established', () => {
    const { corpus: c, module } = cloneTaiwanCorpus();
    (module.claims[0] as { epistemicStatus: string }).epistemicStatus = 'established';
    expect(taiwanResearchGuardFailures(c, atlasCases).some((f) => f.ruleId === 'TW5')).toBe(true);
  });

  it('fires TW4 if a causal claim is introduced', () => {
    const { corpus: c, module } = cloneTaiwanCorpus();
    (module.claims[0] as { claimType: string }).claimType = 'causal';
    expect(taiwanResearchGuardFailures(c, atlasCases).some((f) => f.ruleId === 'TW4')).toBe(true);
  });

  it('fires TW10 if the Atlas case is switched away from planned/no-modes', () => {
    const mutatedAtlas = atlasCases.map((c) =>
      c.slug === TAIWAN_CASE_ID ? { ...c, status: 'in_research' as const, availableModes: ['evidence' as const] } : c);
    const ids = taiwanResearchGuardFailures(corpus, mutatedAtlas).map((f) => f.ruleId);
    expect(ids).toContain('TW10');
  });

  it('fires TW3 if a citation locator is a placeholder', () => {
    const { corpus: c, module } = cloneTaiwanCorpus();
    (module.claims[0]!.citations[0]!.locator as { value: string }).value = 'tbd';
    expect(taiwanResearchGuardFailures(c, atlasCases).some((f) => f.ruleId === 'TW3')).toBe(true);
  });
});

describe('Taiwan Stage 11A — no collateral change', () => {
  it('the Netherlands case and its presentation are unchanged', () => {
    const nl = corpus.modules.find((m) => m.caseId === 'netherlands-semiconductor-equipment')!;
    expect(nl.claims.some((c) => c.id === 'nl-f-jv-established-1984')).toBe(true);
    expect(getCountryPresentation('netherlands-semiconductor-equipment')!.question)
      .toBe('How did the Netherlands develop its strength in semiconductor lithography equipment?');
  });

  it('the landing page still shows Taiwan as a planned signal (unchanged behaviour)', () => {
    const pageSrc = readFileSync(join(process.cwd(), 'app/page.tsx'), 'utf8');
    expect(pageSrc).toMatch(/slug:\s*'taiwan-semiconductor-manufacturing'[\s\S]*?spec:\s*'Semiconductor manufacturing'[\s\S]*?status:\s*'Planned'/);
  });
});
