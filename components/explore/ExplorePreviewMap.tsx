'use client';

import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { ATLAS_BASEMAP } from '@/lib/basemap';
import type { MapEvent } from '@/lib/mapStatus';
import type { ChapterMapAnchor } from '@/lib/chapters';

/**
 * The MapLibre boundary for the Explore preview. A quiet spatial surface that
 * updates as the reader moves between chapters: it shows only the anchors of the
 * ACTIVE chapter and re-frames to them. Anchors are the case's city-level places
 * (postal/address points), never event locations — the copy elsewhere says so.
 * Reports lifecycle EVENTS to the shell; cleans up with map.remove() on unmount.
 */
export default function ExplorePreviewMap({
  anchors,
  reducedMotion,
  onEvent,
}: {
  anchors: ChapterMapAnchor[];
  reducedMotion: boolean;
  onEvent: (event: MapEvent, reason?: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const readyRef = useRef(false);

  /* Build the map once. */
  useEffect(() => {
    const container = containerRef.current;
    if (container === null) return;

    let webglOk = false;
    try {
      const test = document.createElement('canvas');
      webglOk = Boolean(
        test.getContext('webgl2') ?? test.getContext('webgl') ?? test.getContext('experimental-webgl'),
      );
    } catch { webglOk = false; }
    if (!webglOk) { onEvent('webgl_missing'); return; }

    // See AtlasMap: MapLibre v6's ESM worker must be served from /public.
    maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs');

    let map: maplibregl.Map;
    try {
      map = new maplibregl.Map({
        container,
        style: ATLAS_BASEMAP.styleUrl,
        center: [5.44, 51.43],
        zoom: 8,
        // The OpenFreeMap planet source's TileJSON already carries the required
        // credit; adding customAttribution here would double it (Stage 1 lesson).
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

    const slowTimeout = window.setTimeout(() => { if (!readyRef.current) onEvent('timeout'); }, 8000);

    map.on('error', (e: unknown) => {
      const err = e as { sourceId?: string; tile?: unknown; error?: { message?: string } };
      const isTileLevel = err.sourceId !== undefined || err.tile !== undefined;
      if (!readyRef.current && !isTileLevel && !map.isStyleLoaded()) {
        onEvent('style_error', String(err.error?.message ?? 'style failed to load'));
      }
    });

    map.on('load', () => {
      readyRef.current = true;
      window.clearTimeout(slowTimeout);
      map.resize();
      onEvent('loaded');
      renderAnchors();
    });

    return () => {
      window.clearTimeout(slowTimeout);
      resizeObserver.disconnect();
      for (const m of markersRef.current) m.remove();
      markersRef.current = [];
      readyRef.current = false;
      map.remove();
      mapRef.current = null;
    };
    // build once; anchor updates handled in the effect below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Re-render markers + re-frame whenever the active chapter's anchors change. */
  const renderAnchors = (): void => {
    const map = mapRef.current;
    if (map === null || !readyRef.current) return;
    for (const m of markersRef.current) m.remove();
    markersRef.current = [];

    if (anchors.length === 0) {
      const target = { center: [5.44, 51.43] as [number, number], zoom: 6.5 };
      reducedMotion ? map.jumpTo(target) : map.easeTo({ ...target, duration: 600 });
      return;
    }

    const bounds = new maplibregl.LngLatBounds();
    for (const a of anchors) {
      const el = document.createElement('div');
      el.className = 'ep-marker';
      el.innerHTML =
        `<span class="ep-marker-dot" aria-hidden="true"></span>` +
        `<span class="ep-marker-label">${a.name}</span>`;
      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([a.longitude, a.latitude])
        .addTo(map);
      markersRef.current.push(marker);
      bounds.extend([a.longitude, a.latitude]);
    }
    if (anchors.length === 1) {
      const only = anchors[0]!;
      const target = { center: [only.longitude, only.latitude] as [number, number], zoom: 9 };
      reducedMotion ? map.jumpTo(target) : map.easeTo({ ...target, duration: 600 });
    } else {
      map.fitBounds(bounds, { padding: 90, maxZoom: 10, animate: !reducedMotion, duration: 600 });
    }
  };

  useEffect(() => {
    renderAnchors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchors, reducedMotion]);

  return <div ref={containerRef} className="ep-map-canvas" aria-hidden="true" />;
}
