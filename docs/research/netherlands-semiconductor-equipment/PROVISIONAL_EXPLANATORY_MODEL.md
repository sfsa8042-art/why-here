# Provisional Explanatory Model — Netherlands × Semiconductor Equipment (Revised)

> **Reconciliation note.** The provisional S-1…S-17 slots used while drafting
> have been replaced with the real production Claim IDs, each verified directly
> against
> `content/cases/netherlands-semiconductor-equipment/claims.ts` before saving.
> Three corrections requested on review have been applied: (a) the
> employee-reluctance Claim is marked `interpretive / well_supported`, not
> factual, and §2 is retitled *Evidence-backed chronological spine*; (b) the
> financing language is softened to avoid any inference of insolvency,
> inability to raise funds, or imminent closure; (c) M5 distinguishes
> production-backed European DEEP-UV participation from the Dutch support
> mechanisms, which remain research-dossier context or blocked evidence.
> This document is a research/analytical artefact — it is NOT production
> content and introduces no production Claims, nodes, edges, alternatives or
> thesis.

## Provenance key

- **Production-backed** — resolves to one of the seventeen production Claims,
  referenced by its real Claim ID in `[brackets]`.
- **`research-dossier context, not production-backed`** — appears in research
  packs but has no production Claim; usable only as explicitly-marked context.
- **analytical hypothesis** — model-level reasoning, not a fact.

The seventeen production Claims (real IDs):
`nl-f-jv-established-1984` JV established 1984 ·
`nl-f-contribution-agreement-1984` roughly equal parent contributions ·
`nl-f-employees-transferred` 47 employees transferred ·
`nl-i-transfer-reluctance` reported employee reluctance *(interpretive / well_supported)* ·
`nl-f-mip-non-participation` MIP considered, not materialising ·
`nl-f-hydraulic-stage-problems-1983` hydraulic-stage problems ·
`nl-f-pas2000-commercialization-problems-1983` other PAS 2000 commercialisation problems ·
`nl-f-philips-advance-1987` Philips 13.5M advance 1987 ·
`nl-f-asm-withdrawal-1988` ASM withdrawal July 1988 ·
`nl-f-philips-stake-acquisition-1988` Philips acquired 50% stake for 8.6M ·
`nl-f-deepuv-coordination` ASM-L coordinated DEEP-UV 1988–91 ·
`nl-f-deepuv-participants` Philips/Zeiss/others participated ·
`nl-f-deepuv-objective` DEEP-UV 248 nm / sub-0.5-µm objective ·
`nl-f-deepuv-reported-results` DEEP-UV project-reported prototype results ·
`nl-f-pas5500-launched-1991` attributed PAS 5500 launch 1991 ·
`nl-f-holding-company-incorporated-1994` holding-company incorporation Oct 1994 ·
`nl-f-public-company-listings-1995` attributed 1995 public listing.

One of the seventeen — `nl-i-transfer-reluctance` — is **interpretive**
(`interpretive / well_supported`); the other sixteen are factual. The spine is
therefore chronological, not uniformly factual.

## 1. Explanatory boundary

| Outcome | Explainable now? | Production basis |
|---|---|---|
| Founding (1982–1984) | **Yes** | `nl-f-jv-established-1984`…`nl-f-mip-non-participation` (incl. the interpretive `nl-i-transfer-reluctance`) |
| Founding-era crisis (1984–1988) | **Yes** | `nl-f-hydraulic-stage-problems-1983`…`nl-f-philips-stake-acquisition-1988` |
| Technological development (1988–1991) | **Partially** — DEEP-UV only | `nl-f-deepuv-coordination`…`nl-f-deepuv-reported-results` |
| Commercial viability (1991–1995) | **No** | — |
| Public-company transition (1994–1995) | **Only as ASML's attributed statement** | `nl-f-holding-company-incorporated-1994`, `nl-f-public-company-listings-1995` |
| Later market leadership | **No / out of scope** | — |

