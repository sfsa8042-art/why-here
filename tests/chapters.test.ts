/**
 * NarrativeChapter contract (Public Atlas V2, Stage 3). Schema, build-blocking
 * C-series validation (references, support floors, editorial flags, forbidden
 * causal prose, contextual-media limitations), the loader, and the ordinary-user
 * view-model. The production pack is validated against the real corpus; negative
 * cases use crafted packs.
 */

import { describe, expect, it } from 'vitest';

import {
  NarrativeChapterSchema,
  buildChaptersView,
  getCaseChapters,
  selectChapterMediaLink,
  validateChapters,
  type NarrativeChapter,
} from '@/lib/chapters';
import { netherlandsChapters } from '@/content/chapters/netherlands-semiconductor-equipment.chapters';
import { loadCorpus } from '@/lib/loadContent';
import { productionRegistry } from '@/content/index';

const loaded = loadCorpus(productionRegistry);
if (!loaded.ok) throw new Error('corpus failed to load');
const corpus = loaded.corpus;
const CASE = 'netherlands-semiconductor-equipment';

const ok = (over: Partial<NarrativeChapter> = {}): NarrativeChapter => ({
  id: 'nl-ch-x', caseId: CASE, order: 90, title: 'T', periodLabel: '1984',
  whatHappened: 'A thing was recorded.', whyItMatters: 'It sets the scene.',
  whatThisExplains: 'How the recorded thing came together.',
  whatThisDoesNotExplain: 'Why the wider advantage emerged.',
  claimIds: ['nl-f-jv-established-1984'], placeIds: [], mediaIds: [],
  supportStatus: 'supported', limitations: '', readingTimeMinutes: 2,
  editorial: { proseTraceableToClaims: true, causalWithinEpistemicCeiling: true, mediaImpliesNoUnsupportedEvent: true, ceilingReviewNote: 'Restates one factual claim; no causal claim made.' },
  ...over,
});
const pack = (chapters: NarrativeChapter[]) => ({ chapters, researchGaps: [] as { title: string; question: string }[] });
const ruleIds = (fs: { ruleId: string }[]) => fs.map((f) => f.ruleId);

describe('Chapter schema', () => {
  it('accepts a valid chapter and rejects a bad support enum', () => {
    expect(NarrativeChapterSchema.safeParse(ok()).success).toBe(true);
    expect(NarrativeChapterSchema.safeParse({ ...ok(), supportStatus: 'proven' }).success).toBe(false);
  });
  it('requires the editorial sign-off object', () => {
    const { editorial, ...rest } = ok();
    void editorial;
    expect(NarrativeChapterSchema.safeParse(rest).success).toBe(false);
  });
});

