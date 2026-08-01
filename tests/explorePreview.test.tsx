/**
 * Explore documentary (Public Atlas V2, Stage 4) + publication-gate guardrails.
 * The shell renders to static markup (the map is a dynamic ssr:false boundary,
 * so no WebGL runs; evidence disclosures render closed). Asserts the visual
 * documentary structure, ordinary-user evidence-on-demand, grouped research
 * frontier, mobile DOM order — and that public Explore stays disabled.
 */

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { ExplorePreviewShell } from '@/components/explore/ExplorePreviewShell.tsx';
import { LithographyExplainer } from '@/components/explore/LithographyExplainer.tsx';
import { buildChaptersView } from '@/lib/chapters';
import { caseCover } from '@/lib/media';
import { AtlasIndexShell } from '@/components/atlasindex/AtlasIndexShell.tsx';
import { caseBySlug, getAtlasCases } from '@/lib/atlasCases';
import PublicExplorePage, { metadata as exploreMetadata } from '@/app/atlas/netherlands-semiconductor-equipment/page';
import nextConfig from '@/next.config';

const CASE = 'netherlands-semiconductor-equipment';
const view = buildChaptersView(CASE);
const html = renderToStaticMarkup(<ExplorePreviewShell view={view} evidenceHref={`/evidence/${CASE}`} heroImage={caseCover(CASE)} />);

describe('Explore documentary — hero', () => {
  it('opens with the eyebrow, editorial title, a concrete evidence-backed setup line and both actions', () => {
    expect(html).toContain('Netherlands × Semiconductor Equipment');
    expect(html).toContain('Why did advanced chip-making equipment take root here?');
    expect(html).toContain('In 1984, Philips and ASM assembled a new lithography venture from staff, technology and financial commitments.');
    expect(html).toContain('Begin the story');
    expect(html).toContain('See what the evidence supports');
  });

  it('shows a non-dominant research-status label with no internal-preview language', () => {
    expect(html).toContain('Research in progress');
    // release blocker: the public route must not carry internal-preview wording
    expect(html).not.toContain('INTERNAL PREVIEW');
    expect(html).not.toContain('internal preview');
    const routeHtml = renderToStaticMarkup(<PublicExplorePage />);
    expect(routeHtml).not.toContain('INTERNAL PREVIEW');
    expect(routeHtml).not.toContain('internal preview');
  });
});

describe('Explore documentary — no unsupported superlative / concentration claims', () => {
  it('the hero carries no comparative superlative absent from the corpus', () => {
    for (const phrase of ['world’s most advanced', "world's most advanced", 'most advanced chip']) {
      expect(html).not.toContain(phrase);
    }
  });

  it('the introduction makes no unsupported concentration / leadership / market claim', () => {
    for (const phrase of [
      'became concentrated',
      'concentrated in very few places',
      'form that advantage',
      'world leader',
      'dominates',
    ]) {
      expect(html).not.toContain(phrase);
    }
    // and keeps the approved, corpus-safe framing
    expect(html).toContain('began building capability in semiconductor lithography');
    expect(html).toContain('Introductory technical context');
  });
});

describe('Explore documentary — introductory explainer', () => {
  it('explains lithography in plain language and labels it introductory context', () => {
    expect(html).toContain('First, what is lithography?');
    expect(html).toContain('patterned mask');
    expect(html).toContain('Introductory technical context');
  });

  it('renders an original 4-stage lithography explainer (light → pattern → wafer → repeated exposure)', () => {
    const lx = renderToStaticMarkup(<LithographyExplainer />);
    for (const stage of ['Light', 'Pattern', 'Wafer', 'Repeated exposure']) expect(lx).toContain(stage);
    expect(lx).toContain('lx-field'); // the step-and-repeat wafer grid
    expect(lx).toContain('role="img"'); // accessible description present
  });
});

