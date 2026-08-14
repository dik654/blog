const card = "min-w-0 rounded-lg border border-border/70 bg-background p-4";

export function ApplyBlockPipelineViz() {
  const steps = [
    ["validate", "State h−1 ↔ block h", "read-only checks"],
    ["FinalizeBlock", "tx results·updates·AppHash", "application computes"],
    ["save result", "height h response", "replay receipt"],
    ["Commit + mempool", "app durable, Update async", "admission view moves"],
    ["save State", "LastBlockHeight=h", "next-height input"],
  ];
  return <figure data-viz="cometbft-apply-block" className="not-prose my-8 overflow-hidden rounded-xl border border-border/70 bg-muted/20 p-4 sm:p-6">
    <figcaption className="mb-5"><p className="text-xs font-bold text-primary">BlockExecutor.ApplyBlock의 authority 순서</p><p className="mt-1 text-sm text-muted-foreground">v0.40.0 source에서 result 저장, application Commit, CometBFT State 저장은 서로 다른 durability 경계입니다.</p></figcaption>
    <div data-viz-canvas className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-5">{steps.map(([name, artifact, owner], i) => <div key={name} className={card}><span className="text-xs font-bold text-primary">0{i + 1}</span><p className="mt-2 font-semibold">{name}</p><p className="mt-2 text-sm text-muted-foreground">{artifact}</p><p className="mt-3 border-t border-border pt-3 text-xs">{owner}</p></div>)}</div>
  </figure>;
}

export function CrashCutsViz() {
  const cuts = [
    ["A", "Finalize 전", "block만 있음", "real app으로 실행"],
    ["B", "result 저장 뒤", "result h, app h−1", "result 재현·Commit"],
    ["C", "Commit 뒤", "app h, State h−1", "저장된 result로 State 재구성"],
    ["D", "State 저장 뒤", "모두 h", "AppHash 대조 후 시작"],
  ];
  return <figure data-viz="cometbft-crash-cuts" className="not-prose my-8 overflow-hidden rounded-xl border border-border/70 bg-muted/20 p-4 sm:p-6">
    <figcaption className="mb-5"><p className="text-xs font-bold text-primary">crash cut별 replay 결정</p><p className="mt-1 text-sm text-muted-foreground">timeout은 미실행 증거가 아닙니다. restart는 세 저장소의 height와 AppHash를 먼저 비교합니다.</p></figcaption>
    <div data-viz-canvas className="grid min-w-0 gap-3 md:grid-cols-2">{cuts.map(([cut, point, seen, replay]) => <div key={cut} className={card}><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-md border border-primary/40 text-sm font-bold text-primary">{cut}</span><p className="font-semibold">{point}</p></div><p className="mt-3 text-sm text-muted-foreground">관찰: {seen}</p><p className="mt-2 text-sm">복구: {replay}</p></div>)}</div>
  </figure>;
}
