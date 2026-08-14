const steps = [
  ["PoolKey", "currency0·currency1·fee·tickSpacing·hooks"],
  ["unlock", "caller callback 안에서 pool actions 실행"],
  ["hooks", "address flags가 callback surface를 고정"],
  ["settle", "모든 currency delta가 0이어야 종료"],
] as const;

export default function UniswapV4FlowViz() {
  return (
    <figure data-viz="uniswap-v4-flow" className="not-prose my-8 rounded-xl border border-border bg-background p-5">
      <figcaption><p className="text-sm font-bold">V4 transaction은 pool 하나가 아니라 unlock 안의 net settlement로 읽는다</p><p className="mt-1 text-xs text-muted-foreground">PoolManager가 여러 pool action을 한 회계 구간에서 모아 마지막 잔액을 검사합니다.</p></figcaption>
      <div data-viz-canvas className="mt-5 grid gap-3 sm:grid-cols-4">
        {steps.map(([title, note], index) => <div key={title} className="min-w-0 border-l border-primary/60 pl-3"><p className="text-xs font-mono text-primary">0{index + 1}</p><p className="mt-2 text-sm font-semibold">{title}</p><p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{note}</p></div>)}
      </div>
    </figure>
  );
}
