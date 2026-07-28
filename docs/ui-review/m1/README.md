# M1 — Interactive Atlas Foundation (review record)

This documents the **M1 technical foundation**: an interactive MapLibre atlas for the
Netherlands × Semiconductor-Equipment case, layered over the existing research corpus.

> **Status:** M1 is a **technical foundation**, not the final public interface. The
> product direction (multi-case atlas, visual storytelling for ordinary visitors) is
> specified separately in [`../../product/PUBLIC_ATLAS_V2.md`](../../product/PUBLIC_ATLAS_V2.md).

## What M1 delivers

- `/cases/netherlands-semiconductor-equipment/atlas` — MapLibre dark basemap
  (OpenFreeMap), two verified city anchors (Veldhoven, Eindhoven) as markers, a control
  rail (evidence filter + phase filter), a 17-event timeline, and an evidence drawer that
  reuses the research citation components.
- The existing research route is unchanged and links to the atlas.
- Pure, unit-tested logic: view-model, atlas reducer, phase membership (many-to-many),
  map-lifecycle state machine (**209 tests**).

## Map-loading fix (diagnosed on a temporary `map-debug` harness, since removed)

The basemap initially rendered blank in every browser. A three-mode isolation harness
(Mode A inline/no-network, Mode B MapLibre demo style, Mode C OpenFreeMap) established:

- **Mode A proved that MapLibre v6, WebGL and the basic component/container integration
  worked. Successful Modes B and C after the worker-URL fix proved that the vector worker
  pipeline worked.**
- Root cause: **MapLibre v6's ESM module Web Worker is not resolvable in the Next.js
  build** — its `./maplibre-gl-shared.mjs` import 404s, so the worker silently never
  parses vector tiles (`load` never fires; tiles stuck `loading`; 7 worker requests never
  resolve). Network/ORB/Kaspersky were ruled out (the TileJSON *and* a 330 KB `.pbf` tile
  fetch fine from both the main thread and a Web Worker).
- Fix: serve the worker + shared module from `/public` (original names, so the worker's
  relative import resolves) via `scripts/copy-maplibre-worker.mjs` (pre-dev/pre-build,
  gitignored output), and `maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs')` in
  `AtlasMap`. A second CSS fix gave `.atlas-map-canvas` a real height (it was collapsing
  to MapLibre's 300 px fallback).

## Verified screenshots

Final, real-tile screenshots from the clean production build are in
[`final/`](final/) — captured in headless Chrome 150 on an RTX 3060, verified with
`map.loaded()==true`, `map.areTilesLoaded()==true`, 2 markers, canvas height == stage
height, attribution visible, no slow overlay, no horizontal overflow:

| File | State |
|---|---|
| `atlas-desktop-default.png` | Full basemap, both markers, no drawer (1440×1000) |
| `atlas-desktop-veldhoven.png` | Veldhoven active → drawer, `nl-f-deepuv-coordination` + CORDIS citation + locator |
| `atlas-desktop-eindhoven.png` | Eindhoven active → drawer, `nl-f-deepuv-participants` |
| `atlas-desktop-non-mappable.png` | Non-mappable claim → "No verified geographic anchor in the current evidence."; neither marker active |
| `atlas-desktop-founding-phase.png` | Founding phase → both markers hidden, zero-anchor note, out-of-phase ticks dimmed |
| `atlas-desktop-1988-1991.png` | Technological development → both markers visible, in-phase ticks lit |
| `atlas-mobile-map.png` | Mobile Map tab, both markers, no horizontal overflow (390×844) |
| `atlas-mobile-evidence.png` | Mobile Evidence pane, drawer wraps correctly |
| `research-page-desktop.png` | Research route, no regression, "Open interactive atlas" link |

### Known minor defects (mobile, cosmetic — not yet fixed)

- Mobile Map view: the sparse-map annotation overlaps the MapLibre attribution strip
  (attribution + its ⓘ control remain present/accessible).
- Mobile Evidence pane: the drawer visually overlaps the rail's "FILTER" heading beneath
  it (content readable; no functional impact).
