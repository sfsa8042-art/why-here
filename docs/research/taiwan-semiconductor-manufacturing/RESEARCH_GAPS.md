# Taiwan × Advanced Semiconductor Foundry Manufacturing — Research Gaps (Stage 11A)

Open questions and evidence weaknesses this foundation pack does **not** resolve.
Each is a genuine gap, not a placeholder. Gap IDs are stable (`G<n>`).

## G1 — Date reconciliation (mostly different events; residual uncertainty)
Reconciled by event type in [DATE_RECONCILIATION.md](DATE_RECONCILIATION.md). On inspection the
three apparent conflicts are largely **different events**, not direct contradictions:
- **RCA**: ITRI dates the **contract signature** to 1976; Chang ("1975") and the NRC panel
  ("1975" fab/activity) plausibly date the negotiation/decision or the start of activity.
- **UMC**: UMC's own filing fixes **incorporation = May 1980** (ITRI and Chang agree 1980);
  Saxenian's "1979" and one internally-inconsistent NRC sentence plausibly date the founding
  decision/authorization.
- **Hsinchu Science Park**: **establishment 1980** (Saxenian; Bureau 15 Dec 1980); Taiwan
  Insight's "1979" plausibly dates groundbreaking/construction.
**Residual uncertainty** (why this stays a gap): the secondary sources cannot be *shown* to
date the specific events assigned to them, no contemporaneous document was inspected, and the
Bureau's "15 December 1980" is a search snapshot (its page is JS-rendered, not verbatim-verified
this session). Each production claim now names the **exact event** it dates and keeps the
disagreement below `established`.

## G2 — TSMC's founding capital structure is not precisely evidenced
The NRC panel gives Philips "almost 35 percent of the initial investment"; TSMC's 20-F names only "the R.O.C. government and other private investors" without naming Philips or percentages. Widely-circulated web figures (e.g. government 48% / Philips 27.5% / private 24.x%) were **not** used because no authoritative source for them was inspected. An original founding prospectus, share register, or contemporaneous filing is needed.

## G3 — Number of ERSO personnel transferred to TSMC
ITRI says **98 professionals**; the NRC panel says "about **130** engineers". The claim asserts only that technology and personnel were transferred; the exact headcount is unresolved.

## G4 — Who actually invited/decided to recruit Morris Chang
ITRI's history credits "Premier Yun-Suan Sun"; Chang's oral history names the appointing Premier as **Yu Kuo-hwa** and says **K.T. Li** (Minister without portfolio) asked him to start a semiconductor company. The decision chain (Sun as elder statesman vs the sitting Premier vs K.T. Li) is not resolved from inspected sources.

## G5 — Early customer evidence for TSMC is thin (RQ4/RQ5)
Chang's oral history describes first customers as large IDMs' "leftovers" and the fabless industry "mushrooming" from ~1991–92, but **no independent, contemporaneous customer records** (contracts, order books, early client names) were inspected. The demand-side story rests on one retrospective participant account.

## G6 — Packaging, testing, and equipment/materials sub-sectors are unresearched
This pack concerns foundry (wafer) manufacturing. Taiwan's packaging & testing (OSAT) and materials/equipment supply chains — and how they co-evolved with the foundries — are not yet covered by any inspected source or claim.

## G7 — Counterfactuals and the "why Taiwan, not elsewhere" question (RQ6) are unanswered
No inspected source supports a properly-evidenced counterfactual (e.g. whether the foundry model could have failed, or why Taiwan rather than Korea/Singapore). RQ6 deliberately carries no rationale claims. Comparative sources (e.g. Korea) and analytical-method framing are needed before any counterfactual claim is authored.

## G8 — Ecosystem "self-reinforcement" mechanisms are hypotheses only
Clustering, supplier concentration, manufacturing learning, and reinvestment (RQ5) are recorded in CAUSAL_HYPOTHESES.md as untested hypotheses. No causal claim is asserted; the returnee/"brain-drain reversal" interpretation (Saxenian) concerns 1990s upgrading, beyond the founding window.

## G9 — Un-inspected secondary works behind the evidence
Several figures rest on works cited *inside* inspected sources but not themselves inspected: Wade (1990) (ERSO scale; UMC equity), Callon (1995), the Industrial Economics Research Center (1987). These do not count as independent corroboration and should be inspected directly before any related claim is upgraded.

## G10 — Lai/Chang/Shyu publication venue unverified → reclassified `other`
The Lai/Chang/Shyu paper was inspected as a hosted PDF, but its **publication venue could not be verified**: the PDF carries no embedded metadata and no journal name in its own header/footer (only bibliography "Vol." references), and ResearchGate was unreachable this session. It is therefore classified **`other`, not `academic`** (Stage-11A hardening). Consequence: it is not a qualifying source for any factual claim's `well_supported` floor and is not an expert source for the interpretive floor, so it appears only as **non-load-bearing corroboration** alongside a qualifying independent source (Saxenian / NRC). See SUPPORT_AUDIT.md. If the venue is later verified from an authoritative record it may be reclassified `academic`.
