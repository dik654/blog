const methods = [
  ["Mean", "같은 단위·class order", "scale·거리 보존", "첫 baseline"],
  ["Simplex weight", "OOF에서 제한된 weights", "해석 가능한 비중", "weight selection overfit"],
  ["Percentile rank", "순서만 신뢰", "scale 차이 제거", "calibration·거리 소실"],
];

export default function AveragingViz() {
  return (
    <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Prediction fusion contract</p>
      <h3 className="mt-1 text-lg font-semibold">보존해야 할 prediction 의미에 따라 결합 방식을 고릅니다</h3>
      <div className="mt-5 overflow-hidden rounded-lg border border-border/60">
        {methods.map(([method, input, keeps, cost]) => (
          <div key={method} className="grid gap-2 border-b border-border/50 px-4 py-4 last:border-b-0 md:grid-cols-[.9fr_1.2fr_1fr_1.2fr] md:gap-5 md:py-3">
            <p className="text-sm font-semibold">{method}</p><p className="text-xs leading-5">조건 · {input}</p><p className="text-xs leading-5 text-muted-foreground">보존 · {keeps}</p><p className="text-xs leading-5 text-muted-foreground">주의 · {cost}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
