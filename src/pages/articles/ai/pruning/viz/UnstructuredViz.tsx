const steps = [
  ["01", "Score", "|w| 또는 gradient×weight", "selection evidence"],
  ["02", "Mask", "global / layer-wise budget", "reported sparsity"],
  ["03", "Encode", "values + indices + metadata", "actual bytes"],
  ["04", "Execute", "supported sparse operator", "kernel coverage"],
  ["05", "Verify", "quality · memory · p95", "deployment decision"],
] as const;

export default function UnstructuredViz() {
  return (
    <figure data-viz className="overflow-hidden rounded-xl border border-border bg-card">
      <figcaption className="px-4 py-4 sm:px-5">
        <p className="text-xs font-semibold text-muted-foreground">Unstructured pruning trace</p>
        <h3 className="mt-1 text-base font-semibold">0을 고르는 일과 속도를 얻는 일 사이에는 세 단계가 더 있습니다</h3>
      </figcaption>
      <div className="border-t border-border">
        {steps.map(([n, title, detail, evidence], index) => (
          <div key={title} className="grid min-w-0 grid-cols-[2.5rem_minmax(0,.7fr)_minmax(0,1.25fr)] items-start gap-3 border-b border-border/70 px-4 py-3 last:border-b-0 sm:grid-cols-[3rem_minmax(0,.6fr)_minmax(0,1.1fr)_minmax(0,.8fr)] sm:px-5">
            <span className="font-mono text-xs text-muted-foreground">{n}</span>
            <strong className="text-sm">{title}</strong>
            <span className="min-w-0 text-sm text-muted-foreground">{detail}</span>
            <span className="col-start-3 text-xs text-muted-foreground sm:col-auto">{evidence}</span>
            {index < steps.length - 1 && <span aria-hidden className="sr-only">다음 단계</span>}
          </div>
        ))}
      </div>
      <p className="border-t border-border bg-muted/20 px-4 py-3 text-xs leading-5 text-muted-foreground sm:px-5">
        중간 evidence가 없으면 “60% sparse”는 checkpoint 속성일 뿐, 배포 성능에 대한 결론이 아닙니다.
      </p>
    </figure>
  );
}
