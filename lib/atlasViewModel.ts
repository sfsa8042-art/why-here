/**
 * lib/atlasViewModel.ts — server-derived, serializable atlas data (M1).
 *
 * Pure selector over the PRODUCTION corpus. It reuses the research view-model
 * spine (17 claims + full citations) and augments it with mappability derived
 * from the loaded Places and ClaimPlaceLinks. It builds a GeoJSON
 * FeatureCollection ONLY from validated Places that carry at least one link —
 * no hardcoded second dataset, no place-to-place lines, no site geometry.
 */

import { loadCorpus } from './loadContent.ts';
import { productionRegistry } from '../content/index.ts';
import {
  buildNetherlandsResearchView,
  type PhaseView,
  type SpineClaimView,
} from './researchViewModel.ts';
import type { ClaimPlaceLink, Place } from './schemas.ts';

export interface AtlasPlace {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
  kind: Place['kind'];
  precision: string;
}

export interface AtlasLink {
  id: string;
  claimId: string;
  placeId: string;
  relationship: ClaimPlaceLink['relationship'];
  temporalScopeLabel: string;
  evidencePrecision: string;
  locatorNote: string;
  provenanceNote: string | null;
  epistemicStatus: ClaimPlaceLink['epistemicStatus'];
}

export interface AtlasGeoFeature {
  type: 'Feature';
  geometry: { type: 'Point'; coordinates: [number, number] };
  properties: {
    placeId: string;
    name: string;
    relationship: ClaimPlaceLink['relationship'];
    linkedClaimIds: string[];
    evidencePrecision: string;
    temporalScopeLabel: string;
    /**
     * Every evidence-boundary phase any linked claim belongs to. Phases overlap
     * on year boundaries, so a claim (and thus a marker) can be in several — the
     * marker is shown whenever ANY of these matches the active phase.
     */
    phaseKeys: string[];
  };
}

export interface AtlasPhase {
  key: string;
  label: string;
  years: string;
  /** claim ids in this phase (from the evidence-boundary model). */
  claimIds: string[];
  /** how many of those claims are geographically anchored. */
  anchorCount: number;
}

export interface AtlasGeoJSON {
  type: 'FeatureCollection';
  features: AtlasGeoFeature[];
}

export interface AtlasTimelineClaim extends SpineClaimView {
  mappable: boolean;
  placeId: string | null;
  relationship: ClaimPlaceLink['relationship'] | null;
  /**
   * Every evidence-boundary phase this claim belongs to. Phases overlap on year
   * boundaries, so membership is many-to-many, not a single arbitrary label.
   */
  phaseKeys: string[];
}

export interface AtlasViewModel {
  caseId: string;
  country: string;
  industry: string;
  statusLabel: string;
  claimCount: number;
  anchorCount: number;
  unlinkedClaimCount: number;
  places: AtlasPlace[];
  links: AtlasLink[];
  geojson: AtlasGeoJSON;
  timeline: AtlasTimelineClaim[];
  phases: AtlasPhase[];
  /** Southern-Netherlands framing so both cities are comfortably visible. */
  initialView: { center: [number, number]; zoom: number; bounds: [[number, number], [number, number]] };
  basemapNote: string;
}

const CASE_ID = 'netherlands-semiconductor-equipment';

function temporalLabel(link: ClaimPlaceLink): string {
  const { year, endYear } = link.temporalScope;
  return endYear !== undefined && endYear !== year ? `${year}–${endYear}` : `${year}`;
}

