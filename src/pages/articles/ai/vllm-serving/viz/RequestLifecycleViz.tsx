const STEPS = [
  ["01", "Request", "Prompt·sampling option·stream contract를 검증하고 token state로 바꿉니다."],
  ["02", "Schedule", "이번 iteration에 처리할 prefill·decode token과 KV block을 선택합니다."],
  ["03", "Execute", "Worker가 model forward와 sampling을 수행하고 결과 state를 돌려줍니다."],
  ["04", "Stream · update", "Token을 전송하고 완료 요청을 제거한 뒤 다음 iteration으로 돌아갑니다."],
] as const;

export default function RequestLifecycleViz() {
  return (
    <figure data-viz="vllm-request-lifecycle" className="not-prose my-12 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7">
        <p className="text-xs font-bold text-primary">ONLINE REQUEST LIFECYCLE</p>
        <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">한 요청은 GPU 한 번으로 끝나지 않고 iteration loop를 여러 번 통과합니다</h3>
      </figcaption>
      <ol className="grid gap-5 p-5 sm:p-7 lg:grid-cols-4">
        {STEPS.map(([number, title, body]) => (
          <li key={title} className="min-w-0 rounded-lg border bg-background p-5">
            <div className="flex items-center gap-3"><span className="font-mono text-xs font-black text-primary">{number}</span><span className="h-px flex-1 bg-border" /></div>
            <p className="mt-4 font-bold">{title}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
          </li>
        ))}
      </ol>
      <div className="border-t bg-muted/20 px-5 py-4 text-sm leading-6 text-muted-foreground sm:px-7">04에서 끝나지 않은 request는 02로 돌아갑니다. 이 반복 경계가 batch를 다시 구성할 기회입니다.</div>
    </figure>
  );
}
