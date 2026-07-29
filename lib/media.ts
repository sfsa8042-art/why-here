/**
 * lib/media.ts — the media evidence contract (Public Atlas V2, Stage 2).
 *
 * A SEPARATE content layer: MediaAssets/MediaLinks never attach to the Claim
 * union and never enter the evidence corpus. A MediaLink references Claims/Places
 * by id (validated against the corpus) but carries its own typed evidential role
 * and rights. Rights and role are load-bearing: `restricted`/`unknown` and
 * `permittedForPublicWebsite: false` media can never render publicly, present-day
 * media can never be direct historical evidence, and decorative media can never
 * support a Claim.
 *
 * `getCaseMedia()` validates the pack against the production corpus and THROWS on
 * any failure (build-blocking). Nothing is fetched or licensed at runtime — every
 * asset is a self-hosted local file whose licence was verified before download.
 */

import { z } from 'zod';
import { loadCorpus } from './loadContent.ts';
import { productionRegistry } from '../content/index.ts';
import { netherlandsMedia } from '../content/media/netherlands-semiconductor-equipment.media.ts';

/* ------------------------------------------------------------------ *
 * Schemas
 * ------------------------------------------------------------------ */

export const MediaTypeSchema = z.enum([
  'city_photo', 'facility_photo', 'historical_photo', 'product_photo',
  'archival_document', 'event_photo', 'portrait', 'diagram',
]);
export type MediaType = z.infer<typeof MediaTypeSchema>;

export const MediaRightsStatusSchema = z.enum([
  'public_domain', 'open_license', 'permission_granted', 'restricted', 'unknown',
]);
export type MediaRightsStatus = z.infer<typeof MediaRightsStatusSchema>;

export const MediaRoleSchema = z.enum([
  'direct_historical_evidence', 'sourced_illustration', 'present_day_context', 'decorative',
]);
export type MediaRole = z.infer<typeof MediaRoleSchema>;

/** Typed temporal context — authoritative for historical UI labels. */
export const MediaTemporalContextSchema = z.enum([
  'historical', 'present_day', 'timeless_illustration', 'date_unknown',
]);
export type MediaTemporalContext = z.infer<typeof MediaTemporalContextSchema>;

/** Human temporal label; no UI ever calls a timeless diagram "present-day". */
export function temporalLabel(ctx: MediaTemporalContext): string {
  switch (ctx) {
    case 'historical': return 'Historical';
    case 'present_day': return 'Present-day';
    case 'timeless_illustration': return 'Illustration';
    case 'date_unknown': return 'Date unknown';
  }
}

export const MediaRightsSchema = z.object({
  status: MediaRightsStatusSchema,
  licenseName: z.string().min(1).nullable(),
  licenseUrl: z.string().url().nullable(),
  rightsHolder: z.string().min(1).nullable(),
  requiredCreditLine: z.string().min(1),
  permittedForPublicWebsite: z.boolean(),
  permittedForPortfolioPresentation: z.boolean(),
});
export type MediaRights = z.infer<typeof MediaRightsSchema>;

export const MediaAssetSchema = z.object({
  id: z.string().min(1),
  caseId: z.string().min(1),
  type: MediaTypeSchema,
  title: z.string().min(1),
  caption: z.string().min(1),
  creator: z.string().min(1).nullable(),
  date: z.string().min(1).nullable(),      // machine-ish, e.g. '2008', '1988–1991'
  dateLabel: z.string().min(1).nullable(), // human label, e.g. 'Photographed 2008'
  sourceUrl: z.string().url(),             // the asset's own source page
  localAssetPath: z.string().min(1).nullable(),  // e.g. '/media/.../file.jpg'
  remoteUrl: z.string().url().nullable(),        // only if an approved remote copy
  rights: MediaRightsSchema,
  attribution: z.string().min(1),          // human attribution string (always rendered)
  historicalLimitations: z.string().min(1),
  altText: z.string().min(1),
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
  /** Typed temporal context — drives historical UI labels. */
  temporalContext: MediaTemporalContextSchema,
  /**
   * Set when the local file is a WEB DELIVERY DERIVATIVE (e.g. a downscaled copy)
   * rather than the untouched original. Records the transformation for provenance.
   */
  derivative: z.object({
    originalFilename: z.string().min(1),
    originalWidth: z.number().int().positive(),
    originalHeight: z.number().int().positive(),
    transform: z.string().min(1),
  }).nullable(),
});
export type MediaAsset = z.infer<typeof MediaAssetSchema>;

