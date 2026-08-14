const cases = [
  ["same forkhash", "remote next가 local head를 이미 지났나?", "아니면 연결"],
  ["remote is subset", "remote next가 local history의 다음 fork인가?", "맞으면 연결"],
  ["remote is superset", "known future forks로 remote hash를 만들 수 있나?", "맞으면 연결"],
  ["none", "공통 lineage를 설명할 수 없음", "거절"],
] as const;

export function ForkIdMatrixViz(){return <figure className="rounded-xl border border-border bg-card p-4 sm:p-6"><figcaption className="mb-4 text-sm font-semibold">EIP-2124는 equality test가 아니라 local-head-aware validation이다</figcaption><div className="grid gap-3 sm:grid-cols-2">{cases.map(([t,q,a],i)=><div key={t} className="rounded-lg border border-border bg-background p-4"><div className="flex items-center justify-between gap-3"><p className="font-mono text-sm font-semibold">{t}</p><span className="rounded-full border border-border px-2 py-1 text-[11px] text-muted-foreground">case {i+1}</span></div><p className="mt-3 text-sm leading-6 text-muted-foreground">{q}</p><p className="mt-2 text-sm font-semibold text-primary">{a}</p></div>)}</div></figure>}

export function ForkHashTraceViz(){return <figure className="rounded-xl border border-border bg-card p-4 sm:p-6"><figcaption className="mb-4 text-sm font-semibold">Fork hash 누산 순서</figcaption><div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">{[["genesis hash","chain identity 시작"],["passed fork #1","uint64 big-endian"],["passed fork #2","CRC32 계속 누산"]].map((x,i)=><div key={x[0]} className="contents"><div className="rounded-lg border border-border bg-background p-4"><p className="text-xs font-semibold text-primary">0{i+1}</p><p className="mt-2 font-semibold">{x[0]}</p><p className="mt-1 text-xs text-muted-foreground">{x[1]}</p></div>{i<2&&<span className="hidden text-muted-foreground md:block" aria-hidden>→</span>}</div>)}</div><p className="mt-4 text-xs leading-5 text-muted-foreground">아직 지나지 않은 fork는 hash에 넣지 않고 가장 가까운 것을 FORK_NEXT로 알립니다.</p></figure>}
