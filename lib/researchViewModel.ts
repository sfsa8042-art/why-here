/**
 * lib/researchViewModel.ts — UI-level derived selector (first UI increment).
 *
 * A pure read model over the PRODUCTION corpus. It calls the existing
 * content loader (`loadCorpus(productionRegistry)`) and reshapes the loaded
 * entities for display. It introduces NO production content: every displayed
 * item resolves to a real production Claim/Source by id, and the seventeen
 * Claims are never hardcoded here — they are read from the corpus.
 *
 * UI-level analytical structures the brief explicitly permits in a
 * research-view-model module (never in the Claim schema): the chronological
 * ordering of the spine and the evidence-boundary phases with their
 * coverage labels. These are presentation concerns, each traceable to a real
 * Claim id; they assert nothing new about the world and are not production
 * Claims, nodes, edges or alternatives.
 */

import { loadCorpus } from './loadContent.ts';
import { productionRegistry } from '../content/index.ts';
import type {
  Case,
  Citation,
  Claim,
  Source,
} from './schemas.ts';

/* ------------------------------------------------------------------ *
 * Case-scoping (generic, corpus-agnostic)
 * ------------------------------------------------------------------ */

/**
 * The distinct source ids cited by a set of claims. This is the case-scoping
 * key for the Evidence workspace: the production corpus is SHARED across cases
 * (Netherlands, Taiwan, …), so a workspace must show only the sources ITS OWN
 * claims cite — never the global source list. Generic and pure: it depends only
 * on the claims passed in, so adding a new case (or new global sources) cannot
 * change another case's scoped source set.
 */
export function citedSourceIdsForClaims(
  claims: ReadonlyArray<{ citations: ReadonlyArray<{ sourceId: string }> }>,
): Set<string> {
  const ids = new Set<string>();
  for (const claim of claims) {
    for (const citation of claim.citations) ids.add(citation.sourceId);
  }
  return ids;
}

/* ------------------------------------------------------------------ *
 * View types
 * ------------------------------------------------------------------ */

export interface CitationView {
  sourceId: string;
  sourceTitle: string;
  sourceType: Source['sourceType'];
  temporalRelation: Source['temporalRelation'];
  subjectRelationship: Source['subjectRelationship'];
  locatorKind: string;
  locatorValue: string;
  evidenceRole: Citation['evidenceRole'];
  note?: string;
  provenanceNote?: string;
}

export interface SpineClaimView {
  id: string;
  claimType: Claim['claimType'];
  epistemicStatus: Claim['epistemicStatus'];
  statement: string;
  /** True when the statement itself is an attributed corporate claim. */
  attributed: boolean;
  /** Display period label (UI-level, derived from claim content). */
  period: string;
  /** Chronological sort key (UI-level ordering only). */
  sortKey: number;
  citationCount: number;
  sourceNames: string[];
  citations: CitationView[];
}

export type PhaseCoverage =
  | 'strong'
  | 'substantial'
  | 'partial'
  | 'insufficient'
  | 'attributed only';

export interface PhaseView {
  key: string;
  label: string;
  years: string;
  coverage: PhaseCoverage;
  claimIds: string[];
  claimCount: number;
}

export interface SourceView {
  id: string;
  title: string;
  byline: string;
  date?: string;
  sourceType: Source['sourceType'];
  temporalRelation: Source['temporalRelation'];
  subjectRelationship: Source['subjectRelationship'];
  citedByCount: number;
  dependsOn: string[];
  note: string;
}

export interface ResearchQuestionView {
  id: string;
  question: string;
}

export interface CaseResearchView {
  caseId: string;
  country: string;
  industry: string;
  status: Case['status'];
  statusLabel: string;
  boundaryStatement: string;
  researchQuestions: ResearchQuestionView[];
  sourceCount: number;
  claimCount: number;
  /** Count of mapped organisation addresses (ClaimPlaceLinks) — for the public summary. */
  mappedAddressCount: number;
  /** Always false for a research case; surfaced so the UI can assert it. */
  hasThesis: boolean;
  spine: SpineClaimView[];
  phases: PhaseView[];
  sources: SourceView[];
}

/* ------------------------------------------------------------------ *
 * UI-level chronology and phase mapping (analytical, id-traceable)
 * ------------------------------------------------------------------ */

/**
 * Ordering + period label per production Claim id. This orders EXISTING
 * claims for display; it invents no dates — the periods restate what each
 * claim's verified content already establishes. Any id absent here still
 * renders (it sorts last with its raw period), so the model never silently
 * drops a claim.
 */
