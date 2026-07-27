import type { CaseResearchView as CaseResearchViewData } from '@/lib/researchViewModel';
import { ResearchHeader } from './ResearchHeader.tsx';
import { EvidenceBoundaryPanel } from './EvidenceBoundaryPanel.tsx';
import { ChronologicalSpine } from './ChronologicalSpine.tsx';

/**
 * Synchronous presentational root for the Netherlands research case. It takes
 * the fully-derived view-model as a plain prop, so it can be rendered both by
 * the async server page and directly in tests. This first slice renders panels
 * A–D; the remaining panels (Sources, research-questions detail, know/cannot-
 * explain, genealogy, alternatives, methodology) arrive in the next slice.
 */
export function CaseResearchView({ data }: { data: CaseResearchViewData }) {
  return (
    <>
      <ResearchHeader data={data} />
      <EvidenceBoundaryPanel data={data} />
      <ChronologicalSpine data={data} />
    </>
  );
}