export const MediaLinkSchema = z.object({
  id: z.string().min(1),
  caseId: z.string().min(1),
  mediaId: z.string().min(1),
  claimIds: z.array(z.string().min(1)),
  placeIds: z.array(z.string().min(1)),
  role: MediaRoleSchema,
  note: z.string().min(1).nullable(),
  limitations: z.string().min(1).nullable(),
  /** Exactly one link per case may set this: the public Atlas-index cover. */
  cover: z.boolean().optional(),
  /** Exactly one link per case may set this: the Evidence-header context image. */
  evidenceContext: z.boolean().optional(),
});
export type MediaLink = z.infer<typeof MediaLinkSchema>;

export interface MediaPack {
  assets: MediaAsset[];
  links: MediaLink[];
}

/* ------------------------------------------------------------------ *
 * Validation — M-series (build-blocking via getCaseMedia)
 * ------------------------------------------------------------------ */

export interface MediaFailure {
  ruleId: string;
  entityId: string;
  message: string;
}

/** A rights status that could ever be shown on the public website. */
export function isPublicRightsStatus(status: MediaRightsStatus): boolean {
  return status === 'public_domain' || status === 'open_license' || status === 'permission_granted';
}

/** Whether an asset may be rendered on the public website (rights + delivery + a11y). */
export function isPublicRenderable(a: MediaAsset): boolean {
  return (
    isPublicRightsStatus(a.rights.status) &&
    a.rights.permittedForPublicWebsite === true &&
    a.localAssetPath !== null &&
    a.width !== null && a.height !== null &&
    a.altText.trim().length > 0 &&
    a.rights.requiredCreditLine.trim().length > 0
  );
}

/** Year extracted from a date string, if any (first 4-digit run). */
function yearOf(date: string | null): number | null {
  if (date === null) return null;
  const m = date.match(/\d{4}/);
  return m ? Number(m[0]) : null;
}

