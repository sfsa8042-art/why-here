import type { SpineClaimView } from '@/lib/researchViewModel';

/**
 * Shared claim badge row (type, epistemic status, attribution marker, and an
 * optional citation-count/source line). Used by the research spine and the
 * atlas evidence drawer so badge markup lives in ONE place.
 */
export function ClaimBadges({
  claim,
  showSources = true,
}: {
  claim: Pick<SpineClaimView, 'claimType' | 'epistemicStatus' | 'attributed' | 'citationCount' | 'sourceNames'>;
  showSources?: boolean;
}) {
  return (
    <span className="c-badges">
      <span className="badge" data-type={claim.claimType}>
        {claim.claimType}
      </span>
      <span className="badge" data-status={claim.epistemicStatus}>
        {claim.epistemicStatus}
      </span>
      {claim.attributed && (
        <span className="badge attr" title="The statement itself is attributed to ASML">
          attributed · ASML states
        </span>
      )}
      {showSources && (
        <span className="c-src">
          {claim.citationCount} citation{claim.citationCount === 1 ? '' : 's'}
          {claim.sourceNames.length > 0 && <> · {claim.sourceNames.join('; ')}</>}
        </span>
      )}
    </span>
  );
}
