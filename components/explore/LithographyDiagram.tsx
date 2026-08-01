/**
 * LithographyDiagram — an ORIGINAL, clean, plain-English technical illustration
 * of the lithography exposure step, drawn for the public story: a light source
 * through a MASK, focused by an OPTICAL SYSTEM onto a WAFER, then REPEATED
 * field by field. Signal-Blue visual system; self-drawn (no external asset).
 *
 * It is deliberately SIMPLIFIED and generic — it does NOT depict the exact PAS
 * 2000 or PAS 5500. The licensed source method diagram remains available in the
 * media details / Evidence workspace with its full metadata.
 */
export function LithographyDiagram() {
  return (
    <div className="ldiag" role="img" aria-label="How a lithography exposure works: a light source shines through a patterned mask, an optical system focuses the pattern onto a silicon wafer, and the exposure is repeated field by field across the wafer.">
      <svg className="ldiag-svg" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* light source + beam */}
        <circle className="ld-source" cx="210" cy="34" r="13" />
        <text className="ld-label" x="250" y="39">Light source</text>
        <path className="ld-beam" d="M197 44 L223 44 L262 92 L158 92 Z" />

        {/* mask */}
        <rect className="ld-panel" x="158" y="92" width="104" height="20" rx="3" />
        <g className="ld-slits">
          <rect x="166" y="97" width="8" height="10" /><rect x="182" y="97" width="8" height="10" />
          <rect x="198" y="97" width="8" height="10" /><rect x="214" y="97" width="8" height="10" />
          <rect x="230" y="97" width="8" height="10" />
        </g>
        <text className="ld-label" x="284" y="107">Mask — the pattern to print</text>

        {/* optical system (lens) */}
        <ellipse className="ld-lens" cx="210" cy="150" rx="52" ry="17" />
        <text className="ld-label" x="284" y="155">Optical system — focuses the pattern</text>
        <path className="ld-beam" d="M172 162 L248 162 L226 236 L194 236 Z" />

        {/* wafer + exposed fields */}
        <ellipse className="ld-wafer" cx="210" cy="250" rx="140" ry="34" />
        <g className="ld-fields">
          <rect x="150" y="240" width="16" height="16" rx="2" /><rect x="170" y="240" width="16" height="16" rx="2" />
          <rect x="190" y="240" width="16" height="16" rx="2" /><rect className="is-active" x="210" y="240" width="16" height="16" rx="2" />
          <rect x="230" y="240" width="16" height="16" rx="2" /><rect x="250" y="240" width="16" height="16" rx="2" />
        </g>
        <text className="ld-label" x="364" y="252">Wafer — the silicon being printed</text>

        {/* repeated exposure */}
        <g className="ld-repeat">
          <rect x="150" y="322" width="20" height="20" rx="2" /><rect x="178" y="322" width="20" height="20" rx="2" />
          <rect className="is-active" x="206" y="322" width="20" height="20" rx="2" /><rect x="234" y="322" width="20" height="20" rx="2" />
          <rect x="262" y="322" width="20" height="20" rx="2" />
          <path className="ld-arrow" d="M150 356 L282 356" />
          <path className="ld-arrow" d="M276 351 L282 356 L276 361" />
        </g>
        <text className="ld-label" x="300" y="337">Repeated exposure — field by field</text>
      </svg>
    </div>
  );
}
