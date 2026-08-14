const slots = [
  { before: "c₀", after: "c₀", note: "base field 고정" },
  { before: "c₁v", after: "γ₁c₁v", note: "상수 곱" },
  { before: "c₂v²", after: "γ₂c₂v²", note: "상수 곱" },
  { before: "…", after: "…", note: "basis별 table" },
] as const;

export default function ModernFrobeniusViz() {
  return (
    <figure
      data-viz="frobenius-basis-action"
      data-viz-canvas
      className="not-prose my-8 min-w-0 rounded-xl border border-border/70 bg-card p-4 sm:p-6"
    >
      <figcaption className="mb-5">
        <p className="text-sm font-semibold text-foreground">
          큰 p제곱을 basis별 고정 변환으로 내린다
        </p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          선택한 Fp¹² tower에서 x↦xᵖ의 작용을 coefficient permutation과
          미리 계산한 상수 곱으로 바꿉니다. γ 값은 field profile에 종속됩니다.
        </p>
      </figcaption>
      <div className="space-y-3">
        {slots.map((slot, index) => (
          <div
            key={`${slot.before}-${index}`}
            className="grid min-w-0 grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-lg border border-border bg-background p-3"
          >
            <div className="min-w-0 break-words font-mono text-xs text-foreground">
              {slot.before}
            </div>
            <span aria-hidden className="text-xs text-muted-foreground">→</span>
            <div className="min-w-0">
              <p className="break-words font-mono text-xs font-semibold text-primary">
                {slot.after}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">{slot.note}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
        <p className="text-xs font-semibold text-foreground">검산 불변식</p>
        <p className="mt-1 break-words font-mono text-sm text-primary">
          φ¹²(x)=x, φ(xy)=φ(x)φ(y)
        </p>
      </div>
    </figure>
  );
}
