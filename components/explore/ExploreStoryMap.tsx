'use client';

import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { ATLAS_BASEMAP } from '@/lib/basemap';
import type { MapEvent } from '@/lib/mapStatus';
import type { ChapterMapAnchor } from '@/lib/chapters';

/**
 * The map that CARRIES Chapter 3. It shows only the anchors backed by a
 * production Place (Veldhoven, Eindhoven) and re-frames to them. No fabricated
 * coordinates for the foreign consortium members — those live in the shell's
 * non-geographic network list. A small map-info control (not a story paragraph)
 * carries the recorded-address caveat. Reports lifecycle events to the shell.
 *
 * Anchors are drawn as a GeoJSON SOURCE + circle/label LAYERS (GPU-projected
 * every frame) rather than DOM markers — DOM markers can race with the map's
 * first sizing and stick to the origin; layers cannot.
 */
export default function ExploreStoryMap({
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
  const readyRef = useRef(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const anchorsFC = (): GeoJSON.FeatureCollection => ({
    type: 'FeatureCollection',
    features: anchors.map((a) => ({
      type: 'Feature',
      properties: { name: a.name },
      geometry: { type: 'Point', coordinates: [a.longitude, a.latitude] },
    })),
  });

  const frameCamera = (): void => {
    const map = mapRef.current;
    if (map === null || !readyRef.current || anchors.length === 0) return;
    if (anchors.length === 1) {
      const only = anchors[0]!;
      const target = { center: [only.longitude, only.latitude] as [number, number], zoom: 9 };
      reducedMotion ? map.jumpTo(target) : map.easeTo({ ...target, duration: 700 });
      return;
    }
    // Centre the anchors (not corner-hugging) so they stay clear of the top-left
    // info control and the bottom attribution at every size.
    const lons = anchors.map((a) => a.longitude), lats = anchors.map((a) => a.latitude);
    const center = [(Math.min(...lons) + Math.max(...lons)) / 2, (Math.min(...lats) + Math.max(...lats)) / 2] as [number, number];
    const target = { center, zoom: 10.5 };
    reducedMotion ? map.jumpTo(target) : map.easeTo({ ...target, duration: 700 });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container === null) return;

    let webglOk = false;
    try {
      const t = document.createElement('canvas');
      webglOk = Boolean(t.getContext('webgl2') ?? t.getContext('webgl') ?? t.getContext('experimental-webgl'));
    } catch { webglOk = false; }
    if (!webglOk) { onEvent('webgl_missing'); return; }

    // MapLibre v6's ESM worker must be served from /public (see repo notes).
    maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs');

    let map: maplibregl.Map;
    try {
      map = new maplibregl.Map({
        container,
        style: ATLAS_BASEMAP.styleUrl,
        center: [5.44, 51.43],
        zoom: 8,
        // The OpenFreeMap planet source already carries the required credit; keep
        // it as ONE compact control (bottom-right) so it never spans the width and
        // never collides with the top-left map-info control.
        attributionControl: { compact: true },
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
      if (map.getSource('anchors') === undefined) {
        map.addSource('anchors', { type: 'geojson', data: anchorsFC() });
        map.addLayer({
          id: 'anchor-dots', type: 'circle', source: 'anchors',
          paint: { 'circle-radius': 7, 'circle-color': '#007afc', 'circle-stroke-color': '#ffffff', 'circle-stroke-width': 2 },
        });
        map.addLayer({
          id: 'anchor-labels', type: 'symbol', source: 'anchors',
          layout: { 'text-field': ['get', 'name'], 'text-font': ['Noto Sans Regular'], 'text-size': 13, 'text-offset': [0, -1.3], 'text-anchor': 'bottom', 'text-allow-overlap': true },
          paint: { 'text-color': '#ffffff', 'text-halo-color': '#0e1012', 'text-halo-width': 1.6 },
        });
      }
      frameCamera();
    });

    return () => {
      window.clearTimeout(slowTimeout);
      resizeObserver.disconnect();
      readyRef.current = false;
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the source data + framing in sync if anchors ever change (stable here).
  const anchorKey = anchors.map((a) => `${a.placeId}:${a.longitude},${a.latitude}`).join('|');
  useEffect(() => {
    const map = mapRef.current;
    if (map === null || !readyRef.current) return;
    const src = map.getSource('anchors') as maplibregl.GeoJSONSource | undefined;
    src?.setData(anchorsFC());
    frameCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchorKey]);
  useEffect(() => { frameCamera(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [reducedMotion]);

  return (
    <div className="esm">
      <div ref={containerRef} className="esm-canvas" aria-hidden="true" />
      <div className="esm-info">
        <button type="button" className="esm-info-btn" aria-expanded={infoOpen} onClick={() => setInfoOpen((v) => !v)}>
          About these markers
        </button>
        {infoOpen && (
          <p className="esm-info-note">
            These are addresses recorded for the project organisations. They do not
            establish where project work physically took place.
          </p>
        )}
      </div>
    </div>
  );
}
