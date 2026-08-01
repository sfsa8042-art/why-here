/**
 * Atlas story-preview content (Public Atlas V2, Stage 7.1).
 *
 * A SEPARATE, typed presentation layer for the Atlas index. Each preview links its
 * beats to production NarrativeChapters by id — it never duplicates chapter prose.
 * Beat titles resolve live from the chapter registry unless an explicit compact
 * `displayTitle` is given (itself validated + linked to the chapter id). The setup
 * line is curated public copy. Only Explore-capable cases have a preview.
 */

import type { AtlasPreview } from '../../lib/atlasPreview.ts';

export const atlasPreviews: AtlasPreview[] = [
  {
    slug: 'netherlands-semiconductor-equipment',
    setupLine:
      'In 1984, Philips and ASM assembled a new lithography venture from staff, technology and financial commitments.',
    compactSummary: '3 chapters · Founding · Crisis · European coordination',
    beats: [
      { chapterId: 'nl-ch-fragile-joint-venture' }, // → "A fragile joint venture" (chapter title)
      { chapterId: 'nl-ch-crisis-without-mechanism', displayTitle: 'Crisis and restructuring' },
      { chapterId: 'nl-ch-european-coordination' }, // → "European coordination" (chapter title)
    ],
  },
];