const CHRONOLOGY: Record<string, { sortKey: number; period: string }> = {
  'nl-f-hydraulic-stage-problems-1983': { sortKey: 1983.1, period: 'Oct 1983' },
  'nl-f-pas2000-commercialization-problems-1983': { sortKey: 1983.2, period: 'Oct 1983' },
  'nl-f-mip-non-participation': { sortKey: 1983.9, period: 'late 1983 – 1984' },
  'nl-f-jv-established-1984': { sortKey: 1984.1, period: 'by Apr 1984' },
  'nl-f-contribution-agreement-1984': { sortKey: 1984.2, period: '17 May 1984' },
  'nl-f-employees-transferred': { sortKey: 1984.3, period: '1984' },
  'nl-i-transfer-reluctance': { sortKey: 1984.4, period: '1984' },
  'nl-f-philips-advance-1987': { sortKey: 1987.0, period: 'summer 1987' },
  'nl-f-asm-withdrawal-1988': { sortKey: 1988.1, period: '31 Jul 1988' },
  'nl-f-philips-stake-acquisition-1988': { sortKey: 1988.2, period: '1988' },
  'nl-f-deepuv-coordination': { sortKey: 1988.5, period: '1988–1991' },
  'nl-f-deepuv-participants': { sortKey: 1988.6, period: '1988–1991' },
  'nl-f-deepuv-objective': { sortKey: 1988.7, period: '1988–1991' },
  'nl-f-deepuv-reported-results': { sortKey: 1988.8, period: '1988–1991' },
  'nl-f-pas5500-launched-1991': { sortKey: 1991.0, period: '1991 (attributed)' },
  'nl-f-holding-company-incorporated-1994': { sortKey: 1994.0, period: '3 Oct 1994' },
  'nl-f-public-company-listings-1995': { sortKey: 1995.0, period: '1995 (attributed)' },
};

interface PhaseDef {
  key: string;
  label: string;
  years: string;
  coverage: PhaseCoverage;
  claimIds: string[];
}

const PHASES: PhaseDef[] = [
  {
    key: 'founding',
    label: 'Founding',
    years: '1982–1984',
    coverage: 'strong',
    claimIds: [
      'nl-f-jv-established-1984',
      'nl-f-contribution-agreement-1984',
      'nl-f-employees-transferred',
      'nl-i-transfer-reluctance',
      'nl-f-mip-non-participation',
    ],
  },
  {
    key: 'early-crisis',
    label: 'Early crisis',
    years: '1984–1988',
    coverage: 'substantial',
    claimIds: [
      'nl-f-hydraulic-stage-problems-1983',
      'nl-f-pas2000-commercialization-problems-1983',
      'nl-f-philips-advance-1987',
      'nl-f-asm-withdrawal-1988',
      'nl-f-philips-stake-acquisition-1988',
    ],
  },
  {
    key: 'technological-development',
    label: 'Technological development',
    years: '1988–1991',
    coverage: 'partial',
    claimIds: [
      'nl-f-deepuv-coordination',
      'nl-f-deepuv-participants',
      'nl-f-deepuv-objective',
      'nl-f-deepuv-reported-results',
    ],
  },
  {
    key: 'commercial-viability',
    label: 'Commercial viability',
    years: '1991–1995',
    coverage: 'insufficient',
    claimIds: ['nl-f-pas5500-launched-1991'],
  },
  {
    key: 'public-company-transition',
    label: 'Public-company transition',
    years: '1994–1995',
    coverage: 'attributed only',
    claimIds: [
      'nl-f-holding-company-incorporated-1994',
      'nl-f-public-company-listings-1995',
    ],
  },
];

const BOUNDARY_STATEMENT =
  'This case documents the founding period more strongly than the later ' +
  'transition to commercial viability.';

/** Short, honest per-source limitation/provenance line for the UI. */
const SOURCE_NOTES: Record<string, string> = {
  'nl-src-asml-founding-2024':
    'ASML corporate account, written by van Duijn; source-level derived from ' +
    'his dissertation — not an independent evidence line.',
  'nl-src-asm-our-story':
    'ASM International corporate history page; subject-authored, retrospective.',
  'nl-src-cordis-deepuv-2048':
    'Official EU (CORDIS) project record; independent, but retrospective ' +
    'archival compilation. Publishes no funding amount.',
  'nl-src-vanduijn-2019':
    'Doctoral thesis; independent academic authorship, but research funded by ' +
    'Del Prado / Stichting ADP with ASM International co-funding publication.',
  'nl-src-asml-integrated-report-2017':
    'ASML’s own retrospective account (SEC-filed). One subject-authored line ' +
    'with ASML’s other reports — repetition is not independent corroboration.',
};

