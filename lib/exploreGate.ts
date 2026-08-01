/**
 * lib/exploreGate.ts — the public-Explore publication gate (Public Atlas V2, Stage 7).
 *
 * A case may only expose the `explore` mode if the reviewed visual experience is
 * genuinely backed:
 *   E1 — Evidence is also available (Explore is a reading OF the evidence);
 *   E2 — narrative chapters exist for the case;
 *   E3 — at least one chapter is `supported` (prose resolving to production Claims
 *        is already enforced chapter-side; a supported chapter guarantees ≥1 Claim);
 *   E4 — every image the chapters render passes the public rights gate.
 *
 * Cases that do NOT declare `explore` are never gated — so a planned case (Taiwan,
 * France) with `availableModes: []` can never accidentally pass Explore. Wired into
 * the build gate (scripts/validate-content.ts); throwing is build-blocking.
 */

import type { AtlasCase } from './atlasCases.ts';
import { getCaseChapters } from './chapters.ts';
import { getCaseMedia, isPublicRenderable } from './media.ts';

export interface ExploreGateFailure { ruleId: string; caseId: string; message: string; }

export function exploreGateFailures(cases: readonly AtlasCase[]): ExploreGateFailure[] {
  const failures: ExploreGateFailure[] = [];
  for (const c of cases) {
    if (!c.availableModes.includes('explore')) continue; // only gate declared-explore cases

    // E1 — Evidence must also be available.
    if (!c.availableModes.includes('evidence')) {
      failures.push({ ruleId: 'E1-evidence-available', caseId: c.id, message: 'explore requires the evidence mode' });
    }

    // E2/E3 — supported narrative chapters must exist.
    const pack = getCaseChapters(c.slug); // validates the chapter pack; throws if malformed
    if (pack.chapters.length === 0) {
      failures.push({ ruleId: 'E2-no-chapters', caseId: c.id, message: 'explore requires narrative chapters' });
    }
    if (!pack.chapters.some((ch) => ch.supportStatus === 'supported')) {
      failures.push({ ruleId: 'E3-no-supported-chapter', caseId: c.id, message: 'explore requires at least one supported chapter' });
    }

    // E4 — every rendered chapter image must pass the public rights gate.
    const media = getCaseMedia(c.slug);
    const assetById = new Map(media.assets.map((a) => [a.id, a]));
    for (const ch of pack.chapters) {
      for (const mid of ch.mediaIds) {
        const asset = assetById.get(mid);
        if (asset === undefined || !isPublicRenderable(asset)) {
          failures.push({ ruleId: 'E4-media-rights', caseId: c.id, message: `chapter media "${mid}" is not public-renderable` });
        }
      }
    }
  }
  return failures;
}
