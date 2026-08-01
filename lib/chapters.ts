/**
 * lib/chapters.ts — the NarrativeChapter contract (Public Atlas V2, Stage 3).
 *
 * A SEPARATE content layer: chapter ids never attach to the Claim union. A
 * chapter references Claims/Places/Media by id (validated against the corpus and
 * media pack) and carries its own support status + editorial-review flags. Media
 * temporal context and media evidence role stay separate dimensions; the UI never
 * presents present-day/timeless media as direct historical evidence.
 *
 * `getCaseChapters()` validates the pack against the corpus + media and THROWS on
 * any failure (build-blocking).
 */

import { z } from 'zod';
import { loadCorpus } from './loadContent.ts';
import { productionRegistry } from '../content/index.ts';
import { getCaseMedia, mediaViewById, type MediaItemView, type MediaLink, type MediaRole } from './media.ts';
import { buildNetherlandsResearchView } from './researchViewModel.ts';
import { netherlandsChapters } from '../content/chapters/netherlands-semiconductor-equipment.chapters.ts';

/* ------------------------------------------------------------------ *
 * Schema
 * ------------------------------------------------------------------ */

export const ChapterSupportSchema = z.enum(['supported', 'partially_supported', 'needs_research']);
export type ChapterSupport = z.infer<typeof ChapterSupportSchema>;

/**
 * Explicit editorial sign-off for rules that CANNOT be checked automatically.
 * `ceilingReviewNote` is a required, human-written justification for why a
 * chapter's prose stays within the epistemic ceiling of its linked Claims. The
 * build gate only checks that the note is present and non-empty — it makes NO
 * claim to understand historical causality itself (see the lexical-safety lint).
 */
export const ChapterEditorialSchema = z.object({
  proseTraceableToClaims: z.boolean(),
  causalWithinEpistemicCeiling: z.boolean(),
  mediaImpliesNoUnsupportedEvent: z.boolean(),
  ceilingReviewNote: z.string().min(1),
});

export const NarrativeChapterSchema = z.object({
  id: z.string().min(1),
  caseId: z.string().min(1),
  order: z.number().int().nonnegative(),
  title: z.string().min(1),
  periodLabel: z.string().min(1).nullable(),
  whatHappened: z.string().min(1),
  whyItMatters: z.string().min(1),
  /* Public-facing contribution-to-question boundaries (required, plain language). */
  whatThisExplains: z.string().min(1),
  whatThisDoesNotExplain: z.string().min(1),
  claimIds: z.array(z.string().min(1)),
  placeIds: z.array(z.string().min(1)),
  mediaIds: z.array(z.string().min(1)),
  supportStatus: ChapterSupportSchema,
  limitations: z.string(),
  readingTimeMinutes: z.number().positive(),
  editorial: ChapterEditorialSchema,
});
export type NarrativeChapter = z.infer<typeof NarrativeChapterSchema>;

/** ≤4 reader-facing themes the eight research gaps are grouped under. */
export const ResearchGapThemeSchema = z.enum([
  'regional_ecosystem', 'technology_transfer', 'markets_and_competition', 'commercial_transition',
]);
export type ResearchGapTheme = z.infer<typeof ResearchGapThemeSchema>;

export const ResearchGapSchema = z.object({
  title: z.string().min(1),
  question: z.string().min(1),
  theme: ResearchGapThemeSchema,
});
export interface ResearchGap { title: string; question: string; theme: ResearchGapTheme; }
export interface ChapterPack { chapters: NarrativeChapter[]; researchGaps: ResearchGap[]; }

/** Ordered human titles for the gap themes (the story never shows the enum). */
export const RESEARCH_THEME_ORDER: { theme: ResearchGapTheme; title: string }[] = [
  { theme: 'regional_ecosystem', title: 'Regional ecosystem' },
  { theme: 'technology_transfer', title: 'Technology transfer' },
  { theme: 'markets_and_competition', title: 'Markets and competition' },
  { theme: 'commercial_transition', title: 'Commercial transition' },
];

