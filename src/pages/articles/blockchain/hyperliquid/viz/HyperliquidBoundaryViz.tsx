const boxes = [
  { x: 20, label: "지갑", sub: "서명한 action", tone: "fill-primary/10 stroke-primary" },
  { x: 210, label: "HyperCore", sub: "orderbook · risk", tone: "fill-sky-500/10 stroke-sky-600" },
  { x: 400, label: "HyperBFT", sub: "순서 · 합의", tone: "fill-amber-500/10 stroke-amber-600" },
  { x: 590, label: "상태 영수증", sub: "fill · position", tone: "fill-emerald-500/10 stroke-emerald-600" },
];

export function HyperliquidBoundaryViz() {
  return (
    <figure className="space-y-3" aria-labelledby="hyperliquid-boundary-caption">
      <div className="overflow-x-auto rounded-xl border bg-muted/20 p-4">
        <svg viewBox="0 0 780 190" className="min-w-[680px]" role="img" aria-label="서명한 주문이 HyperCore와 HyperBFT를 거쳐 체결 상태가 되는 흐름">
          <defs>
            <marker id="hl-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0 0L8 4L0 8Z" className="fill-foreground/60" />
            </marker>
          </defs>
          {boxes.map((box, index) => (
            <g key={box.label}>
              <rect x={box.x} y="48" width="150" height="78" rx="10" className={box.tone} />
              <text x={box.x + 75} y="78" textAnchor="middle" className="fill-foreground text-[15px] font-semibold">{box.label}</text>
              <text x={box.x + 75} y="103" textAnchor="middle" className="fill-muted-foreground text-[12px]">{box.sub}</text>
              {index < boxes.length - 1 && <path d={`M ${box.x + 154} 87 H ${box.x + 184}`} className="stroke-foreground/60" fill="none" markerEnd="url(#hl-arrow)" />}
            </g>
          ))}
          <text x="390" y="160" textAnchor="middle" className="fill-muted-foreground text-[12px]">API 접수는 체결이 아니고, 화면 표시는 합의 상태 자체가 아니다.</text>
        </svg>
      </div>
      <figcaption id="hyperliquid-boundary-caption" className="text-sm text-muted-foreground">
        한 번의 매매처럼 보이지만 접수, 상태 전이, 합의, 조회는 서로 다른 사실입니다.
      </figcaption>
    </figure>
  );
}

export function HyperCoreEvmViz() {
  return (
    <figure className="space-y-3" aria-labelledby="hypercore-evm-caption">
      <div className="grid gap-4 rounded-xl border bg-muted/20 p-5 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <div className="rounded-lg border border-sky-600 bg-sky-500/10 p-4">
          <p className="font-semibold">HyperCore</p>
          <p className="mt-2 text-sm text-muted-foreground">주문장, 포지션, 마진, perp·spot 상태</p>
        </div>
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <span>읽기 precompile →</span>
          <span>← CoreWriter action</span>
        </div>
        <div className="rounded-lg border border-violet-600 bg-violet-500/10 p-4">
          <p className="font-semibold">HyperEVM</p>
          <p className="mt-2 text-sm text-muted-foreground">스마트 컨트랙트, EVM 계정·storage·log</p>
        </div>
      </div>
      <figcaption id="hypercore-evm-caption" className="text-sm text-muted-foreground">
        같은 합의 아래 있어도 Core 상태와 EVM 상태는 같은 저장 공간이 아닙니다. 읽기와 action 제출 interface가 그 경계를 잇습니다.
      </figcaption>
    </figure>
  );
}
