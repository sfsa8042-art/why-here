# Content Model

Final merged model. All v2.1 amendments are incorporated; nothing here
requires reconstructing earlier versions.

## Principles

- **Zod is the authoritative schema.** All TypeScript types are inferred via
  `z.infer`, so the runtime contract and compile-time types cannot drift.
  TypeScript alone is not runtime validation; content files are data.
- **Structural enforcement over validator enforcement.** Where the type system
  can make an invalid state unrepresentable, it must.
- **No free-text assertion fields.** Case theses, alternative explanations,
  mechanism relationships, limitations and node descriptions all resolve to
  Claims.
- **Content is version-controlled typed files, not a database.** Auditable,
  diff-able, no runtime data operations, validated at build.

## Constants

- `MAX_CITATIONS_PER_CLAIM = 24` — a general content sanity limit. It is
  **not** a justification for an NP-hard algorithm; see VALIDATION_SPEC.
- `MAX_NODE_LABEL_LENGTH = 60`
- `NODE_LABEL_RELATIONAL_TERMS` — denylist: caused, causing, causes, led to,
  leads to, leading to, enabled, enables, enabling, drove, drives, driving,
  contributed, contributes, contributing, resulted in, results in,
  resulting in, because.

## Enumerations

```
EpistemicStatus       established | well_supported | contested | insufficient
NonEstablishedStatus  well_supported | contested | insufficient
EvidenceRole          supports | contradicts | context
SourceType            documentary | academic | institutional_history |
                      reputable_press | reference | other
TemporalRelation      contemporaneous | retrospective
SubjectRelationship   subject_authored | independent | mixed
LengthClass           short_form | long_form
LensFacet             factor_conditions | demand_conditions | related_supporting |
                      firm_strategy_rivalry | government | chance
NodeType              actor | institution | capability | policy | event
```

## Locator

A discriminated union on `kind`, each with a non-empty `value`:

`page` · `section` · `table` · `figure` · `chapter` · `paragraph` ·
`timestamp` · `url_fragment`

A locator resolves to a place inside a source, never to a document.

## Citation

```
sourceId              string, required
locator               Locator, required
evidenceRole          EvidenceRole, required
note                  string, optional
accessedAt            ISO 8601 datetime, optional
derivedFromSourceIds  string[], optional, min 1 when present
provenanceNote        string, optional
```