Defensible boundary ends **1988**, extendable to 1991 only for narrow
technological-participation facts
(`nl-f-deepuv-coordination`…`nl-f-deepuv-reported-results`). The viability
window remains unexplained.

## 2. Evidence-backed chronological spine

Every item resolves to a production Claim; nothing else appears here. Sixteen
items are factual; the reluctance item is **interpretive / well_supported** and
is marked as such.

- 1984 — JV established [`nl-f-jv-established-1984`]; roughly equal
  contributions [`nl-f-contribution-agreement-1984`]; 47 transferred
  [`nl-f-employees-transferred`]; reported reluctance
  [`nl-i-transfer-reluctance` — **interpretive / well_supported**]; MIP
  considered, not materialising [`nl-f-mip-non-participation`].
- 1983–84 — hydraulic-stage problems [`nl-f-hydraulic-stage-problems-1983`];
  other PAS 2000 commercialisation problems
  [`nl-f-pas2000-commercialization-problems-1983`].
- 1987 — Philips advanced 13.5M guilders on ASM's behalf
  [`nl-f-philips-advance-1987`].
- July 1988 — ASM withdrew [`nl-f-asm-withdrawal-1988`]; Philips acquired the
  50% stake for 8.6M [`nl-f-philips-stake-acquisition-1988`].
- 1988–1991 — ASM-L coordinated DEEP-UV [`nl-f-deepuv-coordination`]; Philips,
  Zeiss and others participated [`nl-f-deepuv-participants`]; 248 nm /
  sub-0.5-µm objective [`nl-f-deepuv-objective`]; project-reported prototype
  results [`nl-f-deepuv-reported-results`].
- 1991 — ASML's attributed statement that PAS 5500 launched
  [`nl-f-pas5500-launched-1991`].
- Oct 1994 — holding company incorporated
  [`nl-f-holding-company-incorporated-1994`].
- 1995 — ASML's attributed statement of US + Amsterdam listing
  [`nl-f-public-company-listings-1995`].

**Excluded from the spine as `research-dossier context, not
production-backed`:** SIRE lineage; PAS 2400; PAS 2500; the Eindhoven/Strijp
facilities detail; the Perkin Elmer/Censor contingency; the NASDAQ
secondary-offering detail; MIP/TOK/INSTIR specifics beyond
`nl-f-mip-non-participation`; the ~7M and 8.6M figures' archival substructure.
These may inform context panels only if visibly tagged.

## 3. Capability inheritance map

| Element | From→To | Status | Production basis | Unresolved |
|---|---|---|---|---|
| Corporate financing capacity | Philips(+ASM)→JV | `evidenced component` | `nl-f-contribution-agreement-1984`, `nl-f-philips-advance-1987`, `nl-f-philips-stake-acquisition-1988` | ASM did not provide the relevant contribution directly in the documented 1987 episode; Philips subsequently assumed greater financial exposure |
| Engineering personnel | Philips→JV | `evidenced component` | `nl-f-employees-transferred` | Transferred with reluctance [`nl-i-transfer-reluctance` — interpretive / well_supported]; value vs morale-cost |
| PAS 2000 product embodiment | Philips→JV | `evidenced component` / **inherited liability** | `nl-f-hydraulic-stage-problems-1983`, `nl-f-pas2000-commercialization-problems-1983` | Documented as problematic |
| Lithography research base (pre-PAS 2000) | Philips→JV | **`research-dossier context, not production-backed`** | — (no production Claim) | Significance unresolved *and* unsupported at production level |
| Facilities | Philips→JV | **`research-dossier context, not production-backed`** | — | — |
| Sales/service/volume-manufacturing capability | — | **absent** | — | Never evidenced as inherited |

Headline unchanged and now strictly sourced: inheritance included at least one
documented **liability** (the PAS 2000,
`nl-f-hydraulic-stage-problems-1983`/`nl-f-pas2000-commercialization-problems-1983`),
so "Philips inheritance" is not unambiguously an advantage.

## 4. Technology genealogy