export function validateMediaPack(
  pack: { assets: unknown; links: unknown },
  corpus: { modules: { caseId: string; claims: { id: string }[]; places?: { id: string }[] }[] },
): MediaFailure[] {
  const failures: MediaFailure[] = [];

  const assetsParsed = z.array(MediaAssetSchema).safeParse(pack.assets);
  const linksParsed = z.array(MediaLinkSchema).safeParse(pack.links);
  if (!assetsParsed.success) {
    for (const i of assetsParsed.error.issues) failures.push({ ruleId: 'M0-asset-schema', entityId: String(i.path[0] ?? '?'), message: `${i.path.join('.')}: ${i.message}` });
  }
  if (!linksParsed.success) {
    for (const i of linksParsed.error.issues) failures.push({ ruleId: 'M0-link-schema', entityId: String(i.path[0] ?? '?'), message: `${i.path.join('.')}: ${i.message}` });
  }
  if (!assetsParsed.success || !linksParsed.success) return failures;

  const assets = assetsParsed.data;
  const links = linksParsed.data;
  const assetById = new Map(assets.map((a) => [a.id, a]));
  const caseIds = new Set(corpus.modules.map((m) => m.caseId));
  const claimsByCase = new Map(corpus.modules.map((m) => [m.caseId, new Set(m.claims.map((c) => c.id))]));
  const placesByCase = new Map(corpus.modules.map((m) => [m.caseId, new Set((m.places ?? []).map((p) => p.id))]));

  // M1/M2 — unique ids
  const seenA = new Set<string>();
  for (const a of assets) {
    if (seenA.has(a.id)) failures.push({ ruleId: 'M1-unique-asset-id', entityId: a.id, message: 'duplicate MediaAsset id' });
    seenA.add(a.id);
    // M3 — asset caseId resolves
    if (!caseIds.has(a.caseId)) failures.push({ ruleId: 'M3-asset-case', entityId: a.id, message: `caseId "${a.caseId}" does not resolve` });
    // M7 — published asset needs a source URL (schema requires it; guard anyway)
    if (isPublicRightsStatus(a.rights.status) && a.sourceUrl.trim() === '') failures.push({ ruleId: 'M7-source-url', entityId: a.id, message: 'published asset needs a source URL' });
    // M8 — visible/accessible credit line
    if (a.rights.requiredCreditLine.trim() === '' || a.attribution.trim() === '') failures.push({ ruleId: 'M8-credit', entityId: a.id, message: 'asset needs a credit line + attribution' });
    // M19 — delivery: a local file or an approved remote URL is required
    if (a.localAssetPath === null && a.remoteUrl === null) failures.push({ ruleId: 'M19-delivery', entityId: a.id, message: 'asset needs a localAssetPath or an approved remoteUrl' });
    // M9/M10 — restricted/unknown or not-permitted cannot be marked public-renderable
    if ((a.rights.status === 'restricted' || a.rights.status === 'unknown') && a.rights.permittedForPublicWebsite) {
      failures.push({ ruleId: 'M9-restricted-not-public', entityId: a.id, message: `${a.rights.status} media cannot be permittedForPublicWebsite` });
    }
    // M15 — public-renderable asset needs dimensions + alt text
    if (a.rights.permittedForPublicWebsite && isPublicRightsStatus(a.rights.status)) {
      if (a.localAssetPath === null) failures.push({ ruleId: 'M15a-local', entityId: a.id, message: 'public asset needs a localAssetPath' });
      if (a.width === null || a.height === null) failures.push({ ruleId: 'M15b-dimensions', entityId: a.id, message: 'public asset needs width + height' });
      if (a.altText.trim() === '') failures.push({ ruleId: 'M15c-alt', entityId: a.id, message: 'public asset needs alt text' });
    }
    // M20 — a timeless_illustration must use a diagram/illustration-compatible type
    if (a.temporalContext === 'timeless_illustration' && a.type !== 'diagram') {
      failures.push({ ruleId: 'M20-timeless-type', entityId: a.id, message: "temporalContext 'timeless_illustration' requires a diagram-type asset" });
    }
  }

  // ML — links
  const seenL = new Set<string>();
  let coverCount = 0;
  let evidenceCount = 0;
  let coverAssetId: string | null = null;
  let evidenceAssetId: string | null = null;
  for (const l of links) {
    if (seenL.has(l.id)) failures.push({ ruleId: 'M2-unique-link-id', entityId: l.id, message: 'duplicate MediaLink id' });
    seenL.add(l.id);
    if (!caseIds.has(l.caseId)) failures.push({ ruleId: 'M4-link-case', entityId: l.id, message: `caseId "${l.caseId}" does not resolve` });
    const asset = assetById.get(l.mediaId);
    if (!asset) { failures.push({ ruleId: 'M4-link-media', entityId: l.id, message: `mediaId "${l.mediaId}" does not resolve` }); continue; }
    // M5 — claim references resolve in-case
    const claims = claimsByCase.get(l.caseId) ?? new Set<string>();
    for (const cid of l.claimIds) if (!claims.has(cid)) failures.push({ ruleId: 'M5-claim-ref', entityId: l.id, message: `claimId "${cid}" not in case ${l.caseId}` });
    // M6 — place references resolve in-case
    const places = placesByCase.get(l.caseId) ?? new Set<string>();
    for (const pid of l.placeIds) if (!places.has(pid)) failures.push({ ruleId: 'M6-place-ref', entityId: l.id, message: `placeId "${pid}" not in case ${l.caseId}` });

    // M11 — direct_historical_evidence requires a HISTORICAL, dated source
    if (l.role === 'direct_historical_evidence') {
      if (asset.temporalContext !== 'historical') failures.push({ ruleId: 'M11-not-historical', entityId: l.id, message: `direct_historical_evidence requires temporalContext 'historical' (got '${asset.temporalContext}')` });
      if (asset.date === null || yearOf(asset.date) === null) failures.push({ ruleId: 'M11-needs-date', entityId: l.id, message: 'direct_historical_evidence needs a historical date' });
      // M14 — a present-day site linked to a Place cannot be evidence of an earlier event
      if (asset.temporalContext === 'present_day' && l.placeIds.length > 0) failures.push({ ruleId: 'M14-modern-site', entityId: l.id, message: 'a present-day site image cannot evidence an earlier event at that place' });
    }
    // M12 — present-day photography cannot be labelled historical evidence (redundant guard)
    if (asset.temporalContext === 'present_day' && l.role === 'direct_historical_evidence') {
      failures.push({ ruleId: 'M12-present-day-label', entityId: l.id, message: 'present-day asset labelled as historical evidence' });
    }
    // M13 — decorative media cannot support a Claim
    if (l.role === 'decorative' && l.claimIds.length > 0) {
      failures.push({ ruleId: 'M13-decorative-no-claim', entityId: l.id, message: 'decorative media cannot be linked to a Claim' });
    }
    // M16 — cover must be public-renderable + non-decorative
    if (l.cover === true) {
      coverCount += 1;
      coverAssetId = asset.id;
      if (!isPublicRenderable(asset)) failures.push({ ruleId: 'M16-cover-renderable', entityId: l.id, message: 'cover asset is not public-renderable' });
      if (l.role === 'decorative') failures.push({ ruleId: 'M16-cover-role', entityId: l.id, message: 'cover cannot be decorative' });
    }
    // M21 — evidence-context image must be public-renderable + non-decorative
    if (l.evidenceContext === true) {
      evidenceCount += 1;
      evidenceAssetId = asset.id;
      if (!isPublicRenderable(asset)) failures.push({ ruleId: 'M21-evidence-renderable', entityId: l.id, message: 'evidence-context asset is not public-renderable' });
      if (l.role === 'decorative') failures.push({ ruleId: 'M21-evidence-role', entityId: l.id, message: 'evidence-context image cannot be decorative' });
    }
  }
  if (coverCount > 1) failures.push({ ruleId: 'M18-single-cover', entityId: '(pack)', message: `expected ≤1 cover, found ${coverCount}` });
  if (evidenceCount > 1) failures.push({ ruleId: 'M18b-single-evidence', entityId: '(pack)', message: `expected ≤1 evidence-context image, found ${evidenceCount}` });
  // M22 — the Atlas cover and the Evidence-context image must be DIFFERENT assets
  if (coverAssetId !== null && evidenceAssetId !== null && coverAssetId === evidenceAssetId) {
    failures.push({ ruleId: 'M22-cover-ne-evidence', entityId: coverAssetId, message: 'the Atlas cover and the Evidence-context image must be different assets' });
  }

  return failures;
}

