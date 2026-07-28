import type { SpineClaimView } from '@/lib/researchViewModel';
import { CitationEvidenceBlock } from './CitationEvidenceBlock.tsx';

/**
 * Shared full-evidence body for a single Claim: complete statement, every
 * Citation (with source classification, locator, note, provenance), and a
 * subordinate technical-details area (claim id, type, status). Used by the
 * research spine's disclosure drawer AND the atlas evidence drawer, so there
 * is exactly one implementation of claim/citation/provenance/technical-id
 * rendering.
 */
export function ClaimEvidenceContent({ claim }: { claim: SpineClaimView }) {
  return (
    <div className="evidence-body">
      <p className="d-statement">{claim.statement}</p>
      {claim.citations.map((c, i) => (
        <CitationEvidenceBlock c={c} key={`${claim.id}-cite-${i}`} />
      ))}
      <details className="tech-details">
        <summary>Technical details</summary>
        <p>
          Claim ID: <code>{claim.id}</code> · type <code>{claim.claimType}</code> ·
          status <code>{claim.epistemicStatus}</code>
        </p>
      </details>
    </div>
  );
}
