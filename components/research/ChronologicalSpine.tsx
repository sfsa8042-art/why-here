import type { CitationView, CaseResearchView, SpineClaimView } from '@/lib/researchViewModel';

/**
 * Panels C + D — chronological evidence spine, with a per-claim evidence
 * drawer. The spine renders all production Claims in chronological order;
 * each row is a native <details> whose expanded panel (D) exposes the full
 * citation record. Interpretive claims are visibly marked as interpretive;
 * attributed statements carry an "ASML states" marker.
 */

function CitationBlock({ c }: { c: CitationView }) {
  return (
    <div className="cite">
      <div className="cite-head">
        <span className="cite-title">{c.sourceTitle}</span>
        <span className="cite-class">
          {c.sourceType} · {c.temporalRelation} · {c.subjectRelationship}
        </span>
      </div>
      <div className="cite-loc">
        {c.evidenceRole} · {c.locatorKind}: {c.locatorValue}
      </div>
      {c.note !== undefined && <div className="cite-note">{c.note}</div>}
      {c.provenanceNote !== undefined && (
        <div className="cite-prov">{c.provenanceNote}</div>
      )}
    </div>
  );
}

function ClaimRow({ claim }: { claim: SpineClaimView }) {
  return (
    <details className="claim">
      <summary>
        <span className="c-period">{claim.period}</span>
        <span>
          <span className="c-statement">{claim.statement}</span>
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
            <span className="c-src">
              {claim.citationCount} citation{claim.citationCount === 1 ? '' : 's'}
              {claim.sourceNames.length > 0 && <> · {claim.sourceNames.join('; ')}</>}
            </span>
          </span>
        </span>
      </summary>
      <div className="drawer">
        <p className="d-statement">{claim.statement}</p>
        {claim.citations.map((c, i) => (
          <CitationBlock c={c} key={`${claim.id}-cite-${i}`} />
        ))}
        <details className="tech-details">
          <summary>Technical details</summary>
          <p>
            Claim ID: <code>{claim.id}</code> · type <code>{claim.claimType}</code> ·
            status <code>{claim.epistemicStatus}</code>
          </p>
        </details>
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
