const lanes = [
  { name: "현재 배포", examples: "PoS · blobs · account abstraction ecosystem", mark: "●" },
  { name: "채택 검토", examples: "PQ signature agility · native rollup proposals", mark: "◐" },
  { name: "연구 방향", examples: "Binary-field proving · lean verification · leanISA", mark: "○" },
  { name: "실험 결과", examples: "개별 prototype·benchmark·formalized component", mark: "◇" },
] as const;

export default function EthereumRoadmapViz() {
  return <figure data-viz="ethereum-roadmap-lanes" className="not-prose rounded-xl border border-border bg-card p-4 sm:p-6">
    <figcaption><p className="text-sm font-bold">로드맵 문장을 같은 확정도로 읽지 않는다</p><p className="mt-1 text-sm leading-6 text-muted-foreground">방향·후보·실험을 이미 채택된 protocol처럼 읽는 오류를 막는 상태 지도입니다.</p></figcaption>
    <div data-viz-canvas className="mt-5 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {lanes.map((lane, index) => <div key={lane.name} className="relative min-w-0 rounded-xl border border-border bg-background p-4"><div className="flex items-center justify-between"><span className="text-2xl text-primary">{lane.mark}</span><span className="text-xs text-muted-foreground">0{index + 1}</span></div><p className="mt-3 font-semibold">{lane.name}</p><p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{lane.examples}</p></div>)}
    </div>
    <div className="mt-5 flex flex-col items-stretch gap-2 md:flex-row md:items-center"><span className="rounded-md border border-border px-3 py-2 text-center text-sm">LLM: invariant·proof candidate</span><span className="text-center text-primary">→</span><span className="rounded-full border border-primary px-3 py-2 text-center text-sm font-semibold">Lean / deterministic verifier</span><span className="text-center text-primary">→</span><span className="rounded-md border border-border px-3 py-2 text-center text-sm">검증된 결과만 채택</span></div>
  </figure>;
}
