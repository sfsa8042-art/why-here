/**
 * M1 — atlas view-model, GeoJSON derivation, reducer, and accessible-shell
 * rendering. No real WebGL/MapLibre runs here: the map is the sole client-only
 * boundary (dynamic ssr:false), so static rendering exercises the shell without
 * it, and the fallback/timeline components are tested directly.
 */

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { buildNetherlandsAtlasView } from '@/lib/atlasViewModel';
import {
  atlasReducer,
  claimMatchesFilters,
  initialAtlasState,
  visiblePlaceIds,
  type AtlasSelectionState,
  type AtlasFilterableClaim,
} from '@/lib/atlasState';
import {
  mapIsFatal,
  mapIsMounted,
  nextMapPhase,
  type MapPhase,
} from '@/lib/mapStatus';
import { buildNetherlandsResearchView } from '@/lib/researchViewModel';
import { AtlasFallback } from '@/components/atlas/AtlasFallback';
import { AtlasTimeline } from '@/components/atlas/AtlasTimeline';
import { AtlasShell } from '@/components/atlas/AtlasShell';

const vm = buildNetherlandsAtlasView();

/* ------------------------------------------------------------------ *
 * View-model + GeoJSON
 * ------------------------------------------------------------------ */

describe('atlas view-model', () => {
  it('contains exactly 2 Places and 2 ClaimPlaceLinks', () => {
    expect(vm.places).toHaveLength(2);
    expect(vm.links).toHaveLength(2);
    expect(vm.anchorCount).toBe(2);
  });

  it('GeoJSON contains exactly Veldhoven and Eindhoven as Points', () => {
    expect(vm.geojson.type).toBe('FeatureCollection');
    expect(vm.geojson.features).toHaveLength(2);
    expect(vm.geojson.features.map((f) => f.properties.placeId).sort())
      .toEqual(['nl-place-eindhoven', 'nl-place-veldhoven']);
    for (const f of vm.geojson.features) {
      expect(f.geometry.type).toBe('Point');
      expect(f.geometry.coordinates).toHaveLength(2);
    }
  });

  it('has no site-level precision anywhere', () => {
    expect(vm.places.every((p) => p.precision === 'city')).toBe(true);
    expect(vm.links.every((l) => l.evidencePrecision === 'city')).toBe(true);
    expect(vm.geojson.features.every((f) => f.properties.evidencePrecision === 'city')).toBe(true);
  });

  it('contains no unsupported Places (only the two DEEP-UV anchors)', () => {
    expect(vm.places.map((p) => p.id).sort()).toEqual(['nl-place-eindhoven', 'nl-place-veldhoven']);
    for (const p of vm.places) {
      expect(p.name).not.toMatch(/amsterdam|netherlands|philips|asml headquarters/i);
    }
  });

  it('has no place-to-place line feature (Points only, never a LineString)', () => {
    const geometryTypes = new Set(vm.geojson.features.map((f) => f.geometry.type));
    expect([...geometryTypes]).toEqual(['Point']);
    expect(JSON.stringify(vm.geojson)).not.toContain('LineString');
  });

  it('Veldhoven links only to nl-f-deepuv-coordination as coordinator address', () => {
    const veld = vm.links.filter((l) => l.placeId === 'nl-place-veldhoven');
    expect(veld).toHaveLength(1);
    expect(veld[0]?.claimId).toBe('nl-f-deepuv-coordination');
    expect(veld[0]?.relationship).toBe('project_coordinator_address');
    const feat = vm.geojson.features.find((f) => f.properties.placeId === 'nl-place-veldhoven');
    expect(feat?.properties.linkedClaimIds).toEqual(['nl-f-deepuv-coordination']);
  });

  it('Eindhoven links only to nl-f-deepuv-participants as participant address', () => {
    const eind = vm.links.filter((l) => l.placeId === 'nl-place-eindhoven');
    expect(eind).toHaveLength(1);
    expect(eind[0]?.claimId).toBe('nl-f-deepuv-participants');
    expect(eind[0]?.relationship).toBe('project_participant_address');
  });

  it('marks exactly the two DEEP-UV claims mappable and the other 15 non-mappable', () => {
    expect(vm.timeline).toHaveLength(17);
    const mappable = vm.timeline.filter((c) => c.mappable);
    expect(mappable.map((c) => c.id).sort()).toEqual([
      'nl-f-deepuv-coordination', 'nl-f-deepuv-participants',
    ]);
    expect(vm.unlinkedClaimCount).toBe(15);
    // no PAS 5500 / founding claim is mappable
    expect(vm.timeline.find((c) => c.id === 'nl-f-pas5500-launched-1991')?.mappable).toBe(false);
    expect(vm.timeline.find((c) => c.id === 'nl-f-jv-established-1984')?.mappable).toBe(false);
  });

  it('resolves a mappable timeline claim to its Place and a non-mappable to none', () => {
    const coord = vm.timeline.find((c) => c.id === 'nl-f-deepuv-coordination')!;
    expect(coord.placeId).toBe('nl-place-veldhoven');
    const founding = vm.timeline.find((c) => c.id === 'nl-f-jv-established-1984')!;
    expect(founding.placeId).toBeNull();
  });
});

