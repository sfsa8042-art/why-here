import type { CaseResearchView, SpineClaimView } from '@/lib/researchViewModel';
import { ClaimBadges } from './ClaimBadges.tsx';
import { ClaimEvidenceContent } from './ClaimEvidenceContent.tsx';

/**
 * Panels C + D — chronological evidence spine, with a per-claim evidence
 * drawer. The spine renders all production Claims in chronological order;
 * each row is a native <details> whose expanded panel (D) exposes the full
 * citation record via the shared ClaimEvidenceContent. Interpretive claims
 * are visibly marked as interpretive; attributed statements carry an
 * "ASML states" marker.
 */

function ClaimRow({ claim }: { claim: SpineClaimView }) {
  return (
    <details className="claim">
      <summary>
        <span className="c-period">{claim.period}</span>
        <span>
          <span className="c-statement">{claim.statement}</span>
          <ClaimBadges claim={claim} />
        </span>
      </summary>
      <div className="drawer">
        <ClaimEvidenceContent claim={claim} />
      </div>
    </details>
  );
}

export function ChronologicalSpine({ data }: { data: CaseResearchView }) {
  return (
    <section>
      <h2>Chronological evidence spine</h2>
      <div className="spine">
        {data.spine.map((claim) => (
          <ClaimRow claim={claim} key={claim.id} />
        ))}
      </div>
    </section>
  );
}
