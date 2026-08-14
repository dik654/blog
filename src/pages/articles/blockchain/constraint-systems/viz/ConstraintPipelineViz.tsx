const rows = [
  { label: "public x", value: "3", tone: "border-sky-400/40 bg-sky-400/5" },
  { label: "witness w", value: "4", tone: "border-border bg-violet-400/5" },
  { label: "output y", value: "12", tone: "border-emerald-400/40 bg-emerald-400/5" },
] as const;

export default function ConstraintPipelineViz() {
  return (
    <figure data-viz="constraint-r1cs-qap" data-viz-canvas className="not-prose my-8 min-w-0 rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <figcaption className="mb-5">
        <p className="text-sm font-semibold text-foreground">한 곱셈 관계가 행렬의 한 행과 다항식 항등식으로 바뀐다</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">표현은 달라도 검증하려는 명제는 같습니다. 공개 입력은 verifier가 알고, witness만 prover가 압니다.</p>
      </figcaption>
      <div className="grid gap-3 sm:grid-cols-3">
        {rows.map((row) => (
          <div key={row.label} className={`min-w-0 rounded-lg border p-3 ${row.tone}`}>
            <p className="text-xs text-muted-foreground">{row.label}</p>
            <p className="mt-1 break-words font-mono text-sm font-semibold text-foreground">{row.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch">
        <div className="min-w-0 rounded-lg border border-border bg-background p-4">
          <p className="text-xs font-semibold text-primary">산술 관계</p>
          <p className="mt-2 break-words font-mono text-xs leading-5">x · w = y</p>
        </div>
        <span aria-hidden className="self-center text-center text-sm text-muted-foreground">→</span>
        <div className="min-w-0 rounded-lg border border-border bg-background p-4">
          <p className="text-xs font-semibold text-primary">R1CS 한 행</p>
          <p className="mt-2 break-words font-mono text-xs leading-5">⟨A,z⟩ · ⟨B,z⟩ = ⟨C,z⟩</p>
        </div>
        <span aria-hidden className="self-center text-center text-sm text-muted-foreground">→</span>
        <div className="min-w-0 rounded-lg border border-primary/30 bg-primary/5 p-4">
          <p className="text-xs font-semibold text-primary">QAP</p>
          <p className="mt-2 break-words font-mono text-xs leading-5">t(X) | A(X)B(X)−C(X)</p>
        </div>
      </div>
    </figure>
  );
}