/* ------------------------------------------------------------------ *
 * Reducer synchronization
 * ------------------------------------------------------------------ */

describe('atlas reducer', () => {
  it('selectMarker selects place + claim and opens the drawer', () => {
    const s = atlasReducer(initialAtlasState, {
      type: 'selectMarker', placeId: 'nl-place-veldhoven', claimId: 'nl-f-deepuv-coordination', period: '1988–1991',
    });
    expect(s.selectedPlaceId).toBe('nl-place-veldhoven');
    expect(s.selectedClaimId).toBe('nl-f-deepuv-coordination');
    expect(s.drawerOpen).toBe(true);
  });

  it('mappable timeline selection resolves to the Place; non-mappable resolves to none', () => {
    const mappable = atlasReducer(initialAtlasState, {
      type: 'selectTimelineClaim', claimId: 'nl-f-deepuv-participants', placeId: 'nl-place-eindhoven', period: '1988–1991',
    });
    expect(mappable.selectedPlaceId).toBe('nl-place-eindhoven');
    const nonMappable = atlasReducer(initialAtlasState, {
      type: 'selectTimelineClaim', claimId: 'nl-f-jv-established-1984', placeId: null, period: 'by Apr 1984',
    });
    expect(nonMappable.selectedClaimId).toBe('nl-f-jv-established-1984');
    expect(nonMappable.selectedPlaceId).toBeNull();
    expect(nonMappable.drawerOpen).toBe(true);
  });

  it('closeDrawer and escape close the drawer but keep selection, filter and map', () => {
    const open: AtlasSelectionState = {
      selectedClaimId: 'x', selectedPlaceId: 'p', activePeriod: '1990', evidenceFilter: 'mappable', activePhase: null, drawerOpen: true,
    };
    for (const action of [{ type: 'closeDrawer' } as const, { type: 'escape' } as const]) {
      const s = atlasReducer(open, action);
      expect(s.drawerOpen).toBe(false);
      expect(s.selectedClaimId).toBe('x');
      expect(s.selectedPlaceId).toBe('p');
      expect(s.evidenceFilter).toBe('mappable');
    }
  });

  it('setFilter changes only the filter (never selection or map)', () => {
    const base: AtlasSelectionState = {
      selectedClaimId: 'x', selectedPlaceId: 'p', activePeriod: '1990', evidenceFilter: 'all', activePhase: null, drawerOpen: true,
    };
    const s = atlasReducer(base, { type: 'setFilter', filter: 'non_mappable' });
    expect(s.evidenceFilter).toBe('non_mappable');
    expect(s.selectedClaimId).toBe('x');
    expect(s.selectedPlaceId).toBe('p');
    expect(s.drawerOpen).toBe(true);
  });

  it('resetView clears selection + drawer but keeps the filters', () => {
    const base: AtlasSelectionState = {
      selectedClaimId: 'x', selectedPlaceId: 'p', activePeriod: '1990',
      evidenceFilter: 'mappable', activePhase: 'founding', drawerOpen: true,
    };
    const s = atlasReducer(base, { type: 'resetView' });
    expect(s.selectedClaimId).toBeNull();
    expect(s.selectedPlaceId).toBeNull();
    expect(s.drawerOpen).toBe(false);
    expect(s.evidenceFilter).toBe('mappable');
    expect(s.activePhase).toBe('founding');
  });

  it('setPhase changes only the phase (never selection or map)', () => {
    const base: AtlasSelectionState = {
      selectedClaimId: 'x', selectedPlaceId: 'p', activePeriod: '1990',
      evidenceFilter: 'all', activePhase: null, drawerOpen: true,
    };
    const s = atlasReducer(base, { type: 'setPhase', phase: 'technological-development' });
    expect(s.activePhase).toBe('technological-development');
    expect(s.selectedClaimId).toBe('x');
    expect(s.drawerOpen).toBe(true);
  });
});

/* ------------------------------------------------------------------ *
 * Map lifecycle state machine
 * ------------------------------------------------------------------ */

