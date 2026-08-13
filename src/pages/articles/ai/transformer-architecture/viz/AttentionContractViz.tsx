import VizFrame from "@/components/viz/VizFrame";

const variants = [
  ["Encoder self", "Q,K,V: encoder state", "all valid input tokens"],
  ["Causal self", "Q,K,V: decoder state", "past + current only"],
  ["Cross attention", "Q: decoder · K,V: encoder", "source tokens"],
] as const;

export default function AttentionContractViz() {
  return (
    <VizFrame
      eyebrow="Source × visibility"
      title="Self·causal·cross-attention은 같은 수식에 서로 다른 읽기 권한을 넣습니다"
    >
      <div className="grid gap-6 md:grid-cols-3">
        {variants.map(([name, source, visibility]) => (
          <div key={name} className="min-w-0 border-t border-border/80 pt-4">
            <p className="text-sm font-bold text-foreground">{name}</p>
            <p className="mt-3 break-words font-mono text-xs leading-5 text-primary">
              {source}
            </p>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              읽기 범위 · {visibility}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