Production-backed nodes only: **PAS 2000 problems
[`nl-f-hydraulic-stage-problems-1983`,
`nl-f-pas2000-commercialization-problems-1983`] · DEEP-UV objectives & reported
results [`nl-f-deepuv-objective`, `nl-f-deepuv-reported-results`] · attributed
PAS 5500 launch [`nl-f-pas5500-launched-1991`]**.

| Edge | Classification |
|---|---|
| PAS 2000 → (PAS 2400 → PAS 2500) | **`research-dossier context, not production-backed`** — PAS 2400/2500 have no production Claims; shown only as separated context, no production-backed edge |
| PAS 2500 → DEEP-UV | **not production-backed** (PAS 2500 absent from corpus); any relation stays context-level |
| DEEP-UV → PAS 5500 | `speculative relationship` — **no inference; no transfer** |
| PAS 2000 problems → DEEP-UV | `chronological` only, and only `nl-f-hydraulic-stage-problems-1983`/`nl-f-pas2000-commercialization-problems-1983` → `nl-f-deepuv-coordination` as ordering |

No `verified transfer` edge. No imported PAS 5500 specifications. PAS 2400/2500
do **not** appear as production-backed genealogy nodes.

## 5. Provisional mechanism catalogue

**M1 — Capability transplant.** Cause: Philips personnel + financing.
Mechanism: transferring an established base into a focused venture supplied
capability it need not build from scratch. Outcome: an operational firm at
founding. Support: `nl-f-contribution-agreement-1984`,
`nl-f-employees-transferred`. Status: `plausible mechanism`. Confidence:
**low-to-moderate.** Competing: M2. Missing: evidence isolating inheritance's
contribution. Falsifier: evidence the base was too defective to be usable
(partly present via M3). *Note: the "research base" leg is research-dossier
context, so M1 rests at production level only on personnel + financing.*

**M2 — Focused recombination.** Cause: separation into a dedicated
organisation. Mechanism: commercial focus outside Philips's structure allowed
different prioritisation. Outcome: a separate firm [`nl-f-jv-established-1984`],
later a holding company [`nl-f-holding-company-incorporated-1994`]. Status:
`speculative mechanism`. Confidence: **low.** Competing: M1. Missing: any
evidenced decision separation enabled. Falsifier: evidence separation
constrained rather than freed commercial orientation.

**M3 — Inherited-liability resource drain (revised).** Cause: documented PAS
2000 problems [`nl-f-hydraulic-stage-problems-1983`,
`nl-f-pas2000-commercialization-problems-1983`]. Mechanism: *the documented
technical problems consumed engineering and financial resources and may have
slowed commercial progress.* Outcome: (no revenue-delay assertion) — resource
consumption during the early period. Support:
`nl-f-hydraulic-stage-problems-1983`,
`nl-f-pas2000-commercialization-problems-1983`, contextually
`nl-f-philips-advance-1987`. Status: `plausible mechanism`. Confidence:
**low-to-moderate.** Missing: commercial and sales evidence. Falsifier:
evidence the problems were minor or did not affect commercial progress.

**M4 — Parent financial assumption (revised).** Cause hypothesis: the financing
gap reflected by Philips advancing funds on ASM's behalf. Mechanism: *Philips's
intervention may have allowed development to continue.* **Evidenced outcome:
Philips assumed greater financial exposure and consolidated ownership during
the 1987–1988 crisis** [`nl-f-philips-advance-1987`,
`nl-f-asm-withdrawal-1988`, `nl-f-philips-stake-acquisition-1988`]. Status:
`plausible mechanism`. Confidence: **low-to-moderate.** Competing: M7. Missing:
closure risk, alternative financing, Philips board reasoning. Falsifier:
evidence the venture could have continued without Philips. *(No "saved"/"ensured
survival" wording; no inference of insolvency, inability to raise funds, or
imminent closure.)*

