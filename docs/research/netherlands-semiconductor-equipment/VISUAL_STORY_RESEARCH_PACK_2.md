# Netherlands — Visual Story Research Pack 2 (research dossier)

> **Purpose:** assess whether the Netherlands × Semiconductor-Equipment case can carry a
> reader-facing *visual story* (narrative chapters over a map + media), and record honestly
> what the current evidence does and does not support.
> **Status: for factual, methodological and visual review — NOT committed, and NOT a
> decision to enable public Explore.**

---

## Review note (read this first)

This pack was written against a temptation to overstate readiness. It resists it. Three
findings are load-bearing and must not be softened in later revisions:

1. **Historical visual material is scarce.** No licence-clear *period* photograph of the
   1984 joint venture, the 1980s premises, the PAS machines of the era, or any founding-era
   event was found (see Media Evidence Pack 1, "Historical / archival image" = **gap**).
   Every usable asset is **present-day context** or a **general technical diagram**.

2. **The ecosystem causality is insufficient.** The corpus documents *events in sequence*
   (founding, technical trouble, financial strain, ASM's exit, the DEEP-UV project, the
   PAS 5500 launch, the IPO). It does **not** document a proven *mechanism* — why the
   region, which suppliers/universities/customers mattered, or whether DEEP-UV research
   transferred into the PAS 5500. A visual story must therefore describe **what happened**
   and explicitly **withhold why** where the evidence stops.

3. **Period photography is NOT required for the prose to be supported.** The written
   claims stand on their textual sources (a dissertation, the CORDIS record, ASML's own
   history, city gazetteer + CORDIS address records). Images are *context and
   illustration*, never the evidence for a historical assertion. So the absence of period
   imagery lowers visual richness — **not** epistemic support.

**Media roles must remain explicit.** Every visual carries its temporal context
(`present_day` / `timeless_illustration`) and an on-screen badge ("Present-day context" /
"Illustration"). No archival styling, no sepia, no implication that a modern photograph
depicts a historical event. The step-and-repeat diagram is a *general* method illustration
(German labels), not the case's machines.

**Do not rewrite the source findings to appear stronger.** Where a question is unanswered,
the visual story names it in a "What the evidence still cannot answer" section rather than
inventing a chapter to fill the hole.

---

## Revised readiness

**B — Partially Explore-ready.**

- **Ready:** a short, honest, evidence-anchored *narrative* (three chapters) can be told
  from the existing corpus, with a supporting map (city-level anchors) and present-day /
  illustrative media, each clearly labelled.
- **Not ready:** a full public "Explore" experience that would imply a *complete causal
  account* of the case, or that would present rich period imagery. The causal mechanism is
  unproven and the historical image layer is absent.

