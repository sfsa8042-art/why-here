import type { Metadata } from 'next';
import { buildChaptersView } from '@/lib/chapters';
import { ExplorePreviewShell } from '@/components/explore/ExplorePreviewShell.tsx';

const CASE_ID = 'netherlands-semiconductor-equipment';

/**
 * UNLINKED review route — the "Visual story preview" for the Netherlands case.
 *
 * This is deliberately NOT the public Explore experience: the Netherlands
 * AtlasCase does not list `explore` among its modes, the Atlas index carries no
 * "Explore case" CTA, and this page is `noindex` with no canonical claim to be
 * the public Explore. It exists only so the first evidence-backed
 * NarrativeChapters can be reviewed for factual, methodological and visual
 * quality before any public-Explore gate is considered.
 */
export const metadata: Metadata = {
  title: 'Visual story preview (review only) — Netherlands — Why Here?',
  description:
    'Internal review preview of the first evidence-backed narrative chapters for the Netherlands semiconductor-equipment case. Not the public Explore experience.',
  robots: { index: false, follow: false },
};

export default function NetherlandsExplorePreviewPage() {
  const view = buildChaptersView(CASE_ID);
  return <ExplorePreviewShell view={view} evidenceHref={`/evidence/${CASE_ID}`} />;
}
