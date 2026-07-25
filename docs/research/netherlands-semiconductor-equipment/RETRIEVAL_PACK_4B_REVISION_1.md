Inspecting the newly identified filing before recording anything from it.A discrepancy surfaced: the accession you gave (`…18-000008`) indexes as a **6-K**, while the 20-F carrying `a2017integratedreportbased.htm` appears under `…18-000007`. Fetching the document to verify the section directly.Filing type resolved: accession `…18-000008` is a **Form 6-K**, and `a2017integratedreportbased.htm` is **Exhibit 99.1** to it, not a 20-F document. Now fetching the exhibit itself to verify the "A short company history" section.The passage is verified verbatim from the SEC-hosted exhibit. One correction to your filing metadata, and the three candidates.

# Retrieval Pack 4B — Revision 1

## 1. Revised source ledger entry

**S14 — ASML Integrated Report 2017**

| Field | Value |
|---|---|
| Issuer | ASML Holding N.V. |
| Document | *ASML Integrated Report 2017*, `a2017integratedreportbased.htm` |
| **Filing type** | **Form 6-K** (not 20-F — see correction below); the report is **Exhibit 99.1** to that 6-K |
| Accession | `0000937966-18-000008` |
| Filed | 7 February 2018; period of report 7 February 2018 |
| File No. / Film No. | 001-33463 / 18579195 |
| Section | **"A short company history"**, report page 8 |
| URL | `https://www.sec.gov/Archives/edgar/data/937966/000093796618000008/a2017integratedreportbased.htm` |
| Direct inspection | **Yes** — index inspected in full; the "short company history" passage verified verbatim from the SEC-hosted exhibit |
| `sourceType` | `documentary` |
| `temporalRelation` | `retrospective` |
| `subjectRelationship` | `subject_authored` |

**Filing-type correction.** Your brief specified Form 20-F. The EDGAR index for accession `0000937966-18-000008` shows **Form 6-K**, with `a2017integratedreportbased.htm` as **EX-99.1** (5,733,863 bytes), alongside `form6-kannualreports2017.htm` (the 6-K itself) and `pressreleasetext.htm` (EX-99.2). The FY2017 20-F is a **separate accession, `0000937966-18-000007`**, which also contains a document of the same filename. Because the corpus requires exact locators, I've recorded what I inspected: the 6-K exhibit. If you prefer the 20-F as the canonical locator, the `…-000007` accession should be inspected before the citation is finalised — the two are distinct filings and must not be conflated.

**Verified passage (paraphrase).** The section states that in 1991 ASML launched the PAS 5500, which it describes as having become a major success and as remaining in use; that after incorporating as ASM Lithography Holding N.V. in the Netherlands on 3 October 1994, ASML became a public company in 1995 with listings on NASDAQ and Euronext Amsterdam.

## 2. The three factual candidates

**NL4B-F-001 — PAS 5500 launch**
> ASML states that it launched the PAS 5500 in 1991.

**NL4B-F-002 — holding-company incorporation**
> ASM Lithography Holding N.V. was incorporated in the Netherlands on 3 October 1994 to serve as the holding company for ASML's worldwide operations.

**NL4B-F-003 — public-company transition**
> ASML states that it became a public company in 1995, with listings on Nasdaq and the Amsterdam stock exchange.

## 3. Citation locators and notes

All three: **S14**, Integrated Report 2017, section "A short company history", report page 8; accession `0000937966-18-000008`, EX-99.1.

**Citation note (attaches to NL4B-F-003):** the 2017 report retrospectively uses the label "Euronext Amsterdam." This candidate does not assert that an exchange under that name existed in 1995; Euronext was formed later, so the historical entity is recorded neutrally as "the Amsterdam stock exchange."

**Citation note (NL4B-F-001):** the source additionally characterises the PAS 5500 as "a major success." That evaluative characterisation is **excluded** from the claim; only the launch year is carried.

**Citation note (NL4B-F-002):** an identical statement appears in ASML's FY2013 Form 20-F, accession `0001193125-14-046822`, Item 4.A, which I inspected in the prior pack. Per instruction, S14 is the main locator and no duplicate claim is created; the 20-F is recorded as a corroborating locator within the same subject-authored line.

## 4. Evidence ceilings

All three: **`well_supported`**. None may reach `established`.

Reason: each is an official document filed with the SEC, but the statements are **retrospective and subject-authored** — ASML's own account written more than twenty years after the events. Under the corpus rules, a factual claim reaching `established` requires either a contemporaneous primary source or two mutually independent supporting sources. Neither condition is met: the 2017 report, the 2013 20-F, and the corporate history page are all one dependent line.

## 5. What each claim establishes

