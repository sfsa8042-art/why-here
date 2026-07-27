import type { CaseResearchView } from '@/lib/researchViewModel';

/**
 * Panel B — evidence-boundary. The five phases with a UI-level coverage
 * label each (strong → attributed only). These are analytical display
 * labels, NOT production Claim statuses. A density meter (width ∝ claim
 * count, brightness ∝ coverage) makes the post-1988 drop unmistakable.
 */
export function EvidenceBoundaryPanel({ data }: { data: CaseResearchView }) {
  const maxCount = Math.max(1, ...data.phases.map((p) => p.claimCount));
  return (
    <section>
      <h2>Evidence boundary</h2>
      <div className="phases">
        {data.phases.map((phase) => (
          <div className="phase" key={phase.key} data-cov={phase.coverage}>
            <div>
              <span className="ph-label">{phase.label}</span>
              <span className="ph-years">{phase.years}</span>
            </div>
            <div className="ph-meta">
              <div className="ph-figures">
                <span className="cov">{phase.coverage}</span>
                <span className="ph-count">
                  {phase.claimCount} claim{phase.claimCount === 1 ? '' : 's'}
                </span>
              </div>
              <div
                className="ph-meter"
                role="presentation"
                aria-hidden="true"
              >
                <span style={{ width: `${(phase.claimCount / maxCount) * 100}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="boundary-note">
        Coverage labels are analytical reading aids, not claim statuses.
        Evidence density falls sharply after 1988: development is only
        partially documented, commercial viability is not, and the
        public-company transition rests on ASML&rsquo;s own attributed
        statements.
      </p>
    </section>
  );
}
