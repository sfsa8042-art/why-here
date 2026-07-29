'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { mapIsFatal, nextMapPhase, type MapEvent, type MapPhase } from '@/lib/mapStatus';
import type { ChaptersView, ChapterView } from '@/lib/chapters';
import type { MediaItemView } from '@/lib/media';

/* The MapLibre surface is the only client-only, WebGL-touching boundary. */
const ExplorePreviewMap = dynamic(() => import('./ExplorePreviewMap.tsx'), {
  ssr: false,
  loading: () => <div className="ep-map-status" role="status">Loading map…</div>,
});

type Pane = 'story' | 'map';

/** Ordinary-language temporal badge — never a snake_case enum. */
function mediaBadge(m: MediaItemView): string {
  if (m.temporalContext === 'present_day') return 'Present-day context';
  if (m.temporalContext === 'timeless_illustration') return 'Illustration';
  if (m.temporalContext === 'historical') return 'Historical';
  return 'Date unknown';
}

function MediaFigure({ m }: { m: MediaItemView }) {
  return (
    <figure className="ep-media">
      <div className="ep-media-frame">
        {/* SVG diagrams and photos alike are self-hosted local files. */}
        <img src={m.src} alt={m.alt} width={m.width} height={m.height} loading="lazy" decoding="async" />
        <span className="ep-media-badge">{mediaBadge(m)}</span>
      </div>
      <figcaption className="ep-media-cap">
        <span className="ep-media-caption">{m.caption}</span>
        <span className="ep-media-credit">{m.credit}</span>
        <details className="ep-media-details">
          <summary>Image details</summary>
          <dl>
            <dt>What it shows</dt><dd>{m.caption}</dd>
            <dt>When</dt><dd>{mediaBadge(m)}</dd>
            <dt>Credit &amp; licence</dt>
            <dd>
              {m.credit}
              {m.licenseUrl !== null && (<> · <a href={m.licenseUrl} target="_blank" rel="noreferrer">licence</a></>)}
              {' · '}<a href={m.sourceUrl} target="_blank" rel="noreferrer">source</a>
            </dd>
            <dt>Role in this story</dt>
            <dd>{m.role === 'sourced_illustration' ? 'General illustration of the technology' : 'Present-day context — not a historical photograph'}</dd>
            {m.linkLimitations !== null && (<><dt>Limitations</dt><dd>{m.linkLimitations}</dd></>)}
          </dl>
        </details>
      </figcaption>
    </figure>
  );
}

