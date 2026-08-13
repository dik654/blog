const stages = [
  ["Input", "data snapshot", "schema · IDs · labels"],
  ["Split", "fold manifest", "train/valid row IDs"],
  ["Fit", "resolved run", "config · seed · code"],
  ["Predict", "OOF + test", "row ID · score · fold"],
  ["Verify", "metric report", "global · fold · slice"],
  ["Package", "submission", "order · range · checksum"],
];

export default function BaselineViz() {
  return (
    <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Baseline artifact chain</p>
      <h3 className="mt-1 text-lg font-semibold">점수 하나가 아니라 입력에서 제출까지의 lineage를 재생합니다</h3>
      <ol className="mt-5 border-l border-border pl-5 sm:grid sm:grid-cols-3 sm:gap-x-5 sm:gap-y-0 sm:border-l-0 sm:pl-0 lg:grid-cols-6">
        {stages.map(([label, artifact, receipt], index) => (
          <li key={label} className="relative pb-5 last:pb-0 sm:border-t sm:border-border sm:pb-0 sm:pt-5">
            <span className="absolute -left-[1.48rem] top-1.5 h-2 w-2 rounded-full border border-foreground/50 bg-background sm:-top-[0.3rem] sm:left-0" />
            <p className="text-xs font-semibold text-muted-foreground">{String(index + 1).padStart(2, "0")} · {label}</p>
            <p className="mt-1 text-sm font-semibold">{artifact}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{receipt}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
