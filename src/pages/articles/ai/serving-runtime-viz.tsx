interface RuntimeStage {
  label: string;
  owner: string;
  evidence: string;
}

export function RuntimeRequestPath({ stages }: { stages: RuntimeStage[] }) {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border" data-article-viz data-viz-canvas>
      <div className="border-b border-border bg-muted/25 px-4 py-3">
        <p className="text-xs font-bold text-muted-foreground">한 요청의 실행 경로</p>
      </div>
      <ol className="grid min-w-0 divide-y divide-border lg:grid-cols-4 lg:divide-x lg:divide-y-0">
        {stages.map((stage, index) => (
          <li className="min-w-0 px-4 py-4" key={stage.label}>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
              <p className="min-w-0 text-sm font-bold leading-snug">{stage.label}</p>
            </div>
            <p className="mt-3 text-xs font-semibold text-foreground">책임: {stage.owner}</p>
            <p className="mt-1 break-words text-xs leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">증거: {stage.evidence}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function RuntimeEvidenceLedger({ rows }: { rows: Array<{ symptom: string; check: string; decision: string }> }) {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border" data-article-viz data-viz-canvas>
      <div className="border-b border-border bg-muted/25 px-4 py-3">
        <p className="text-xs font-bold text-muted-foreground">증상에서 조치까지의 운영 장부</p>
      </div>
      <div className="divide-y divide-border">
        {rows.map((row) => (
          <div className="grid min-w-0 gap-3 px-4 py-4 md:grid-cols-3" key={row.symptom}>
            <div className="min-w-0"><p className="text-xs font-bold text-muted-foreground">증상</p><p className="mt-1 break-words text-sm leading-relaxed [overflow-wrap:anywhere]">{row.symptom}</p></div>
            <div className="min-w-0"><p className="text-xs font-bold text-muted-foreground">먼저 확인</p><p className="mt-1 break-words text-sm leading-relaxed [overflow-wrap:anywhere]">{row.check}</p></div>
            <div className="min-w-0"><p className="text-xs font-bold text-muted-foreground">판단</p><p className="mt-1 break-words text-sm leading-relaxed [overflow-wrap:anywhere]">{row.decision}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}