/* ------------------------------------------------------------------ *
 * Builder
 * ------------------------------------------------------------------ */

const ATTRIBUTION_PREFIX = /^ASML states that\b/;

function sourceByline(source: Source): string {
  if (source.authors && source.authors.length > 0) return source.authors.join(', ');
  if (source.institution !== undefined) return source.institution;
  return source.id;
}

export function buildNetherlandsResearchView(
  caseId = 'netherlands-semiconductor-equipment',
): CaseResearchView {
  const result = loadCorpus(productionRegistry);
  if (!result.ok) {
    throw new Error(
      `research view: production corpus failed to load — ${JSON.stringify(result.failures)}`,
    );
  }
  const module = result.corpus.modules.find((m) => m.caseId === caseId);
  if (module === undefined) {
    throw new Error(`research view: case "${caseId}" not found in production corpus`);
  }

  const sourceById = new Map(result.corpus.sources.map((s) => [s.id, s]));
  const citedBy = new Map<string, number>();

  const toCitationView = (citation: Citation): CitationView => {
    const source = sourceById.get(citation.sourceId);
    citedBy.set(citation.sourceId, (citedBy.get(citation.sourceId) ?? 0) + 1);
    const base: CitationView = {
      sourceId: citation.sourceId,
      sourceTitle: source?.title ?? citation.sourceId,
      sourceType: source?.sourceType ?? 'other',
      temporalRelation: source?.temporalRelation ?? 'retrospective',
      subjectRelationship: source?.subjectRelationship ?? 'independent',
      locatorKind: citation.locator.kind,
      locatorValue: citation.locator.value,
      evidenceRole: citation.evidenceRole,
    };
    if (citation.note !== undefined) base.note = citation.note;
    if (citation.provenanceNote !== undefined) base.provenanceNote = citation.provenanceNote;
    return base;
  };

  const spine: SpineClaimView[] = module.claims
    .map((claim): SpineClaimView => {
      const chron = CHRONOLOGY[claim.id];
      const citations = claim.citations.map(toCitationView);
      const sourceNames = [...new Set(citations.map((c) => c.sourceTitle))];
      return {
        id: claim.id,
        claimType: claim.claimType,
        epistemicStatus: claim.epistemicStatus,
        statement: claim.statement,
        attributed: ATTRIBUTION_PREFIX.test(claim.statement),
        period: chron?.period ?? '—',
        sortKey: chron?.sortKey ?? Number.MAX_SAFE_INTEGER,
        citationCount: claim.citations.length,
        sourceNames,
        citations,
      };
    })
    .sort((a, b) => a.sortKey - b.sortKey);

  const claimById = new Map(module.claims.map((c) => [c.id, c]));
  const phases: PhaseView[] = PHASES.map((p) => {
    const presentIds = p.claimIds.filter((id) => claimById.has(id));
    return {
      key: p.key,
      label: p.label,
      years: p.years,
      coverage: p.coverage,
      claimIds: presentIds,
      claimCount: presentIds.length,
    };
  });

  // Case-scoped: only the sources this case's claims actually cite. The corpus
  // is shared across cases (Netherlands, Taiwan, …), so a global source list
  // would leak other cases' sources into this workspace. Derived generically
  // from this case's claims (not from a global list), so another case's sources
  // can never appear here.
  const citedIds = citedSourceIdsForClaims(module.claims);
  const sources: SourceView[] = result.corpus.sources
    .filter((s) => citedIds.has(s.id))
    .map((s): SourceView => {
      const view: SourceView = {
        id: s.id,
        title: s.title,
        byline: sourceByline(s),
        sourceType: s.sourceType,
        temporalRelation: s.temporalRelation,
        subjectRelationship: s.subjectRelationship,
        citedByCount: citedBy.get(s.id) ?? 0,
        dependsOn: s.derivedFromSourceIds ?? [],
        note: SOURCE_NOTES[s.id] ?? '',
      };
      if (s.date !== undefined) view.date = s.date;
      return view;
    });

  const caseEntity = module.case;
  return {
    caseId: caseEntity.id,
    country: caseEntity.country,
    industry: caseEntity.industry,
    status: caseEntity.status,
    statusLabel: 'Research in progress',
    boundaryStatement: BOUNDARY_STATEMENT,
    researchQuestions: module.researchQuestions.map((q) => ({
      id: q.id,
      question: q.question,
    })),
    sourceCount: citedIds.size,
    claimCount: module.claims.length,
    mappedAddressCount: (module.claimPlaceLinks ?? []).length,
    hasThesis: 'thesisClaimId' in caseEntity,
    spine,
    phases,
    sources,
  };
}
