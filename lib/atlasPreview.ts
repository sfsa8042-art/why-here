/**
 * lib/atlasPreview.ts — the Atlas story-preview content layer (Public Atlas V2, Stage 7.1).
 *
 * The Atlas index preview beats are LINKED to production NarrativeChapters by id,
 * not duplicated. A preview stores ordered `chapterId`s (with an optional compact
 * `displayTitle`); beat titles otherwise resolve LIVE from the production chapter
 * registry, so renaming a chapter can never leave a stale title in the Atlas route.
 *
 * `getAtlasPreviews()` validates and THROWS on any failure (build-blocking):
 *   P1 — every beat chapterId resolves in the SAME case (never another case);
 *   P2 — no beat points at a `needs_research` chapter;
 *   P3 — beats follow the chapters' intended order.
 * The concise setup line is curated public copy, kept in this typed content layer.
 */

import { z } from 'zod';
import { getCaseChapters } from './chapters.ts';
import { atlasPreviews as rawAtlasPreviews } from '../content/atlas/previews.ts';

export const AtlasPreviewBeatSchema = z.object({
  chapterId: z.string().min(1),
  /** Optional compact display title, explicitly linked to the chapter id. */
  displayTitle: z.string().min(1).optional(),
});
export const AtlasPreviewSchema = z.object({
  slug: z.string().min(1),
  setupLine: z.string().min(1),
  beats: z.array(AtlasPreviewBeatSchema).min(1),
  /** Optional one-line compact summary for narrow viewports. */
  compactSummary: z.string().min(1).optional(),
});
export type AtlasPreview = z.infer<typeof AtlasPreviewSchema>;

export interface AtlasPreviewFailure { ruleId: string; slug: string; message: string; }

export function validateAtlasPreviews(input: unknown): AtlasPreviewFailure[] {
  const failures: AtlasPreviewFailure[] = [];
  const parsed = z.array(AtlasPreviewSchema).safeParse(input);
  if (!parsed.success) {
    for (const i of parsed.error.issues) failures.push({ ruleId: 'P0-schema', slug: String(i.path[0] ?? '?'), message: `${i.path.join('.')}: ${i.message}` });
    return failures;
  }
  const previews = parsed.data;
  const seen = new Set<string>();
  for (const p of previews) {
    if (seen.has(p.slug)) failures.push({ ruleId: 'P0-unique-slug', slug: p.slug, message: `duplicate preview for "${p.slug}"` });
    seen.add(p.slug);

    const pack = getCaseChapters(p.slug); // validates the chapter pack; throws if malformed
    const byId = new Map(pack.chapters.map((c) => [c.id, c]));
    let prevOrder = -Infinity;
    for (const beat of p.beats) {
      const ch = byId.get(beat.chapterId);
      // P1 — chapterId must resolve in THIS case (a foreign or missing id fails)
      if (ch === undefined) {
        failures.push({ ruleId: 'P1-chapter-ref', slug: p.slug, message: `beat chapterId "${beat.chapterId}" does not resolve in case "${p.slug}"` });
        continue;
      }
      // P2 — never surface a needs_research chapter as a public story beat
      if (ch.supportStatus === 'needs_research') {
        failures.push({ ruleId: 'P2-needs-research', slug: p.slug, message: `beat "${beat.chapterId}" is a needs_research chapter` });
      }
      // P3 — beat order must follow the chapters' intended order
      if (ch.order <= prevOrder) {
        failures.push({ ruleId: 'P3-order', slug: p.slug, message: `beat "${beat.chapterId}" is out of chapter order` });
      }
      prevOrder = ch.order;
    }
  }
  return failures;
}

/* ------------------------------------------------------------------ *
 * Loader (build-blocking) + view builder
 * ------------------------------------------------------------------ */

let cached: AtlasPreview[] | null = null;

export function getAtlasPreviews(): AtlasPreview[] {
  if (cached !== null) return cached;
  const failures = validateAtlasPreviews(rawAtlasPreviews);
  if (failures.length > 0) {
    const detail = failures.map((f) => `  ${f.ruleId} [${f.slug}]: ${f.message}`).join('\n');
    throw new Error(`Atlas preview content invalid (${failures.length} failure(s)):\n${detail}`);
  }
  cached = z.array(AtlasPreviewSchema).parse(rawAtlasPreviews);
  return cached;
}

export function getAtlasPreview(slug: string): AtlasPreview | null {
  return getAtlasPreviews().find((p) => p.slug === slug) ?? null;
}

/** Presentation view: setup line + beat titles resolved from production chapters. */
export interface AtlasPreviewView { setupLine: string; beats: string[]; compactSummary?: string }

export function buildAtlasPreview(slug: string): AtlasPreviewView | null {
  const preview = getAtlasPreview(slug);
  if (preview === null) return null;
  const byId = new Map(getCaseChapters(slug).chapters.map((c) => [c.id, c]));
  const beats = preview.beats.map((b) => b.displayTitle ?? byId.get(b.chapterId)?.title ?? b.chapterId);
  const view: AtlasPreviewView = { setupLine: preview.setupLine, beats };
  if (preview.compactSummary !== undefined) view.compactSummary = preview.compactSummary;
  return view;
}
