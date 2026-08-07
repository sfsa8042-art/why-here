/**
 * Landing (/) + map-first Atlas (/atlas) — Stage 9. The atlas shell renders to
 * static markup (the map is a dynamic ssr:false boundary, so no WebGL runs and the
 * map surface renders its loading placeholder). Asserts: the landing CTA into
 * /atlas, the map-first neutral atlas (no auto-selected country, no featured card
 * above the map), the per-country summary content on selection, accessible country
 * controls, the mobile bottom-sheet stylesheet — and that no research entities leak.
 * Also asserts the canonical Evidence/prototype routes and legacy redirects.
 */

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { AtlasIndexShell, CountrySummary } from '@/components/atlasindex/AtlasIndexShell.tsx';
import { caseBySlug, getAtlasCases } from '@/lib/atlasCases';
import { buildCountrySummaryView, getCountryPresentation, validateCountryPresentations } from '@/lib/atlasPresentation';
import { countryPresentations } from '@/content/atlas/presentation';
import HomePage from '@/app/page';
import AtlasIndexPage from '@/app/atlas/page';
import { buildNetherlandsResearchView } from '@/lib/researchViewModel';
import { CaseResearchView } from '@/components/research/CaseResearchView.tsx';
import EvidencePage from '@/app/evidence/netherlands-semiconductor-equipment/page';
import PrototypePage from '@/app/atlas/netherlands-semiconductor-equipment/prototype/page';
import nextConfig from '@/next.config';

const cases = [...getAtlasCases()];
const nl = caseBySlug(cases, 'netherlands-semiconductor-equipment')!;
const tw = caseBySlug(cases, 'taiwan-semiconductor-manufacturing')!;
const fr = caseBySlug(cases, 'france-luxury')!;

// The Atlas summary resolves from the typed country-presentation layer (not hardcoded).
const nlView = buildCountrySummaryView('netherlands-semiconductor-equipment')!;
const twView = buildCountrySummaryView('taiwan-semiconductor-manufacturing')!;
const frView = buildCountrySummaryView('france-luxury')!;
const NL_QUESTION = 'How did the Netherlands develop its strength in semiconductor lithography equipment?';

const noop = (): void => {};
const landingHtml = renderToStaticMarkup(<HomePage />);
const atlasHtml = renderToStaticMarkup(<AtlasIndexPage />);

const BANNED = ['world leader', 'dominant industry', 'leadership score', 'epistemic', 'evidence mode'];

