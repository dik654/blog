const TOKENS = [
  { token: "t₁", result: "수락", detail: "target 규칙 통과", tone: "border-emerald-500/30 bg-emerald-500/[0.07] text-emerald-800 dark:text-emerald-200" },
  { token: "t₂", result: "수락", detail: "target 규칙 통과", tone: "border-emerald-500/30 bg-emerald-500/[0.07] text-emerald-800 dark:text-emerald-200" },
  { token: "t₃", result: "거부", detail: "correction으로 교체", tone: "border-rose-500/30 bg-rose-500/[0.07] text-rose-800 dark:text-rose-200" },
  { token: "t₄", result: "제외", detail: "조건이 달라짐", tone: "border-border bg-muted/30 text-muted-foreground" },
] as const;

export default function AcceptanceTraceViz() {
  return (
    <figure
      data-viz="speculative-acceptance-prefix"
      className="not-prose my-12 overflow-hidden rounded-xl border border-border/70 bg-card"
    >
      <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7">
        <p className="text-xs font-bold text-primary">CAUSAL PREFIX</p>
        <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">
          세 번째 후보가 바뀌면 그 후보를 조건으로 만든 네 번째 후보도 다시 계산합니다
        </h3>
      </figcaption>
      <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-4">
        {TOKENS.map((item, index) => (
          <article key={item.token} className={`min-w-0 rounded-lg border p-4 ${item.tone}`}>
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-lg font-black">{item.token}</span>
              <span className="text-xs font-bold">{item.result}</span>
            </div>
            <p className="mt-3 text-xs leading-5 opacity-80">{item.detail}</p>
            <p className="mt-3 border-t border-current/15 pt-3 text-[11px] font-semibold opacity-75">
              prefix position {index + 1}
            </p>
          </article>
        ))}
      </div>
      <div className="border-t bg-muted/20 px-5 py-4 text-sm leading-6 text-muted-foreground sm:px-7">
        이 예에서는 수락 draft 길이 A=2입니다. 세 번째 위치의 correction을 포함해 실제 확정 길이 Y=3이 될 수 있습니다.
      </div>
    </figure>
  );
}
