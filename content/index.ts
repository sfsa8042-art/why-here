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

export const productionRegistry: ContentRegistry = {
  sourceModules: [
    {
      moduleId: 'sources/netherlands-semiconductor-equipment',
      sources: netherlandsSources,
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
    },
  ],
};
