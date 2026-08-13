const maskRows = [
  { label: "적격", values: [1, 1, 0, 0, 1, 0, 1, 0] },
  { label: "부적격", values: [1, 1, 1, 0, 1, 0, 0, 0] },
] as const;

export default function StructuredViz() {
  return (
    <figure data-viz className="overflow-hidden rounded-xl border border-border bg-card">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-semibold text-muted-foreground">Shape pruning과 pattern pruning</p>
        <h3 className="mt-1 text-base font-semibold">둘 다 구조를 만들지만 compiler가 받는 결과는 다릅니다</h3>
      </figcaption>
      <div className="grid gap-px bg-border lg:grid-cols-2">
        <section className="min-w-0 bg-card p-4 sm:p-5">
          <p className="text-sm font-semibold">Channel 제거의 dependency</p>
          <div className="mt-4 space-y-2">
            {[
              ["현재 output", "W₁: d₀ × d₁′"],
              ["다음 input", "W₂: d₁′ × d₂"],
              ["공유 경로", "norm · residual · projection"],
              ["결과", "작아진 dense graph"],
            ].map(([label, value], index) => (
              <div key={label} className="grid grid-cols-[1.6rem_minmax(0,.8fr)_minmax(0,1.25fr)] items-center gap-2 border-b border-border/70 pb-2 text-sm last:border-b-0 last:pb-0">
                <span className="font-mono text-[11px] text-muted-foreground">{index + 1}</span>
                <span className="font-medium">{label}</span>
                <span className="min-w-0 text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="min-w-0 bg-card p-4 sm:p-5">
          <p className="text-sm font-semibold">2:4 local pattern</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">세로 구분마다 4개 중 정확히 2개를 남깁니다.</p>
          <div className="mt-4 space-y-3">
            {maskRows.map((row) => (
              <div key={row.label} className="grid grid-cols-[4rem_minmax(0,1fr)] items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground">{row.label}</span>
                <div className="grid grid-cols-8 overflow-hidden rounded-md border border-border">
                  {row.values.map((value, index) => (
                    <span key={index} className={`flex h-8 items-center justify-center border-r border-border text-xs last:border-r-0 ${index === 3 ? "border-r-2" : ""} ${value ? "bg-foreground text-background" : "bg-muted/25 text-muted-foreground"}`}>
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">전체 density가 같아도 local group constraint를 어기면 2:4 operator의 입력이 아닙니다.</p>
        </section>
      </div>
    </figure>
  );
}
