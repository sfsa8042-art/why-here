import type { CaseResearchView } from '@/lib/researchViewModel';

/**
 * Panel A — research header. Title, research-in-progress status, the three
 * production research questions, source/claim counts, and the founding-vs-
 * viability boundary statement. No thesis is rendered (the case has none).
 */
export function ResearchHeader({ data }: { data: CaseResearchView }) {
  return (
    <header>
      <p className="eyebrow">Case · Why Here?</p>
      <div className="title-row">
        <h1>
          {data.country} × {data.industry}
        </h1>
        <span className="status-pill">{data.statusLabel}</span>
      </div>

      <p className="lead">{data.boundaryStatement}</p>

      <div className="counts">
        <div>
          <div className="n">{data.sourceCount}</div>
          <div className="k">Sources</div>
        </div>
        <div>
          <div className="n">{data.claimCount}</div>
          <div className="k">Claims</div>
        </div>
        <div>
          <div className="n">{data.researchQuestions.length}</div>
          <div className="k">Research questions</div>
        </div>
      </div>

      <section>
        <h2>Research questions</h2>
        <ul className="rq-list">
          {data.researchQuestions.map((q) => (
            <li key={q.id}>{q.question}</li>
          ))}
        </ul>
      </section>
    </header>
  );
}
