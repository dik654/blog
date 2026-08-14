const path = [
  ["HBM tensor", "다차원 source layout"],
  ["TMA", "descriptor 기반 async transfer"],
  ["Shared / DSM", "block 또는 cluster가 소비"],
  ["Tensor Cores", "matrix tile 계산"],
] as const;

export function HopperPipelineViz() {
  return <figure data-viz="hopper-pipeline" className="not-prose my-9 overflow-hidden rounded-xl border border-border bg-card"><figcaption className="border-b border-border px-5 py-4 sm:px-6"><p className="text-xs font-semibold text-primary">Producer–consumer pipeline</p><p className="mt-1 text-base font-bold">Hopper의 새 기능은 peak 숫자보다 data 이동과 계산 역할을 분리한다</p></figcaption><div data-viz-canvas className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">{path.map(([title,body],i)=><section key={title} className="relative min-w-0 rounded-lg border border-border bg-background p-4"><p className="text-[11px] font-bold text-primary">0{i+1}</p><p className="mt-2 text-sm font-bold">{title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p>{i<path.length-1?<span aria-hidden className="absolute -right-3 top-1/2 hidden -translate-y-1/2 bg-card px-1 text-muted-foreground lg:block">→</span>:null}</section>)}</div></figure>;
}

export function ClusterScopeViz() {
  const rows=[["Thread","register","자기 instruction"],["Block","shared memory","block barrier"],["Cluster","DSM","cluster sync·rank"],["Grid","global memory","kernel boundary"]] as const;
  return <figure data-viz="hopper-cluster-scope" className="not-prose my-9 rounded-xl border border-border bg-card p-5 sm:p-6"><figcaption><p className="text-xs font-semibold text-primary">협력 범위가 하나 늘어났다</p><p className="mt-1 text-base font-bold">Cluster는 모든 block을 하나로 합치는 기능이 아니다</p></figcaption><div data-viz-canvas className="mt-5 grid gap-3 sm:grid-cols-2">{rows.map(([scope,memory,sync])=><section key={scope} className="min-w-0 rounded-lg border border-border bg-background p-4"><div className="flex flex-wrap items-center justify-between gap-2"><strong className="text-sm">{scope}</strong><span className="rounded-md bg-muted px-2 py-1 text-[11px] font-semibold">{memory}</span></div><p className="mt-2 text-xs text-muted-foreground">{sync}</p></section>)}</div></figure>;
}
