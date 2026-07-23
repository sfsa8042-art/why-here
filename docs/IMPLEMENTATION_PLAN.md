# Implementation Plan

## Rules

- One increment at a time. **Never continue automatically.**
- Every increment ends with the completion format below and stops for review.
- No UI work until Increments 1 and 2 are approved.
- No research content until real located sources are supplied or verified.
  Fixtures are synthetic and must be labelled as such.

## Increment completion format

1. list of created and changed files
2. exact commands to run
3. test results, or an explicit statement that tests could not be run
4. deviations from specification
5. explicit stop for review

## Increment 1 — Schemas and types

**Status: implemented; test run verified 2026-07-23 (npm install, typecheck and
vitest all pass; `.strict()`, discriminated-union and epistemic-cap behaviour
confirmed against installed zod). Awaiting maintainer review.**

Contains only:

- project scaffolding (`package.json`, `tsconfig.json`, `vitest.config.ts`,
  `.gitignore`)
- `lib/schemas.ts` — all Zod schemas
- inferred TypeScript types via `z.infer`
- minimal Vitest configuration
- one valid schema fixture, synthetic, containing zero counterfactual claims
- one invalid fixture: a causal claim without `limitationClaimIds`, plus an
  empty-array near-miss variant
- tests proving the valid fixture parses and the invalid fixture is rejected

**Not in Increment 1:** cross-entity validator, provenance graph, independent
source selection, duplicate-source detection, content loader, Next.js pages,
Method page, visual components, Netherlands research content.

**Known state.** Verified 2026-07-23: `npm install` (zod 3.x, vitest 2.1.9),
`npm run typecheck` (clean) and `npm test` (8/8 passing) all succeeded. The
Zod API surface was additionally confirmed by direct probe: `.strict()` on
`TimelineProjectionSchema` rejects an authored `label`, `.strict()` on
`PreviewCaseSchema` rejects `thesisClaimId`, the claim discriminated union
rejects `established` on causal claims, and `endYear < year` is rejected.
Increment 1 is verified and awaits maintainer review.

## Increment 2 — Cross-entity validator

- `lib/validate.ts` implementing V1–V20
- provenance graph construction, cycle detection, transitive closure
- `selectIndependentSources` with deterministic bounded search
- normalized duplicate-source detection
- limitation-graph acyclicity
- structured failure reporting: `{ ruleId, entityId, message }`
- `scripts/validate-content.ts`, wired to `prebuild`, exiting non-zero
- Vitest coverage for every failure condition, each with an invalid fixture
  and a near-miss valid variant

Ends with review. **No UI may begin until this increment is approved.**

## Increment 3 — Content loader and generated labels

- typed content loader over `content/`
- claim → timeline and claim → lens projections, derived not stored
- `generateTimelineLabel`, pure and total, with its unit tests
- integration test: full valid fixture case through the whole pipeline

## Increment 4 — Netherlands research content

Research only; no new code paths. Claims authored against real located
sources, classified by type and status, with limitation claims for every
causal claim. Built in layer order: Evidence Cards, Formation Timeline,
Analytical Lenses, Alternative Explanations, Mechanism Map.

The Mechanism Map is generated only from already-researched, classified
claims. No edge exists without a sourced relational claim.

## Increment 5 — Method page

The methodology, framework limitations, epistemic label definitions, evidence
requirements, and a live annotated example. Built before case UI, because it
is where a skeptical reader establishes trust.

## Increment 6 — Epistemic label component system

Redundant encoding: colour plus icon or shape plus text. Legible in
greyscale and in print. Edge line styles mirror status. Respects
`prefers-reduced-motion`.

## Increment 7 — Case UI, layer by layer

Evidence Cards, then Formation Timeline, then Analytical Lenses, then
Alternative Explanations, then Mechanism Map. One layer per increment,
each reviewed.

## Increment 8 — Home, Sources, preview case

Completes the Technical MVP. The product must now be coherent and finished
with the Netherlands case alone.

## Later — Portfolio v1

Taiwan and France cases, then Compare. **Taiwan and France must not begin
before the Netherlands case is genuinely finished.** Breadth-first
development is the identified failure mode.
