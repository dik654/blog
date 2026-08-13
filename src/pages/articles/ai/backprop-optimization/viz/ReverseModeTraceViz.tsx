const trace = [
  ["Forward", "a = wx", "w=3, x=2 → a=6", "a를 tape에 저장"],
  ["Forward", "L = a²", "L=36", "scalar seed 준비"],
  ["Backward", "dL/da = 2a", "2×6=12", "upstream gradient"],
  ["Backward", "dL/dw = (dL/da)(da/dw)", "12×2=24", "local derivative 재사용"],
];

export default function ReverseModeTraceViz() {
  return (
    <figure data-viz="reverse-mode-trace" className="not-prose my-9 overflow-hidden rounded-xl border border-border/75 bg-card">
      <figcaption className="border-b border-border/60 px-4 py-4 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Scalar trace</p>
        <p className="mt-1 font-semibold">같은 graph를 forward 한 번, reverse 한 번 순회합니다</p>
      </figcaption>
      <div className="overflow-x-auto">
        <div className="min-w-[680px] divide-y divide-border/60">
          {trace.map(([pass, expression, value, note], index) => (
            <div key={`${pass}-${expression}`} className="grid grid-cols-[3rem_5rem_15rem_9rem_1fr] items-center gap-3 bg-background px-4 py-3.5 sm:px-6">
              <p className="text-xs font-bold text-muted-foreground">0{index + 1}</p>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-primary">{pass}</p>
              <code className="text-xs font-semibold text-foreground">{expression}</code>
              <p className="text-sm text-foreground/75">{value}</p>
              <p className="text-sm text-muted-foreground">{note}</p>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}
