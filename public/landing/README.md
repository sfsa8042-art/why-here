# Landing map asset

`atlas-world.webp` is the hero background on `/` — a **static, optimised snapshot
of the real production atlas map** (`/atlas` in its neutral initial state). It is
not a hand-drawn or third-party silhouette; it is the same OpenFreeMap /
OpenStreetMap basemap the live atlas renders, so the landing shares the product's
exact visual language. The OpenFreeMap / OpenMapTiles / OpenStreetMap attribution
is baked into the bottom-right of the image and is shown on the landing.

## Current asset
- Source: `/atlas` neutral map, captured at 2560×1440 (device-scale 1).
- Cropped to the map surface only (`.atlas9-stage`) — no country panel, no atlas
  header. The atlas markers, the "Select a country" hint, the map legend and the
  zoom control were hidden before capture; the tile labels and attribution remain.
- Zoomed out ~3 wheel steps so the three case countries (Netherlands, France,
  Taiwan) sit in a band the hero text can sit beside (Europe ≈ 22–25%, Taiwan ≈
  79% of the image width).
- Encoded directly as WebP (quality 82). Result: **2560×1281, ~199 KB.**

## How to refresh it
1. Run the app and open `/atlas`; let the map load (all three markers visible).
2. Via CDP (headless Chrome, `--remote-debugging-port`), or by hand:
   - optionally zoom the map out a few steps so Europe/Taiwan aren't at the far
     edges;
   - measure each `.atlas-nav-marker` centre as a % of `.atlas9-stage` (used to
     place the HTML country overlays in `app/page.tsx`);
   - hide `.atlas-nav-marker`, `.atlas9-hint`, `.atlas9-legend`,
     `.maplibregl-ctrl-top-right`;
   - `Page.captureScreenshot` with `format: "webp"`, `quality: 82`, clipped to the
     `.atlas9-stage` rect; write the bytes to `public/landing/atlas-world.webp`.
3. If the marker positions shift, update the `SIGNALS` x/y percentages in
   `app/page.tsx` and the hero gradient stops in `app/globals.css`.

The reference capture script used for this asset lives in the review scratchpad
(`mapshot.mjs`); it is not part of the app.
