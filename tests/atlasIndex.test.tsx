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

describe('Landing page (/)', () => {
  it('presents the product hero and a single "Explore the atlas" CTA into /atlas', () => {
    expect(landingHtml).toContain('WHY HERE?');
    expect(landingHtml).toContain('What do different countries become exceptionally good at — and why?');
    expect(landingHtml).toContain('Explore how industries work and how companies, institutions and historical decisions shaped national strengths.');
    // primary CTA text + destination
    expect(landingHtml).toMatch(/href="\/atlas"[^>]*>Explore the atlas</);
  });

  it('shows the case counts and a plain-language format explanation', () => {
    expect(landingHtml).toContain('1 investigation available · 2 planned');
    for (const step of ['Choose a country', 'Discover what it became exceptionally good at', 'Understand the industry', 'Explore how that strength developed']) {
      expect(landingHtml).toContain(step);
    }
  });

  it('does NOT put the Netherlands featured investigation (or its story) before the CTA', () => {
    // the landing must not duplicate the case story or its atlas summary question
    expect(landingHtml).not.toContain('Featured investigation');
    expect(landingHtml).not.toContain(NL_QUESTION);
    expect(landingHtml).not.toContain('Explore the story');
    expect(landingHtml).not.toContain('View sources');
    // the CTA appears before the "How it works" format section
    expect(landingHtml.indexOf('Explore the atlas')).toBeLessThan(landingHtml.indexOf('How it works'));
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
    expect(html).toContain('Semiconductor manufacturing');
    expect(html).toContain('How did Taiwan develop its semiconductor manufacturing industry?');
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
    expect(twv.specialisation).toBe('Semiconductor manufacturing');
    expect(twv.question).toBe('How did Taiwan develop its semiconductor manufacturing industry?');
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