describe('Chapter validation (C-series)', () => {
  it('the production pack is valid against the corpus', () => {
    expect(validateChapters(netherlandsChapters, corpus)).toEqual([]);
    expect(() => getCaseChapters(CASE)).not.toThrow();
  });

  it('C1 — rejects duplicate ids and duplicate orders', () => {
    expect(ruleIds(validateChapters(pack([ok({ id: 'dup' }), ok({ id: 'dup', order: 91 })]), corpus))).toContain('C1-unique-id');
    expect(ruleIds(validateChapters(pack([ok({ id: 'a', order: 5 }), ok({ id: 'b', order: 5 })]), corpus))).toContain('C1-unique-order');
  });

  it('C2 — rejects unresolved claim / place / media references', () => {
    expect(ruleIds(validateChapters(pack([ok({ claimIds: ['nl-not-a-claim'] })]), corpus))).toContain('C2-claim-ref');
    expect(ruleIds(validateChapters(pack([ok({ placeIds: ['nl-not-a-place'] })]), corpus))).toContain('C2-place-ref');
    expect(ruleIds(validateChapters(pack([ok({ mediaIds: ['nl-not-a-media'] })]), corpus))).toContain('C2-media-ref');
  });

  it('C3 — a supported chapter needs at least one Claim', () => {
    expect(ruleIds(validateChapters(pack([ok({ claimIds: [] })]), corpus))).toContain('C3-supported-needs-claim');
  });

  it('C4 — a partially_supported chapter needs a visible limitations note', () => {
    expect(ruleIds(validateChapters(pack([ok({ supportStatus: 'partially_supported', limitations: '' })]), corpus))).toContain('C4-partial-needs-limits');
  });

  it('C5 — a needs_research chapter may not use conclusion-like language', () => {
    const bad = ok({ supportStatus: 'needs_research', claimIds: [], whyItMatters: 'The move caused the outcome.' });
    expect(ruleIds(validateChapters(pack([bad]), corpus))).toContain('C5-needs-research-language');
  });

  it('C6 / C7 / C12 — supported prose requires the three editorial flags', () => {
    expect(ruleIds(validateChapters(pack([ok({ editorial: { ...ok().editorial, proseTraceableToClaims: false } })]), corpus))).toContain('C6-prose-traceable');
    expect(ruleIds(validateChapters(pack([ok({ editorial: { ...ok().editorial, causalWithinEpistemicCeiling: false } })]), corpus))).toContain('C7-causal-ceiling');
    expect(ruleIds(validateChapters(pack([ok({ editorial: { ...ok().editorial, mediaImpliesNoUnsupportedEvent: false } })]), corpus))).toContain('C12-media-event');
  });

  it('C7b — the lexical safety lint blocks known bad phrasing in the affirmative narrative', () => {
    const phrases = [
      'DEEP-UV caused the later product.',
      'The work ensured commercial survival.',
      'On the record, every participant worked at its postal address.',
      'This is why Eindhoven, and nowhere else, became the home of the industry.',
    ];
    for (const p of phrases) {
      expect(ruleIds(validateChapters(pack([ok({ whyItMatters: p })]), corpus))).toContain('C7b-lexical-safety-lint');
    }
  });

  it('C7b — the lint does NOT run over the disclaimer field (which quotes forbidden claims to deny them)', () => {
    const ch = ok({ whatThisDoesNotExplain: 'That DEEP-UV caused the PAS 5500 or ensured survival.' });
    expect(ruleIds(validateChapters(pack([ch]), corpus))).not.toContain('C7b-lexical-safety-lint');
  });

  it('C7c — a non-empty epistemic-ceiling review note is required', () => {
    const bad = ok({ editorial: { ...ok().editorial, ceilingReviewNote: '   ' } });
    expect(ruleIds(validateChapters(pack([bad]), corpus))).toContain('C7c-ceiling-note');
    // schema rejects an entirely missing note
    const { ceilingReviewNote, ...ed } = ok().editorial; void ceilingReviewNote;
    expect(NarrativeChapterSchema.safeParse({ ...ok(), editorial: ed }).success).toBe(false);
  });

  it('C11 — a chapter carrying contextual (present-day/timeless) media needs limitations', () => {
    const bad = ok({ mediaIds: ['nl-media-eindhoven-city-2007'], limitations: '' });
    expect(ruleIds(validateChapters(pack([bad]), corpus))).toContain('C11-contextual-media-limits');
  });
});

describe('Chapter validation — media via MediaLink (C14/C16)', () => {
  it('C16 — a media link may not assert Claims outside the chapter; context-only links are fine', () => {
    // The production Eindhoven cover link is context-only (asserts no Claims), so
    // using it in a chapter that does NOT list its (non-existent) claims is valid.
    const contextOnly = ok({ mediaIds: ['nl-media-eindhoven-city-2007'], limitations: 'context only' });
    expect(ruleIds(validateChapters(pack([contextOnly]), corpus))).not.toContain('C16-media-claim-compat');
  });

  it('every production media id resolves through exactly one deterministic, non-decorative MediaLink', () => {
    for (const ch of netherlandsChapters.chapters) {
      for (const mid of ch.mediaIds) {
        const { link, ambiguous } = selectChapterMediaLink(CASE, mid);
        expect(link).not.toBe(null);
        expect(ambiguous).toBe(false);
        expect(link!.role).not.toBe('decorative');
      }
    }
  });

  it('the boundary fields are required by the schema', () => {
    const { whatThisExplains, ...a } = ok(); void whatThisExplains;
    expect(NarrativeChapterSchema.safeParse(a).success).toBe(false);
    const { whatThisDoesNotExplain, ...b } = ok(); void whatThisDoesNotExplain;
    expect(NarrativeChapterSchema.safeParse(b).success).toBe(false);
  });
});

