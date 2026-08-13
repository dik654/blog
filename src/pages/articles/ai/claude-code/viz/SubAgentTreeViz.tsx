import VizFrame from "@/components/viz/VizFrame";

const workers = [
  ["Explore", "관련 파일 snapshot", "read-only search", "paths · evidence"],
  ["Review", "현재 diff snapshot", "read + static analysis", "risks · line refs"],
  ["Test", "changed surface snapshot", "test command only", "status · failure log"],
] as const;

export default function SubAgentTreeViz() {
  return (
    <VizFrame
      eyebrow="Delegation tree"
      title="Main Agent가 shared goal을 나누되 각 worker에는 bounded input과 allowed tools만 전달합니다"
      description="Worker는 별도 context에서 독립적인 하위 문제를 처리하고, Main Agent가 typed result와 evidence를 검증한 뒤 합칩니다."
      note="서로의 최신 결과를 계속 참조해야 하거나 같은 파일을 동시에 바꿔야 하는 작업은 병렬화하지 않습니다. 의존 관계가 있는 작업은 순서대로 실행합니다."
    >
      <section className="min-w-0 border-t border-border/80 pt-4">
        <div className="grid min-w-0 gap-2 sm:grid-cols-[8rem_1fr] sm:items-baseline">
          <h4 className="text-sm font-bold">Main Agent</h4>
          <p className="min-w-0 text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
            shared goal · task boundary · completion criteria · final ownership
          </p>
        </div>
      </section>

      <div className="mt-7 grid gap-7 md:grid-cols-3">
        {workers.map(([name, input, tools, result], index) => (
          <section key={name} className="min-w-0 border-t border-border/80 pt-4">
            <div className="flex min-w-0 items-baseline justify-between gap-4">
              <h4 className="text-sm font-bold">{name} worker</h4>
              <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                B{index + 1}
              </span>
            </div>
            <dl className="mt-3 space-y-2 text-xs leading-5">
              <div className="grid min-w-0 grid-cols-[3.5rem_1fr] gap-2">
                <dt className="text-muted-foreground">Input</dt>
                <dd className="min-w-0 [overflow-wrap:anywhere]">{input}</dd>
              </div>
              <div className="grid min-w-0 grid-cols-[3.5rem_1fr] gap-2">
                <dt className="text-muted-foreground">Tools</dt>
                <dd className="min-w-0 [overflow-wrap:anywhere]">{tools}</dd>
              </div>
              <div className="grid min-w-0 grid-cols-[3.5rem_1fr] gap-2">
                <dt className="text-muted-foreground">Result</dt>
                <dd className="min-w-0 font-semibold text-primary [overflow-wrap:anywhere]">{result}</dd>
              </div>
            </dl>
          </section>
        ))}
      </div>

      <section className="mt-7 min-w-0 border-l border-border pl-4">
        <h4 className="text-sm font-bold">Verify · merge</h4>
        <p className="mt-2 min-w-0 text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
          Main Agent가 result schema·source evidence·충돌 여부를 확인하고 shared state에 반영합니다.
        </p>
      </section>
    </VizFrame>
  );
}
