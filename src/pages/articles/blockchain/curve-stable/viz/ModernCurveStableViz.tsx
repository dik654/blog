const cells = [
  ["입력", "정규화 잔액 xᵢ · token/rate artifact"],
  ["불변량", "A·nⁿ·Σxᵢ + D = A·D·nⁿ + Dⁿ⁺¹/(nⁿ·Πxᵢ)"],
  ["교환", "D를 고정하고 새 x에서 y를 반복 계산"],
  ["검증", "fee · min output · imbalance · parameter generation"],
] as const;

export default function ModernCurveStableViz() {
  return (
    <figure
      data-viz="curve-stable-flow"
      className="rounded-xl border border-border bg-card p-4 sm:p-6"
    >
      <figcaption className="mb-4">
        <p className="text-sm font-semibold text-primary">
          StableSwap 계산 경로
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          낮은 슬리피지는 peg 보장이 아니라, 균형 부근에서의 곡선 모양입니다.
        </p>
      </figcaption>
      <div data-viz-canvas className="grid gap-3 md:grid-cols-4">
        {cells.map(([k, v], i) => (
          <div key={k} className="min-w-0 border-l border-border pl-3">
            <p className="text-xs font-semibold text-primary">
              {String(i + 1).padStart(2, "0")} · {k}
            </p>
            <p className="mt-2 break-words text-sm leading-6">{v}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}