describe('map state machine', () => {
  it('load transitions to ready', () => {
    expect(nextMapPhase('loading_style', 'loaded')).toBe('ready');
  });
  it('a timeout is NON-fatal — it becomes slow, not fatal_error', () => {
    expect(nextMapPhase('loading_style', 'timeout')).toBe('slow');
    expect(nextMapPhase('slow', 'timeout')).toBe('slow');
    // a timeout after ready never downgrades
    expect(nextMapPhase('ready', 'timeout')).toBe('ready');
  });
  it('WebGL missing and constructor failure are fatal (fallback)', () => {
    expect(nextMapPhase('initializing', 'webgl_missing')).toBe('webgl_unavailable');
    expect(nextMapPhase('initializing', 'init_error')).toBe('fatal_error');
    expect(mapIsFatal('webgl_unavailable')).toBe(true);
    expect(mapIsFatal('fatal_error')).toBe(true);
  });
  it('a genuine style-load failure is fatal, but slow keeps the map mounted', () => {
    expect(nextMapPhase('loading_style', 'style_error')).toBe('fatal_error');
    expect(mapIsMounted('slow')).toBe(true);
    expect(mapIsMounted('fatal_error')).toBe(false);
  });
  it('retry returns to initializing', () => {
    expect(nextMapPhase('slow', 'retry')).toBe('initializing');
  });
  it('every phase is either fatal (fallback) or mounted', () => {
    const phases: MapPhase[] = ['initializing', 'loading_style', 'ready', 'slow', 'fatal_error', 'webgl_unavailable'];
    for (const p of phases) expect(mapIsFatal(p)).toBe(!mapIsMounted(p));
  });
});

/* ------------------------------------------------------------------ *
 * Phase filter
 * ------------------------------------------------------------------ */

describe('phase filter', () => {
  it('view-model exposes evidence-boundary phases with per-phase anchor counts', () => {
    expect(vm.phases.length).toBe(5);
    const byKey = Object.fromEntries(vm.phases.map((p) => [p.key, p]));
    // both anchors are DEEP-UV claims → technological-development phase
    expect(byKey['technological-development']?.anchorCount).toBe(2);
    expect(byKey['founding']?.anchorCount).toBe(0);
    expect(byKey['commercial-viability']?.anchorCount).toBe(0);
    // every timeline claim carries at least one phase membership
    expect(vm.timeline.every((c) => c.phaseKeys.length >= 1)).toBe(true);
  });

  it('membership is many-to-many: a claim can belong to more than one phase', () => {
    // Overlapping evidence-boundary periods → phaseKeys is a set, not a label.
    const overlapping: AtlasFilterableClaim = {
      mappable: true,
      placeId: 'nl-place-veldhoven',
      phaseKeys: ['technological-development', 'commercial-viability'],
    };
    expect(claimMatchesFilters(overlapping, 'all', 'technological-development')).toBe(true);
    expect(claimMatchesFilters(overlapping, 'all', 'commercial-viability')).toBe(true);
    // ...but not a phase it does not belong to
    expect(claimMatchesFilters(overlapping, 'all', 'founding')).toBe(false);
  });

  it('a claim present in every phase matches every phase', () => {
    const allKeys = vm.phases.map((p) => p.key);
    const ubiquitous: AtlasFilterableClaim = {
      mappable: false,
      placeId: null,
      phaseKeys: allKeys,
    };
    for (const key of allKeys) {
      expect(claimMatchesFilters(ubiquitous, 'all', key)).toBe(true);
    }
    expect(claimMatchesFilters(ubiquitous, 'all', null)).toBe(true);
  });

  it('a marker stays visible when at least one linked claim is in the phase', () => {
    // Same place, two links in DIFFERENT phases — the last-wins bug would have
    // dropped one. Selecting either phase must keep the marker.
    const claims: AtlasFilterableClaim[] = [
      { mappable: true, placeId: 'nl-place-veldhoven', phaseKeys: ['technological-development'] },
      { mappable: true, placeId: 'nl-place-veldhoven', phaseKeys: ['public-company-transition'] },
    ];
    expect(visiblePlaceIds(claims, 'technological-development')).toEqual(['nl-place-veldhoven']);
    expect(visiblePlaceIds(claims, 'public-company-transition')).toEqual(['nl-place-veldhoven']);
  });

  it('a marker is hidden when none of its linked claims are in the phase', () => {
    const claims: AtlasFilterableClaim[] = [
      { mappable: true, placeId: 'nl-place-veldhoven', phaseKeys: ['technological-development'] },
    ];
    expect(visiblePlaceIds(claims, 'founding')).toEqual([]);
    expect(visiblePlaceIds(claims, 'commercial-viability')).toEqual([]);
  });

  it('claimMatchesFilters combines evidence filter and phase', () => {
    const coord = vm.timeline.find((c) => c.id === 'nl-f-deepuv-coordination')!;
    const founding = vm.timeline.find((c) => c.id === 'nl-f-jv-established-1984')!;
    expect(claimMatchesFilters(coord, 'all', 'technological-development')).toBe(true);
    expect(claimMatchesFilters(coord, 'all', 'founding')).toBe(false);
    expect(claimMatchesFilters(coord, 'mappable', null)).toBe(true);
    expect(claimMatchesFilters(founding, 'mappable', null)).toBe(false);
  });

  it('visiblePlaceIds shows both anchors only in their phase, none otherwise', () => {
    expect(visiblePlaceIds(vm.timeline, null).sort()).toEqual(['nl-place-eindhoven', 'nl-place-veldhoven']);
    expect(visiblePlaceIds(vm.timeline, 'technological-development').sort())
      .toEqual(['nl-place-eindhoven', 'nl-place-veldhoven']);
    expect(visiblePlaceIds(vm.timeline, 'founding')).toEqual([]);
    expect(visiblePlaceIds(vm.timeline, 'commercial-viability')).toEqual([]);
  });
});

