const tensors = [
  ["Input", "X", "B × Din", "data 또는 이전 layer activation"],
  ["Parameter", "W", "Din × Dout", "모든 sample이 공유"],
  ["Logits", "Z=XW+b", "B × Dout", "softmax 앞의 raw score"],
  ["Upstream", "G=Ŷ−Y", "B × Dout", "reduction에 따라 1/B scale 포함"],
  ["Weight grad", "XᵀG", "Din × Dout", "batch contribution 합산"],
  ["Input grad", "GWᵀ", "B × Din", "앞 layer로 전달"],
];

export default function BackpropShapeViz() {
  return (
    <figure data-viz="backprop-shape-trace" className="not-prose my-9 overflow-hidden rounded-xl border border-border/75 bg-card">
      <figcaption className="border-b border-border/60 px-4 py-4 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Matrix backward</p>
        <p className="mt-1 font-semibold">transpose 위치는 외우는 규칙이 아니라 shape contract에서 정해집니다</p>
      </figcaption>
      <div className="overflow-x-auto">
        <div className="min-w-[650px] divide-y divide-border/60">
          {tensors.map(([role, symbol, shape, meaning]) => (
            <div key={role} className="grid grid-cols-[7rem_9rem_8rem_1fr] items-center gap-3 bg-background px-4 py-3.5 sm:px-6">
              <p className="text-sm font-semibold">{role}</p>
              <code className="text-xs font-bold text-primary">{symbol}</code>
              <code className="text-xs text-foreground/70">{shape}</code>
              <p className="text-sm text-muted-foreground">{meaning}</p>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}
