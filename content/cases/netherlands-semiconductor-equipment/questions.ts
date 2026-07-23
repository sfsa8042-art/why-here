/**
 * Netherlands × Semiconductor Equipment — research questions.
 *
 * Questions are free text because they assert nothing and carry no
 * epistemic status (CONTENT_MODEL.md). None carries rationaleClaimIds
 * yet: rationales resolve to sourced Claims, and no claims exist before
 * Increment 4's sourced research.
 */

import type { ResearchQuestion } from '../../../lib/schemas.ts';

import { CASE_ID } from './case.ts';

export const researchQuestions: ResearchQuestion[] = [
  {
    id: 'nl-q-why-netherlands',
    caseId: CASE_ID,
    question:
      'Why did advanced semiconductor lithography equipment come to be ' +
      'developed and produced in the Netherlands, rather than in the larger ' +
      'economies that dominated earlier phases of semiconductor manufacturing?',
  },
  {
    id: 'nl-q-actor-roles',
    caseId: CASE_ID,
    question:
      'What roles are attributed to corporate research organisations, ' +
      'regional supplier networks and public policy in accounts of the Dutch ' +
      'semiconductor-equipment cluster — and how much of each attributed ' +
      'role survives scrutiny against located sources?',
  },
  {
    id: 'nl-q-structural-vs-contingent',
    caseId: CASE_ID,
    question:
      'Which parts of the Dutch position in semiconductor equipment appear ' +
      'structural — capabilities, supplier relationships, accumulated ' +
      'knowledge — and which appear contingent, such that the industry could ' +
      'plausibly have formed elsewhere?',
  },
];
