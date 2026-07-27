/**
 * Netherlands × Semiconductor Equipment — claims (Research Pack 1).
 *
 * Authored against maintainer-verified locators:
 * docs/research/netherlands-semiconductor-equipment/RESEARCH_PACK_1_LOCATORS.md
 * (dossier references L1–L19 below), plus in-session retrieval of the
 * two corporate history pages.
 *
 * Dissertation locator convention: `page` locators give the thesis
 * printed page, with the PDF page in parentheses (printed = PDF − 3 per
 * the dossier). Citation `note` carries chapter/section and footnote;
 * `provenanceNote` names any archival document the footnote rests on and
 * records that the original was NOT directly inspected by this project.
 *
 * Discipline applied in this pack: no causal claims, no counterfactual
 * claims, no thesis, atomic statements only. The 13.5M advance is
 * recorded WITHOUT "prevented closure" (that reading stays out until it
 * can be authored as a properly evidenced interpretive claim), and no
 * claim connects the liquidity crisis to the exit. lensFacets are left
 * empty pending the Analytical Lenses layer.
 *
 * Epistemic ceiling note: `established` is unreachable in this pack —
 * no source is contemporaneous documentary, and the corpus holds only
 * one academic source (institutional histories are outside the
 * established pair route). Every factual claim below carries the
 * well_supported status it earns from the dissertation citation.
 *
 * Citation ids (Increment M0): every Citation carries a stable,
 * human-readable, globally-unique id. Two geographic address citations
 * were added on the DEEP-UV coordination/participants claims (marked
 * "geographic evidence, M0"); they locate the CORDIS Coordinator and
 * Participants ADDRESS blocks and are the cited evidence for the two
 * ClaimPlaceLinks (see ./claimPlaceLinks.ts). They record an address, not
 * an operating/research/production/event location.
 */

import type { Claim } from '../../../lib/schemas.ts';

import { CASE_ID } from './case.ts';

const VANDUIJN = 'nl-src-vanduijn-2019';
const ASML_2024 = 'nl-src-asml-founding-2024';
const ASM_STORY = 'nl-src-asm-our-story';
const ASML_IR_2017 = 'nl-src-asml-integrated-report-2017';
const CORDIS = 'nl-src-cordis-deepuv-2048';

const NOT_INSPECTED =
  'The original archival document was not directly inspected by this ' +
  'project; support is attributed to the dissertation, not to the ' +
  'archival document, and it does not count as evidence independent of ' +
  'the dissertation.';

