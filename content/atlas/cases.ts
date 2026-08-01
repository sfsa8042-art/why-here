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
    // Public Explore launched (Stage 7): the reviewed visual documentary exists,
    // its prose resolves to production Claims, and all rendered media pass the
    // public rights gate — verified build-time by lib/exploreGate.ts.
    availableModes: ['explore', 'evidence'],
  },
  {
    id: 'case-taiwan-semiconductor-manufacturing',
    slug: 'taiwan-semiconductor-manufacturing',
    country: 'Taiwan',
    industry: 'Semiconductor manufacturing',
    title: 'Taiwan × Semiconductor Manufacturing',
    shortQuestion:
      'How did Taiwan develop its semiconductor manufacturing industry?',
    summary:
      'Planned research into the firms, institutions and industrial conditions that ' +
      "shaped Taiwan's semiconductor manufacturing sector.",
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
      'How did France develop its modern luxury industry?',
    summary:
      'Planned research into the firms, institutions and cultural systems that ' +
      "shaped France's luxury sector.",
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
