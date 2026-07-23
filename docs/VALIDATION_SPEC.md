# Validation Specification

Two layers:

- **Schema (Zod)** — single-entity rules, enforced at parse time.
- **Validator** — cross-entity rules requiring the whole corpus.

Both run in `validate-content`, which executes before `next build` and exits
non-zero on any failure, blocking the build. The validator reports the
offending entity `id` and the violated rule.

## Schema-level rules

Enforced by `lib/schemas.ts` as specified in CONTENT_MODEL.md. Notably:

- every claim has at least one citation, and at most `MAX_CITATIONS_PER_CLAIM`
- every citation has a locator
- epistemic caps are unrepresentable violations: interpretive, causal and
  counterfactual claims cannot parse with `established`
- `limitationClaimIds` min 1 on causal and counterfactual claims
- `speculativeMarker: true` and non-empty `analyticalMethod` on counterfactual
- `endYear >= year`; no authored timeline `label` (`.strict()`)
- `fromNodeId !== toNodeId`
- source has at least one retrievable identifier; no provenance
  self-reference; no duplicate `derivedFromSourceIds`
- node label length, terminal punctuation, relational-verb denylist
- `PreviewCase` rejects `thesisClaimId` (`.strict()`)

## Validator rules

**V1 — Reference integrity.** Every `sourceId`, `claimId`, `thesisClaimId`,
`supportingClaimIds`, `opposingClaimIds`, `limitationClaimIds`,
`rationaleClaimIds`, `descriptionClaimIds`, `researchQuestionIds`,
`fromNodeId`, `toNodeId`, `originalSourceId` and `derivedFromSourceIds` member
resolves to an existing entity.

**V2 — Global id uniqueness.** No duplicate `id` across the entire id-space.

**V3 — Case containment.** Every referenced entity shares the referrer's
`caseId`. No cross-case references.

**V4 — Module agreement.** Every claim in a case's content module carries that
module's `caseId`.

**V5 — Locator precision.** Any citation of a `long_form` source carries a
non-placeholder locator.

**V6 — Provenance graph.** Directed edges from each Source to its
`originalSourceId` and each `derivedFromSourceIds` member. Must resolve, must
contain no direct or transitive cycles, no self-references, no duplicates.

**V7 — Duplicate sources.** No two Sources with differing `id` share a
normalized DOI, ISBN, archive reference or canonical URL
(normalization rules in CONTENT_MODEL.md).

**V8 — Dependence relation.** Sources A and B are *dependent* if any holds:
A is reachable from B or B from A in the transitive closure of the provenance
graph; they share a common ancestor in that graph; or they share an
`institution` and have a non-empty intersection of `authors`. Otherwise
independent. Conservative by construction.

**V9 — Status floors.** Each claim must meet the evidence floor for its type
and status, as specified in METHODOLOGY.md. Applied to `supports` citations
only.

**V10 — Context-only bar.** A claim whose citations are all `context` must be
`insufficient` (or `contested`, if V11 is satisfied). No `established` or
`well_supported` claim may rest on context-only evidence.

**V11 — Contested rule.** At least one `supports` citation, at least one
`contradicts` citation, and the supporting and contradicting sources mutually
independent per V8. Otherwise the claim must be `insufficient`.

**V12 — Limitation claim integrity.** Each limitation claim exists, shares the
case, is not a self-reference, has `claimType` in
`{factual, interpretive, causal}`, and carries at least one located citation.

**V13 — Limitation graph acyclicity.** The graph formed by
`limitationClaimIds` must be acyclic. Direct and transitive cycles rejected.

**V14 — Relational claim type.** A `MechanismEdge.claimId` resolves to a
`causal` or `interpretive` claim.

**V15 — Flagship thesis type.** `FlagshipCase.thesisClaimId` resolves to an
`interpretive` or `causal` claim in the same case.

**V16 — Alternative thesis type.** `AlternativeExplanation.thesisClaimId`
resolves to an `interpretive` or `causal` claim in the same case.

**V17 — Alternative completeness.** At least one supporting and one opposing
claim, both resolving and in-case.

**V18 — Preview honesty.** A `preview` case carries no claim above
`insufficient`, and no more than the configured claim ceiling.

**V19 — Research question integrity.** `rationaleClaimIds` resolve and do not
cross case boundaries.

**V20 — Node description integrity.** `descriptionClaimIds` resolve and do not
cross case boundaries.

## Deterministic bounded independent-source selection

**The maximum-independent-set approach is rejected.** The evidence rules
require at most two independent supporting sources, so a general NP-hard
search is unjustified. `MAX_CITATIONS_PER_CLAIM` remains a content sanity
limit only, not a justification for exponential search.

```
selectIndependentSources(sources, k, predicate) -> Source[] | null
```

Deterministic; sources sorted by `id` ascending before any search, so results
are reproducible and unit-testable by exact membership.

**k = 1 — singleton search.** Return the first source in sorted order
satisfying `predicate`, as a single-element array. Null if none.

**k = 2 — lexicographically ordered pair search.** Enumerate pairs (i, j)
with i < j over the sorted, predicate-satisfying list. Return the first pair
that is independent under V8. Null if no independent pair exists.

