import Link from 'next/link';
import type { AtlasViewModel } from '@/lib/atlasViewModel';

/**
 * Accessible, WebGL-free fallback. Shown inside the map stage whenever
 * MapLibre or the basemap is unavailable — never a blank rectangle. Lists the
 * verified Places as real DOM buttons that open the evidence drawer, and keeps
 * the link to the complete evidence view. Also usable as the always-present
 * keyboard place list.
 */
export function AtlasFallback({
  data,
  reason,
  onSelectPlace,
}: {
  data: AtlasViewModel;
  reason?: string;
  onSelectPlace: (placeId: string, claimId: string) => void;
}) {
  const claimIdForPlace = (placeId: string): string | null =>
    data.links.find((l) => l.placeId === placeId)?.claimId ?? null;

  return (
    <div className="atlas-fallback" role="group" aria-label="Verified geographic anchors">
      {reason !== undefined && <p className="atlas-fallback-reason">{reason}</p>}
      <p className="atlas-fallback-lead">
        {data.anchorCount} verified city anchor{data.anchorCount === 1 ? '' : 's'} ·
        {' '}
        {data.basemapNote}
      </p>
      <ul className="atlas-place-list">
        {data.places.map((p) => {
          const claimId = claimIdForPlace(p.id);
          const link = data.links.find((l) => l.placeId === p.id);
          return (
            <li key={p.id}>
              <button
                type="button"
                className="atlas-place-btn"
                onClick={() => claimId && onSelectPlace(p.id, claimId)}
                disabled={claimId === null}
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
      <Link className="atlas-fallback-link" href="/cases/netherlands-semiconductor-equipment">
        Full evidence view →
      </Link>
    </div>
  );
}
