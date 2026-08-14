const card = "min-w-0 rounded-lg border border-border/70 bg-background p-4";

export function AdmissionLifecycleViz() {
  const stages = [
    ["receive", "tx bytes + sender", "아직 미검증"],
    ["local gates", "count·bytes·max tx·cache", "빠른 거절"],
    ["ABCI CheckTx", "application admission", "Code OK + postCheck"],
    ["CListMempool", "ordered local candidate", "proposal에 reap 가능"],
    ["block commit", "결정·실행", "여기서만 ledger 반영"],
  ];
  return <figure data-viz="cometbft-mempool-admission" className="not-prose my-8 overflow-hidden rounded-xl border border-border/70 bg-muted/20 p-4 sm:p-6">
    <figcaption className="mb-5"><p className="text-xs font-bold text-primary">alice→bob 10의 admission trace</p><p className="mt-1 text-sm text-muted-foreground">각 단계는 다음 단계의 보장이 아닙니다. 특히 CheckTx OK는 commit receipt가 아닙니다.</p></figcaption>
    <div data-viz-canvas className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-5">{stages.map(([title, input, status], index) => <div key={title} className={card}><span className="text-xs font-bold text-primary">0{index + 1}</span><p className="mt-2 font-semibold">{title}</p><p className="mt-2 break-words text-sm text-muted-foreground">{input}</p><p className="mt-3 border-t border-border pt-3 text-xs font-medium">{status}</p></div>)}</div>
  </figure>;
}

export function RecheckBarrierViz() {
  return <figure data-viz="cometbft-mempool-recheck" className="not-prose my-8 overflow-hidden rounded-xl border border-border/70 bg-muted/20 p-4 sm:p-6">
    <figcaption className="mb-5"><p className="text-xs font-bold text-primary">commit 뒤 recheck 경계</p><p className="mt-1 text-sm text-muted-foreground">Update가 mempool lock을 가진 동안 committed tx를 제거하고 남은 snapshot을 새 application state에서 다시 검사합니다.</p></figcaption>
    <div data-viz-canvas className="grid min-w-0 gap-4 lg:grid-cols-3">
      <div className={card}><p className="text-xs font-bold text-primary">before h</p><p className="mt-2 font-semibold">[nonce 7, nonce 8, fee-low]</p><p className="mt-2 text-sm text-muted-foreground">reap과 새 CheckTx가 읽던 이전 상태의 후보군</p></div>
      <div className={`${card} border-primary/40`}><p className="text-xs font-bold text-primary">Update(h)</p><ul className="mt-2 space-y-2 text-sm text-muted-foreground"><li>committed nonce 7 제거</li><li>pre/post filter 교체</li><li>nonce 8·fee-low recheck</li></ul></div>
      <div className={card}><p className="text-xs font-bold text-primary">after h</p><p className="mt-2 font-semibold">[nonce 8]</p><p className="mt-2 text-sm text-muted-foreground">응답이 OK인 남은 tx만 유지하고 height당 availability signal을 다시 엽니다.</p></div>
    </div>
  </figure>;
}
