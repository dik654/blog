const rows = [
  ["learning rate", "float · log", "10⁻⁵ ≤ λ ≤ 10⁻¹", "네 자릿수를 같은 비중으로 탐색"],
  ["depth", "integer", "4 ≤ d ≤ 16", "실제로 만들 수 있는 layer 수"],
  ["optimizer", "categorical", "AdamW | SGD", "branch parent"],
  ["momentum", "float · conditional", "optimizer = SGD", "AdamW trial에서는 생성하지 않음"],
  ["batch × resolution", "joint constraint", "m̂(λ) ≤ Mmax", "OOM 전에 feasible 조합만 제안"],
];

export default function SearchSpaceViz() {
  return (
    <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Typed search-space manifest · v3</p>
      <h3 className="mt-1 text-lg font-semibold">이름·type·분포·조건을 함께 저장해야 같은 공간을 다시 만들 수 있습니다</h3>
      <div className="mt-5 overflow-hidden rounded-lg border border-border/60">
        <div className="grid gap-2 border-b border-border/60 bg-muted/25 px-4 py-3 text-xs font-semibold text-muted-foreground md:grid-cols-[1fr_1fr_1.15fr_1.45fr] md:gap-5">
          <span>Parameter</span><span>Type / scale</span><span>Domain / condition</span><span>설계 이유</span>
        </div>
        {rows.map(([name, type, domain, reason]) => (
          <div key={name} className="grid gap-2 border-b border-border/50 px-4 py-4 last:border-b-0 md:grid-cols-[1fr_1fr_1.15fr_1.45fr] md:gap-5 md:py-3">
            <p className="break-words text-sm font-semibold">{name}</p>
            <p className="break-words text-xs font-mono">{type}</p>
            <p className="break-words text-xs text-foreground/80">{domain}</p>
            <p className="text-xs leading-5 text-muted-foreground">{reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
