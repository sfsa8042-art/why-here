/**
 * INVALID fixtures — source-provenance amendment.
 *
 * NOT RESEARCH CONTENT — synthetic corpora for validator tests.
 * Covers the amended factual/established floor (contemporaneous
 * documentary route; retrospective institutional histories excluded
 * from it) and citation-level provenance (claim-scoped dependence,
 * unresolved references, cycles). Each `v*` corpus violates exactly
 * one rule.
 */

import type { Source } from '../../../lib/schemas.ts';
import type { Corpus } from '../../../lib/validate.ts';
import {
  defaultClaims,
  defaultSources,
  makeCausal,
  makeCitation,
  makeCorpus,
  makeFactual,
} from '../builders.ts';

/** A retrospective, subject-authored official institutional history. */
function institutionalHistory(): Source {
  return {
    id: 'prv-inst-history',
    title: 'Synthetic Corporation: The Official History',
    sourceType: 'institutional_history',
    temporalRelation: 'retrospective',
    subjectRelationship: 'subject_authored',
    lengthClass: 'long_form',
    institution: 'Synthetic Corporation',
    isbn: '978-0-306-40615-7',
  };
}

function provenanceSources(): Source[] {
  return [...defaultSources(), institutionalHistory()];
}

/* ---------------- amended factual/established floor ---------------- */

/* test 7: a retrospective institutional history alone must NOT earn
   established — subject authorship is not the problem; retrospection
   caps the direct documentary route */
export const v9InstitutionalHistoryEstablished: Corpus = makeCorpus({
  sources: provenanceSources(),
  claims: [
    ...defaultClaims(),
    makeFactual({
      id: 'prv-claim',
      epistemicStatus: 'established',
      citations: [
        makeCitation({
          sourceId: 'prv-inst-history',
          locator: { kind: 'chapter', value: '3' },
        }),
      ],
    }),
  ],
});

/* tests 1 & 8: contemporaneous SUBJECT-AUTHORED documentary evidence
   satisfies the direct establishment route (builder-primary is
   documentary + contemporaneous + subject_authored) */
export const nearMissContemporaneousDocumentaryEstablished: Corpus = makeCorpus({
  sources: provenanceSources(),
  claims: [
    ...defaultClaims(),
    makeFactual({
      id: 'prv-claim',
      epistemicStatus: 'established',
      citations: [makeCitation({ sourceId: 'builder-primary' })],
    }),
  ],
});

/* test 2: the same institutional history legitimately carries
   factual/well_supported — provenance is a ceiling, not a ban */
export const nearMissInstitutionalHistoryWellSupported: Corpus = makeCorpus({
  sources: provenanceSources(),
  claims: [
    ...defaultClaims(),
    makeFactual({
      id: 'prv-claim',
      citations: [
        makeCitation({
          sourceId: 'prv-inst-history',
          locator: { kind: 'chapter', value: '3' },
        }),
      ],
    }),
  ],
});

/* ---------------- citation-level provenance ---------------- */

/* test 6a: a citation deriving from a source that does not resolve */
export const v6CitationDerivationUnresolved: Corpus = makeCorpus({
  claims: [
    ...defaultClaims(),
    makeFactual({
      id: 'prv-claim',
      citations: [
        makeCitation({
          sourceId: 'builder-academic-a',
          derivedFromSourceIds: ['no-such-source'],
        }),
      ],
    }),
  ],
});

/* test 6b: mutually derived passages WITHIN ONE CLAIM form a cycle in
   that claim's effective provenance graph */
export const v6CitationDerivationCycle: Corpus = makeCorpus({
  claims: [
    ...defaultClaims(),
    makeFactual({
      id: 'prv-claim',
      citations: [
        makeCitation({
          sourceId: 'builder-academic-a',
          derivedFromSourceIds: ['builder-academic-b'],
        }),
        makeCitation({
          sourceId: 'builder-academic-b',
          derivedFromSourceIds: ['builder-academic-a'],
        }),
      ],
    }),
  ],
});

/* near-miss: OPPOSITE citation-level derivations on two SEPARATE claims
   are two different passages, not a cycle — the corpus is valid. Each
   claim's own effective provenance graph is acyclic. */
export const nearMissOppositeDerivationsAcrossClaims: Corpus = makeCorpus({
  claims: [
    ...defaultClaims(),
    makeFactual({
      id: 'prv-passage-1',
      citations: [
        makeCitation({
          sourceId: 'builder-academic-a',
          derivedFromSourceIds: ['builder-academic-b'],
        }),
      ],
    }),
    makeFactual({
      id: 'prv-passage-2',
      citations: [
        makeCitation({
          sourceId: 'builder-academic-b',
          derivedFromSourceIds: ['builder-academic-a'],
        }),
      ],
    }),
  ],
});

/* tests 3, 4, 5 in one corpus:
   - "cp-derived": globally independent academics, but THIS claim's
     citation of academic-a explicitly derives from academic-b, so the
     pair is dependent FOR THIS CLAIM and the causal floor fails (V9);
   - "cp-clean": the SAME two sources on a sibling claim with no
     citation-level derivation remain independent and pass. */
export const v9CitationDerivedPair: Corpus = makeCorpus({
  claims: [
    ...defaultClaims(),
    makeCausal({
      id: 'cp-derived',
      citations: [
        makeCitation({
          sourceId: 'builder-academic-a',
          derivedFromSourceIds: ['builder-academic-b'],
          provenanceNote: 'synthetic: this passage restates academic-b',
        }),
        makeCitation({ sourceId: 'builder-academic-b' }),
      ],
    }),
    makeCausal({
      id: 'cp-clean',
      citations: [
        makeCitation({ sourceId: 'builder-academic-a' }),
        makeCitation({ sourceId: 'builder-academic-b' }),
      ],
    }),
  ],
});
