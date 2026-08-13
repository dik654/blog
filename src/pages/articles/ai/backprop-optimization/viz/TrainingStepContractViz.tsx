const stages = [
  ["01", "Forward", "prediction과 backward에 필요한 activation을 계산", "read · parameter, write · activation"],
  ["02", "Objective", "batch output을 scalar loss로 축약", "write · L ∈ ℝ"],
  ["03", "Backward", "upstream gradient를 local VJP로 역전파", "write · parameter.grad"],
  ["04", "Optimizer", "gradient와 optimizer state로 parameter 갱신", "write · θt+1"],
];

export default function TrainingStepContractViz() {
  return (
    <figure data-viz="training-step-contract" className="not-prose my-9 overflow-hidden rounded-xl border border-border/75 bg-card">
      <figcaption className="border-b border-border/60 px-4 py-4 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">One training step</p>
        <p className="mt-1 font-semibold">Backpropagation과 optimizer는 서로 다른 책임을 가집니다</p>
      </figcaption>
      <div className="grid gap-px bg-border/60 md:grid-cols-4">
        {stages.map(([index, title, body, contract]) => (
          <div key={title} className="min-w-0 bg-background p-4 sm:p-5">
            <p className="text-xs font-bold text-muted-foreground">{index}</p>
            <p className="mt-4 font-semibold">{title}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
            <p className="mt-4 border-t border-border/60 pt-3 font-mono text-[11px] leading-5 text-foreground/70">{contract}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}
