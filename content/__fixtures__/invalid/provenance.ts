/**
 * INVALID fixtures — provenance graph rules (V6).
 *
 * NOT RESEARCH CONTENT — synthetic corpora for validator tests.
 * Each exported corpus violates exactly one rule. (Provenance
 * self-reference and duplicate derivedFromSourceIds are schema-level
 * and covered by the schema tests.)
 */

import type { Corpus } from '../../../lib/validate.ts';
import { defaultSources, makeCorpus, makeSource } from '../builders.ts';

/* V6 — originalSourceId resolving to nothing */
export const v6UnresolvedParent: Corpus = makeCorpus({
  sources: [
    ...defaultSources(),
    makeSource({ id: 'derived-x', originalSourceId: 'no-such-source' }),
  ],
});

/* V6 — direct provenance cycle: X derives from Y, Y from X */
export const v6DirectCycle: Corpus = makeCorpus({
  sources: [
    ...defaultSources(),
    makeSource({ id: 'prov-x', originalSourceId: 'prov-y' }),
    makeSource({ id: 'prov-y', originalSourceId: 'prov-x' }),
  ],
});

/* V6 — transitive provenance cycle: X -> Y -> Z -> X */
export const v6TransitiveCycle: Corpus = makeCorpus({
  sources: [
    ...defaultSources(),
    makeSource({ id: 'prov-x', derivedFromSourceIds: ['prov-y'] }),
    makeSource({ id: 'prov-y', derivedFromSourceIds: ['prov-z'] }),
    makeSource({ id: 'prov-z', derivedFromSourceIds: ['prov-x'] }),
  ],
});

/* near-miss: an acyclic derivation chain passes */
export const nearMissAcyclicProvenance: Corpus = makeCorpus({
  sources: [
    ...defaultSources(),
    makeSource({ id: 'prov-x', derivedFromSourceIds: ['prov-y'] }),
    makeSource({ id: 'prov-y', originalSourceId: 'builder-primary' }),
  ],
});
