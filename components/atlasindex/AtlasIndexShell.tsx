'use client';

/**
 * Atlas index — the public product entry point (/atlas), Stage 9: MAP-FIRST.
 *
 * The first viewport IS the interactive world map. On load NO country is
 * selected (neutral world view); the user chooses a country — by its map marker
 * or the accessible "Browse countries" control — which opens a bounded country
 * summary (a right-hand side panel on desktop, a bottom sheet on mobile). Closing
 * returns to the neutral world view. Filters (Industry, Research status, Reset)
 * are visually secondary. Ordinary-user language only; no Claims, citations,
 * epistemic statuses or technical IDs.
 */

import { useEffect, useId, useMemo, useReducer, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import {
  atlasIndexReducer,
  initialAtlasIndexState,
  visibleCases,
  type AtlasIndexAction,
  type AtlasIndexState,
} from '@/lib/atlasIndexState';
import {
  hasEvidenceCta,
  hasExploreCta,
  industryOptions,
  navigationFeatureCollection,
  type AtlasCase,
  type AtlasCaseStatus,
  type StatusFilterValue,
} from '@/lib/atlasCases';
import { mapIsFatal, nextMapPhase, type MapEvent, type MapPhase } from '@/lib/mapStatus';
import type { CountrySummaryView } from '@/lib/atlasPresentation';

const AtlasIndexMap = dynamic(() => import('./AtlasIndexMap.tsx'), {
  ssr: false,
  loading: () => <div className="ai-map-status" role="status">Loading atlas map…</div>,
});

const STATUS_OPTIONS: { value: StatusFilterValue; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'in_research', label: 'Research in progress' },
  { value: 'planned', label: 'Research planned' },
];

/** Public status wording (never "epistemic"/mode language). */
const STATUS_TEXT: Record<AtlasCaseStatus, string> = {
  published: 'Published',
  in_research: 'Research in progress',
  planned: 'Research planned',
};

export type { CountrySummaryView };

export function AtlasIndexShell({
  cases, summaries = {},
}: {
  cases: AtlasCase[]; summaries?: Record<string, CountrySummaryView>;
}) {
  const reducer = (s: AtlasIndexState, a: AtlasIndexAction): AtlasIndexState => atlasIndexReducer(cases, s, a);
  const [state, dispatch] = useReducer(reducer, initialAtlasIndexState());
  const [mapPhase, setMapPhase] = useState<MapPhase>('initializing');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const browseId = useId();
  const filtersId = useId();

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (): void => setReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const industries = useMemo(() => industryOptions(cases), [cases]);
  const visible = useMemo(() => visibleCases(cases, state), [cases, state]);
  const features = useMemo(() => navigationFeatureCollection(visible), [visible]);
  const selected = visible.find((c) => c.id === state.selectedCaseId) ?? null;

  // A fresh selection always opens collapsed on mobile.
  useEffect(() => { setSheetExpanded(false); }, [state.selectedCaseId]);

  const onMapEvent = (event: MapEvent): void => setMapPhase((p) => nextMapPhase(p, event));
  const fatal = mapIsFatal(mapPhase);
  const loadingMap = mapPhase === 'initializing' || mapPhase === 'loading_style';

  const pick = (caseId: string): void => { dispatch({ type: 'selectCase', caseId }); setBrowseOpen(false); };

  return (
    <div className="atlas9">
      {/* Compact page header — heading + instruction + secondary tools. */}
      <header className="atlas9-head">
        <div className="atlas9-head-main">
          <h1 className="atlas9-title">Explore the atlas</h1>
          <p className="atlas9-instruction">Select a country to discover what it became exceptionally good at — and how that strength developed.</p>
        </div>

        <div className="atlas9-tools">
          {/* Filters — deliberately secondary. On desktop they sit inline; on
              mobile they fold behind a compact "Filters" toggle so the map keeps
              the first viewport. */}
          <div className="atlas9-filterbox" data-open={filtersOpen ? 'true' : 'false'}>
            <button
              type="button"
              className="atlas9-filters-toggle"
              aria-expanded={filtersOpen}
              aria-controls={filtersId}
              onClick={() => setFiltersOpen((v) => !v)}
            >Filters<span aria-hidden="true">{filtersOpen ? ' ▾' : ' ▸'}</span></button>
            <div className="atlas9-filters" id={filtersId} role="group" aria-label="Filters">
            <label className="atlas9-filter">
              <span className="atlas9-filter-label">Industry</span>
              <select value={state.industryFilter ?? ''} onChange={(e) => dispatch({ type: 'setIndustryFilter', industry: e.target.value === '' ? null : e.target.value })}>
                <option value="">All industries</option>
                {industries.map((ind) => (<option key={ind} value={ind}>{ind}</option>))}
              </select>
            </label>
            <label className="atlas9-filter">
              <span className="atlas9-filter-label">Research status</span>
              <select value={state.statusFilter} onChange={(e) => dispatch({ type: 'setStatusFilter', status: e.target.value as StatusFilterValue })}>
                {STATUS_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
              </select>
            </label>
            <button type="button" className="atlas9-reset" onClick={() => dispatch({ type: 'reset' })}>Reset</button>
            </div>
          </div>

          {/* Accessible country control — an ALTERNATIVE keyboard/SR path to
              selection (the map markers are now keyboard-accessible too). */}
          <details className="atlas9-browse" open={browseOpen} onToggle={(e) => setBrowseOpen((e.currentTarget as HTMLDetailsElement).open)}>
            <summary className="atlas9-browse-summary" aria-controls={browseId}>Browse countries</summary>
            <div className="atlas9-browse-panel" id={browseId}>
              <ul className="atlas9-country-list">
                {visible.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      className="atlas9-country-btn"
                      data-status={c.status}
                      aria-pressed={c.id === state.selectedCaseId}
                      onClick={() => pick(c.id)}
                    >
                      <span className="atlas9-country-name">{c.country}</span>
                      <span className="atlas9-country-spec">{summaries[c.slug]?.specialisation ?? c.industry}</span>
                      <span className="atlas9-country-status" data-status={c.status}>{STATUS_TEXT[c.status]}</span>
                    </button>
                  </li>
                ))}
                {visible.length === 0 && (
                  <li className="atlas9-country-empty">No countries match these filters. <button type="button" className="atlas9-linkbtn" onClick={() => dispatch({ type: 'reset' })}>Reset</button></li>
                )}
              </ul>
            </div>
          </details>
        </div>
      </header>

      {/* The map is the dominant surface and fills the first viewport. */}
      <div className="atlas9-stage">
        {!fatal ? (
          <AtlasIndexMap
            features={features}
            selectedCaseId={state.selectedCaseId}
            reducedMotion={reducedMotion}
            onEvent={onMapEvent}
            onSelectCase={(caseId) => pick(caseId)}
          />
        ) : (
          <div className="ai-map-fallback" role="status">
            <p>The interactive map isn’t available in this browser.</p>
            <p className="ai-map-fallback-sub">Use “Browse countries” above to open any country.</p>
          </div>
        )}
        {loadingMap && <div className="ai-map-status" role="status">Loading atlas map…</div>}
        {mapPhase === 'slow' && (
          <div className="ai-map-status" role="status">Map is taking longer to load — use “Browse countries” to open any country.</div>
        )}

        {/* Neutral world-view cue — only while nothing is selected. */}
        {selected === null && (
          <div className="atlas9-hint" role="status">
            <span className="atlas9-hint-dot" aria-hidden="true" />Select a country
          </div>
        )}

        <p className="atlas9-legend" aria-hidden={fatal}>
          Markers locate a country — they do not mark the exact sites of historical events.
        </p>

        {/* Country summary — desktop side panel / mobile bottom sheet. */}
        {selected !== null && (
          <CountrySummary
            c={selected}
            view={summaries[selected.slug]}
            expanded={sheetExpanded}
            onToggle={() => setSheetExpanded((v) => !v)}
            onClose={() => dispatch({ type: 'deselect' })}
          />
        )}
      </div>
    </div>
  );
}

