const LAYERS = [
  ["01", "API frontend", "HTTP·validation·tokenization·streaming", "Client-facing latency"],
  ["02", "Engine core", "Request state·scheduler·KV ownership", "Queue and admission"],
  ["03", "Model executor", "Worker orchestration·collective dispatch", "Process and network"],
  ["04", "GPU worker", "Forward·attention kernel·sampling", "Device execution"],
] as const;

export default function EngineBoundaryViz() {
  return (
    <figure data-viz="vllm-engine-boundary" className="not-prose my-12 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7">
        <p className="text-xs font-bold text-primary">RESPONSIBILITY BOUNDARY</p>
        <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">같은 request ID를 따라가되, 각 계층이 소유하는 state와 latency를 분리합니다</h3>
      </figcaption>
      <div className="grid gap-3 p-5 sm:p-7">
        {LAYERS.map(([number, title, work, signal]) => (
          <div key={title} className="grid min-w-0 gap-3 rounded-lg border bg-background p-4 sm:grid-cols-[2rem_9rem_1fr_9rem] sm:items-center sm:gap-4">
            <span className="font-mono text-xs font-black text-primary">{number}</span><strong className="text-sm">{title}</strong><span className="text-sm leading-6 text-muted-foreground">{work}</span><span className="text-xs font-semibold text-foreground">{signal}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}
