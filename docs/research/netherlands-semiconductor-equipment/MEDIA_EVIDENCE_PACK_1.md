# Netherlands — Media Evidence Pack 1 (research dossier)

> **Purpose:** find visually useful **and legally usable** assets for the Netherlands ×
> Semiconductor-Equipment case, and record exactly why each was accepted or rejected.
> **Status: for legal/factual review — not committed.**

## Method

- Every candidate's licence was verified through the **Wikimedia Commons API**
  (`prop=imageinfo&iiprop=extmetadata`), reading the actual `LicenseShortName`,
  `LicenseUrl`, `Artist`, `DateTimeOriginal`, `AttributionRequired`, and `Restrictions`
  fields on the file page — **not** a search-result thumbnail.
- Only files with a clear per-file **public-domain / CC-BY / CC-BY-SA** licence permitting
  derivative + public-website use were downloaded, to
  `public/media/netherlands-semiconductor-equipment/`, with original filenames preserved.
- **Nothing is fetched or licensed at runtime.** Files are self-hosted local copies.
- **Remote availability was never treated as permission.** Ambiguous or non-reusable
  assets were rejected.
- Every asset in the pack is **present-day context or a general technical illustration** —
  none is claimed as direct historical evidence, and each carries an explicit
  `historicalLimitations` note.

## Coverage vs the requested categories

| Category | Result |
|---|---|
| Eindhoven / regional context | ✅ Eindhoven city centre (2007) |
| Veldhoven / ASML context | ✅ ASML site, Veldhoven (2008) — **cover** |
| Philips ecosystem (Priority B) | ✅ former NatLab building (2017) |
| Technology / equipment | ⚠️ general **diagram** only (step-and-repeat); no clean equipment *photo* found |
| Historical / archival image or primary document | ❌ **gap** — none licence-clear in this search |

## Research table

| Proposed id | Subject | Type | Period shown | Source (Commons) | Creator | Date | Licence | Credit | Public web? | Portfolio? | Proposed role | What it establishes | What it does NOT | Decision |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `nl-media-asml-veldhoven-2008` | ASML site, Veldhoven | facility_photo | present-day | File:20080825_Veldhoven_ASML_DSCF0350.jpg | HHahn | 2008 | CC BY-SA 3.0 | HHahn, CC BY-SA 3.0, via Wikimedia Commons | yes | yes | present_day_context | Where the firm is based today | The 1980s premises / founding | **production_ready (cover)** |
| `nl-media-eindhoven-city-2007` | Eindhoven city centre | city_photo | present-day | File:Binnenstad_Eindhoven.jpg | Robert de Greef | 2007 | CC BY-SA 3.0 | Robert de Greef, CC BY-SA 3.0, via Wikimedia Commons | yes | yes | present_day_context | Regional (Brainport) setting | Any firm/event | **production_ready** |
| `nl-media-natlab-eindhoven-2017` | Former Philips NatLab, Strijp | facility_photo | present-day | File:0772GM0277_Natlab_Eindhoven.jpg | Johan Bakker | 2017 | CC BY-SA 4.0 | Johan Bakker, CC BY-SA 4.0, via Wikimedia Commons | yes | yes | present_day_context | Philips research environment survives | That the case's firms used it | **production_ready** |
| `nl-media-step-repeat-diagram` | Step-and-repeat exposure | diagram | atemporal | File:Step_and_Repeat_DE.svg | Cepheiden | 2010 | CC BY-SA 3.0 | Cepheiden, CC BY-SA 3.0, via Wikimedia Commons | yes | yes | sourced_illustration | The general lithography method | The case's specific machines (labels in German) | **production_ready** |
| — | ASML HQ Veldhoven (alt) | facility_photo | present-day | File:ASML_headquarters_Veldhoven.jpg | A ansems | 2008 | Public domain | (none required) | yes | yes | present_day_context | Same as cover (PD alternative) | — | context_only (not used; CC-BY-SA cover chosen) |
| — | Eindhoven high-rise overview | city_photo | present-day | File:Hoogbouw_Eindhoven_overzicht.jpg | Experience040 / P. Dolmans | 2006 | CC BY 2.5 nl | attribution required | yes | yes | present_day_context | Skyline banner | — | context_only (very low height 1151×250) |
| — | Wafer-track system | product_photo | present-day | File:Wafertraksystem.jpg | (Commons) | — | CC BY-SA 3.0 | — | unclear-relevance | — | sourced_illustration | Generic fab equipment | Not case-specific; no description/date | **rejected** (weak relevance) |
| — | "ASMI Variants/Configuration" | — | — | File:ASMI_Variants.jpg | DRDO/India | 2024 | GODL-India | — | — | — | — | — | **rejected** (Indian Army "Asmi" pistol — false friend, not ASM International) |
| — | "ASM International logo" | — | — | File:ASM_International_logo.svg | — | — | — | — | — | — | — | — | **rejected** (American Society for **Metals**, not ASM Lithography's parent) |
| — | "photo-lithography" manuals | archival_document | 19th–20th c. | multiple IA PDFs | — | — | PD | — | — | — | — | — | **rejected** (historical **printing** lithography, unrelated to semiconductors) |

## Production pack (4 assets — see `content/media/…media.ts`)

All four are CC-BY-SA / open-licence, downloaded locally, credited, and marked present-day
(so none can be labelled historical evidence). The **cover** is the ASML/Veldhoven (2008)
photo, rendered on the Atlas index Netherlands preview and the Evidence header — both label
it **present-day**.

## Honest gaps (for Media Evidence Pack 2)

1. **No licence-clear historical (pre-2000) photograph** of the firms, people, sites, or
   equipment surfaced. Historical Philips/ASML imagery is largely rights-reserved corporate
   or archive material; none had a reusable per-file licence in this search.
2. **No clean actual-equipment photo** of a PAS stepper/scanner. Only a general
   German-labelled *diagram* of the exposure method is licence-clear.
3. **Primary documents** (e.g. the CORDIS DEEP-UV project record already cited as a Source)
   were not captured as media: EU/CORDIS reuse terms must be verified per document, and a
   clean image/PDF capture prepared — deferred to Pack 2.

**Do not** fill these gaps with unlicensed corporate photos, newspaper scans of unknown
rights, watermarked previews, or modern images passed off as historical. A smaller,
legally-clean pack is preferred.