/**
 * The country summary shown on selection. Desktop: a bounded right-hand side
 * panel (full content). Mobile: a bottom sheet — collapsed it shows country,
 * specialisation and status; expanding reveals the question and actions. The
 * launched (Explore-capable) case exposes "Explore the story" + "View sources";
 * planned countries show an honest planned note and NO CTAs.
 */
export function CountrySummary({
  c, view, expanded = false, onToggle, onClose,
}: {
  c: AtlasCase; view?: CountrySummaryView | undefined;
  expanded?: boolean; onToggle?: (() => void) | undefined; onClose: () => void;
}) {
  const bodyId = useId();
  const explore = hasExploreCta(c);
  const evidence = hasEvidenceCta(c);
  const specialisation = view?.specialisation ?? c.industry;
  const question = view?.question ?? c.shortQuestion;
  const hasMeta = view?.chapters !== undefined;

  return (
    <aside
      className="atlas9-panel"
      data-status={c.status}
      data-expanded={expanded ? 'true' : 'false'}
      role="dialog"
      aria-label={`${c.country} — country summary`}
    >
      <span className="atlas9-panel-grip" aria-hidden="true" />
      <button type="button" className="atlas9-panel-close" onClick={onClose} aria-label="Close country details">✕</button>

      <div className="atlas9-panel-head">
        <p className="atlas9-panel-country">{c.country}</p>
        <p className="atlas9-panel-spec">
          <span className="atlas9-panel-spec-label">Specialisation</span>
          <span className="atlas9-panel-spec-value">{specialisation}</span>
        </p>
        <p className="atlas9-panel-status" data-status={c.status}>
          <span className="atlas9-status-dot" aria-hidden="true" />{STATUS_TEXT[c.status]}
        </p>
        <button
          type="button"
          className="atlas9-panel-expand"
          aria-expanded={expanded}
          aria-controls={bodyId}
          onClick={onToggle}
        >
          {expanded ? 'Hide details' : 'Show details'}<span aria-hidden="true">{expanded ? ' ▾' : ' ▴'}</span>
        </button>
      </div>

      <div className="atlas9-panel-body" id={bodyId}>
        <p className="atlas9-panel-q">{question}</p>
        {hasMeta && (
          <p className="atlas9-panel-meta">
            <span>{view!.chapters} chapters</span>
            {view!.minutes !== undefined && (<><span className="atlas9-panel-sep">·</span><span>About {view!.minutes} minutes</span></>)}
          </p>
        )}
        {explore ? (
          <div className="atlas9-panel-cta">
            <Link className="btn btn-primary" href={`/atlas/${c.slug}`}>Explore the story</Link>
            {evidence && <Link className="btn btn-ghost" href={`/evidence/${c.slug}`}>View sources</Link>}
          </div>
        ) : (
          <p className="atlas9-panel-planned">Research planned — no public story or sources yet.</p>
        )}
      </div>
    </aside>
  );
}