describe('Landing page (/) — Stage 10.2 art direction', () => {
  const layoutSrc = readFileSync(join(process.cwd(), 'app/layout.tsx'), 'utf8');
  const cssSrc = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8');

  it('leads with the eyebrow + the editorial-documentary title/description (no ranking language)', () => {
    expect(landingHtml).toContain('WHY HERE?');
    expect(landingHtml).toContain('Why do industries take root in particular places?');
    expect(landingHtml).toContain('Explore the firms, institutions and historical decisions behind national industrial strengths.');
    for (const w of ['world-class', 'world leader', 'dominant', 'Why do countries excel']) expect(landingHtml).not.toContain(w);
  });

  it('renders the REAL generated atlas map as a local next/image (no external request)', () => {
    expect(landingHtml).toMatch(/\/_next\/image\?url=%2Flanding%2Fatlas-world\.webp/);
    expect(landingHtml).toContain('lhero-img');
    expect(landingHtml).toMatch(/alt="A world map from the Why Here\? atlas[^"]*"/);
    expect(landingHtml).not.toMatch(/src="https?:\/\//);
  });

  it('the old hand-drawn continent preview is completely gone', () => {
    for (const gone of ['lp-map', 'lp-land', 'lp-card', 'lp-marker', 'lp-lead', 'lp-legend', 'lmp-svg', 'lp-mlabel']) {
      expect(landingHtml).not.toContain(gone);
    }
  });

  it('has exactly ONE primary hero button (Explore the atlas -> /atlas) + a secondary featured link', () => {
    expect((landingHtml.match(/class="btn btn-primary lhero-cta"/g) ?? []).length).toBe(1);
    expect(landingHtml).toMatch(/class="btn btn-primary lhero-cta" href="\/atlas">Explore the atlas</);
    // one semantic featured-story link into the NL Explore route
    expect(landingHtml).toMatch(/class="lhero-featured" href="\/atlas\/netherlands-semiconductor-equipment"/);
    const hero = landingHtml.slice(landingHtml.indexOf('class="lhero"'), landingHtml.indexOf('class="lrail"'));
    expect((hero.match(/class="btn /g) ?? []).length).toBe(1);
  });

  it('the featured story is a compact stacked link (eyebrow / title / action), not a card', () => {
    const link = landingHtml.match(/<a class="lhero-featured" href="\/atlas\/netherlands-semiconductor-equipment">[\s\S]*?<\/a>/)?.[0] ?? '';
    expect(link).toContain('class="lf-eyebrow">Featured story');
    expect(link).toContain('class="lf-title">Netherlands × Semiconductor lithography');
    expect(link).toContain('class="lf-action-text">Explore story');
    // it is a link, never a bordered/filled card
    expect(landingHtml).not.toMatch(/class="lhero-featured"[^>]*style=/);
  });

  it('shows an accessible available/planned legend (text + indicator, not colour only)', () => {
    // each count is preceded by its status indicator, and is real text (SR-readable)
    expect(landingHtml).toMatch(/lhero-leg-dot--avail[\s\S]{0,40}?1 story available/);
    expect(landingHtml).toMatch(/lhero-leg-dot--planned[\s\S]{0,40}?2 planned/);
    expect(landingHtml).toContain('1 story available');
    expect(landingHtml).toContain('2 planned');
  });

  it('overlays country signals: Netherlands available, Taiwan & France planned (accessible list)', () => {
    expect(landingHtml).toMatch(/<ul class="lhero-signals" aria-label="Countries in the atlas"/);
    expect(landingHtml).toMatch(/class="lsig lsig--avail"[^]*?Netherlands[^]*?Lithography equipment[^]*?Story available/);
    expect(landingHtml).toMatch(/class="lsig lsig--planned"[^]*?France[^]*?Luxury[^]*?Planned/);
    expect(landingHtml).toMatch(/class="lsig lsig--planned"[^]*?Taiwan[^]*?Semiconductor manufacturing[^]*?Planned/);
  });

  it('the process rail has exactly three ordered steps (no bordered How-it-works cards)', () => {
    const iOne = landingHtml.indexOf('Choose a country');
    const iTwo = landingHtml.indexOf('Understand the industry');
    const iThree = landingHtml.indexOf('Trace how the strength developed');
    expect(iOne).toBeGreaterThan(-1);
    expect(iOne).toBeLessThan(iTwo);
    expect(iTwo).toBeLessThan(iThree);
    for (const n of ['01', '02', '03']) expect(landingHtml).toContain(`>${n}</span>`);
    expect((landingHtml.match(/class="lrail-step"/g) ?? []).length).toBe(3);
    for (const gone of ['lhow-step', 'lhow-list', 'Follow the story', 'Discover what it became']) expect(landingHtml).not.toContain(gone);
  });

  it('integrates the project proposition inside the hero (not an isolated band)', () => {
    expect(landingHtml).toContain('Geography explains where industries are.');
    expect(landingHtml).toContain('Why Here? investigates why they took root there.');
    expect(landingHtml).toContain('lhero-prop');
  });

  it('keeps the shared header subtitle and adds one atlas action', () => {
    expect(layoutSrc).toContain('Atlas of Industrial Strengths');
    expect(layoutSrc).not.toContain('Atlas of Industrial Advantage');
    expect(layoutSrc).toMatch(/className="topbar-atlas"[^>]*>Open atlas/);
  });

  it('ships reduced-motion-safe signal styling', () => {
    expect(cssSrc).toMatch(/@media \(prefers-reduced-motion: no-preference\)[\s\S]*\.lsig--avail \.lsig-pin \{[^}]*animation/);
  });

  it('keeps landing copy free of research jargon / leadership claims', () => {
    for (const term of ['well_supported', 'epistemicStatus', 'ClaimPlaceLink', 'nl-f-']) expect(landingHtml).not.toContain(term);
    const lower = landingHtml.toLowerCase();
    for (const phrase of BANNED) expect(lower).not.toContain(phrase);
  });
});

describe('Landing Taiwan overlay — measured geographic anchor', () => {
  const pageSrc = readFileSync(join(process.cwd(), 'app/page.tsx'), 'utf8');
  const cssSrc = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8');

  it('Taiwan coordinates come from the typed overlay record (measured asset %, not a hero guess)', () => {
    // a typed record with a separate geographic anchor and label offset
    expect(pageSrc).toMatch(/interface CountrySignal\b[\s\S]*?xPercent: number;[\s\S]*?labelOffsetX: number/);
    // Taiwan's slug carries the measured anchor percentages
    expect(pageSrc).toMatch(/slug:\s*'taiwan-semiconductor-manufacturing'[\s\S]*?xPercent:\s*79\.8[\s\S]*?yPercent:\s*62\.61/);
  });

  it('the geographic anchor and label offset are SEPARATE values', () => {
    expect(pageSrc).toMatch(/labelOffsetX:\s*\d/);
    expect(pageSrc).toMatch(/labelOffsetY:\s*-?\d/);
    // the <li> is placed by the anchor (left/top); the label body only by a transform
    expect(landingHtml).toMatch(/class="lsig lsig--planned" style="left:79\.8%;top:62\.61%">/);
    const tw = landingHtml.match(/style="left:79\.8%;top:62\.61%">[\s\S]*?<\/li>/)?.[0] ?? '';
    expect(tw).toContain('Taiwan');
    // the label carries its OWN offset transform (a right-edge country pulls the
    // text off the map edge) — a non-zero px translate distinct from the anchor
    const twOffset = tw.match(/class="lsig-body" style="transform:translate\((-?\d+)px, ?(-?\d+)px\)"/);
    expect(twOffset).not.toBeNull();
    expect(Math.abs(Number(twOffset![1])) + Math.abs(Number(twOffset![2]))).toBeGreaterThan(0);
  });

  it('the old hard-coded Taiwan position (86% / 63%) is absent from the component and CSS', () => {
    expect(pageSrc).not.toContain("'86%'");
    expect(pageSrc).not.toContain("'63%'");
    // no country coordinate lives in the stylesheet at all
    expect(cssSrc).not.toContain('86%');
    expect(cssSrc).not.toContain('79.8');
    expect(cssSrc).not.toContain('62.61');
  });

  it('Taiwan remains Planned', () => {
    expect(landingHtml).toMatch(/class="lsig lsig--planned"[\s\S]*?Taiwan[\s\S]*?Semiconductor manufacturing[\s\S]*?Planned/);
  });
});

describe('Atlas /atlas — map-first, neutral initial state', () => {
  it('leads with the compact heading + instruction and the map as the first product surface', () => {
    expect(atlasHtml).toContain('Explore the atlas');
    expect(atlasHtml).toContain('Select a country to discover what it became exceptionally good at — and how that strength developed.');
    // the map stage is present (its loading placeholder renders under ssr:false)
    expect(atlasHtml).toContain('atlas9-stage');
    expect(atlasHtml).toContain('Loading atlas map');
  });

  it('shows NO Netherlands featured card or full case list above the map', () => {
    for (const removed of ['Featured investigation', 'ax-featured', 'ax-case-list', 'Start the investigation', 'aip-cta']) {
      expect(atlasHtml).not.toContain(removed);
    }
  });

  it('opens in a neutral state — no country selected, no summary panel, and a "Select a country" cue', () => {
    // no summary panel is rendered (nothing selected)
    expect(atlasHtml).not.toContain('atlas9-panel');
    // the neutral world-view cue is shown
    expect(atlasHtml).toContain('atlas9-hint');
    expect(atlasHtml).toContain('Select a country');
  });

  it('does NOT auto-select the Netherlands (its summary question/CTAs are absent on load)', () => {
    expect(atlasHtml).not.toContain(NL_QUESTION);
    expect(atlasHtml).not.toContain('Explore the story');
  });

  it('keeps filters (Industry, Research status, Reset) and no others', () => {
    expect(atlasHtml).toContain('Industry');
    expect(atlasHtml).toContain('Research status');
    expect(atlasHtml).toContain('Reset');
  });

  it('exposes an accessible, keyboard-operable country control for every visible country', () => {
    // the map markers are keyboard-accessible too (see the map-marker test below);
    // the "Browse countries" list is the ALTERNATIVE keyboard/SR path.
    expect(atlasHtml).toContain('Browse countries');
    const btnCount = (atlasHtml.match(/class="atlas9-country-btn"/g) ?? []).length;
    expect(btnCount).toBe(3);
    for (const country of ['Netherlands', 'Taiwan', 'France']) expect(atlasHtml).toContain(country);
  });

  it('provides a close/deselect affordance so a selection can return to the neutral state', () => {
    // rendered inside the summary; asserted via the component below, and present in source
    const src = readFileSync(join(process.cwd(), 'components/atlasindex/AtlasIndexShell.tsx'), 'utf8');
    expect(src).toContain("dispatch({ type: 'deselect' })");
    expect(src).toContain('Close country details');
  });
});

describe('Atlas country summary (opens on selection)', () => {
  it('Netherlands: specialisation, atlas question, reading meta, status and BOTH CTAs', () => {
    const html = renderToStaticMarkup(<CountrySummary c={nl} view={nlView} onClose={noop} />);
    expect(html).toContain('Netherlands');
    expect(html).toContain('Specialisation');
    expect(html).toContain('Semiconductor lithography equipment');
    expect(html).toContain(NL_QUESTION);
    expect(html).toContain('3 chapters');
    expect(html).toContain('About 6 minutes');
    expect(html).toContain('Research in progress');
    // primary → public Explore route; secondary → Evidence workspace
    expect(html).toMatch(/href="\/atlas\/netherlands-semiconductor-equipment"[^>]*>Explore the story</);
    expect(html).toMatch(/href="\/evidence\/netherlands-semiconductor-equipment"[^>]*>View sources</);
  });

  it('Taiwan: planned summary with specialisation + question, status "Research planned", and NO CTAs', () => {
    const html = renderToStaticMarkup(<CountrySummary c={tw} view={twView} onClose={noop} />);
    expect(html).toContain('Taiwan');
    expect(html).toContain('Semiconductor foundry manufacturing');
    expect(html).toContain('How did Taiwan develop its strength in semiconductor foundry manufacturing?');
    expect(html).toContain('Research planned');
    expect(html).not.toContain('Explore the story');
    expect(html).not.toContain('View sources');
    expect(html).not.toContain('/atlas/taiwan-semiconductor-manufacturing');
    expect(html).not.toContain('/evidence/taiwan-semiconductor-manufacturing');
  });

  it('France: planned summary with specialisation + question, status "Research planned", and NO CTAs', () => {
    const html = renderToStaticMarkup(<CountrySummary c={fr} view={frView} onClose={noop} />);
    expect(html).toContain('France');
    expect(html).toContain('Luxury industry');
    expect(html).toContain('How did France develop its modern luxury industry?');
    expect(html).toContain('Research planned');
    expect(html).not.toContain('Explore the story');
    expect(html).not.toContain('View sources');
    expect(html).not.toContain('/evidence/france-luxury');
  });

  it('the summary is a labelled dialog with a close control and a details toggle (a11y)', () => {
    const html = renderToStaticMarkup(<CountrySummary c={nl} view={nlView} onClose={noop} />);
    expect(html).toMatch(/role="dialog"/);
    expect(html).toContain('aria-label="Netherlands — country summary"');
    expect(html).toContain('aria-label="Close country details"');
    expect(html).toMatch(/aria-expanded=/); // the mobile show/hide-details toggle
  });
});

describe('Atlas responsive presentation + copy hygiene', () => {
  it('the summary uses a bottom-sheet presentation on mobile (stylesheet rule)', () => {
    const css = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8');
    // a max-width:720 media query pins .atlas9-panel to the bottom as a sheet
    expect(css).toMatch(/@media \(max-width: 720px\)[\s\S]*\.atlas9-panel \{[^}]*bottom: 0/);
    // collapsed sheet hides the body until expanded
    expect(css).toMatch(/\.atlas9-panel\[data-expanded="false"\] \.atlas9-panel-body \{[^}]*display: none/);
  });

  it('uses ordinary-user language — no research enums/IDs or leadership claims', () => {
    for (const term of ['well_supported', 'epistemicStatus', 'ClaimPlaceLink', 'nl-f-', 'nl-src-']) {
      expect(atlasHtml).not.toContain(term);
    }
    const lower = (atlasHtml + landingHtml).toLowerCase();
    for (const phrase of BANNED) expect(lower).not.toContain(phrase);
  });

  it('does not assign absolute global leadership to planned cases', () => {
    for (const c of [tw, fr]) {
      const html = renderToStaticMarkup(<CountrySummary c={c} view={c === tw ? twView : frView} onClose={noop} />).toLowerCase();
      for (const phrase of ['world leader', 'global leader', 'dominant']) expect(html).not.toContain(phrase);
    }
  });
});

describe('Atlas map markers — keyboard accessible (primary interaction)', () => {
  const mapSrc = readFileSync(join(process.cwd(), 'components/atlasindex/AtlasIndexMap.tsx'), 'utf8');

  it('each country marker is a real <button> (Enter/Space activatable) with a descriptive aria-label', () => {
    expect(mapSrc).toMatch(/createElement\('button'\)/);
    expect(mapSrc).toMatch(/\.type = 'button'/);
    // descriptive label naming the country + industry + status
    expect(mapSrc).toMatch(/setAttribute\('aria-label',[^)]*country[^)]*industry/);
    expect(mapSrc).toContain('Select to open the country summary');
  });

  it('the map region is NOT aria-hidden, so markers are in the keyboard/SR tab order', () => {
    // the container is a labelled group, not aria-hidden
    expect(mapSrc).toMatch(/className="ai-map-canvas" role="group" aria-label=/);
    expect(mapSrc).not.toMatch(/ai-map-canvas" aria-hidden="true"/);
  });

  it('markers have a visible focus state and select via the same handler as a pointer click', () => {
    // one click handler → identical selection for pointer and keyboard activation
    expect(mapSrc).toMatch(/addEventListener\('click'/);
    expect(mapSrc).toContain('selectRef.current(caseId)');
    const css = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8');
    expect(css).toMatch(/\.atlas-nav-marker:focus-visible/);
  });
});

describe('Atlas country presentation resolves from the typed content layer', () => {
  it('buildCountrySummaryView returns the presentation question + live reading meta (not hardcoded)', () => {
    const view = buildCountrySummaryView('netherlands-semiconductor-equipment')!;
    expect(view.specialisation).toBe('Semiconductor lithography equipment');
    expect(view.question).toBe(NL_QUESTION);
    // reading meta is derived live from the production chapters
    expect(view.chapters).toBe(3);
    expect(view.minutes).toBeGreaterThan(0);
    // the resolved question equals the typed record's question (single source of truth)
    expect(view.question).toBe(getCountryPresentation('netherlands-semiconductor-equipment')!.question);
  });

  it('planned countries resolve specialisation + question but carry no reading meta', () => {
    const twv = buildCountrySummaryView('taiwan-semiconductor-manufacturing')!;
    expect(twv.specialisation).toBe('Semiconductor foundry manufacturing');
    expect(twv.question).toBe('How did Taiwan develop its strength in semiconductor foundry manufacturing?');
    expect(twv.chapters).toBeUndefined();
  });

  it('validation is build-blocking: catches an unknown slug and a missing case presentation', () => {
    const slugs = getAtlasCases().map((c) => c.slug);
    const orphan = validateCountryPresentations([{ slug: 'nowhere', specialisation: 'X', question: 'Y' }], slugs);
    expect(orphan.some((f) => f.ruleId === 'CP1-case-ref')).toBe(true);
    const missing = validateCountryPresentations([], slugs);
    expect(missing.some((f) => f.ruleId === 'CP2-complete')).toBe(true);
    // the real content is valid
    expect(validateCountryPresentations(countryPresentations, slugs)).toEqual([]);
  });
});

describe('Canonical routes', () => {
  it('the Evidence route reuses the research view (all 17 Claims) + labelled contextual media', () => {
    const routeHtml = renderToStaticMarkup(<EvidencePage />);
    const direct = renderToStaticMarkup(<CaseResearchView data={buildNetherlandsResearchView('netherlands-semiconductor-equipment')} />);
    expect(routeHtml).toContain(direct); // research view reused verbatim (17 Claims)
    expect(routeHtml).toContain('17');
    expect(routeHtml).toContain('evidence-context-media'); // contextual image present
    expect(routeHtml).toContain('Present-day context'); // clearly labelled, not the founding
  });

  it('the Evidence page opens with a public landing that explains the workspace and links back', () => {
    const routeHtml = renderToStaticMarkup(<EvidencePage />);
    // 1 — heading, 2 — explanation
    expect(routeHtml).toContain('Evidence behind the story');
    expect(routeHtml).toContain('professional research workspace');
    // 3 — summary counts (17 findings · 5 sources · 2 mapped organisation addresses)
    expect(routeHtml).toContain('documented findings');
    expect(routeHtml).toContain('sources');
    expect(routeHtml).toContain('mapped organisation addresses');
    // 4/5 — return to visual story + browse full record; and back to the atlas (no dead ends)
    expect(routeHtml).toContain('Return to visual story');
    expect(routeHtml).toMatch(/href="\/atlas\/netherlands-semiconductor-equipment"/);
    expect(routeHtml).toContain('Browse full research record');
    expect(routeHtml).toMatch(/href="\/atlas"/);
    // the detailed research UI is retained BELOW the intro
    expect(routeHtml.indexOf('Evidence behind the story')).toBeLessThan(routeHtml.indexOf('research-record'));
  });

  it('the prototype route reuses the M1 atlas, labelled "Research map prototype", not Explore', () => {
    const routeHtml = renderToStaticMarkup(<PrototypePage />);
    expect(routeHtml).toContain('Research map prototype');
    expect(routeHtml).toContain('Veldhoven');
    expect(routeHtml).toContain('Eindhoven');
    expect(routeHtml).not.toContain('Explore');
  });

  it('defines permanent (308) legacy redirects, /atlas ordered first, no loops', async () => {
    const redirects = await (nextConfig.redirects?.() ?? Promise.resolve([]));
    for (const r of redirects) expect(r.permanent).toBe(true); // 308
    const map = new Map(redirects.map((r) => [r.source, r.destination]));
    expect(map.get('/cases/netherlands-semiconductor-equipment')).toBe('/evidence/netherlands-semiconductor-equipment');
    expect(map.get('/cases/netherlands-semiconductor-equipment/atlas')).toBe('/atlas/netherlands-semiconductor-equipment/prototype');
    // the specific /atlas legacy route is ordered before the general case route
    const idxAtlas = redirects.findIndex((r) => r.source.endsWith('/atlas'));
    const idxCase = redirects.findIndex((r) => r.source === '/cases/netherlands-semiconductor-equipment');
    expect(idxAtlas).toBeGreaterThan(-1);
    expect(idxAtlas).toBeLessThan(idxCase);
    // no destination is itself a source (no redirect loop)
    for (const r of redirects) expect(map.has(r.destination)).toBe(false);
  });

  it('has the canonical Netherlands Explore route but no Taiwan/France routes or legacy /cases pages', () => {
    expect(existsSync(join(process.cwd(), 'app/atlas/taiwan-semiconductor-manufacturing'))).toBe(false);
    expect(existsSync(join(process.cwd(), 'app/atlas/france-luxury'))).toBe(false);
    // Stage 7: the canonical public Explore route exists for the Netherlands…
    expect(existsSync(join(process.cwd(), 'app/atlas/netherlands-semiconductor-equipment/page.tsx'))).toBe(true);
    // …and the review preview route file is gone (now a permanent redirect).
    expect(existsSync(join(process.cwd(), 'app/atlas/netherlands-semiconductor-equipment/explore-preview/page.tsx'))).toBe(false);
    expect(existsSync(join(process.cwd(), 'app/cases'))).toBe(false);
  });
});