**Causal claims.** Continue the ordered pair enumeration until an independent
pair is found in which **at least one member is `academic`**. The academic
requirement applies to the pair, not merely to individual candidates, so the
search must not stop at the first independent pair if that pair lacks an
academic member.

Complexity is O(n²) with n bounded by `MAX_CITATIONS_PER_CLAIM`.

## Build-failure conditions

The build exits non-zero if any occurs.

**Schema**
1. Any content object fails its Zod schema
2. A claim has zero citations, or exceeds `MAX_CITATIONS_PER_CLAIM`
3. A causal or counterfactual claim has empty `limitationClaimIds`
4. A counterfactual claim lacks `speculativeMarker: true` or `analyticalMethod`
5. `endYear` precedes `year`
6. An authored `label` is present on a `TimelineProjection`
7. A mechanism edge connects a node to itself
8. A source has no retrievable identifier
9. A source self-references in provenance, or duplicates `derivedFromSourceIds`
10. A node label violates length, punctuation or the relational-verb denylist
11. A preview case carries a `thesisClaimId`, or has zero research questions
12. An interpretive, causal or counterfactual claim is marked `established`

**Reference and structure**
13. Duplicate `id` in the global id-space
14. Any reference resolves to a non-existent entity
15. An entity references an entity belonging to another case
16. A claim's `caseId` does not match its content module
17. A flagship case thesis does not resolve to an interpretive or causal claim
18. An alternative-explanation thesis does not resolve to an interpretive or
    causal claim
19. An alternative explanation lacks supporting or opposing claims
20. A mechanism edge's claim is not causal or interpretive
21. A research question's rationale claims fail to resolve or cross cases
22. A node's description claims fail to resolve or cross cases

**Evidence**
23. A long-form source is cited without a precise locator
24. An `established` or `well_supported` claim has only `context` citations
25. A claim holds a status whose evidence floor is unmet
26. A `contested` claim lacks independent supporting and contradicting evidence

**Provenance**
27. An unresolved `originalSourceId` or `derivedFromSourceIds` member
28. A direct or transitive provenance cycle
29. Two sources with differing `id` share a normalized DOI, ISBN, archive
    reference or canonical URL

**Limitations**
30. A limitation claim fails any integrity rule (missing, cross-case,
    self-reference, wrong claim type, uncited)
31. A cycle exists in the limitation-reference graph

**Preview**
32. A preview case contains flagship-level content

## Test architecture

- **Command:** `validate-content`, run by `prebuild` before `next build`.
- **Vitest**, one test per failure condition. Each asserts both that a
  deliberately invalid fixture is rejected with the expected rule, **and**
  that a near-miss valid variant is accepted — guarding against over-broad
  rules.
- **Invalid fixtures** in `content/__fixtures__/invalid/`, each violating
  exactly one rule.
- **Valid integration fixture** exercising the whole pipeline.

### Required tests

**Zod / schema**
- valid fixture parses; causal claim without `limitationClaimIds` rejected
  (both absent field and empty array); counterfactual without
  `speculativeMarker` or `analyticalMethod` rejected; authored timeline label
  rejected; `endYear < year` rejected; self-referencing edge rejected

**Case union**
- flagship requires thesis; preview rejects thesis; preview with zero
  questions rejected; valid preview accepted

**Research questions**
- a question with no `rationaleClaimIds` parses and validates cleanly
- a question carries no epistemic status field

**Status floors**
- per claim type × status: one fixture that just fails, one that just passes
- `established` on interpretive, causal and counterfactual all rejected
- `established` on factual accepted with a valid source mix

**Citation roles**
- context-only citations rejected for `established` and `well_supported`
- context-only citations accepted for `insufficient`

**Limitation claims**
- one fixture per integrity rule: missing, cross-case, self-reference, wrong
  claim type, uncited
- direct limitation cycle rejected
- transitive limitation cycle rejected

**Provenance**
- unresolved reference; self-reference; direct cycle; transitive cycle;
  duplicate `derivedFromSourceIds`

**Duplicate sources**
- differing ids sharing a normalized DOI rejected
- sharing a normalized ISBN rejected
- sharing a normalized archive reference rejected
- sharing a canonical URL differing only by scheme, `www.`, tracking
  parameters, trailing slash or fragment rejected
- genuinely distinct sources accepted

**Independence**
- transitive dependence: A → B → C proves A and C dependent
- shared institution plus overlapping authors proves dependence
- distinct institutions and authors prove independence

**Bounded selection**
- k = 1 singleton returns the lexicographically first satisfying source
- k = 2 returns exact expected membership (determinism)
- a case where a naive first-pair pick fails but a valid pair exists
- a causal case where the first independent pair lacks an academic source and
  the search must continue
- null returned when no valid selection exists

**Cross-case**
- claim referencing another case's claim rejected
- claim whose `caseId` mismatches its module rejected

**Timeline labels**
- generated label introduces no new token
- truncation occurs on a word boundary
- idempotent; empty and short input safe

**Content coverage**
- unit fixtures cover all four claim types
- a valid integration fixture containing **zero** counterfactual claims passes

Counterfactual support is a capability of the contract, not a content quota
every case must fill.
