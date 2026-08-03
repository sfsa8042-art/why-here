'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import type { ChapterClaimView } from '@/lib/chapters';

/**
 * "How do we know?" — the ordinary-user evidence disclosure inside the story.
 * Closed by default; the summary counts findings + sources in plain language.
 * When open it shows compact evidence cards (plain finding, human source kind,
 * source title, exact locator, one concise limitation where material) and a link
 * to the professional Evidence workspace. No Claim/Source IDs, enums, or long
 * citation objects are ever shown here.
 */
export function ChapterEvidence({
  evidence,
  summary,
  workspaceHref,
}: {
  evidence: ChapterClaimView[];
  summary: { findingCount: number; sourceCount: number };
  workspaceHref: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const findings = `${summary.findingCount} documented finding${summary.findingCount === 1 ? '' : 's'}`;
  const sources = `${summary.sourceCount} source${summary.sourceCount === 1 ? '' : 's'}`;

  return (
    <div className={`ev${open ? ' is-open' : ''}`}>
      <p className="ev-basis">Based on {findings}.</p>
      <button type="button" className="ev-toggle" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((v) => !v)}>
        <span className="ev-toggle-main">How do we know?</span>
        <span className="ev-toggle-summary">{findings} · {sources}</span>
        <span className="ev-toggle-chevron" aria-hidden="true">{open ? '–' : '+'}</span>
      </button>

      {open && (
        <div className="ev-panel" id={panelId}>
          <ul className="ev-cards">
            {evidence.map((c) => (
              <li key={c.id} className="ev-card">
                <p className="ev-finding">{c.statement}</p>
                <ul className="ev-sources">
                  {c.sources.map((s, i) => (
                    <li key={i} className="ev-src">
                      <span className="ev-src-kind">{s.kind}</span>
                      <span className="ev-src-title">{s.title}</span>
                      <span className="ev-src-loc">{s.locator}</span>
                    </li>
                  ))}
                </ul>
                {c.limitation !== null && <p className="ev-card-limit">{c.limitation}</p>}
              </li>
            ))}
          </ul>
          <Link className="ev-workspace" href={workspaceHref}>Open full evidence workspace →</Link>
        </div>
      )}
    </div>
  );
}
