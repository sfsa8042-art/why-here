import type { Metadata } from 'next';
import { getAtlasCases, hasExploreCta } from '@/lib/atlasCases';
import { buildAtlasPreview } from '@/lib/atlasPreview';
import { caseCover, type CoverView } from '@/lib/media';
import { AtlasIndexShell, type StoryPreview } from '@/components/atlasindex/AtlasIndexShell.tsx';

export const metadata: Metadata = {
  title: 'Why Here? — An Atlas of Industrial Advantage',
  description:
    'A map of places that developed an unusual industrial advantage. Browse cases by industry and status.',
};

/**
 * Server component (presentation-only). Loads the validated AtlasCase registry and
 * resolves each Explore-capable case's preview from the typed atlas-preview content
 * layer — the preview beats are linked to production chapters, never hardcoded here.
 */
export default function AtlasIndexPage() {
  const cases = [...getAtlasCases()];
  const covers: Record<string, CoverView> = {};
  const storyPreviews: Record<string, StoryPreview> = {};
  for (const c of cases) {
    const cover = caseCover(c.slug);
    if (cover !== null) covers[c.slug] = cover;
    if (hasExploreCta(c)) {
      const preview = buildAtlasPreview(c.slug); // { setupLine, beats } resolved from chapters
      if (preview !== null) storyPreviews[c.slug] = preview;
    }
  }
  return <AtlasIndexShell cases={cases} covers={covers} storyPreviews={storyPreviews} />;
}
