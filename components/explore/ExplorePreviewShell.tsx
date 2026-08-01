'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { mapIsFatal, nextMapPhase, type MapEvent, type MapPhase } from '@/lib/mapStatus';
import type { ChaptersView, ChapterView } from '@/lib/chapters';
import type { CoverView, MediaItemView } from '@/lib/media';
import { LithographyExplainer } from './LithographyExplainer.tsx';
import { LithographyDiagram } from './LithographyDiagram.tsx';
import { ChapterEvidence } from './ChapterEvidence.tsx';
import { StoryPhoto, PhotoStrip } from './StoryPhoto.tsx';

/** Top-level story sections, for the compact mobile navigation + progress. */
const SECTIONS = [
  { id: 'hero', label: 'Start' },
  { id: 'explainer', label: 'How it works' },
  { id: 'chapter-1', label: '1 · A fragile joint venture' },
  { id: 'chapter-2', label: '2 · Crisis' },
  { id: 'chapter-3', label: '3 · European coordination' },
  { id: 'frontier', label: 'Open questions' },
];

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

export function ExplorePreviewShell({ view, evidenceHref, heroImage }: { view: ChaptersView; evidenceHref: string; heroImage: CoverView | null }) {
  const chapters = view.chapters;
  const [reducedMotion, setReducedMotion] = useState(true);
  const [motionOn, setMotionOn] = useState(false);
  const [mapPhase, setMapPhase] = useState<MapPhase>('initializing');
  const [activeIdx, setActiveIdx] = useState(0);
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

  const onMapEvent = (event: MapEvent): void => setMapPhase((p) => nextMapPhase(p, event));
  const mapFatal = mapIsFatal(mapPhase);

  const anchorProps = (id: string) => ({ id, tabIndex: -1, 'data-section': id });

  return (
    <div className={`ep-doc${motionOn ? ' ep-doc--motion' : ''}`} ref={rootRef}>
      {/* Desktop: full sticky section navigation (anchor links; keyboard-accessible). */}
      <nav className="ep-nav ep-nav--full" aria-label="Story sections">
        <Link className="ep-nav-home" href="/atlas">← Atlas</Link>
        <a href="#hero">Start</a>
        <a href="#explainer">How it works</a>
        <a href="#chapter-1" aria-label="Chapter 1: A fragile joint venture">1</a>
        <a href="#chapter-2" aria-label="Chapter 2: Crisis without a proven mechanism">2</a>
        <a href="#chapter-3" aria-label="Chapter 3: European coordination">3</a>
        <a href="#frontier">Open questions</a>
      </nav>

      {/* Mobile: compact navigation — home, a section/progress control, and a menu. */}
      <nav className="ep-nav-mobile" aria-label="Story sections">
        <Link className="ep-nav-home" href="/atlas">← Atlas</Link>
        <button type="button" className="ep-nav-toggle" aria-expanded={navOpen} aria-controls="ep-nav-sheet" onClick={() => setNavOpen((v) => !v)}>
          <span className="ep-nav-pos">{activeIdx + 1} / {SECTIONS.length}</span>
          <span className="ep-nav-current">{SECTIONS[activeIdx]!.label}</span>
          <span className="ep-nav-caret" aria-hidden="true">{navOpen ? '▲' : '▾'}</span>
        </button>
        {navOpen && (
          <ul id="ep-nav-sheet" className="ep-nav-sheet">
            {SECTIONS.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} aria-current={i === activeIdx ? 'true' : undefined} onClick={() => setNavOpen(false)}>{s.label}</a>
              </li>
            ))}
          </ul>
        )}
      </nav>

      {/* 1 — HERO — a real Eindhoven photograph, grounded, with the optical graphic overlaid */}
      <header className="hero" {...anchorProps('hero')}>
        {heroImage !== null && (
          <div className="hero-photo" aria-hidden="true">
            <img src={heroImage.src} alt="" width={heroImage.width} height={heroImage.height} />
            <div className="hero-scrim" />
          </div>
        )}
        <div className="hero-optic" aria-hidden="true"><LithographyExplainer labelled={false} /></div>
        <div className="hero-inner">
          <p className="hero-eyebrow">Netherlands × Semiconductor Equipment</p>
          <h1 className="hero-title">Why did advanced chip-making equipment take root here?</h1>
          <p className="hero-sub">In 1984, Philips and ASM assembled a new lithography venture from staff, technology and financial commitments.</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#explainer">Begin the story</a>
            <a className="btn btn-ghost" href="#chapter-1">See what the evidence supports</a>
          </div>
          <p className="hero-locref" aria-hidden="true"><span className="hero-dot" /> Eindhoven <span className="hero-dot" /> Veldhoven, the Netherlands</p>
        </div>
        {heroImage !== null && (
          <p className="hero-photo-credit">
            <span className="hero-photo-badge">{heroImage.presentationLabel}</span>
            {heroImage.title}{heroImage.creator !== null ? ` · ${heroImage.creator}` : ''}
          </p>
        )}
        <p className="hero-status">Research in progress · internal preview</p>
      </header>

      {/* 2 — WHY THIS MATTERS / EXPLAINER */}
      <section className="explain" {...anchorProps('explainer')}>
        <div className="explain-inner" data-reveal>
          <p className="section-eyebrow">Why this matters</p>
          <h2 className="section-title">First, what is lithography?</h2>
          <p className="explain-lead">
            Lithography is how the patterns inside a computer chip get printed. A precise
            light source shines through a patterned mask onto a light-sensitive wafer, and
            the pattern is exposed field by field — repeated across the wafer, and repeated
            again for every layer of the chip. Doing it well demands extraordinary precision.
            This investigation follows how a Dutch venture began building capability in
            semiconductor lithography.
          </p>
          <p className="explain-tag">Introductory technical context — a general, non-controversial description of the process.</p>
          <LithographyExplainer />
        </div>
      </section>

      {/* 3 — CHAPTER 1 — historical Philips heritage photo + assembly diagram + photo strip */}
      {chapters[0] && m1 && (
        <StoryChapter ch={chapters[0]} sectionId="chapter-1" evidenceHref={evidenceHref}
          leadPhoto={m1.photos[0] ?? null} stripPhotos={m1.photos.slice(1)}
          visual={<Chapter1Visual />} />
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
            <Link className="btn btn-primary" href={evidenceHref}>Open full evidence workspace</Link>
            <Link className="btn btn-ghost" href="/atlas">Return to the world atlas</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* A standard (non-map) story chapter: big date anchor, an image-led lead photo,
 * the diagram/story two-column, a photo strip between beats, then the boundary. */
function StoryChapter({
  ch, sectionId, evidenceHref, visual, compactBoundary, leadPhoto = null, stripPhotos = [],
}: {
  ch: ChapterView; sectionId: string; evidenceHref: string;
  visual: React.ReactNode; compactBoundary?: string;
  leadPhoto?: MediaItemView | null; stripPhotos?: MediaItemView[];
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
    </section>
  );
}
