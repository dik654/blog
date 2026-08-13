const rows = [
  { name: "고객 A", values: [[.78, .16, .06, 0], [.08, .14, .22, .56]] },
  { name: "고객 B", values: [[.04, .11, .73, .12], [.61, .27, .08, .04]] },
];
const features = ["소득", "부채", "연체", "직업"];

function MaskRow({ values }: { values: number[] }) {
  return (
    <div className="grid min-w-0 grid-cols-4 gap-2">
      {values.map((value, index) => (
        <div key={`${index}-${value}`} className="min-w-0">
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary/75" style={{ width: `${value * 100}%` }} />
          </div>
          <p className="mt-1 text-center font-mono text-[11px] text-muted-foreground">{value.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}

export default function TabNetViz() {
  return (
    <figure data-viz="tabnet-instance-mask" className="min-w-0 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
      <figcaption>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary/75">Instance-wise mask</p>
        <p className="mt-2 text-lg font-semibold">같은 column도 row와 decision step에 따라 다른 비중으로 선택됩니다</p>
      </figcaption>
      <div className="mt-6 min-w-0 overflow-x-auto">
        <div className="min-w-[620px]">
          <div className="grid grid-cols-[5rem_1fr_1fr] gap-5 border-b border-border/70 pb-3 text-xs font-semibold text-muted-foreground">
            <span>Row</span>
            <div className="grid grid-cols-4 gap-2 text-center">{features.map((f) => <span key={f}>{f}</span>)}</div>
            <div className="grid grid-cols-4 gap-2 text-center">{features.map((f) => <span key={f}>{f}</span>)}</div>
          </div>
          <div className="grid grid-cols-[5rem_1fr_1fr] gap-5 border-b border-border/70 py-2 text-xs font-semibold text-foreground">
            <span /> <span>Step 1 mask</span><span>Step 2 mask</span>
          </div>
          {rows.map((row) => (
            <div key={row.name} className="grid grid-cols-[5rem_1fr_1fr] items-center gap-5 border-b border-border/60 py-4 last:border-0">
              <p className="text-sm font-semibold">{row.name}</p>
              <MaskRow values={row.values[0]} />
              <MaskRow values={row.values[1]} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 grid gap-3 border-t border-border/70 pt-4 text-sm sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
        <p><span className="font-semibold">Prior</span><br/><span className="text-muted-foreground">이전 사용 이력</span></p>
        <span className="hidden text-muted-foreground sm:block">→</span>
        <p><span className="font-semibold">Sparse mask × row</span><br/><span className="text-muted-foreground">현재 입력 선택</span></p>
        <span className="hidden text-muted-foreground sm:block">→</span>
        <p><span className="font-semibold">Decision + context</span><br/><span className="text-muted-foreground">예측 기여와 다음 step</span></p>
      </div>
    </figure>
  );
}
