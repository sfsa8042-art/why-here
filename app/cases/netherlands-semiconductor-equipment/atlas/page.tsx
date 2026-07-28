import type { Metadata } from 'next';
import { buildNetherlandsAtlasView } from '@/lib/atlasViewModel';
import { AtlasShell } from '@/components/atlas/AtlasShell';

const CASE_ID = 'netherlands-semiconductor-equipment';

export const metadata: Metadata = {
  title: 'Netherlands × Semiconductor Equipment — Interactive atlas',
  description:
    'Map-first view of the Netherlands semiconductor-equipment case: two verified city-level geographic anchors, a chronological timeline, and full evidence traceability.',
};

/**
 * Server component. Builds the serializable atlas view-model from the
 * PRODUCTION corpus (same loader/selectors as the research page) and hands it
 * to the client atlas shell. No duplicated content.
 */
export default function NetherlandsAtlasPage() {
  const data = buildNetherlandsAtlasView(CASE_ID);
  return <AtlasShell data={data} />;
}