describe('Explore documentary — three visual story sequences', () => {
  it('Chapter 1 is an assembly visual (two parents → a 1984 venture)', () => {
    expect(html).toContain('A fragile joint venture');
    expect(html).toContain('c1viz');
    expect(html).toContain('Philips');
    expect(html).toContain('ASM International');
    expect(html).toContain('ASM Lithography');
  });

  it('Chapter 2 is event-led (large beats) with a compact mechanism boundary and a "full account" disclosure', () => {
    expect(html).toContain('Crisis without a proven mechanism');
    expect(html).toContain('c2-beats'); // large event beats, not one paragraph
    expect(html).toContain('ASM International withdraws');
    expect(html).toContain('Read the full account'); // full narrative behind a disclosure
    expect(html).toContain('The sequence is documented. The complete survival mechanism is not.');
  });

  it('Chapter 3 is map-led with a non-geographic participant list (no fabricated coordinates)', () => {
    expect(html).toContain('European coordination');
    expect(html).toContain('c3-map'); // the dominant map surface
    expect(html).toContain('The consortium');
    expect(html).toContain('Carl Zeiss');
    expect(html).toContain('listed participant'); // foreign orgs are non-geographic
    expect(html).toContain('◍ Veldhoven'); // only production-Place orgs are flagged on the map
    expect(html).toContain('◍ Eindhoven');
  });

  it('Chapter 2 illustration keeps an explicit Technology-illustration badge (not implied to be a real PAS machine)', () => {
    expect(html).toContain('Technology illustration');
    expect(html).toContain('step-and-repeat'); // caption wording from the media asset
  });
});

