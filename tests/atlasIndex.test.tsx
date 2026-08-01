/**
 * Atlas index UI + canonical routes (Public Atlas V2, Stage 1). The index shell
 * is rendered to static markup (the map is a dynamic ssr:false boundary, so no
 * WebGL runs). Also asserts the canonical Evidence/prototype routes reuse the
 * existing views, the legacy redirects, and that no planned-case route exists.
 */

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { AtlasIndexShell } from '@/components/atlasindex/AtlasIndexShell.tsx';
import { caseBySlug, getAtlasCases } from '@/lib/atlasCases';
import { buildNetherlandsResearchView } from '@/lib/researchViewModel';
import { CaseResearchView } from '@/components/research/CaseResearchView.tsx';
import EvidencePage from '@/app/evidence/netherlands-semiconductor-equipment/page';
import PrototypePage from '@/app/atlas/netherlands-semiconductor-equipment/prototype/page';
import nextConfig from '@/next.config';

const cases = [...getAtlasCases()];
const html = renderToStaticMarkup(<AtlasIndexShell cases={cases} />);

describe('Atlas index — /atlas shell', () => {
  it('renders the atlas header, description and case count', () => {
    expect(html).toContain('WHY HERE?');
    expect(html).toContain('Atlas of Industrial Advantage');
    expect(html).toContain('3 of 3 cases');
  });

  it('renders status and industry filters derived from the registry', () => {
    for (const label of ['All', 'In research', 'Planned', 'Published']) expect(html).toContain(label);
    for (const ind of ['All industries', 'Semiconductor equipment', 'Semiconductor manufacturing', 'Luxury']) expect(html).toContain(ind);
  });

  it('lists all three cases with public status labels', () => {
    expect(html).toContain('Netherlands');
    expect(html).toContain('Taiwan');
    expect(html).toContain('France');
    expect(html).toContain('In research');
    expect(html).toContain('Planned research');
  });

  it('is list-first in the DOM (panel before the map stage)', () => {
    expect(html.indexOf('ai-panel')).toBeGreaterThan(-1);
    expect(html.indexOf('ai-panel')).toBeLessThan(html.indexOf('ai-stage'));
  });

  it('renders the accessible map-loading shell (no WebGL) and the navigation legend', () => {
    expect(html).toContain('Loading atlas map');
    expect(html).toContain('do not mark the exact sites of historical events');
  });

  it('the default (Netherlands) preview leads with Explore story, then View evidence, with a secondary Research map', () => {
    const nlStory = { 'netherlands-semiconductor-equipment': { setupLine: 'In 1984, Philips and ASM assembled a new lithography venture from staff, technology and financial commitments.', beats: ['A fragile joint venture', 'Crisis and restructuring', 'European coordination'], compactSummary: '3 chapters · Founding · Crisis · European coordination' } };
    const storyHtml = renderToStaticMarkup(<AtlasIndexShell cases={cases} storyPreviews={nlStory} />);
    expect(storyHtml).toContain('Why did advanced semiconductor lithography take root in the Netherlands?');
    // primary Explore CTA + link to the canonical public route
    expect(storyHtml).toContain('Explore story');
    expect(storyHtml).toMatch(/href="\/atlas\/netherlands-semiconductor-equipment"/);
    // secondary Evidence CTA
    expect(storyHtml).toContain('View evidence');
    expect(storyHtml).toContain('/evidence/netherlands-semiconductor-equipment');
    // all three story beats retained
    for (const beat of ['A fragile joint venture', 'Crisis and restructuring', 'European coordination']) expect(storyHtml).toContain(beat);
    // research map demoted from the primary hierarchy
    expect(storyHtml).not.toContain('Open research map prototype');
    expect(storyHtml).toContain('Research map');
    expect(storyHtml).toContain('/atlas/netherlands-semiconductor-equipment/prototype');
    // plain-language Explore/Evidence distinction copy
    expect(storyHtml).toContain('A visual, plain-language story based on the current evidence.');
    expect(storyHtml).toContain('The complete research record, claims, sources and limitations.');
  });

  it('the primary Explore CTA renders BEFORE the detailed story beats (above-the-fold ordering)', () => {
    const nlStory = { 'netherlands-semiconductor-equipment': { setupLine: 'Setup.', beats: ['A fragile joint venture', 'Crisis and restructuring', 'European coordination'], compactSummary: '3 chapters · Founding · Crisis · European coordination' } };
    const storyHtml = renderToStaticMarkup(<AtlasIndexShell cases={cases} storyPreviews={nlStory} />);
    // DOM order: question → setup → CTA → beats
    expect(storyHtml.indexOf('aip-cta')).toBeLessThan(storyHtml.indexOf('aip-beats'));
    expect(storyHtml.indexOf('Explore story')).toBeLessThan(storyHtml.indexOf('A fragile joint venture'));
    expect(storyHtml.indexOf('aip-setup')).toBeLessThan(storyHtml.indexOf('aip-cta'));
    // a mobile compact summary exists (CSS shows it on narrow viewports)
    expect(storyHtml).toContain('aip-beats-compact');
    expect(storyHtml).toContain('3 chapters · Founding · Crisis · European coordination');
    // the responsive rule swaps full beats for the compact summary on mobile
    const css = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8');
    expect(css).toMatch(/@media \(max-width: 720px\) \{[^}]*\.aip-beats \{ display: none/s);
  });

  it('uses ordinary-user language — no raw research enums or IDs', () => {
    for (const term of ['well_supported', 'project_coordinator_address', 'epistemicStatus', 'ClaimPlaceLink', 'nl-f-']) {
      expect(html).not.toContain(term);
    }
  });

  it('shows planned cases with a Planned-research state and no fake CTAs', () => {
    // Put a planned case first so it is the default selection/preview.
    const tw = caseBySlug(cases, 'taiwan-semiconductor-manufacturing')!;
    const fr = caseBySlug(cases, 'france-luxury')!;
    const nl = caseBySlug(cases, 'netherlands-semiconductor-equipment')!;
    const plannedHtml = renderToStaticMarkup(<AtlasIndexShell cases={[tw, fr, nl]} />);
    expect(plannedHtml).toContain('How did Taiwan develop its semiconductor manufacturing industry?');
    expect(plannedHtml).toContain('Research planned');
    // No evidence/explore/prototype CTAs while a planned case is selected
    expect(plannedHtml).not.toContain('View evidence');
    expect(plannedHtml).not.toContain('Explore story');
    expect(plannedHtml).not.toContain('Open research map prototype');
    expect(plannedHtml).not.toContain('Explore case');
  });

  it('planned-case public copy is neutral — no superlative / advantage claims', () => {
    const all = renderToStaticMarkup(<AtlasIndexShell cases={[...getAtlasCases()]} />);
    // render each planned case as the selected preview and check its copy
    const tw = caseBySlug([...getAtlasCases()], 'taiwan-semiconductor-manufacturing')!;
    const fr = caseBySlug([...getAtlasCases()], 'france-luxury')!;
    const twHtml = renderToStaticMarkup(<AtlasIndexShell cases={[tw]} />);
    const frHtml = renderToStaticMarkup(<AtlasIndexShell cases={[fr]} />);
    for (const html of [all, twHtml, frHtml]) {
      for (const phrase of ["world's leading", 'dominant position', 'enduring advantage', 'lasting advantage']) {
        expect(html).not.toContain(phrase);
      }
    }
    expect(twHtml).toContain('How did Taiwan develop its semiconductor manufacturing industry?');
    expect(twHtml).toContain('firms, institutions and industrial conditions');
    expect(frHtml).toContain('How did France develop its modern luxury industry?');
    expect(frHtml).toContain('firms, institutions and cultural systems');
  });

  it('has a mobile list-first stylesheet rule', () => {
    const css = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8');
    expect(css).toContain('@media (max-width: 720px)');
    expect(css).toMatch(/\.ai-body\s*\{\s*display:\s*flex;\s*flex-direction:\s*column/);
  });

  it('the index map adds no custom attribution (avoids duplicated credit)', () => {
    const src = readFileSync(join(process.cwd(), 'components/atlasindex/AtlasIndexMap.tsx'), 'utf8');
    // The style's own source carries the required credit; a custom string doubled it.
    expect(src).not.toContain('customAttribution');
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