**M5 — Public risk-sharing (revised).** Two distinct strands that must **not**
be merged into one verified programme stream:
(a) **European DEEP-UV participation — production-backed**
[`nl-f-deepuv-coordination`]: an EU collaborative project ASML coordinated;
(b) **Dutch support mechanisms (TOK/INSTIR) —
`research-dossier context, not production-backed` / blocked evidence**:
appearing only in research packs, with no production Claim.
Proposed mechanism: *financial or institutional risk-sharing may have reduced
development burdens.* Status: `blocked mechanism`. Confidence: **low.** Missing:
for **both** strands — awards, amounts, disbursement, recipient, materiality.
Falsifier: evidence funds were immaterial or not received.
*CORDIS/`nl-f-deepuv-coordination` proves EU-project participation and reported
results [`nl-f-deepuv-reported-results`], not a funding amount received by
ASML; the Dutch instruments remain unquantified context and must not be
presented alongside the European project as a single verified stream.*

**M6 — Network coordination.** Cause: participation alongside Zeiss, Philips,
Siemens, CEA, Fraunhofer, Hoechst [`nl-f-deepuv-participants`]. Mechanism:
coordinating specialised external capability substituted for vertical
integration. Outcome: access to capability beyond internal scope. Status:
`plausible mechanism` for *access*; `speculative` for *dependency/advantage*.
Confidence: **low.** Missing: participant roles, weights, exclusivity.
Falsifier: evidence participation ≠ dependence.

**M7 — Product-platform turn.** Cause: attributed PAS 5500 launch
[`nl-f-pas5500-launched-1991`]. Mechanism: a viable platform may have changed
ASML's commercial position. Outcome: (unevidenced) viability. Status:
`speculative mechanism`. Confidence: **low.** Competing: M4, M6. Missing: specs,
customers, sales, reliability. Falsifier: evidence viability preceded or was
independent of the PAS 5500.

## 6. Alternative-explanation matrix

| Alt | Supporting now (production) | Missing | Unique prediction | Depends on unavailable sources | Coverage | Confidence |
|---|---|---|---|---|---|---|
| 1 Philips inheritance | `nl-f-contribution-agreement-1984`, `nl-f-employees-transferred`, `nl-f-philips-advance-1987`, `nl-f-philips-stake-acquisition-1988` | contribution-isolation; sales | inherited assets dominate early capability | partly | founding–crisis | **low-to-moderate** |
| 2 Entrepreneurial recombination | `nl-f-jv-established-1984`, `nl-f-holding-company-incorporated-1994` | decisions separation enabled | post-separation choices differ | yes | founding, structure | **low** |
| 3 Public/European risk-sharing | `nl-f-deepuv-coordination` | amounts, disbursement, materiality | public funds materially offset cost | **yes (NA files)** | development | **low** |
| 4 Supplier-network | `nl-f-deepuv-participants` | roles, dependency | coordination substitutes for integration | partly | development | **low** |
| 5 Product breakthrough | `nl-f-pas5500-launched-1991` (attributed) | specs, sales, customers | PAS 5500 inflects trajectory | **yes** | viability | **low** |
| 6 Customer learning | **none** | everything | demanding customers drive learning/repeat | **yes** | viability | **low (unevidenced)** |
| 7 Market timing | **none** | competitor/demand data | external shift creates opening | yes | viability | **low (unresearched)** |

Coexistence: 1–4 are complementary and cover founding→development; 5–7 concern
viability and are near-unevidenced. Sharpest divergence: Alt 1 (capability
inside the Philips inheritance) vs Alt 3/4 (capability in external/public
networks). No winner selected.

## 7. Porter Diamond evidence map

| Facet | Currently evidenced | Suggested (marked hypothesis) | Absent |
|---|---|---|---|
| Factor conditions | engineers [`nl-f-employees-transferred`] | talent-pipeline depth *(hypothesis)* | wage/capital-cost data |
| **Demand conditions** | **none** | **none** | **evaluations, orders, installations, repeat demand, customer learning** |
| Related & supporting industries | consortium participation [`nl-f-deepuv-participants`] | ecosystem depth *(hypothesis)* | supplier roles, terms |
| Firm strategy, structure, rivalry | `nl-f-jv-established-1984`, `nl-f-asm-withdrawal-1988`, `nl-f-holding-company-incorporated-1994` | commercial-strategy choices *(hypothesis)* | competitor rivalry specifics |
| Government | MIP considered, not materialised [`nl-f-mip-non-participation`]; DEEP-UV participation [`nl-f-deepuv-coordination`] | TOK/INSTIR *(research-dossier context)* | funding amounts, disbursement, effect |
| Chance & timing | — (Perkin Elmer/Censor is `research-dossier context`) | — | market-timing conditions |

