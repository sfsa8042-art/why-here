/**
 * Taiwan × Advanced Semiconductor Foundry Manufacturing — case (Stage 11A).
 *
 * A RESEARCH case (lib/schemas.ts ResearchCaseSchema): it carries verified
 * claims at the epistemic statuses they actually earn, but NO thesis
 * (`thesisClaimId` is structurally absent and rejected by `.strict()`), no
 * mechanism graph and no narrative chapters. This is research in progress —
 * an evidence foundation for a possible future public story, NOT a finished
 * case. The public Atlas keeps Taiwan `planned` with `availableModes: []`
 * (content/atlas/cases.ts); this evidence layer is separate and does not
 * launch any public route.
 */

import type { ResearchCase } from '../../../lib/schemas.ts';

export const CASE_ID = 'taiwan-semiconductor-manufacturing';

export const taiwanCase: ResearchCase = {
  id: CASE_ID,
  country: 'Taiwan',
  industry: 'Semiconductor foundry manufacturing',
  status: 'research',
  researchQuestionIds: [
    'tw-rq-1-capability',
    'tw-rq-2-foundations',
    'tw-rq-3-technology-transfer',
    'tw-rq-4-foundry-model',
    'tw-rq-5-ecosystem',
    'tw-rq-6-alternatives',
  ],
};
