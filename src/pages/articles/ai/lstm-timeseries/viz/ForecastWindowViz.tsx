const history = ["t−5", "t−4", "t−3", "t−2", "t−1", "t"];
const future = ["t+1", "t+2", "t+3"];

export default function ForecastWindowViz() {
  return (
    <figure data-viz="forecast-window" className="not-prose my-9 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b border-border/60 px-4 py-4 sm:px-6">
        <p className="text-sm font-bold">한 sample은 forecast origin 하나를 재현한다</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">세로 경계 왼쪽만 입력이며, 오른쪽 target은 학습 loss나 사후 평가에서만 공개됩니다.</p>
      </figcaption>
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4">
          <div className="min-w-0">
            <p className="mb-3 text-xs font-bold text-primary">LOOK-BACK L</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {history.map((step) => <div key={step} className="rounded-md border border-border/70 bg-background px-2 py-3 text-center font-mono text-xs">{step}</div>)}
            </div>
          </div>
          <div className="min-w-0 border-l border-dashed border-primary/50 pl-4">
            <p className="mb-3 text-xs font-bold text-primary">HORIZON H</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {future.map((step) => <div key={step} className="rounded-md border border-primary/30 bg-primary/[0.05] px-2 py-3 text-center font-mono text-xs">{step}</div>)}
            </div>
          </div>
        </div>
        <div className="mt-5 grid gap-2 text-xs leading-5 text-muted-foreground sm:grid-cols-2">
          <p className="rounded-md border border-border/60 px-3 py-2"><b className="text-foreground">관측 가능</b> target 과거값·달력·확정된 요금제</p>
          <p className="rounded-md border border-border/60 px-3 py-2"><b className="text-foreground">관측 불가능</b> 실제 미래 날씨·미래 target·사후 집계값</p>
        </div>
      </div>
    </figure>
  );
}
