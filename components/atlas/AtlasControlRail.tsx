import type { AtlasViewModel } from '@/lib/atlasViewModel';
import type { EvidenceFilter } from '@/lib/atlasState';

/**
 * Left analytical control rail — compact technical controls, not cards.
 * Evidence filter, reset view, and a keyboard-accessible place list (the DOM
 * equivalent of the map markers).
 */
const FILTERS: { key: EvidenceFilter; label: string }[] = [
  { key: 'all', label: 'All evidence' },
  { key: 'mappable', label: 'Geographically anchored' },
  { key: 'non_mappable', label: 'Not geographically anchored' },
];

export function AtlasControlRail({
  data,
  filter,
  activePhase,
  selectedPlaceId,
  onSetFilter,
  onSetPhase,
  onReset,
  onSelectPlace,
}: {
  data: AtlasViewModel;
  filter: EvidenceFilter;
  activePhase: string | null;
  selectedPlaceId: string | null;
  onSetFilter: (f: EvidenceFilter) => void;
  onSetPhase: (phase: string | null) => void;
  onReset: () => void;
  onSelectPlace: (placeId: string, claimId: string) => void;
}) {
  const activePhaseObj = data.phases.find((p) => p.key === activePhase) ?? null;
  const phaseAnchorCount = activePhaseObj?.anchorCount ?? data.anchorCount;

  return (
    <aside className="atlas-rail" aria-label="Atlas controls">
      <div className="rail-group" role="group" aria-label="Evidence filter">
        <p className="rail-heading">Filter</p>
        {FILTERS.map((f) => (
          <button
            type="button"
            key={f.key}
            className="rail-btn"
            aria-pressed={filter === f.key}
            onClick={() => onSetFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="rail-group" role="group" aria-label="Phase filter">
        <p className="rail-heading">Phase</p>
        <button
          type="button"
          className="rail-btn"
          aria-pressed={activePhase === null}
          onClick={() => onSetPhase(null)}
        >
          All periods
        </button>
        {data.phases.map((p) => (
          <button
            type="button"
            key={p.key}
            className="rail-btn"
            aria-pressed={activePhase === p.key}
            onClick={() => onSetPhase(p.key)}
          >
            <span className="rb-phase-label">{p.label}</span>
            <span className="rb-phase-years">{p.years} · {p.anchorCount} anchor{p.anchorCount === 1 ? '' : 's'}</span>
          </button>
        ))}
        {activePhase !== null && phaseAnchorCount === 0 && (
          <p className="rail-note">No verified geographic anchor in this phase.</p>
        )}
      </div>

      <div className="rail-group">
        <p className="rail-heading">Verified anchors ({data.anchorCount})</p>
        <ul className="atlas-place-list">
          {data.places.map((p) => {
            const link = data.links.find((l) => l.placeId === p.id);
            return (
              <li key={p.id}>
                <button
                  type="button"
                  className="atlas-place-btn"
                  aria-pressed={selectedPlaceId === p.id}
                  onClick={() => link && onSelectPlace(p.id, link.claimId)}
                  disabled={link === undefined}
                >
                  <span className="apb-name">{p.name}</span>
                  <span className="apb-meta">
                    {link?.relationship} · {p.precision}-level · {link?.temporalScopeLabel}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rail-group">
        <button type="button" className="rail-btn rail-reset" onClick={onReset}>
          Reset view
        </button>
      </div>
    </aside>
  );
}
