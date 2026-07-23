# Project Brief

## Purpose

*Why Here?* is an explorable, evidence-based instrument for investigating how
industrial advantage forms across places and over time.

It is **not** a comprehensive economic database, and **not** a definitive
causal oracle. It does not assert why a country leads an industry. It lets a
user assemble and inspect the evidence, see how the reasoning is constructed,
and see exactly where the evidence stops.

**Tagline:** Explore how places develop industries the world depends on.

## Positioning

The product occupies a gap between three existing categories:

- **Atlas of Economic Complexity** — rigorous quantitative data, but cold,
  and offers no causal narrative.
- **Our World in Data** — excellent charts, but chart-by-chart rather than an
  explorable model of a country's industrial structure.
- **Wikipedia** — the facts, with no synthesis and no visible epistemic status.

*Why Here?* is the synthesis layer: rigorous data connected to a disciplined
analytical framework, in an interface where every claim's evidential standing
is visible.

## Portfolio positioning

This is a portfolio project for top International Business programmes. It is
judged on depth of thinking, quality of sourcing, and information design —
not on a business model. There is no monetization, no user accounts, no
paying customer.

Two audiences:

- **The curious learner** — wants to understand how economies work, currently
  stuck between dry academic tools and shallow encyclopedias.
- **The evaluator** — an admissions tutor or professor. This audience is
  explicit and first-class: the product must telegraph rigor and theoretical
  grounding within seconds, and must survive a skeptical reading of its
  methodology.

The distinguishing feature is epistemic discipline enforced by the build, not
by good intentions.

## Technical MVP

The codebase must be a coherent, finished, deployable product with the
Netherlands case alone. It must not depend on completing all three cases.

- Home
- Method
- Sources
- Complete Netherlands × Semiconductor Equipment case
- Reusable case architecture
- Build-time validation

## Portfolio v1

- Netherlands × Semiconductor Equipment
- Taiwan × Semiconductor Manufacturing
- France × Luxury
- Compare

## First flagship case

**Netherlands × Semiconductor Equipment.**

The reference implementation. All five layers are built completely for this
case before any other case begins. Breadth-first development across cases is
the identified failure mode for this project and is prohibited.

The five layers, built in this order:

1. **Evidence Cards** — the atomic sourced records
2. **Formation Timeline** — the sequential spine
3. **Analytical Lenses** — Porter's Diamond as a regrouping of the same claims
4. **Alternative Explanations** — competing accounts, limitations, open questions
5. **Mechanism Map** — generated only from already-researched, classified claims

The five layers are five projections of one evidence base, not five datasets.

## Deferred cases

Second release, previewed only, with no shallow or placeholder content:

- Switzerland × Pharmaceuticals
- Germany × Automotive or Industrial Engineering
- South Korea × Consumer Electronics

The three flagship cases are deliberately different, to test whether the
framework holds across a research-intensive technological cluster, a
state-supported industrial specialization, and a historically and culturally
embedded consumer industry.

## Explicitly out of scope

- Any generative AI in the MVP
- Any generated or invented content anywhere
- A fourth or later case beyond honest previews
- Trade globes, live supply-chain graphs, logistics networks
- University and startup-hub directories
- User accounts, monetization, payments
- A backend database (content is version-controlled typed files)

**Boundary test:** if a feature does not help a user investigate formation
with visible evidence, it is out.
