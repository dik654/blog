const rows = [
  ["Prompt", "source · rights · slice", "manifest"],
  ["Generate", "teacher · system · decoding", "raw response"],
  ["Verify", "correctness · safety · dedup", "decision + reason"],
  ["Serialize", "student tokenizer · template · mask", "training shard"],
  ["Evaluate", "human · OOD · contamination", "student evidence"],
] as const;

export default function LLMDistillViz() {
  return (
    <figure data-viz data-viz-canvas className="overflow-hidden rounded-xl border border-border bg-card">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-semibold text-muted-foreground">Synthetic supervision ledger</p>
        <h3 className="mt-1 text-base font-semibold">Teacher output은 provenance를 거쳐야 training data가 됩니다</h3>
      </figcaption>
      <div className="hidden grid-cols-[.8fr_1.5fr_1fr] border-b border-border bg-muted/25 px-5 py-2.5 text-xs font-medium text-muted-foreground sm:grid">
        <span>단계</span><span>고정할 조건</span><span>남길 산출물</span>
      </div>
      {rows.map((row) => (
        <section key={row[0]} className="border-b border-border/70 px-4 py-4 last:border-b-0 sm:grid sm:grid-cols-[.8fr_1.5fr_1fr] sm:px-5 sm:py-3">
          <strong className="text-sm">{row[0]}</strong>
          <div className="mt-3 min-w-0 text-sm sm:mt-0 sm:pr-3">
            <span className="block text-xs text-muted-foreground sm:hidden">고정할 조건</span>
            <span className="mt-1 block break-words text-muted-foreground sm:mt-0">{row[1]}</span>
          </div>
          <div className="mt-3 min-w-0 text-sm sm:mt-0">
            <span className="block text-xs text-muted-foreground sm:hidden">남길 산출물</span>
            <span className="mt-1 block break-words text-muted-foreground sm:mt-0">{row[2]}</span>
          </div>
        </section>
      ))}
    </figure>
  );
}
