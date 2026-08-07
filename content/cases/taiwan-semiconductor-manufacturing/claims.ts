/**
 * Taiwan × Advanced Semiconductor Foundry Manufacturing — claims (Research Pack 1).
 *
 * Authored against directly-inspected sources (see ../../sources/... and
 * docs/research/taiwan-semiconductor-manufacturing/{SOURCE_REGISTER,CLAIM_REGISTER}.md).
 * Every citation carries a VERIFIED locator: a printed transcript/PDF page, a
 * numbered PDF page, a document section, or a verbatim quoted passage read this
 * session — never a hand-typed guess.
 *
 * DISCIPLINE (mirrors the Netherlands Research Pack 1):
 *   - factual, atomic statements only; NO causal claims, NO counterfactual
 *     claims, NO thesis, NO mechanism graph in this pack;
 *   - at most three interpretive claims, each backed by an expert academic
 *     source;
 *   - lensFacets left empty pending the Analytical Lenses layer.
 *
 * EPISTEMIC CEILING: no claim is `established`. `established` needs a
 * CONTEMPORANEOUS documentary source (none inspected) or two mutually
 * independent documentary/academic/reputable_press sources agreeing. The
 * richest accounts here are subject-authored (TSMC/UMC filings, ITRI's own
 * history, Chang's oral history), and the independent academic sources conflict
 * on several key dates (RCA 1975 vs 1976; UMC 1979 vs 1980; the park 1979 vs
 * 1980). Those conflicts are recorded in provenanceNotes rather than resolved,
 * so every factual claim carries the well_supported status it actually earns.
 *
 * Two geographic citations (marked "geographic evidence") locate the Hsinchu
 * park and TSMC's registered office; they back the ClaimPlaceLinks in
 * ./claimPlaceLinks.ts and assert an address / administrative location, not an
 * operating or event site.
 */

import type { Claim } from '../../../lib/schemas.ts';

import { CASE_ID } from './case.ts';

const CHANG = 'tw-src-chang-oral-2007';
const ITRI = 'tw-src-itri-history';
const SAXENIAN = 'tw-src-saxenian-2001';
const TI = 'tw-src-taiwaninsight-2024';
const TSMC20F = 'tw-src-tsmc-20f-2023';
const NRC = 'tw-src-nrc-securing-2003';
const UMC20F = 'tw-src-umc-20f-2023';
const LAI = 'tw-src-lai-innovation-policy';

const ITRI_SEMI1 =
  'ITRI 50th history, "Adopting Technical Knowledge from RCA to Develop Taiwan’s IC Capabilities" (semiconductors/1/)';
const ITRI_SEMI2 =
  'ITRI 50th history, semiconductors/2/ (UMC, VLSI project, TSMC)';

