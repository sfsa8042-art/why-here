import type { AtlasTimelineClaim } from '@/lib/atlasViewModel';
import { claimMatchesFilters, type EvidenceFilter } from '@/lib/atlasState';

/**
 * Bottom timeline: the 17 Claims across 1983–1995 as native, keyboard-focusable
 * buttons. Mappable / non-mappable / interpretive / attributed are
 * differentiated by fill, outline, opacity and text — not a rainbow palette.
 * The evidence + phase filters dim non-matching ticks (kept focusable).
 */
export function AtlasTimeline({
  claims,
  selectedClaimId,
  filter,
  activePhase,
  onSelect,
}: {
  claims: AtlasTimelineClaim[];
  selectedClaimId: string | null;
  filter: EvidenceFilter;
  activePhase: string | null;
  onSelect: (claim: AtlasTimelineClaim) => void;
}) {
  return (
    <div className="atlas-timeline" role="group" aria-label="Chronological claims, 1983 to 1995">
      <div className="atlas-timeline-track">
        {claims.map((claim) => {
          const dim = !claimMatchesFilters(claim, filter, activePhase);
          return (
            <button
              type="button"
              key={claim.id}
              className="atlas-tick"
              data-mappable={claim.mappable ? 'yes' : 'no'}
              data-type={claim.claimType}
              data-attributed={claim.attributed ? 'yes' : 'no'}
              data-dimmed={dim ? 'yes' : 'no'}
              aria-pressed={selectedClaimId === claim.id}
              aria-label={
                `${claim.period}: ${claim.statement} — ${claim.claimType}, ${claim.epistemicStatus}` +
                (claim.mappable ? ', geographically anchored' : ', not geographically anchored') +
                (claim.attributed ? ', attributed' : '')
              }
              onClick={() => onSelect(claim)}
            >
              <span className="tick-period">{claim.period}</span>
              <span className="tick-mark" aria-hidden="true" />
              <span className="tick-flags" aria-hidden="true">
                {claim.mappable ? '◆' : '·'}
                {claim.claimType === 'interpretive' ? ' interp' : ''}
                {claim.attributed ? ' ▹asml' : ''}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
