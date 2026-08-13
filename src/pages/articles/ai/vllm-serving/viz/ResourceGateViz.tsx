const GATES = [
  ["Token budget", "이번 iteration의 prefill chunk + decode token", "max_num_batched_tokens"],
  ["Sequence cap", "Token을 하나 이상 처리할 active sequence", "max_num_seqs"],
  ["KV blocks", "선택한 token 뒤에 보존할 layer state", "allocator free blocks"],
] as const;

export default function ResourceGateViz() {
  return (
    <figure data-viz="vllm-resource-feasibility" className="not-prose my-12 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7">
        <p className="text-xs font-bold text-primary">THREE HARD GATES</p>
        <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">세 예산을 모두 통과한 token만 model execution에 들어갑니다</h3>
      </figcaption>
      <div className="grid gap-4 p-5 sm:p-7 lg:grid-cols-3">
        {GATES.map(([title, counted, source], index) => (
          <article key={title} className="min-w-0 rounded-lg border bg-background p-5">
            <div className="flex items-center gap-3"><span className="font-mono text-xs font-black text-primary">0{index + 1}</span><h4 className="font-bold">{title}</h4></div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{counted}</p>
            <p className="mt-4 border-t pt-3 font-mono text-xs leading-5 text-foreground">{source}</p>
          </article>
        ))}
      </div>
    </figure>
  );
}
