# Decision Log

Major decisions only, with reasoning. Approved decisions are current;
rejected approaches must not be reintroduced without an explicit new decision.

## Approved

**Portfolio piece, not a startup.** The atlas has no paying customer and
competes with free, better-funded incumbents. Optimising for a business model
would have compromised the depth and rigor that a portfolio piece is judged
on. Monetization, accounts and B2B features are out of scope entirely.

**Instrument, not causal oracle.** An oracle asserting "X because Y" is
contestable and, if machine-generated, indefensible. The instrument framing is
what makes the project survive academic scrutiny.

**Hybrid framework, neither component complete.** Porter's Diamond organizes
qualitative evidence as a lens; Economic Complexity provides a quantitative
baseline; historical sequencing, institutions and path dependence are
represented separately rather than forced into the Diamond. Each framework's
limitations are stated publicly.

**Claim type and epistemic status are orthogonal.** One label cannot represent
both the nature of a statement and the strength of its evidence.

**Only factual claims may be `established`.** Academic agreement does not
convert a historical causal interpretation into a documented fact. This is the
single most important epistemic rule in the project.

**Zod as authoritative schema, TypeScript inferred.** Types vanish at runtime;
content files are data and must be validated at runtime. `z.infer` prevents
drift.

**Structural enforcement over validator enforcement.** Where the type system
can make an invalid state unrepresentable, it must. Hence discriminated unions
for Claim and Case, and `.strict()` where a field must be absent rather than
merely unused.

**Citations locate evidence.** A source id alone is unverifiable inside a
200-page report. Long-form sources require precise locators.

**`context` citations never support a status.** Context evidence situates a
claim; it does not carry it.

**`insufficient` may rest on context-only citations.** This is the honest home
for a documented but under-evidenced claim. Forbidding it would push authors
toward deleting claims or overstating them; both are worse.

**Limitations are claims, not free text.** Free-text limitations violated the
core invariant. Limitation claims must be acyclic, in-case, non-self-
referencing, appropriately typed, and cited.

**Research questions are not claims.** A question asserts nothing, so it
carries no epistemic status and may be free text. Any explanation of why it
matters resolves to sourced claims.

**Preview cases assert nothing.** `PreviewCase` has no `thesisClaimId` field
at all, and carries no claim above `insufficient`. A preview poses questions.

**Timeline labels are generated, not authored.** The strict alternative was
chosen over a semantic containment heuristic: generation removes the smuggling
channel entirely rather than policing it imperfectly.

**Independence is a subset property.** Requiring every citation on a claim to
be mutually independent was wrong; what matters is whether a sufficient
independent subset exists.

**Deterministic bounded selection, not maximum independent set.** The evidence
rules require at most k = 2, so an NP-hard search was unjustified.
`MAX_CITATIONS_PER_CLAIM` remains a content sanity limit only.

**Duplicate sources detected by normalized identifiers.** Differing internal
ids sharing a DOI, ISBN, archive reference or canonical URL would silently
defeat the independence heuristic.

**Content as typed version-controlled files, not a database.** A real database
would be over-engineering that adds fragility. Files are auditable, diff-able
and validated at build.

**Technical MVP decoupled from Portfolio v1.** The codebase must be a
coherent finished product with the Netherlands case alone, rather than
becoming coherent only after all three cases are complete.

**Depth-first across cases.** Netherlands is completed entirely before Taiwan
or France begins. Breadth-first is the identified failure mode.

**Claim-type coverage is a capability, not a quota.** Unit fixtures cover all
four claim types; a real case may legitimately contain zero counterfactual
claims.

**No AI in the MVP.** The core experience must work fully without generative
AI. The claim/citation corpus leaves a clean seam for later retrieval-grounded
use.

## Rejected

**Startup positioning for the atlas.** No moat, no willingness to pay,
competing with free incumbents. Pursued as a portfolio piece instead.

**Supply-chain and trade-network globes.** Visually impressive, but the
underlying data is proprietary, unavailable or too coarse. Building them would
have meant fabricating relationships.

**AI-generated causal narratives.** A hallucination engine with a beautiful
interface. Credibility death for an academic portfolio piece.

**Free-text `relationship` on mechanism edges.** An unsourced assertion
channel. Edges now derive meaning entirely from their referenced claim.

**Free-text `limitations`, `thesisSentence`, and alternative-explanation
strings.** All were assertion back doors around the Claim model.

**Authored timeline labels with semantic containment checking.** The
containment heuristic was NLP-complete and imperfect in both directions.
Replaced by deterministic generation.

**Maximum independent set search.** NP-hard, unjustified for k ≤ 2, and would
have degraded unpredictably on heavily cited claims.

**Requiring every real case to exercise all four claim types.** Would have
incentivised inventing counterfactual claims to satisfy a quota.

**The original thirty-feature brief.** Breadth signals inability to
prioritise; depth signals judgement. Cut to three pillars.

## Deferred

- Taiwan × Semiconductor Manufacturing, France × Luxury, and Compare
  (Portfolio v1, after Netherlands is finished)
- Switzerland × Pharmaceuticals, Germany × Automotive or Industrial
  Engineering, South Korea × Consumer Electronics (second release; previews
  only, no placeholder content)
- AI concept-explainer, retrieval-grounded synthesis over the curated evidence
  base, guided comparison, Socratic questioning. Constrained forever to:
  explaining established concepts, retrieving from the project's own evidence
  base, guiding comparisons, asking questions. It must never generate factual
  evidence, causal claims or citations.
- Economic Complexity quantitative baseline visualisations (RCA, relatedness)
  for the flagship cases