/* ------------------------------------------------------------------ *
 * Loader (build-blocking) + selectors
 * ------------------------------------------------------------------ */

const CASE_PACKS: Record<string, MediaPack> = {
  'netherlands-semiconductor-equipment': netherlandsMedia,
};

let validated = false;

function ensureValidated(): void {
  if (validated) return;
  const loaded = loadCorpus(productionRegistry);
  if (!loaded.ok) throw new Error('media validation: production corpus failed to load');
  const failures: MediaFailure[] = [];
  for (const pack of Object.values(CASE_PACKS)) {
    failures.push(...validateMediaPack(pack, loaded.corpus));
  }
  if (failures.length > 0) {
    const detail = failures.map((f) => `  ${f.ruleId} [${f.entityId}]: ${f.message}`).join('\n');
    throw new Error(`Media pack invalid (${failures.length} failure(s)):\n${detail}`);
  }
  validated = true;
}

export function getCaseMedia(caseId: string): MediaPack {
  ensureValidated();
  return CASE_PACKS[caseId] ?? { assets: [], links: [] };
}

/** All rights-cleared, public-renderable assets for a case. */
export function publicAssets(pack: MediaPack): MediaAsset[] {
  return pack.assets.filter(isPublicRenderable);
}

/** A serializable view of a designated media surface (or null) — for public UI. */
export interface CoverView {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  credit: string;
  type: MediaType;
  temporalContext: MediaTemporalContext;
  /** Human temporal label derived from temporalContext (never "present-day" for a diagram). */
  temporalLabel: string;
  sourceUrl: string;
  licenseName: string | null;
  licenseUrl: string | null;
}

function toCoverView(a: MediaAsset | undefined): CoverView | null {
  if (!a || !isPublicRenderable(a) || a.localAssetPath === null || a.width === null || a.height === null) return null;
  return {
    id: a.id,
    src: a.localAssetPath,
    alt: a.altText,
    width: a.width,
    height: a.height,
    caption: a.caption,
    credit: a.rights.requiredCreditLine,
    type: a.type,
    temporalContext: a.temporalContext,
    temporalLabel: temporalLabel(a.temporalContext),
    sourceUrl: a.sourceUrl,
    licenseName: a.rights.licenseName,
    licenseUrl: a.rights.licenseUrl,
  };
}

/** The public Atlas-index cover image for a case (place-first), or null. */
export function caseCover(caseId: string): CoverView | null {
  const pack = getCaseMedia(caseId);
  const link = pack.links.find((l) => l.cover === true && l.caseId === caseId);
  if (!link) return null;
  return toCoverView(pack.assets.find((x) => x.id === link.mediaId));
}

/** The Evidence-header context image for a case (distinct from the cover), or null. */
export function evidenceContextImage(caseId: string): CoverView | null {
  const pack = getCaseMedia(caseId);
  const link = pack.links.find((l) => l.evidenceContext === true && l.caseId === caseId);
  if (!link) return null;
  return toCoverView(pack.assets.find((x) => x.id === link.mediaId));
}
