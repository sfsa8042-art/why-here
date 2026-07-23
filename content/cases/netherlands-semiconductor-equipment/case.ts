/**
 * Netherlands × Semiconductor Equipment — case metadata.
 *
 * Registered as a PREVIEW case for now: it poses research questions and
 * asserts nothing. It becomes the flagship case only in Increment 4,
 * when claims are authored against real located sources; a thesis
 * cannot exist before the claim it must resolve to.
 */

import type { PreviewCase } from '../../../lib/schemas.ts';

export const CASE_ID = 'netherlands-semiconductor-equipment';

export const netherlandsCase: PreviewCase = {
  id: CASE_ID,
  country: 'Netherlands',
  industry: 'Semiconductor Equipment',
  status: 'preview',
  researchQuestionIds: [
    'nl-q-why-netherlands',
    'nl-q-actor-roles',
    'nl-q-structural-vs-contingent',
  ],
};