export const claims: Claim[] = [
  /* 1 — establishment (dossier L10, L11; ASML 2024 page) */
  {
    id: 'nl-f-jv-established-1984',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      'ASM Lithography had been established by April 1984 as a joint venture ' +
      'of Philips and ASM International.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'nl-cit-jv-established-vanduijn-p278',
        sourceId: VANDUIJN,
        locator: { kind: 'page', value: '278 (PDF 281)' },
        evidenceRole: 'supports',
        note: 'Ch. 12, "Starting ASM Lithography", fn. 105: registration as ASM Lithography BV by April 1984.',
        provenanceNote:
          'The passage’s fn. 105 cites an archival document: Del Prado ' +
          'telex re: MIP participation, 4-11-1983 (ADP archive). The telex ' +
          'predates the registration it accompanies, so the by-April-1984 ' +
          'dating rests on the dissertation’s account, not on the telex ' +
          'itself. ' + NOT_INSPECTED,
      },
      {
        id: 'nl-cit-jv-established-asml2024',
        sourceId: ASML_2024,
        locator: {
          kind: 'paragraph',
          value: '"ASML was established as ASM Lithography on April 1, 1984"',
        },
        evidenceRole: 'supports',
        note: 'States the exact founding day; this claim asserts only "by April 1984".',
      },
    ],
    lensFacets: [],
  },

  /* 2 — contribution agreement (dossier L11) */
  {
    id: 'nl-f-contribution-agreement-1984',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      'Under the contribution agreement of 17 May 1984, ASM International and ' +
      'Philips each pledged approximately seven million Dutch guilders to ASM ' +
      'Lithography, with part of the Philips contribution made in kind.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'nl-cit-contribution-vanduijn-p278',
        sourceId: VANDUIJN,
        locator: { kind: 'page', value: '278 (PDF 281)' },
        evidenceRole: 'supports',
        note: 'Ch. 12, "Starting ASM Lithography", fn. 106.',
        provenanceNote:
          'The passage’s fn. 106 cites the archival document "Overeenkomst ' +
          'hoogte van inbreng door Nederl. Philips Bedr. B.V. in A.L.S. ' +
          'B.V." (17-5-1984), which directly documents the pledged ' +
          'contributions. ' + NOT_INSPECTED,
      },
    ],
    lensFacets: [],
  },

  /* 3 — 47 employees transferred (dossier L11; ASML 2024 page) */
  {
    id: 'nl-f-employees-transferred',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      'Forty-seven Philips employees transferred to ASM Lithography at its start.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'nl-cit-employees-vanduijn-p278',
        sourceId: VANDUIJN,
        locator: { kind: 'page', value: '278 (PDF 281)' },
        evidenceRole: 'supports',
        note: 'Ch. 12, "Starting ASM Lithography", fn. 106: 47 employees transferred.',
        provenanceNote:
          'The passage’s fn. 106 cites the archival contribution ' +
          'agreement of 17-5-1984. Whether the transfer count appears in ' +
          'the agreement itself could not be verified. ' + NOT_INSPECTED,
      },
      {
        id: 'nl-cit-employees-asml2024',
        sourceId: ASML_2024,
        locator: {
          kind: 'paragraph',
          value: '"47 of approximately 50 Philips S&I employees accepted positions"',
        },
        evidenceRole: 'supports',
      },
    ],
    lensFacets: [],
  },

  /* 4 — reluctance, interpretive (dossier L11; ASML 2024 page) */
  {
    id: 'nl-i-transfer-reluctance',
    caseId: CASE_ID,
    claimType: 'interpretive',
    statement:
      'Most of the transferred Philips employees joined ASM Lithography ' +
      'against their wishes.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'nl-cit-reluctance-vanduijn-p278',
        sourceId: VANDUIJN,
        locator: { kind: 'page', value: '278 (PDF 281)' },
        evidenceRole: 'supports',
        note: 'Ch. 12, "Starting ASM Lithography", fn. 106: "most against their wishes".',
        provenanceNote:
          'The passage’s fn. 106 cites the archival contribution ' +
          'agreement of 17-5-1984, which can document the agreement terms ' +
          'and the transfer structure but not the transferred employees’ ' +
          'wishes. The "most against their wishes" characterization is van ' +
          'Duijn’s narrative and is NOT attributed to the agreement. ' +
          NOT_INSPECTED,
      },
      {
        id: 'nl-cit-reluctance-asml2024',
        sourceId: ASML_2024,
        locator: {
          kind: 'paragraph',
          value: '"they considered the joint venture a form of asset stripping by Philips"',
        },
        evidenceRole: 'supports',
        note: 'Subject-authored retrospective corroboration of the reluctance.',
      },
    ],
    lensFacets: [],
  },

  /* 5 — MIP non-participation (dossier L10) */
  {
    id: 'nl-f-mip-non-participation',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      'Participation of the state-backed venture capital company MIP in ASM ' +
      'Lithography was considered in late 1983 but did not materialize.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'nl-cit-mip-vanduijn-p278',
        sourceId: VANDUIJN,
        locator: { kind: 'page', value: '278 (PDF 281)' },
        evidenceRole: 'supports',
        note: 'Ch. 12, "Starting ASM Lithography", fn. 105.',
        provenanceNote:
          'The passage’s fn. 105 cites an archival document: Del Prado ' +
          'telex re: MIP participation, 4-11-1983 (ADP archive). The telex ' +
          'documents that MIP participation was under consideration; that ' +
          'it did not materialize is the dissertation’s subsequent ' +
          'account, not something a 1983 telex could record. ' + NOT_INSPECTED,
      },
    ],
    lensFacets: [],
  },

  /* 6 — hydraulic stage problems, first Frima report (dossier L8) */
  {
    id: 'nl-f-hydraulic-stage-problems-1983',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      'An October 1983 technical report by ASM’s technical liaison ' +
      'documented noise, vibration and oil-contamination problems in the PAS ' +
      '2000’s hydraulic stage and the need to replace it rapidly with an ' +
      'electrical system.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'nl-cit-hydraulic-vanduijn-p277',
        sourceId: VANDUIJN,
        locator: { kind: 'page', value: '277 (PDF 280)' },
        evidenceRole: 'supports',
        note: 'Ch. 12, "Starting ASM Lithography", fn. 103.',
        provenanceNote:
          'The passage’s fn. 103 cites the archival document it describes: ' +
          'Frima, "Rapport bezoek aan Philips Lithografie" (5-10-1983). ' +
          NOT_INSPECTED,
      },
    ],
    lensFacets: [],
  },

  /* 7 — further commercialization problems, second Frima report (dossier L9) */
  {
    id: 'nl-f-pas2000-commercialization-problems-1983',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      'A second October 1983 report identified additional PAS 2000 ' +
      'commercialization problems concerning lens quality, subassembly ' +
      'supply, printed circuit boards, the absence of six-inch wafer ' +
      'capability and the reticle system.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'nl-cit-pas2000-problems-vanduijn-p278',
        sourceId: VANDUIJN,
        locator: { kind: 'page', value: '278 (PDF 281)' },
        evidenceRole: 'supports',
        note: 'Ch. 12, "Starting ASM Lithography", fn. 104: "not yet as ready for commercialization as originally indicated".',
        provenanceNote:
          'The passage’s fn. 104 cites the archival document it describes: ' +
          'Frima report (13-10-1983). ' + NOT_INSPECTED,
      },
    ],
    lensFacets: [],
  },

  /* 8 — the 13.5M advance, WITHOUT the prevented-closure reading (dossier L15) */
  {
    id: 'nl-f-philips-advance-1987',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      'In the summer of 1987, Philips advanced 13.5 million Dutch guilders to ' +
      'ASM Lithography on ASM International’s behalf.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'nl-cit-advance-vanduijn-p404',
        sourceId: VANDUIJN,
        locator: { kind: 'page', value: '404 (PDF 406-407)' },
        evidenceRole: 'supports',
        note: 'Ch. 19, fn. 53.',
        provenanceNote:
          'The passage’s fn. 53 cites archival documents: Verdonschot ' +
          'internal memos (8-10-1986; 9-9-1986). The memos precede the ' +
          'summer 1987 advance and document the underlying cash strain; ' +
          'the advance itself rests on the dissertation’s account. The ' +
          'dissertation’s further causal characterization of this advance ' +
          'is deliberately not asserted by this claim. ' + NOT_INSPECTED,
      },
    ],
    lensFacets: [],
  },

  /* 9 — ASM withdrawal, 31 July 1988 (dossier L17; ASM story page) */
  {
    id: 'nl-f-asm-withdrawal-1988',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      'ASM International withdrew from ASM Lithography on 31 July 1988.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'nl-cit-withdrawal-vanduijn-p414',
        sourceId: VANDUIJN,
        locator: { kind: 'page', value: '414-415 (PDF 417-418)' },
        evidenceRole: 'supports',
        note: 'Ch. 19, "Stop the bleeding", fns. 83-87.',
        provenanceNote:
          'The passage’s fns. 83-87 cite archival documents and interviews: ' +
          'van Rhee memo (6-7-1988), Del Prado letters to the Supervisory ' +
          'Board (22-6-1988), interviews (van Rhee, van den Hoek, ' +
          'Blickman). ' + NOT_INSPECTED,
      },
      {
        id: 'nl-cit-withdrawal-asmstory',
        sourceId: ASM_STORY,
        locator: {
          kind: 'section',
          value: 'Timeline, "70 & 80s": "ASM sold its share in ASML in 1988"',
        },
        evidenceRole: 'supports',
        note: 'Year-level corroboration only; the 31 July date rests on the dissertation.',
      },
    ],
    lensFacets: [],
  },

  /* 10 — the 8.6M stake acquisition (dossier L17) */
  {
    id: 'nl-f-philips-stake-acquisition-1988',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      'Philips acquired ASM International’s 50% stake in ASM Lithography ' +
      'for 8.6 million Dutch guilders.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'nl-cit-stake-vanduijn-p414',
        sourceId: VANDUIJN,
        locator: { kind: 'page', value: '414-415 (PDF 417-418)' },
        evidenceRole: 'supports',
        note: 'Ch. 19, "Stop the bleeding", fns. 83-87; against roughly 70 million guilders ASM had invested.',
        provenanceNote:
          'The passage’s fns. 83-87 cite archival documents and interviews ' +
          '(van Rhee memo 6-7-1988; Del Prado letters 22-6-1988; ' +
          'interviews). The underlying sale agreement itself is not cited ' +
          'on the pages read (dossier §8). ' + NOT_INSPECTED,
      },
    ],
    lensFacets: [],
  },

  /* ---------------- Research Pack 3 — DEEP-UV (CORDIS record) --------
   * Source directly inspected this session. Claims 11-14 are factual
   * statements about the official project record only: no causal
   * connection to ASML's survival, no PAS 5500 link, no funding amount
   * (none is published), no participant roles inferred. Reported
   * prototype results are framed as record-reported, not as
   * independently replicated measurements. */

  /* 11 — coordination and run dates */
  {
    id: 'nl-f-deepuv-coordination',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      'ASM Lithography coordinated the ESPRIT project "Deep UV Lithography" ' +
      '(DEEP-UV, grant agreement 2048), which ran from 1 November 1988 to ' +
      '31 October 1991.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'nl-cit-deepuv-coordination-projinfo-cordis',
        sourceId: CORDIS,
        locator: { kind: 'section', value: 'Project Information' },
        evidenceRole: 'supports',
        note: 'Official project metadata: title, acronym, grant agreement ID 2048, start 1-11-1988, end 31-10-1991.',
      },
      {
        /* One Coordinator block. It supports BOTH the coordination claim and
         * the Veldhoven ClaimPlaceLink (M0) — no separate address citation,
         * because the address is part of this same coordinator record. */
        id: 'nl-cit-deepuv-coordinator-cordis',
        sourceId: CORDIS,
        locator: { kind: 'section', value: 'Coordinator' },
        evidenceRole: 'supports',
        note:
          'Official project metadata: coordinator "ASM LITHOGRAPHY" ' +
          '(Netherlands), as printed, at the recorded address ' +
          '"MEIERIJWEG 15, 8805 5503 HN VELDHOVEN Netherlands". The postcode ' +
          'field shows an anomalous "8805" prefix before the Dutch postcode ' +
          '"5503 HN". This single Coordinator block is the evidence for both ' +
          'the coordination claim and the Veldhoven ClaimPlaceLink; the ' +
          'Veldhoven entry is a coordinator postal/address record only — not ' +
          'proof that coordination activity physically occurred there.',
      },
    ],
    lensFacets: [],
  },

  /* 12 — participants (names copied exactly from the inspected record) */
  {
    id: 'nl-f-deepuv-participants',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      'Nederlandse Philips Bedrijven BV and Carl Zeiss GmbH participated in ' +
      'the DEEP-UV project alongside ASM Lithography as coordinator; the ' +
      'consortium as listed also included Siemens AG, the Commissariat à ' +
      'l’Energie Atomique (CEA), the Fraunhofer Institut für ' +
      'Silicatforschung and Hoechst AG.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        /* One Participants block. It supports BOTH the participants claim and
         * the Eindhoven ClaimPlaceLink (M0) — no separate address citation,
         * because the address is part of this same participant record. */
        id: 'nl-cit-deepuv-participants-cordis',
        sourceId: CORDIS,
        locator: { kind: 'section', value: 'Participants' },
        evidenceRole: 'supports',
        note:
          'Official project metadata. Participants exactly as printed on the ' +
          'record: "CARL ZEISS GMBH" (DE), "Commissariat à l\'Energie ' +
          'Atomique/CEA" (FR), "FRAUNHOFER INSTITUT FÜR SILICATFORSCHUNG" ' +
          '(DE), "HOECHST AG" (DE), "NEDERLANDSE PHILIPS BEDRIJVEN BV" (NL) ' +
          'at the recorded address "KASTANJELAAN, 1218 5600 MD EINDHOVEN", ' +
          '"Siemens AG" (DE, two locations listed). The record states no ' +
          'individual roles or contributions, and none are asserted. This ' +
          'single Participants block is the evidence for both the ' +
          'participants claim and the Eindhoven ClaimPlaceLink; the Eindhoven ' +
          'entry is a participant address only — not proof of a Philips ' +
          'lithography research site or the physical location of DEEP-UV work.',
      },
    ],
    lensFacets: [],
  },

  /* 13 — stated technical objective */
  {
    id: 'nl-f-deepuv-objective',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      'The DEEP-UV project’s stated objective was to develop deep-ultraviolet ' +
      'lithography — a wafer stepper with excimer laser (248 nm) ' +
      'illumination — for semiconductor production with minimum features ' +
      'below 0.5 micrometres, with work extending toward 0.25 micrometres.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'nl-cit-deepuv-objective-cordis',
        sourceId: CORDIS,
        locator: { kind: 'section', value: 'Objective' },
        evidenceRole: 'supports',
        note:
          'Stated project objective, as published: "production capability for ' +
          'minimum details below 0.5 micron in the early 1990s, with the ' +
          'potential to extend down to 0.25 micron in the mid-1990s"; deep UV ' +
          'wafer stepper with excimer laser (248 nm) illumination. A ' +
          'statement of the official objective — not an assertion that the ' +
          'objective was fully achieved commercially.',
      },
    ],
    lensFacets: [],
  },

  /* 14 — record-reported prototype results */
  {
    id: 'nl-f-deepuv-reported-results',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      'The CORDIS project record reports that the project realized and ' +
      'tested a deep-UV stepper prototype featuring 5x reduction all-quartz ' +
      'optics and a through-the-lens alignment system with direct reference ' +
      'to the reticle, with overlay accuracy better than 125 nm and later 60 ' +
      'nm, and resolution of 0.35 micrometres with single-layer resist and ' +
      '0.25 micrometres with top-surface imaging resist.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'nl-cit-deepuv-results-cordis',
        sourceId: CORDIS,
        locator: { kind: 'section', value: 'Objective' },
        evidenceRole: 'supports',
        note:
          'Project-reported results. The record has no separate results ' +
          'heading; the results paragraphs ("A prototype of the deep ' +
          'ultraviolet (UV) stepper was realized and tested…") appear within ' +
          'the Objective section. These are the project’s own reported ' +
          'outcomes as compiled by CORDIS, not independently replicated ' +
          'technical measurements.',
      },
    ],
    lensFacets: [],
  },

  /* ---------------- Retrieval Pack 4B — ASML Integrated Report 2017 ---
   * Source directly inspected via the SEC-hosted exhibit (S14). Claims
   * 15-17 are atomic factual statements from the "A short company
   * history" section (report page 8), each cited to that named section.
   * The source is ASML's own retrospective account and forms ONE
   * subject-authored line with ASML's 2013 20-F, 2018 report, 2022
   * annual report and history page — repetition across those is not
   * independent corroboration, so all three claims are capped at
   * well_supported. Attribution ("ASML states that") in claims 15 and
   * 17 is load-bearing and preserved verbatim. No PAS 5500
   * specifications, customers, financial performance, Philips
   * financing/ownership, IPO terms, or DEEP-UV/ESPRIT link is asserted. */

  /* 15 — PAS 5500 launch (attributed) */
  {
    id: 'nl-f-pas5500-launched-1991',
    caseId: CASE_ID,
    claimType: 'factual',
    statement: 'ASML states that it launched the PAS 5500 in 1991.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'nl-cit-pas5500-asmlir2017',
        sourceId: ASML_IR_2017,
        locator: { kind: 'section', value: '"A short company history", report page 8' },
        evidenceRole: 'supports',
        note:
          'ASML Integrated Report 2017, Exhibit 99.1 to Form 6-K (accession ' +
          '0000937966-18-000008, filed 7 February 2018, SEC file no. ' +
          '001-33463). The source additionally characterises the PAS 5500 as ' +
          '"a major success"; that evaluative characterisation is EXCLUDED ' +
          'from this claim, which carries only the stated launch year. This ' +
          'is ASML’s own retrospective account, not independent corroboration.',
      },
    ],
    lensFacets: [],
  },

  /* 16 — holding-company incorporation */
  {
    id: 'nl-f-holding-company-incorporated-1994',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      'ASM Lithography Holding N.V. was incorporated in the Netherlands on ' +
      '3 October 1994 to serve as the holding company for ASML’s worldwide ' +
      'operations.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'nl-cit-holding-asmlir2017',
        sourceId: ASML_IR_2017,
        locator: { kind: 'section', value: '"A short company history", report page 8' },
        evidenceRole: 'supports',
        note:
          'ASML Integrated Report 2017, Exhibit 99.1 to Form 6-K (accession ' +
          '0000937966-18-000008, filed 7 February 2018). Recorded as ASML ' +
          'states it: no inference is drawn that the incorporation was ' +
          'undertaken to prepare for the IPO, and no Philips role is ' +
          'inferred. An identical statement appears in ASML’s FY2013 Form ' +
          '20-F (accession 0001193125-14-046822, Item 4.A); per the ' +
          'dependence ruling that filing is a corroborating locator within ' +
          'the same subject-authored line, not an independent source, and no ' +
          'duplicate claim is created.',
      },
    ],
    lensFacets: [],
  },

  /* 17 — public-company transition (attributed) */
  {
    id: 'nl-f-public-company-listings-1995',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      'ASML states that it became a public company in 1995, with listings on ' +
      'Nasdaq and the Amsterdam stock exchange.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'nl-cit-listings-asmlir2017',
        sourceId: ASML_IR_2017,
        locator: { kind: 'section', value: '"A short company history", report page 8' },
        evidenceRole: 'supports',
        note:
          'ASML Integrated Report 2017, Exhibit 99.1 to Form 6-K (accession ' +
          '0000937966-18-000008, filed 7 February 2018). The 2017 report ' +
          'retrospectively uses the label "Euronext Amsterdam"; because ' +
          'Euronext was formed later, the production statement records the ' +
          'historically neutral "the Amsterdam stock exchange". No inference ' +
          'is drawn as to the exact IPO date, whether the two listings began ' +
          'on the same day, offering terms, proceeds, valuation, Philips ' +
          'ownership, or legal independence from Philips.',
      },
    ],
    lensFacets: [],
  },

];
