/**
 * Country presentation content (Public Atlas V2, Stage 9.1).
 *
 * A SEPARATE, typed presentation layer for the map-first Atlas country summary:
 * the ordinary-user "Specialisation" label and the atlas-facing question, linked
 * to a case by slug. This is curated PRODUCT copy — it never alters the research
 * corpus (Claims / NarrativeChapters / Sources / Media). Reading meta for an
 * Explore-capable case is derived live from its chapters, not stored here.
 */

import type { CountryPresentation } from '../../lib/atlasPresentation.ts';

export const countryPresentations: CountryPresentation[] = [
  {
    slug: 'netherlands-semiconductor-equipment',
    specialisation: 'Semiconductor lithography equipment',
    // Aligned with the currently documented corpus and the canonical case question
    // (a "developed its strength" framing, not an "essential to" strength claim).
    question: 'How did the Netherlands develop its strength in semiconductor lithography equipment?',
  },
  {
    slug: 'taiwan-semiconductor-manufacturing',
    specialisation: 'Semiconductor manufacturing',
    question: 'How did Taiwan develop its semiconductor manufacturing industry?',
  },
  {
    slug: 'france-luxury',
    specialisation: 'Luxury industry',
    question: 'How did France develop its modern luxury industry?',
  },
];
