const txSteps = [
  { step: "01", title: "Ethereum 요청", body: "signed raw transaction", note: "sender·nonce·chain·gas·data" },
  { step: "02", title: "Cosmos envelope", body: "Ethereum tx ↔ SDK tx", note: "같은 실행 의도를 SDK pipeline으로 운반" },
  { step: "03", title: "Ante + x/evm", body: "sequence 확인·Msg 실행", note: "nonce를 두 번 올리지 않도록 조정" },
  { step: "04", title: "State candidate", body: "StateDB overlay", note: "snapshot·REVERT 뒤 commit 후보 생성" },
] as const;

export function MiniEvmTransactionViz() {
  return (
    <figure data-viz="minievm-transaction-boundary" className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-6">
      <figcaption className="mb-4 text-sm font-semibold">Alice→Bob 요청이 Ethereum 표현에서 Cosmos app state로 가는 길</figcaption>
      <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {txSteps.map((item) => (
          <div key={item.step} className="min-w-0 rounded-lg border border-border bg-background p-4">
            <p className="text-xs font-semibold text-primary">{item.step} · {item.title}</p>
            <p className="mt-2 break-words font-mono text-sm font-semibold">{item.body}</p>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">{item.note}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 border-l border-primary/60 pl-3 text-xs leading-5 text-muted-foreground">JSON-RPC가 transaction hash를 돌려준 시점, EVM frame이 성공한 시점, Cosmos block state가 commit된 시점은 서로 다른 완료 상태입니다.</p>
    </figure>
  );
}

const stateRows = [
  { name: "persistent vmStore", lifetime: "commit 뒤에도 유지", purpose: "account·code·storage의 authoritative state" },
  { name: "transient memStore", lifetime: "현재 execution 동안", purpose: "VM write·log·access list·refund의 후보 효과" },
  { name: "snapshot journal", lifetime: "call frame checkpoint", purpose: "REVERT·exception 때 정확한 후보 효과만 복원" },
] as const;

export function MiniEvmStateViz() {
  return (
    <figure data-viz="minievm-state-boundary" className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-6">
      <figcaption className="mb-4 text-sm font-semibold">StateDB 안에서도 수명과 rollback 경계가 다르다</figcaption>
      <div className="grid min-w-0 gap-3 lg:grid-cols-3">
        {stateRows.map((row) => (
          <section key={row.name} className="min-w-0 rounded-lg border border-border bg-background p-4">
            <h3 className="break-words font-mono text-sm font-semibold">{row.name}</h3>
            <p className="mt-2 text-xs font-medium text-primary">{row.lifetime}</p>
            <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{row.purpose}</p>
          </section>
        ))}
      </div>
    </figure>
  );
}
