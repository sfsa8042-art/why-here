/**
 * Research UI rendering tests (first UI increment).
 *
 * The slice is server-rendered end to end, so we render the presentational
 * root to static markup (no jsdom / testing-library needed) and assert on it.
 */

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { buildNetherlandsResearchView } from '@/lib/researchViewModel';
import { CaseResearchView } from '@/components/research/CaseResearchView.tsx';

const vm = buildNetherlandsResearchView();
const html = renderToStaticMarkup(<CaseResearchView data={vm} />);

/** Mirror React's text-content escaping so raw statements can be matched. */
function escapeText(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

describe('Netherlands research case — rendering', () => {
  it('renders the research header with status, counts and boundary statement', () => {
    expect(html).toContain('Netherlands');
    expect(html).toContain('Semiconductor Equipment');
    expect(html).toContain('Research in progress');
    expect(html).toContain(
      'documents the founding period more strongly than the later',
    );
  });

  it('renders all three production research questions', () => {
    for (const q of vm.researchQuestions) {
      // assert on a distinctive fragment of each question
      expect(html).toContain(q.question.slice(0, 24));
    }
    expect(vm.researchQuestions).toHaveLength(3);
  });

  it('makes every one of the seventeen claims reachable in the UI', () => {
    expect(vm.spine).toHaveLength(17);
    for (const claim of vm.spine) {
      // statement text is rendered (escaped as React escapes text content)
      expect(html, `${claim.id} statement`).toContain(escapeText(claim.statement));
      // and the claim id is reachable in its drawer's technical details
      expect(html, `${claim.id} id`).toContain(claim.id);
    }
  });

  it('shows the reluctance claim as interpretive, not a flat factual event', () => {
    expect(html).toContain('data-type="interpretive"');
    // exactly one interpretive badge (the reluctance claim)
    const matches = html.match(/data-type="interpretive"/g) ?? [];
    expect(matches).toHaveLength(1);
  });

  it('marks the two attributed statements with an ASML-states marker', () => {
    const markers = html.match(/attributed · ASML states/g) ?? [];
    expect(markers).toHaveLength(2);
  });

  it('renders no thesis anywhere on the page', () => {
    expect(html.toLowerCase()).not.toContain('thesis');
  });

  it('exposes the claim drawer with locator and source classification', () => {
    // a known long-form dissertation locator and its documentary/press classification
    expect(html).toContain('278 (PDF 281)');
    expect(html).toContain('academic · retrospective · mixed');
    // a CORDIS named-section locator and its documentary classification
    expect(html).toContain('Participants');
    expect(html).toContain('documentary · retrospective · independent');
  });

  it('renders the five evidence-boundary phases with coverage labels', () => {
    expect(html).toContain('data-cov="strong"');
    expect(html).toContain('data-cov="insufficient"');
    expect(html).toContain('data-cov="attributed only"');
  });
});
