import VizFrame from "@/components/viz/VizFrame";

const methods = [
  ["PPMI + SVD", "explicit matrix", "factorize weighted counts"],
  ["SGNS", "sampled pairs", "implicit shifted-PMI relation"],
  ["GloVe", "nonzero global counts", "weighted log-bilinear regression"],
  ["Contextual model", "sequence instances", "position-specific hidden state"],
] as const;

export default function MethodBridgeViz() {
  return (
    <VizFrame
      eyebrow="Method bridge"
      title="방법은 달라도 corpus에서 만든 word–context evidence를 압축한다는 축을 공유합니다"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {methods.map(([name, evidence, objective]) => (
          <div key={name} className="min-w-0 border-t border-border/80 pt-4">
            <p className="text-sm font-bold text-foreground">{name}</p>
            <p className="mt-3 text-xs font-semibold text-primary">
              {evidence}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {objective}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