describe('Chapter loader + view-model', () => {
  const view = buildChaptersView(CASE);

  it('loads exactly three chapters (ordered) and eight research gaps', () => {
    expect(view.chapters.map((c) => c.order)).toEqual([1, 2, 3]);
    expect(view.chapters.map((c) => c.title)).toEqual([
      'A fragile joint venture', 'Crisis without a proven mechanism', 'European coordination',
    ]);
    expect(view.researchGaps.length).toBe(8);
  });

  it('chapter 2 is partially_supported and carries the exact required evidence boundary', () => {
    const ch2 = view.chapters[1]!;
    expect(ch2.supportStatus).toBe('partially_supported');
    expect(ch2.limitations).toBe(
      'The evidence establishes the sequence of technical and financial events, but not a complete causal explanation of why the venture survived.',
    );
  });

  it('every chapter states, verbatim, what it explains and does not explain', () => {
    expect(view.chapters.map((c) => c.whatThisExplains)).toEqual([
      'How resources, staff and commitments from Philips and ASM were assembled into a new venture.',
      'The documented sequence of technical difficulties, financing actions and ownership changes.',
      'That ASM Lithography operated within a cross-border European technical network during DEEP-UV.',
    ]);
    expect(view.chapters.map((c) => c.whatThisDoesNotExplain)).toEqual([
      'Why the Netherlands later developed a durable advantage in semiconductor lithography.',
      'A complete causal explanation of why the venture survived.',
      'That DEEP-UV caused the PAS 5500, ensured survival or produced commercial success.',
    ]);
  });

  it('chapter 3 anchors resolve to the two case cities with real coordinates', () => {
    const ch3 = view.chapters[2]!;
    expect(ch3.anchors.map((a) => a.name).sort()).toEqual(['Eindhoven', 'Veldhoven']);
    for (const a of ch3.anchors) {
      expect(Number.isFinite(a.longitude)).toBe(true);
      expect(Number.isFinite(a.latitude)).toBe(true);
    }
  });

  it('every chapter media view carries caption, temporal label and credit; none is historical evidence', () => {
    for (const ch of view.chapters) {
      for (const m of ch.media) {
        expect(m.caption.length).toBeGreaterThan(0);
        expect(m.temporalLabel.length).toBeGreaterThan(0);
        expect(m.credit.length).toBeGreaterThan(0);
        expect(m.role).not.toBe('direct_historical_evidence');
      }
    }
  });

  it('evidence is plain-language: statements + human epistemic label + source title/locator, no raw enums or IDs', () => {
    const serialized = JSON.stringify(view.chapters.map((c) => c.evidence));
    expect(serialized).not.toContain('well_supported');
    expect(serialized).not.toContain('nl-cit-');
    const ch1ev = view.chapters[0]!.evidence;
    expect(ch1ev.length).toBe(5);
    expect(ch1ev[0]!.epistemicLabel).toBe('Well Supported');
    expect(ch1ev[0]!.sources[0]!.title.length).toBeGreaterThan(0);
    expect(ch1ev[0]!.sources[0]!.locator).toMatch(/:/);
  });

  it('the research gaps read as an honest frontier, not a failure message', () => {
    const titles = view.researchGaps.map((g) => g.title);
    expect(titles.some((t) => /why eindhoven/i.test(t))).toBe(true);
    expect(titles.some((t) => /deep-uv/i.test(t))).toBe(true);
    expect(titles.some((t) => /ipo/i.test(t))).toBe(true);
    for (const g of view.researchGaps) expect(g.question.length).toBeGreaterThan(20);
  });
});