export function ExplorePreviewShell({ view, evidenceHref }: { view: ChaptersView; evidenceHref: string }) {
  const chapters = view.chapters;
  const [active, setActive] = useState(0);
  const [pane, setPane] = useState<Pane>('story');
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [mapPhase, setMapPhase] = useState<MapPhase>('initializing');
  const [mapReason, setMapReason] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (): void => setReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const chapter: ChapterView | undefined = chapters[active];
  const anchors = useMemo(() => chapter?.anchors ?? [], [chapter]);
  const heroMedia = chapter?.media[0] ?? null;

  const onMapEvent = (event: MapEvent, reason?: string): void => {
    if (reason !== undefined) setMapReason(reason);
    setMapPhase((p) => nextMapPhase(p, event));
  };
  const fatal = mapIsFatal(mapPhase);
  const showLoadingOverlay = mapPhase === 'initializing' || mapPhase === 'loading_style';

  const goTo = (i: number): void => { setActive(i); setEvidenceOpen(false); };

  if (chapter === undefined) return null;

  return (
    <div className="ep-shell" data-pane={pane}>
      <header className="ep-topbar">
        <Link className="ep-back" href="/atlas">← Atlas</Link>
        <span className="ep-wordmark">WHY HERE?</span>
        <span className="ep-title">The Netherlands &amp; the machines that print chips</span>
        <span className="ep-preview-pill">Visual story preview</span>
      </header>

      <nav className="ep-segmented" aria-label="Preview view">
        {(['story', 'map'] as Pane[]).map((p) => (
          <button key={p} type="button" className="ep-seg-btn" aria-pressed={pane === p} onClick={() => setPane(p)}>
            {p === 'story' ? 'Story' : 'Map'}
          </button>
        ))}
      </nav>

      <div className="ep-body">
        {/* Spatial surface */}
        <section className="ep-stage" aria-label="Map">
          {!fatal && (
            <ExplorePreviewMap anchors={anchors} reducedMotion={reducedMotion} onEvent={onMapEvent} />
          )}
          {showLoadingOverlay && <div className="ep-map-status" role="status">Loading map…</div>}
          {fatal && (
            <div className="ep-map-fallback" role="group" aria-label="Places in this chapter">
              <p className="ep-map-fallback-reason">
                {mapPhase === 'webgl_unavailable'
                  ? 'The interactive map is unavailable on this device.'
                  : `The map could not be loaded${mapReason !== null ? ` (${mapReason})` : ''}.`}
              </p>
              {anchors.length > 0 ? (
                <ul className="ep-place-list">
                  {anchors.map((a) => <li key={a.placeId}>{a.name}</li>)}
                </ul>
              ) : <p className="ep-place-empty">No map location for this chapter.</p>}
            </div>
          )}
          <p className="ep-map-note" aria-hidden={fatal}>
            {anchors.length > 0
              ? 'These are addresses recorded for project organisations. They do not establish where project work physically took place.'
              : 'This chapter has no mapped location.'}
          </p>
        </section>

        {/* Visual story rail */}
        <article className="ep-rail" aria-label="Story">
          <div className="ep-progress">
            <span className="ep-progress-count">Chapter {active + 1} of {chapters.length}</span>
            <span className={`ep-support ep-support-${chapter.supportStatus}`}>{chapter.supportLabel}</span>
          </div>

          {heroMedia !== null && <MediaFigure m={heroMedia} />}

          {chapter.periodLabel !== null && <p className="ep-period">{chapter.periodLabel}</p>}
          <h1 className="ep-chapter-title">{chapter.title}</h1>
          <p className="ep-what">{chapter.whatHappened}</p>

          <div className="ep-why">
            <h2 className="ep-why-h">Why it matters</h2>
            <p>{chapter.whyItMatters}</p>
          </div>

          {/* Contribution-to-question boundaries — compact, plain language. */}
          <dl className="ep-contrib">
            <div className="ep-contrib-row ep-contrib-does">
              <dt>What this helps explain</dt>
              <dd>{chapter.whatThisExplains}</dd>
            </div>
            <div className="ep-contrib-row ep-contrib-not">
              <dt>What this does not yet explain</dt>
              <dd>{chapter.whatThisDoesNotExplain}</dd>
            </div>
          </dl>

          {chapter.limitations.trim() !== '' && (
            <p className={`ep-boundary${chapter.supportStatus === 'partially_supported' ? ' ep-boundary-strong' : ''}`}>
              <span className="ep-boundary-label">What this doesn’t show</span>
              {chapter.limitations}
            </p>
          )}

          {/* Extra media beyond the hero */}
          {chapter.media.length > 1 && (
            <div className="ep-media-extra">
              {chapter.media.slice(1).map((m) => <MediaFigure key={m.id} m={m} />)}
            </div>
          )}

          <div className="ep-actions">
            <button type="button" className="ep-evidence-btn" aria-expanded={evidenceOpen} onClick={() => setEvidenceOpen((v) => !v)}>
              {evidenceOpen ? 'Hide evidence' : 'View evidence'}
            </button>
          </div>

          {evidenceOpen && (
            <section className="ep-evidence" aria-label="Evidence behind this chapter">
              <p className="ep-evidence-lead">Every sentence above traces to these sourced findings.</p>
              <ol className="ep-claim-list">
                {chapter.evidence.map((c) => (
                  <li key={c.id} className="ep-claim">
                    <p className="ep-claim-statement">{c.statement}</p>
                    <p className="ep-claim-meta">
                      <span className="ep-claim-epi">{c.epistemicLabel}</span>
                      {c.sources.map((s, i) => (
                        <span key={i} className="ep-claim-src">{s.title} — {s.locator}</span>
                      ))}
                    </p>
                  </li>
                ))}
              </ol>
              {chapter.limitations.trim() !== '' && (
                <p className="ep-evidence-limits"><strong>Limitations:</strong> {chapter.limitations}</p>
              )}
              <Link className="ep-evidence-link" href={evidenceHref}>Open the full evidence workspace →</Link>
            </section>
          )}

          {/* Compact chapter timeline */}
          <nav className="ep-timeline" aria-label="Chapters">
            {chapters.map((c, i) => (
              <button key={c.id} type="button" className="ep-tl-item" aria-current={i === active} onClick={() => goTo(i)}>
                <span className="ep-tl-period">{c.periodLabel ?? '—'}</span>
                <span className="ep-tl-title">{c.title}</span>
              </button>
            ))}
          </nav>

          {/* Honest frontier */}
          <section className="ep-gaps" aria-label="Open questions">
            <h2 className="ep-gaps-h">What the evidence still cannot answer</h2>
            <p className="ep-gaps-lead">
              This is an honest map of the edge of the research — questions the current
              sources do not settle, not gaps we are hiding.
            </p>
            <ul className="ep-gaps-list">
              {view.researchGaps.map((g) => (
                <li key={g.title} className="ep-gap">
                  <span className="ep-gap-title">{g.title}</span>
                  <span className="ep-gap-q">{g.question}</span>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </div>
    </div>
  );
}
