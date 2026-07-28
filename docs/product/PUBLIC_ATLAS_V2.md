# Public Atlas V2 — Product Architecture Proposal

> **Status: approved direction; implementation not started.** This document redesigns
> *Why Here?* around an **atlas of many industrial advantages**, not around the single
> Netherlands/ASML case. It reuses the M1 technical foundation (commit `883ca2c`).
>
> **Epistemic guardrails (load-bearing, enforced by validation):**
> - Do not convert hypotheses into findings. Chapters and media carry explicit support/rights status.
> - **Navigation geography ≠ evidence geography.** A device used to *locate and open* a
>   case is never presented as proof that an event happened at that point/centroid.
> - No unsupported modern photograph is evidence for a historical event.
> - snake_case enums and technical IDs never appear outside Evidence mode.
> - The launch is an **honest single-case** state: one case in research, two planned — no
>   fabricated explorers, claims, or source counts.

---

## Executive summary of the problem

M1 succeeds technically but, as a *product*, it (1) is organised around one case, (2)
speaks to researchers, (3) lacks visual storytelling, and (4) reads as an ASML corporate
history rather than an explanation of *why an industry grew in a place*. V2 keeps that
rigour as a **second mode** and puts a **visual, plain-language atlas** in front of it —
while being honest that only one case has a corpus and its "why here" story is still
partly unresearched.

---

## A. Product hierarchy

| Layer | Route | Job | Audience |
|---|---|---|---|
| **1. Atlas index** | `/atlas` | Discover cases on a world map; filter and open one | Everyone (homepage) |
| **2. Visual case explorer** | `/atlas/:caseSlug` | Understand one case as a visual story (Explore default) | Ordinary visitors |
| **3. Evidence workspace** | `/evidence/:caseSlug` | Inspect the sourced claims behind the story | Researchers / reviewers |

### Route model

```
/                                    → redirect to /atlas
/atlas                               → Atlas index (new homepage)
/atlas/:caseSlug                     → Visual case explorer (Explore mode)
/atlas/:caseSlug?chapter=:chapterId  → deep-link to a chapter
/evidence/:caseSlug                  → Evidence workspace (the current research UI)
/evidence/:caseSlug?claim=:claimId   → deep-link to a claim

# Backwards-compatible redirects (M1 URLs keep working):
/cases/:caseSlug         → /evidence/:caseSlug
/cases/:caseSlug/atlas   → /atlas/:caseSlug
```

The current research UI (`ChronologicalSpine`, `ResearchHeader`, claim/citation
components) moves wholesale to `/evidence/:caseSlug`. It stops being the public entry
point; Explore links *into* it at claim granularity.

---

## B. Atlas index (`/atlas`)

A full-screen geographic entry point that scales to many cases and is **honest about
which cases actually exist**.

### B.1 — The `AtlasCase` registry (contract #1)

The atlas is driven by a typed, validated **case registry**. This is a **new** content
type, deliberately **separate from `Place` / `ClaimPlaceLink`**.

```ts
type CaseStatus = 'published' | 'in_research' | 'planned';
type AtlasMode = 'explore' | 'evidence';

// Navigation-only geometry. NOT evidence. NOT a Place.
type NavigationGeometry =
  | { kind: 'point'; longitude: number; latitude: number; label: string }   // a named region/city pin
  | { kind: 'country'; iso3166: string; label: string };                     // a country highlight

interface AtlasCase {
  id: string;                       // stable internal id, e.g. 'case-nl-semi-equipment'
  slug: string;                     // URL slug, e.g. 'netherlands-semiconductor-equipment'
  country: string;                  // 'Netherlands'
  region?: string;                  // optional, e.g. 'Brainport / Eindhoven'
  industry: string;                 // 'Semiconductor equipment'
  title: string;                    // 'Netherlands × Semiconductor Equipment'
  shortQuestion: string;            // 'Why did advanced chipmaking equipment grow here?'
  summary: string;                  // one plain-language sentence
  status: CaseStatus;               // published | in_research | planned
  navigationGeometry: NavigationGeometry;   // locate-and-open only (see contract note)
  coverMediaId?: string;            // optional rights-cleared card image (role-typed MediaAsset)
  availableModes: AtlasMode[];      // [] for planned; ['evidence'] once the Evidence gate passes; add 'explore' once the Explore gate passes
}
```

> **Contract note (must appear in code + UI):**
> `AtlasCase.navigationGeometry is a navigational device used to locate and open a case.
> It does not assert that a historical event occurred at that point or country centroid.`

**Hard rules:**
- `navigationGeometry` **must not** reuse `Place` or `ClaimPlaceLink`. Navigation
  positioning is a separate concern from sourced evidence geography and carries **no**
  citation, precision, provenance, or epistemic status.
