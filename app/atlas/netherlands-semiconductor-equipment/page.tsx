import type { Metadata } from 'next';
import { buildChaptersView } from '@/lib/chapters';
import { caseCover } from '@/lib/media';
import { ExplorePreviewShell } from '@/components/explore/ExplorePreviewShell.tsx';

const CASE_ID = 'netherlands-semiconductor-equipment';
const OG_IMAGE = '/media/netherlands-semiconductor-equipment/Binnenstad_Eindhoven.jpg';

/**
 * Canonical PUBLIC Explore route — the visual documentary for the Netherlands
 * case. Reuses the exact story implementation (ExplorePreviewShell) and chapter
 * loader; no story components or chapter-loading logic are duplicated. Indexable,
 * with a canonical URL and sharing metadata. The visible "Research in progress"
 * status, every evidence boundary, all photo credits/rights and the full Evidence
 * workspace link are retained inside the shell.
 */
export const metadata: Metadata = {
  title: 'Why Here? — Netherlands × Semiconductor Equipment',
  description:
    'A visual investigation into the formation, early crisis and European research network of a Dutch semiconductor-lithography venture.',
  alternates: { canonical: `/atlas/${CASE_ID}` },
  openGraph: {
    type: 'article',
    title: 'Why Here? — Netherlands × Semiconductor Equipment',
    description:
      'A visual investigation into the formation, early crisis and European research network of a Dutch semiconductor-lithography venture.',
    url: `/atlas/${CASE_ID}`,
    images: [{ url: OG_IMAGE, width: 874, height: 346, alt: 'Eindhoven city centre — present-day regional context' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Why Here? — Netherlands × Semiconductor Equipment',
    description:
      'A visual investigation into the formation, early crisis and European research network of a Dutch semiconductor-lithography venture.',
    images: [OG_IMAGE],
  },
};

export default function NetherlandsExplorePage() {
  const view = buildChaptersView(CASE_ID);
  return <ExplorePreviewShell view={view} evidenceHref={`/evidence/${CASE_ID}`} heroImage={caseCover(CASE_ID)} />;
}
