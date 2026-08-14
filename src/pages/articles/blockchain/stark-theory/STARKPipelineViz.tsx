const phases = [
  { n: "01", name: "Trace", detail: "실행을 field table로 기록" },
  { n: "02", name: "AIR", detail: "전이·경계 제약 작성" },
  { n: "03", name: "Composition", detail: "제약을 한 polynomial로 결합" },
  { n: "04", name: "LDE + commit", detail: "넓은 domain에 평가·Merkle 봉인" },
  { n: "05", name: "FRI", detail: "low-degree proximity를 query" },
];

export default function STARKPipelineViz() {
  return (
    <figure data-viz="stark-proof-pipeline" data-viz-canvas className="not-prose my-8 min-w-0 rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <figcaption className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Trace → AIR → FRI</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">STARK는 실행이 맞다는 주장을 low-degree oracle 검증 문제까지 단계적으로 낮춥니다.</p>
      </figcaption>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {phases.map((phase, index) => (
          <div key={phase.n} className="relative min-w-0 rounded-lg border border-border/80 bg-background p-4">
            <p className="text-xs font-bold text-primary">{phase.n}</p>
            <p className="mt-2 text-sm font-semibold">{phase.name}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{phase.detail}</p>
            {index < phases.length - 1 && <span aria-hidden className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-sm text-muted-foreground lg:block">→</span>}
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border/70 bg-muted/20 p-3 text-xs"><strong>공개</strong><p className="mt-1 leading-5 text-muted-foreground">statement, roots, challenges, query openings</p></div>
        <div className="rounded-lg border border-border/70 bg-muted/20 p-3 text-xs"><strong>보안 근거</strong><p className="mt-1 leading-5 text-muted-foreground">hash commitment, code distance, sampling, transcript</p></div>
        <div className="rounded-lg border border-border/70 bg-muted/20 p-3 text-xs"><strong>별도 옵션</strong><p className="mt-1 leading-5 text-muted-foreground">trace blinding과 zero-knowledge 설정</p></div>
      </div>
    </figure>
  );
}
