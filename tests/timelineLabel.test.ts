/**
 * Increment 3 — deterministic timeline labels.
 *
 * Labels are generated from claim statements, never authored; the
 * schema-level rejection of an authored label is asserted here too.
 */

import { describe, expect, it } from 'vitest';

import { generateTimelineLabel, TIMELINE_LABEL_ELLIPSIS } from '@/lib/timelineLabel';
import { ClaimSchema, TimelineProjectionSchema } from '@/lib/schemas';
import { makeFactual } from '@/content/__fixtures__/builders';

const words = (text: string): string[] =>
  text.replace(TIMELINE_LABEL_ELLIPSIS, '').split(/\s+/).filter((w) => w.length > 0);

describe('generateTimelineLabel', () => {
  it('returns short text unchanged, with no ellipsis', () => {
    expect(generateTimelineLabel('A short statement.', 60)).toBe('A short statement.');
  });

  it('truncates on a word boundary and appends exactly one ellipsis', () => {
    const label = generateTimelineLabel('alpha beta gamma delta', 12);
    expect(label).toBe(`alpha beta${TIMELINE_LABEL_ELLIPSIS}`);
    expect(label.length).toBeLessThanOrEqual(12);
    expect(label.match(new RegExp(TIMELINE_LABEL_ELLIPSIS, 'g'))?.length).toBe(1);
  });

  it('never introduces a word absent from the statement', () => {
    const statement =
      'The fixture entity was constituted in the fixture year after a long process.';
    for (const maxLen of [5, 10, 20, 40, 200]) {
      const statementWords = new Set(words(statement));
      for (const word of words(generateTimelineLabel(statement, maxLen))) {
        expect(statementWords.has(word), `"${word}" not in statement`).toBe(true);
      }
    }
  });

  it('is deterministic and idempotent', () => {
    const statement = 'alpha beta gamma delta epsilon zeta';
    const first = generateTimelineLabel(statement, 15);
    expect(generateTimelineLabel(statement, 15)).toBe(first);
    expect(generateTimelineLabel(first, 15)).toBe(first);
  });

  it('handles empty and whitespace-only input safely', () => {
    expect(generateTimelineLabel('', 60)).toBe('');
    expect(generateTimelineLabel('   ', 60)).toBe('');
  });

  it('handles very small maxLen without cutting inside a word', () => {
    expect(generateTimelineLabel('extraordinary statement', 0)).toBe('');
    expect(generateTimelineLabel('extraordinary statement', -5)).toBe('');
    expect(generateTimelineLabel('extraordinary statement', 1)).toBe(TIMELINE_LABEL_ELLIPSIS);
    // budget of 4 fits no whole word: degrade to the ellipsis, never "extr…"
    expect(generateTimelineLabel('extraordinary statement', 5)).toBe(TIMELINE_LABEL_ELLIPSIS);
  });

  it('normalizes whitespace but changes nothing else', () => {
    expect(generateTimelineLabel('  alpha \n beta\tgamma  ', 60)).toBe('alpha beta gamma');
  });

  it('does not mutate its input', () => {
    const statement = 'alpha beta gamma';
    generateTimelineLabel(statement, 10);
    expect(statement).toBe('alpha beta gamma');
  });
});

describe('no authored timeline label', () => {
  it('TimelineProjectionSchema rejects an authored label field', () => {
    expect(
      TimelineProjectionSchema.safeParse({ year: 1984, label: 'authored' }).success,
    ).toBe(false);
  });

  it('ClaimSchema rejects a claim whose timeline carries an authored label', () => {
    const claim = {
      ...makeFactual({ id: 'label-probe' }),
      timeline: { year: 1984, label: 'authored' },
    };
    expect(ClaimSchema.safeParse(claim).success).toBe(false);
  });
});
