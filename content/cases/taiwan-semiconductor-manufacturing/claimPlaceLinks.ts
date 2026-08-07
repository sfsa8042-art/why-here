/**
 * Taiwan × Advanced Semiconductor Foundry Manufacturing — ClaimPlaceLinks (M0).
 *
 * Four evidence-backed links. Each cites the exact geographic Citation carried
 * by its linked Claim, uses an honest precision (never above the Place
 * geometry), and is typed for what the source actually establishes:
 *   - the Hsinchu Science Park establishment (event, city precision);
 *   - TSMC's registered office (ADDRESS record, city precision — never a site);
 *   - the RCA IC-design training team (event, region precision — the source
 *     names only the US state);
 *   - ERSO as a nation-scoped research organisation (administrative scope,
 *     country precision — NOT a pinpoint event).
 * See GEOGRAPHIC_EVIDENCE.md.
 */

import type { ClaimPlaceLink } from '../../../lib/schemas.ts';

import { CASE_ID } from './case.ts';

export const claimPlaceLinks: ClaimPlaceLink[] = [
  {
    id: 'tw-cpl-park-hsinchu',
    caseId: CASE_ID,
    claimId: 'tw-f-hsinchu-park-1980',
    placeId: 'tw-place-hsinchu',
    relationship: 'event_location',
    temporalScope: { year: 1980 },
    citationIds: ['tw-cit-park-saxenian-p8'],
    evidencePrecision: 'city',
    locatorNote:
      'Saxenian locates the Hsinchu Science-based Industrial Park in Hsinchu, in the ' +
      "northwest of Taiwan. Anchored at the Hsinchu city gazetteer point; this is not a " +
      'Science-Park boundary or centroid.',
    epistemicStatus: 'well_supported',
  },
  {
    id: 'tw-cpl-tsmc-hq-hsinchu',
    caseId: CASE_ID,
    claimId: 'tw-f-tsmc-hq-hsinchu',
    placeId: 'tw-place-hsinchu',
    relationship: 'organization_registered_address',
    temporalScope: { year: 1987 },
    citationIds: ['tw-cit-tsmc-hq-20f'],
    evidencePrecision: 'city',
    locatorNote:
      "TSMC's Form 20-F records a principal-office address in the Hsinchu Science Park " +
      '(No. 8, Li-Hsin Road 6). This is a registered-address record, NOT proof of where ' +
      'TSMC founding or manufacturing activity physically occurred. Capped at city precision.',
    epistemicStatus: 'well_supported',
  },
  {
    id: 'tw-cpl-rca-training-nj',
    caseId: CASE_ID,
    claimId: 'tw-f-rca-trainees',
    placeId: 'tw-place-new-jersey',
    relationship: 'event_location',
    temporalScope: { year: 1976 },
    citationIds: ['tw-cit-trainees-itri'],
    evidencePrecision: 'region',
    locatorNote:
      'ITRI names a "New Jersey State team" among the 19 RCA trainees, studying IC design. ' +
      'The trainees were spread across several US states; this anchor covers only the named ' +
      'New Jersey design team, at region (US-state) precision, not a single RCA site.',
    epistemicStatus: 'well_supported',
  },
  {
    id: 'tw-cpl-erso-taiwan-scope',
    caseId: CASE_ID,
    claimId: 'tw-f-erso-created-1974',
    placeId: 'tw-place-taiwan',
    relationship: 'administrative_scope',
    temporalScope: { year: 1974 },
    citationIds: ['tw-cit-erso-saxenian-p6'],
    evidencePrecision: 'country',
    locatorNote:
      'ERSO was a national semiconductor-research organisation under ITRI. This link records ' +
      'its national (Taiwan-wide) administrative scope, not a specific building or event site.',
    epistemicStatus: 'well_supported',
  },
];