describe('Explore documentary — Stage 6 polish', () => {
  it('the Erfurt image is unmistakably framed as out-of-scope (visible, not only in credits)', () => {
    expect(html).toContain('East Germany, 1989 — not ASM Lithography'); // on-image overlay label
    expect(html).toContain('What semiconductor production looked like in Europe at the time'); // interlude framing
  });

  it('ships an original, plain-English technical diagram and keeps the licensed source diagram available', () => {
    expect(html).toContain('ldiag'); // the new SVG explainer
    expect(html).toContain('Optical system'); // plain-English label
    expect(html).toContain('Simplified technical illustration — not a specific PAS machine');
    expect(html).toContain('The licensed source method diagram'); // original diagram still one click away
    expect(html).toContain('step-and-repeat'); // its caption survives
  });

  it('provides a compact mobile navigation with section/progress and a full sheet', () => {
    expect(html).toContain('ep-nav-mobile');
    expect(html).toContain('ep-nav-toggle');
    expect(html).toContain('1 / 6'); // current-section / total
    expect(html).toContain('ep-nav--full'); // desktop nav retained (CSS toggles visibility)
  });

  it('the tall ASML-lens portrait carries an asset-specific crop so the head is not cut off', () => {
    // the image exposes an asset id hook…
    expect(html).toContain('data-media-id="nl-media-asml-lens-engineer-2006"');
    // …and the stylesheet biases its cover-crop toward the upper body.
    const css = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8');
    expect(css).toMatch(/\[data-media-id="nl-media-asml-lens-engineer-2006"\]\s*\{\s*object-position:\s*center 22%/);
  });

  it('default photo captions are short (title + role + creator); full rights live in the disclosure', () => {
    expect(html).toContain('Eindhoven city centre (2007)'); // short title used as caption
    expect(html).toContain('Credit &amp; rights'); // full rights disclosure present
    // the long documentary sentence is inside the disclosure, not the default caption line
    expect(html).toContain('decades before the 1984 venture');
  });
});

describe('Explore documentary — real photography integration', () => {
  it('the hero is grounded in the real Eindhoven photograph with an honest role badge', () => {
    expect(html).toContain('hero-photo');
    expect(html).toContain('Binnenstad_Eindhoven.jpg'); // the licence-verified Eindhoven image
    expect(html).toContain('Present-day regional context'); // honest hero badge
    expect(html).toContain('Robert de Greef'); // accessible credit
  });

  it('weaves licence-verified photographs across the chapters (heritage, technology, local)', () => {
    expect(html).toContain('philips-fabrieken-1949.jpg'); // Chapter 1 historical Philips heritage
    expect(html).toContain('Industrial heritage context');
    expect(html).toContain('microelectronics-1989.jpg'); // Chapter 2 period-compatible technology
    expect(html).toContain('cleanroom-2009.jpg');
    expect(html).toContain('philips-terrein-2008.jpg'); // Chapter 3 local base context
  });

  it('every rendered photograph carries an explicit presentation-role badge', () => {
    for (const role of ['Historical photograph', 'Industrial heritage context', 'Present-day company context', 'Technology illustration']) {
      expect(html).toContain(role);
    }
  });

  it('historical photographs are honestly framed as predating / outside the case', () => {
    expect(html).toContain('decades before the 1984 venture'); // 1949 Philips caption is honest
    expect(html).toContain('Predates the 1984 case'); // heritage limitation, not evidence
  });
});

describe('Explore documentary — evidence on demand', () => {
  it('every chapter offers "How do we know?" with a plain-language summary, closed by default', () => {
    expect(html).toContain('How do we know?');
    expect(html).toContain('5 documented findings · 2 sources'); // chapter 1
    expect(html).toContain('4 documented findings · 1 source'); // chapter 3
    // Closed: the finding statements and workspace-in-panel are not rendered yet.
    expect(html).not.toContain('had been established by April 1984');
  });

  it('offers the full evidence workspace link', () => {
    expect(html).toContain('Open full evidence workspace');
    expect(html).toContain(`/evidence/${CASE}`);
  });

  it('the Explore navigation links to Evidence and back to the Atlas (no dead ends)', () => {
    expect(html).toContain('Evidence →'); // desktop nav evidence link
    expect(html).toMatch(/class="ep-nav-evidence" href="\/evidence\/netherlands-semiconductor-equipment"/);
    expect(html).toMatch(/href="\/atlas"/); // return to atlas
    expect(html).toContain('Research in progress'); // visible research status
    // the mobile compact nav also carries an evidence link (rendered when opened)
    const src = readFileSync(join(process.cwd(), 'components/explore/ExplorePreviewShell.tsx'), 'utf8');
    expect(src).toContain('Open the evidence record →');
  });

  it('never leaks Claim/Source IDs, enums, or provenance jargon by default', () => {
    for (const term of ['well_supported', 'epistemicStatus', 'subject_authored', 'ClaimPlaceLink', 'nl-f-', 'nl-cit-', 'nl-src-', 'temporalRelation']) {
      expect(html).not.toContain(term);
    }
  });
});

describe('Explore documentary — chapter boundaries out of the main flow', () => {
  it('each chapter ends with one establishing sentence + a compact "does not establish" disclosure', () => {
    expect(html).toContain('What this chapter establishes');
    expect(html).toContain('What it does not establish');
    // the establishing sentence is visible; the detailed disclaimer lives in <details>
    expect(html).toContain('How resources, staff and commitments from Philips and ASM were assembled into a new venture.');
    expect(html).toContain('Why the Netherlands later developed a durable advantage in semiconductor lithography.');
  });
});

describe('Explore documentary — research frontier', () => {
  it('groups the eight gaps into four understandable themes and closes with the growth line', () => {
    expect(html).toContain('What we still cannot answer');
    for (const theme of ['Regional ecosystem', 'Technology transfer', 'Markets and competition', 'Commercial transition']) {
      expect(html).toContain(theme);
    }
    const themeCount = (html.match(/class="theme-title"/g) ?? []).length;
    expect(themeCount).toBeLessThanOrEqual(4);
    expect(themeCount).toBe(4);
    expect(html).toContain('This atlas grows as the evidence grows.');
    expect(html).toContain('Return to the world atlas');
  });
});

describe('Explore documentary — responsive story order (DOM)', () => {
  it('sections are ordered hero → explainer → ch1 → ch2 → ch3 → frontier', () => {
    const order = ['id="hero"', 'id="explainer"', 'id="chapter-1"', 'id="chapter-2"', 'id="chapter-3"', 'id="frontier"'];
    const positions = order.map((s) => html.indexOf(s));
    expect(positions.every((p) => p >= 0)).toBe(true);
    for (let i = 1; i < positions.length; i++) expect(positions[i]).toBeGreaterThan(positions[i - 1]!);
  });

  it('within Chapter 3 the map comes before the side prose/evidence (map-led on mobile)', () => {
    expect(html.indexOf('c3-map')).toBeLessThan(html.indexOf('c3-side'));
  });
});

describe('Explore documentary — motion is progressive enhancement (reduced-motion safe)', () => {
  it('hiding content is gated behind the motion build; base content is never hidden', () => {
    const css = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8');
    // The only opacity:0 hide is scoped to `.ep-doc--motion` (added only when
    // motion is allowed AND an IntersectionObserver exists to reveal it).
    expect(css).toMatch(/\.ep-doc--motion \[data-reveal\]\s*\{\s*opacity:\s*0/);
    // Static render carries no motion class, so content is visible.
    expect(html).not.toContain('ep-doc--motion');
  });
});

describe('Explore documentary — map info vs. attribution (no overlap)', () => {
  it('keeps attribution as one compact control and the info control in the opposite corner', () => {
    const map = readFileSync(join(process.cwd(), 'components/explore/ExploreStoryMap.tsx'), 'utf8');
    // Single, compact, source-provided attribution (no custom string ⇒ no doubling).
    expect(map).toMatch(/attributionControl:\s*\{\s*compact:\s*true/);
    expect(map).not.toContain('customAttribution');
  });

  it('the info control sits top-left with a 44px target and its note is a popover', () => {
    const css = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8');
    expect(css).toMatch(/\.esm-info\s*\{[^}]*top:\s*12px[^}]*left:\s*12px/);
    expect(css).toMatch(/\.esm-info-btn\s*\{[^}]*min-height:\s*44px/);
    expect(css).toMatch(/\.esm-info-note\s*\{[^}]*position:\s*absolute/);
  });
});

describe('Public Explore launch (Stage 7)', () => {
  it('the canonical public route is INDEXABLE (no noindex) and reuses the documentary shell', () => {
    // no robots noindex on the public route
    expect((exploreMetadata as { robots?: unknown }).robots).toBeUndefined();
    const routeHtml = renderToStaticMarkup(<PublicExplorePage />);
    expect(routeHtml).toContain('Why did advanced chip-making equipment take root here?');
  });

  it('the canonical route carries sharing metadata + a canonical URL + a local OG image', () => {
    expect(exploreMetadata.title).toBe('Why Here? — Netherlands × Semiconductor Equipment');
    expect(String(exploreMetadata.description)).toMatch(/visual investigation/i);
    expect((exploreMetadata.alternates as { canonical?: string })?.canonical).toBe('/atlas/netherlands-semiconductor-equipment');
    const og = exploreMetadata.openGraph as { images?: { url: string }[] };
    expect(og.images?.[0]?.url).toBe('/media/netherlands-semiconductor-equipment/Binnenstad_Eindhoven.jpg');
    expect(og.images?.[0]?.url.startsWith('http')).toBe(false); // local asset, not an external URL
  });

  it('the Netherlands AtlasCase modes are exactly ["explore", "evidence"]', () => {
    const nl = caseBySlug([...getAtlasCases()], CASE)!;
    expect(nl.availableModes).toEqual(['explore', 'evidence']);
  });

  it('Taiwan and France remain planned with no modes', () => {
    for (const slug of ['taiwan-semiconductor-manufacturing', 'france-luxury']) {
      const c = caseBySlug([...getAtlasCases()], slug)!;
      expect(c.status).toBe('planned');
      expect(c.availableModes).toEqual([]);
    }
  });

  it('the preview route is a permanent redirect to the canonical route (query preserved, no loop)', async () => {
    const redirects = await nextConfig.redirects!();
    const r = redirects.find((x) => x.source === '/atlas/netherlands-semiconductor-equipment/explore-preview');
    expect(r).toBeDefined();
    expect(r!.destination).toBe('/atlas/netherlands-semiconductor-equipment');
    expect(r!.permanent).toBe(true);
    expect(r!.source).not.toBe(r!.destination); // no loop
  });
});

describe('Explore documentary — verified content model unchanged', () => {
  it('chapter → Claim / Place / Media mappings are exactly as authored', () => {
    const ch = view.chapters;
    expect(ch.map((c) => c.evidence.length)).toEqual([5, 5, 4]);
    expect(ch[2]!.anchors.map((a) => a.name).sort()).toEqual(['Eindhoven', 'Veldhoven']);
    expect(ch[0]!.media.map((m) => m.id)).toEqual([
      'nl-media-philips-fabrieken-1949', 'nl-media-klokgebouw-2014', 'nl-media-philips-strijp-1936', 'nl-media-eindhoven-city-2007',
    ]);
    expect(ch[1]!.media.map((m) => m.id)).toEqual([
      'nl-media-microelectronics-1989', 'nl-media-cleanroom-2009', 'nl-media-silicon-wafer', 'nl-media-asml-lens-engineer-2006', 'nl-media-step-repeat-diagram',
    ]);
    expect(ch[2]!.media.map((m) => m.id)).toEqual([
      'nl-media-asml-veldhoven-2008', 'nl-media-philips-terrein-2008', 'nl-media-eindhoven-city-2007', 'nl-media-step-repeat-diagram',
    ]);
  });
});
