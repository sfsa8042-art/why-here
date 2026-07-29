/**
 * Atlas case registry — the NAVIGATION / discovery layer (Public Atlas V2, Stage 1).
 *
 * This is a SEPARATE content layer from the evidence corpus (content/index.ts).
 * It does not import, reuse, or reference Places / ClaimPlaceLinks / Claims. Its
 * only geography is `navigationGeometry` — a locate-and-open device, never an
 * assertion that a historical event occurred at that point or country centroid.
 *
 * Coordinates are approximate country-representative navigation points (a
 * public-domain geographic basis, Natural Earth admin-0), recorded here with an
 * explicit source + attribution. They are NOT event locations, founding sites,
 * company locations, or evidence anchors.
 *
 * Stage 1 launch: one case in research (Netherlands, Evidence available), two
 * planned (Taiwan, France) — no fabricated explorers, claims, or source counts.
 */

import type { AtlasCase } from '../../lib/atlasCases.ts';

const NAV_SOURCE =
  'Natural Earth 1:110m Admin 0 (public domain) — approximate country representative point';
const NAV_ATTRIBUTION =
  'Navigation point — approximate country location, Natural Earth (public domain)';

export const atlasCases: AtlasCase[] = [
  {
    id: 'case-netherlands-semiconductor-equipment',
    slug: 'netherlands-semiconductor-equipment',
    country: 'Netherlands',
    region: 'Brainport / Eindhoven',
    industry: 'Semiconductor equipment',
    title: 'Netherlands × Semiconductor Equipment',
    shortQuestion:
      'Why did advanced semiconductor lithography take root in the Netherlands?',
    summary:
      "The atlas's first active research case. The evidence gathered so far is " +
      'strongest on the venture’s founding, its early technical crisis, and the ' +
      'first European deep-UV coordination; the wider “why here” story is ' +
      'still being researched.',
    status: 'in_research',
    navigationGeometry: {
      type: 'point',
      longitude: 5.6,
      latitude: 52.2,
      precision: 'country',
      source: NAV_SOURCE,
      attributionText: NAV_ATTRIBUTION,
    },
    availableModes: ['evidence'],
  },
  {
    id: 'case-taiwan-semiconductor-manufacturing',
    slug: 'taiwan-semiconductor-manufacturing',
    country: 'Taiwan',
    industry: 'Semiconductor manufacturing',
    title: 'Taiwan × Semiconductor Manufacturing',
    shortQuestion:
      "Why did Taiwan become the world's leading semiconductor manufacturing hub?",
    summary:
      'Planned research into how Taiwan built a dominant position in semiconductor ' +
      'manufacturing. No evidence has been gathered yet.',
    status: 'planned',
    navigationGeometry: {
      type: 'point',
      longitude: 120.96,
      latitude: 23.7,
      precision: 'country',
      source: NAV_SOURCE,
      attributionText: NAV_ATTRIBUTION,
    },
    availableModes: [],
  },
  {
    id: 'case-france-luxury',
    slug: 'france-luxury',
    country: 'France',
    industry: 'Luxury',
    title: 'France × Luxury',
    shortQuestion:
      'Why did France build an enduring advantage in luxury industries?',
    summary:
      "Planned research into the roots of France's lasting advantage in luxury " +
      'goods. No evidence has been gathered yet.',
    status: 'planned',
    navigationGeometry: {
      type: 'point',
      longitude: 2.45,
      latitude: 46.6,
      precision: 'country',
      source: NAV_SOURCE,
      attributionText: NAV_ATTRIBUTION,
    },
    availableModes: [],
  },
];
