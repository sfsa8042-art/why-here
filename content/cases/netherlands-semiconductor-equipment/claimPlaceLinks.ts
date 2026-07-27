/**
 * Netherlands × Semiconductor Equipment — ClaimPlaceLinks (Increment M0).
 *
 * Exactly two evidence-backed links, both derived from the SAME Source
 * (CORDIS 2048) and the SAME project — not independent geographic
 * corroboration. Each is typed as an ADDRESS record, capped at city
 * precision, and cites the exact geographic Citation on its Claim. Neither
 * asserts an operating, research, production, event or founding location.
 * See GEOGRAPHIC_EVIDENCE_PACK_1.md.
 */

import type { ClaimPlaceLink } from '../../../lib/schemas.ts';

import { CASE_ID } from './case.ts';

export const claimPlaceLinks: ClaimPlaceLink[] = [
  {
    id: 'nl-cpl-deepuv-coordinator-veldhoven',
    caseId: CASE_ID,
    claimId: 'nl-f-deepuv-coordination',
    placeId: 'nl-place-veldhoven',
    relationship: 'project_coordinator_address',
    temporalScope: { year: 1988, endYear: 1991 },
    /* The single CORDIS Coordinator citation on the coordination claim also
     * carries the Veldhoven address; no duplicate address citation exists. */
    citationIds: ['nl-cit-deepuv-coordinator-cordis'],
    evidencePrecision: 'city',
    locatorNote:
      'CORDIS records the coordinator ASM Lithography at a Veldhoven postal ' +
      'address (Meierijweg 15). This is a coordinator postal/address record, ' +
      'NOT proof that DEEP-UV coordination activity physically occurred in ' +
      'Veldhoven.',
    epistemicStatus: 'well_supported',
    provenanceNote:
      'The CORDIS address block may reflect later database curation; the ' +
      'Veldhoven postcode field shows an anomalous "8805" prefix before the ' +
      'Dutch postcode "5503 HN". Capped at city precision; this anchor and ' +
      'the Eindhoven anchor derive from the same Source and project.',
  },
  {
    id: 'nl-cpl-deepuv-participant-eindhoven',
    caseId: CASE_ID,
    claimId: 'nl-f-deepuv-participants',
    placeId: 'nl-place-eindhoven',
    relationship: 'project_participant_address',
    temporalScope: { year: 1988, endYear: 1991 },
    /* The single CORDIS Participants citation on the participants claim also
     * carries the Philips Eindhoven address; no duplicate address citation. */
    citationIds: ['nl-cit-deepuv-participants-cordis'],
    evidencePrecision: 'city',
    locatorNote:
      'CORDIS records the participant Nederlandse Philips Bedrijven BV at an ' +
      'Eindhoven postal address (Kastanjelaan). This is a participant ' +
      'address, NOT proof of a Philips lithography research site or the ' +
      'physical location of DEEP-UV work.',
    epistemicStatus: 'well_supported',
    provenanceNote:
      'The CORDIS address block may reflect later database curation. Capped ' +
      'at city precision; both anchors derive from the same Source ' +
      '(CORDIS 2048) and the same project.',
  },
];
