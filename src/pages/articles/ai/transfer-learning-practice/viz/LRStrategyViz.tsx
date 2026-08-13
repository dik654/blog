const rows = [
  ["Lower blocks", "η₁", "ρ₁", "보존할 표현"],
  ["Upper blocks", "η₂", "ρ₂", "target 적응"],
  ["New head", "η₃", "ρ₃", "새 label mapping"],
];

export default function LRStrategyViz() {
  return <figure data-viz className="overflow-hidden rounded-xl border border-border bg-background">
    <figcaption className="border-b border-border px-4 py-4 sm:px-6"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-fuchsia-700 dark:text-fuchsia-300">Parameter-group trace</p><h3 className="mt-1 text-base font-semibold sm:text-lg">설정한 LR과 실제 relative update ratio를 함께 봅니다</h3></figcaption>
    <div className="px-4 py-5 sm:px-6">
      <div className="divide-y divide-border border-y border-border">{rows.map(([name,lr,ratio,role])=><div key={name} className="grid gap-1 py-3 text-sm sm:grid-cols-[8rem_5rem_5rem_1fr] sm:gap-4"><span className="font-semibold">{name}</span><span className="font-mono">{lr}</span><span className="font-mono text-fuchsia-800 dark:text-fuchsia-200">{ratio}</span><span className="text-muted-foreground">{role}</span></div>)}</div>
      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center"><p><b>warmup</b><br/><span className="text-muted-foreground">초기 충격 완화</span></p><span className="hidden sm:block">→</span><p><b>peak LR</b><br/><span className="text-muted-foreground">group별 후보</span></p><span className="hidden sm:block">→</span><p><b>decay</b><br/><span className="text-muted-foreground">update clock 기준</span></p></div>
    </div>
  </figure>;
}
