const PHASES = [
  {
    name: "Prefill",
    input: "Prompt의 아직 처리하지 않은 여러 token",
    output: "Layer별 KV state + 첫 output 준비",
    pressure: "Token budget·compute·TTFT",
    shape: ["P₁", "P₂", "P₃", "P₄", "P₅", "P₆"],
  },
  {
    name: "Decode",
    input: "이미 확정된 prefix + 현재 token",
    output: "새 token 하나 + 늘어난 KV state",
    pressure: "Weight/KV traffic·ITL·sequence slots",
    shape: ["K/V", "K/V", "K/V", "+1"],
  },
] as const;

export default function PrefillDecodeViz() {
  return (
    <figure data-viz="prefill-decode-phase" className="not-prose my-12 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7">
        <p className="text-xs font-bold text-primary">TWO EXECUTION PHASES</p>
        <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">Prefill은 여러 prompt token을 채우고, decode는 저장한 state를 한 칸씩 늘립니다</h3>
      </figcaption>
      <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-2">
        {PHASES.map((phase) => (
          <article key={phase.name} className="min-w-0 rounded-lg border bg-background p-5">
            <h4 className="font-bold">{phase.name}</h4>
            <div className="mt-4 flex flex-wrap gap-2">
              {phase.shape.map((token, index) => <span key={`${token}-${index}`} className="rounded-md border bg-muted/30 px-2.5 py-2 font-mono text-xs font-bold">{token}</span>)}
            </div>
            <dl className="mt-5 grid gap-4 text-sm">
              <div><dt className="text-xs font-bold text-muted-foreground">입력</dt><dd className="mt-1.5 leading-6">{phase.input}</dd></div>
              <div><dt className="text-xs font-bold text-muted-foreground">남기는 결과</dt><dd className="mt-1.5 leading-6">{phase.output}</dd></div>
              <div><dt className="text-xs font-bold text-muted-foreground">먼저 볼 지표</dt><dd className="mt-1.5 leading-6">{phase.pressure}</dd></div>
            </dl>
          </article>
        ))}
      </div>
    </figure>
  );
}
