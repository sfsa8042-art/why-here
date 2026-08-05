import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Why Here? — An interactive atlas of industrial strengths',
  description:
    'Explore the firms, institutions and historical decisions behind national industrial strengths.',
};

const NL_ROUTE = '/atlas/netherlands-semiconductor-equipment';

/**
 * Country signals overlaid on the map (desktop) / a compact strip (mobile). The
 * three are a real accessible list; the pins are decorative.
 *
 * `xPercent`/`yPercent` are the GEOGRAPHIC anchor — the exact centre of each real
 * `.atlas-nav-marker`, measured on the same `/atlas` camera + `.atlas9-stage`
 * crop that produced `public/landing/atlas-world.webp` (see that folder's README
 * and the scratchpad `mapshot.mjs`). They are percentages of the map asset, and
 * the overlay layer shares the map's exact coordinate space, so the dot lands on
 * the country at every viewport — never a hand-typed hero percentage. `labelOffset*`
 * moves only the TEXT away from the small island; it never moves the anchor.
 */
interface CountrySignal {
  slug: string; country: string; spec: string; status: string; tone: 'avail' | 'planned';
  xPercent: number; yPercent: number; labelOffsetX: number; labelOffsetY: number;
}
const SIGNALS: CountrySignal[] = [
  { slug: 'netherlands-semiconductor-equipment', country: 'Netherlands', spec: 'Lithography equipment', status: 'Story available', tone: 'avail', xPercent: 25.2, yPercent: 27.64, labelOffsetX: 15, labelOffsetY: -26 },
  { slug: 'france-luxury', country: 'France', spec: 'Luxury', status: 'Planned', tone: 'planned', xPercent: 23.71, yPercent: 35.76, labelOffsetX: 15, labelOffsetY: 6 },
  { slug: 'taiwan-semiconductor-manufacturing', country: 'Taiwan', spec: 'Semiconductor manufacturing', status: 'Planned', tone: 'planned', xPercent: 79.8, yPercent: 62.61, labelOffsetX: -104, labelOffsetY: 16 },
];

/**
 * Public landing page (Stage 10.2 — editorial geographic documentary). The hero
 * is one integrated composition: the REAL atlas map (a static, optimised local
 * image generated from the /atlas neutral state) fills the right of the hero and
 * bleeds under an editorial dark gradient that carries the message on the left.
 * Country signals are overlaid directly on the map. A compact process rail follows.
 */
export default function HomePage() {
  const steps = [
    { n: '01', t: 'Choose a country', d: 'Explore one of its distinctive industrial strengths.' },
    { n: '02', t: 'Understand the industry', d: 'See what it produces, how it works and why it matters.' },
    { n: '03', t: 'Trace how the strength developed', d: 'Follow the firms, institutions and decisions behind it.' },
  ];

  return (
    <div className="landing">
      <section className="lhero" aria-label="Introduction">
        <div className="lhero-media">
          {/* The map lives in a wrapper locked to the asset's aspect ratio, so the
              signal overlay layer can share the map's exact coordinate space. */}
          <div className="lhero-mapwrap">
            <Image
              className="lhero-img"
              src="/landing/atlas-world.webp"
              alt="A world map from the Why Here? atlas, marking the Netherlands (story available) with Taiwan and France planned."
              fill
              priority
              sizes="(max-width: 860px) 100vw, 72vw"
            />
          </div>
          <span className="lhero-scrim" aria-hidden="true" />
        </div>

        <ul className="lhero-signals" aria-label="Countries in the atlas">
          {SIGNALS.map((s) => (
            <li key={s.slug} className={`lsig lsig--${s.tone}`} style={{ left: `${s.xPercent}%`, top: `${s.yPercent}%` }}>
              <span className="lsig-pin" aria-hidden="true" />
              <span className="lsig-body" style={{ transform: `translate(${s.labelOffsetX}px, ${s.labelOffsetY}px)` }}>
                <span className="lsig-country">{s.country}</span>
                <span className="lsig-spec">{s.spec}</span>
                <span className="lsig-status">{s.status}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="lhero-content">
          <p className="lhero-eyebrow">WHY HERE?</p>
          <h1 className="lhero-title">Why do industries take root in particular places?</h1>
          <p className="lhero-desc">Explore the firms, institutions and historical decisions behind national industrial strengths.</p>
          <div className="lhero-actions">
            <Link className="btn btn-primary lhero-cta" href="/atlas">Explore the atlas</Link>
            <Link className="lhero-featured" href={NL_ROUTE}>
              <span className="lf-eyebrow">Featured story</span>
              <span className="lf-title">Netherlands × Semiconductor lithography</span>
              <span className="lf-action"><span className="lf-action-text">Explore story </span><span className="lf-arrow" aria-hidden="true">→</span></span>
            </Link>
            <p className="lhero-meta">
              <span className="lhero-leg"><span className="lhero-leg-dot lhero-leg-dot--avail" aria-hidden="true" />1 story available</span>
              <span className="lhero-leg"><span className="lhero-leg-dot lhero-leg-dot--planned" aria-hidden="true" />2 planned</span>
            </p>
          </div>
        </div>

        <p className="lhero-prop">Geography explains where industries are. <strong>Why Here? investigates why they took root there.</strong></p>
      </section>

      <section className="lrail" aria-label="How it works">
        <h2 className="lrail-h">HOW IT WORKS</h2>
        <ol className="lrail-list">
          {steps.map((s) => (
            <li key={s.n} className="lrail-step">
              <span className="lrail-n">{s.n}</span>
              <h3 className="lrail-t">{s.t}</h3>
              <p className="lrail-d">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
