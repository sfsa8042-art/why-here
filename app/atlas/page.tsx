import type { Metadata } from 'next';
import { getAtlasCases } from '@/lib/atlasCases';
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
  return <AtlasIndexShell cases={cases} />;
}
