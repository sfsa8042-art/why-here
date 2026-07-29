/**
 * IndustryGlyph — a tiny inline SVG symbol per industry. Pure CSS/SVG, no
 * external media, no rights concerns. Decorative + labelled via aria-hidden;
 * the industry is always also present as text next to it.
 */

import type { ReactNode } from 'react';

const PATHS: Record<string, { view: string; body: ReactNode }> = {
  'Semiconductor equipment': {
    view: '0 0 24 24',
    body: (
      <>
        <rect x="7" y="7" width="10" height="10" rx="1.5" />
        <path d="M10 4v3M14 4v3M10 17v3M14 17v3M4 10h3M4 14h3M17 10h3M17 14h3" />
      </>
    ),
  },
  'Semiconductor manufacturing': {
    view: '0 0 24 24',
    body: (
      <>
        <circle cx="12" cy="12" r="4.5" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M6 18l2-2" />
      </>
    ),
  },
  Luxury: {
    view: '0 0 24 24',
    body: (
      <>
        <path d="M6 9h12l-6 11zM6 9l2-4h8l2 4M9 9l3 11M15 9l-3 11" />
      </>
    ),
  },
};

const FALLBACK = {
  view: '0 0 24 24',
  body: <circle cx="12" cy="12" r="6" />,
};

export function IndustryGlyph({ industry, large = false }: { industry: string; large?: boolean }) {
  const glyph = PATHS[industry] ?? FALLBACK;
  const size = large ? 40 : 22;
  return (
    <svg
      className={`industry-glyph${large ? ' industry-glyph-lg' : ''}`}
      width={size}
      height={size}
      viewBox={glyph.view}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {glyph.body}
    </svg>
  );
}
