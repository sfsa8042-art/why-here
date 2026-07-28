/**
 * Copy MapLibre's ESM worker + its shared sibling into /public.
 *
 * MapLibre v6 loads a module Web Worker at runtime from a URL derived relative
 * to its own bundle chunk. Next.js does not emit that worker with a resolvable
 * `./maplibre-gl-shared.mjs` sibling, so the default worker 404s and silently
 * never parses vector tiles (the basemap stays blank; `map` never fires `load`).
 * We instead serve the worker + shared module from /public with their original
 * names (so the worker's `./maplibre-gl-shared.mjs` import resolves) and point
 * MapLibre at `/maplibre-gl-worker.mjs` via `maplibregl.setWorkerUrl(...)`.
 *
 * Runs on predev/prebuild so the copies always match the pinned maplibre-gl.
 */
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'node_modules', 'maplibre-gl', 'dist');
const publicDir = join(root, 'public');
mkdirSync(publicDir, { recursive: true });

const files = ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs'];
for (const f of files) {
  copyFileSync(join(dist, f), join(publicDir, f));
  console.log(`copy-maplibre-worker: public/${f}`);
}
