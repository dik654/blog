const rows = [
  ["Weights", "14.0 GB", "3.5 GB", "W4가 직접 줄임"],
  ["Scale metadata", "—", "0.3 GB", "group·packing에 따라 추가"],
  ["Activation + KV", "7.0 GB", "7.0 GB", "weight-only에서는 그대로"],
  ["Workspace + headroom", "3.0 GB", "3.0 GB", "engine·peak 조건 고정"],
  ["Peak total", "24.0 GB", "13.8 GB", "4×가 아니라 42.5% 절감"],
];

export default function VRAMBudgetViz() {
  return <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-300">Resident-memory ledger</p>
    <h3 className="mt-1 text-lg font-semibold">Weight 항만 바뀐 같은 workload의 예시입니다</h3>
    <div className="mt-5 overflow-x-auto">
      <div className="min-w-[44rem] border-y border-border/70">
        <div className="grid grid-cols-[1.3fr_7rem_7rem_1.5fr] gap-4 py-2.5 text-xs font-semibold text-muted-foreground"><span>Resident component</span><span>FP16</span><span>W4</span><span>Reason</span></div>
        {rows.map(([component, baseline, quantized, reason], index) => <div key={component} className={`grid grid-cols-[1.3fr_7rem_7rem_1.5fr] gap-4 border-t border-border/60 py-3 text-sm ${index === rows.length - 1 ? "font-semibold" : ""}`}><span>{component}</span><span className="tabular-nums">{baseline}</span><span className="tabular-nums">{quantized}</span><span className="text-muted-foreground">{reason}</span></div>)}
      </div>
    </div>
  </div>;
}
