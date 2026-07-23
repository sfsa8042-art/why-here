/**
 * Netherlands × Semiconductor Equipment — sources.
 *
 * Research Pack 1 conversion. Verification basis:
 * docs/research/netherlands-semiconductor-equipment/RESEARCH_PACK_1_LOCATORS.md
 * (maintainer-verified locator dossier) plus in-session retrieval of the
 * two corporate web pages.
 *
 * ARCHIVAL-DOCUMENT POLICY: the archival documents cited inside van
 * Duijn's dissertation (Frima reports, Del Prado letters/telexes, the
 * 17-5-1984 contribution agreement, van Rhee memoranda, Verdonschot
 * memos) have NOT been directly inspected by this project. They are NOT
 * registered as Sources; every claim citing them cites the dissertation,
 * records the archival document in the citation's provenanceNote, and
 * does not count the archival document as evidence independent of the
 * dissertation. An archival document becomes a separate documentary
 * Source only after its original scan or official reproduction has been
 * directly inspected.
 */

import type { Source } from '../../lib/schemas.ts';

export const sources: Source[] = [
  /**
   * DEPENDENCE RULING (source-level, not citation-level): this article
   * was written by Jorijn van Duijn and derives globally from the
   * research underlying his dissertation — it is that research retold,
   * not an independent corporate record that happens to agree. Hence
   * source-level derivedFromSourceIds: under V8 the article and the
   * dissertation are dependent for EVERY claim, and the corpus can
   * never count them as an independent pair merely because one carries
   * a corporate imprint and the other an academic one.
   */
  {
    id: 'nl-src-asml-founding-2024',
    title: "ASML's founding story: our roots in the semiconductor industry",
    sourceType: 'institutional_history',
    temporalRelation: 'retrospective',
    subjectRelationship: 'subject_authored',
    lengthClass: 'short_form',
    authors: ['Jorijn van Duijn'],
    institution: 'ASML',
    date: '2024-04-03',
    url: 'https://www.asml.com/en/news/stories/2024/asml-founding-story',
    derivedFromSourceIds: ['nl-src-vanduijn-2019'],
  },
  {
    id: 'nl-src-asm-our-story',
    title: 'Our story | ASM',
    sourceType: 'institutional_history',
    temporalRelation: 'retrospective',
    subjectRelationship: 'subject_authored',
    lengthClass: 'short_form',
    institution: 'ASM International',
    url: 'https://asm.com/our-company/our-story',
  },
  /**
   * Doctoral-thesis edition (Maastricht University, defense 22-11-2019).
   * subjectRelationship 'mixed', per dossier L19 and the Introduction's
   * "Historical resources" section: independent academic authorship and
   * examination, but the research was financed by Arthur del Prado and,
   * after his death, Stichting ADP; publication was co-funded by ASM
   * International; and the source base rests substantially on the Del
   * Prado personal archive. Provenance information, not a verdict of
   * unreliability — the archival documents it cites are contemporaneous
   * and often against ASM's interest (dossier NL-L-004).
   */
  {
    id: 'nl-src-vanduijn-2019',
    title:
      'Fortunes of High-Tech: A history of innovation at ASM International, 1958-2008',
    sourceType: 'academic',
    temporalRelation: 'retrospective',
    subjectRelationship: 'mixed',
    lengthClass: 'long_form',
    authors: ['Jorijn van Duijn'],
    institution: 'Maastricht University',
    date: '2019-11-22',
    doi: '10.26481/dis.20191122jv',
  },
];
