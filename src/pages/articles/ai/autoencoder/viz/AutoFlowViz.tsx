const layers = [
  { title: "입력", shape: "4 features", width: "md:col-span-2", tone: "border-sky-500/45" },
  { title: "Encoder", shape: "4 → 3", width: "md:col-span-2", tone: "border-sky-500/45" },
  { title: "Bottleneck", shape: "3 → 2", width: "md:col-span-1", tone: "border-amber-500/55" },
  { title: "Decoder", shape: "2 → 3", width: "md:col-span-2", tone: "border-emerald-500/45" },
  { title: "복원", shape: "3 → 4", width: "md:col-span-2", tone: "border-emerald-500/45" },
];

export default function AutoFlowViz() {
  return (
    <figure data-viz="autoencoder-architecture" className="not-prose my-8 min-w-0 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
      <figcaption className="mb-5 text-sm font-semibold">차원은 줄었다가 다시 늘지만, 함수는 서로 독립적으로 학습됩니다</figcaption>
      <div className="grid gap-3 md:grid-cols-9">
        {layers.map((layer, index) => (
          <div key={layer.title} className={`min-w-0 border-t bg-background px-3 py-4 ${layer.tone} ${layer.width}`}>
            <p className="text-xs font-bold text-muted-foreground">0{index + 1}</p>
            <p className="mt-2 font-semibold">{layer.title}</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">{layer.shape}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          ["Undercomplete", "k < n · 크기로 압축"],
          ["Overcomplete", "k ≥ n · 다른 regularization 필요"],
          ["비대칭 가능", "Encoder와 decoder가 거울일 필요 없음"],
        ].map(([title, body]) => (
          <div key={title} className="min-w-0 border-l border-border pl-3">
            <p className="text-sm font-semibold">{title}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}
