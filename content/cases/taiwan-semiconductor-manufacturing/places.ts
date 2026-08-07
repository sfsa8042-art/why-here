/**
 * Taiwan × Advanced Semiconductor Foundry Manufacturing — Places (Increment M0).
 *
 * Three neutral gazetteer entities. A Place proves ONLY that a geographic entity
 * and its geometry exist; it asserts no history. Each carries an honest
 * precision matching what the evidence supports:
 *   - Hsinchu: a representative CITY coordinate (city-level gazetteer point) —
 *     NOT a Science-Park centroid, NOT TSMC's street address, NOT a modern HQ
 *     coordinate;
 *   - New Jersey: a REGION (US state) — the source locates the RCA IC-design
 *     training team only to the state, not a single site;
 *   - Taiwan: the COUNTRY administrative area — used only for a nation-scoped
 *     administrative relationship, never as a pinpoint for an event.
 * These are separate from the Atlas navigation markers (content/atlas/cases.ts).
 * See docs/research/taiwan-semiconductor-manufacturing/GEOGRAPHIC_EVIDENCE.md.
 */

import type { Place } from '../../../lib/schemas.ts';

import { CASE_ID } from './case.ts';

export const places: Place[] = [
  {
    id: 'tw-place-hsinchu',
    caseId: CASE_ID,
    name: 'Hsinchu',
    countryCode: 'TW',
    kind: 'city',
    geometry: {
      type: 'point',
      longitude: 120.9686,
      latitude: 24.8036,
      precision: 'city',
      coordinateSource:
        'Representative city coordinate (city-level gazetteer point). Source: ' +
        'Wikipedia (en), page title "Hsinchu", https://en.wikipedia.org/wiki/Hsinchu ' +
        '— infobox coordinates 24.8036, 120.9686.',
      attributionText: 'City coordinates via Wikipedia contributors, CC BY-SA 4.0',
      accessedAt: '2026-08-05T00:00:00Z',
    },
  },
  {
    id: 'tw-place-new-jersey',
    caseId: CASE_ID,
    name: 'New Jersey',
    countryCode: 'US',
    kind: 'region',
    geometry: {
      type: 'administrative_area',
      adminCode: 'US-NJ',
      precision: 'region',
      geometrySource:
        'Natural Earth 1:110m Admin 1 - States/Provinces (public domain), ' +
        'ISO 3166-2 code US-NJ.',
      attributionText: 'Administrative geometry — Natural Earth (public domain)',
      accessedAt: '2026-08-05T00:00:00Z',
    },
  },
  {
    id: 'tw-place-taiwan',
    caseId: CASE_ID,
    name: 'Taiwan',
    countryCode: 'TW',
    kind: 'country',
    geometry: {
      type: 'administrative_area',
      adminCode: 'TW',
      precision: 'country',
      geometrySource:
        'Natural Earth 1:110m Admin 0 - Countries (public domain), ISO 3166-1 alpha-2 code TW.',
      attributionText: 'Administrative geometry — Natural Earth (public domain)',
      accessedAt: '2026-08-05T00:00:00Z',
    },
  },
];
