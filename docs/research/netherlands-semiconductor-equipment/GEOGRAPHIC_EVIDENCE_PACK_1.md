# Geographic Evidence Pack 1 — Dossier
## Netherlands × Semiconductor Equipment

> Increment M0 geographic foundation. This dossier records the only two
> geographic anchors currently defensible from the production corpus, using
> **real production identifiers** (no provisional slots). It corrects the
> earlier over-classification and states the limitations that cap what these
> anchors may claim.

## 1. Governing distinction

A real **city location**, a **company registered/postal address**, and the
**physical location of a historical event or activity** are three different
assertions. The CORDIS record establishes only the **addresses recorded for
project organisations** in a European project database. It does **not**
establish headquarters, research activity at that address, production activity
at that address, the physical location of all DEEP-UV work, the location of the
1984 founding, or the location of PAS 5500 development or launch.

Accordingly the two anchors below are typed as **address records**, not as
operating, research, production, event, or founding locations.

## 2. Source

Both anchors derive from a **single** production Source and a **single**
project — they are not two independent geographic lines:

- Source: `nl-src-cordis-deepuv-2048` (CORDIS project record, grant agreement
  2048; official EU record, directly inspected).

## 3. The two anchors

### Anchor A — Veldhoven (coordinator address)

- Claim: `nl-f-deepuv-coordination`
- Relationship: **`project_coordinator_address`**
- Evidence: CORDIS **Coordinator** block —
  `ASM LITHOGRAPHY` at `"MEIERIJWEG 15, 8805 5503 HN VELDHOVEN Netherlands"`.
- Temporal scope: 1988–1991 (the project period).
- Maximum defensible precision: **city** (Veldhoven), never the street
  (Meierijweg 15) and never a site.
- What it establishes: that the CORDIS record lists the project **coordinator**
  ASM Lithography at a Veldhoven postal address.
- What it does **not** establish: that DEEP-UV coordination activity — or any
  other historical activity — physically occurred in Veldhoven.

### Anchor B — Eindhoven (participant address)

- Claim: `nl-f-deepuv-participants`
- Relationship: **`project_participant_address`**
- Evidence: CORDIS **Participants** block —
  `NEDERLANDSE PHILIPS BEDRIJVEN BV` at `"KASTANJELAAN, 1218 5600 MD EINDHOVEN"`.
- Temporal scope: 1988–1991 (the project period).
- Maximum defensible precision: **city** (Eindhoven), never the street
  (Kastanjelaan) and never a site.
- What it establishes: that the CORDIS record lists the **participant**
  Nederlandse Philips Bedrijven BV at an Eindhoven postal address.
- What it does **not** establish: a Philips lithography research site, the
  physical location of DEEP-UV work, or the location of the 1984 founding.

## 4. Coordinates (city-level, attributable)

Each value is a **representative city coordinate** (a city-level gazetteer
point), NOT a geographic centroid — the source does not state a centroid — and
NOT the recorded street address.

| Place | Longitude | Latitude | Precision | Coordinate source (URL · page title · accessed) | Attribution |
|---|---|---|---|---|---|
| Veldhoven | 5.40500 | 51.42000 | city | https://en.wikipedia.org/wiki/Veldhoven · page "Veldhoven" · infobox coordinates · accessed 2026-07-27 | Coordinates via Wikipedia contributors, CC BY-SA 4.0 |
| Eindhoven | 5.483 | 51.433 | city | https://en.wikipedia.org/wiki/Eindhoven · page "Eindhoven" · infobox coordinates · accessed 2026-07-27 | Coordinates via Wikipedia contributors, CC BY-SA 4.0 |

No runtime geocoding: coordinates are static, sourced and attributed. Values
are unchanged from the inspected source.

## 5. Limitations (recorded explicitly)

1. **Database curation.** The CORDIS address block may include later database
   curation; it is a project-record field, not a contemporaneous 1988–1991
   document, and its address fields may not reflect the address as it stood
   during the project.
2. **Postcode anomaly.** The Veldhoven coordinator postcode field reads
   `"8805 5503 HN"` — an anomalous `8805` prefix precedes the valid Dutch
   postcode `5503 HN`. (The Eindhoven field shows a similar `1218` prefix
   before `5600 MD`.) These are treated as data artefacts and are not
   interpreted.
3. **City precision only.** Both links are capped at **city** precision. The
   recorded street addresses (Meierijweg 15; Kastanjelaan) are not rendered as
   site-level pins.
4. **Single-source, single-project dependence.** Both anchors derive from the
   **same Source** (`nl-src-cordis-deepuv-2048`) and the **same project**; they
   are not mutually independent geographic corroboration.
5. **Address ≠ activity.** Neither anchor is evidence for headquarters,
   research, production, an event, the founding, or PAS 5500 work.

## 6. Result

**`Limited map-ready`** — two city-level address anchors (Veldhoven coordinator,
Eindhoven participant), both from one CORDIS record, both capped at city
precision. This is a limited geographic foothold, **not** a complete geographic
explanation of the case. Every other Claim in the corpus remains
**non-mappable** (no located geographic evidence).