- **NL4B-F-001** — that ASML, in an official SEC-filed report, dates the PAS 5500 launch to 1991. It establishes the *company's stated launch year*, attributed.
- **NL4B-F-002** — the incorporation date and stated purpose of the holding company. This is a documentary fact about corporate structure that ASML is well positioned to state accurately about itself, and it corroborates the entity named in the 1995 SC 13D filings.
- **NL4B-F-003** — that ASML states it became a public company in 1995 with listings on two named markets. It establishes the *company's stated transition year and dual-listing structure*, attributed.

## 6. What each claim does not establish

**NL4B-F-001 does not establish:** any original PAS 5500 specification (wavelength, NA, resolution, overlay, stage technology, wafer size); the development start or first completion; commercial success or unit sales; any customer effect; any connection to DEEP-UV or ESPRIT; that the platform was a "breakthrough" in any objective sense. No specification may be imported from later PAS 5500 variants (/60 through /1150).

**NL4B-F-002 does not establish:** the reason for creating the holding structure; any relationship to IPO preparation; Philips's role in the reorganisation; the pre-existing corporate structure it replaced.

**NL4B-F-003 does not establish:** the exact IPO date; offering terms; underwriters; proceeds; shares offered; valuation; Philips's ownership before or after; that both listings began on the same date; or that 1995 marked legal independence from Philips. The claim is explicitly **not** framed as a date of independence from Philips.

## 7. Duplicate-source and dependence treatment

- **No duplicate claim** for the incorporation date. NL4B-F-002 replaces the prior 2013-20-F-sourced candidate; the 2013 20-F becomes a corroborating locator, not a separate claim.
- **Recorded, not treated as independent evidence:** ASML Integrated Report 2018 (repeats the same short company history) and ASML Annual Report 2022 (again states the 1991 PAS 5500 launch). **No separate Source records created** — no clear future citation need, and creating them would inflate apparent corroboration.
- **Dependence rule applied:** S14, the 2013 20-F, the 2018 report, the 2022 report, and asml.com's history page constitute **one subject-authored evidence line**. Repetition across corporate publications is not corroboration. Any future independence test must treat them as a single source for the purpose of the two-independent-sources requirement.
- Note for the record: the corporate history page and several aggregators add material the SEC filing does not support (e.g. "breakthrough platform," Philips selling half its shares at the IPO, specific customers). None of that enters the corpus.

## 8. Readiness for limited production conversion

**Yes — all three, at `well_supported`, with attribution preserved and the limitation attached.**

They meet the threshold because they materially advance two of the named areas: **PAS 5500** (a dated launch anchor, previously entirely absent) and **IPO terms** (the transition year and dual-listing structure, previously resting only on van Duijn's secondary account of proceeds). NL4B-F-002 additionally documents the corporate-structure step that the 1995 securities filings presuppose.

Each must carry:
1. the exact S14 locator (accession, exhibit, section, page 8);
2. the classification triple `documentary / retrospective / subject_authored`;
3. a limitation claim stating that all such statements derive from a single subject-authored line and are not independently corroborated;
4. for NL4B-F-003, the Euronext-label citation note.

The attribution phrasing in F-001 and F-003 ("ASML states that…") is load-bearing and should not be edited away during conversion.

## 9. Remaining evidence gaps

**PAS 5500** — original specifications; development start and completion; reliability and production problems; units shipped before the 1995 IPO; any evidenced relationship to DEEP-UV or ESPRIT. *(The DEEP-UV → PAS 5500 edge remains speculative and unevidenced.)*

**Customers** — nothing verified for 1991–1995. No evaluation, trial, order, shipment, installation, repeat or volume order for any named manufacturer. Aggregator claims naming IBM, Micron, AMD and others are excluded.

**Commercial performance** — no revenue, losses, backlog, shipments, installed base, market share, geographic sales, or service-organisation data for 1993–1995.

**Philips financing and ownership** — post-1988 instruments; the reported 1992 support; debt versus equity; ownership immediately before and after the IPO; the reasons Philips accepted dilution.

**IPO terms** — exact date; underwriters; shares offered; proceeds; use of proceeds; valuation; whether the two listings were simultaneous.

**Early-20-F route, corrected:** recorded as less productive than I previously suggested. The SEC issuer page shows filings beginning May 1995; the FY2001 20-F filed in 2002 is an auto-generated paper-document record without report content; **no complete electronic ASML 20-F for 1996–2000 has been inspected**, and none should be described as available until directly located. No further broad retrieval pass on this route.

The decisive remaining documents are unchanged: the **1995 prospectus or listing memorandum** and the **ASML Annual Reports 1993–1995**, via the Dutch routes (Euronext/AFM/KB/Erasmus/Tilburg) or SEC public reference for paper filings.

Stopping here: no causal claims, no thesis, no TypeScript.