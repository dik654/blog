const rows = [
  ["01", "Prune", "mask · shape · target sparsity", "checkpoint + manifest"],
  ["02", "Enforce", "parameter와 optimizer state에 mask", "zero-regrowth test"],
  ["03", "Recover", "fine-tune 또는 distillation", "training receipt"],
  ["04", "Rebuild", "sparse encoding · engine compile", "tactic coverage"],
  ["05", "Decide", "quality · memory · latency", "accept / stop / revise"],
] as const;

export default function RecoveryViz() {
  return (
    <figure data-viz className="overflow-hidden rounded-xl border border-border bg-card">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-semibold text-muted-foreground">Prune–recover evidence loop</p>
        <h3 className="mt-1 text-base font-semibold">각 단계는 다음 단계가 확인할 산출물을 남깁니다</h3>
      </figcaption>
      <div>
        {rows.map(([n, title, action, artifact]) => (
          <div key={n} className="grid min-w-0 grid-cols-[2.25rem_minmax(0,.7fr)_minmax(0,1.4fr)] gap-3 border-b border-border/70 px-4 py-3 last:border-b-0 sm:grid-cols-[2.5rem_minmax(0,.65fr)_minmax(0,1.3fr)_minmax(0,1fr)] sm:px-5">
            <span className="font-mono text-xs text-muted-foreground">{n}</span>
            <strong className="text-sm">{title}</strong>
            <span className="min-w-0 text-sm text-muted-foreground">{action}</span>
            <span className="col-start-3 text-xs text-muted-foreground sm:col-auto">{artifact}</span>
          </div>
        ))}
      </div>
      <p className="border-t border-border bg-muted/20 px-4 py-3 text-xs leading-5 text-muted-foreground sm:px-5">
        다음 cycle은 더 높은 sparsity가 아니라 이전 cycle 대비 운영 목적의 한계효용이 남아 있을 때만 진행합니다.
      </p>
    </figure>
  );
}
