const rows = [
  ["기준", "USD 1.00", "무엇을 안정시키는가"],
  ["발행·상환", "claim / collateral", "누가 어떤 자산으로 갚는가"],
  ["시장", "거래소 가격", "차익거래와 유동성이 작동하는가"],
  ["실패", "run / oracle / governance", "어느 경계가 먼저 끊기는가"],
] as const;

export default function StablecoinSystemViz() {
  return (
    <figure data-viz="stablecoin-system" className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-background">
      <figcaption className="border-b border-border px-5 py-4">
        <p className="text-sm font-bold">스테이블코인은 가격표가 아니라 네 개의 연결된 계약이다</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">같은 ‘1달러’ 표시여도 상환권·담보·시장 유동성·실패 책임은 서로 다릅니다.</p>
      </figcaption>
      <div data-viz-canvas className="grid gap-px bg-border sm:grid-cols-2">
        {rows.map(([label, value, note], index) => (
          <div key={label} className="min-w-0 bg-background p-5">
            <div className="flex items-center gap-3"><span className="text-xs font-mono text-primary">0{index + 1}</span><strong className="text-sm">{label}</strong></div>
            <p className="mt-3 text-lg font-semibold">{value}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{note}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}
