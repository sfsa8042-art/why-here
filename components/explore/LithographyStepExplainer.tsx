'use client';

import { useId, useState } from 'react';

/**
 * LithographyStepExplainer — a plain-language, interactive explainer of what a
 * lithography machine does: an ultra-precise projector sends a circuit pattern
 * through a MASK and a stack of LENSES onto a light-sensitive WAFER, which then
 * moves so the exposure repeats field by field.
 *
 * One continuous, self-drawn SVG path (light → mask → lenses → wafer) with a
 * visible beam and a wafer exposure grid. Selecting a step (click / arrow keys)
 * emphasises the relevant object; the static state is fully understandable, and
 * motion is CSS-only and disabled under `prefers-reduced-motion`. Not a specific
 * proprietary machine — a simplified illustration (labelled as such).
 */

const STEPS = [
  { key: 'light', n: 1, title: 'Light', body: 'A controlled light source begins the exposure.' },
  { key: 'mask', n: 2, title: 'Mask', body: 'The mask carries the circuit pattern to be printed.' },
  { key: 'lenses', n: 3, title: 'Lenses', body: 'The optical system shrinks and focuses the pattern.' },
  { key: 'wafer', n: 4, title: 'Wafer', body: 'The wafer moves and the exposure repeats field by field.' },
] as const;
type StepKey = (typeof STEPS)[number]['key'];

/** Wafer exposure fields; one is highlighted as the "current" exposure. */
function WaferFields() {
  const cells: { x: number; y: number; active: boolean }[] = [];
  const cols = 6, rows = 5, size = 15, gap = 3, x0 = 8, y0 = 8;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = c - (cols - 1) / 2, cy = r - (rows - 1) / 2;
      if (cx * cx + cy * cy > 8.6) continue; // round the grid into a wafer
      cells.push({ x: x0 + c * (size + gap), y: y0 + r * (size + gap), active: r === 2 && c === 3 });
    }
  }
  return (
    <g className="lse-fields">
      {cells.map((cell, i) => (
        <rect key={i} className={`lse-field${cell.active ? ' is-exposing' : ''}`} x={cell.x} y={cell.y} width={size} height={size} rx={2} />
      ))}
    </g>
  );
}

export function LithographyStepExplainer() {
  const [active, setActive] = useState<StepKey>('light');
  const descId = useId();

  const onKey = (e: React.KeyboardEvent): void => {
    const idx = STEPS.findIndex((s) => s.key === active);
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); setActive(STEPS[Math.min(idx + 1, STEPS.length - 1)]!.key); }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); setActive(STEPS[Math.max(idx - 1, 0)]!.key); }
  };

  return (
    <div className={`lse lse--${active}`}>
      <p id={descId} className="sr-only">
        A lithography machine works like an ultra-precise projector. A controlled light source shines
        through a mask carrying a circuit pattern; a stack of lenses shrinks and focuses that pattern
        onto a silicon wafer; the wafer then moves so the exposure repeats field by field. Simplified
        illustration.
      </p>

      {/* Steps — selectable (click / arrow keys) */}
      <ol className="lse-steps" aria-label="Steps a lithography machine performs" onKeyDown={onKey}>
        {STEPS.map((s) => (
          <li key={s.key}>
            <button
              type="button"
              className="lse-step"
              aria-current={active === s.key ? 'step' : undefined}
              onClick={() => setActive(s.key)}
              onMouseEnter={() => setActive(s.key)}
            >
              <span className="lse-step-n">{s.n}</span>
              <span className="lse-step-text">
                <span className="lse-step-title">{s.title}</span>
                <span className="lse-step-body">{s.body}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>

      {/* Visual — one continuous path from light to wafer */}
      <div className="lse-visual">
        <svg className="lse-svg" viewBox="0 0 340 470" xmlns="http://www.w3.org/2000/svg" role="img" aria-describedby={descId} aria-label="Cross-section of a lithography exposure: light, mask, lenses and wafer">
          {/* 1 — LIGHT */}
          <g className="lse-o lse-o-light">
            <circle className="lse-lamp" cx="170" cy="34" r="16" />
            <g className="lse-rays" aria-hidden="true">
              <line x1="170" y1="6" x2="170" y2="14" /><line x1="146" y1="14" x2="151" y2="20" /><line x1="194" y1="14" x2="189" y2="20" />
            </g>
            <path className="lse-beam lse-beam-top" d="M156 46 L184 46 L214 96 L126 96 Z" />
            <text className="lse-label" x="248" y="40" aria-hidden="true">Light</text>
          </g>
          {/* 2 — MASK (patterned) */}
          <g className="lse-o lse-o-mask">
            <rect className="lse-mask-bar" x="118" y="96" width="104" height="22" rx="3" />
            <g className="lse-mask-pat" aria-hidden="true">
              <rect x="126" y="101" width="7" height="12" /><rect x="139" y="101" width="4" height="12" />
              <rect x="149" y="101" width="9" height="6" /><rect x="164" y="101" width="5" height="12" />
              <rect x="175" y="101" width="8" height="12" /><rect x="189" y="107" width="10" height="6" />
              <rect x="205" y="101" width="6" height="12" />
            </g>
            <text className="lse-label" x="248" y="112" aria-hidden="true">Mask</text>
          </g>
          {/* 3 — LENS STACK */}
          <g className="lse-o lse-o-lenses">
            <path className="lse-cone" d="M126 118 L214 118 L188 150 L152 150 Z" />
            <ellipse className="lse-lens" cx="170" cy="156" rx="52" ry="13" />
            <ellipse className="lse-lens" cx="170" cy="186" rx="44" ry="12" />
            <ellipse className="lse-lens" cx="170" cy="214" rx="34" ry="10" />
            <path className="lse-cone lse-cone-narrow" d="M140 222 L200 222 L182 300 L158 300 Z" />
            <text className="lse-label" x="248" y="190" aria-hidden="true">Lenses</text>
          </g>
          {/* 4 — WAFER + repeat */}
          <g className="lse-o lse-o-wafer" transform="translate(90 300)">
            <ellipse className="lse-wafer-disc" cx="80" cy="66" rx="88" ry="60" />
            <WaferFields />
            <g className="lse-repeat" aria-hidden="true">
              <path className="lse-arrow" d="M92 66 h26" /><path className="lse-arrow" d="M114 61 l6 5 l-6 5" />
            </g>
            <text className="lse-label" x="176" y="70" aria-hidden="true">Wafer</text>
          </g>
        </svg>
        <p className="lse-disclaimer">Simplified illustration — not a specific machine.</p>
      </div>
    </div>
  );
}
