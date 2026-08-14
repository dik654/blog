const families = [
  { name: "Classical BFT", member: "고정 validator snapshot", decision: "Quorum certificate · lock", finality: "전제 안에서 결정적", failure: "Fault bound 초과 · GST 전 정지" },
  { name: "DAG-BFT", member: "고정/epoch validator", decision: "DAG causal history · anchor", finality: "전제 안에서 결정적", failure: "Data availability · linearization" },
  { name: "Nakamoto PoW", member: "Open hash-power 참여", decision: "가장 큰 cumulative work", finality: "Confirmation 깊이별 확률적", failure: "Reorg · eclipse · hash 집중" },
  { name: "Sampling 계열", member: "Open/permissioned 설계별", decision: "반복 표본의 선호 누적", finality: "Parameter별 오류 확률", failure: "표본 독립성 · adversary model" },
] as const;

export function ConsensusFamilyMatrixViz() {
  return (
    <figure data-viz="consensus-family-matrix" className="not-prose my-8 min-w-0 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b border-border/70 p-4 sm:p-6"><p className="text-sm font-semibold text-foreground">합의 계열을 같은 네 질문으로 정렬</p><p className="mt-1 text-xs leading-5 text-muted-foreground">회원권과 영향력, 결정 evidence, finality의 의미, 실패 경계를 먼저 맞춥니다.</p></figcaption>
      <div data-viz-canvas className="overflow-x-auto p-4 sm:p-6">
        <div className="min-w-[820px] overflow-hidden rounded-lg border border-border text-xs leading-5">
          <div className="grid grid-cols-[.9fr_1.1fr_1.2fr_1fr_1.2fr] bg-muted/50 font-semibold text-foreground"><div className="p-3">계열</div><div className="border-l border-border p-3">참여·영향력</div><div className="border-l border-border p-3">결정 evidence</div><div className="border-l border-border p-3">Finality</div><div className="border-l border-border p-3">깨지는 경계</div></div>
          {families.map((row) => <div key={row.name} className="grid grid-cols-[.9fr_1.1fr_1.2fr_1fr_1.2fr] border-t border-border"><div className="p-3 font-semibold text-foreground">{row.name}</div><div className="border-l border-border p-3 text-muted-foreground">{row.member}</div><div className="border-l border-border p-3 text-muted-foreground">{row.decision}</div><div className="border-l border-border p-3 text-muted-foreground">{row.finality}</div><div className="border-l border-border p-3 text-muted-foreground">{row.failure}</div></div>)}
        </div>
      </div>
    </figure>
  );
}

const path = [
  ["1", "Membership", "누가 vote·work·sample 영향력을 가지는가"],
  ["2", "Failure model", "Crash·Byzantine·partition·adaptive adversary 중 무엇인가"],
  ["3", "Evidence", "QC·chainwork·sample confidence 중 무엇으로 결정하는가"],
  ["4", "Service result", "p50·p99 latency, recovery, cost와 finality를 따로 잰다"],
] as const;

export function ConsensusSelectionFlowViz() {
  return <figure data-viz="consensus-selection-flow" className="not-prose my-8 min-w-0 rounded-xl border border-border/70 bg-card p-4 sm:p-6"><figcaption className="mb-5"><p className="text-sm font-semibold text-foreground">제품 요구에서 protocol 후보로 내려가는 순서</p><p className="mt-1 text-xs leading-5 text-muted-foreground">TPS를 먼저 고르면 safety와 운영 전제가 뒤늦게 드러납니다.</p></figcaption><div data-viz-canvas className="grid min-w-0 gap-3 md:grid-cols-4">{path.map(([n,title,detail],index)=><div key={n} className="relative min-w-0 rounded-lg border border-border bg-background p-4"><span className="text-[11px] font-semibold text-primary">{n.padStart(2,"0")}</span><p className="mt-2 text-sm font-semibold text-foreground">{title}</p><p className="mt-1 break-keep text-xs leading-5 text-muted-foreground">{detail}</p>{index<path.length-1&&<span aria-hidden className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-muted-foreground md:-right-3 md:bottom-auto md:left-auto md:top-1/2 md:translate-x-0 md:-translate-y-1/2">→</span>}</div>)}</div></figure>;
}
