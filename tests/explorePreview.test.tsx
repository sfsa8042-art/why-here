/**
 * Explore preview UI + publication-gate guardrails (Public Atlas V2, Stage 3).
 * The shell renders to static markup (the map is a dynamic ssr:false boundary,
 * so no WebGL runs). Asserts the ordinary-user story surface, progressive
 * evidence disclosure, media presentation, the honest research-gaps frontier,
 * the noindex review route — and that public Explore is NOT enabled.
 */

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { ExplorePreviewShell } from '@/components/explore/ExplorePreviewShell.tsx';
import { buildChaptersView } from '@/lib/chapters';
import { AtlasIndexShell } from '@/components/atlasindex/AtlasIndexShell.tsx';
import { caseBySlug, getAtlasCases } from '@/lib/atlasCases';
import PreviewPage, { metadata as previewMetadata } from '@/app/atlas/netherlands-semiconductor-equipment/explore-preview/page';

const CASE = 'netherlands-semiconductor-equipment';
const view = buildChaptersView(CASE);
const html = renderToStaticMarkup(<ExplorePreviewShell view={view} evidenceHref={`/evidence/${CASE}`} />);

describe('Explore preview — story surface', () => {
  it('renders the preview label, first chapter, period, prose and "Why it matters"', () => {
    expect(html).toContain('Visual story preview');
    expect(html).toContain('A fragile joint venture');
    expect(html).toContain('1984');
    expect(html).toContain('joint venture'); // whatHappened prose
    expect(html).toContain('Why it matters');
  });

  it('shows chapter progress and the plain-language support state', () => {
    expect(html).toContain('Chapter 1 of 3');
    expect(html).toContain('Supported by evidence');
  });

  it('renders the compact chapter timeline for all three chapters', () => {
    expect(html).toContain('A fragile joint venture');
    expect(html).toContain('Crisis without a proven mechanism');
    expect(html).toContain('European coordination');
  });

  it('shows the media with what it depicts, a present-day badge, a credit and a details disclosure', () => {
    expect(html).toContain('Eindhoven city centre'); // caption
    expect(html).toContain('Present-day context'); // temporal badge (not archival styling)
    expect(html).toContain('Robert de Greef'); // credit line
    expect(html).toContain('Image details'); // progressive licence/role disclosure
  });

  it('visibly states what the chapter helps explain and does not yet explain', () => {
    expect(html).toContain('What this helps explain');
    expect(html).toContain('What this does not yet explain');
    expect(html).toContain('How resources, staff and commitments from Philips and ASM were assembled into a new venture.');
    expect(html).toContain('Why the Netherlands later developed a durable advantage in semiconductor lithography.');
  });

  it('keeps a visible evidence boundary for the active chapter (limitations shown, not hidden)', () => {
    expect(html).toContain('What this doesn’t show');
    expect(html).toContain('present-day view of Eindhoven');
  });

  it('uses the corrected, precise map-address wording (recorded organisation address ≠ physical location)', () => {
    const src = readFileSync(join(process.cwd(), 'components/explore/ExplorePreviewShell.tsx'), 'utf8');
    expect(src).toContain('These are addresses recorded for project organisations. They do not establish where project work physically took place.');
    // the imprecise old wording is gone
    expect(src).not.toContain('postal addresses, not where events took place');
    // default (chapter 1) has no mapped place
    expect(html).toContain('This chapter has no mapped location');
  });
});

describe('Explore preview — progressive evidence disclosure', () => {
  it('offers a "View evidence" action but does not show raw evidence by default', () => {
    expect(html).toContain('View evidence');
    // Evidence panel is collapsed until the reader opens it.
    expect(html).not.toContain('Every sentence above traces');
    expect(html).not.toContain('Open the full evidence workspace');
  });

  it('never surfaces Claim/Source IDs, snake_case or raw epistemic enums by default', () => {
    for (const term of ['well_supported', 'epistemicStatus', 'ClaimPlaceLink', 'nl-f-', 'nl-cit-', 'nl-src-']) {
      expect(html).not.toContain(term);
    }
  });
});

describe('Explore preview — honest research frontier', () => {
  it('renders the "what the evidence cannot answer" section as questions, not a failure message', () => {
    expect(html).toContain('What the evidence still cannot answer');
    expect(html).toContain('honest map of the edge of the research');
    expect(html).toContain('Why Eindhoven, and not another region?');
    expect(html).toContain('Did DEEP-UV research transfer into the PAS 5500?');
    expect(html).not.toContain('No data'); // not a dead-end message
  });
});

describe('Explore preview — review route, not public Explore', () => {
  it('the preview route is noindex and reuses the shell', () => {
    expect(previewMetadata.robots).toMatchObject({ index: false, follow: false });
    const routeHtml = renderToStaticMarkup(<PreviewPage />);
    expect(routeHtml).toContain('Visual story preview');
    expect(routeHtml).toContain('A fragile joint venture');
  });

  it('the Netherlands AtlasCase does NOT list an explore mode', () => {
    const nl = caseBySlug([...getAtlasCases()], CASE)!;
    expect(nl.availableModes).not.toContain('explore');
  });

  it('the Atlas index offers no Explore CTA and does not link the preview route', () => {
    const indexHtml = renderToStaticMarkup(<AtlasIndexShell cases={[...getAtlasCases()]} />);
    expect(indexHtml).not.toContain('Explore case');
    expect(indexHtml).not.toContain('explore-preview');
  });

  it('the preview route source declares robots noindex (build-visible gate)', () => {
    const src = readFileSync(join(process.cwd(), 'app/atlas/netherlands-semiconductor-equipment/explore-preview/page.tsx'), 'utf8');
    expect(src).toMatch(/robots:\s*\{\s*index:\s*false/);
  });
});

describe('Explore preview — responsive shell', () => {
  it('has a story-first mobile stylesheet (map is the secondary pane)', () => {
    const css = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8');
    expect(css).toContain('@media (max-width: 720px)');
    expect(css).toMatch(/\.ep-shell\[data-pane="story"\]\s*\.ep-stage\s*\{\s*display:\s*none/);
  });

  it('neutralises the global section margin inside the fixed shell', () => {
    const css = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8');
    expect(css).toMatch(/\.ep-shell\s+section\s*\{\s*margin-top:\s*0/);
  });

  it('the preview page file exists at the unlinked route path', () => {
    expect(existsSync(join(process.cwd(), 'app/atlas/netherlands-semiconductor-equipment/explore-preview/page.tsx'))).toBe(true);
  });
});
