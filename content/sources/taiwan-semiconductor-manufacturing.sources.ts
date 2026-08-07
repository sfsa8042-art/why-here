/**
 * Taiwan × Advanced Semiconductor Foundry Manufacturing — sources (Research Pack 1).
 *
 * Stage 11A research foundation. Every source below was DIRECTLY INSPECTED in
 * session (PDF text extracted with pdftotext, or page HTML retrieved and read),
 * mirroring the Netherlands pack's "directly inspected this session" discipline.
 * Verified locators live alongside each claim in ../cases/.../claims.ts; the
 * inspection dossier is docs/research/taiwan-semiconductor-manufacturing/
 * SOURCE_REGISTER.md.
 *
 * PROVENANCE POSTURE
 * - Chang oral history, ITRI official history and the TSMC/UMC Form 20-F filings
 *   are RETROSPECTIVE and SUBJECT_AUTHORED (a participant's or the firm's own
 *   account). That is provenance information, not a verdict of unreliability —
 *   but it means the direct-established route (which needs a CONTEMPORANEOUS
 *   documentary source) is not met by them, so claims resting on them stay
 *   well_supported (see claims.ts epistemic-ceiling note).
 * - Independent academic sources (Saxenian; the National Research Council
 *   volume; Lai/Chang/Shyu) conflict with the subject-authored accounts on
 *   several dates (RCA 1975 vs 1976; UMC 1979 vs 1980; the park's 1979 vs 1980),
 *   which is itself recorded as a limitation rather than silently resolved.
 * - Secondary works cited INSIDE these sources (Wade 1990, Callon 1995, the
 *   Industrial Economics Research Center 1987) were NOT directly inspected and
 *   are NOT registered as Sources; where a claim leans on them the debt is
 *   recorded in the citation provenanceNote and does not count as independent
 *   corroboration.
 */

import type { Source } from '../../lib/schemas.ts';

