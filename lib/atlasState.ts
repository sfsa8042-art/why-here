/**
 * lib/atlasState.ts — the atlas shared-selection reducer (M1).
 *
 * A small typed local state model (no global state-management dependency).
 * Pure and fully unit-testable; the client shell drives it with useReducer.
 */

export type EvidenceFilter = 'all' | 'mappable' | 'non_mappable';

export interface AtlasSelectionState {
  selectedClaimId: string | null;
  selectedPlaceId: string | null;
  activePeriod: string | null;
  evidenceFilter: EvidenceFilter;
  /** Evidence-boundary phase key, or null for "all periods". */
  activePhase: string | null;
  drawerOpen: boolean;
}

export const initialAtlasState: AtlasSelectionState = {
  selectedClaimId: null,
  selectedPlaceId: null,
  activePeriod: null,
  evidenceFilter: 'all',
  activePhase: null,
  drawerOpen: false,
};

export type AtlasAction =
  /** A map marker for a Place was activated (Place + its linked Claim). */
  | { type: 'selectMarker'; placeId: string; claimId: string; period: string | null }
  /** A timeline Claim was activated; placeId is null for non-mappable claims. */
  | { type: 'selectTimelineClaim'; claimId: string; placeId: string | null; period: string | null }
  | { type: 'closeDrawer' }
  | { type: 'escape' }
  | { type: 'setFilter'; filter: EvidenceFilter }
  | { type: 'setPhase'; phase: string | null }
  | { type: 'resetView' };

export function atlasReducer(
  state: AtlasSelectionState,
  action: AtlasAction,
): AtlasSelectionState {
  switch (action.type) {
    case 'selectMarker':
      return {
        ...state,
        selectedPlaceId: action.placeId,
        selectedClaimId: action.claimId,
        activePeriod: action.period,
        drawerOpen: true,
      };
    case 'selectTimelineClaim':
      /* mappable → select its Place; non-mappable → no Place is invented */
      return {
        ...state,
        selectedClaimId: action.claimId,
        selectedPlaceId: action.placeId,
        activePeriod: action.period,
        drawerOpen: true,
      };
    case 'closeDrawer':
    case 'escape':
      /* keep the selection highlighted and the filter/map untouched */
      return { ...state, drawerOpen: false };
    case 'setFilter':
      /* filtering never resets selection or map position */
      return { ...state, evidenceFilter: action.filter };
    case 'setPhase':
      /* phase filtering never resets selection or map position */
      return { ...state, activePhase: action.phase };
    case 'resetView':
      /* clear selection + drawer; keep the current evidence filter */
      return {
        ...state,
        selectedClaimId: null,
        selectedPlaceId: null,
        activePeriod: null,
        drawerOpen: false,
      };
    default:
      return state;
  }
}

/* ------------------------------------------------------------------ *
 * Pure selectors (evidence filter + phase filter)
 * ------------------------------------------------------------------ */

export interface AtlasFilterableClaim {
  mappable: boolean;
  /**
   * Every evidence-boundary phase this claim belongs to. Phases overlap on year
   * boundaries, so membership is many-to-many — a phase matches when it is one
   * of these keys, never by a single arbitrarily-chosen label.
   */
  phaseKeys: string[];
  placeId: string | null;
}

/** Does a claim pass BOTH the evidence filter and the phase filter? */
export function claimMatchesFilters(
  claim: AtlasFilterableClaim,
  filter: EvidenceFilter,
  phase: string | null,
): boolean {
  if (filter === 'mappable' && !claim.mappable) return false;
  if (filter === 'non_mappable' && claim.mappable) return false;
  if (phase !== null && !claim.phaseKeys.includes(phase)) return false;
  return true;
}

/**
 * Place ids that may be shown under the active phase: a place stays visible when
 * at least one of its linked (mappable) claims belongs to the phase. Never
 * invents a location — a place with no in-phase linked claim is simply omitted.
 */
export function visiblePlaceIds(
  claims: AtlasFilterableClaim[],
  phase: string | null,
): string[] {
  const ids = new Set<string>();
  for (const claim of claims) {
    if (!claim.mappable || claim.placeId === null) continue;
    if (phase === null || claim.phaseKeys.includes(phase)) ids.add(claim.placeId);
  }
  return [...ids];
}
