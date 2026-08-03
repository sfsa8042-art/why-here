import type { Metadata } from 'next';
import { buildChaptersView } from '@/lib/chapters';
import { buildNetherlandsResearchView } from '@/lib/researchViewModel';
import { mediaViewById } from '@/lib/media';
import { ExplorePreviewShell } from '@/components/explore/ExplorePreviewShell.tsx';

const CASE_ID = 'netherlands-semiconductor-equipment';
const OG_IMAGE = '/media/netherlands-semiconductor-equipment/Binnenstad_Eindhoven.jpg';
/** Sharpest, most editorial approved local asset for the wide hero panel (1920×1353). */
const HERO_MEDIA_ID = 'nl-media-philips-fabrieken-1949';
/** Ordinary-user hero caption + an honest historical-context clarification, both
 *  visible without opening any credits/rights disclosure. Full rights and the
 *  temporal-context record remain in the media asset (surfaced in Evidence). */
const HERO_CAPTION = 'Philips industrial complex, Eindhoven, 1949';
const HERO_CONTEXT_NOTE = 'Historical industrial context — not the 1984 ASM Lithography site';

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
  const research = buildNetherlandsResearchView(CASE_ID);
  const heroMeta = {
    chapters: view.chapters.length,
    minutes: view.chapters.reduce((n, c) => n + c.readingTimeMinutes, 0),
    findings: research.claimCount,
  };
  return (
    <ExplorePreviewShell
      view={view}
      evidenceHref={`/evidence/${CASE_ID}`}
      heroImage={mediaViewById(CASE_ID, HERO_MEDIA_ID)}
      heroMeta={heroMeta}
      heroCaption={HERO_CAPTION}
      heroContextNote={HERO_CONTEXT_NOTE}
    />
  );
}
