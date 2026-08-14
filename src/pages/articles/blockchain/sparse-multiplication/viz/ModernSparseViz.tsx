const rows = [
  ["a₀", "a₀b₀", "—", "a₀b₂", "—"],
  ["a₁", "a₁b₀", "—", "a₁b₂", "—"],
  ["a₂", "a₂b₀", "—", "a₂b₂", "—"],
  ["a₃", "a₃b₀", "—", "a₃b₂", "—"],
] as const;

export default function ModernSparseViz() {
  return (
    <figure
      data-viz="sparse-support-product"
      data-viz-canvas
      className="not-prose my-8 min-w-0 rounded-xl border border-border/70 bg-card p-4 sm:p-6"
    >
      <figcaption className="mb-5">
        <p className="text-sm font-semibold text-foreground">
          0인 coefficient의 열은 곱셈 schedule에서 빠진다
        </p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Dense a의 네 항과 b=[b₀,0,b₂,0]를 곱하면 16개 후보 가운데
          8개만 실제 partial product가 됩니다. 같은 support가 보장될 때만
          이 schedule을 써야 합니다.
        </p>
      </figcaption>
      <div className="overflow-x-auto">
        <div className="min-w-[560px] overflow-hidden rounded-lg border border-border">
          <div className="grid grid-cols-5 bg-muted/50 text-center text-xs font-semibold text-foreground">
            <div className="p-3">a × b</div>
            <div className="border-l border-border p-3">b₀</div>
            <div className="border-l border-border p-3 text-muted-foreground">0</div>
            <div className="border-l border-border p-3">b₂</div>
            <div className="border-l border-border p-3 text-muted-foreground">0</div>
          </div>
          {rows.map(([label, ...cells]) => (
            <div key={label} className="grid grid-cols-5 border-t border-border text-center text-xs">
              <div className="p-3 font-semibold text-foreground">{label}</div>
              {cells.map((cell, index) => (
                <div
                  key={`${label}-${index}`}
                  className={`border-l border-border p-3 ${cell === "—" ? "bg-muted/30 text-muted-foreground" : "text-primary"}`}
                >
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground">Dense 후보</p>
          <p className="mt-1 text-lg font-semibold text-foreground">4 × 4 = 16</p>
        </div>
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
          <p className="text-xs text-muted-foreground">Support-aware 후보</p>
          <p className="mt-1 text-lg font-semibold text-primary">4 × 2 = 8</p>
        </div>
      </div>
    </figure>
  );
}
