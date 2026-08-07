/**
 * Why Here? — production content registry.
 *
 * EXPLICIT registration, no filesystem magic: every content module is
 * imported and listed here by hand, so the production corpus is
 * statically discoverable, deterministic and Next.js-build compatible.
 * A content file that is not registered here does not exist as far as
 * the product is concerned — and the loader refuses duplicate
 * registrations, so a module cannot be counted twice either.
 *
 * Fixture content under content/__fixtures__/ is test-only and must
 * never be registered here.
 */

import type { ContentRegistry } from '../lib/loadContent.ts';

import { sources as netherlandsSources } from './sources/netherlands-semiconductor-equipment.sources.ts';
import { CASE_ID as NETHERLANDS_CASE_ID, netherlandsCase } from './cases/netherlands-semiconductor-equipment/case.ts';
import { researchQuestions as netherlandsQuestions } from './cases/netherlands-semiconductor-equipment/questions.ts';
import { claims as netherlandsClaims } from './cases/netherlands-semiconductor-equipment/claims.ts';
import { nodes as netherlandsNodes } from './cases/netherlands-semiconductor-equipment/nodes.ts';
import { edges as netherlandsEdges } from './cases/netherlands-semiconductor-equipment/edges.ts';
import { alternativeExplanations as netherlandsAlternatives } from './cases/netherlands-semiconductor-equipment/alternatives.ts';
import { places as netherlandsPlaces } from './cases/netherlands-semiconductor-equipment/places.ts';
import { claimPlaceLinks as netherlandsClaimPlaceLinks } from './cases/netherlands-semiconductor-equipment/claimPlaceLinks.ts';

import { sources as taiwanSources } from './sources/taiwan-semiconductor-manufacturing.sources.ts';
import { CASE_ID as TAIWAN_CASE_ID, taiwanCase } from './cases/taiwan-semiconductor-manufacturing/case.ts';
import { researchQuestions as taiwanQuestions } from './cases/taiwan-semiconductor-manufacturing/questions.ts';
import { claims as taiwanClaims } from './cases/taiwan-semiconductor-manufacturing/claims.ts';
import { places as taiwanPlaces } from './cases/taiwan-semiconductor-manufacturing/places.ts';
import { claimPlaceLinks as taiwanClaimPlaceLinks } from './cases/taiwan-semiconductor-manufacturing/claimPlaceLinks.ts';

export const productionRegistry: ContentRegistry = {
  sourceModules: [
    {
      moduleId: 'sources/netherlands-semiconductor-equipment',
      sources: netherlandsSources,
    },
    {
      moduleId: 'sources/taiwan-semiconductor-manufacturing',
      sources: taiwanSources,
    },
  ],
  caseModules: [
    {
      moduleId: 'cases/netherlands-semiconductor-equipment',
      caseId: NETHERLANDS_CASE_ID,
      case: netherlandsCase,
      claims: netherlandsClaims,
      researchQuestions: netherlandsQuestions,
      nodes: netherlandsNodes,
      edges: netherlandsEdges,
      alternativeExplanations: netherlandsAlternatives,
      places: netherlandsPlaces,
      claimPlaceLinks: netherlandsClaimPlaceLinks,
    },
    {
      // Stage 11A research foundation. A `research`-status case: verified claims,
      // NO thesis, NO mechanism graph (nodes/edges/alternatives are empty), NO
      // chapters, NO media. The public Atlas keeps Taiwan `planned` / no modes.
      moduleId: 'cases/taiwan-semiconductor-manufacturing',
      caseId: TAIWAN_CASE_ID,
      case: taiwanCase,
      claims: taiwanClaims,
      researchQuestions: taiwanQuestions,
      nodes: [],
      edges: [],
      alternativeExplanations: [],
      places: taiwanPlaces,
      claimPlaceLinks: taiwanClaimPlaceLinks,
    },
  ],
};
