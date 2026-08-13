const ledger = [
  ["관찰", "Group C의 recall만 낮음", "OOF slice report"],
  ["가설", "희소 category가 unknown으로 합쳐짐", "원인과 예상 변화"],
  ["변경", "Category encoder 한 축만 교체", "config diff 1개"],
  ["비교", "+.006 / +.004 / −.001 / +.005 / +.003", "같은 fold의 paired delta"],
  ["결정", "Group C 개선·p95 +2 ms → 채택", "gate와 다음 질문"],
];

export default function IterationViz() {
  return (
    <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">One-hypothesis trace</p>
      <h3 className="mt-1 text-lg font-semibold">실험 한 번을 나중에 다시 판단할 수 있는 다섯 줄로 남깁니다</h3>
      <div className="mt-5 overflow-hidden rounded-lg border border-border/60">
        {ledger.map(([step, value, evidence], index) => (
          <div key={step} className="grid gap-2 border-b border-border/50 px-4 py-4 last:border-b-0 sm:grid-cols-[4.5rem_1.35fr_1fr] sm:gap-5 sm:py-3">
            <p className="text-xs font-semibold text-muted-foreground">{String(index + 1).padStart(2, "0")} · {step}</p>
            <p className="text-sm font-medium">{value}</p>
            <p className="text-xs leading-5 text-muted-foreground">근거 · {evidence}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
