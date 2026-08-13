import VizFrame from "@/components/viz/VizFrame";

const path = [
  ["Hidden state", "D", "learned representation"],
  ["LM head", "D → |V|", "vocabulary score"],
  ["Training", "target + loss mask", "gradient"],
  ["Inference", "decoding policy", "next token"],
] as const;

export default function OutputContractViz() {
  return (
    <VizFrame
      eyebrow="Head boundary"
      title="같은 logits에서 training과 inference가 서로 다른 경로로 갈라집니다"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {path.map(([name, operator, output], index) => (
          <div key={name} className="min-w-0 border-t border-border/80 pt-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-foreground">{name}</p>
              <span className="font-mono text-xs text-primary">
                0{index + 1}
              </span>
            </div>
            <p className="mt-3 break-words font-mono text-xs text-primary">
              {operator}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {output}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
