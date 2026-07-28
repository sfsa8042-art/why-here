'use client';

import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { ATLAS_BASEMAP } from '@/lib/basemap';
import type { MapEvent } from '@/lib/mapStatus';
import type { AtlasViewModel } from '@/lib/atlasViewModel';

/**
 * The sole MapLibre GL JS boundary. Reports lifecycle EVENTS (not phases) to
 * the shell, which owns the pure state machine. Data-driven markers come from
 * the atlas GeoJSON; markers hide/show by phase via `visiblePlaceIds`. No
 * place-to-place lines are ever added. Cleans up with map.remove() on unmount.
 */
export default function AtlasMap({
  data,
  selectedPlaceId,
  visiblePlaceIds,
  reducedMotion,
  onEvent,
  onSelectMarker,
}: {
  data: AtlasViewModel;
  selectedPlaceId: string | null;
  visiblePlaceIds: string[];
  reducedMotion: boolean;
  onEvent: (event: MapEvent, reason?: string) => void;
  onSelectMarker: (placeId: string, claimId: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());

  useEffect(() => {
    const container = containerRef.current;
    if (container === null) return;

    let webglOk = false;
    try {
      const test = document.createElement('canvas');
      webglOk = Boolean(
        test.getContext('webgl2') ??
          test.getContext('webgl') ??
          test.getContext('experimental-webgl'),
      );
    } catch {
      webglOk = false;
    }
    if (!webglOk) {
      onEvent('webgl_missing');
      return;
    }

    /*
     * MapLibre v6 ships an ESM *module* worker (`maplibre-gl-worker.mjs`) that it
     * loads at runtime from a URL derived relative to its own chunk. The Next
     * build does not emit that worker with a resolvable `./maplibre-gl-shared.mjs`
     * sibling, so the default worker 404s and becomes a silent dud: the style and
     * source metadata load, but the worker never parses vector tiles — `load`
     * never fires and the basemap stays blank. We serve the worker and its shared
     * sibling from `/public` (original names, correct relative import) and point
     * MapLibre at them. Idempotent; must run before the first Map is constructed.
     */
    maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs');

    let map: maplibregl.Map;
    try {
      map = new maplibregl.Map({
        container,
        style: ATLAS_BASEMAP.styleUrl,
        center: data.initialView.center,
        zoom: data.initialView.zoom,
        attributionControl: { customAttribution: ATLAS_BASEMAP.attributionHtml },
        maxZoom: 12,
      });
    } catch (e) {
      onEvent('init_error', String((e as Error)?.message ?? 'map init failed'));
      return;
    }
    mapRef.current = map;
    onEvent('style_loading');

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    const resizeObserver = new ResizeObserver(() => map.resize());
    resizeObserver.observe(container);

    let ready = false;
    /* A slow first render is NOT a failure — it becomes `slow` (retryable). */
    const slowTimeout = window.setTimeout(() => {
      if (!ready) onEvent('timeout');
    }, 8000);

    map.on('error', (e: unknown) => {
      /* Isolated tile/sprite errors carry a sourceId/tile and are ignored.
         An error before the style is loaded, with no source attribution, is
         treated as a genuine style-load failure. */
      const err = e as { sourceId?: string; tile?: unknown; error?: { message?: string } };
      const isTileLevel = err.sourceId !== undefined || err.tile !== undefined;
      if (!ready && !isTileLevel && !map.isStyleLoaded()) {
        onEvent('style_error', String(err.error?.message ?? 'style failed to load'));
      }
    });

    map.on('load', () => {
      ready = true;
      window.clearTimeout(slowTimeout);
      map.resize();
      map.fitBounds(data.initialView.bounds, { padding: 64, animate: false });

      for (const feature of data.geojson.features) {
        const [lng, lat] = feature.geometry.coordinates;
        const claimId = feature.properties.linkedClaimIds[0] ?? '';
        const isCoordinator = feature.properties.relationship === 'project_coordinator_address';

        const el = document.createElement('button');
        el.type = 'button';
        el.className = 'atlas-marker';
        el.dataset['place'] = feature.properties.placeId;
        el.dataset['role'] = isCoordinator ? 'coordinator' : 'participant';
        el.setAttribute(
          'aria-label',
          `${feature.properties.name} — ${feature.properties.relationship}, ${feature.properties.temporalScopeLabel}, city-level precision`,
        );
        el.innerHTML =
          `<span class="atlas-marker-dot" aria-hidden="true"></span>` +
          `<span class="atlas-marker-label">${feature.properties.name}</span>`;
        el.addEventListener('click', (ev) => {
          ev.stopPropagation();
          if (claimId !== '') onSelectMarker(feature.properties.placeId, claimId);
        });

        const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([lng, lat])
          .addTo(map);
        markersRef.current.set(feature.properties.placeId, marker);
      }

      onEvent(data.geojson.features.length === 0 ? 'style_error' : 'loaded');
    });

    return () => {
      window.clearTimeout(slowTimeout);
      resizeObserver.disconnect();
      markersRef.current.clear();
      map.remove();
      mapRef.current = null;
    };
    // build once; selection + phase visibility handled in the effects below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Camera + active-marker sync when the selected place changes. */
  useEffect(() => {
    const map = mapRef.current;
    if (map === null) return;
    for (const [placeId, marker] of markersRef.current) {
      const active = placeId === selectedPlaceId;
      marker.getElement().setAttribute('aria-pressed', active ? 'true' : 'false');
      marker.getElement().classList.toggle('is-active', active);
    }
    if (selectedPlaceId !== null) {
      const place = data.places.find((p) => p.id === selectedPlaceId);
      if (place !== undefined) {
        const target = { center: [place.longitude, place.latitude] as [number, number], zoom: Math.max(map.getZoom(), 9) };
        if (reducedMotion) map.jumpTo(target);
        else map.easeTo({ ...target, duration: 600 });
      }
    }
  }, [selectedPlaceId, reducedMotion, data.places]);

  /* Phase filter: hide markers whose place is not in the active phase. */
  useEffect(() => {
    const visible = new Set(visiblePlaceIds);
    for (const [placeId, marker] of markersRef.current) {
      marker.getElement().style.display = visible.has(placeId) ? '' : 'none';
    }
  }, [visiblePlaceIds]);

  return <div ref={containerRef} className="atlas-map-canvas" aria-hidden="true" />;
}
