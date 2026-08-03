import type { Metadata } from 'next';
import Link from 'next/link';
import { getAtlasCases, hasExploreCta } from '@/lib/atlasCases';

export const metadata: Metadata = {
  title: 'Why Here? — What countries become exceptionally good at',
  description:
    'Explore how industries work and how companies, institutions and historical decisions shaped national strengths.',
};

/** A restrained, decorative preview of the atlas map — a faint dot-world with the
 *  three case countries marked. Not interactive; the real map lives at /atlas. */
function LandingMapPreview() {
  const markers: { x: number; y: number; label: string; on: boolean }[] = [
    { x: 402, y: 150, label: 'Netherlands', on: true },
    { x: 388, y: 190, label: 'France', on: false },
    { x: 735, y: 208, label: 'Taiwan', on: false },
  ];
  return (
    <svg className="lmp-svg" viewBox="0 0 900 440" role="img" aria-label="Preview of the atlas world map with three marked countries">
      <defs>
        <pattern id="lmp-dots" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle className="lmp-dot" cx="2" cy="2" r="1.5" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="900" height="440" fill="url(#lmp-dots)" />
      {markers.map((m) => (
        <g key={m.label} className={`lmp-marker${m.on ? ' is-live' : ''}`}>
          <circle className="lmp-halo" cx={m.x} cy={m.y} r="16" />
          <circle className="lmp-pin" cx={m.x} cy={m.y} r="6" />
          <text className="lmp-text" x={m.x + 14} y={m.y + 4}>{m.label}</text>
        </g>
      ))}
    </svg>
  );
}

/**
 * Public landing page (Stage 9). A short, self-explaining entry point: the product
 * question, one clear "Explore the atlas" action into /atlas, a restrained map
 * preview and a plain-language description of the format. It deliberately does NOT
 * present the Netherlands featured investigation before the CTA.
 */
export default function HomePage() {
  const cases = getAtlasCases();
  const available = cases.filter((c) => hasExploreCta(c)).length;
  const planned = cases.filter((c) => c.status === 'planned').length;

  const steps = [
    'Choose a country',
    'Discover what it became exceptionally good at',
    'Understand the industry',
    'Explore how that strength developed',
  ];

  return (
    <div className="landing">
      <div className="landing-grid">
        <section className="landing-hero">
          <p className="landing-eyebrow">WHY HERE?</p>
          <h1 className="landing-title">What do different countries become exceptionally good at — and why?</h1>
          <p className="landing-desc">Explore how industries work and how companies, institutions and historical decisions shaped national strengths.</p>
          <div className="landing-cta">
            <Link className="btn btn-primary" href="/atlas">Explore the atlas</Link>
          </div>
          <p className="landing-count">{available} investigation{available === 1 ? '' : 's'} available · {planned} planned</p>
        </section>

        <div className="landing-preview" aria-hidden="false">
          <LandingMapPreview />
          <p className="landing-preview-cap">A living atlas — one country at a time.</p>
        </div>
      </div>

      <section className="landing-format" aria-label="How the atlas works">
        <h2 className="landing-format-h">How it works</h2>
        <ol className="landing-steps">
          {steps.map((s, i) => (
            <li key={i} className="landing-step">
              <span className="landing-step-n">{i + 1}</span>
              <span className="landing-step-t">{s}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
