export default function DaiVaultViz() {
  return (
    <figure data-viz="dai-vault" className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-background">
      <figcaption className="border-b border-border px-5 py-4"><p className="text-sm font-bold">Vault의 숫자는 세 층으로 읽는다</p><p className="mt-1 text-xs text-muted-foreground">담보 수량·oracle 가치·누적 debt가 합쳐져 liquidation 여유를 만듭니다.</p></figcaption>
      <div data-viz-canvas className="grid gap-px bg-border sm:grid-cols-3">
        <div className="bg-background p-5"><p className="text-xs text-primary">COLLATERAL</p><p className="mt-2 text-xl font-semibold">$150</p><p className="mt-1 text-xs text-muted-foreground">token 수량 × oracle 가격</p></div>
        <div className="bg-background p-5"><p className="text-xs text-primary">DEBT</p><p className="mt-2 text-xl font-semibold">100 DAI</p><p className="mt-1 text-xs text-muted-foreground">normalized debt × rate</p></div>
        <div className="bg-background p-5"><p className="text-xs text-primary">RATIO</p><p className="mt-2 text-xl font-semibold">150%</p><p className="mt-1 text-xs text-muted-foreground">threshold는 collateral 설정값</p></div>
      </div>
    </figure>
  );
}
