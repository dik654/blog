export function ModernPolyOpsViz() {
  return (
    <figure className="not-prose rounded-xl border border-border bg-card p-5" aria-labelledby="poly-viz-title">
      <figcaption id="poly-viz-title" className="text-sm font-bold">같은 polynomial도 representation tag에 따라 허용되는 kernel이 달라진다</figcaption>
      <div className="mt-5 grid min-w-0 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-muted/20 p-4"><p className="text-xs font-semibold text-primary">COEFFICIENT</p><p className="mt-2 text-sm font-bold">a₀ … aₙ₋₁</p><p className="mt-2 text-xs leading-5 text-muted-foreground">coset scale·Horner·exact division 입력</p></div>
        <div className="rounded-lg border border-primary/40 bg-primary/5 p-4"><p className="text-xs font-semibold text-primary">TRANSFORM</p><p className="mt-2 text-sm font-bold">NTT(g · Ω)</p><p className="mt-2 text-xs leading-5 text-muted-foreground">domain id·order·direction을 receipt에 보존</p></div>
        <div className="rounded-lg border border-border bg-muted/20 p-4"><p className="text-xs font-semibold text-primary">EVALUATION</p><p className="mt-2 text-sm font-bold">f(gω⁰) … f(gωⁿ⁻¹)</p><p className="mt-2 text-xs leading-5 text-muted-foreground">pointwise gates 뒤 INTT·untwist로 복귀</p></div>
      </div>
      <p className="mt-4 rounded-lg border border-border px-4 py-3 text-xs leading-5 text-muted-foreground">
            반례 · evaluation 배열을 coefficient 배열로 오인해 synthetic division에 넣으면 길이는 맞는데 결과는 다른 polynomial입니다.
          </p>
    </figure>
  );
}
