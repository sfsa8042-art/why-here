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

  it('the default (Netherlands) preview offers Evidence + prototype, never Explore', () => {
    expect(html).toContain('Why did advanced semiconductor lithography take root in the Netherlands?');
    expect(html).toContain('View evidence');
    expect(html).toContain('/evidence/netherlands-semiconductor-equipment');
    expect(html).toContain('Open research map prototype');
    expect(html).toContain('/atlas/netherlands-semiconductor-equipment/prototype');
    expect(html).toContain('still being developed');
    expect(html).not.toContain('Explore case');
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
    expect(plannedHtml).toContain('Why did Taiwan become');
    expect(plannedHtml).toContain('Research planned');
    // No evidence/explore/prototype CTAs while a planned case is selected
    expect(plannedHtml).not.toContain('View evidence');
    expect(plannedHtml).not.toContain('Open research map prototype');
    expect(plannedHtml).not.toContain('Explore case');
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
  it('the Evidence route reuses the research view (all 17 Claims)', () => {
    const routeHtml = renderToStaticMarkup(<EvidencePage />);
    const direct = renderToStaticMarkup(<CaseResearchView data={buildNetherlandsResearchView('netherlands-semiconductor-equipment')} />);
    expect(routeHtml).toBe(direct);
    expect(routeHtml).toContain('17'); // claim count is surfaced in the header
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

  it('does not create Taiwan or France case routes, and removes legacy /cases pages', () => {
    expect(existsSync(join(process.cwd(), 'app/atlas/taiwan-semiconductor-manufacturing'))).toBe(false);
    expect(existsSync(join(process.cwd(), 'app/atlas/france-luxury'))).toBe(false);
    // no completed Explore route for Netherlands in Stage 1
    expect(existsSync(join(process.cwd(), 'app/atlas/netherlands-semiconductor-equipment/page.tsx'))).toBe(false);
    expect(existsSync(join(process.cwd(), 'app/cases'))).toBe(false);
  });
});
