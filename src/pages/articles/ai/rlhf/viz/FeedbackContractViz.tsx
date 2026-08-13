const signals = [
  ["Demonstration", "(x, y*)", "SFT"],
  ["Pairwise", "(x, y+, y−)", "RM · DPO · ORPO"],
  ["Binary", "(x, y, label)", "KTO"],
  ["Principle", "rule + critique", "CAI · RLAIF"],
] as const;

export default function FeedbackContractViz() {
  return (
    <figure data-viz="feedback-contract" className="not-prose my-8 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b border-border/60 px-4 py-4 sm:px-6">
        <p className="text-sm font-bold">같은 ‘feedback’도 학습 example의 모양이 다르다</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">방법 이름보다 현재 수집할 수 있는 signal의 단위를 먼저 확인합니다.</p>
      </figcaption>
      <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6">
        {signals.map(([name, schema, use]) => (
          <div key={name} className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-lg border border-border/70 bg-background p-4">
            <div className="min-w-0">
              <p className="text-sm font-bold">{name}</p>
              <p className="mt-1 break-words font-mono text-xs text-primary">{schema}</p>
            </div>
            <p className="self-center text-right text-xs leading-5 text-muted-foreground">{use}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}
