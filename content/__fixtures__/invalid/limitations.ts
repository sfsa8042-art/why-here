/**
 * INVALID fixtures — limitation-claim rules (V12, V13).
 *
 * NOT RESEARCH CONTENT — synthetic corpora for validator tests.
 * Each exported corpus violates exactly one rule.
 */

import type { Corpus } from '../../../lib/validate.ts';
import {
  defaultClaims,
  makeCausal,
  makeCorpus,
  makeCounterfactual,
} from '../builders.ts';

/* V12 — a limitation id that resolves to nothing */
export const v12MissingLimitation: Corpus = makeCorpus({
  claims: [
    ...defaultClaims().filter((c) => c.id !== 'builder-causal'),
    makeCausal({ id: 'builder-causal', limitationClaimIds: ['no-such-claim'] }),
  ],
});

/* V12 — a causal claim citing itself as its own limitation */
export const v12SelfReference: Corpus = makeCorpus({
  claims: [
    ...defaultClaims().filter((c) => c.id !== 'builder-causal'),
    makeCausal({ id: 'builder-causal', limitationClaimIds: ['builder-causal'] }),
  ],
});

/* V12 — a limitation that is itself counterfactual (forbidden type) */
export const v12CounterfactualLimitation: Corpus = makeCorpus({
  claims: [
    ...defaultClaims().filter((c) => c.id !== 'builder-causal'),
    makeCounterfactual({ id: 'builder-cf' }),
    makeCausal({ id: 'builder-causal', limitationClaimIds: ['builder-cf'] }),
  ],
});

/* near-miss: a factual limitation is an allowed type */
export const nearMissFactualLimitation: Corpus = makeCorpus({
  claims: [
    ...defaultClaims().filter((c) => c.id !== 'builder-causal'),
    makeCausal({ id: 'builder-causal', limitationClaimIds: ['builder-factual'] }),
  ],
});

/* V13 — direct limitation cycle: A limits B, B limits A */
export const v13DirectCycle: Corpus = makeCorpus({
  claims: [
    ...defaultClaims(),
    makeCausal({ id: 'cycle-a', limitationClaimIds: ['cycle-b'] }),
    makeCausal({ id: 'cycle-b', limitationClaimIds: ['cycle-a'] }),
  ],
});

/* V13 — transitive limitation cycle: A -> B -> C -> A */
export const v13TransitiveCycle: Corpus = makeCorpus({
  claims: [
    ...defaultClaims(),
    makeCausal({ id: 'cycle-a', limitationClaimIds: ['cycle-b'] }),
    makeCausal({ id: 'cycle-b', limitationClaimIds: ['cycle-c'] }),
    makeCausal({ id: 'cycle-c', limitationClaimIds: ['cycle-a'] }),
  ],
});

/* near-miss: an acyclic limitation chain A -> B -> (interpretive) passes */
export const nearMissAcyclicChain: Corpus = makeCorpus({
  claims: [
    ...defaultClaims(),
    makeCausal({ id: 'chain-a', limitationClaimIds: ['chain-b'] }),
    makeCausal({ id: 'chain-b', limitationClaimIds: ['builder-limitation'] }),
  ],
});
