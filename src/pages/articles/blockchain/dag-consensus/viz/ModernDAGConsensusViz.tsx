const rounds = [
  { round: "r1", nodes: ["A1", "B1", "C1"] },
  { round: "r2", nodes: ["A2", "B2", "D2"] },
  { round: "r3", nodes: ["A3★", "C3", "D3"] },
] as const;

export function DAGCausalFlowViz() {
  return <figure data-viz="dag-causal-flow" className="not-prose my-8 min-w-0 rounded-xl border border-border/70 bg-card p-4 sm:p-6"><figcaption className="mb-5"><p className="text-sm font-semibold text-foreground">병렬 certificate가 causal history를 만든다</p><p className="mt-1 text-xs leading-5 text-muted-foreground">각 vertex는 이전 round의 quorum을 참조합니다. 별표 anchor를 commit하면 도달 가능한 과거를 함께 가져옵니다.</p></figcaption><div data-viz-canvas className="grid min-w-0 gap-5 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">{rounds.map((column,index)=><div key={column.round} className="contents"><div className="min-w-0 rounded-lg border border-border bg-background p-4"><p className="text-center text-[11px] font-semibold tracking-[.1em] text-primary">{column.round}</p><div className="mt-3 space-y-2">{column.nodes.map(node=><div key={node} className={`rounded-md border px-3 py-2 text-center text-xs font-semibold ${node.includes("★")?"border-primary/60 bg-primary/5 text-primary":"border-border text-foreground"}`}>{node}</div>)}</div></div>{index<rounds.length-1&&<span aria-hidden className="hidden text-muted-foreground md:block">→</span>}</div>)}</div><div className="mt-5 rounded-lg border border-border bg-background p-4 text-xs leading-5"><span className="font-semibold text-foreground">결정적 펼침:</span><span className="ml-2 text-muted-foreground">Ancestors(A3★) 중 미commit vertex를 protocol의 round·author·digest 규칙으로 정렬 → A1, B1, C1, A2, B2, D2, A3</span></div></figure>;
}

const split = [
  ["Dissemination", "Transaction batch를 저장하고 availability certificate를 만든다", "Narwhal DAG"],
  ["Ordering", "Anchor와 causal history 중 어떤 prefix를 commit할지 정한다", "Bullshark interpreter"],
  ["Execution", "결정된 vertex 안 transaction을 같은 규칙으로 적용한다", "Deterministic state machine"],
] as const;

export function DAGLayerBoundaryViz() {
  return <figure data-viz="dag-layer-boundary" className="not-prose my-8 min-w-0 overflow-hidden rounded-xl border border-border/70 bg-card"><figcaption className="border-b border-border/70 p-4 sm:p-6"><p className="text-sm font-semibold text-foreground">Data·order·execution을 서로 다른 성공으로 기록</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Certificate가 생겼다고 transaction이 commit·apply된 것은 아닙니다.</p></figcaption><div data-viz-canvas className="grid min-w-0 gap-4 p-4 sm:p-6 md:grid-cols-3">{split.map(([title,detail,owner],i)=><div key={title} className="relative min-w-0 rounded-lg border border-border bg-background p-4"><span className="text-[11px] font-semibold text-primary">0{i+1}</span><p className="mt-2 text-sm font-semibold text-foreground">{title}</p><p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{detail}</p><p className="mt-3 border-t border-border pt-3 text-[11px] text-muted-foreground">{owner}</p>{i<2&&<span aria-hidden className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-muted-foreground md:-right-3 md:bottom-auto md:left-auto md:top-1/2 md:translate-x-0 md:-translate-y-1/2">→</span>}</div>)}</div></figure>;
}
