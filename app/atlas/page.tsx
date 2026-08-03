import type { Metadata } from 'next';
import { getAtlasCases } from '@/lib/atlasCases';
import { buildCountrySummaryView, type CountrySummaryView } from '@/lib/atlasPresentation';
import { AtlasIndexShell } from '@/components/atlasindex/AtlasIndexShell.tsx';

export const metadata: Metadata = {
  title: 'Why Here? — Explore the atlas',
  description:
    'Select a country to discover what it became exceptionally good at — and how that strength developed.',
};

/**
 * Server component (presentation-only). Loads the validated AtlasCase registry and
 * resolves each country's summary copy from the typed country-presentation layer
 * (specialisation + atlas question, plus live reading meta for the launched case).
 * No summary copy is hardcoded here; the research corpus is untouched.
 */
export default function AtlasIndexPage() {
  const cases = [...getAtlasCases()];

  const summaries: Record<string, CountrySummaryView> = {};
  for (const c of cases) {
    const view = buildCountrySummaryView(c.slug);
    if (view !== null) summaries[c.slug] = view;
  }

  return <AtlasIndexShell cases={cases} summaries={summaries} />;
}
