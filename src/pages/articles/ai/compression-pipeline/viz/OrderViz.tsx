const rows = [
  ["01", "기준 고정", "θ₀ · workload · split", "baseline receipt"],
  ["02", "구조 결정", "student 또는 pruned graph", "새 activation 분포"],
  ["03", "품질 회복", "fine-tune · distill", "quality checkpoint"],
  ["04", "Calibration", "final graph statistics", "quantization config"],
  ["05", "Build·검증", "compiler · kernel · load", "비교 가능한 receipt"],
] as const;

export default function OrderViz() {
  return (
    <figure
      data-viz
      className="overflow-hidden rounded-xl border border-border bg-card"
    >
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-semibold text-muted-foreground">
          Artifact chain
        </p>
        <h3 className="mt-1 text-base font-semibold">
          구조가 바뀌면 activation 통계와 engine을 다시 만듭니다
        </h3>
      </figcaption>
      <div>
        {rows.map(([number, title, input, output]) => (
          <div
            key={number}
            className="grid grid-cols-[2.4rem_minmax(0,.65fr)_minmax(0,1.15fr)] gap-3 border-b border-border/70 px-4 py-3 text-sm last:border-b-0 sm:grid-cols-[2.5rem_minmax(0,.6fr)_minmax(0,1fr)_minmax(0,1fr)] sm:px-5"
          >
            <span className="font-mono text-xs text-primary">{number}</span>
            <strong className="break-keep">{title}</strong>
            <span className="min-w-0 text-muted-foreground">{input}</span>
            <span className="col-start-3 text-xs text-muted-foreground sm:col-auto">
              {output}
            </span>
          </div>
        ))}
      </div>
    </figure>
  );
}
