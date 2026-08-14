const cards = [
  ["01 decode", "transaction·sender·gas", "실행 입력 고정"],
  ["02 step", "opcode + stack + memory", "한 명령씩 전이"],
  ["03 journal", "account·storage changes", "아직 되돌릴 수 있음"],
  ["04 receipt", "status·gas used·logs", "block 결과에 포함"],
] as const;

export function EvmStepTraceViz() {
  return <figure className="rounded-xl border border-border bg-card p-4 sm:p-6">
    <figcaption className="mb-4 text-sm font-semibold">Alice→Bob 10 요청의 EVM 실행 경계</figcaption>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([k,v,n])=><div key={k} className="min-w-0 rounded-lg border border-border bg-background p-4"><p className="text-xs font-semibold text-primary">{k}</p><p className="mt-2 break-words font-mono text-sm">{v}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{n}</p></div>)}</div>
    <p className="mt-4 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground">Transaction이 pool에 들어간 것과 EVM execution이 성공한 것, block이 canonical이 된 것은 서로 다른 완료 상태입니다.</p>
  </figure>;
}

export function EvmFailureViz() {
  return <figure className="rounded-xl border border-border bg-card p-4 sm:p-6"><figcaption className="mb-4 text-sm font-semibold">종료 이유가 바꾸는 결과</figcaption><div className="grid gap-3 md:grid-cols-3">
    {[{t:"STOP / RETURN",d:"현재 frame의 변경을 parent에 반영",c:"정상 종료"},{t:"REVERT",d:"frame 변경을 취소하고 return data 전달",c:"의도된 실패"},{t:"OOG / invalid",d:"frame 변경 취소, 남은 gas 규칙 적용",c:"예외 종료"}].map(x=><div key={x.t} className="rounded-lg border border-border bg-background p-4"><span className="rounded-full border border-border px-2 py-1 text-[11px] text-muted-foreground">{x.c}</span><p className="mt-3 font-mono text-sm font-semibold">{x.t}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{x.d}</p></div>)}
  </div></figure>;
}
