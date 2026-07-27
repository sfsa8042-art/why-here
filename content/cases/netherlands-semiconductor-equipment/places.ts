/**
 * Netherlands × Semiconductor Equipment — Places (Increment M0).
 *
 * Two neutral gazetteer entities. A Place proves ONLY that the city and its
 * coordinates exist; it asserts no history. Each coordinate is a
 * representative city coordinate (a city-level gazetteer point), NOT a
 * geographic centroid (the source does not state a centroid), NOT the
 * recorded street addresses Meierijweg 15 / Kastanjelaan, and NOT a modern
 * ASML headquarters coordinate. They are static and attributed — no runtime
 * geocoding. See GEOGRAPHIC_EVIDENCE_PACK_1.md.
 */

import type { Place } from '../../../lib/schemas.ts';

import { CASE_ID } from './case.ts';

const WIKI_ATTRIBUTION =
  'City coordinates via Wikipedia contributors, CC BY-SA 4.0';

export const places: Place[] = [
  {
    id: 'nl-place-veldhoven',
    caseId: CASE_ID,
    name: 'Veldhoven',
    countryCode: 'NL',
    kind: 'city',
    geometry: {
      type: 'point',
      longitude: 5.405,
      latitude: 51.42,
      precision: 'city',
      coordinateSource:
        'Representative city coordinate (city-level gazetteer point). ' +
        'Source: Wikipedia (en), page title "Veldhoven", ' +
        'https://en.wikipedia.org/wiki/Veldhoven — infobox coordinates ' +
        '51.42000, 5.40500.',
      attributionText: WIKI_ATTRIBUTION,
      accessedAt: '2026-07-27T00:00:00Z',
    },
  },
  {
    id: 'nl-place-eindhoven',
    caseId: CASE_ID,
    name: 'Eindhoven',
    countryCode: 'NL',
    kind: 'city',
    geometry: {
      type: 'point',
      longitude: 5.483,
      latitude: 51.433,
      precision: 'city',
      coordinateSource:
        'Representative city coordinate (city-level gazetteer point). ' +
        'Source: Wikipedia (en), page title "Eindhoven", ' +
        'https://en.wikipedia.org/wiki/Eindhoven — infobox coordinates ' +
        '51.433, 5.483.',
      attributionText: WIKI_ATTRIBUTION,
      accessedAt: '2026-07-27T00:00:00Z',
    },
  },
];
