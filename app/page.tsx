import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <p className="eyebrow">Why Here?</p>
      <h1>An Atlas of Industrial Advantage</h1>
      <p className="lead">
        An evidence-based research instrument. Every displayed assertion resolves
        to a sourced claim, and the evidence&rsquo;s standing stays visible.
      </p>

      <section>
        <h2>Cases</h2>
        <Link
          href="/cases/netherlands-semiconductor-equipment"
          className="case-card"
        >
          <div>
            <div className="cc-title">Netherlands × Semiconductor Equipment</div>
            <div className="cc-sub">
              Research in progress · founding period documented most strongly
            </div>
          </div>
          <span className="cc-open">Open case →</span>
        </Link>
      </section>
    </>
  );
}