export const claims: Claim[] = [
  /* ---------------- Institutional formation ---------------- */
  {
    id: 'tw-f-itri-established-1973',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      "Taiwan's Ministry of Economic Affairs established the Industrial Technology Research Institute (ITRI) in 1973.",
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'tw-cit-itri1973-saxenian-p6',
        sourceId: SAXENIAN,
        locator: { kind: 'page', value: '6' },
        evidenceRole: 'supports',
        note: 'Saxenian: "Taiwan’s Ministry of Economic Affairs (MOEA) also established the Industrial Technology Research Institute (ITRI) in 1973 to provide joint research, technical services, and advice to Taiwan’s SME’s."',
      },
      {
        id: 'tw-cit-itri1973-nrc',
        sourceId: NRC,
        locator: { kind: 'page', value: '154 (Panel 4: The Taiwanese Approach)' },
        evidenceRole: 'supports',
        note: 'NRC panel: "In the early 1970s the government established ITRI and, under it, about 10 different laboratories, including ERSO, which focused on semiconductors."',
      },
    ],
    lensFacets: [],
    timeline: { year: 1973 },
  },
  {
    id: 'tw-f-erso-created-1974',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      'In 1974 ITRI created the Electronics Research and Service Organization (ERSO) as a subsidiary devoted to semiconductor research.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'tw-cit-erso-saxenian-p6',
        sourceId: SAXENIAN,
        locator: { kind: 'page', value: '6–7' },
        evidenceRole: 'supports',
        note: 'Saxenian: "The following year ITRI officials created the Electronics Research and Service Organization (ERSO), a subsidiary [p.7] devoted to research on semiconductor manufacturing and commercialization." Also the geographic (national-scope) evidence for tw-cpl-erso-national.',
      },
      {
        id: 'tw-cit-erso-itri',
        sourceId: ITRI,
        locator: { kind: 'section', value: ITRI_SEMI1 },
        evidenceRole: 'supports',
        note: 'ITRI names Ding-Hua Hu, "Deputy Director of ITRI’s Electronics Research and Service Organization", as the first member to join the IC development project.',
      },
    ],
    lensFacets: [],
    timeline: { year: 1974 },
  },

  /* ---------------- Technology transfer ---------------- */
  {
    id: 'tw-f-rca-contract-1976',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      'In 1976 ITRI signed an integrated-circuit technology-transfer and licensing contract with RCA.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'tw-cit-rca1976-itri',
        sourceId: ITRI,
        locator: {
          kind: 'paragraph',
          value: '"In 1976, ITRI and RCA signed an IC technology transfer and licensing contract to officially introduce semiconductor technology into Taiwan."',
        },
        evidenceRole: 'supports',
        note: `Section: ${ITRI_SEMI1}, and the dated "1976" milestone entry.`,
        provenanceNote:
          'Reconciled by event type (DATE_RECONCILIATION.md): this claim dates the CONTRACT SIGNATURE, which ITRI records as 1976. Chang’s oral history recalls the RCA licensing as "1975", and the NRC panel dates the first RCA-derived 3-inch fab / start of activity to "1975" — plausibly the negotiation/decision or the start of technology work, a different event from the signature. The sources cannot be shown to date the same event, so the disagreement is retained and the claim stays below established.',
      },
      {
        id: 'tw-cit-rca1976-nrc',
        sourceId: NRC,
        locator: { kind: 'page', value: '154 (Panel 4: The Taiwanese Approach)' },
        evidenceRole: 'supports',
        note: 'NRC panel: "With ITRI as the interface, ERSO contacted RCA, and the government paid RCA several million dollars for its 7-micron metal-gate CMOS process."',
      },
    ],
    lensFacets: [],
    timeline: { year: 1976 },
  },
  {
    id: 'tw-f-rca-cmos-process',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      'The technology RCA transferred to ITRI was a 7-micron metal-gate CMOS integrated-circuit process, and the transfer brought 3-inch-wafer manufacturing to Taiwan.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'tw-cit-cmos-nrc',
        sourceId: NRC,
        locator: { kind: 'page', value: '154 (Panel 4: The Taiwanese Approach)' },
        evidenceRole: 'supports',
        note: 'NRC panel: the government paid RCA "for its 7-micron metal-gate CMOS process"; RCA "helped ERSO build Taiwan’s first 3-inch-wafer fab".',
      },
      {
        id: 'tw-cit-cmos-itri',
        sourceId: ITRI,
        locator: {
          kind: 'paragraph',
          value: '"It successfully introduced the 3-inch wafer to Taiwan and began to develop semiconductor manufacturing technology."',
        },
        evidenceRole: 'supports',
        note: `1976 milestone entry, section ${ITRI_SEMI1}.`,
      },
    ],
    lensFacets: [],
    timeline: { year: 1976 },
  },
  {
    id: 'tw-f-rca-trainees',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      'ITRI sent a first group of 19 engineers to RCA in the United States for training in integrated-circuit design and manufacturing.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'tw-cit-trainees-itri',
        sourceId: ITRI,
        locator: {
          kind: 'paragraph',
          value: '"The first group of trainees at RCA included 19 experts."',
        },
        evidenceRole: 'supports',
        note: `Section ${ITRI_SEMI1}. The passage lists the teams by US location, including a "New Jersey State team ... to study IC design" (Chintay Shih led the "Ohio State team ... to study the manufacturing processes"). Geographic evidence for tw-cpl-rca-training-nj.`,
        provenanceNote:
          'The trainees were distributed across several RCA/US locations (New Jersey, Ohio, California, Florida per the source); tw-cpl-rca-training-nj anchors only the named New Jersey IC-design team, at region precision, not a single site.',
      },
    ],
    lensFacets: [],
    timeline: { year: 1976 },
  },
  {
    id: 'tw-f-demo-fab-1977',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      "In 1977 ERSO completed a demonstration fabrication plant that ran Taiwan's first integrated-circuit production line, reaching about a 70 percent yield within six months.",
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'tw-cit-demofab-itri',
        sourceId: ITRI,
        locator: {
          kind: 'paragraph',
          value: '"In 1977, the IC demo factory was completed and Taiwan launched its first IC production line. After six months of operations, it reached a higher-than-expected yield rate of 70%, which surpassed the 50% yield rate of the original RCA plant."',
        },
        evidenceRole: 'supports',
        note: `Section ${ITRI_SEMI1}.`,
      },
    ],
    lensFacets: [],
    timeline: { year: 1977 },
  },

  /* ---------------- Domestic capability formation ---------------- */
  {
    id: 'tw-f-umc-1980',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      "United Microelectronics Corporation (UMC), a spin-off of ITRI/ERSO, was incorporated in May 1980 and was Taiwan's first commercial integrated-circuit manufacturing company.",
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'tw-cit-umc-umc20f',
        sourceId: UMC20F,
        locator: { kind: 'section', value: 'Item 4.A History and Organization' },
        evidenceRole: 'supports',
        note: 'UMC 20-F: "United Microelectronics Corporation (UMC) was incorporated in Republic of China (R.O.C.) in May 1980 and commenced operations in April 1982."',
        provenanceNote:
          'Reconciled by event type (DATE_RECONCILIATION.md): this claim dates the INCORPORATION, which UMC’s own Form 20-F records as May 1980 (ITRI and Chang also say 1980). Saxenian (p.20) and one NRC sentence say "established/founded 1979" — plausibly the founding decision or authorization, a distinct event from incorporation; the NRC volume is itself internally inconsistent (1979 vs 1980). Disagreement retained; claim stays below established.',
      },
      {
        id: 'tw-cit-umc-itri',
        sourceId: ITRI,
        locator: {
          kind: 'paragraph',
          value: '"ITRI set up United Microelectronics Corporation (UMC) in 1980 ... UMC was Taiwan’s first IC company and one of the first businesses to settle in Hsinchu Science Park."',
        },
        evidenceRole: 'supports',
        note: `Section ${ITRI_SEMI2}.`,
      },
      {
        id: 'tw-cit-umc-ti',
        sourceId: TI,
        locator: {
          kind: 'paragraph',
          value: '"ITRI made a strategic decision in 1980 to spin off part of the Demonstrative Factory’s team and its technologies to create United Microelectronics Corporation (UMC)."',
        },
        evidenceRole: 'supports',
        note: 'Independently PUBLISHED (reputable_press) corroboration of the 1980 timeframe — dates the ITRI decision to spin off UMC to 1980. Publisher independence only: the article’s underlying evidence chain is unclear and may derive from official institutional (ITRI) histories, so it is NOT treated as an independent evidence chain (SUPPORT_AUDIT.md). UMC’s own filing dates the incorporation to May 1980.',
      },
      {
        id: 'tw-cit-umc-lai',
        sourceId: LAI,
        locator: { kind: 'page', value: '111' },
        evidenceRole: 'supports',
        note: 'Corroboration only (source classified `other`, venue unverified, G10). Lai/Chang/Shyu: "In 1980, ITRI spun off an entire IC manufacturing operation to establish a new firm, UMC." The well_supported floor is met by UMC\'s own filing + ITRI, not by this citation.',
      },
    ],
    lensFacets: [],
    timeline: { year: 1980 },
  },
  {
    id: 'tw-f-umc-first-transfer',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      'UMC was the first transfer of technology from a public research institution in Taiwan to a private company.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'tw-cit-umc-firsttransfer-itri',
        sourceId: ITRI,
        locator: {
          kind: 'paragraph',
          value: '"ITRI set up Taiwan’s first professional 4-inch wafer manufacturer UMC. This is the first technology transfer from a research institution to a private business."',
        },
        evidenceRole: 'supports',
        note: `1980 milestone entry, section ${ITRI_SEMI2}. A subject-authored characterisation; carried well_supported.`,
      },
    ],
    lensFacets: [],
    timeline: { year: 1980 },
  },
  {
    id: 'tw-f-hsinchu-park-1980',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      'The National Science Council established the Hsinchu Science-based Industrial Park in 1980.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'tw-cit-park-saxenian-p8',
        sourceId: SAXENIAN,
        locator: { kind: 'page', value: '8' },
        evidenceRole: 'supports',
        note: 'Saxenian: "The National Science Council (NSC) sponsored the Hsinchu Science Park in 1980 to attract foreign and Overseas Chinese investments..."; the Park is "in the northwest of Taiwan" (p.10). Geographic evidence for tw-cpl-park-hsinchu.',
        provenanceNote:
          'Reconciled by event type (DATE_RECONCILIATION.md): this claim dates the ESTABLISHMENT, which Saxenian and the Science Park Bureau put in 1980 (the Bureau’s "15 December 1980" is from a search snapshot; its page is JavaScript-rendered and was not verbatim-extractable this session). Taiwan Insight’s "1979" plausibly refers to groundbreaking/construction rather than the official opening. Disagreement retained. The well_supported floor rests on Saxenian (academic); Lai corroborates but is classified `other` (G10). Below established.',
      },
      {
        id: 'tw-cit-park-lai',
        sourceId: LAI,
        locator: { kind: 'page', value: '111' },
        evidenceRole: 'supports',
        note: 'Corroboration only (source classified `other`, venue unverified, G10). Lai/Chang/Shyu: "The government established the Hsinchu Science-based Industrial Park (HSIP) in 1980..." The well_supported floor is met by Saxenian (academic), not by this citation.',
      },
    ],
    lensFacets: [],
    timeline: { year: 1980 },
  },
  {
    id: 'tw-f-vlsi-project-1984',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      'In 1984 ITRI launched a very-large-scale-integration (VLSI) project to advance its own semiconductor process research.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'tw-cit-vlsi-itri',
        sourceId: ITRI,
        locator: {
          kind: 'paragraph',
          value: '"in 1984, ITRI launched the very large-scale integration (VLSI) project and started its own research and development."',
        },
        evidenceRole: 'supports',
        note: `Section ${ITRI_SEMI2}.`,
      },
    ],
    lensFacets: [],
    timeline: { year: 1984 },
  },

  /* ---------------- Foundry-model formation ---------------- */
  {
    id: 'tw-f-chang-itri-1985',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      'Morris Chang moved to Taiwan in 1985 to become President of the Industrial Technology Research Institute.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'tw-cit-chang1985-chang',
        sourceId: CHANG,
        locator: { kind: 'page', value: 'Page 9 of 18' },
        evidenceRole: 'supports',
        note: 'Chang: "Taiwan beckoned, and the offer was to be the President of the Industrial Technology Research Institute, ITRI." He states repeatedly he came "back in 1985" (Page 10 of 18).',
        provenanceNote:
          'Who invited Chang is unresolved across sources: ITRI’s history says he was "invited by Premier Yun-Suan Sun ... in 1985"; Chang names the appointing Premier as Yu Kuo-hwa and says Minister-without-portfolio K.T. Li asked him to start a semiconductor company.',
      },
      {
        id: 'tw-cit-chang1985-itri',
        sourceId: ITRI,
        locator: {
          kind: 'paragraph',
          value: '"Dr. Morris Chang was invited by Premier Yun-Suan Sun to return to Taiwan in 1985 and serve as the President of ITRI..."',
        },
        evidenceRole: 'supports',
        note: `Section ${ITRI_SEMI2}.`,
      },
    ],
    lensFacets: [],
    timeline: { year: 1985 },
  },
  {
    id: 'tw-f-philips-demo-fab-1986',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      "In 1986, in collaboration with Philips, ITRI's VLSI demonstration fabrication plant for 6-inch integrated circuits began operations.",
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'tw-cit-philipsdemo-itri',
        sourceId: ITRI,
        locator: {
          kind: 'paragraph',
          value: '"In collaboration with Philips, the VLSI demonstration factory officially began operations in 1986 to boost the production of the 6-inch IC."',
        },
        evidenceRole: 'supports',
        note: `Section ${ITRI_SEMI2}; the dated 1986 milestone records ITRI signing "a collaboration contract with the Dutch company Philips".`,
      },
    ],
    lensFacets: [],
    timeline: { year: 1986 },
  },
  {
    id: 'tw-f-tsmc-founded-1987',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      'Taiwan Semiconductor Manufacturing Company (TSMC) was founded in 1987 — incorporated on 21 February 1987 — as a joint venture of the Republic of China (Taiwan) government and private investors.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'tw-cit-tsmc1987-20f',
        sourceId: TSMC20F,
        locator: { kind: 'section', value: 'Item 4.A History and Development of the Company; Note 1 (General)' },
        evidenceRole: 'supports',
        note: 'TSMC 20-F: "We were founded in 1987 as a joint venture among the R.O.C. government and other private investors and were incorporated in the R.O.C. as a company limited by shares on February 21, 1987."',
      },
      {
        id: 'tw-cit-tsmc1987-chang',
        sourceId: CHANG,
        locator: { kind: 'page', value: 'Page 11 of 18' },
        evidenceRole: 'supports',
        note: 'Chang: "seven years later, 1987, TSMC was started." Also Page 14: money raised in ’86, operations began in ’87.',
      },
      {
        id: 'tw-cit-tsmc1987-itri',
        sourceId: ITRI,
        locator: {
          kind: 'paragraph',
          value: '"Taiwan Semiconductor Manufacturing Company (TSMC) was established the next year."',
        },
        evidenceRole: 'supports',
        note: `Section ${ITRI_SEMI2} (the year after the 1986 demo fab), and the dated 1987 milestone.`,
      },
    ],
    lensFacets: [],
    timeline: { year: 1987 },
  },
  {
    id: 'tw-f-philips-investor',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      'Philips was the principal outside investor in TSMC at its founding, contributing production technology and a large minority of the initial investment.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'tw-cit-philips-chang',
        sourceId: CHANG,
        locator: { kind: 'page', value: 'Page 11 of 18' },
        evidenceRole: 'supports',
        note: 'Chang: "Phillips played the role as the only willing investor in TSMC, or the only willing significant investor, I should say."',
      },
      {
        id: 'tw-cit-philips-nrc',
        sourceId: NRC,
        locator: { kind: 'page', value: '154 (Panel 4: The Taiwanese Approach)' },
        evidenceRole: 'supports',
        note: 'NRC panel: "the government made an offer to Philips, which put in almost 35 percent of the initial investment; this pushed the private sector’s share above 50 percent, and TSMC was born."',
        provenanceNote:
          'A precise founding cap table was not inspected. NRC gives Philips "almost 35 percent" of the initial investment; TSMC’s own 20-F names only "the R.O.C. government and other private investors" without naming Philips. Widely-circulated web figures (e.g. 27.5%) were NOT used because no authoritative source for them was inspected.',
      },
    ],
    lensFacets: [],
    timeline: { year: 1987 },
  },
  {
    id: 'tw-f-tsmc-erso-transfer',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      "At TSMC's founding, ITRI/ERSO transferred fabrication technology and personnel to the new company.",
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'tw-cit-ersoxfer-itri',
        sourceId: ITRI,
        locator: {
          kind: 'paragraph',
          value: '"ITRI transferred fabs, equipment, technology, and 98 professionals to TSMC, making it the world’s first company to operate an IC OEM model."',
        },
        evidenceRole: 'supports',
        note: `Section ${ITRI_SEMI2}.`,
        provenanceNote:
          'Headcount unresolved: ITRI says 98 professionals; the NRC panel says "about 130 eng[ineers]" came from ERSO. The claim asserts only that technology and personnel were transferred, not an exact number.',
      },
      {
        id: 'tw-cit-ersoxfer-nrc',
        sourceId: NRC,
        locator: { kind: 'page', value: '154 (Panel 4: The Taiwanese Approach)' },
        evidenceRole: 'supports',
        note: 'NRC panel: "the technology and all the people came from ERSO, including about 130 eng[ineers]."',
      },
    ],
    lensFacets: [],
    timeline: { year: 1987 },
  },
  {
    id: 'tw-f-tsmc-dedicated-foundry',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      'TSMC operated as a dedicated (pure-play) foundry: it manufactures integrated circuits designed by other companies and does not sell integrated-circuit products of its own design.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'tw-cit-foundry-20f',
        sourceId: TSMC20F,
        locator: { kind: 'section', value: 'Note 1 (General); Item 4.B Business Overview' },
        evidenceRole: 'supports',
        note: 'TSMC 20-F: "TSMC is a dedicated foundry in the semiconductor industry which engages mainly in the manufacturing, sales, packaging, testing and computer-aided design of integrated circuits..."; "We believe we are currently the world’s largest dedicated foundry".',
      },
      {
        id: 'tw-cit-foundry-itri',
        sourceId: ITRI,
        locator: {
          kind: 'paragraph',
          value: '"IC design companies can simply commission TSMC to produce their designs without setting up a costly fab themselves."',
        },
        evidenceRole: 'supports',
        note: `Section ${ITRI_SEMI2} ("the world’s first company to operate an IC OEM model").`,
      },
      {
        id: 'tw-cit-foundry-chang',
        sourceId: CHANG,
        locator: { kind: 'page', value: 'Page 13 of 18' },
        evidenceRole: 'supports',
        note: 'Chang describes the pure-play foundry manufacturing wafers for others and depending on the rise of the fabless industry (Pages 12–13).',
      },
    ],
    lensFacets: [],
  },
  {
    id: 'tw-f-tsmc-hq-hsinchu',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      "TSMC's principal executive office is registered in the Hsinchu Science Park, Hsinchu, Taiwan.",
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'tw-cit-tsmc-hq-20f',
        sourceId: TSMC20F,
        locator: {
          kind: 'paragraph',
          value: '"Our principal executive office is located at No. 8, Li-Hsin Road 6, Hsinchu Science Park, Hsinchu, Taiwan, Republic of China."',
        },
        evidenceRole: 'supports',
        note: 'Item 4.D Property, Plants and Equipment / "Our Principal Office". Geographic evidence for tw-cpl-tsmc-hq-hsinchu — a registered-address record, NOT evidence of where historical activity occurred.',
      },
    ],
    lensFacets: [],
  },
  {
    id: 'tw-f-chang-foundry-rationale',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      'In his 2007 oral history, Morris Chang described choosing the pure-play foundry model because he judged wafer manufacturing to be the only potential strength Taiwan had, while it lacked strength in research, circuit design, marketing and intellectual property.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'tw-cit-rationale-chang',
        sourceId: CHANG,
        locator: { kind: 'page', value: 'Page 12 of 18' },
        evidenceRole: 'supports',
        note: 'Chang: "The only possible strength that Taiwan had ... was semiconductor manufacturing, wafer manufacturing ... So maybe you could call it the least evil choice." A claim about the content of his account, not an endorsement of the reasoning.',
      },
    ],
    lensFacets: [],
  },
  {
    id: 'tw-f-tsmc-first-loss-1987',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      'TSMC recorded a loss in 1987, its first year of operation.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'tw-cit-firstloss-chang',
        sourceId: CHANG,
        locator: { kind: 'page', value: 'Page 14 of 18' },
        evidenceRole: 'supports',
        note: 'Chang: "We had a loss year in 1987, the first year that we started."',
      },
    ],
    lensFacets: [],
    timeline: { year: 1987 },
  },
  {
    id: 'tw-f-erso-scale-1987',
    caseId: CASE_ID,
    claimType: 'factual',
    statement:
      'By 1987 ERSO employed a staff of over 1,700 and had a budget of about US$100 million.',
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'tw-cit-ersoscale-saxenian-p7',
        sourceId: SAXENIAN,
        locator: { kind: 'page', value: '7' },
        evidenceRole: 'supports',
        note: 'Saxenian: "By 1987 ERSO had a staff of over 1,700 and a budget of about US $100 million (Wade, 1990.)"',
        provenanceNote:
          'Saxenian attributes the figures to Wade (1990), which was NOT directly inspected; support is to Saxenian, and Wade does not count as an independent source.',
      },
    ],
    lensFacets: [],
    timeline: { year: 1987 },
  },

  /* ---------------- Interpretive (<= 3; expert academic floor) ---------------- */
  {
    id: 'tw-i-broad-industrial-policy',
    caseId: CASE_ID,
    claimType: 'interpretive',
    statement:
      "Taiwan's technology industrial policy of the 1970s–1980s is characterised as broadly available across a sector and oriented toward encouraging new entrants and small and medium-sized firms, rather than concentrating support on a single national champion.",
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'tw-cit-broadpolicy-saxenian-p7',
        sourceId: SAXENIAN,
        locator: { kind: 'page', value: '7' },
        evidenceRole: 'supports',
        note: 'Saxenian: incentives "were universally available to all producers in a sector"; policy "systematically encouraged new market entry and the growth of small and medium-sized enterprises" versus channeling resources to "national champions".',
      },
    ],
    lensFacets: [],
  },
  {
    id: 'tw-i-returnee-reversal',
    caseId: CASE_ID,
    claimType: 'interpretive',
    statement:
      "The return from the early 1990s of engineers who had trained and worked in the United States (a 'reversal of the brain drain') is identified as a significant factor in the upgrading of Taiwan's integrated-circuit industry.",
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'tw-cit-returnee-saxenian-p9',
        sourceId: SAXENIAN,
        locator: { kind: 'page', value: '9–10' },
        evidenceRole: 'supports',
        note: 'Saxenian: "the most significant change was the ‘reversal’ of the brain drain in the early 1990s ..." who "were decisive in shifting Taiwan to the technological frontier in the manufacturing of ICs". Concerns the 1990s upgrading, beyond the founding window.',
      },
    ],
    lensFacets: [],
  },
  {
    id: 'tw-i-state-acquire-transfer-role',
    caseId: CASE_ID,
    claimType: 'interpretive',
    statement:
      "The Taiwanese state's foremost early role in the semiconductor industry is characterised as acquiring technology from abroad and performing pioneer research through public institutions before transferring it to private firms.",
    epistemicStatus: 'well_supported',
    citations: [
      {
        id: 'tw-cit-staterole-nrc',
        sourceId: NRC,
        locator: { kind: 'page', value: '154 (Panel 4: The Taiwanese Approach)' },
        evidenceRole: 'supports',
        note: 'Expert-academic support (National Research Council). The panel describes ITRI/ERSO acquiring the RCA process, building the first fab, then spinning technology out to UMC and TSMC — the acquire-and-transfer role. This is the qualifying source for the interpretive floor.',
      },
      {
        id: 'tw-cit-staterole-lai',
        sourceId: LAI,
        locator: { kind: 'page', value: '111' },
        evidenceRole: 'supports',
        note: 'Corroboration only. Lai/Chang/Shyu: "The foremost role played by the Taiwan government ... was to acquire technology from abroad and perform in-house pioneer research..." The source is classified `other` (venue unverified, G10), so it is NOT the qualifying expert source for this interpretive claim.',
      },
    ],
    lensFacets: [],
  },
];
