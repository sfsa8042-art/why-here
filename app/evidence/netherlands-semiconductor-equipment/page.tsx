import type { Metadata } from 'next';
import { buildNetherlandsResearchView } from '@/lib/researchViewModel';
import { CaseResearchView } from '@/components/research/CaseResearchView.tsx';

const CASE_ID = 'netherlands-semiconductor-equipment';

export const metadata: Metadata = {
  title: 'Netherlands × Semiconductor Equipment — Evidence — Why Here?',
  description:
    'Evidence workspace: the sourced claims, citations, provenance and limitations behind the Netherlands semiconductor-equipment case.',
};

/**
 * Canonical Evidence workspace route. Reuses the existing research view-model and
 * evidence components unchanged — no duplicated production-content loading.
 */
export default function NetherlandsEvidencePage() {
  const data = buildNetherlandsResearchView(CASE_ID);
  return <CaseResearchView data={data} />;
}
