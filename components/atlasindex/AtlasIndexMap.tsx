'use client';

/**
 * Atlas index navigation map — the only MapLibre boundary for /atlas. Reuses the
 * SAME integration as the case atlas: the OpenFreeMap basemap, the /public worker
 * fix (`setWorkerUrl`), the map-lifecycle event model, and the dark visual system.
 * It renders NAVIGATION markers (case entry points) from the registry's
 * `role: 'navigation'` GeoJSON — never evidence geometry, never relationship lines.
 */

import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { ATLAS_BASEMAP } from '@/lib/basemap';
import type { MapEvent } from '@/lib/mapStatus';
import type { NavigationFeatureCollection } from '@/lib/atlasCases';

/** World framing that shows the Netherlands, Taiwan and France with ocean context. */
const WORLD_BOUNDS: [[number, number], [number, number]] = [
  [-12, 12],
  [128, 56],
];

/** Ordinary-user words for the marker's accessible label. */
const STATUS_WORD: Record<string, string> = {
  in_research: 'research in progress',
  planned: 'research planned',
  published: 'published',
};

export default function AtlasIndexMap({
  features,
  selectedCaseId,
  reducedMotion,
  onEvent,
  onSelectCase,
}: {
  features: NavigationFeatureCollection;
  selectedCaseId: string | null;
  reducedMotion: boolean;
  onEvent: (event: MapEvent, reason?: string) => void;
  onSelectCase: (caseId: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const selectRef = useRef(onSelectCase);
  selectRef.current = onSelectCase;

  useEffect(() => {
    const container = containerRef.current;
    if (container === null) return;

    let webglOk = false;
    try {
      const test = document.createElement('canvas');
      webglOk = Boolean(test.getContext('webgl2') ?? test.getContext('webgl') ?? test.getContext('experimental-webgl'));
    } catch {
      webglOk = false;
    }
    if (!webglOk) {
      onEvent('webgl_missing');
      return;
    }

    // Same worker fix as the case atlas: point MapLibre at the /public worker.
    maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs');

    let map: maplibregl.Map;
    try {
      map = new maplibregl.Map({
        container,
        style: ATLAS_BASEMAP.styleUrl,
        center: [50, 36],
        zoom: 1.2,
        // The OpenFreeMap style's own source (planet TileJSON) already carries
        // the required OpenFreeMap/OpenMapTiles/OpenStreetMap credit, so we add
        // no extra attribution string here — that previously doubled the block.
        attributionControl: { compact: false },
        maxZoom: 6,
        minZoom: 0.5,
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
    const slowTimeout = window.setTimeout(() => {
      if (!ready) onEvent('timeout');
    }, 8000);

    map.on('error', (e: unknown) => {
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
      map.fitBounds(WORLD_BOUNDS, { padding: 48, animate: false });

      for (const feature of features.features) {
        const [lng, lat] = feature.geometry.coordinates;
        const { caseId, status, title, country } = feature.properties;

        const { industry } = feature.properties;
        const el = document.createElement('button');
        el.type = 'button';
        el.className = 'atlas-nav-marker';
        el.dataset['status'] = status;
        el.dataset['case'] = caseId;
        // Keyboard-focusable, descriptively labelled control. A native <button>
        // activates on both Enter and Space and fires the same handler as a pointer
        // click, so keyboard and pointer select the identical country.
        el.setAttribute('aria-label', `${country} — ${industry}. ${STATUS_WORD[status] ?? status}. Select to open the country summary.`);
        el.innerHTML =
          `<span class="anm-dot" aria-hidden="true"></span>` +
          `<span class="anm-label">${country}</span>`;
        el.addEventListener('click', (ev) => {
          ev.stopPropagation();
          selectRef.current(caseId);
        });

        const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([lng, lat])
          .addTo(map);
        markersRef.current.set(caseId, marker);
      }

      onEvent('loaded');
    });

    return () => {
      window.clearTimeout(slowTimeout);
      resizeObserver.disconnect();
      markersRef.current.clear();
      map.remove();
      mapRef.current = null;
    };
    // Build once; selection styling + visible-set handled in the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Which navigation markers are visible (filtered set) + active styling. */
  useEffect(() => {
    const visible = new Set(features.features.map((f) => f.properties.caseId));
    for (const [caseId, marker] of markersRef.current) {
      marker.getElement().style.display = visible.has(caseId) ? '' : 'none';
    }
  }, [features]);

  useEffect(() => {
    const map = mapRef.current;
    for (const [caseId, marker] of markersRef.current) {
      const active = caseId === selectedCaseId;
      marker.getElement().classList.toggle('is-selected', active);
      marker.getElement().setAttribute('aria-pressed', active ? 'true' : 'false');
    }
    if (map !== null && selectedCaseId !== null) {
      const feature = features.features.find((f) => f.properties.caseId === selectedCaseId);
      if (feature !== undefined) {
        const target = { center: feature.geometry.coordinates as [number, number] };
        if (reducedMotion) map.jumpTo(target);
        else map.easeTo({ ...target, duration: 600 });
      }
    }
  }, [selectedCaseId, reducedMotion, features]);

  // The container is a labelled region (NOT aria-hidden) so its country markers
  // are reachable in the keyboard/screen-reader tab order — the map is the primary
  // product interaction, with "Browse countries" as an alternative path.
  return <div ref={containerRef} className="ai-map-canvas" role="group" aria-label="World map — select a country marker to open its summary" />;
}