/* ------------------------------------------------------------------ *
 * Validation — C-series (build-blocking via getCaseChapters)
 * ------------------------------------------------------------------ */

export interface ChapterFailure { ruleId: string; entityId: string; message: string; }

/** Conclusion-like verbs a `needs_research` chapter may not use (C5). */
const CONCLUSION_TERMS = /\b(caused|because|led to|ensured|proved|proves|guaranteed|resulted in|therefore|demonstrates that)\b/i;

/**
 * LEXICAL SAFETY LINT (C7b) — a supplementary, string-matching guard, NOT
 * semantic proof that a chapter's causal prose is valid.
 *
 * It only catches specific unsupported phrasings the dossier flags in advance
 * (DEEP-UV→PAS5500, "ensured survival", participant-worked-at-address, any claim
 * to "answer why Eindhoven"). It cannot understand meaning, cannot detect a
 * paraphrase it does not list, and never certifies prose as sound. The actual
 * epistemic-ceiling judgement is a human one, recorded per chapter in
 * `editorial.ceilingReviewNote` (checked non-empty by C7c). Treat a clean lint
 * pass as "no known bad phrasing present", not as "causally correct".
 */
const LEXICAL_SAFETY_LINT: { re: RegExp; why: string }[] = [
  { re: /deep-?uv\s+(caused|led to|produced|created)\b/i, why: 'implies DEEP-UV caused the PAS 5500' },
  { re: /caused\s+(the\s+)?pas\s?5500/i, why: 'implies DEEP-UV caused the PAS 5500' },
  { re: /ensured\s+(the\s+)?(company'?s?\s+)?(commercial\s+)?(survival|success)/i, why: 'implies DEEP-UV ensured survival' },
  { re: /guaranteed\s+(survival|success|commercial)/i, why: 'implies a guaranteed outcome' },
  { re: /every\s+participant\s+worked\s+at/i, why: 'implies each participant worked at its postal address' },
  { re: /(explains|answers|the reason|this is)\s+why\s+eindhoven/i, why: 'claims to answer the unresolved "why Eindhoven" question' },
];

/**
 * A MediaLink is "context-only" when it asserts no Claims — it illustrates or
 * sets context but does not stand behind a specific factual claim.
 */
function isContextOnlyLink(link: MediaLink): boolean {
  return link.claimIds.length === 0;
}

/**
 * Deterministically choose the ONE MediaLink that governs how an asset is
 * presented in a chapter. Never silently picks an arbitrary role: if two
 * candidate links carry DIFFERENT roles the choice is ambiguous and the caller
 * must fail the build (C15) rather than guess. Decorative links are excluded
 * from the candidate pool where a non-decorative link exists.
 */
export function selectChapterMediaLink(
  caseId: string,
  mediaId: string,
): { link: MediaLink | null; ambiguous: boolean } {
  const pack = getCaseMedia(caseId);
  const links = pack.links.filter((l) => l.mediaId === mediaId && l.caseId === caseId);
  if (links.length === 0) return { link: null, ambiguous: false };
  const nonDecorative = links.filter((l) => l.role !== 'decorative');
  const pool = nonDecorative.length > 0 ? nonDecorative : links;
  const roles = new Set<MediaRole>(pool.map((l) => l.role));
  const sorted = [...pool].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return { link: sorted[0] ?? null, ambiguous: roles.size > 1 };
}

export function validateChapters(
  pack: { chapters: unknown; researchGaps: unknown },
  corpus: { modules: { caseId: string; claims: { id: string; epistemicStatus: string }[]; places?: { id: string }[] }[] },
): ChapterFailure[] {
  const failures: ChapterFailure[] = [];

  const parsed = z.array(NarrativeChapterSchema).safeParse(pack.chapters);
  const gapsParsed = z.array(ResearchGapSchema).safeParse(pack.researchGaps);
  if (!parsed.success) {
    for (const i of parsed.error.issues) failures.push({ ruleId: 'C0-schema', entityId: String(i.path[0] ?? '?'), message: `${i.path.join('.')}: ${i.message}` });
  }
  if (!gapsParsed.success) failures.push({ ruleId: 'C0-gaps-schema', entityId: '(gaps)', message: 'researchGaps malformed' });
  if (!parsed.success) return failures;

  const chapters = parsed.data;
  const claimsByCase = new Map(corpus.modules.map((m) => [m.caseId, new Map(m.claims.map((c) => [c.id, c.epistemicStatus]))]));
  const placesByCase = new Map(corpus.modules.map((m) => [m.caseId, new Set((m.places ?? []).map((p) => p.id))]));

  const seenId = new Set<string>();
  const seenOrder = new Map<string, Set<number>>();
  for (const ch of chapters) {
    // C1 — unique id + order in-case
    if (seenId.has(ch.id)) failures.push({ ruleId: 'C1-unique-id', entityId: ch.id, message: 'duplicate chapter id' });
    seenId.add(ch.id);
    const orders = seenOrder.get(ch.caseId) ?? new Set<number>();
    if (orders.has(ch.order)) failures.push({ ruleId: 'C1-unique-order', entityId: ch.id, message: `duplicate order ${ch.order} in case` });
    orders.add(ch.order); seenOrder.set(ch.caseId, orders);

    const claims = claimsByCase.get(ch.caseId) ?? new Map<string, string>();
    const places = placesByCase.get(ch.caseId) ?? new Set<string>();
    const media = getCaseMedia(ch.caseId);
    const mediaIds = new Set(media.assets.map((a) => a.id));

    // C2 — references resolve in-case
    for (const cid of ch.claimIds) if (!claims.has(cid)) failures.push({ ruleId: 'C2-claim-ref', entityId: ch.id, message: `claimId "${cid}" not in case` });
    for (const pid of ch.placeIds) if (!places.has(pid)) failures.push({ ruleId: 'C2-place-ref', entityId: ch.id, message: `placeId "${pid}" not in case` });
    for (const mid of ch.mediaIds) if (!mediaIds.has(mid)) failures.push({ ruleId: 'C2-media-ref', entityId: ch.id, message: `mediaId "${mid}" not in case` });

    // C3 — supported requires ≥1 production Claim
    if (ch.supportStatus === 'supported' && ch.claimIds.length === 0) failures.push({ ruleId: 'C3-supported-needs-claim', entityId: ch.id, message: 'supported chapter needs ≥1 claim' });
    // C4 — partially_supported requires a visible evidence-boundary
    if (ch.supportStatus === 'partially_supported' && ch.limitations.trim() === '') failures.push({ ruleId: 'C4-partial-needs-limits', entityId: ch.id, message: 'partially_supported chapter needs a limitations note' });
    // C5 — needs_research may not use conclusion-like language
    if (ch.supportStatus === 'needs_research' && (CONCLUSION_TERMS.test(ch.whatHappened) || CONCLUSION_TERMS.test(ch.whyItMatters))) failures.push({ ruleId: 'C5-needs-research-language', entityId: ch.id, message: 'needs_research chapter uses conclusion-like language' });
    // C6 — public prose traceable to Claims (editorial flag for supported/partial)
    if (ch.supportStatus !== 'needs_research' && !ch.editorial.proseTraceableToClaims) failures.push({ ruleId: 'C6-prose-traceable', entityId: ch.id, message: 'editorial: prose must be marked traceable to claims' });
    // C7 — causal prose within epistemic ceiling (human editorial flag)
    if (!ch.editorial.causalWithinEpistemicCeiling) failures.push({ ruleId: 'C7-causal-ceiling', entityId: ch.id, message: 'editorial: causal prose must be marked within the epistemic ceiling' });
    // C7b — LEXICAL SAFETY LINT over the AFFIRMATIVE narrative only. Not run over
    // whatThisDoesNotExplain, which quotes forbidden claims precisely to deny them.
    // A clean pass means "no known bad phrasing", never "causally correct".
    for (const f of LEXICAL_SAFETY_LINT) {
      if (f.re.test(ch.whatHappened) || f.re.test(ch.whyItMatters)) failures.push({ ruleId: 'C7b-lexical-safety-lint', entityId: ch.id, message: `lexical-safety lint: prose ${f.why}` });
    }
    // C7c — a non-empty human note must justify the epistemic ceiling. The gate
    // only checks presence; it does NOT evaluate historical causality itself.
    if (ch.editorial.ceilingReviewNote.trim() === '') failures.push({ ruleId: 'C7c-ceiling-note', entityId: ch.id, message: 'editorial: ceilingReviewNote must be a non-empty justification' });

    // C12 — media-implies-no-unsupported-event editorial flag
    if (!ch.editorial.mediaImpliesNoUnsupportedEvent) failures.push({ ruleId: 'C12-media-event', entityId: ch.id, message: 'editorial: media must not imply an unsupported event' });
    for (const mid of ch.mediaIds) {
      if (!mediaIds.has(mid)) continue; // missing asset already reported by C2
      // C14 — the asset must resolve through at least one in-case MediaLink
      const { link, ambiguous } = selectChapterMediaLink(ch.caseId, mid);
      if (link === null) {
        failures.push({ ruleId: 'C14-media-link-missing', entityId: ch.id, message: `media "${mid}" has no MediaLink in this case` });
        continue;
      }
      // C15 — the governing role must be unambiguous; never silently pick one
      if (ambiguous) failures.push({ ruleId: 'C15-media-link-ambiguous', entityId: ch.id, message: `media "${mid}" resolves to links with differing roles; an explicit link choice is required` });
      // C9 — decorative media cannot support chapter prose
      if (link.role === 'decorative') failures.push({ ruleId: 'C9-decorative', entityId: ch.id, message: `decorative media "${mid}" cannot support chapter prose` });
      // C16 — a link that asserts Claims must assert only Claims this chapter uses;
      // otherwise the media must be context-only (a link that asserts no Claims).
      if (!isContextOnlyLink(link)) {
        const chapterClaims = new Set(ch.claimIds);
        const incompatible = link.claimIds.filter((c) => !chapterClaims.has(c));
        if (incompatible.length > 0) failures.push({ ruleId: 'C16-media-claim-compat', entityId: ch.id, message: `media "${mid}" link asserts claim(s) outside this chapter: ${incompatible.join(', ')}` });
      }
      // Asset-derived label checks (temporal context/label come from the ASSET,
      // evidential role from the LINK — never inferred from the chapter prose).
      const mv = mediaViewById(ch.caseId, mid);
      if (!mv) continue;
      // C10 — every rendered image retains caption, temporal label and credit
      if (mv.caption.trim() === '' || mv.temporalLabel.trim() === '' || mv.credit.trim() === '') failures.push({ ruleId: 'C10-media-labels', entityId: ch.id, message: `media "${mid}" missing caption/temporal/credit` });
      // C8 — a present-day/timeless asset must not be linked as historical evidence
      if ((mv.temporalContext === 'present_day' || mv.temporalContext === 'timeless_illustration') && link.role === 'direct_historical_evidence') failures.push({ ruleId: 'C8-present-day-evidence', entityId: ch.id, message: `media "${mid}" is ${mv.temporalContext} but linked as historical evidence` });
    }
    // C11 — limitations cannot be empty when media is contextual (present-day/timeless) rather than historical
    const hasContextualMedia = ch.mediaIds.some((mid) => {
      const mv = mediaViewById(ch.caseId, mid);
      return mv !== null && (mv.temporalContext === 'present_day' || mv.temporalContext === 'timeless_illustration');
    });
    if (hasContextualMedia && ch.limitations.trim() === '') failures.push({ ruleId: 'C11-contextual-media-limits', entityId: ch.id, message: 'chapter with contextual media needs a limitations note' });
  }

  return failures;
}

/* ------------------------------------------------------------------ *
 * Loader (build-blocking)
 * ------------------------------------------------------------------ */

const CASE_CHAPTERS: Record<string, ChapterPack> = {
  'netherlands-semiconductor-equipment': netherlandsChapters,
};
let validated = false;

function ensureValidated(): void {
  if (validated) return;
  const loaded = loadCorpus(productionRegistry);
  if (!loaded.ok) throw new Error('chapters: production corpus failed to load');
  const failures: ChapterFailure[] = [];
  for (const pack of Object.values(CASE_CHAPTERS)) failures.push(...validateChapters(pack, loaded.corpus));
  if (failures.length > 0) {
    throw new Error(`Chapter pack invalid (${failures.length} failure(s)):\n` + failures.map((f) => `  ${f.ruleId} [${f.entityId}]: ${f.message}`).join('\n'));
  }
  validated = true;
}

export function getCaseChapters(caseId: string): ChapterPack {
  ensureValidated();
  return CASE_CHAPTERS[caseId] ?? { chapters: [], researchGaps: [] };
}

/* ------------------------------------------------------------------ *
 * View-model (serializable, ordinary-user)
 * ------------------------------------------------------------------ */

export interface ChapterClaimSource { title: string; locator: string; kind: string; }
export interface ChapterClaimView {
  id: string;
  statement: string;
  epistemicLabel: string;
  sources: ChapterClaimSource[];
  /** One concise, material limitation for this finding, or null. */
  limitation: string | null;
}
export interface ChapterMapAnchor { placeId: string; name: string; longitude: number; latitude: number; }
/** A consortium organisation for the Chapter-3 network visual (presentational). */
export interface ChapterNetworkOrg { name: string; role: 'coordinator' | 'participant'; placeName: string | null; }
export interface ChapterView {
  id: string;
  order: number;
  title: string;
  periodLabel: string | null;
  whatHappened: string;
  whyItMatters: string;
  whatThisExplains: string;
  whatThisDoesNotExplain: string;
  supportStatus: ChapterSupport;
  supportLabel: string;
  limitations: string;
  readingTimeMinutes: number;
  media: MediaItemView[];
  anchors: ChapterMapAnchor[];
  evidence: ChapterClaimView[];
  /** Plain-language evidence header, e.g. "5 documented findings · 2 sources". */
  evidenceSummary: { findingCount: number; sourceCount: number };
  /** Consortium nodes for the Chapter-3 network visual (empty for other chapters). */
  networkOrgs: ChapterNetworkOrg[];
}
export interface ResearchTheme { theme: ResearchGapTheme; title: string; gaps: ResearchGap[]; }
export interface ChaptersView {
  caseId: string;
  chapters: ChapterView[];
  researchGaps: ResearchGap[];
  /** The gaps grouped under ≤4 reader-facing themes (ordered, empty themes dropped). */
  researchThemes: ResearchTheme[];
}

function humanize(s: string): string { return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()); }
const SUPPORT_LABEL: Record<ChapterSupport, string> = {
  supported: 'Supported by evidence',
  partially_supported: 'Partially supported',
  needs_research: 'Needs research',
};

/**
 * Plain-language "kind" for a source, derived from its typed relationship — the
 * story never shows raw sourceType/subjectRelationship enums.
 */
function sourceKindLabel(sourceType: string, subjectRelationship: string): string {
  if (subjectRelationship === 'independent' && sourceType === 'documentary') return 'European project record';
  if (subjectRelationship === 'subject_authored') return 'Primary company record';
  return 'Retrospective institutional history';
}

/**
 * The DEEP-UV consortium as a presentational node list for the Chapter-3 network
 * visual. Every name is a substring of the production participants Claim
 * (nl-f-deepuv-participants); `placeName` is non-null ONLY for the two
 * organisations backed by a production Place — no geography is invented for the
 * foreign participants, which stay a non-geographic list.
 */
const DEEPUV_CONSORTIUM: ChapterNetworkOrg[] = [
  { name: 'ASM Lithography', role: 'coordinator', placeName: 'Veldhoven' },
  { name: 'Nederlandse Philips Bedrijven', role: 'participant', placeName: 'Eindhoven' },
  { name: 'Carl Zeiss', role: 'participant', placeName: null },
  { name: 'Siemens', role: 'participant', placeName: null },
  { name: 'Commissariat à l’Energie Atomique', role: 'participant', placeName: null },
  { name: 'Fraunhofer Institut', role: 'participant', placeName: null },
  { name: 'Hoechst', role: 'participant', placeName: null },
];

export function buildChaptersView(caseId: string): ChaptersView {
  const pack = getCaseChapters(caseId);
  const research = buildNetherlandsResearchView(caseId);
  const spineById = new Map(research.spine.map((c) => [c.id, c]));

  const loaded = loadCorpus(productionRegistry);
  if (!loaded.ok) throw new Error('chapters view: corpus failed to load');
  const module = loaded.corpus.modules.find((m) => m.caseId === caseId);
  const placeById = new Map((module?.places ?? []).map((p) => [p.id, p]));

  const chapters: ChapterView[] = [...pack.chapters]
    .sort((a, b) => a.order - b.order)
    .map((ch) => {
      // Media role + limitations derive from the DETERMINISTICALLY selected
      // MediaLink; temporal context/label come from the MediaAsset. Neither is
      // inferred from the chapter prose.
      const media = ch.mediaIds
        .map((mid): MediaItemView | null => {
          const mv = mediaViewById(caseId, mid);
          if (mv === null) return null;
          const { link } = selectChapterMediaLink(caseId, mid);
          return { ...mv, role: link?.role ?? mv.role, linkLimitations: link?.limitations ?? mv.linkLimitations };
        })
        .filter((m): m is MediaItemView => m !== null);
      const anchors: ChapterMapAnchor[] = ch.placeIds
        .map((pid) => placeById.get(pid))
        .filter((p): p is NonNullable<typeof p> => p !== undefined && p.geometry.type === 'point')
        .map((p) => ({ placeId: p.id, name: p.name, longitude: (p.geometry as { longitude: number }).longitude, latitude: (p.geometry as { latitude: number }).latitude }));
      const evidence: ChapterClaimView[] = ch.claimIds.map((cid) => {
        const c = spineById.get(cid);
        const limitation = c?.attributed
          ? 'The company’s own retrospective statement.'
          : c !== undefined && /project record reports/i.test(c.statement)
            ? 'Reported by the project record, not independently replicated.'
            : null;
        return {
          id: cid,
          statement: c?.statement ?? cid,
          epistemicLabel: c ? humanize(c.epistemicStatus) : '',
          sources: (c?.citations ?? []).map((ci) => ({
            title: ci.sourceTitle,
            locator: `${ci.locatorKind}: ${ci.locatorValue}`,
            kind: sourceKindLabel(ci.sourceType, ci.subjectRelationship),
          })),
          limitation,
        };
      });
      const sourceTitles = new Set(evidence.flatMap((e) => e.sources.map((s) => s.title)));
      return {
        id: ch.id, order: ch.order, title: ch.title, periodLabel: ch.periodLabel,
        whatHappened: ch.whatHappened, whyItMatters: ch.whyItMatters,
        whatThisExplains: ch.whatThisExplains, whatThisDoesNotExplain: ch.whatThisDoesNotExplain,
        supportStatus: ch.supportStatus, supportLabel: SUPPORT_LABEL[ch.supportStatus],
        limitations: ch.limitations, readingTimeMinutes: ch.readingTimeMinutes,
        media, anchors, evidence,
        evidenceSummary: { findingCount: ch.claimIds.length, sourceCount: sourceTitles.size },
        networkOrgs: ch.id === 'nl-ch-european-coordination' ? DEEPUV_CONSORTIUM : [],
      };
    });

  const researchThemes: ResearchTheme[] = RESEARCH_THEME_ORDER
    .map(({ theme, title }) => ({ theme, title, gaps: pack.researchGaps.filter((g) => g.theme === theme) }))
    .filter((t) => t.gaps.length > 0);

  return { caseId, chapters, researchGaps: pack.researchGaps, researchThemes };
}
