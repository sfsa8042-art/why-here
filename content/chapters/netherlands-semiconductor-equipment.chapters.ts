/**
 * Netherlands × Semiconductor Equipment — NarrativeChapters (Public Atlas V2, Stage 3).
 *
 * A SEPARATE content layer. These three chapters retell the case in ordinary
 * language, but every sentence is traceable to production Claims already in the
 * corpus — no new facts are introduced here, and chapter ids are never attached
 * to Claims. Media referenced below is PRESENT-DAY or a TIMELESS illustration;
 * none is direct historical evidence, and each chapter's `limitations` says so.
 *
 * Epistemic discipline (see VISUAL_STORY_RESEARCH_PACK_2.md):
 *   - Chapter 2 is `partially_supported`: the sequence of events is evidenced,
 *     but the causal mechanism is NOT. Its limitation is stated verbatim.
 *   - Chapter 3 does NOT claim DEEP-UV caused the PAS 5500, ensured survival, or
 *     that any participant physically worked at its recorded postal address.
 *   - The research-gaps list is an honest frontier, not a set of fake chapters.
 */

import type { ChapterPack } from '../../lib/chapters.ts';

const CASE = 'netherlands-semiconductor-equipment';

export const netherlandsChapters: ChapterPack = {
  chapters: [
    /* ---- Chapter 1 — founding (supported) ---------------------------- */
    {
      id: 'nl-ch-fragile-joint-venture',
      caseId: CASE,
      order: 1,
      title: 'A fragile joint venture',
      periodLabel: '1984',
      whatHappened:
        'By April 1984, Philips and ASM International had set up a new company, ' +
        'ASM Lithography, as a joint venture. Under a contribution agreement dated ' +
        '17 May 1984, each parent pledged roughly seven million Dutch guilders — ' +
        'part of the Philips share in kind — and forty-seven Philips employees ' +
        'moved across to the new firm at its start. Most of them, the records ' +
        'suggest, joined against their wishes. A year earlier, a state-backed ' +
        'venture-capital company had been considered as a third backer, but that ' +
        'participation never came about.',
      whyItMatters:
        'The company that would later become ASML did not begin as a confident ' +
        'national champion. It began as a small, reluctantly staffed venture ' +
        'between two parents, financed modestly and without the extra public ' +
        'backer that had been floated. Everything that follows starts from that ' +
        'fragile position.',
      whatThisExplains:
        'How resources, staff and commitments from Philips and ASM were assembled into ' +
        'a new venture.',
      whatThisDoesNotExplain:
        'Why the Netherlands later developed a durable advantage in semiconductor ' +
        'lithography.',
      claimIds: [
        'nl-f-jv-established-1984',
        'nl-f-contribution-agreement-1984',
        'nl-f-employees-transferred',
        'nl-i-transfer-reluctance',
        'nl-f-mip-non-participation',
      ],
      placeIds: [],
      mediaIds: ['nl-media-eindhoven-city-2007'],
      supportStatus: 'supported',
      limitations:
        'The accompanying image is a present-day view of Eindhoven and sets ' +
        'regional context only; it does not depict the 1984 joint venture or its ' +
        'premises.',
      readingTimeMinutes: 2,
      editorial: {
        proseTraceableToClaims: true,
        causalWithinEpistemicCeiling: true,
        mediaImpliesNoUnsupportedEvent: true,
        ceilingReviewNote:
          'Prose restates the five founding Claims (establishment, contribution ' +
          'agreement, transfers, reluctance, MIP non-participation) as discrete ' +
          'facts. It makes no causal or counterfactual claim, so it stays at the ' +
          'well_supported ceiling of the linked Claims.',
      },
    },

    /* ---- Chapter 2 — crisis (partially_supported) -------------------- */
    {
      id: 'nl-ch-crisis-without-mechanism',
      caseId: CASE,
      order: 2,
      title: 'Crisis without a proven mechanism',
      periodLabel: '1983–1988',
      whatHappened:
        'Even before the venture was formally under way, technical reports in ' +
        'October 1983 flagged serious problems: noise, vibration and oil ' +
        'contamination in the hydraulic stage of the PAS 2000 machine, and a ' +
        'longer list of commercialization gaps around lens quality, subassembly ' +
        'supply, circuit boards, six-inch wafers and the reticle system. Financial ' +
        'strain followed. In the summer of 1987 Philips advanced 13.5 million ' +
        'guilders to the venture on ASM International’s behalf. On 31 July 1988 ' +
        'ASM International withdrew, and Philips bought out its 50% stake for 8.6 ' +
        'million guilders.',
      whyItMatters:
        'These years read like a company repeatedly close to failure — technically ' +
        'troubled, short of cash, and abandoned by one of its two founders. Yet it ' +
        'continued. The evidence records what happened and in what order, but it ' +
        'does not, on its own, tell us why the venture came through this period ' +
        'rather than folding.',
      whatThisExplains:
        'The documented sequence of technical difficulties, financing actions and ' +
        'ownership changes.',
      whatThisDoesNotExplain:
        'A complete causal explanation of why the venture survived.',
      claimIds: [
        'nl-f-hydraulic-stage-problems-1983',
        'nl-f-pas2000-commercialization-problems-1983',
        'nl-f-philips-advance-1987',
        'nl-f-asm-withdrawal-1988',
        'nl-f-philips-stake-acquisition-1988',
      ],
      placeIds: [],
      mediaIds: ['nl-media-step-repeat-diagram'],
      supportStatus: 'partially_supported',
      limitations:
        'The evidence establishes the sequence of technical and financial events, ' +
        'but not a complete causal explanation of why the venture survived.',
      readingTimeMinutes: 2,
      editorial: {
        proseTraceableToClaims: true,
        causalWithinEpistemicCeiling: true,
        mediaImpliesNoUnsupportedEvent: true,
        ceilingReviewNote:
          'Prose reports the technical, financial and ownership events as a ' +
          'sequence and explicitly withholds a survival mechanism ("does not … ' +
          'tell us why"). Because the causal question is left open rather than ' +
          'answered, the prose stays within the partially_supported boundary of ' +
          'the linked Claims.',
      },
    },

    /* ---- Chapter 3 — European coordination (supported) --------------- */
    {
      id: 'nl-ch-european-coordination',
      caseId: CASE,
      order: 3,
      title: 'European coordination',
      periodLabel: '1988–1991',
      whatHappened:
        'From 1 November 1988 to 31 October 1991, ASM Lithography coordinated a ' +
        'European research project on deep-ultraviolet lithography, known as ' +
        'DEEP-UV, under the ESPRIT programme. The consortium listed on the project ' +
        'record included Nederlandse Philips Bedrijven, Carl Zeiss, Siemens, the ' +
        'French Commissariat à l’Énergie Atomique, a Fraunhofer institute and ' +
        'Hoechst. Its stated aim was a wafer stepper using excimer-laser (248 nm) ' +
        'illumination able to print features below half a micrometre. The project ' +
        'record reports that a deep-UV stepper prototype was built and tested, with ' +
        'reported resolution down to 0.35 micrometres.',
      whyItMatters:
        'Around the same time, the small Dutch firm moved from being a struggling ' +
        'joint venture to coordinating a multi-country research consortium ' +
        'alongside some of Europe’s largest industrial and research organisations. ' +
        'The official record shows the coordination role and the project’s reported ' +
        'technical results — a marker of the firm’s standing at the turn of the ' +
        'decade, stated without drawing conclusions the record does not support.',
      claimIds: [
        'nl-f-deepuv-coordination',
        'nl-f-deepuv-participants',
        'nl-f-deepuv-objective',
        'nl-f-deepuv-reported-results',
      ],
      placeIds: ['nl-place-veldhoven', 'nl-place-eindhoven'],
      mediaIds: [
        'nl-media-asml-veldhoven-2008',
        'nl-media-eindhoven-city-2007',
        'nl-media-step-repeat-diagram',
      ],
      whatThisExplains:
        'That ASM Lithography operated within a cross-border European technical ' +
        'network during DEEP-UV.',
      whatThisDoesNotExplain:
        'That DEEP-UV caused the PAS 5500, ensured survival or produced commercial ' +
        'success.',
      supportStatus: 'supported',
      limitations:
        'The map anchors and photographs mark the addresses recorded for the ' +
        'project organisations and present-day cities — they do not establish ' +
        'where DEEP-UV work physically took place. The project record reports its ' +
        'own prototype results; they are not independently replicated here, and no ' +
        'link between DEEP-UV and the later PAS 5500 product is asserted.',
      readingTimeMinutes: 2,
      editorial: {
        proseTraceableToClaims: true,
        causalWithinEpistemicCeiling: true,
        mediaImpliesNoUnsupportedEvent: true,
        ceilingReviewNote:
          'Prose reports the coordination role, listed consortium, stated ' +
          'objective and record-reported prototype results as official-record ' +
          'facts. It asserts no transfer to the PAS 5500, no survival mechanism ' +
          'and no commercial outcome, and it treats reported results as ' +
          'record-reported — staying within the well_supported ceiling of the ' +
          'linked Claims.',
      },
    },
  ],

  researchGaps: [
    {
      title: 'Why Eindhoven, and not another region?',
      question:
        'The evidence places the founding firms in the Eindhoven/Veldhoven area ' +
        'but does not establish why this region, rather than another, was where ' +
        'the venture took root.',
    },
    {
      title: 'What did suppliers and local precision engineering contribute?',
      question:
        'The corpus records technical problems and their fixes, but not a ' +
        'documented account of how nearby suppliers or precision-engineering ' +
        'capability shaped the outcome.',
    },
    {
      title: 'What role did universities and public research play?',
      question:
        'No production claim connects local universities or public research ' +
        'institutions to the venture’s technical development.',
    },
    {
      title: 'Who were the early customers, and what was the demand?',
      question:
        'The evidence does not identify the venture’s early customers or ' +
        'characterise the demand its machines were meeting.',
    },
    {
      title: 'What were the competitors and the alternative locations?',
      question:
        'The corpus does not document the competing firms of the period or the ' +
        'locations where similar work could have been done instead.',
    },
    {
      title: 'Did DEEP-UV research transfer into the PAS 5500?',
      question:
        'The DEEP-UV project record and the PAS 5500 launch are both documented, ' +
        'but no source establishes a transfer of technology from one to the other.',
    },
    {
      title: 'How did the PAS 5500 actually perform commercially?',
      question:
        'ASML states it launched the PAS 5500 in 1991, but the corpus holds no ' +
        'independent evidence of its sales, customers or commercial performance.',
    },
    {
      title: 'What was the substance of the 1995 IPO?',
      question:
        'The public listing in 1995 is recorded, but offering terms, proceeds, ' +
        'valuation and the degree of independence from Philips are not evidenced.',
    },
  ],
};
