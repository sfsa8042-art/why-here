'use client';

import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import {
  atlasReducer,
  initialAtlasState,
  visiblePlaceIds,
  type EvidenceFilter,
} from '@/lib/atlasState';
import {
  mapIsFatal,
  mapIsMounted,
  nextMapPhase,
  type MapEvent,
  type MapPhase,
} from '@/lib/mapStatus';
import type { AtlasViewModel, AtlasTimelineClaim } from '@/lib/atlasViewModel';
import { AtlasControlRail } from './AtlasControlRail.tsx';
import { AtlasTimeline } from './AtlasTimeline.tsx';
import { AtlasDrawer } from './AtlasDrawer.tsx';
import { AtlasFallback } from './AtlasFallback.tsx';

/* The MapLibre component is the only client-only, WebGL-touching boundary. */
const AtlasMap = dynamic(() => import('./AtlasMap.tsx'), {
  ssr: false,
  loading: () => (
    <div className="atlas-map-status" role="status">
      Loading map…
    </div>
  ),
});

type MobilePane = 'map' | 'timeline' | 'evidence';

export function AtlasShell({ data, prototypeBadge = false }: { data: AtlasViewModel; prototypeBadge?: boolean }) {
  const [state, dispatch] = useReducer(atlasReducer, initialAtlasState);
  const [mapPhase, setMapPhase] = useState<MapPhase>('initializing');
  const [mapReason, setMapReason] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mobilePane, setMobilePane] = useState<MobilePane>('map');
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (): void => setReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && state.drawerOpen) dispatch({ type: 'escape' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state.drawerOpen]);

  const timelineById = useMemo(
    () => new Map(data.timeline.map((c) => [c.id, c])),
    [data.timeline],
  );
  const shownPlaceIds = useMemo(
    () => visiblePlaceIds(data.timeline, state.activePhase),
    [data.timeline, state.activePhase],
  );

  const selectedClaim: AtlasTimelineClaim | null =
    state.selectedClaimId !== null ? timelineById.get(state.selectedClaimId) ?? null : null;
  const selectedLink =
    state.selectedClaimId !== null
      ? data.links.find((l) => l.claimId === state.selectedClaimId) ?? null
      : null;
  const selectedPlace =
    state.selectedPlaceId !== null
      ? data.places.find((p) => p.id === state.selectedPlaceId) ?? null
      : null;

  const captureFocus = (): void => {
    restoreFocusRef.current = (document.activeElement as HTMLElement | null) ?? null;
  };

  const onMapEvent = (event: MapEvent, reason?: string): void => {
    if (reason !== undefined) setMapReason(reason);
    setMapPhase((p) => nextMapPhase(p, event));
  };
  const retryMap = (): void => {
    setMapReason(null);
    setMapPhase('initializing');
    setRetryKey((k) => k + 1);
  };

  const selectMarker = (placeId: string, claimId: string): void => {
    captureFocus();
    const claim = timelineById.get(claimId);
    dispatch({ type: 'selectMarker', placeId, claimId, period: claim?.period ?? null });
    setMobilePane('evidence');
  };
  const selectTimelineClaim = (claim: AtlasTimelineClaim): void => {
    captureFocus();
    dispatch({ type: 'selectTimelineClaim', claimId: claim.id, placeId: claim.placeId, period: claim.period });
    setMobilePane('evidence');
  };
  const setFilter = (f: EvidenceFilter): void => dispatch({ type: 'setFilter', filter: f });
  const setPhase = (phase: string | null): void => dispatch({ type: 'setPhase', phase });
  const reset = (): void => dispatch({ type: 'resetView' });
  const closeDrawer = (): void => dispatch({ type: 'closeDrawer' });

  const fatal = mapIsFatal(mapPhase);
  const showLoadingOverlay = mapPhase === 'initializing' || mapPhase === 'loading_style';

  return (
    <div className="atlas-shell" data-pane={mobilePane}>
      <header className="atlas-topbar">
        <span className="atlas-wordmark">WHY HERE?</span>
        <span className="atlas-case">{data.country} × {data.industry}</span>
        <span className="atlas-status-pill">{data.statusLabel}</span>
        {prototypeBadge && <span className="atlas-proto-pill">Research map prototype</span>}
        <span className="atlas-anchors">{data.anchorCount} verified geographic anchors</span>
        <Link className="atlas-evidence-link" href="/cases/netherlands-semiconductor-equipment">
          Complete evidence view →
        </Link>
      </header>

      <nav className="atlas-segmented" aria-label="Atlas view">
        {(['map', 'timeline', 'evidence'] as MobilePane[]).map((pane) => (
          <button
            key={pane}
            type="button"
            className="seg-btn"
            aria-pressed={mobilePane === pane}
            onClick={() => setMobilePane(pane)}
          >
            {pane === 'map' ? 'Map' : pane === 'timeline' ? 'Timeline' : 'Evidence'}
          </button>
        ))}
      </nav>

      <div className="atlas-body">
        <AtlasControlRail
          data={data}
          filter={state.evidenceFilter}
          activePhase={state.activePhase}
          selectedPlaceId={state.selectedPlaceId}
          onSetFilter={setFilter}
          onSetPhase={setPhase}
          onReset={reset}
          onSelectPlace={selectMarker}
        />

        <div className="atlas-stage">
          {!fatal && (
            <AtlasMap
              key={retryKey}
              data={data}
              selectedPlaceId={state.selectedPlaceId}
              visiblePlaceIds={shownPlaceIds}
              reducedMotion={reducedMotion}
              onEvent={onMapEvent}
              onSelectMarker={selectMarker}
            />
          )}
          {showLoadingOverlay && (
            <div className="atlas-map-status" role="status">Loading basemap…</div>
          )}
          {mapPhase === 'slow' && (
            <div className="atlas-map-slow" role="status">
              <span>Map is taking longer to load</span>
              <button type="button" className="rail-btn" onClick={retryMap}>Retry map</button>
            </div>
          )}
          {fatal && (
            <AtlasFallback
              data={data}
              reason={
                mapPhase === 'webgl_unavailable'
                  ? 'Interactive map unavailable (WebGL not supported). Verified anchors:'
                  : `The basemap could not be loaded${mapReason !== null ? ` (${mapReason})` : ''}. Verified anchors:`
              }
              onSelectPlace={selectMarker}
            />
          )}
          <p className="atlas-map-annotation" aria-hidden={fatal}>
            {data.anchorCount} verified city anchors · {data.unlinkedClaimCount} Claims without verified sub-national geography
          </p>
        </div>

        {state.drawerOpen && selectedClaim !== null && (
          <AtlasDrawer
            claim={selectedClaim}
            link={selectedLink}
            place={selectedPlace}
            open={state.drawerOpen}
            onClose={closeDrawer}
            restoreFocusRef={restoreFocusRef}
          />
        )}
      </div>

      <AtlasTimeline
        claims={data.timeline}
        selectedClaimId={state.selectedClaimId}
        filter={state.evidenceFilter}
        activePhase={state.activePhase}
        onSelect={selectTimelineClaim}
      />
    </div>
  );
}
