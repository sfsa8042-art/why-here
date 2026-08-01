# Netherlands — Visual Story Photography Pack (research dossier)

> **Purpose:** add substantially more *real, legally reusable* photography to the visual
> documentary, with every per-file licence verified before download.
> **Status: for legal/factual review — not committed.**

## Method

- Every candidate's licence was verified through the **Wikimedia Commons API**
  (`prop=imageinfo&iiprop=extmetadata`), reading the actual `LicenseShortName`, `LicenseUrl`,
  `Artist`, `DateTimeOriginal`, `AttributionRequired`, `UsageTerms` and `Restrictions` on the
  file page — not a search-result thumbnail.
- Only files with a clear per-file **public-domain / CC0 / CC-BY / CC-BY-SA** licence permitting
  derivative + public-website use were accepted.
- Delivery files are **self-hosted, server-scaled derivatives** fetched via the Wikimedia
  thumbnail API (no upscale, aspect ratio preserved, licence/credit unchanged), stored under
  `public/media/netherlands-semiconductor-equipment/`. Original file URL + dimensions recorded.
- **Remote availability is not permission.** Nothing is fetched at runtime.
- Search order used: Wikimedia Commons → Nationaal Archief/Anefo via Commons → RCE (heritage
  register) via Commons → Bundesarchiv via Commons. (Europeana/CORDIS document imagery was
  searched but no licence-clear, on-topic asset was accepted — see rejected/《gaps》.)

## Classification

`production_ready` = licence-verified, downloaded, wired into the story.
`rejected` = not licence-clear, off-topic, or would misrepresent history.

### production_ready (8 new + 4 existing = 12 total)

| id | subject | role badge | temporal | licence | credit | src |
|---|---|---|---|---|---|---|
| `nl-media-philips-fabrieken-1949` | Philips factories at night, Eindhoven, **1949** | Industrial heritage context | historical | CC0 | Nationaal Archief / Anefo | Commons |
| `nl-media-philips-strijp-1936` | Philips Strijp works, **1936** | Industrial heritage context | historical | Public domain | — | Commons |
| `nl-media-philips-terrein-2008` | Surviving Philips-terrein buildings, 2008 | Industrial heritage context | present-day | CC BY-SA 4.0 | Bert van As / RCE | Commons |
| `nl-media-klokgebouw-2014` | Klokgebouw, Strijp-S, 2014 | Industrial heritage context | present-day | CC BY 2.0 | Peter Beekmans | Commons |
| `nl-media-asml-lens-engineer-2006` | Engineer holding an ASML projection lens, 2006 | Present-day company context | present-day | CC BY-SA 2.0 | The Next Web | Commons |
| `nl-media-microelectronics-1989` | Microelectronics production, Erfurt, **1989** | Historical photograph | historical | CC BY-SA 3.0 de | Bundesarchiv / H. Hirndorf | Commons |
| `nl-media-cleanroom-2009` | Semiconductor cleanroom, 2009 | Technology illustration | present-day | CC BY-SA 3.0 | Yorudun | Commons |
| `nl-media-silicon-wafer` | Silicon wafer | Technology illustration | present-day | CC BY-SA 3.0 | Peellden | Commons |
| `nl-media-eindhoven-city-2007` *(existing)* | Eindhoven city centre, 2007 | Present-day regional context | present-day | CC BY-SA 3.0 | Robert de Greef | Commons |
| `nl-media-asml-veldhoven-2008` *(existing)* | ASML site, Veldhoven, 2008 | Present-day company context | present-day | CC BY-SA 3.0 | HHahn | Commons |
| `nl-media-natlab-eindhoven-2017` *(existing)* | Former Philips NatLab, 2017 | Industrial heritage context | present-day | CC BY-SA 4.0 | Johan Bakker | Commons |
| `nl-media-step-repeat-diagram` *(existing)* | Step-and-repeat schematic | Technology illustration | timeless | CC BY-SA 3.0 | Cepheiden | Commons |

Each asset records: exact source page, original file URL + dimensions, delivered dimensions,
derivative transform, creator, dates, licence name/URL, rights holder, required credit,
public-website + portfolio + derivative permission, temporal context, presentation role and
`historicalLimitations` (see `content/media/netherlands-semiconductor-equipment.media.ts`).

### rejected candidates (documented)

| candidate | reason |
|---|---|
| `File:Strijp-s 1979.jpg` | Filename says "1979" but the file's `DateTimeOriginal` is **2012** — using it would misdate a present-day photo; rejected to avoid historical misrepresentation. |
| `File:Asml monopoly.jpg`, ASML logos, EUV roadmap charts | Marketing/branding or chart imagery; would turn the piece into an ASML corporate page — not documentary photography. |
| ASML corporate press/EUV photos on asml.com | Corporate imagery **without explicit reuse terms**; requires_permission — not used. |
| Europeana / CORDIS document scans | No licence-clear, on-topic ESPRIT/DEEP-UV document image was found with explicit reuse rights; **left as an honest gap** rather than using an unknown-rights scan. |
| Google Images / Pinterest results | Aggregator thumbnails, not verifiable source pages — never used. |

## Historical honesty

- The **1949** and **1936** Philips photos and the **1989** microelectronics photo are genuine
  historical images, but they **predate or sit outside the case**: the Philips photos are
  industrial *heritage* decades before 1984, and the 1989 photo is a **different company and
  country** shown only as period-compatible technology context. Their captions, presentation-role
  badges and `historicalLimitations` say so explicitly.
- No present-day image is allowed to imply it depicts the 1984 founding, the PAS 2000 crisis,
  DEEP-UV work, the original PAS 5500, or the 1995 IPO. A new **M23** validation rule enforces
  that a "Historical photograph" badge requires `temporalContext: 'historical'`, and a
  present-day badge requires `temporalContext: 'present_day'`.
- Where no period-correct image of the case's own firms/events exists, the story states that
  honestly rather than substituting a look-alike.

## Public-Explore blocking (unchanged, enforced by M-series)

Restricted / unknown-rights / `permittedForPublicWebsite:false` / missing credit / missing
source / missing alt / missing local file are all build-blocking and can never render.