**Demand conditions: currently evidenced — none; suggested — none; absent —
evaluations, orders, installations, repeat demand, customer learning.** The
prior "Philips as internal early demand" suggestion is removed; the corpus
contains no verified customer-demand Claim.

## 8. Sequencing model

| Sequence | Production basis | Status |
|---|---|---|
| Research inheritance → organisational separation | (inheritance leg is context); `nl-f-jv-established-1984` | `analytically relevant`; **causally unproven** |
| Technical problems → further financing | `nl-f-hydraulic-stage-problems-1983`/`nl-f-pas2000-commercialization-problems-1983` → `nl-f-philips-advance-1987` | `verified` ordering; `analytically relevant`; **causally unproven** |
| Ownership consolidation → DEEP-UV | `nl-f-philips-stake-acquisition-1988` → `nl-f-deepuv-coordination` | `verified` ordering; **causally unproven** (adjacency, not linkage) |
| DEEP-UV → attributed PAS 5500 launch | `nl-f-deepuv-coordination`/`nl-f-deepuv-reported-results` → `nl-f-pas5500-launched-1991` | `verified` ordering; **causally unproven** — no transfer inference |
| Holding-company incorporation → attributed listing | `nl-f-holding-company-incorporated-1994` → `nl-f-public-company-listings-1995` | `verified` ordering; **causally unproven** — incorporation did not "cause" the IPO |

All verified as ordering, none as causation.

## 9. Contradictions and tensions

1. Inherited capability [`nl-f-contribution-agreement-1984`,
   `nl-f-employees-transferred`] vs inherited defect
   [`nl-f-hydraulic-stage-problems-1983`,
   `nl-f-pas2000-commercialization-problems-1983`].
2. Public participation [`nl-f-deepuv-coordination`] vs unmeasured funding
   (amounts unknown).
3. Consortium participation [`nl-f-deepuv-participants`] vs unknown roles.
4. Attributed PAS 5500 launch [`nl-f-pas5500-launched-1991`] vs absent original
   specifications.
5. Attributed public-company transition [`nl-f-public-company-listings-1995`]
   vs unknown commercial performance.
6. Strong founding evidence
   [`nl-f-jv-established-1984`…`nl-f-philips-stake-acquisition-1988`] vs weak
   viability evidence — the governing asymmetry.

## 10. Critical evidence gaps, ranked by explanatory leverage

1. **1995 IPO prospectus** — moves customers, commercial performance, Philips
   ownership, IPO terms at once; unblocks Alt 5, partly 6, and M7.
2. **ASML Annual Reports 1993–1995** — the viability series.
3. **Customer evidence** — unblocks Alt 6 (currently zero).
4. **Raaijmakers (2018)** — genealogy and PAS 5500 development; record S3↔S4
   dependence.
5. **Philips board/financing records** — unblocks M4's mechanism and ownership
   questions.
6. **Original PAS 5500 technical papers** — independent specs; M7's basis.
7. **Nationaal Archief 2.06.183 funding files** — M5/Alt 3 magnitude.
8. **Market/competitor data** — Alt 7.

Ranked by model impact, not prestige.

## 11. Minimum evidence for `research → flagship`

Factual questions: a minimal 1993–1995 commercial series; the PAS 5500's
original character and whether it had paying customers; IPO basics (proceeds,
Philips ownership before/after). Mechanisms: at least **two** raised to full
causal-claim standard, at least one covering the viability window. Independent
evidence: at least one non-ASML, non-van-Duijn line for any viability claim.
May remain open: public-funding amounts; DEEP-UV participant weights; the
DEEP-UV→PAS 5500 link (may stay `speculative`). Thesis-blocking: the total
absence of customer evidence and of any commercial-performance figure — while
both are empty, only a founding-scoped thesis is defensible.

