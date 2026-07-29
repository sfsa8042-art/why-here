'use client';

/**
 * Atlas index — the public product entry point (/atlas). A full-screen
 * geographic discovery surface: a world navigation map + an accessible case
 * list + a public preview panel, with status/industry filters. Ordinary-user
 * language only; no Claims, citations, epistemic statuses or technical IDs.
 *
 * List-first DOM order (panel before stage) gives a mobile-first, accessible
 * structure; the desktop grid places the map on the left via explicit columns.
 * The case list + preview render with or without WebGL (progressive enhancement).
 */

import { useEffect, useMemo, useReducer, useState } from 'react';
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
import type { CoverView } from '@/lib/media';
import { IndustryGlyph } from './IndustryGlyph.tsx';

const AtlasIndexMap = dynamic(() => import('./AtlasIndexMap.tsx'), {
  ssr: false,
  loading: () => <div className="ai-map-status" role="status">Loading atlas map…</div>,
});

/** Cases that carry an M1 research-map prototype (Netherlands only, for now). */
const PROTOTYPE_SLUGS = new Set<string>(['netherlands-semiconductor-equipment']);

const STATUS_FILTERS: { value: StatusFilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'in_research', label: 'In research' },
  { value: 'planned', label: 'Planned' },
  { value: 'published', label: 'Published' },
];

const STATUS_LABEL: Record<AtlasCaseStatus, string> = {
  published: 'Published',
  in_research: 'In research',
  planned: 'Planned research',
};

export function AtlasIndexShell({ cases, covers = {} }: { cases: AtlasCase[]; covers?: Record<string, CoverView> }) {
  const reducer = (s: AtlasIndexState, a: AtlasIndexAction): AtlasIndexState => atlasIndexReducer(cases, s, a);
  const [state, dispatch] = useReducer(reducer, initialAtlasIndexState(cases[0]?.id ?? null));
  const [mapPhase, setMapPhase] = useState<MapPhase>('initializing');
  const [reducedMotion, setReducedMotion] = useState(false);

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

  const onMapEvent = (event: MapEvent): void => setMapPhase((p) => nextMapPhase(p, event));
  const fatal = mapIsFatal(mapPhase);
  const loadingMap = mapPhase === 'initializing' || mapPhase === 'loading_style';

  return (
    <div className="atlas-index">
      <header className="ai-header">
        <div className="ai-brand">
          <span className="ai-wordmark">WHY HERE?</span>
          <span className="ai-tagline">Atlas of Industrial Advantage</span>
          <p className="ai-desc">A map of places that developed an unusual industrial advantage — and the evidence for why.</p>
        </div>

        <div className="ai-controls" role="group" aria-label="Filters">
          <span className="ai-count">{visible.length} of {cases.length} cases</span>

          <div className="ai-filter" role="group" aria-label="Status filter">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                className="ai-chip"
                aria-pressed={state.statusFilter === f.value}
                onClick={() => dispatch({ type: 'setStatusFilter', status: f.value })}
              >
                {f.label}
              </button>
            ))}
          </div>

          <label className="ai-industry">
            <span className="ai-industry-label">Industry</span>
            <select
              value={state.industryFilter ?? ''}
              onChange={(e) => dispatch({ type: 'setIndustryFilter', industry: e.target.value === '' ? null : e.target.value })}
            >
              <option value="">All industries</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </label>

          <button type="button" className="ai-reset" onClick={() => dispatch({ type: 'reset' })}>Reset</button>
        </div>
      </header>

      <div className="ai-body">
        {/* Panel first in the DOM → mobile list-first + accessible without the map. */}
        <section className="ai-panel" aria-label="Cases">
          <ul className="ai-case-list">
            {visible.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className="ai-case-card"
                  data-status={c.status}
                  aria-pressed={c.id === state.selectedCaseId}
                  onClick={() => dispatch({ type: 'selectCase', caseId: c.id })}
                >
                  <IndustryGlyph industry={c.industry} />
                  <span className="acc-text">
                    <span className="acc-country">{c.country}</span>
                    <span className="acc-industry">{c.industry}</span>
                  </span>
                  <span className="acc-status" data-status={c.status}>{STATUS_LABEL[c.status]}</span>
                </button>
              </li>
            ))}
            {visible.length === 0 && (
              <li className="ai-empty">No cases match these filters. <button type="button" className="ai-linkbtn" onClick={() => dispatch({ type: 'reset' })}>Reset filters</button></li>
            )}
          </ul>

          <CasePreview selected={selected} cover={selected ? covers[selected.slug] ?? null : null} />
        </section>

        <div className="ai-stage">
          {!fatal ? (
            <AtlasIndexMap
              features={features}
              selectedCaseId={state.selectedCaseId}
              reducedMotion={reducedMotion}
              onEvent={onMapEvent}
              onSelectCase={(caseId) => dispatch({ type: 'selectCase', caseId })}
            />
          ) : (
            <div className="ai-map-fallback" role="status">
              <p>The interactive map isn’t available in this browser.</p>
              <p className="ai-map-fallback-sub">Every case is still listed and openable in the panel.</p>
            </div>
          )}
          {loadingMap && <div className="ai-map-status" role="status">Loading atlas map…</div>}
          {mapPhase === 'slow' && (
            <div className="ai-map-status" role="status">Map is taking longer to load — the case list is ready in the panel.</div>
          )}
          <p className="ai-legend" aria-hidden={fatal}>
            Map pins help you browse case studies. They do not mark the exact sites of historical events.
          </p>
        </div>
      </div>
    </div>
  );
}

