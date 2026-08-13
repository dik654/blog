import VizFrame from "@/components/viz/VizFrame";

const examples = [
  ["Example A", "prompt A → response A", "positions 0…127"],
  ["Example B", "prompt B → response B", "positions 128…255"],
];

export default function PackingBoundaryViz() {
  return (
    <VizFrame
      eyebrow="Packing boundary"
      title="빈 padding은 줄어들지만 example 사이에는 새 격리 계약이 생깁니다"
      description="두 demonstration을 같은 storage sequence에 놓아도 attention·position·label은 독립 example로 유지해야 합니다."
      note="Separator 하나는 causal visibility를 막지 않습니다. Decoded sample·attention block·label shift를 함께 검사합니다."
    >
      <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
        {examples.map(([title, trace, positions], index) => (
          <div key={title} className="contents">
            <article className="min-w-0 border-t border-border/70 pt-4">
              <p className="text-xs font-bold text-primary">{title}</p>
              <p className="mt-3 font-semibold text-foreground">{trace}</p>
              <p className="mt-2 font-mono text-xs text-muted-foreground">{positions}</p>
            </article>
            {index === 0 ? (
              <div className="flex items-center border-y border-border/70 px-3 py-3 text-center text-[11px] font-semibold text-muted-foreground md:border-x md:border-y-0">
                block boundary
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
