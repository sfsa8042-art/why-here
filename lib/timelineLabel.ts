/**
 * Why Here? — An Atlas of Industrial Advantage
 * lib/timelineLabel.ts — Increment 3: deterministic timeline labels.
 *
 * Display labels are GENERATED from the linked Claim statement, never
 * authored (CONTENT_MODEL.md, DECISION_LOG "Timeline labels are
 * generated, not authored"). This removes the label-smuggling channel
 * entirely: the function below is pure, total and deterministic, and
 * can only ever remove trailing words from the statement.
 *
 * Not a UI component; UI increments consume it.
 */

/** The single character appended when (and only when) truncation occurs. */
export const TIMELINE_LABEL_ELLIPSIS = '…';

/**
 * Pure, total truncation:
 * - whitespace is normalized (trim + collapse), nothing else changes;
 * - if the normalized statement fits in `maxLen`, it is returned as-is
 *   with no ellipsis;
 * - otherwise the longest prefix of WHOLE words that fits in
 *   `maxLen - 1` is returned with one ellipsis appended — truncation
 *   never cuts inside a word and never introduces a word absent from
 *   the statement;
 * - if not even the first word fits, the label degrades to the ellipsis
 *   alone rather than slicing a word;
 * - `maxLen <= 0` (or a non-finite maxLen) yields the empty string;
 * - idempotent: feeding a generated label back in with the same maxLen
 *   returns it unchanged.
 */
export function generateTimelineLabel(statement: string, maxLen: number): string {
  if (!Number.isFinite(maxLen) || maxLen <= 0) return '';

  const normalized = statement.trim().replace(/\s+/g, ' ');
  if (normalized.length === 0) return '';
  if (normalized.length <= maxLen) return normalized;

  const budget = maxLen - TIMELINE_LABEL_ELLIPSIS.length;
  if (budget <= 0) return TIMELINE_LABEL_ELLIPSIS;

  let label = '';
  for (const word of normalized.split(' ')) {
    const candidate = label.length === 0 ? word : `${label} ${word}`;
    if (candidate.length > budget) break;
    label = candidate;
  }
  if (label.length === 0) return TIMELINE_LABEL_ELLIPSIS;
  return `${label}${TIMELINE_LABEL_ELLIPSIS}`;
}