## 12. Provisional thesis space (conditional; none selected)

**T1 — Founding-scoped (revised).** **The closest currently testable thesis
direction**, *not* ready for flagship conversion. It could argue that ASML's
founding is best understood as a contingent recombination of Philips's
inherited (and partly problematic) capability under external pressure, with
Philips assuming financial exposure during the crisis. It **still requires**
either (a) independent corroboration concerning the crisis and Philips's role,
or (b) an explicitly narrow interpretive formulation avoiding necessity and
decisive-causation language. Available:
`nl-f-jv-established-1984`…`nl-f-philips-stake-acquisition-1988`. Main
alternative: entrepreneurial recombination (Alt 2). Overclaiming risk: low
*if* necessity language is avoided.

**T2 — Inheritance-plus-network.** If Raaijmakers + DEEP-UV role evidence
arrive. Available: `nl-f-deepuv-participants` participation. Required: roles,
dependency. Alternative: pure inheritance (Alt 1). Risk: moderate.

**T3 — Public-risk-sharing.** If Nationaal Archief funding files arrive.
Available: `nl-f-deepuv-coordination`. Required: amounts, disbursement,
counterfactual. Alternative: parent financial assumption (M4/Alt 1). Risk:
high.

**T4 — Platform-transition.** If prospectus + ARs + technical papers arrive.
Available: `nl-f-pas5500-launched-1991` (attributed). Required: specs,
customers, sales, ownership. Alternative: customer learning/market timing (Alt
6/7). Risk: high.

Case remains **`research`**.

## 13. UI-ready material

**Safe to build now:** factual/chronological timeline from the seventeen
Claims (dense founding, sparse later); source cards for the five Sources;
evidence-status/epistemic-label explanations; the three research questions;
open-question panels.

**Build as explicitly provisional (visible uncertainty markers):**
technology-genealogy view with production nodes only
(`nl-f-hydraulic-stage-problems-1983`/`nl-f-pas2000-commercialization-problems-1983`,
`nl-f-deepuv-objective`/`nl-f-deepuv-reported-results`,
`nl-f-pas5500-launched-1991`) and PAS 2400/2500 shown as clearly-tagged
`research-dossier context`; edges labelled succession/shared-feature/speculative,
never "transfer"; alternative-explanation cards (all seven, competing, mostly
under-evidenced); DEEP-UV participation view (participation, not dependency);
attributed PAS 5500 and IPO statements with "ASML states…" framing.

**Do not build yet:** any commercial-performance chart; any customer view; any
mechanism/causal diagram asserting linkage; any "how ASML succeeded" narrative;
any DEEP-UV→PAS 5500 arrow; any thesis panel; any demand-conditions content.

## 14. Recommended next step

**Primary: begin the research-status Netherlands UI** using only the "safe to
build now" and "explicitly provisional" material above — the seventeen-Claim
timeline, source cards, epistemic-label system, research questions, the
provisional genealogy and alternative-explanation cards, all with visible
uncertainty. This ships something honest and real now, and it exercises the
whole evidence-to-display pipeline on genuinely strong founding-era material
without waiting on retrieval.

**Fallback / parallel track: continue prospectus and annual-report retrieval
later as a separate evidence-upgrade track** — the §10 gap ranking (prospectus,
then 1993–95 annual reports) feeding future Claims that can extend the case
beyond 1988 when and if they arrive.

Reconciliation status: the provisional S-1…S-17 slots have been replaced with
the real production Claim IDs and verified against the production Claims file;
the two attributed Claims (`nl-f-pas5500-launched-1991`,
`nl-f-public-company-listings-1995`) carry their "ASML states…" framing and
subject-authored limitation in the corpus. Neither changes the analysis; both
were required for traceability.

Stopping here: no new research, no TypeScript, no causal Claims, no thesis
Claim, no flagship recommendation.
