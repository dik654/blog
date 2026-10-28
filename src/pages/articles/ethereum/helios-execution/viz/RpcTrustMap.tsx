const ROWS = [
  {
    method: "Balance · nonce",
    input: "account proof",
    anchor: "state root R",
    local: "field 반환",
    boundary: "block H의 account",
  },
  {
    method: "Storage · code",
    input: "slot proof · bytecode",
    anchor: "storage root · code hash",
    local: "value · hash 확인",
    boundary: "block H의 slot·code",
  },
  {
    method: "eth_call · estimateGas",
    input: "proof-backed state",
    anchor: "H · env · fork · T",
    local: "revm 실행",
    boundary: "simulation 결과",
  },
  {
    method: "Receipt · logs",
    input: "receipt bytes",
    anchor: "receipts root",
    local: "root · log membership 확인",
    boundary: "검증된 block의 receipt",
  },
  {
    method: "sendRawTransaction",
    input: "signed transaction bytes",
    anchor: "제출 시점에는 없음",
    local: "hash 계산 · 전달",
    boundary: "broadcast 응답만",
  },
] as const;

export default function RpcTrustMap() {
  return (
    <figure
      data-viz
      className="not-prose my-8 min-w-0 overflow-hidden border-y border-border bg-background py-4 sm:py-5"
    >
      <figcaption className="px-1 sm:px-2">
        <p className="font-mono text-[10px] font-black tracking-[0.14em] text-primary">
          METHOD MAP · 같은 RPC라도 근거가 다릅니다
        </p>
        <p className="mt-2 max-w-3xl break-keep text-xs leading-5 text-muted-foreground">
          원격 응답을 모두 같은 방식으로 신뢰하지 않습니다. 각 method가 어느 commitment에 묶이고 로컬에서 무엇을 확인하는지 비교합니다.
        </p>
      </figcaption>

      <div className="mt-4 hidden overflow-hidden border border-border lg:block">
        <div className="grid grid-cols-[1.05fr_1.05fr_1.1fr_1.15fr_1.2fr] bg-muted/25 font-mono text-[9px] font-black text-muted-foreground">
          {['METHOD', 'REMOTE MATERIAL', 'ANCHOR', 'LOCAL WORK', 'PROVEN BOUNDARY'].map((label) => (
            <div key={label} className="border-r border-border px-3 py-2 last:border-r-0">{label}</div>
          ))}
        </div>
        {ROWS.map((row, index) => (
          <div
            key={row.method}
            className={`grid grid-cols-[1.05fr_1.05fr_1.1fr_1.15fr_1.2fr] border-t border-border text-[10px] leading-4 ${index === ROWS.length - 1 ? "bg-amber-500/[0.035]" : "bg-background"}`}
          >
            <strong className="break-keep border-r border-border px-3 py-3">{row.method}</strong>
            <span className="break-keep border-r border-border px-3 py-3 text-muted-foreground">{row.input}</span>
            <span className="break-keep border-r border-border px-3 py-3">{row.anchor}</span>
            <span className="break-keep border-r border-border px-3 py-3 text-muted-foreground">{row.local}</span>
            <span className="break-keep px-3 py-3 font-semibold">{row.boundary}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:hidden">
        {ROWS.map((row, index) => (
          <div key={row.method} className={`border-l-2 px-3 py-3 ${index === ROWS.length - 1 ? "border-amber-500 bg-amber-500/[0.035]" : "border-primary bg-background"}`}>
            <strong className="block break-keep text-xs leading-5">{row.method}</strong>
            <div className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-[9px] leading-4">
              <span className="font-mono font-black text-muted-foreground">ANCHOR</span>
              <span>{row.anchor}</span>
              <span className="font-mono font-black text-muted-foreground">LOCAL</span>
              <span>{row.local}</span>
              <span className="font-mono font-black text-muted-foreground">BOUNDARY</span>
              <span className="font-semibold">{row.boundary}</span>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}
