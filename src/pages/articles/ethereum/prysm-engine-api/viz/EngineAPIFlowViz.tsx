const STEPS = [
  ["01", "newPayloadVn", "payload를 실행 규칙으로 검증", "status · latestValidHash"],
  ["02", "forkchoiceUpdatedVn", "head·safe·finalized를 순서대로 적용", "payloadStatus · payloadId?"],
  ["03", "getPayloadVn", "같은 build handle로 후보 회수", "fork별 payload envelope"],
] as const;

export default function EngineAPIFlowViz() {
  return (
    <figure className="my-8 rounded-xl border border-border bg-background p-5 sm:p-6">
      <figcaption className="mb-5 text-sm font-bold">한 block root를 따라가는 Engine API receipt</figcaption>
      <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
        {STEPS.map(([step, method, action, output]) => (
          <section key={method} className="min-w-0 border-t border-border pt-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-mono text-[11px] font-semibold text-primary">{step}</span>
              <code className="break-all text-xs">{method}</code>
            </div>
            <p className="mt-3 text-sm font-semibold leading-6">{action}</p>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">출력 · {output}</p>
          </section>
        ))}
      </div>
      <p className="mt-5 border-l border-amber-500/70 pl-4 text-xs leading-5 text-muted-foreground">
        JSON-RPC 성공, payload VALID, canonical head 적용, payload build 완료는 서로 다른 상태입니다.
      </p>
    </figure>
  );
}
