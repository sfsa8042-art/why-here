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
   * Official EU project record (Research Pack 3), DIRECTLY INSPECTED
   * this session at the URL below. Classified retrospective, not
   * contemporaneous: the project metadata originated during the project
   * period (1988-1991), but the currently inspected page is a later
   * archival compilation — content archived 2024-04-16, last update
   * 1-9-2025. Only directly inspected metadata is recorded here.
   * Programme as printed: "European strategic programme (EEC) for
   * research and development in information technologies (ESPRIT), 1987-1992"
   * (FP2 / ESPRIT 2). The record publishes NO funding amount ("No
   * data" for total cost and EU contribution). No second Source is
   * created to simulate contemporaneous metadata; a contemporaneous
   * documentary Source may be added only after an original project-era
   * document is directly inspected.
   */
  {
    id: 'nl-src-cordis-deepuv-2048',
    title:
      'Deep UV Lithography (DEEP-UV) — CORDIS project record, grant agreement 2048',
    sourceType: 'documentary',
    temporalRelation: 'retrospective',
    subjectRelationship: 'independent',
    lengthClass: 'short_form',
    institution: 'European Commission (CORDIS)',
    url: 'https://cordis.europa.eu/project/id/2048',
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
  /**
   * ASML's OWN RETROSPECTIVE ACCOUNT (Retrieval Pack 4B). Directly
   * inspected via the SEC-hosted exhibit. This document is Exhibit 99.1
   * to a Form 6-K (accession 0000937966-18-000008, filed 7 February
   * 2018, SEC file no. 001-33463) — it is NOT itself a Form 20-F; the
   * FY2017 20-F is a separate accession (0000937966-18-000007). The
   * "A short company history" section (report page 8) recounts the 1991
   * PAS 5500 launch, the 3 October 1994 incorporation of the holding
   * company, and the 1995 public listing — events more than twenty
   * years before publication. Hence documentary / retrospective /
   * subject_authored.
   *
   * DEPENDENCE: this report, ASML's FY2013 Form 20-F, the ASML
   * Integrated Report 2018, the ASML Annual Report 2022, and asml.com's
   * history page are ONE subject-authored evidence line. Repetition
   * across ASML's own publications is not independent corroboration, so
   * NO separate Source records are created for the 2018 report, the
   * 2022 annual report, or the 2013 20-F — they would only inflate
   * apparent corroboration. Any claim resting solely on this line is
   * therefore capped at well_supported; established (which requires a
   * contemporaneous documentary source or two mutually independent
   * lines) is not met.
   */
  {
    id: 'nl-src-asml-integrated-report-2017',
    title: 'ASML Integrated Report 2017',
    sourceType: 'documentary',
    temporalRelation: 'retrospective',
    subjectRelationship: 'subject_authored',
    lengthClass: 'long_form',
    institution: 'ASML Holding N.V.',
    date: '2018-02-07',
    url: 'https://www.sec.gov/Archives/edgar/data/937966/000093796618000008/a2017integratedreportbased.htm',
  },
];
