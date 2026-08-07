# Taiwan × Advanced Semiconductor Foundry Manufacturing — Geographic Evidence (Stage 11A)

Three evidence **Places** and four **ClaimPlaceLinks**. Evidence geography is **separate**
from the Atlas navigation marker (`content/atlas/cases.ts`), which is a locate-and-open device,
not evidence. Each place carries an honest precision matching what the source supports; no
representative country coordinate is used as evidence for an event.

## Places
| ID | Name | Kind / precision | Geometry source | Why it exists |
|----|------|------------------|-----------------|---------------|
| `tw-place-hsinchu` | Hsinchu | city / point | Wikipedia gazetteer (CC BY-SA) 24.8036, 120.9686 | Science Park location; TSMC registered office |
| `tw-place-new-jersey` | New Jersey | region / admin_area (US-NJ) | Natural Earth Admin-1 (PD) | RCA IC-design training team (state-level only) |
| `tw-place-taiwan` | Taiwan | country / admin_area (TW) | Natural Earth Admin-0 (PD) | ERSO national research scope |

Hsinchu is a **city-level gazetteer point**, not a Science-Park boundary/centroid and not
TSMC's street address. New Jersey is a **region** because the source names only the US state.
Taiwan is used **only** for a nation-scoped administrative relationship.

## ClaimPlaceLinks
| ID | Claim | Place | Relationship | Precision | Note |
|----|-------|-------|--------------|-----------|------|
| `tw-cpl-park-hsinchu` | `tw-f-hsinchu-park-1980` | Hsinchu | event_location | city | park located in Hsinchu (Saxenian p.8) |
| `tw-cpl-tsmc-hq-hsinchu` | `tw-f-tsmc-hq-hsinchu` | Hsinchu | organization_registered_address | city | **address record**, not an activity site (TSMC 20-F) |
| `tw-cpl-rca-training-nj` | `tw-f-rca-trainees` | New Jersey | event_location | region | named NJ design team only (ITRI) |
| `tw-cpl-erso-taiwan-scope` | `tw-f-erso-created-1974` | Taiwan | administrative_scope | country | national research scope, not a pinpoint |

## Discipline
- The TSMC office is an **address record** (`organization_registered_address`), capped at city
  precision — never presented as where founding or manufacturing physically happened.
- No link claims **site** precision (so no site-provenance note is required).
- Each link cites the exact Citation on its own Claim (validator G8/G9), and its status never
  exceeds the linked Claim's (G10).
