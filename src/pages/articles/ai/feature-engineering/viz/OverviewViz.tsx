const records = [
  { time: "07-01", label: "거래 발생", state: "use" },
  { time: "07-24", label: "등급 수신", state: "use" },
  { time: "08-01 09:00", label: "예측 cutoff", state: "cutoff" },
  { time: "08-01 14:20", label: "연체 처리", state: "future" },
];

export default function OverviewViz() {
  return (
    <figure data-viz="feature-point-in-time-contract" className="min-w-0 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
      <figcaption>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary/75">Point-in-time feature row</p>
        <p className="mt-2 text-lg font-semibold">한 줄의 prediction input에는 cutoff 이전의 사실만 남습니다</p>
      </figcaption>

      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="min-w-0">
          <div className="grid grid-cols-[5.5rem_1fr] text-xs text-muted-foreground">
            <span>시각</span><span>record와 사용 가능성</span>
          </div>
          <div className="mt-3 border-y border-border/70">
            {records.map((record, index) => (
              <div key={record.time} className={`grid min-w-0 grid-cols-[5.5rem_1fr] gap-3 py-3 ${index ? "border-t border-border/60" : ""}`}>
                <span className="font-mono text-xs text-muted-foreground">{record.time}</span>
                <div className="flex min-w-0 items-center justify-between gap-3">
                  <span className={`min-w-0 text-sm font-medium ${record.state === "future" ? "text-muted-foreground line-through" : "text-foreground"}`}>{record.label}</span>
                  <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${record.state === "use" ? "border-emerald-600/25 text-emerald-700 dark:text-emerald-300" : record.state === "cutoff" ? "border-primary/30 text-primary" : "border-rose-600/25 text-rose-700 dark:text-rose-300"}`}>
                    {record.state === "use" ? "사용" : record.state === "cutoff" ? "경계" : "제외"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0 border-l border-border/70 pl-5">
          <p className="text-xs font-semibold text-muted-foreground">생성된 feature row · v3</p>
          <dl className="mt-4 space-y-3">
            {[
              ["customer_id", "C-1042"],
              ["tx_count_30d", "12"],
              ["credit_grade", "B"],
              ["days_since_tx", "2.4"],
            ].map(([name, value]) => (
              <div key={name} className="flex min-w-0 items-baseline justify-between gap-4 border-b border-border/60 pb-2">
                <dt className="min-w-0 break-words font-mono text-xs text-muted-foreground">{name}</dt>
                <dd className="shrink-0 text-sm font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">source · unit · fallback · freshness · version을 row와 함께 추적합니다.</p>
        </div>
      </div>
    </figure>
  );
}
