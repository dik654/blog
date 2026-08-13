const ROWS = [
  ["Target-only", "1회 weight read", "1 token", "1.00×"],
  ["평균 Y=3.5", "1회 weight read", "3.5 tokens", "약 0.29×"],
  ["평균 Y=10", "1회 weight read", "10 tokens", "약 0.10×"],
] as const;

export default function MtpAmortizationViz() {
  return (
    <figure
      data-viz="mtp-weight-read-amortization"
      className="not-prose my-12 overflow-hidden rounded-xl border border-border/70 bg-card"
    >
      <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7">
        <p className="text-xs font-bold text-primary">MEMORY-BOUND INTUITION</p>
        <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">
          같은 target weight read를 몇 token이 함께 부담하는가
        </h3>
      </figcaption>
      <div className="p-5 sm:p-7">
        <div className="hidden grid-cols-[1.1fr_1fr_1fr_.8fr] gap-x-5 border-b px-4 pb-3 text-xs font-bold text-muted-foreground md:grid">
          <span>실행 방식</span><span>Target 비용</span><span>확정 결과</span><span>token당 비율</span>
        </div>
        <div className="grid gap-3 pt-3">
          {ROWS.map(([mode, read, tokens, ratio]) => (
            <div
              key={mode}
              className="grid min-w-0 gap-3 rounded-lg border bg-background p-4 md:grid-cols-[1.1fr_1fr_1fr_.8fr] md:items-center md:gap-x-5"
            >
              <div><span className="md:hidden text-xs font-bold text-muted-foreground">실행 방식 · </span><strong>{mode}</strong></div>
              <div className="text-sm"><span className="md:hidden text-xs font-bold text-muted-foreground">Target 비용 · </span>{read}</div>
              <div className="text-sm"><span className="md:hidden text-xs font-bold text-muted-foreground">확정 결과 · </span>{tokens}</div>
              <div className="font-mono text-sm font-bold text-primary"><span className="md:hidden font-sans text-xs text-muted-foreground">token당 · </span>{ratio}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t bg-muted/20 px-5 py-4 text-sm leading-6 text-muted-foreground sm:px-7">
        마지막 열은 weight traffic만 나눈 이상적 근사입니다. Draft·verification·KV·동기화 비용을 빼지 않았으므로 실제 speedup 표가 아닙니다.
      </div>
    </figure>
  );
}
