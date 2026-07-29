import type { Metadata } from 'next';
import { buildNetherlandsAtlasView } from '@/lib/atlasViewModel';
import { AtlasShell } from '@/components/atlas/AtlasShell';

const CASE_ID = 'netherlands-semiconductor-equipment';

export const metadata: Metadata = {
  title: 'Netherlands × Semiconductor Equipment — Research map prototype — Why Here?',
  description:
    'Research map prototype (M1): a map-first view of the Netherlands case over the same production corpus. Not the public Explore experience.',
};

/**
 * Canonical research-map prototype route. Reuses the M1 interactive research-map
 * foundation over the SAME production corpus. Clearly labelled "Research map
 * prototype" — this is NOT the public Explore experience (that gate is not met).
 */
export default function NetherlandsPrototypePage() {
  const data = buildNetherlandsAtlasView(CASE_ID);
  return <AtlasShell data={data} prototypeBadge />;
}