export function buildNetherlandsAtlasView(caseId = CASE_ID): AtlasViewModel {
  const loaded = loadCorpus(productionRegistry);
  if (!loaded.ok) {
    throw new Error(`atlas view: production corpus failed to load — ${JSON.stringify(loaded.failures)}`);
  }
  const module = loaded.corpus.modules.find((m) => m.caseId === caseId);
  if (module === undefined) throw new Error(`atlas view: case "${caseId}" not found`);

  const research = buildNetherlandsResearchView(caseId);

  /*
   * claim -> ALL evidence-boundary phases it belongs to (reused from the
   * research view-model, which is the authority). Phases overlap on year
   * boundaries, so membership is many-to-many: a claim may appear in several
   * phases and MUST NOT be collapsed to one arbitrary (last-wins) label.
   */
  const phaseKeysByClaim = new Map<string, string[]>();
  for (const phase of research.phases) {
    for (const cid of phase.claimIds) {
      const keys = phaseKeysByClaim.get(cid) ?? [];
      keys.push(phase.key);
      phaseKeysByClaim.set(cid, keys);
    }
  }
  const phasesForClaim = (cid: string): string[] => phaseKeysByClaim.get(cid) ?? [];

  const links: AtlasLink[] = (module.claimPlaceLinks ?? []).map((l) => ({
    id: l.id,
    claimId: l.claimId,
    placeId: l.placeId,
    relationship: l.relationship,
    temporalScopeLabel: temporalLabel(l),
    evidencePrecision: l.evidencePrecision,
    locatorNote: l.locatorNote,
    provenanceNote: l.provenanceNote ?? null,
    epistemicStatus: l.epistemicStatus,
  }));

  const places: AtlasPlace[] = (module.places ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    longitude: p.geometry.type === 'point' ? p.geometry.longitude : 0,
    latitude: p.geometry.type === 'point' ? p.geometry.latitude : 0,
    kind: p.kind,
    precision: p.geometry.precision,
  }));

  /* claimId -> its (single) link, for timeline mappability */
  const linkByClaim = new Map<string, AtlasLink>();
  for (const l of links) if (!linkByClaim.has(l.claimId)) linkByClaim.set(l.claimId, l);

  /* GeoJSON: one Point feature per Place that carries at least one link. */
  const features: AtlasGeoFeature[] = [];
  for (const place of module.places ?? []) {
    if (place.geometry.type !== 'point') continue; // no admin polygons in M1
    const placeLinks = links.filter((l) => l.placeId === place.id);
    if (placeLinks.length === 0) continue; // never render an unlinked place
    const primary = placeLinks[0]!;
    /* union of every phase any linked claim belongs to (many-to-many). */
    const markerPhaseKeys = [
      ...new Set(placeLinks.flatMap((l) => phasesForClaim(l.claimId))),
    ];
    features.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [place.geometry.longitude, place.geometry.latitude] },
      properties: {
        placeId: place.id,
        name: place.name,
        relationship: primary.relationship,
        linkedClaimIds: placeLinks.map((l) => l.claimId),
        evidencePrecision: primary.evidencePrecision,
        temporalScopeLabel: primary.temporalScopeLabel,
        phaseKeys: markerPhaseKeys,
      },
    });
  }

  const timeline: AtlasTimelineClaim[] = research.spine.map((claim) => {
    const link = linkByClaim.get(claim.id);
    return {
      ...claim,
      mappable: link !== undefined,
      placeId: link?.placeId ?? null,
      relationship: link?.relationship ?? null,
      phaseKeys: phasesForClaim(claim.id),
    };
  });

  const mappableClaimIds = new Set(links.map((l) => l.claimId));
  const phases: AtlasPhase[] = research.phases.map((p: PhaseView) => ({
    key: p.key,
    label: p.label,
    years: p.years,
    claimIds: p.claimIds,
    anchorCount: p.claimIds.filter((cid) => mappableClaimIds.has(cid)).length,
  }));

  const anchorCount = features.length;
  const unlinkedClaimCount = timeline.filter((c) => !c.mappable).length;

  return {
    caseId: research.caseId,
    country: research.country,
    industry: research.industry,
    statusLabel: research.statusLabel,
    claimCount: research.claimCount,
    anchorCount,
    unlinkedClaimCount,
    places,
    links,
    geojson: { type: 'FeatureCollection', features },
    timeline,
    phases,
    initialView: {
      center: [5.44, 51.43],
      zoom: 8.4,
      bounds: [[5.2, 51.32], [5.68, 51.54]],
    },
    basemapNote: 'Marker shown at city-level precision.',
  };
}
