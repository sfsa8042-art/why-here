/**
 * Taiwan × Advanced Semiconductor Foundry Manufacturing — research questions.
 *
 * A ResearchQuestion asserts nothing and carries no epistemic status (v2.1 D11);
 * any explanation of why it matters resolves to sourced Claims via
 * rationaleClaimIds. RQ6 (alternatives / counterfactuals) deliberately carries
 * NO rationale claims: this pack does not yet answer it, and that gap is
 * recorded in RESEARCH_GAPS.md rather than papered over with a speculative claim.
 */

import type { ResearchQuestion } from '../../../lib/schemas.ts';

import { CASE_ID } from './case.ts';

export const researchQuestions: ResearchQuestion[] = [
  {
    id: 'tw-rq-1-capability',
    caseId: CASE_ID,
    question:
      'What industry capability is being explained — what does a dedicated (pure-play) semiconductor foundry do, and how does that differ from an integrated device manufacturer?',
    rationaleClaimIds: ['tw-f-tsmc-dedicated-foundry', 'tw-f-chang-foundry-rationale'],
  },
  {
    id: 'tw-rq-2-foundations',
    caseId: CASE_ID,
    question:
      'What industrial and institutional foundations existed before the foundry model — the public research institutions, industrial-policy organisations and the science park?',
    rationaleClaimIds: [
      'tw-f-itri-established-1973',
      'tw-f-erso-created-1974',
      'tw-f-hsinchu-park-1980',
      'tw-i-broad-industrial-policy',
    ],
  },
  {
    id: 'tw-rq-3-technology-transfer',
    caseId: CASE_ID,
    question:
      'How did semiconductor technology and knowledge enter Taiwan — through what agreements, overseas training and movement of people, and with what limits?',
    rationaleClaimIds: [
      'tw-f-rca-contract-1976',
      'tw-f-rca-cmos-process',
      'tw-f-rca-trainees',
      'tw-i-state-acquire-transfer-role',
      'tw-i-returnee-reversal',
    ],
  },
  {
    id: 'tw-rq-4-foundry-model',
    caseId: CASE_ID,
    question:
      'Why did the pure-play foundry business model emerge in Taiwan — who proposed it, who financed it, who supplied the technology, and who provided early demand?',
    rationaleClaimIds: [
      'tw-f-tsmc-founded-1987',
      'tw-f-philips-investor',
      'tw-f-tsmc-erso-transfer',
      'tw-f-chang-foundry-rationale',
    ],
  },
  {
    id: 'tw-rq-5-ecosystem',
    caseId: CASE_ID,
    question:
      'How did the surrounding ecosystem begin to form — the earlier spin-offs, the transfer of public research to private firms, and the return of experienced engineers?',
    rationaleClaimIds: [
      'tw-f-umc-1980',
      'tw-f-umc-first-transfer',
      'tw-i-returnee-reversal',
    ],
  },
  {
    id: 'tw-rq-6-alternatives',
    caseId: CASE_ID,
    question:
      'What alternative explanations and counterfactuals matter — why Taiwan rather than another economy, how much depended on timing or individual decisions, and where is the evidence still insufficient?',
    // No rationale claims yet: this pack does not answer RQ6. See RESEARCH_GAPS.md.
  },
];
