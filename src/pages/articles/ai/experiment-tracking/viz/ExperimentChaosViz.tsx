const inputs = ["code / diff", "data / split", "resolved config", "image / hardware"];
const outputs = ["checkpoint", "prediction", "metric receipt", "logs / failure"];

export default function ExperimentChaosViz() {
  return (
    <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Provenance receipt</p>
      <h3 className="mt-1 text-lg font-semibold">한 run은 입력 snapshot과 실행 attempt, 산출물을 연결하는 가운데 node입니다</h3>
      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_.78fr_1fr] lg:items-stretch">
        <div className="rounded-lg border border-border/60 bg-background p-4">
          <p className="text-xs font-semibold">Immutable inputs</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {inputs.map((item) => <p key={item} className="rounded-md border border-border/50 px-3 py-2 font-mono text-[11px] text-muted-foreground">{item}</p>)}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <p className="font-mono text-[11px] text-muted-foreground">attempt / 7fa2</p>
          <p className="mt-3 text-sm font-semibold">Execution run</p>
          <dl className="mt-4 space-y-3 text-xs">
            <div><dt className="text-muted-foreground">Spec</dt><dd className="mt-1 font-mono">9d34…e81c</dd></div>
            <div><dt className="text-muted-foreground">Seed / retry</dt><dd className="mt-1 font-mono">03 / 01</dd></div>
            <div><dt className="text-muted-foreground">Status</dt><dd className="mt-1">FAILED · step 1840</dd></div>
          </dl>
        </div>
        <div className="rounded-lg border border-border/60 bg-background p-4">
          <p className="text-xs font-semibold">Versioned outputs</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {outputs.map((item) => <p key={item} className="rounded-md border border-border/50 px-3 py-2 font-mono text-[11px] text-muted-foreground">{item}</p>)}
          </div>
        </div>
      </div>
      <p className="mt-4 border-t border-border/60 pt-4 text-xs leading-5 text-muted-foreground">성공하지 못한 attempt도 같은 spec의 failure evidence이므로 덮어쓰거나 지우지 않습니다.</p>
    </div>
  );
}
