import type { Metadata } from 'next';
import Link from 'next/link';
import { buildNetherlandsResearchView } from '@/lib/researchViewModel';
import { CaseResearchView } from '@/components/research/CaseResearchView.tsx';
import { evidenceContextImage } from '@/lib/media';

const CASE_ID = 'netherlands-semiconductor-equipment';

export const metadata: Metadata = {
  title: 'Netherlands × Semiconductor Equipment — Evidence — Why Here?',
  description:
    'The complete research record behind the Netherlands semiconductor-equipment visual story: documented findings, their sources and their limitations.',
};

/**
 * Canonical Evidence workspace route. A public-facing introduction explains what
 * the reader is looking at BEFORE the professional research components begin; the
 * existing detailed research UI is retained unchanged below it.
 */
export default function NetherlandsEvidencePage() {
  const data = buildNetherlandsResearchView(CASE_ID);
  const cover = evidenceContextImage(CASE_ID);
  return (
    <>
      <section className="evidence-intro" aria-label="What this is">
        <p className="ev-intro-eyebrow">Evidence behind the story</p>
        <h1 className="ev-intro-title">The complete research record</h1>
        <p className="ev-intro-lead">
          This is the professional research workspace behind the visual story — every
          documented finding, the sources it rests on, and what the evidence does not yet
          establish. The visual story is the plain-language reading of what is here.
        </p>
        <ul className="ev-intro-summary">
          <li><span className="ev-intro-num">{data.claimCount}</span> documented findings</li>
          <li><span className="ev-intro-num">{data.sourceCount}</span> sources</li>
          <li><span className="ev-intro-num">{data.mappedAddressCount}</span> mapped organisation addresses</li>
        </ul>
        <div className="ev-intro-actions">
          <Link className="ev-intro-btn ev-intro-btn-primary" href={`/atlas/${CASE_ID}`}>← Return to visual story</Link>
          <a className="ev-intro-btn ev-intro-btn-secondary" href="#research-record">Browse full research record ↓</a>
          <Link className="ev-intro-btn ev-intro-btn-quiet" href="/atlas">Back to the atlas</Link>
        </div>
      </section>

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
      <div id="research-record" tabIndex={-1}>
        <CaseResearchView data={data} />
      </div>
    </>
  );
}
