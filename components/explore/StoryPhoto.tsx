import type { MediaItemView } from '@/lib/media';

/**
 * A documentary photograph. The DEFAULT caption is short and readable — what it
 * shows, its role, and a short creator credit. The complete licence title, URL,
 * original filename, full source and limitations move into an accessible
 * "Credit & rights" disclosure. An optional `overlayLabel` prints a clarifying
 * line directly on the image (used to make an out-of-scope image unmistakable
 * without opening details).
 */
export function StoryPhoto({
  m, variant = 'lead', overlayLabel = null,
}: {
  m: MediaItemView; variant?: 'lead' | 'strip' | 'wide'; overlayLabel?: string | null;
}) {
  const isDiagram = m.type === 'diagram';
  return (
    <figure className={`ph ph--${variant}${isDiagram ? ' ph--diagram' : ''}`}>
      <div className="ph-frame">
        {/* data-media-id lets an asset carry an asset-specific crop (object-position)
            in CSS without touching the media record or the source file. */}
        <img src={m.src} alt={m.alt} width={m.width} height={m.height} data-media-id={m.id} loading="lazy" decoding="async" />
        <span className="ph-badge">{m.presentationLabel}</span>
        {overlayLabel !== null && <span className="ph-overlay">{overlayLabel}</span>}
      </div>
      <figcaption className="ph-cap">
        <span className="ph-title">{m.title}</span>
        <span className="ph-meta">{m.presentationLabel}{m.creator !== null ? ` · ${m.creator}` : ''}</span>
        <details className="ph-details">
          <summary>Credit &amp; rights</summary>
          <dl>
            <dt>Shows</dt><dd>{m.caption}</dd>
            {m.dateLabel !== null && (<><dt>Date</dt><dd>{m.dateLabel}</dd></>)}
            <dt>Credit</dt>
            <dd>
              {m.credit}
              {m.licenseUrl !== null && (<> · <a href={m.licenseUrl} target="_blank" rel="noreferrer">{m.licenseName ?? 'licence'}</a></>)}
              {' · '}<a href={m.sourceUrl} target="_blank" rel="noreferrer">source</a>
            </dd>
            {m.originalFilename !== null && (<><dt>Original file</dt><dd>{m.originalFilename}</dd></>)}
            {m.linkLimitations !== null && (<><dt>Limitations</dt><dd>{m.linkLimitations}</dd></>)}
          </dl>
        </details>
      </figcaption>
    </figure>
  );
}

/** A compact, horizontally-scrollable strip of documentary photos. */
export function PhotoStrip({ photos, label }: { photos: MediaItemView[]; label: string }) {
  if (photos.length === 0) return null;
  return (
    <div className="phstrip" role="group" aria-label={label}>
      {photos.map((m) => <StoryPhoto key={m.id} m={m} variant="strip" />)}
    </div>
  );
}