**Citation-level provenance.** `derivedFromSourceIds` records that this
specific passage relies on another source even when the whole publication
is not globally derived from it. Schema refinements: a citation may not
derive from its own source, and the list may not contain duplicates.
Validator rules: every reference must resolve; the edges participate in
independence checks ONLY for the claim carrying the citation; and cycles
are rejected only inside that claim's effective provenance graph
(source-level edges plus that claim's citation edges). Citation-level
edges are never merged into the global source-level graph, so opposite
derivations recorded on two separate claims — two different passages —
are not a cycle.

## Source

```
id                    string, required
title                 string, required
sourceType            SourceType, required
temporalRelation      TemporalRelation, required
subjectRelationship   SubjectRelationship, required
lengthClass           LengthClass, required
authors               string[], optional
institution           string, optional
originalSourceId      string, optional
derivedFromSourceIds  string[], optional
date                  string, optional
url | doi | isbn | archiveRef   at least one required
```

Schema-level refinements: at least one retrievable identifier; no
self-reference via `originalSourceId`; `id` not present in own
`derivedFromSourceIds`; no duplicates within `derivedFromSourceIds`.

**Duplicate detection (validator).** Two Sources with different `id` values
are duplicates if any normalized identifier matches: DOI (lowercased,
`doi:`/URL prefixes stripped), ISBN (hyphens and whitespace removed,
ISBN-10 and ISBN-13 treated as equivalent where derivable), archive
reference (trimmed, case-normalized), or canonical URL (scheme and host
lowercased, `www.` removed, tracking query parameters and trailing slash
stripped, fragment removed). Duplicates are a build failure: they would
silently defeat the independence heuristic.

## Claim — discriminated union on `claimType`

Shared base:

```
id          string, required
caseId      string, required
statement   string, required
citations   Citation[], min 1, max MAX_CITATIONS_PER_CLAIM
lensFacets  LensFacet[], may be empty ("outside the Diamond")
timeline    TimelineProjection, optional
```

**FactualClaim** — `claimType: 'factual'`, `epistemicStatus: EpistemicStatus`
(the only type admitting `established`).

**InterpretiveClaim** — `claimType: 'interpretive'`,
`epistemicStatus: NonEstablishedStatus`.

**CausalClaim** — `claimType: 'causal'`,
`epistemicStatus: NonEstablishedStatus`,
`limitationClaimIds: string[]` (min 1, structurally required).

**CounterfactualClaim** — `claimType: 'counterfactual'`,
`epistemicStatus: NonEstablishedStatus`,
`limitationClaimIds: string[]` (min 1),
`speculativeMarker: true` (literal; must be displayed wherever the claim
appears), `analyticalMethod: string` (non-empty; the reasoning procedure).

### Limitation claims

`limitationClaimIds` replaces free-text limitations so that a limitation is
itself a sourced Claim. A limitation claim must: exist; belong to the same
case; not be a self-reference; have `claimType` in
`{factual, interpretive, causal}` (a limitation may not be counterfactual);
and carry at least one located citation.

**The limitation-reference graph must be acyclic.** Direct and transitive
cycles are rejected.

## TimelineProjection

```
year     integer, required
endYear  integer, optional; must be >= year
```

**No authored `label` field.** The schema is `.strict()`, so a legacy authored
label is a parse error. Display labels are generated deterministically from
the linked Claim statement by a pure, total truncation function that
introduces no new token and no new meaning. This removes the label-smuggling
channel entirely rather than policing it with a semantic heuristic.

## ResearchQuestion

```
id                 string, required
caseId             string, required
question           string, required — free text; asserts nothing
rationaleClaimIds  string[], optional
```

A question carries **no epistemic status** because it makes no assertion. Any
explanation of why the question matters resolves to sourced Claims.

## Case — discriminated union on `status`

**FlagshipCase** (`.strict()`)

```
id                   string
country              string
industry             string
status               'flagship'
thesisClaimId        string, required
researchQuestionIds  string[]
```

`thesisClaimId` must resolve to an `interpretive` or `causal` Claim belonging
to the same case.

**PreviewCase** (`.strict()`)

```
id                   string
country              string
industry             string
status               'preview'
researchQuestionIds  string[], min 1
```

`thesisClaimId` is **structurally absent** and rejected by `.strict()`. A
preview asserts nothing; it poses questions. A preview may carry no claim
above `insufficient`.

## MechanismNode

```
id                  string
caseId              string
label               string, 1..60 chars, neutral entity or noun phrase
nodeType            NodeType
descriptionClaimIds string[], optional
```

A label names an entity; it never asserts what that entity did. Enforced by
length, absence of terminal punctuation, and the relational-verb denylist.
Any description of a node's role resolves to a Claim.

## MechanismEdge

```
id          string
caseId      string
fromNodeId  string
toNodeId    string, must differ from fromNodeId
claimId     string
```

**No free-text `relationship` field.** An edge's asserted meaning derives
entirely from its referenced relational Claim, which must be `causal` or
`interpretive` and in the same case. The map therefore cannot draw a
relationship that was not researched, sourced and classified.

## AlternativeExplanation

```
id                  string
caseId              string
thesisClaimId       string, required
supportingClaimIds  string[], min 1
opposingClaimIds    string[], min 1
limitationClaimIds  string[]
```

`thesisClaimId` must resolve to an `interpretive` or `causal` Claim in the
same case. Requiring both supporting and opposing claims means an alternative
cannot be asserted without genuine contestation on record.

## Inferred types

Every entity above exports a `z.infer` type from `lib/schemas.ts`. No
hand-written duplicate type definitions anywhere in the codebase.

## Content file structure

```
content/
├── sources/
│   └── <case>.sources.ts
├── cases/
│   └── netherlands-semiconductor-equipment/
│       ├── case.ts
│       ├── claims.ts
│       ├── questions.ts
│       ├── nodes.ts
│       ├── edges.ts
│       └── alternatives.ts
├── fixtures/
│   ├── valid/
│   └── invalid/
└── index.ts
```

Timeline and lens groupings are **derived** from claims, never stored
separately. A claim carrying a `timeline` projection appears on the timeline;
claims grouped by `lensFacets` populate the lenses. One source of truth.