Consequently this pack ships an **unlinked, `noindex` review route**
(`/atlas/netherlands-semiconductor-equipment/explore-preview`, labelled "Visual story
preview"). The Netherlands `AtlasCase` does **not** gain an `explore` mode, and the Atlas
index gains **no** "Explore case" call to action. Enabling public Explore remains a
separate, later decision.

---

## What the chapters can and cannot claim

| Chapter | Period | Support | May state | May NOT state |
|---|---|---|---|---|
| 1 · A fragile joint venture | 1984 | supported | Founding, contribution agreement, 47 transfers, reluctance, MIP non-participation | Any causal "why here" |
| 2 · Crisis without a proven mechanism | 1983–1988 | **partially_supported** | The technical + financial + exit *sequence* | *Why* the venture survived (mechanism unproven) |
| 3 · European coordination | 1988–1991 | supported | ASML coordinated DEEP-UV; the listed consortium; the stated objective; the record-reported prototype results | That DEEP-UV **caused** the PAS 5500; that it **ensured** survival; that any participant physically worked at its recorded postal address |

Chapter 2 carries a **required, visible** evidence boundary, verbatim:

> The evidence establishes the sequence of technical and financial events, but not a
> complete causal explanation of why the venture survived.

---

## Media assignment (all present-day or timeless — none historical evidence)

| Chapter | Media | Temporal context | On-screen label | Role |
|---|---|---|---|---|
| 1 | `nl-media-eindhoven-city-2007` | present_day | Present-day context | Regional context |
| 2 | `nl-media-step-repeat-diagram` | timeless_illustration | Illustration | General method illustration |
| 3 | ASML Veldhoven (2008), Eindhoven (2007), step-repeat diagram | present_day / timeless | Present-day context / Illustration | Company + regional context, method illustration |

The former Philips **NatLab** asset (`nl-media-natlab-eindhoven-2017`) is retained in the
media pack but is used **only** as optional ecosystem context and is **not** attached to any
chapter as ASML-event evidence.

---

## The honest frontier ("What the evidence still cannot answer")

Surfaced to the reader as open questions, not as a failure message and never backfilled with
invented chapters:

1. Why Eindhoven, and not another region?
2. What did suppliers and local precision engineering contribute?
3. What role did universities and public research play?
4. Who were the early customers, and what was the demand?
5. What were the competitors and the alternative locations?
6. Did DEEP-UV research transfer into the PAS 5500?
7. How did the PAS 5500 actually perform commercially?
8. What was the substance of the 1995 IPO?

---

## Contribution-to-question boundaries (hardening pass)

Every chapter now carries two required, public-facing plain-language fields, shown on-screen
under the headings **"What this helps explain"** / **"What this does not yet explain"**:

| Chapter | What this helps explain | What this does not yet explain |
|---|---|---|
| 1 | How resources, staff and commitments from Philips and ASM were assembled into a new venture. | Why the Netherlands later developed a durable advantage in semiconductor lithography. |
| 2 | The documented sequence of technical difficulties, financing actions and ownership changes. | A complete causal explanation of why the venture survived. |
| 3 | That ASM Lithography operated within a cross-border European technical network during DEEP-UV. | That DEEP-UV caused the PAS 5500, ensured survival or produced commercial success. |

These make each chapter's contribution to the case's central question explicit, so a reader
never mistakes a well-evidenced *episode* for an *explanation* of the durable advantage.

## Method / guardrails carried into production

- Chapters are a **separate content layer**; chapter ids never attach to Claims. Every
  chapter sentence is traceable to existing production Claims — **no new facts** are authored
  in the narrative layer.
- **Build-blocking** validation (`lib/chapters.ts`, C1–C16) enforces: resolved
  claim/place/media references; `supported` needs ≥1 Claim; `partially_supported` needs a
  visible limitation; `needs_research` may not use conclusion language; both contribution
  boundary fields required; editorial sign-off flags for prose traceability and causal
  ceiling; a **required non-empty epistemic-ceiling review note** (C7c); present-day/timeless
  media may never be historical evidence; decorative media may never support prose;
  contextual media forces a non-empty limitation.
- **Media validated through MediaLink (C14–C16):** every chapter media id must resolve to a
  MediaAsset *and* to at least one in-case MediaLink; the governing link is chosen
  **deterministically** (decorative links excluded; differing roles ⇒ build failure, never a
  silent arbitrary pick); the UI's media role and temporal label derive from the MediaLink +
  MediaAsset, **not** from the chapter prose; a link that asserts Claims must assert only
  Claims the chapter uses, otherwise the media must be context-only.
- **Lexical safety lint (C7b) — named honestly.** The forbidden-phrase guard is a
  *supplementary, string-matching lint*, **not** semantic proof that causal prose is valid. It
  runs over the affirmative narrative only (never over the "does not explain" disclaimer,
  which quotes forbidden claims precisely to deny them). A clean pass means "no known bad
  phrasing present", never "causally correct". The real epistemic-ceiling judgement is the
  human `editorial.ceilingReviewNote`, whose *presence* the build gate checks without claiming
  to understand historical causality.
- **Map wording:** the map note reads *"These are addresses recorded for project
  organisations. They do not establish where project work physically took place."* — preserving
  the distinction between a **recorded organisation address** and a **physical event/research
  location**.
- Ordinary-user surface: **no** Claim/Source IDs, snake_case, raw epistemic enums,
  validation terminology, or long citations by default. Evidence is **progressively
  disclosed** behind a "View evidence" action and links to the existing Evidence workspace.
