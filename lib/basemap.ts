/**
 * Basemap configuration (M1) — single source of truth for the atlas basemap.
 *
 * A hosted, TOKEN-FREE OpenFreeMap vector style is used for this prototype.
 * OpenFreeMap lists "Dark" among its official default styles and documents the
 * style-URL pattern `https://tiles.openfreemap.org/styles/{name}`. Attribution
 * is required and shown (MapLibre also adds it automatically).
 *
 * This module is deliberately the ONLY place the style URL and attribution
 * live, so the basemap can later be swapped for a self-hosted PMTiles source
 * without touching any map component.
 *
 * NOTE: this is a hosted style fetched at runtime — it is NOT offline. Tiles
 * are not downloaded or committed.
 */

export interface BasemapConfig {
  /** MapLibre style URL (token-free). */
  styleUrl: string;
  /** Human-readable style name. */
  name: string;
  /** Attribution HTML shown in the map's attribution control. */
  attributionHtml: string;
  /** Plain-text attribution for non-map fallbacks. */
  attributionText: string;
}

export const OPENFREEMAP_DARK: BasemapConfig = {
  styleUrl: 'https://tiles.openfreemap.org/styles/dark',
  name: 'OpenFreeMap Dark',
  attributionHtml:
    '<a href="https://openfreemap.org" target="_blank" rel="noreferrer">OpenFreeMap</a> ' +
    '&copy; <a href="https://www.openmaptiles.org/" target="_blank" rel="noreferrer">OpenMapTiles</a> ' +
    'Data from <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
  attributionText:
    'OpenFreeMap · © OpenMapTiles · Data from OpenStreetMap contributors',
};

/** The basemap the atlas uses. Swap here (single point) for PMTiles later. */
export const ATLAS_BASEMAP: BasemapConfig = OPENFREEMAP_DARK;
