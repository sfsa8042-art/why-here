/**
 * Netherlands × Semiconductor Equipment — case metadata.
 *
 * Status `research`: verified claims carry the epistemic statuses they
 * actually earn, but the case has no thesis and must not be presented
 * as completed. Flagship conversion happens only when the full analysis
 * earns an interpretive or causal thesis claim (Increment 4 and later).
 */

import type { ResearchCase } from '../../../lib/schemas.ts';

export const CASE_ID = 'netherlands-semiconductor-equipment';

export const netherlandsCase: ResearchCase = {
  id: CASE_ID,
  country: 'Netherlands',
  industry: 'Semiconductor Equipment',
  status: 'research',
  researchQuestionIds: [
    'nl-q-why-netherlands',
    'nl-q-actor-roles',
    'nl-q-structural-vs-contingent',
  ],
};
