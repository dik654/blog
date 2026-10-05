const destinations = [
  { gpu: "GPU 1", expert: "expert 13", weight: ".25" },
  { gpu: "GPU 5", expert: "expert 42", weight: ".75" },
] as const;

export default function ExpertRouteCaseViz() {
  return (
    <figure data-viz="expert-route-case" className="my-8 min-w-0 rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <figcaption>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary/75">Token 37 · top-2 route</p>
        <p className="mt-2 text-lg font-semibold">8KiB 입력 두 개를 보내고 8KiB 결과 두 개를 돌려받습니다</p>
      </figcaption>
      <div data-viz-canvas className="mt-6 min-w-0">
        <div className="rounded-lg border border-border/70 p-4">
          <p className="text-xs font-semibold text-muted-foreground">출발 · GPU 0</p>
          <p className="mt-2 font-mono text-sm font-bold">token 37 · hidden 4096 × FP16 = 8KiB</p>
        </div>
        <div className="my-3 grid grid-cols-2 gap-3" aria-hidden="true">
          <span className="text-center text-primary">↙ dispatch 8KiB</span>
          <span className="text-center text-primary">dispatch 8KiB ↘</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {destinations.map((item) => (
            <div key={item.expert} className="min-w-0 rounded-lg border border-border/70 p-4">
              <p className="text-xs font-semibold text-muted-foreground">{item.gpu}</p>
              <p className="mt-2 font-mono text-sm font-bold">{item.expert}</p>
              <p className="mt-2 text-xs text-muted-foreground">결합 weight {item.weight} · result 8KiB</p>
            </div>
          ))}
        </div>
        <div className="mt-4 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
          Dispatch 16KiB + combine 16KiB = 논리 payload 32KiB입니다. 두 result가 모두 돌아와야 GPU 0이
          <span className="font-mono text-foreground"> .25y₁₃ + .75y₄₂</span>를 계산합니다.
        </div>
      </div>
    </figure>
  );
}
