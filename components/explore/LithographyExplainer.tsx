/**
 * LithographyExplainer — an ORIGINAL, self-drawn SVG explainer of the
 * step-and-repeat exposure idea (light → pattern → wafer → repeated exposure).
 *
 * Not the licensed Wikimedia diagram (that asset is used only as Chapter 2
 * media). Pure SVG + CSS: motion lives in globals.css and is disabled under
 * `prefers-reduced-motion`. The four labelled stages are real text, so no
 * essential information is carried by animation alone. No external assets.
 */

const STAGES = [
  { n: 1, label: 'Light', note: 'A precise light source' },
  { n: 2, label: 'Pattern', note: 'shines through a patterned mask' },
  { n: 3, label: 'Wafer', note: 'onto a light-sensitive wafer' },
  { n: 4, label: 'Repeated exposure', note: 'field by field, again and again' },
];

/** Wafer field grid (step-and-repeat). Rendered exposed by default; the
 *  animation only adds a staggered "printing" pulse where motion is allowed. */
function WaferGrid() {
  const cells: { x: number; y: number; i: number }[] = [];
  const cols = 6, rows = 5, size = 15, gap = 3, x0 = 8, y0 = 8;
  let i = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // circular mask: skip corners so the grid reads as a round wafer
      const cx = c - (cols - 1) / 2, cy = r - (rows - 1) / 2;
      if (cx * cx + cy * cy > 8.5) continue;
      cells.push({ x: x0 + c * (size + gap), y: y0 + r * (size + gap), i: i++ });
    }
  }
  return (
    <g className="lx-wafer-grid">
      {cells.map((cell) => (
        <rect
          key={cell.i}
          className="lx-field"
          x={cell.x}
          y={cell.y}
          width={size}
          height={size}
          rx={2}
          style={{ animationDelay: `${(cell.i % 12) * 0.16}s` }}
        />
      ))}
    </g>
  );
}

export function LithographyExplainer({ labelled = true }: { labelled?: boolean }) {
  return (
    <div className="lx" role="img" aria-label="How lithography works: a light source shines through a patterned mask onto a light-sensitive wafer, exposing the pattern field by field, repeated across the wafer.">
      <svg className="lx-svg" viewBox="0 0 320 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* 1 — light source + beam */}
        <g className="lx-light">
          <circle className="lx-source" cx="60" cy="26" r="12" />
          <path className="lx-beam" d="M50 34 L70 34 L86 74 L34 74 Z" />
        </g>
        {/* 2 — patterned mask */}
        <g className="lx-mask">
          <rect x="30" y="74" width="60" height="16" rx="2" />
          <g className="lx-mask-holes">
            <rect x="36" y="78" width="6" height="8" /><rect x="48" y="78" width="6" height="8" />
            <rect x="60" y="78" width="6" height="8" /><rect x="72" y="78" width="6" height="8" />
          </g>
        </g>
        {/* lens focusing the patterned light down toward the wafer */}
        <path className="lx-lens" d="M42 96 L78 96 L64 120 L56 120 Z" />
        <path className="lx-project" d="M56 120 L64 120 L60 150" />
        {/* 3 + 4 — wafer with a step-and-repeat field grid */}
        <g className="lx-wafer" transform="translate(150 44)">
          <ellipse className="lx-wafer-disc" cx="80" cy="66" rx="82" ry="66" />
          <WaferGrid />
        </g>
      </svg>

      {labelled && (
        <ol className="lx-steps">
          {STAGES.map((s) => (
            <li key={s.n} className="lx-step">
              <span className="lx-step-n">{s.n}</span>
              <span className="lx-step-label">{s.label}</span>
              <span className="lx-step-note">{s.note}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