/* ------------------------------------------------------------------ *
 * Components (no WebGL)
 * ------------------------------------------------------------------ */

describe('atlas components', () => {
  it('fallback lists the two verified places and keeps the evidence-view link', () => {
    const html = renderToStaticMarkup(
      <AtlasFallback data={vm} reason="The basemap could not be loaded." onSelectPlace={() => {}} />,
    );
    expect(html).toContain('Veldhoven');
    expect(html).toContain('Eindhoven');
    expect(html).toContain('project_coordinator_address');
    expect(html).toContain('Full evidence view');
    expect(html).toContain('/cases/netherlands-semiconductor-equipment');
  });

  it('timeline renders 17 keyboard buttons with mappable/type/attributed data', () => {
    const html = renderToStaticMarkup(
      <AtlasTimeline claims={vm.timeline} selectedClaimId={null} filter="all" activePhase={null} onSelect={() => {}} />,
    );
    expect((html.match(/class="atlas-tick"/g) ?? [])).toHaveLength(17);
    expect((html.match(/data-mappable="yes"/g) ?? [])).toHaveLength(2);
    expect((html.match(/data-type="interpretive"/g) ?? [])).toHaveLength(1);
    expect(html).toContain('data-attributed="yes"');
  });

  it('renders the accessible atlas shell (topbar, segmented control, filters, annotation)', () => {
    const html = renderToStaticMarkup(<AtlasShell data={vm} />);
    expect(html).toContain('WHY HERE?');
    expect(html).toContain('Netherlands');
    expect(html).toContain('Research in progress');
    expect(html).toContain('2 verified geographic anchors');
    expect(html).toContain('Complete evidence view');
    // mobile segmented control
    expect(html).toContain('>Map<');
    expect(html).toContain('>Timeline<');
    expect(html).toContain('>Evidence<');
    // evidence + phase filter controls
    expect(html).toContain('All evidence');
    expect(html).toContain('Geographically anchored');
    expect(html).toContain('Not geographically anchored');
    expect(html).toContain('All periods');
    expect(html).toContain('Technological development');
    // sparse-map honesty annotation
    expect(html).toContain('2 verified city anchors · 15 Claims without verified sub-national geography');
    // guards
    expect(html.toLowerCase()).not.toContain('thesis');
    expect(html).not.toContain('LineString');
  });
});

/* ------------------------------------------------------------------ *
 * Guards — research route unchanged; no unsupported geography
 * ------------------------------------------------------------------ */

describe('guards', () => {
  it('the research route view-model still exposes all 17 Claims unchanged', () => {
    const research = buildNetherlandsResearchView();
    expect(research.claimCount).toBe(17);
    expect(research.spine).toHaveLength(17);
    expect(research.hasThesis).toBe(false);
  });

  it('no link asserts a founding, PAS 5500, HQ, research or production location', () => {
    const forbidden = new Set([
      'nl-f-jv-established-1984', 'nl-f-pas5500-launched-1991',
      'nl-f-holding-company-incorporated-1994', 'nl-f-public-company-listings-1995',
    ]);
    for (const l of vm.links) {
      expect(forbidden.has(l.claimId)).toBe(false);
      expect(['research_site', 'production_site', 'organization_registered_address'])
        .not.toContain(l.relationship);
    }
  });
});
