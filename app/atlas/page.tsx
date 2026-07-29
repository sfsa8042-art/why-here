import type { Metadata } from 'next';
import { getAtlasCases } from '@/lib/atlasCases';
import { caseCover, type CoverView } from '@/lib/media';
import { AtlasIndexShell } from '@/components/atlasindex/AtlasIndexShell.tsx';

export const metadata: Metadata = {
  title: 'Why Here? — An Atlas of Industrial Advantage',
  description:
    'A map of places that developed an unusual industrial advantage. Browse cases by industry and status.',
};

/**
 * Server component. Loads the validated AtlasCase registry (build-blocking on
 * failure) and hands it to the client index shell. The registry is a separate
 * navigation layer — it never touches the evidence corpus.
 */
export default function AtlasIndexPage() {
  const cases = [...getAtlasCases()];
  // Public cover images, keyed by case slug (only cases past the media gate).
  const covers: Record<string, CoverView> = {};
  for (const c of cases) {
    const cover = caseCover(c.slug);
    if (cover !== null) covers[c.slug] = cover;
  }
  return <AtlasIndexShell cases={cases} covers={covers} />;
}
