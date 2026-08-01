/**
 * Atlas story-preview linkage (Public Atlas V2, Stage 7.1). Preview beats are
 * linked to production chapters by id (not duplicated); validation is
 * build-blocking; a renamed chapter cannot leave a stale Atlas title.
 */

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  buildAtlasPreview,
  getAtlasPreview,
  getAtlasPreviews,
  validateAtlasPreviews,
  type AtlasPreview,
} from '@/lib/atlasPreview';
import { atlasPreviews } from '@/content/atlas/previews';
import { buildChaptersView } from '@/lib/chapters';

const NL = 'netherlands-semiconductor-equipment';
const ruleIds = (fs: { ruleId: string }[]) => fs.map((f) => f.ruleId);

describe('Atlas preview content', () => {
  it('the shipped preview content is valid and loads', () => {
    expect(validateAtlasPreviews(atlasPreviews)).toEqual([]);
    expect(() => getAtlasPreviews()).not.toThrow();
  });

  it('the Netherlands preview resolves EXACTLY the three production chapters, in order', () => {
    const chapters = buildChaptersView(NL).chapters;
    const preview = getAtlasPreview(NL)!;
    expect(preview.beats.map((b) => b.chapterId)).toEqual(chapters.map((c) => c.id));
    const built = buildAtlasPreview(NL)!;
    expect(built.beats.length).toBe(3);
    // beats without a compact displayTitle track the LIVE chapter title
    expect(built.beats[0]).toBe(chapters[0]!.title); // "A fragile joint venture"
    expect(built.beats[2]).toBe(chapters[2]!.title); // "European coordination"
    // the middle beat is an explicit, validated compact display title linked to ch2
    expect(built.beats[1]).toBe('Crisis and restructuring');
  });

  it('renaming a chapter cannot leave an unrelated stale title (non-displayTitle beats track live titles)', () => {
    const chapters = buildChaptersView(NL).chapters;
    const built = buildAtlasPreview(NL)!;
    // every beat that is NOT an explicit displayTitle must equal a current chapter title
    const preview = getAtlasPreview(NL)!;
    preview.beats.forEach((b, i) => {
      if (b.displayTitle === undefined) {
        const ch = chapters.find((c) => c.id === b.chapterId)!;
        expect(built.beats[i]).toBe(ch.title);
      }
    });
  });

  it('Taiwan and France have no story preview', () => {
    expect(getAtlasPreview('taiwan-semiconductor-manufacturing')).toBe(null);
    expect(getAtlasPreview('france-luxury')).toBe(null);
    expect(buildAtlasPreview('france-luxury')).toBe(null);
  });

  it('P1 — a beat that points at another case (or a missing id) fails validation', () => {
    const foreign: AtlasPreview = { slug: NL, setupLine: 'x', beats: [{ chapterId: 'tw-ch-not-a-real-chapter' }] };
    expect(ruleIds(validateAtlasPreviews([foreign]))).toContain('P1-chapter-ref');
  });

  it('P3 — beats out of chapter order fail validation', () => {
    const outOfOrder: AtlasPreview = {
      slug: NL, setupLine: 'x',
      beats: [{ chapterId: 'nl-ch-european-coordination' }, { chapterId: 'nl-ch-fragile-joint-venture' }],
    };
    expect(ruleIds(validateAtlasPreviews([outOfOrder]))).toContain('P3-order');
  });

  it('the Atlas route is presentation-only — no hardcoded story object', () => {
    const src = readFileSync(join(process.cwd(), 'app/atlas/page.tsx'), 'utf8');
    expect(src).not.toContain('A fragile joint venture');
    expect(src).not.toContain('Crisis and restructuring');
    expect(src).not.toContain('In 1984, Philips and ASM');
    expect(src).not.toMatch(/beats:\s*\[/); // no inline beats array in the route
  });
});
