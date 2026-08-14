const rounds = [
  { title: "Oracle 0", value: "16 evaluations", detail: "f(x), f(−x)" },
  { title: "Fold 1", value: "8 evaluations", detail: "g(x²)=even+β·odd" },
  { title: "Fold 2", value: "4 evaluations", detail: "새 challenge로 반복" },
  { title: "Final", value: "작은 polynomial", detail: "직접 degree 검사" },
];

export default function FRIFoldingViz() {
  return (
    <figure data-viz="fri-folding-flow" data-viz-canvas className="not-prose my-8 min-w-0 rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <figcaption className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">FRI folding</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">각 round는 현재 oracle root를 먼저 고정하고 challenge를 받은 뒤, x와 −x를 새 값 하나로 접습니다.</p>
      </figcaption>
      <div className="grid gap-3 md:grid-cols-4">
        {rounds.map((round, index) => (
          <div key={round.title} className="relative min-w-0 rounded-lg border border-border/80 bg-background p-4">
            <p className="text-xs font-semibold text-primary">ROUND {index}</p>
            <p className="mt-2 text-sm font-semibold">{round.title}</p>
            <p className="mt-3 break-words font-mono text-sm">{round.value}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{round.detail}</p>
            {index < rounds.length - 1 && <span aria-hidden className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-sm text-muted-foreground md:block">→</span>}
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-border/70 bg-muted/20 p-4">
        <div className="grid gap-3 text-xs sm:grid-cols-3">
          <p><strong>Pair opening</strong><br /><span className="text-muted-foreground">f(x), f(−x) Merkle path</span></p>
          <p><strong>Fold check</strong><br /><span className="text-muted-foreground">다음 oracle의 g(x²)와 일치</span></p>
          <p><strong>Transcript</strong><br /><span className="text-muted-foreground">root → β → root → query 순서</span></p>
        </div>
      </div>
    </figure>
  );
}
