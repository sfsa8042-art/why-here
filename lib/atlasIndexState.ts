/**
 * lib/atlasIndexState.ts — pure, testable selection/filter logic for the Atlas
 * index. No global state-management dependency; the client shell drives it.
 */

import {
  casesByIndustry,
  casesByStatus,
  type AtlasCase,
  type StatusFilterValue,
} from './atlasCases.ts';

export interface AtlasIndexState {
  selectedCaseId: string | null;
  statusFilter: StatusFilterValue;
  industryFilter: string | null;
}

/**
 * Neutral initial state (Stage 9): NO case is selected on first load. The map
 * opens on the world view and the user chooses a country — the atlas never
 * pre-selects a case (in particular, never the Netherlands).
 */
export function initialAtlasIndexState(): AtlasIndexState {
  return { selectedCaseId: null, statusFilter: 'all', industryFilter: null };
}

/** Cases visible under the current status + industry filters. */
export function visibleCases(cases: readonly AtlasCase[], state: AtlasIndexState): AtlasCase[] {
  return casesByIndustry(casesByStatus(cases, state.statusFilter), state.industryFilter);
}

/**
 * Recover the selection after a filter change: keep the current selection if it
 * is still visible, otherwise return to the NEUTRAL (no selection) state. The
 * atlas never auto-selects a replacement case — closing/filtering-out a country
 * returns to the world view.
 */
export function recoverSelection(visible: readonly AtlasCase[], selectedCaseId: string | null): string | null {
  if (selectedCaseId !== null && visible.some((c) => c.id === selectedCaseId)) return selectedCaseId;
  return null;
}

export type AtlasIndexAction =
  | { type: 'selectCase'; caseId: string }
  | { type: 'deselect' }
  | { type: 'setStatusFilter'; status: StatusFilterValue }
  | { type: 'setIndustryFilter'; industry: string | null }
  | { type: 'reset' };

/** Pure reducer; selection is always recovered against the resulting visible set. */
export function atlasIndexReducer(
  cases: readonly AtlasCase[],
  state: AtlasIndexState,
  action: AtlasIndexAction,
): AtlasIndexState {
  switch (action.type) {
    case 'selectCase':
      return { ...state, selectedCaseId: action.caseId };
    case 'deselect':
      return { ...state, selectedCaseId: null };
    case 'setStatusFilter': {
      const next = { ...state, statusFilter: action.status };
      return { ...next, selectedCaseId: recoverSelection(visibleCases(cases, next), state.selectedCaseId) };
    }
    case 'setIndustryFilter': {
      const next = { ...state, industryFilter: action.industry };
      return { ...next, selectedCaseId: recoverSelection(visibleCases(cases, next), state.selectedCaseId) };
    }
    case 'reset': {
      const next: AtlasIndexState = { ...state, statusFilter: 'all', industryFilter: null };
      return { ...next, selectedCaseId: recoverSelection(visibleCases(cases, next), state.selectedCaseId) };
    }
    default:
      return state;
  }
}
