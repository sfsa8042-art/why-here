import type { CitationView } from '@/lib/researchViewModel';

/**
 * Shared citation renderer: source title, source classification (type ·
 * temporal · subject), evidence role + locator, note and provenance note.
 * Preserves complete traceability; used by the research spine drawer and the
 * atlas evidence drawer.
 */
export function CitationEvidenceBlock({ c }: { c: CitationView }) {
  return (
    <div className="cite">
      <div className="cite-head">
        <span className="cite-title">{c.sourceTitle}</span>
        <span className="cite-class">
          {c.sourceType} · {c.temporalRelation} · {c.subjectRelationship}
        </span>
      </div>
      <div className="cite-loc">
        {c.evidenceRole} · {c.locatorKind}: {c.locatorValue}
      </div>
      {c.note !== undefined && <div className="cite-note">{c.note}</div>}
      {c.provenanceNote !== undefined && <div className="cite-prov">{c.provenanceNote}</div>}
    </div>
  );
}
