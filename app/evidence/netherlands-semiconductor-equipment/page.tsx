import type { Metadata } from 'next';
import { buildNetherlandsResearchView } from '@/lib/researchViewModel';
import { CaseResearchView } from '@/components/research/CaseResearchView.tsx';
import { evidenceContextImage } from '@/lib/media';

const CASE_ID = 'netherlands-semiconductor-equipment';

export const metadata: Metadata = {
  title: 'Netherlands × Semiconductor Equipment — Evidence — Why Here?',
  description:
    'Evidence workspace: the sourced claims, citations, provenance and limitations behind the Netherlands semiconductor-equipment case.',
};

/**
 * Canonical Evidence workspace route. Reuses the existing research view-model and
 * evidence components unchanged — no duplicated production-content loading.
 */
export default function NetherlandsEvidencePage() {
  const data = buildNetherlandsResearchView(CASE_ID);
  const cover = evidenceContextImage(CASE_ID);
  return (
    <>
      {cover !== null && (
        <figure className="evidence-context-media">
          <div className="ecm-frame">
            <img src={cover.src} alt={cover.alt} width={cover.width} height={cover.height} loading="lazy" decoding="async" />
            {cover.temporalContext === 'present_day' && <span className="ecm-badge">Present-day context — not the 1980s site</span>}
          </div>
          <figcaption className="ecm-cap">
            <span className="ecm-caption">{cover.caption}</span>
            <span className="ecm-credit">
              {cover.credit}
              {cover.licenseUrl !== null && (<> · <a href={cover.licenseUrl} target="_blank" rel="noreferrer">licence</a></>)}
              {' · '}<a href={cover.sourceUrl} target="_blank" rel="noreferrer">source</a>
            </span>
          </figcaption>
        </figure>
      )}
      <CaseResearchView data={data} />
    </>
  );
}