function CasePreview({ selected, cover }: { selected: AtlasCase | null; cover: CoverView | null }) {
  if (selected === null) {
    return (
      <div className="ai-preview ai-preview-empty" aria-live="polite">
        <p>Select a case to preview it.</p>
      </div>
    );
  }

  const planned = selected.status === 'planned';
  const evidence = hasEvidenceCta(selected);
  const explore = hasExploreCta(selected);
  const prototype = PROTOTYPE_SLUGS.has(selected.slug);
  // Plain-language map-focus label (the raw navigation role stays in the data,
  // never shown to ordinary users). Region → "Regional focus", else "Map focus".
  const navLabel = selected.region
    ? `Regional focus · ${selected.region.replace(/\s*\/\s*/g, ' ')}`
    : `Map focus · ${selected.country}`;

  return (
    <div className="ai-preview" aria-live="polite">
      {cover !== null && (
        <figure className="aip-media">
          <div className="aip-media-frame">
            {/* Local, licence-cleared, self-hosted asset; explicit dimensions avoid layout shift. */}
            <img src={cover.src} alt={cover.alt} width={cover.width} height={cover.height} loading="lazy" decoding="async" />
            <span className="aip-media-badge">{cover.temporalLabel}</span>
          </div>
          <figcaption className="aip-media-cap">
            <span className="aip-media-caption">{cover.caption}</span>
            <span className="aip-media-credit">
              {cover.credit}
              {cover.licenseUrl !== null && (
                <> · <a href={cover.licenseUrl} target="_blank" rel="noreferrer">licence</a></>
              )}
              {' · '}
              <a href={cover.sourceUrl} target="_blank" rel="noreferrer">source</a>
            </span>
          </figcaption>
        </figure>
      )}
      <div className="ai-preview-head">
        <IndustryGlyph industry={selected.industry} large />
        <div>
          <div className="aip-country">{selected.country}</div>
          <div className="aip-industry">{selected.industry}</div>
        </div>
        <span className="aip-status" data-status={selected.status}>{STATUS_LABEL[selected.status]}</span>
      </div>

      <p className="aip-question">{selected.shortQuestion}</p>

      {planned ? (
        <>
          <p className="aip-summary">{selected.summary}</p>
          <p className="aip-planned-note">Research planned. No evidence has been gathered yet.</p>
        </>
      ) : (
        <>
          <p className="aip-summary">{selected.summary}</p>
          {!explore && (
            <p className="aip-explore-note">A public visual story for this case is still being developed.</p>
          )}
          <div className="aip-cta">
            {explore && (
              <Link className="aip-btn aip-btn-primary" href={`/atlas/${selected.slug}`}>Explore case →</Link>
            )}
            {evidence && (
              <Link className="aip-btn aip-btn-primary" href={`/evidence/${selected.slug}`}>View evidence →</Link>
            )}
            {prototype && (
              <Link className="aip-btn aip-btn-secondary" href={`/atlas/${selected.slug}/prototype`}>Open research map prototype →</Link>
            )}
          </div>
        </>
      )}

      <p className="aip-nav">{navLabel}</p>
    </div>
  );
}
