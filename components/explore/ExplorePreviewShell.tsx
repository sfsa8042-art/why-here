'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';

import { mapIsFatal, nextMapPhase, type MapEvent, type MapPhase } from '@/lib/mapStatus';
import type { ChaptersView, ChapterView } from '@/lib/chapters';
import type { CoverView, MediaItemView } from '@/lib/media';
import { LithographyDiagram } from './LithographyDiagram.tsx';
import { LithographyStepExplainer } from './LithographyStepExplainer.tsx';
import { ChapterEvidence } from './ChapterEvidence.tsx';
import { StoryPhoto, PhotoStrip } from './StoryPhoto.tsx';

/** Named top-level destinations — desktop nav, mobile menu and progress. */
const SECTIONS = [
  { id: 'hero', label: 'Overview' },
  { id: 'explainer', label: 'What is lithography?' },
  { id: 'chapter-1', label: '1984 · Joint venture' },
  { id: 'chapter-2', label: '1983–1988 · Crisis' },
  { id: 'chapter-3', label: '1988–1991 · European network' },
  { id: 'frontier', label: 'Open questions' },
];

/** Editorial hero context numbers (chapters · minutes · documented findings). */
export interface HeroMeta { chapters: number; minutes: number; findings: number }

/** One clear next action at the end of a section — the reading flow is linear. */
function ContinueCta({ href, label }: { href: string; label: string }) {
  return (
    <div className="section-continue" data-reveal>
      <a className="continue-btn" href={href}>{label}<span aria-hidden="true"> ↓</span></a>
    </div>
  );
}

/* The MapLibre surface is the only client-only, WebGL-touching boundary. */
const ExploreStoryMap = dynamic(() => import('./ExploreStoryMap.tsx'), {
  ssr: false,
  loading: () => <div className="esm-status" role="status">Loading map…</div>,
});

/* ---- media helpers ----------------------------------------------- */

/** Split a chapter's media into real photographs and the (optional) diagram. */
function splitMedia(ch: ChapterView): { photos: MediaItemView[]; diagram: MediaItemView | null } {
  return {
    photos: ch.media.filter((m) => m.type !== 'diagram'),
    diagram: ch.media.find((m) => m.type === 'diagram') ?? null,
  };
}

/** Chapter ending: one establishing sentence + a compact "what it does not" disclosure. */
function ChapterBoundary({ ch }: { ch: ChapterView }) {
  return (
    <div className="cb" data-reveal>
      <p className="cb-est"><span className="cb-est-label">What this chapter establishes</span>{ch.whatThisExplains}</p>
      <details className="cb-not">
        <summary>What it does not establish</summary>
        <p>{ch.whatThisDoesNotExplain}</p>
        {ch.limitations.trim() !== '' && <p className="cb-not-detail">{ch.limitations}</p>}
      </details>
    </div>
  );
}

/* ---- Chapter 1: assembly visual ---------------------------------- */
function Chapter1Visual() {
  return (
    <div className="c1viz" data-reveal aria-hidden="true">
      <div className="c1-parents">
        <div className="c1-parent"><span className="c1-parent-name">Philips</span></div>
        <div className="c1-parent"><span className="c1-parent-name">ASM International</span></div>
      </div>
      <svg className="c1-flow" viewBox="0 0 300 60" preserveAspectRatio="none" aria-hidden="true">
        <path className="c1-stream" d="M40 6 C120 6 150 54 150 54" />
        <path className="c1-stream" d="M260 6 C180 6 150 54 150 54" />
      </svg>
      <div className="c1-venture">
        <span className="c1-venture-name">ASM Lithography</span>
        <span className="c1-venture-year">1984</span>
      </div>
      <div className="c1-notes">
        <span className="c1-chip">≈ ƒ7m from each parent</span>
        <span className="c1-chip">47 staff moved across — most reluctantly</span>
        <span className="c1-chip is-missing">State venture-capital backer — considered, never joined</span>
      </div>
    </div>
  );
}

/* ---- Chapter 2: event-led beats (each traceable to the chapter's Claims) --- */
const CH2_EVENTS = [
  { date: 'October 1983', label: 'Hydraulic-stage problems', note: 'Reports flag noise, vibration and oil contamination in the PAS 2000’s hydraulic stage.' },
  { date: 'October 1983', label: 'Commercialisation gaps documented', note: 'A second report lists gaps in lens quality, subassembly supply, boards, six-inch wafers and the reticle.' },
  { date: 'Summer 1987', label: 'Philips advances ƒ13.5 million', note: 'Philips advances the sum to the venture on ASM International’s behalf.' },
  { date: '31 July 1988', label: 'ASM International withdraws', note: 'ASM International leaves the joint venture.' },
  { date: '1988', label: 'Philips acquires ASM’s 50% stake', note: 'Philips buys out the stake for ƒ8.6 million.' },
];

