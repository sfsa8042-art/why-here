import type { Metadata } from 'next';
import { buildNetherlandsResearchView } from '@/lib/researchViewModel';
import { CaseResearchView } from '@/components/research/CaseResearchView.tsx';

const CASE_ID = 'netherlands-semiconductor-equipment';

export const metadata: Metadata = {
  title: 'Netherlands × Semiconductor Equipment — Why Here?',
  description:
    'Research-in-progress case: the founding period is documented more strongly than the later transition to commercial viability.',
};

/**
 * Server Component route. Reads the PRODUCTION corpus through the content
 * loader (via the research view-model) — no second dataset, no hardcoded
 * claims — and hands the derived view to the presentational tree.
 */
export default function NetherlandsCasePage() {
  const data = buildNetherlandsResearchView(CASE_ID);
  return <CaseResearchView data={data} />;
}
