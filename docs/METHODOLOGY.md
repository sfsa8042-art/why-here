# Methodology

## Instrument, not oracle

An oracle asserts "Taiwan leads semiconductors *because* X." That claim is
contestable, and if machine-generated it is indefensible.

This project is an instrument. It lets a user assemble evidence and inspect a
mechanism, with every claim's evidential standing visible and every source
reachable. The user should leave understanding *how economic geographers
reason*, not merely holding a conclusion.

The product must never imply more causal certainty than the research supports.

## Analytical framework

A hybrid, with neither component treated as complete.

### Porter's Diamond — an organizing lens, not proof

The Diamond organizes qualitative evidence into facets: factor conditions,
demand conditions, related and supporting industries, firm strategy and
rivalry, plus government and chance.

It is a **lens, not a cause**. The interface must say so where lenses are
shown. Claims that fit no facet are displayed in an explicit
"outside the Diamond" tray — the framework's limits are shown, not hidden.

**Stated limitations:** descriptive rather than predictive; largely post-hoc;
weak on timing and sequencing.

### Economic Complexity — a quantitative baseline

Trade structure, revealed comparative advantage and product relatedness
provide a defensible quantitative floor, drawn from real open data
(UN Comtrade / OEC, Harvard Growth Lab, World Bank, OECD, Our World in Data).

**Stated limitations:** largely blind to culturally embedded advantage
(the France × Luxury case will expose this directly); coarse at sub-product
level; says what is exported, not why.

### Historical sequencing, institutions, path dependence, shocks

These are represented **separately** in the model rather than forced into the
Diamond. The Formation Timeline is the structural spine of every case
precisely because formation is sequential and path-dependent.

Each flagship case must surface at least one dimension where the framework
strains. That tension is a finding, not a defect.

## Claim types

What kind of statement is being made. Orthogonal to epistemic status.

| Type | Meaning |
|---|---|
| `factual` | A documented state of affairs |
| `interpretive` | A reading of evidence |
| `causal` | An assertion that something contributed to something else |
| `counterfactual` | An explicit speculative analytical exercise |

## Epistemic statuses

How strongly the claim is supported. Orthogonal to claim type.

| Status | Meaning |
|---|---|
| `established` | Documented; available to factual claims only |
| `well_supported` | Credible evidence, with interpretation |
| `contested` | Credible independent sources disagree |
| `insufficient` | Documented but under-evidenced; shown honestly |

**Caps.** Only `factual` claims may reach `established`. Interpretive, causal
and counterfactual claims are capped at `well_supported`. Counterfactual
claims always display a speculative marker.

## Evidence rules

### Source classification — three dimensions

One enum cannot carry what kind of publication a source is, when it stands
relative to the events, and who wrote it. These are separate, mandatory
dimensions:

- **Source type** — `documentary` · `academic` · `institutional_history` ·
  `reputable_press` · `reference` · `other`. `documentary` replaces the
  former `primary`: being a document does not imply being contemporaneous.
  An official company history is `institutional_history`, not documentary
  evidence.
- **Temporal relation** — `contemporaneous` · `retrospective`: whether the
  source stands inside the events it documents or looks back at them.
- **Subject relationship** — `subject_authored` · `independent` · `mixed`:
  whether the source was authored by the institution being studied.
  Subject-authored is provenance information, **not** a verdict of
  unreliability; the evidence floors apply the appropriate ceiling instead
  of discarding such sources.

Source classification constrains but does not equal epistemic status. The
axes are kept separate deliberately; conflating them is a common error.

### Citations locate evidence

A citation names a *place* inside a source — page, section, table, figure,
chapter, paragraph, timestamp or URL fragment — not a document homepage. Long-form
sources without a precise locator are rejected at build time.

### Evidence roles

`supports` · `contradicts` · `context`

Context evidence situates a claim; it does not support it. No claim above
`insufficient` may rest on context-only citations.

### Status floors by claim type

- **factual / established** — one supporting **contemporaneous documentary**
  source, or two mutually independent supporting sources from
  documentary/academic/reputable press. A retrospective institutional
  history alone never satisfies the direct documentary route, even when
  published by the institution involved: subject authorship is tolerated
  there, retrospection is not.
- **factual / well_supported** — one supporting citation from a documentary,
  academic, reputable-press or institutional-history source. (`reference`
  and `other` sources support nothing above `insufficient`.)
- **interpretive / well_supported** — one supporting expert academic source,
  or an independent pair of supporting expert sources. An *expert source* is
  an `academic` source with identifiable authors or an identifiable issuing
  institution, or a `reputable_press` source with at least one named author
  and an identifiable institution. Anonymous or provenance-poor sources do
  not qualify.
- **causal / well_supported** — an independent supporting pair including at
  least one academic source, plus at least one valid limitation claim.
- **counterfactual / well_supported** — a stated analytical method, a
  supporting academic source, the speculative marker, and at least one valid
  limitation claim.
- **contested (any type)** — supporting and contradicting citations from
  mutually independent sources.
- **insufficient (any type)** — at least one citation of any role, including
  context-only. This is the honest resting state for a documented but
  under-evidenced claim. Forbidding it would push authors toward deleting
  claims or overstating them; both are worse.

### Source independence is modeled, not proven

Provenance metadata (authors, institution, originalSourceId,
derivedFromSourceIds) allows detection of common dependence: syndication,
derivation, shared authorship within an institution. The heuristic operates
transitively over a validated provenance graph and errs toward declaring
dependence.

**It cannot detect two academic sources silently resting on the same unnamed
origin.** It is a dependence *detector*, not an independence *proof*. The
Method page must state this plainly rather than implying verification.

**Dependence can vary by citation.** A publication may rely on another
source for one passage while using independent evidence elsewhere. A
Citation may therefore carry its own `derivedFromSourceIds`: for any claim
citing that passage, the two sources are treated as dependent, while the
same pair may remain independent on a claim whose citations carry no such
derivation. Citation-level provenance must resolve and may not be
self-referential; cycles are rejected only within a single claim's
effective provenance graph. Two publications may legitimately rely on one
another in different passages addressing different claims — opposite
derivations on two separate claims are not contradictory and are not
rejected. Only the source-level graph (the source as a whole) must be
globally acyclic.

## Limits of the methodology

To be stated publicly on the Method page, not buried:

1. Independence is modeled, not proven (above).
2. Mechanism node labels are checked against a relational-verb denylist. This
   catches the common failure but cannot detect an evaluative noun phrase such
   as "decisive state intervention." Enforcement is partly editorial.
3. Porter's Diamond is post-hoc and weak on timing.
4. Economic Complexity is blind to culturally embedded advantage.
5. Claim classification is a judgement made by the author against stated
   rules, not an objective measurement.
6. The corpus is deliberately narrow. Three cases cannot support general
   conclusions about industrial formation.
