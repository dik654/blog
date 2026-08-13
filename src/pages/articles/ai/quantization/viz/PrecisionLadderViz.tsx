const rows = [
  ["Numerical format", "INT4 · FP8 · NF4", "codebook과 representable range"],
  ["Tensor target", "W4 · W8A8 · KV8", "무엇을 저장·계산하는지"],
  ["Scale policy", "tensor · channel · group", "몇 값이 range를 공유하는지"],
  ["Runtime path", "packed GEMM · dequant fallback", "어떤 kernel이 실제 실행되는지"],
];

export default function PrecisionLadderViz() {
  return <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-300">Quantization receipt</p>
    <h3 className="mt-1 text-lg font-semibold">“4-bit” 한 단어를 네 개의 독립된 계약으로 펼칩니다</h3>
    <div className="mt-5 divide-y divide-border/70 border-y border-border/70">
      {rows.map(([axis, value, question], index) => <div key={axis} className="grid gap-2 py-4 sm:grid-cols-[2.5rem_10rem_1fr] sm:items-baseline sm:gap-4">
        <span className="text-xs tabular-nums text-muted-foreground">0{index + 1}</span>
        <strong className="text-sm">{axis}</strong>
        <div className="min-w-0"><p className="break-words font-mono text-xs">{value}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{question}</p></div>
      </div>)}
    </div>
  </div>;
}
