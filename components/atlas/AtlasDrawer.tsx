'use client';

import { useEffect, useRef } from 'react';
import { ClaimBadges } from '@/components/research/ClaimBadges';
import { ClaimEvidenceContent } from '@/components/research/ClaimEvidenceContent';
import type { AtlasLink, AtlasPlace, AtlasTimelineClaim } from '@/lib/atlasViewModel';

/**
 * Right evidence drawer. Reuses the shared ClaimEvidenceContent so traceability
 * is identical to the research page (statement, citations, source
 * classification, locator, note, provenance, technical ids). Adds the
 * geographic context (place, relationship, temporal scope, city-precision
 * limitation) or, for a non-mappable claim, an explicit "no anchor" message.
 * Receives focus when opened from the keyboard and closes on Escape.
 */
export function AtlasDrawer({
  claim,
  link,
  place,
  open,
  onClose,
  restoreFocusRef,
}: {
  claim: AtlasTimelineClaim | null;
  link: AtlasLink | null;
  place: AtlasPlace | null;
  open: boolean;
  onClose: () => void;
  restoreFocusRef: React.RefObject<HTMLElement | null>;
}) {
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    if (open && headingRef.current !== null) headingRef.current.focus();
    if (!open && restoreFocusRef.current !== null) restoreFocusRef.current.focus();
  }, [open, claim?.id, restoreFocusRef]);

  if (!open || claim === null) return null;

  const anchored = claim.mappable && place !== null && link !== null;

  return (
    <section
      className="atlas-drawer"
      role="dialog"
      aria-modal="false"
      aria-labelledby="atlas-drawer-heading"
    >
      <div className="drawer-topline">
        <h2 id="atlas-drawer-heading" tabIndex={-1} ref={headingRef}>
          {anchored ? place.name : 'No geographic anchor'}
        </h2>
        <button type="button" className="drawer-close" onClick={onClose} aria-label="Close evidence drawer">
          ✕
        </button>
      </div>

      {anchored ? (
        <dl className="geo-meta">
          <div><dt>Relationship</dt><dd>{link.relationship}</dd></div>
          <div><dt>Temporal scope</dt><dd>{link.temporalScopeLabel}</dd></div>
          <div><dt>Precision</dt><dd>{link.evidencePrecision}-level · Marker shown at city-level precision.</dd></div>
        </dl>
      ) : (
        <p className="geo-none">No verified geographic anchor in the current evidence.</p>
      )}

      <div className="drawer-badges">
        <ClaimBadges claim={claim} showSources={false} />
      </div>

      <ClaimEvidenceContent claim={claim} />

      {anchored && (
        <div className="geo-limits">
          <p className="geo-limits-h">Geographic limitations</p>
          <p>{link.locatorNote}</p>
          {link.provenanceNote !== null && <p className="geo-prov">{link.provenanceNote}</p>}
        </div>
      )}
    </section>
  );
}
