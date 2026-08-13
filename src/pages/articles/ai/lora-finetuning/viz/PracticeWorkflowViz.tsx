const paths = [
  ["Unmerged", "quantized/full base + adapter", "동적 교체", "추가 adapter 경로"],
  ["Merged", "W′=W+sBA", "한 weight artifact", "높은 precision 저장량"],
  ["Merged + requantized", "Q(W′)", "low-bit serving", "새 quantization error"],
] as const;

export default function PracticeWorkflowViz() {
  return (
    <figure data-viz className="rounded-xl border border-border bg-background p-4 sm:p-5">
      <figcaption><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Adapter artifact lineage</p><p className="mt-1 font-semibold">학습 checkpoint 하나에서 서로 다른 세 serving artifact가 갈라집니다</p></figcaption>
      <div className="mt-5 border-y border-border py-3 text-xs leading-5"><span className="font-semibold">Pinned input</span><span className="mx-2 text-muted-foreground">→</span><span className="text-muted-foreground">base hash · tokenizer/template · adapter config/data · quant config</span></div>
      <div className="mt-5 divide-y divide-border">{paths.map(([name,artifact,strength,risk])=><div key={name} className="grid gap-2 py-3 sm:grid-cols-[10rem_1fr_8rem_1fr]"><p className="text-sm font-semibold">{name}</p><p className="font-mono text-xs">{artifact}</p><p className="text-xs text-muted-foreground">{strength}</p><p className="text-xs text-muted-foreground">주의: {risk}</p></div>)}</div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">각 행은 별도 checksum·logit parity tolerance·task/general/safety quality·memory·p95 latency를 통과한 뒤 배포합니다.</p>
    </figure>
  );
}