/** The full, event-led Chapter 2 — a contextual interlude, large event beats,
 *  a clean technical illustration, then evidence and a technology photo strip. */
function Chapter2Section({
  ch, evidenceHref, interludePhoto, sourceDiagram, techStrip,
}: {
  ch: ChapterView; evidenceHref: string;
  interludePhoto: MediaItemView | null; sourceDiagram: MediaItemView | null; techStrip: MediaItemView[];
}) {
  return (
    <section className="chapter chapter--events" id="chapter-2" tabIndex={-1} data-section="chapter-2">
      <div className="chapter-head" data-reveal>
        <p className="chapter-period">{ch.periodLabel}</p>
        <h2 className="chapter-title">{ch.title}</h2>
      </div>

      {interludePhoto !== null && (
        <div className="c2-interlude" data-reveal>
          <p className="c2-interlude-h">What semiconductor production looked like in Europe at the time</p>
          <StoryPhoto m={interludePhoto} variant="wide" overlayLabel="East Germany, 1989 — not ASM Lithography" />
        </div>
      )}

      <div className="c2-events" data-reveal>
        <ol className="c2-beats" aria-label="Documented sequence of events">
          {CH2_EVENTS.map((e, i) => (
            <li key={i} className="c2-beat">
              <span className="c2-beat-date">{e.date}</span>
              <span className="c2-beat-spine" aria-hidden="true"><span className="c2-beat-dot" /></span>
              <span className="c2-beat-body">
                <span className="c2-beat-label">{e.label}</span>
                <span className="c2-beat-note">{e.note}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="chapter-mechanism">The sequence is documented. The complete survival mechanism is not.</p>
        <details className="c2-fullaccount">
          <summary>Read the full account</summary>
          <p>{ch.whatHappened}</p>
        </details>
      </div>

      <div className="c2-tech" data-reveal>
        <LithographyDiagram />
        <p className="c2-tech-cap">Simplified technical illustration — not a specific PAS machine</p>
        {sourceDiagram !== null && (
          <details className="c2-srcdiagram">
            <summary>The licensed source method diagram</summary>
            <StoryPhoto m={sourceDiagram} variant="wide" />
          </details>
        )}
      </div>

      <div className="c2-evidence" data-reveal>
        <ChapterEvidence evidence={ch.evidence} summary={ch.evidenceSummary} workspaceHref={evidenceHref} />
      </div>

      {techStrip.length > 0 && (
        <div className="chapter-strip" data-reveal>
          <p className="strip-label">Technology context</p>
          <PhotoStrip photos={techStrip} label="Technology context" />
        </div>
      )}

      <div className="chapter-foot"><ChapterBoundary ch={ch} /></div>
      <ContinueCta href="#chapter-3" label="Continue to the European network" />
    </section>
  );
}

/* ---- Chapter 3: consortium network ------------------------------- */
function ConsortiumNetwork({ ch }: { ch: ChapterView }) {
  const coordinator = ch.networkOrgs.find((o) => o.role === 'coordinator');
  const participants = ch.networkOrgs.filter((o) => o.role === 'participant');
  return (
    <div className="c3-net" data-reveal>
      <p className="c3-net-h">The consortium</p>
      {coordinator !== undefined && (
        <div className="c3-hub">
          <span className="c3-hub-role">Coordinator</span>
          <span className="c3-hub-name">{coordinator.name}</span>
          {coordinator.placeName !== null && <span className="c3-onmap">◍ {coordinator.placeName}</span>}
        </div>
      )}
      <ul className="c3-parts">
        {participants.map((o) => (
          <li key={o.name} className="c3-part">
            <span className="c3-part-name">{o.name}</span>
            {o.placeName !== null
              ? <span className="c3-onmap">◍ {o.placeName}</span>
              : <span className="c3-offmap">listed participant</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ================================================================== */

export function ExplorePreviewShell({ view, evidenceHref, heroImage, heroMeta, heroCaption, heroContextNote }: { view: ChaptersView; evidenceHref: string; heroImage: CoverView | null; heroMeta: HeroMeta; heroCaption?: string | undefined; heroContextNote?: string | undefined }) {
  const chapters = view.chapters;
  const [reducedMotion, setReducedMotion] = useState(true);
  const [motionOn, setMotionOn] = useState(false);
  const [mapPhase, setMapPhase] = useState<MapPhase>('initializing');
  const [activeIdx, setActiveIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const ch3 = chapters.find((c) => c.id === 'nl-ch-european-coordination') ?? null;
  const ch3Anchors = ch3?.anchors ?? [];
  const m1 = chapters[0] ? splitMedia(chapters[0]) : null;
  const m2 = chapters[1] ? splitMedia(chapters[1]) : null;
  const m3 = ch3 ? splitMedia(ch3) : null;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = (): void => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // Motion is progressive enhancement: content is fully visible without it.
  useEffect(() => {
    const root = rootRef.current;
    // Never hide content unless we can also reveal it (reduced motion OR no
    // IntersectionObserver ⇒ no motion build, everything stays visible).
    if (reducedMotion || root === null || typeof IntersectionObserver === 'undefined') { setMotionOn(false); return; }
    setMotionOn(true);
    const els = Array.from(root.querySelectorAll('[data-reveal]'));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('is-entered'); }),
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [reducedMotion]);

  // Track the active section for the compact mobile navigation/progress.
  useEffect(() => {
    const root = rootRef.current;
    if (root === null || typeof IntersectionObserver === 'undefined') return;
    const ratios = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) ratios.set((e.target as HTMLElement).dataset['section'] ?? '', e.intersectionRatio);
        let best = SECTIONS[0]!.id, bestR = -1;
        for (const s of SECTIONS) { const r = ratios.get(s.id) ?? 0; if (r > bestR) { bestR = r; best = s.id; } }
        const idx = SECTIONS.findIndex((s) => s.id === best);
        if (idx >= 0) setActiveIdx(idx);
      },
      { threshold: [0.1, 0.3, 0.6] },
    );
    for (const s of SECTIONS) { const el = root.querySelector(`[data-section="${s.id}"]`); if (el) io.observe(el); }
    return () => io.disconnect();
  }, []);

  // Thin reading-progress indicator (fraction of the document scrolled).
  useEffect(() => {
    const root = rootRef.current;
    if (root === null) return;
    const onScroll = (): void => {
      const max = root.scrollHeight - root.clientHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, root.scrollTop / max)) : 0);
    };
    onScroll();
    root.addEventListener('scroll', onScroll, { passive: true });
    return () => root.removeEventListener('scroll', onScroll);
  }, []);

  const onMapEvent = (event: MapEvent): void => setMapPhase((p) => nextMapPhase(p, event));
  const mapFatal = mapIsFatal(mapPhase);

  const anchorProps = (id: string) => ({ id, tabIndex: -1, 'data-section': id });

  return (
    <div className={`ep-doc${motionOn ? ' ep-doc--motion' : ''}`} ref={rootRef}>
      {/* Desktop: named sticky section navigation + thin reading progress. */}
      <nav className="ep-nav ep-nav--full" aria-label="Story sections">
        <Link className="ep-nav-home" href="/atlas">← Atlas</Link>
        <ul className="ep-nav-list">
          {SECTIONS.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} aria-current={i === activeIdx ? 'true' : undefined}>{s.label}</a>
            </li>
          ))}
        </ul>
        <Link className="ep-nav-evidence" href={evidenceHref}>Sources</Link>
        <span className="ep-progress" aria-hidden="true"><span className="ep-progress-bar" style={{ transform: `scaleX(${progress})` }} /></span>
      </nav>

      {/* Mobile: compact control showing the CURRENT section name + a full menu. */}
      <nav className="ep-nav-mobile" aria-label="Story sections">
        <Link className="ep-nav-home" href="/atlas">← Atlas</Link>
        <button type="button" className="ep-nav-toggle" aria-expanded={navOpen} aria-controls="ep-nav-sheet" onClick={() => setNavOpen((v) => !v)}>
          <span className="ep-nav-current">{SECTIONS[activeIdx]!.label}</span>
          <span className="ep-nav-caret" aria-hidden="true">{navOpen ? '▲' : '▾'}</span>
        </button>
        <span className="ep-progress ep-progress--mobile" aria-hidden="true"><span className="ep-progress-bar" style={{ transform: `scaleX(${progress})` }} /></span>
        {navOpen && (
          <div className="ep-nav-sheet-wrap">
            <div className="ep-nav-sheet-head">
              <span>Jump to</span>
              <button type="button" className="ep-nav-close" aria-label="Close menu" onClick={() => setNavOpen(false)}>✕</button>
            </div>
            <ul id="ep-nav-sheet" className="ep-nav-sheet">
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} aria-current={i === activeIdx ? 'true' : undefined} onClick={() => setNavOpen(false)}>{s.label}</a>
                </li>
              ))}
              <li className="ep-nav-sheet-evidence">
                <Link href={evidenceHref} onClick={() => setNavOpen(false)}>Sources — the full research record →</Link>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* 1 — HERO — split editorial: dark content panel + a bounded photographic panel. */}
      <header className="hero" {...anchorProps('hero')}>
        <div className="hero-grid">
          <div className="hero-content">
            <p className="hero-eyebrow">Netherlands × Semiconductor equipment</p>
            <h1 className="hero-title">Why did advanced chip-making equipment take root in the Netherlands?</h1>
            <p className="hero-sub">A visual investigation into a fragile 1984 joint venture, its early crisis and the European research network around it.</p>
            <p className="hero-meta">
              <span>{heroMeta.chapters} chapters</span><span className="hero-meta-sep">·</span>
              <span>About {heroMeta.minutes} minutes</span><span className="hero-meta-sep">·</span>
              <span>{heroMeta.findings} documented findings</span>
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#explainer">Start the investigation</a>
              <Link className="btn btn-ghost" href={evidenceHref}>View sources</Link>
            </div>
            <p className="hero-status"><span className="hero-status-dot" aria-hidden="true" />Research in progress</p>
          </div>

          <figure className="hero-media">
            {heroImage !== null && (
              <div className="hero-media-frame">
                <Image
                  src={heroImage.src}
                  alt={heroImage.alt}
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, (max-width: 2000px) 50vw, 980px"
                  className="hero-media-img"
                />
                <span className="hero-media-badge">{heroImage.presentationLabel}</span>
              </div>
            )}
            {heroImage !== null && (
              <figcaption className="hero-media-cap">
                <span className="hero-media-cap-main">{heroCaption ?? heroImage.title}</span>
                {heroContextNote !== undefined && (
                  <span className="hero-media-cap-note">{heroContextNote}</span>
                )}
                {heroImage.creator !== null && (
                  <span className="hero-media-cap-credit">{heroImage.creator}</span>
                )}
              </figcaption>
            )}
          </figure>
        </div>

        <a className="hero-scrollcue" href="#explainer" aria-label="Scroll to start">
          <span className="hero-scrollcue-label">Scroll</span>
          <span className="hero-scrollcue-arrow" aria-hidden="true">↓</span>
        </a>
      </header>

      {/* 2 — EXPLAINER — interactive, plain-language "what does a lithography machine do?" */}
      <section className="explain" {...anchorProps('explainer')}>
        <div className="explain-inner" data-reveal>
          <p className="section-eyebrow">Before the story</p>
          <h2 className="section-title">Before the story: what does a lithography machine do?</h2>
          <p className="explain-lead">
            Think of it as an ultra-precise projector. Light carries a circuit pattern through a
            mask and a system of lenses onto a silicon wafer.
          </p>
          <LithographyStepExplainer />
          <p className="explain-tag">Introductory technical context — a general, non-controversial description of the process.</p>
        </div>
        <ContinueCta href="#chapter-1" label="Continue to the 1984 joint venture" />
      </section>

      {/* 3 — CHAPTER 1 — historical Philips heritage photo + assembly diagram + photo strip */}
      {chapters[0] && m1 && (
        <StoryChapter ch={chapters[0]} sectionId="chapter-1" evidenceHref={evidenceHref}
          leadPhoto={m1.photos[0] ?? null} stripPhotos={m1.photos.slice(1)}
          visual={<Chapter1Visual />}
          continueHref="#chapter-2" continueLabel="Continue to the early crisis" />
      )}

      {/* 4 — CHAPTER 2 — event-led: contextual interlude, large beats, clean diagram */}
      {chapters[1] && m2 && (
        <Chapter2Section ch={chapters[1]} evidenceHref={evidenceHref}
          interludePhoto={m2.photos[0] ?? null} sourceDiagram={m2.diagram} techStrip={m2.photos.slice(1)} />
      )}

      {/* 5 — CHAPTER 3 (map-led) */}
      {ch3 && (
        <section className="chapter chapter--map" {...anchorProps('chapter-3')}>
          <div className="chapter-head" data-reveal>
            <p className="chapter-period">{ch3.periodLabel}</p>
            <h2 className="chapter-title">{ch3.title}</h2>
            <p className="chapter-idea">The venture was small. Its technical network was not.</p>
          </div>
          <div className="c3-stage">
            <div className="c3-map">
              {!mapFatal && <ExploreStoryMap anchors={ch3Anchors} reducedMotion={reducedMotion} onEvent={onMapEvent} />}
              {mapFatal && (
                <div className="esm-fallback" role="group" aria-label="Mapped places">
                  <p>The interactive map is unavailable on this device.</p>
                  <ul>{ch3Anchors.map((a) => <li key={a.placeId}>{a.name}</li>)}</ul>
                </div>
              )}
            </div>
            <div className="c3-side" data-reveal>
              <p className="chapter-prose">{ch3.whatHappened}</p>
              <ConsortiumNetwork ch={ch3} />
              <ChapterEvidence evidence={ch3.evidence} summary={ch3.evidenceSummary} workspaceHref={evidenceHref} />
            </div>
          </div>
          {m3 && m3.photos.length > 0 && (
            <div className="chapter-strip chapter-strip--wide" data-reveal>
              <p className="strip-label">The local base — present-day context</p>
              <PhotoStrip photos={m3.photos} label="Local context — Veldhoven and Eindhoven" />
            </div>
          )}
          <div className="chapter-foot"><ChapterBoundary ch={ch3} /></div>
          <ContinueCta href="#frontier" label="See what remains unanswered" />
        </section>
      )}

      {/* 6 — RESEARCH FRONTIER */}
      <section className="frontier" {...anchorProps('frontier')}>
        <div className="frontier-inner" data-reveal>
          <p className="section-eyebrow">The honest edge of the research</p>
          <h2 className="section-title">What we still cannot answer</h2>
          <div className="frontier-themes">
            {view.researchThemes.map((t) => (
              <article key={t.theme} className="theme">
                <h3 className="theme-title">{t.title}</h3>
                <ul className="theme-gaps">
                  {t.gaps.map((g) => (
                    <li key={g.title} className="theme-gap">
                      <details>
                        <summary>{g.title}</summary>
                        <p>{g.question}</p>
                      </details>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="frontier-grow">This atlas grows as the evidence grows.</p>
          <div className="frontier-actions">
            <Link className="btn btn-primary" href={evidenceHref}>View all sources</Link>
            <Link className="btn btn-ghost" href="/atlas">Return to the atlas</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* A standard (non-map) story chapter: big date anchor, an image-led lead photo,
 * the diagram/story two-column, a photo strip between beats, then the boundary. */
function StoryChapter({
  ch, sectionId, evidenceHref, visual, compactBoundary, leadPhoto = null, stripPhotos = [], continueHref, continueLabel,
}: {
  ch: ChapterView; sectionId: string; evidenceHref: string;
  visual: React.ReactNode; compactBoundary?: string;
  leadPhoto?: MediaItemView | null; stripPhotos?: MediaItemView[];
  continueHref?: string; continueLabel?: string;
}) {
  return (
    <section className="chapter" id={sectionId} tabIndex={-1} data-section={sectionId}>
      <div className="chapter-head" data-reveal>
        <p className="chapter-period">{ch.periodLabel}</p>
        <h2 className="chapter-title">{ch.title}</h2>
      </div>
      {leadPhoto !== null && (
        <div className="chapter-lead" data-reveal>
          <StoryPhoto m={leadPhoto} variant="wide" />
        </div>
      )}
      <div className="chapter-body">
        <div className="chapter-visual">{visual}</div>
        <div className="chapter-text" data-reveal>
          <p className="chapter-prose">{ch.whatHappened}</p>
          {compactBoundary !== undefined && <p className="chapter-mechanism">{compactBoundary}</p>}
          <ChapterEvidence evidence={ch.evidence} summary={ch.evidenceSummary} workspaceHref={evidenceHref} />
        </div>
      </div>
      {stripPhotos.length > 0 && (
        <div className="chapter-strip" data-reveal>
          <PhotoStrip photos={stripPhotos} label={`More images — ${ch.title}`} />
        </div>
      )}
      <div className="chapter-foot"><ChapterBoundary ch={ch} /></div>
      {continueHref !== undefined && continueLabel !== undefined && <ContinueCta href={continueHref} label={continueLabel} />}
    </section>
  );
}
