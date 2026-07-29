/**
 * Media evidence contract (Public Atlas V2, Stage 2). Schemas, build-blocking
 * M-series validation (rights, roles, references), and public-render selectors.
 * The production pack is validated against the real corpus; negative cases use
 * crafted packs. No image pixels are tested.
 */

import { describe, expect, it } from 'vitest';

import {
  MediaAssetSchema,
  MediaLinkSchema,
  MediaRightsSchema,
  caseCover,
  evidenceContextImage,
  getCaseMedia,
  isPublicRenderable,
  publicAssets,
  validateMediaPack,
  type MediaAsset,
  type MediaLink,
} from '@/lib/media';
import { loadCorpus } from '@/lib/loadContent';
import { productionRegistry } from '@/content/index';
import { netherlandsMedia } from '@/content/media/netherlands-semiconductor-equipment.media';
import { getAtlasCases, validateAtlasRegistry } from '@/lib/atlasCases';

const loaded = loadCorpus(productionRegistry);
if (!loaded.ok) throw new Error('corpus failed to load');
const corpus = loaded.corpus;
const CASE = 'netherlands-semiconductor-equipment';

const asset = (over: Partial<MediaAsset> = {}): MediaAsset => ({
  id: 'm-x', caseId: CASE, type: 'city_photo', title: 'T', caption: 'C',
  creator: 'A', date: '2010', dateLabel: 'Photographed 2010',
  sourceUrl: 'https://commons.wikimedia.org/wiki/File:X.jpg',
  localAssetPath: '/media/x.jpg', remoteUrl: null,
  rights: { status: 'open_license', licenseName: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', rightsHolder: 'A', requiredCreditLine: 'A, CC BY-SA 4.0', permittedForPublicWebsite: true, permittedForPortfolioPresentation: true },
  attribution: 'Photo: A', historicalLimitations: 'Present-day.', altText: 'alt', width: 800, height: 600, temporalContext: 'present_day', derivative: null,
  ...over,
});
const link = (over: Partial<MediaLink> = {}): MediaLink => ({
  id: 'l-x', caseId: CASE, mediaId: 'm-x', claimIds: [], placeIds: [], role: 'present_day_context', note: null, limitations: null, ...over,
});
const ruleIds = (fs: { ruleId: string }[]) => fs.map((f) => f.ruleId);

describe('Media schemas', () => {
  it('MediaRights accepts valid, rejects empty credit', () => {
    expect(MediaRightsSchema.safeParse(asset().rights).success).toBe(true);
    expect(MediaRightsSchema.safeParse({ ...asset().rights, requiredCreditLine: '' }).success).toBe(false);
  });
  it('MediaAsset rejects a bad type, bad url, and empty alt', () => {
    expect(MediaAssetSchema.safeParse(asset()).success).toBe(true);
    expect(MediaAssetSchema.safeParse({ ...asset(), type: 'stock_photo' }).success).toBe(false);
    expect(MediaAssetSchema.safeParse({ ...asset(), sourceUrl: 'not-a-url' }).success).toBe(false);
    expect(MediaAssetSchema.safeParse({ ...asset(), altText: '' }).success).toBe(false);
  });
  it('MediaLink accepts valid, rejects bad role', () => {
    expect(MediaLinkSchema.safeParse(link()).success).toBe(true);
    expect(MediaLinkSchema.safeParse({ ...link(), role: 'evidence' }).success).toBe(false);
  });
});

describe('Media validation (M-series)', () => {
  it('the production pack is valid against the corpus', () => {
    expect(validateMediaPack(netherlandsMedia, corpus)).toEqual([]);
    expect(() => getCaseMedia(CASE)).not.toThrow();
  });

  it('rejects duplicate asset and link ids', () => {
    const a = asset(); const b = asset({ title: 'Y' });
    expect(ruleIds(validateMediaPack({ assets: [a, b], links: [] }, corpus))).toContain('M1-unique-asset-id');
    const l1 = link(); const l2 = link({ role: 'sourced_illustration' });
    expect(ruleIds(validateMediaPack({ assets: [a], links: [l1, l2] }, corpus))).toContain('M2-unique-link-id');
  });

  it('rejects unresolved case / media / claim / place references', () => {
    expect(ruleIds(validateMediaPack({ assets: [asset({ caseId: 'nope' })], links: [] }, corpus))).toContain('M3-asset-case');
    expect(ruleIds(validateMediaPack({ assets: [asset()], links: [link({ mediaId: 'nope' })] }, corpus))).toContain('M4-link-media');
    expect(ruleIds(validateMediaPack({ assets: [asset()], links: [link({ claimIds: ['nl-not-a-claim'] })] }, corpus))).toContain('M5-claim-ref');
    expect(ruleIds(validateMediaPack({ assets: [asset()], links: [link({ placeIds: ['nl-not-a-place'] })] }, corpus))).toContain('M6-place-ref');
  });

  it('blocks restricted / unknown rights from public rendering', () => {
    const restricted = asset({ id: 'm-r', rights: { ...asset().rights, status: 'restricted' } });
    const unknown = asset({ id: 'm-u', rights: { ...asset().rights, status: 'unknown' } });
    expect(ruleIds(validateMediaPack({ assets: [restricted], links: [] }, corpus))).toContain('M9-restricted-not-public');
    expect(ruleIds(validateMediaPack({ assets: [unknown], links: [] }, corpus))).toContain('M9-restricted-not-public');
    expect(isPublicRenderable(restricted)).toBe(false);
    expect(isPublicRenderable(unknown)).toBe(false);
  });

  it('requires public-website permission, dimensions and alt for rendering', () => {
    expect(isPublicRenderable(asset({ rights: { ...asset().rights, permittedForPublicWebsite: false } }))).toBe(false);
    const noDims = asset({ width: null, height: null });
    expect(isPublicRenderable(noDims)).toBe(false);
    expect(ruleIds(validateMediaPack({ assets: [noDims], links: [] }, corpus))).toContain('M15b-dimensions');
  });

  it('present-day media cannot be direct historical evidence', () => {
    const fs = validateMediaPack({ assets: [asset()], links: [link({ role: 'direct_historical_evidence', placeIds: ['nl-place-veldhoven'] })] }, corpus);
    expect(ruleIds(fs)).toEqual(expect.arrayContaining(['M11-not-historical', 'M14-modern-site']));
  });

  it('a timeless illustration must be a diagram-type asset', () => {
    const bad = asset({ id: 'm-t', type: 'city_photo', temporalContext: 'timeless_illustration' });
    expect(ruleIds(validateMediaPack({ assets: [bad], links: [] }, corpus))).toContain('M20-timeless-type');
    const ok = asset({ id: 'm-t2', type: 'diagram', temporalContext: 'timeless_illustration' });
    expect(ruleIds(validateMediaPack({ assets: [ok], links: [] }, corpus))).not.toContain('M20-timeless-type');
  });

  it('the Atlas cover and the Evidence-context image must be different assets', () => {
    const a = asset();
    const l1 = link({ id: 'l-cov', cover: true });
    const l2 = link({ id: 'l-ev', evidenceContext: true });
    expect(ruleIds(validateMediaPack({ assets: [a], links: [l1, l2] }, corpus))).toContain('M22-cover-ne-evidence');
  });

  it('decorative media cannot support a Claim', () => {
    const fs = validateMediaPack({ assets: [asset()], links: [link({ role: 'decorative', claimIds: ['nl-f-pas5500-launched-1991'] })] }, corpus);
    expect(ruleIds(fs)).toContain('M13-decorative-no-claim');
  });
});

describe('Media loader + selectors', () => {
  it('loads the production pack (4 assets, all public) for Netherlands', () => {
    const pack = getCaseMedia(CASE);
    expect(pack.assets.length).toBe(4);
    expect(publicAssets(pack).length).toBe(4);
    for (const a of publicAssets(pack)) expect(a.rights.requiredCreditLine.trim().length).toBeGreaterThan(0);
  });

  it('planned cases carry no production media (no cover, no evidence image)', () => {
    for (const slug of ['taiwan-semiconductor-manufacturing', 'france-luxury']) {
      expect(getCaseMedia(slug).assets.length).toBe(0);
      expect(caseCover(slug)).toBe(null);
      expect(evidenceContextImage(slug)).toBe(null);
    }
  });

  it('the Atlas cover is the place-first Eindhoven asset (present-day)', () => {
    const cover = caseCover(CASE);
    expect(cover).not.toBe(null);
    expect(cover!.id).toBe('nl-media-eindhoven-city-2007');
    expect(cover!.src.startsWith('/media/netherlands-semiconductor-equipment/')).toBe(true);
    expect(cover!.temporalContext).toBe('present_day');
    expect(cover!.temporalLabel).toBe('Present-day');
    expect(cover!.alt.length).toBeGreaterThan(0);
    expect(cover!.credit.length).toBeGreaterThan(0);
  });

  it('the Evidence-context image is the ASML Veldhoven asset (distinct from the cover)', () => {
    const ev = evidenceContextImage(CASE);
    expect(ev).not.toBe(null);
    expect(ev!.id).toBe('nl-media-asml-veldhoven-2008');
    expect(ev!.temporalContext).toBe('present_day');
    expect(ev!.id).not.toBe(caseCover(CASE)!.id);
  });

  it('every publicly rendered asset has a real local delivery file', async () => {
    const { existsSync } = await import('node:fs');
    const { join } = await import('node:path');
    for (const view of [caseCover(CASE), evidenceContextImage(CASE)]) {
      expect(view).not.toBe(null);
      expect(existsSync(join(process.cwd(), 'public', view!.src))).toBe(true);
    }
  });
});

describe('Existing contracts remain valid', () => {
  it('AtlasCase registry is still valid', () => {
    expect(validateAtlasRegistry(getAtlasCases())).toEqual([]);
  });
});