export const sources: Source[] = [
  /**
   * Participant oral history. Morris Chang founded TSMC and was President of
   * ITRI; this is his own 2007 recollection of 1985–1987 events, so it is
   * retrospective + subject_authored. Full transcript inspected via pdftotext;
   * page locators are the printed "Page N of 18".
   */
  {
    id: 'tw-src-chang-oral-2007',
    title: 'Oral History of Morris Chang (CHM Reference number X4151.2008)',
    sourceType: 'documentary',
    temporalRelation: 'retrospective',
    subjectRelationship: 'subject_authored',
    lengthClass: 'long_form',
    authors: ['Morris Chang', 'Alan Patterson (interviewer)'],
    institution: 'Computer History Museum',
    date: '2007-08-24',
    url: 'https://archive.computerhistory.org/resources/text/Oral_History/Chang_Morris/Chang_Morris_1.oral_history.2007.102658129.pdf',
    archiveRef: 'CHM X4151.2008',
  },
  /**
   * ITRI's OWN 50th-anniversary institutional history (retrospective,
   * subject_authored). Server-rendered pages inspected: /history/semiconductors/1/
   * (RCA transfer), /2/ (UMC, VLSI, TSMC), plus the dated milestone entries.
   * institutional_history is OUTSIDE the established-pair route, so ITRI-only
   * facts stay well_supported.
   */
  {
    id: 'tw-src-itri-history',
    title: 'ITRI — 50 Years of Empowering Industry Through Innovations: Semiconductors (official institutional history)',
    sourceType: 'institutional_history',
    temporalRelation: 'retrospective',
    subjectRelationship: 'subject_authored',
    lengthClass: 'short_form',
    institution: 'Industrial Technology Research Institute (ITRI)',
    url: 'https://50th.itri.org.tw/en/history/semiconductors/1/',
  },
  /**
   * Independent academic working paper. Inspected via pdftotext; printed page
   * equals the ordinal page. Cites Wade (1990) and Callon (1995) for some
   * figures — those secondary works are not independently inspected here.
   */
  {
    id: 'tw-src-saxenian-2001',
    title: "Taiwan's Hsinchu Region: Imitator and Partner for Silicon Valley (SIEPR Discussion Paper No. 00-44)",
    sourceType: 'academic',
    temporalRelation: 'retrospective',
    subjectRelationship: 'independent',
    lengthClass: 'long_form',
    authors: ['AnnaLee Saxenian'],
    institution: 'Stanford Institute for Economic Policy Research',
    date: '2001-06-16',
    url: 'https://people.ischool.berkeley.edu/~anno/Papers/hsinchu.pdf',
  },
  /**
   * Scholarly-outreach article (named author, University of Nottingham Taiwan
   * Studies Programme). Independent of the firms as a PUBLISHER
   * (subjectRelationship independent) — but that is publisher independence, not
   * evidence-chain independence: its account may itself derive from official
   * institutional histories, so it is not counted as an independent line of
   * evidence (see SUPPORT_AUDIT.md). Used only to corroborate facts already
   * carried by other sources.
   */
  {
    id: 'tw-src-taiwaninsight-2024',
    title: 'A Short History of Semiconductor Technology in Taiwan during the 1970s and the 1980s',
    sourceType: 'reputable_press',
    temporalRelation: 'retrospective',
    subjectRelationship: 'independent',
    lengthClass: 'short_form',
    authors: ['Ling-Ming Huang'],
    institution: 'Taiwan Insight (University of Nottingham Taiwan Studies Programme)',
    date: '2024-05-10',
    url: 'https://taiwaninsight.org/2024/05/10/a-short-history-of-semiconductor-technology-in-taiwan-during-the-1970s-and-the-1980s/',
  },
  /**
   * TSMC's OWN annual report on Form 20-F (FY2023), filed with the SEC.
   * Documentary but retrospective + subject_authored. Inspected on sec.gov;
   * founding statement in Item 4A "History and Development", incorporation in
   * Note 1 "General" of the financial statements.
   */
  {
    id: 'tw-src-tsmc-20f-2023',
    title: 'Taiwan Semiconductor Manufacturing Company Limited — Annual Report on Form 20-F for FY2023',
    sourceType: 'documentary',
    temporalRelation: 'retrospective',
    subjectRelationship: 'subject_authored',
    lengthClass: 'long_form',
    institution: 'Taiwan Semiconductor Manufacturing Company Limited',
    date: '2024-04-18',
    url: 'https://www.sec.gov/Archives/edgar/data/1046179/000119312524099840/d592628d20f.htm',
  },
  /**
   * Independent academic / reference volume (U.S. National Research Council,
   * National Academies Press). The Taiwan facts are a panelist's recorded
   * presentation in "Panel 4: The Taiwanese Approach"; inspected on nap.edu.
   * Note the volume itself is internally inconsistent on UMC's year (1979 vs
   * 1980) — recorded as a limitation, not silently picked.
   */
  {
    id: 'tw-src-nrc-securing-2003',
    title: 'Securing the Future: Regional and National Programs to Support the Semiconductor Industry — Panel 4: The Taiwanese Approach',
    sourceType: 'academic',
    temporalRelation: 'retrospective',
    subjectRelationship: 'independent',
    lengthClass: 'long_form',
    institution: 'National Research Council (U.S.) / National Academies Press',
    date: '2003',
    url: 'https://nap.nationalacademies.org/read/10677/chapter/9',
  },
  /**
   * UMC's OWN annual report on Form 20-F (FY2023), filed with the SEC.
   * Documentary, retrospective, subject_authored. Inspected on sec.gov; the
   * incorporation date is in Item 4A "History and Organization".
   */
  {
    id: 'tw-src-umc-20f-2023',
    title: 'United Microelectronics Corporation — Annual Report on Form 20-F for FY2023',
    sourceType: 'documentary',
    temporalRelation: 'retrospective',
    subjectRelationship: 'subject_authored',
    lengthClass: 'long_form',
    institution: 'United Microelectronics Corporation',
    date: '2024-04-25',
    url: 'https://www.sec.gov/Archives/edgar/data/1033767/000119312524111429/d448612d20f.htm',
  },
  /**
   * Named-author paper by Lai, Chang & Shyu, inspected as a hosted PDF. Stage-11A
   * hardening: the publication VENUE could not be verified — the inspected PDF
   * carries no embedded metadata and no journal name in its own header/footer
   * (only bibliography "Vol." references), and ResearchGate was unreachable this
   * session. Because the venue is unverified, it is classified HONESTLY as
   * `other`, NOT `academic`. Consequences (enforced by the evidence floors): it
   * cannot be the qualifying source for a factual claim's well_supported floor,
   * and it is not an expert source for the interpretive floor — so it is used
   * only as non-load-bearing corroboration alongside a qualifying independent
   * source. See RESEARCH_GAPS.md G10 and SUPPORT_AUDIT.md.
   */
  {
    id: 'tw-src-lai-innovation-policy',
    title: "The innovation policy priorities in industry evolution: the case of Taiwan's semiconductor industry",
    sourceType: 'other',
    temporalRelation: 'retrospective',
    subjectRelationship: 'independent',
    lengthClass: 'long_form',
    authors: ['Hsien-Che Lai', 'Shih-Chi Chang', 'Joseph Z. Shyu'],
    url: 'http://xcsc.xoc.uam.mx/apymes/webftp/documentos/biblioteca/The%20innovation%20policy%20priorities%20in%20industry%20evolution.pdf',
  },
];