- Evidence geography stays exactly as in M1: validated `Places` + `ClaimPlaceLinks`
  *inside* a case, with precision and limitations.
- On the index map, navigation markers use a distinct visual language (soft country
  highlight or labelled "case pin"), never the sharp evidence-dot used inside a case, and
  a persistent legend states the contract note in plain language.

**Case-registry loader, validation, selectors:**
- **Loader** (`lib/atlasCaseRegistry.ts`): loads an explicit registry
  (`content/atlasCases/index.ts`) — an explicit array, mirroring the existing content
  loader pattern — and returns a typed, immutable list. No filesystem globbing.
- **Validation** (new **R-series** rules, build-blocking):
  - `R1` unique `id` and unique `slug`.
  - `R2` `slug` must match an existing case content module **iff** `status !== 'planned'`
    (a non-planned case must have a real corpus behind it).
  - `R3` `navigationGeometry.kind: 'country'` requires a valid ISO-3166 code; `'point'`
    requires a `label` (no bare centroid).
  - `R4` `availableModes` is empty for `planned`. For a non-planned case it lists exactly
    the gates actually passed (§B.4): include `'evidence'` iff the Evidence gate passes and
    `'explore'` iff the stricter Explore gate passes. `'explore'` may not appear without
    `'evidence'`. (Netherlands at launch: `['evidence']` — see §B.3.)
  - `R5` `coverMediaId`, if present, must resolve to a `MediaAsset` that is
    `permittedForPublicWebsite === true` (see contract #3).
  - `R6` a `planned` case must have **no** linked Claims, Sources, Places, or ClaimPlaceLinks.
- **Selectors** (pure, unit-tested): `allCases()`, `casesByStatus(status)`,
  `casesByIndustry(industry)`, `casesInPeriod(range)`, `caseBySlug(slug)`,
  `openableCases()` (those with a non-empty `availableModes`), and
  `navigationFeatures()` → a GeoJSON `FeatureCollection` tagged `role: 'navigation'` so the
  index map can never mix it with evidence GeoJSON.

### B.2 — Default map extent (decision #5, resolved)

**Decision recorded:**
- **Desktop Atlas index defaults to a world map.**
- Selecting a case **may move the camera to that case's region** (via `navigationGeometry`).
- **Mobile defaults to a visual case list** with a smaller supporting map.
- **Europe-only default is rejected** because **Taiwan × Semiconductor Manufacturing is a
  first-class `planned` case**; a Europe-centred default would hide it and bias the atlas.

### B.3 — Honest single-case launch state (contract #4)

The initial Atlas index ships with exactly:

| Case | Industry | Status | `availableModes` at launch | CTAs |
|---|---|---|---|---|
| Netherlands × Semiconductor Equipment | Semiconductor equipment | **`in_research`** | **`['evidence']`** | **Evidence** (primary) + *optional* secondary **"Open research map prototype"**; **no `Explore case` CTA yet** |
| Taiwan × Semiconductor Manufacturing | Semiconductor manufacturing | **`planned`** | **`[]`** | none — no fabricated explorer |
| France × Luxury | Luxury goods | **`planned`** | **`[]`** | none — no fabricated explorer |

> **The M1 interactive map is an internal/public research prototype and does not satisfy
> the Explore publication gate.** At Stage 1 the Netherlands case therefore exposes
> **Evidence only** (`availableModes: ['evidence']`), with an *optional* secondary link to
> the research-map prototype. Netherlands is `in_research`, not `published`: it has a real
> corpus (17 claims, 5 sources, 2 anchors) but its "why here" chapters are not yet sourced
> (§F), and **no public Explore experience exists yet** (see §B.4 for the enablement gate).

**How `planned` cases appear (enforced):**
- Visibly distinct status (dashed outline / "planned" chip; muted card).
- A single **future research question** (the case's `shortQuestion`) — framed as a
  question, not an answer.
- **No fabricated Claims. No source count. No evidence geography. No Explore CTA.**
- The card's only affordance is "planned — not yet researched"; there is no link into a
  non-existent explorer or evidence page.

### B.4 — Minimum publication gate (public-mode gate)

`availableModes` may include `explore` / `evidence` **only when a case passes the gate**:

- **Evidence gate:** the case has a loadable production corpus — **≥ 1 Source and ≥ 1
  Claim** that pass all existing V-series / G-series validators. (Netherlands passes.)
- **Explore gate (stricter) — all four required:** (1) the Evidence gate passes; (2) at
  least **one `supported` `NarrativeChapter`** (contract #2) exists whose prose is fully
  traceable to production Claims; (3) every linked/rendered `MediaAsset` passes the
  public-use rights gate (`permittedForPublicWebsite === true`, contract #3); and (4) the
  ordinary-user visual experience passes review.
- A `planned` case, by definition, passes **neither** gate → `availableModes: []`.
- Failing a gate is **build-blocking** for the corresponding public route: `/evidence/:slug`
  requires the Evidence gate; `/atlas/:slug` (Explore) requires the Explore gate. A route is
  not generated for a case that does not meet its gate.

> **The M1 interactive map is an internal/public research prototype and does not satisfy
> the Explore publication gate.** Netherlands passes the **Evidence** gate today, so at
> launch `availableModes: ['evidence']` (Evidence CTA + an optional secondary link to the
> research-map prototype). Public **Explore** for Netherlands is enabled — i.e. `'explore'`
> is added to `availableModes` — **only after all of:**
> 1. at least one `supported` `NarrativeChapter` exists;
> 2. its prose is traceable to production Claims;
> 3. its linked media pass the public-use rights gate (`permittedForPublicWebsite`);
> 4. the ordinary-user visual experience passes review.

### B.5 — Layout, filters, cards, responsive

- **Filters:** **industry**, **time period**, and **case status** (published / in_research
  / planned), all multi-select; map markers and cards are cross-highlighted.
- **Visual case preview cards:** cover image (a `permittedForPublicWebsite` `MediaAsset`),
  title, industry, period, status chip, `shortQuestion`. `planned` cards are muted per B.3.
- **Desktop:** full-bleed **world** map + floating filter bar + case-card rail; hover/focus sync.
- **Mobile:** **list-first** — a scrollable case-card list with a **smaller supporting
  map** as a header; filters in a bottom sheet; no horizontal scroll.

---

## C. Visual case explorer (`/atlas/:caseSlug`) — Explore mode default

The default public experience is an **understandable visual story**. Layout: a map (main
spatial surface) + a **story rail** of visual chapters + a **filmstrip timeline**;
selecting a chapter animates the map; evidence is available but not dominant. Each chapter
answers, in order: **What happened? → Why does it matter? → Where? → View evidence.**

### C.1 — The `NarrativeChapter` contract (contract #2)

```ts
type ChapterSupport = 'supported' | 'partially_supported' | 'needs_research';

interface NarrativeChapter {
  id: string;
  caseId: string;                   // FK → AtlasCase.id
  order: number;
  title: string;                    // plain language
  periodLabel?: string;             // optional, e.g. '1988–1991'
  whatHappened: string;             // plain-language, traceable to claimIds
  whyItMatters: string;             // significance for "why here"; may not exceed evidence
  claimIds: string[];               // production Claims backing the chapter
  placeIds: string[];               // evidence Places for the map camera/markers (may be empty)
  mediaIds: string[];               // role-typed MediaAssets
  supportStatus: ChapterSupport;
  limitations: string;              // shown, non-dominant (required; '' only if truly none)
  readingTimeMinutes: number;
}
```

**Validation + editorial rules (new C-series, build-blocking where noted):**
- `C1` **supported** chapters **require** production Claims: `supportStatus === 'supported'`
  ⇒ `claimIds.length ≥ 1` and every id resolves to a loaded Claim. *(build-blocking)*
- `C2` **partially_supported** chapters must **expose the boundary of evidence**:
  `limitations` must be non-empty and name what is *not* yet sourced. *(build-blocking)*
- `C3` **needs_research** chapters **cannot present conclusions as findings**: they render
  as a research-state placeholder (wireframe #7); `whyItMatters` must be phrased as an open
  question, and such chapters **may not** carry `claimIds` implying settled support.
- `C4` **Public prose must remain traceable to linked Claims**: for `supported` /
  `partially_supported`, `whatHappened` must be supported by `claimIds`; editorial review
  records the mapping. A CI lint flags prose with no backing claim.
- `C5` **A chapter with no Claims cannot silently appear as an established chapter**: if
  `claimIds` is empty, `supportStatus` **must** be `needs_research`. *(build-blocking)*
- `C6` **No causal prose may exceed the epistemic status of its Claims**: if any backing
  Claim is `attributed_only`, the chapter prose must hedge accordingly (no "caused/proved"
  language); causal wording requires `well_supported` Claims. *(editorial + review gate)*
- `C7` `placeIds` must reference this case's validated Places; an empty `placeIds` is
  allowed (a chapter can be non-geographic), but the map then shows no invented markers.

### C.2 — Netherlands chapters graded against the contract

Backing ids are the production Claims already in the corpus.

| # | Chapter (title) | periodLabel | claimIds | placeIds | supportStatus | Why this grade |
|---|---|---|---|---|---|---|
| 1 | A troubled joint venture is founded | 1982–1984 | `nl-f-jv-established-1984`, `nl-f-contribution-agreement-1984`, `nl-f-employees-transferred`, `nl-i-transfer-reluctance`, `nl-f-mip-non-participation` | — | **supported** | ≥1 Claim; no geo (empty placeIds OK) |
| 2 | Early crisis: the hydraulic-stage problem | 1983–1988 | `nl-f-hydraulic-stage-problems-1983`, `nl-f-pas2000-commercialization-problems-1983`, `nl-f-philips-advance-1987`, `nl-f-asm-withdrawal-1988`, `nl-f-philips-stake-acquisition-1988` | — | **supported** | multiple Claims |
| 3 | European collaboration: DEEP-UV | 1988–1991 | `nl-f-deepuv-coordination`, `nl-f-deepuv-participants`, `nl-f-deepuv-objective`, `nl-f-deepuv-reported-results` | `nl-place-veldhoven`, `nl-place-eindhoven` | **supported** | only geographically anchored chapter |
| 4 | A viable product: the PAS 5500 | 1991 | `nl-f-pas5500-launched-1991` | — | **partially_supported** | single Claim → must state the evidence boundary (C2) |
| 5 | Going public | 1994–1995 | `nl-f-holding-company-incorporated-1994`, `nl-f-public-company-listings-1995` | — | **supported** | two Claims |
| 6 | Why the Brainport / Eindhoven region? | — | *(none)* | — | **needs_research** | no Claims → must be needs_research (C5); open question only (C3) |
| 7 | The Philips ecosystem as a precondition | — | *(none)* | — | **needs_research** | not yet sourced (§F.3) |
| 8 | Suppliers & precision manufacturing | — | *(none)* | — | **needs_research** | §F.8 |
| 9 | Universities & talent pipeline | — | *(none)* | — | **needs_research** | §F.9 |
| 10 | Public policy & EU programmes | — | *(none)* | — | **needs_research** | §F.7, §F.10 |
| 11 | Customers & market demand | — | *(none)* | — | **needs_research** | §F.11 |
| 12 | Competitors & the counterfactual ("why not Japan/US") | — | *(none)* | — | **needs_research** | §F.12 |

Chapters 1–5 are the **supported founding/corporate spine**; chapters 6–12 are the actual
**"why here" argument**, honestly `needs_research`. The visible gap is the point — and it
is the research backlog (§F).

---

## D. Explore vs Evidence — the mode switch

A persistent toggle `[ Explore | Evidence ]` in the command bar.

| | **Explore** (default, public) | **Evidence** (researcher) |
|---|---|---|
| Language | Plain | Precise/technical |
| Content | Images, short explanations, map, visual timeline | Full Claims, Citations, source classification, provenance, epistemic status, technical IDs, limitations |
| Disclosure | Progressive | Everything visible |
| IDs / enums | **Never** | Shown |

### Component reuse across modes

- **Evidence reuses unchanged:** `ChronologicalSpine`, `ClaimEvidenceContent`,
  `CitationEvidenceBlock`, `ClaimBadges`, `ResearchHeader`, `AtlasDrawer`, the research
  view-model, Zod schemas, V-series/G-series validators.
- **Explore reuses:** `AtlasMap` (+ basemap + worker-copy fix + `mapStatus`),
  `atlasViewModel`/`atlasState` (extended with chapters), `AtlasTimeline` (re-skinned as the
  filmstrip); `AtlasControlRail` repurposed for Explore filters.
- **Shared substrate:** `lib/loadContent`, `content/index`, `schemas`, geographic
  validators, production `Places` / `ClaimPlaceLinks`.
- **New:** `atlasCaseRegistry` (contract #1), `NarrativeChapter` model (#2), Media model +
  rights (#3), the mode switch, story rail, filmstrip, preview cards, plain-language layer.

---

## E. Media evidence model + rights contract

New typed, validated structures (Zod-authoritative). Media is content, and content must be
sourced, role-typed, **and rights-cleared**.

```ts
type MediaCategory =
  | 'city_photography' | 'facility' | 'historical_photograph' | 'product_equipment'
  | 'archival_document' | 'event_photography' | 'portrait' | 'diagram';

// Evidential weight — mirrors epistemic status for claims.
type MediaEvidenceRole =
  | 'direct_historical_evidence' // depicts the actual subject at the actual time/place
  | 'sourced_illustration'       // sourced & relevant, illustrative not probative
  | 'present_day_context'        // modern photo for orientation; NOT historical proof
  | 'decorative';                // no evidential value

// Rights status (contract #3).
type RightsStatus =
  | 'public_domain' | 'open_license' | 'permission_granted' | 'restricted' | 'unknown';

interface MediaRights {
  status: RightsStatus;
  licenseName: string | null;          // e.g. 'CC-BY-4.0'
  licenseUrl: string | null;
  rightsHolder: string | null;
  requiredCreditLine: string;          // always rendered where the asset appears
  permittedForPublicWebsite: boolean;  // gates public Explore rendering
  permittedForPortfolioPresentation: boolean;
}

interface MediaAsset {
  id: string;
  category: MediaCategory;
  role: MediaEvidenceRole;
  title: string;
  caption: string;                     // plain language; honest about what it shows
  source: { label: string; url: string | null; archive: string | null };
  creator: string | null;
  createdDate: TemporalScope | null;   // when the media was made
  depictedDate: TemporalScope | null;  // what period it depicts (if historical)
  rights: MediaRights;
  file: { src: string; width: number; height: number; alt: string }; // self-hosted, cleared
  historicalLimitations: string;       // what it does NOT prove (required)
}

interface MediaLink {
  id: string;
  mediaId: string;
  target:
    | { caseId: string } | { chapterId: string } | { claimId: string } | { placeId: string };
  relation: 'depicts' | 'illustrates' | 'contextualises' | 'decorates';
  note: string | null;
}
```

**Build-blocking rules (new M-series):**
- `M1` **Public Explore cannot render `restricted` or `unknown` media**: a chapter/case
  that references a `MediaAsset` with `rights.status ∈ {restricted, unknown}` or
  `permittedForPublicWebsite === false` fails the build for that public route.
- `M2` **Every rendered asset has a visible or accessible credit**: `requiredCreditLine`
  is mandatory and always rendered (visible caption or accessible attribution).
- `M3` **Present-day context cannot be labelled as historical evidence**: an asset with a
  present-era `createdDate` may not have `role: 'direct_historical_evidence'`; it can only
  be `present_day_context` or `decorative`.
- `M4` **Decorative assets cannot support Claims**: `role: 'decorative'` (or a
  `relation: 'decorates'` link) may not target a `claimId` and may not back a chapter's
  support.
- `M5` **Remote availability does not establish permission**: an image being reachable on
  the web is not a right to use it. `rights.status` must be explicitly set and, for public
  rendering, resolve to `public_domain` / `open_license` / `permission_granted` with
  `permittedForPublicWebsite === true`. No hotlinking; assets are self-hosted after clearance.
- `M6` `direct_historical_evidence` requires a `depictedDate` overlapping the linked
  Claim's temporal scope and a real archival `source`; `relation` must match `role`.

---

## F. Netherlands visual research pack (research plan, not findings)

For each area: **why it matters · evidence required · useful visual assets · unsupported
inference to avoid.** Nothing here is a Claim yet; this is the backlog that turns the
*founding spine* (chapters 1–5) into a real *"why here"* argument (chapters 6–12).

1. **Eindhoven / Brainport as a regional environment.** *Why:* agglomeration is the core
   hypothesis. *Evidence:* located sources on 1980s–90s regional industrial density.
   *Visuals:* city/region photography (`present_day_context` unless period photos with
   `depictedDate` are sourced); cluster maps. *Avoid:* a modern Brainport photo implying the
   1984 cluster.
2. **Veldhoven.** *Why:* the ASM Lithography / early-ASML coordinator address (an evidence
   anchor). *Evidence:* sources tying the site to the firm across the years. *Visuals:*
   archival site/facility photography; the recorded address document. *Avoid:* a present-day
   ASML campus photo as the 1988 site.
3. **Philips research & industrial infrastructure.** *Why:* parent ecosystem / talent
   source. *Evidence:* located sources on Philips' role (NatLab, precision labs). *Visuals:*
   historical photographs, archival documents, portraits (cleared). *Avoid:* "Philips made
   ASML inevitable" without located support.
4. **ASM Lithography / early ASML locations.** *Why:* the firm's own geography and move to
   independence. *Evidence:* incorporation/holding records (partially present), site history.
   *Visuals:* early facility photos, corporate records. *Avoid:* backfilling later success
   onto the fragile early period.
5. **Lithography equipment.** *Why:* the product is why the industry matters. *Evidence:*
   sourced technical descriptions of PAS 2000/5000/5500. *Visuals:* `product_equipment`
   photos/diagrams. *Avoid:* a modern EUV photo depicting a 1991 PAS 5500.
6. **DEEP-UV.** *Why:* the one anchored collaboration chapter. *Evidence:* the CORDIS record
   + corroboration. *Visuals:* archival project documents; consortium diagrams. *Avoid:*
   over-reading a project record as commercial outcome.
7. **European research collaboration (MEGA/JESSI/ESPRIT-type).** *Why:* policy/collaboration
   hypothesis. *Evidence:* located sources on programmes and NL participation. *Visuals:*
   archival programme documents. *Avoid:* implying EU funding *caused* the industry.
8. **Suppliers & specialised manufacturing.** *Why:* precision-supplier density is a leading
   agglomeration mechanism. *Evidence:* sources naming specific suppliers/capabilities and
   local presence. *Visuals:* supplier facility/product photography. *Avoid:* generic "Dutch
   precision engineering" without sources.
9. **Universities & technical institutions.** *Why:* talent pipeline (e.g. TU Eindhoven).
   *Evidence:* located sources on graduate flows / research links. *Visuals:* campus/lab
   historical photography, portraits. *Avoid:* assuming a link without evidence of transfer.
10. **Public policy.** *Why:* national/regional policy as enabling condition. *Evidence:*
    located policy documents and concrete effect. *Visuals:* archival policy documents.
    *Avoid:* narrating intent as outcome.
11. **Customers & market demand.** *Why:* demand-side explanation. *Evidence:* sources on
    early customers/orders. *Visuals:* archival order/customer documents; product-in-use.
    *Avoid:* inferring demand from later market share.
12. **Competitors & alternative locations.** *Why:* the counterfactual is essential to a
    *why-here* argument. *Evidence:* comparative located sources on Nikon/Canon/GCA/
    Perkin-Elmer contexts. *Visuals:* comparative diagrams; competitor product photos
    (role-typed). *Avoid:* strawman comparisons; survivorship as proof of superiority.

**Additional research packs required (future cases):** Taiwan × Semiconductor Manufacturing
and France × Luxury each need their own pack before leaving `planned`; no explorer content
is authored for them until a corpus exists.

---

## G. Ordinary-user comprehension

**Lead with plain questions:** *What happened? · Why here? · Why did it matter? · What
changed?*

**Plain-language replacements (Explore only; never snake_case/IDs in Explore):**

| Research term (Evidence only) | Explore phrasing |
|---|---|
| `Claim` | "what we found" / "point" |
| `epistemicStatus: attributed_only` | "reported, not independently confirmed" |
| `epistemicStatus: well_supported` | "well supported by sources" |
| `evidencePrecision: city-level` | "location known to city level" |
| `project_coordinator_address` | "the project's lead office" |
| `project_participant_address` | "a partner's office" |
| `non_mappable` | "no confirmed exact location" |
| source `documentary` / `retrospective` | "official record" / "later account" |

**Supporting UI:** tooltips + short definitions on unavoidable terms; chapter summaries
always visible; **visible but non-dominant limitations** per chapter/image; **source
counters** ("Backed by N sources", linking to Evidence — planned cases show none);
**reading-time indicators** (`readingTimeMinutes`); progressive disclosure.

---

## H. Text wireframes

### 1. Atlas desktop homepage (`/atlas`) — world default

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ WHY HERE?  An Atlas of Industrial Advantage                          [About]   │
│ [Industry ▾] [Period ▾] [Status: ✓published ✓in research ✓planned]             │
├───────────────────────────────────────────────────────────┬────────────────────┤
│                                                            │  CASES             │
│         [ WORLD MAP — country highlights / case pins ]     │ ┌────────────────┐ │
│    ● Netherlands (in research)     ◌ Taiwan (planned)      │ │[img] NL × Semi │ │
│                          ◌ France (planned)                │ │ 1982–1995      │ │
│  legend: "Map locations open a case — navigation aids,     │ │ · in research  │ │
│           not evidence of where events occurred."          │ └────────────────┘ │
│                                                            │ ┌────────────────┐ │
│                                                            │ │ Taiwan · planned│ │
│                                                            │ │ "Why did adv.  │ │
│                                                            │ │ chip mfg …?"   │ │
│                                                            │ │ (not researched)│ │
│                                                            │ └────────────────┘ │
└───────────────────────────────────────────────────────────┴────────────────────┘
```

### 2. Atlas mobile homepage — list-first, smaller map

```
┌──────────────────────────┐
│ WHY HERE?      [filters ▾]│
├──────────────────────────┤
│  [ small supporting MAP ] │
│    ● NL   ◌ TW   ◌ FR     │
├──────────────────────────┤
│ ┌──────────────────────┐ │
│ │[img] NL × Semi eqpt  │ │
│ │ 1982–1995·in research│ │
│ │ [ Open case → ]      │ │
│ └──────────────────────┘ │
│ ┌──────────────────────┐ │
│ │ Taiwan · planned      │ │
│ │ "Why did adv. chip    │ │
│ │  mfg develop there?"  │ │
│ │ (not yet researched)  │ │
│ └──────────────────────┘ │
└──────────────────────────┘   (no horizontal scroll)
```

### 3. Netherlands visual explorer — desktop

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Netherlands × Semiconductor Equipment  [ Explore | Evidence ]  in research ▓▓░ │
├───────────────────────────────────────────────────────────┬────────────────────┤
│         [ MAP — framed on the chapter's geography ]        │ STORY               │
│         (evidence markers only where anchored)             │ ▣ Founding 1984     │
│   Veldhoven ●   ● Eindhoven  (chapter 3 is anchored)       │ ▣ DEEP-UV 88–91  ◀  │
│                                                            │ ◇ Why here? RESEARCH│
├─────────────────────────────────────────────────────────────┴──────────────────┤
│ FILMSTRIP [▣1984]-[▣83-88]-[▣DEEP-UV]-[▣PAS5500]-[▣IPO]-[◇why here] 1982··1995   │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 4. Netherlands visual explorer — mobile

```
┌──────────────────────────┐
│ NL × Semi  [Explore|Evid] │
├──────────────────────────┤
│  [ MAP — pinned header ]  │
│   ● Veldhoven ● Eindhoven │
├──────────────────────────┤
│ ▣ DEEP-UV (1988–1991)     │
│ What happened: European…  │
│ Why it matters: first…    │
│ Backed by 4 sources ·2min │
│ [ View evidence → ]       │
│ ⌄ What this doesn't show  │
│ [ Map | Story | Evidence ]│
└──────────────────────────┘
```

### 5. Evidence mode (`/evidence/netherlands-semiconductor-equipment`)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Netherlands × Semiconductor Equipment  [ Explore | Evidence ]  RESEARCH IN PROG│
│ 5 sources · 17 claims · 3 questions · 2 places · 2 place-links                  │
│ CHRONOLOGICAL SPINE:                                                            │
│  ▸ nl-f-deepuv-participants [FACTUAL][WELL_SUPPORTED]                           │
│     Citation: CORDIS record, grant agreement 2048 · ClaimPlaceLink → Eindhoven  │
└──────────────────────────────────────────────────────────────────────────────┘
   (unchanged M1 research UI; snake_case + IDs allowed here only)
```

### 6. Chapter selected — image + map

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ┌── MAP (framed on Veldhoven/Eindhoven) ──┐   DEEP-UV · 1988–1991             │
│  │  ● Veldhoven (lead office) ● Eindhoven  │                                   │
│  └─────────────────────────────────────────┘                                   │
│  [ IMAGE: archival DEEP-UV document ]  tag: "Archival, 1990 · CORDIS"           │
│  WHAT HAPPENED  A European consortium (ASM Lithography as coordinator)…         │
│  WHY IT MATTERS  First cross-border deep-UV lithography collaboration…          │
│  WHERE  Lead office Veldhoven; partner office Eindhoven (city-level).           │
│  Backed by 4 sources · ⌄ What this doesn't show · [ View evidence → ]           │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 7. Incomplete / research-state chapter (and planned case)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ◇ WHY HERE? — Regional ecosystem            [ RESEARCH STATE · not yet sourced]│
│  We don't yet have located sources for this chapter.                           │
│  Open question: did regional agglomeration (Philips, suppliers, universities,  │
│  policy, demand) make this the place — and why not Japan/US?  See §F.           │
│  (No map markers invented. No prose presented as a finding.)                    │
├──────────────────────────────────────────────────────────────────────────────┤
│  PLANNED CASE CARD (e.g. Taiwan):  status chip "planned" · shortQuestion only · │
│  no source count · no evidence geography · no Explore CTA.                      │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## I. Migration plan

### Preserve (do not discard)

MapLibre integration; the **worker-copy fix** (`scripts/copy-maplibre-worker.mjs` +
`setWorkerUrl` + container-height CSS); the production corpus; `Places`; `ClaimPlaceLinks`;
G-series/V-series validators; `atlasState`; `atlasViewModel`; `mapStatus`; the evidence
drawer; the research components; and all **209 tests**.

### Stage 1 (first after approval) — refined scope (decision #6)

**Stage 1 implements ONLY:**
- `/atlas` (Atlas index route).
- The **`AtlasCase` registry and validation** (R-series).
- **World-map** case navigation (navigation geometry only, with the contract legend).
- **Status and industry filters.**
- **Visual case preview** cards.
- **Netherlands `Evidence` access:** a primary **Evidence** CTA (opens
  `/evidence/netherlands-semiconductor-equipment`) **plus an optional secondary
  "Open research map prototype"** link to the M1 interactive map. **No `Explore case` CTA**
  — the M1 map does not satisfy the Explore gate (§B.4).
- **Honest `planned` states** for Taiwan and France (no explorer, no claims, no counts).
- **Route scaffolding and redirects** (`/cases/*` → `/atlas|evidence/*`).

**Stage 1 must NOT yet implement:**
- `NarrativeChapter` production content;
- media ingestion;
- Netherlands story chapters;
- fake Taiwan or France pages;
- any new evidence findings.

### Later stages

Stage 1 provides the Atlas index, **Evidence** access, and *optional* research-prototype
access. The public **Explore** experience is built and enabled only across the later
stages — never at Stage 1.

- **Stage 2 — Media model, rights validation & ingestion:** add `MediaAsset`/`MediaLink` +
  M-series validators + loader; ingest the first rights-cleared assets. No public Explore yet.
- **Stage 3 — First `supported` Netherlands visual chapters:** add the `NarrativeChapter`
  model + C-series validation, the `/atlas/:slug` Explore shell, the `Explore | Evidence`
  switch, and the filmstrip; author only `supported` chapters (spine 1–5) and render 6–12 as
  `needs_research`. **Enable Netherlands `Explore` (add `'explore'` to `availableModes` and
  the `Explore case` CTA) ONLY after** the four-point Explore-enablement gate is met (§B.4),
  including review.
- **Stage 4 — NL visual research pack (§F):** upgrade `needs_research` chapters to
  `supported` only as located sources land.
- **Stage 5 — Additional cases:** Taiwan, France, … each repeats Stages 2–4 (and its own
  research pack) behind the Stage-1 index; a case leaves `planned` only after passing the
  publication gate (§B.4).

---

## Architecture-document coverage checklist

This document explicitly covers:

- [x] **Navigation geography vs evidence geography** — Guardrails, §B.1 (contract note + hard rules), §H legend.
- [x] **Case registry** — §B.1 `AtlasCase` contract + loader + R-series validation + selectors.
- [x] **Chapter evidence contract** — §C.1 `NarrativeChapter` + C-series rules + §C.2 NL grading.
- [x] **Media licensing** — §E `MediaRights` + M-series build-blocking rules.
- [x] **Honest single-case launch** — §B.3 (NL `in_research`; Taiwan/France `planned`, no fabrication).
- [x] **Public-mode publication gates** — §B.4 Evidence gate + stricter Explore gate.
- [x] **World-map default** — §B.2 decision (desktop world; region on select; Europe-only rejected).
- [x] **Mobile list-first** — §B.2 / §B.5 / §H.2 (list-first with a smaller supporting map).

---

## Required output (summary)

1. **Architecture commit hash:** *(recorded in the delivery message after the docs commit).*
2. **Final document path:** `docs/product/PUBLIC_ATLAS_V2.md` (this file).
3. **`AtlasCase` contract:** §B.1 — typed registry separate from `Place`/`ClaimPlaceLink`, with the navigation-geometry contract note, loader, R-series validation, and selectors.
4. **`NarrativeChapter` contract:** §C.1 — typed chapter + C-series validation/editorial rules; §C.2 grades the 12 Netherlands chapters (1–5 supported/partial, 6–12 needs-research).
5. **Media-rights gate:** §E — `MediaRights` (`status`, `licenseName`, `licenseUrl`, `rightsHolder`, `requiredCreditLine`, `permittedForPublicWebsite`, `permittedForPortfolioPresentation`) + M-series build-blocking rules (no restricted/unknown in public Explore; credit required; present-day ≠ historical; decorative ≠ evidence; availability ≠ permission).
6. **Publication gates:** §B.4 — Evidence gate (≥1 Source + ≥1 valid Claim); **Explore gate = all four:** Evidence gate + ≥1 `supported` chapter traceable to Claims + all media `permittedForPublicWebsite` + visual-experience review. `planned` passes neither; failing a gate is build-blocking for the corresponding route. **The M1 map is a research prototype and does not satisfy the Explore gate** — Netherlands launches `['evidence']`.
7. **Revised Stage 1:** §I — `/atlas` + registry/validation + world-map navigation + status/industry filters + case preview + **Netherlands `Evidence` CTA + optional "Open research map prototype" link (no `Explore case` CTA)** + honest planned Taiwan/France + route scaffolding/redirects; explicitly no chapters, media, NL stories, fake pages, or new findings.
8. **`git status --short`:** *(recorded in the delivery message after the docs commit).*
