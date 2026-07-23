# Why Here? — An Atlas of Industrial Advantage

An evidence-based interactive research instrument for investigating how
industrial advantage forms across countries and over time.

@docs/PROJECT_BRIEF.md
@docs/METHODOLOGY.md
@docs/CONTENT_MODEL.md
@docs/VALIDATION_SPEC.md
@docs/IMPLEMENTATION_PLAN.md
@docs/DECISION_LOG.md

## Non-negotiable epistemic rules

These are not style preferences. Violating any of them invalidates the project.

1. **Every substantive assertion resolves to a Claim.** Every factual,
   interpretive, causal or counterfactual assertion visible in the UI must
   resolve to a Claim carrying at least one located Citation. There is no
   free-text assertion field in the model.
2. **Claim type and epistemic status are orthogonal.** Neither may be
   inferred from the other. Both are mandatory.
3. **Only factual claims may be `established`.** Interpretive, causal and
   counterfactual claims are capped at `well_supported`. Academic agreement
   does not convert a historical causal interpretation into a documented fact.
4. **Causal and counterfactual claims require limitation claims.** Limitations
   are themselves sourced Claims, never free text.
5. **Citations locate evidence.** A source identifier alone is not a citation.
   Long-form sources require a precise locator.
6. **`context` citations never support a status.** No `established` or
   `well_supported` claim may rest on context-only evidence.
7. **Contested requires both sides.** Independent supporting *and*
   contradicting evidence, or the honest label is `insufficient`.
8. **No AI in the MVP.** The core experience must work fully without
   generative AI.

## Working rules for Claude Code

- **Work in small increments.** One increment per session of work, as defined
  in `docs/IMPLEMENTATION_PLAN.md`.
- **Never continue automatically to the next increment.** Stop for review at
  the end of every increment, without exception.
- **No UI work before schemas and validation are approved.** No pages, no
  components, no styling until Increment 1 and Increment 2 are both reviewed
  and approved.
- **Never invent research content or citations.** Do not author claims about
  the Netherlands or any real subject without real, located sources supplied
  or verified by the maintainer. Fixtures must be explicitly synthetic and
  labelled as such. A fabricated citation is the worst possible failure in
  this project.
- **Run tests after every implementation increment.** If tests cannot be run,
  say so explicitly and do not report the increment as verified.

## Increment completion format

Every increment ends with, in this order:

1. list of created and changed files;
2. the exact commands to run;
3. test results (or an explicit statement that tests could not be run);
4. deviations from specification;
5. an explicit stop for review.
