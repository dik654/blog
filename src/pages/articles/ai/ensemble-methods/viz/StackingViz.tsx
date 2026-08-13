const rows = [
  ["row 01 · fold 2", "fA⁽⁻²⁾(x₁)", "fB⁽⁻²⁾(x₁)", "target y₁"],
  ["row 02 · fold 1", "fA⁽⁻¹⁾(x₂)", "fB⁽⁻¹⁾(x₂)", "target y₂"],
  ["row 03 · fold 3", "fA⁽⁻³⁾(x₃)", "fB⁽⁻³⁾(x₃)", "target y₃"],
];

export default function StackingViz() {
  return (
    <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Cross-fitted meta matrix · Z</p>
      <h3 className="mt-1 text-lg font-semibold">각 칸은 그 행을 학습에서 제외한 base model의 prediction입니다</h3>
      <div className="mt-5 overflow-hidden rounded-lg border border-border/60">
        <div className="grid gap-2 border-b border-border/60 bg-muted/25 px-4 py-3 text-xs font-semibold text-muted-foreground sm:grid-cols-[1.25fr_1fr_1fr_1fr] sm:gap-4">
          <span>Row / held-out fold</span><span>Base A</span><span>Base B</span><span>Meta label</span>
        </div>
        {rows.map((row) => (
          <div key={row[0]} className="grid gap-2 border-b border-border/50 px-4 py-4 last:border-b-0 sm:grid-cols-[1.25fr_1fr_1fr_1fr] sm:gap-4 sm:py-3">
            {row.map((cell, index) => <p key={cell} className={index === 0 ? "text-xs font-semibold" : "break-words font-mono text-xs text-muted-foreground"}>{cell}</p>)}
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
        <p className="rounded-md border border-border/50 px-3 py-2">fit base · D−fold</p><p className="rounded-md border border-border/50 px-3 py-2">write Z · held-out rows</p><p className="rounded-md border border-border/50 px-3 py-2">fit meta · Z + y</p>
      </div>
    </div>
  );
}
