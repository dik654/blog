import VizFrame from "@/components/viz/VizFrame";

const factors = [
  ["M", "words × contexts", "weighted observations"],
  ["Uₖ", "words × k", "word coordinates"],
  ["Σₖ", "k scales", "direction strength"],
  ["Vₖᵀ", "k × contexts", "context coordinates"],
] as const;

export default function FactorizationViz() {
  return (
    <VizFrame
      eyebrow="Low-rank approximation"
      title="SVD는 sparse observation axes를 공유 latent directions로 분해합니다"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {factors.map(([symbol, shape, role]) => (
          <div key={symbol} className="min-w-0 border-l border-border/80 pl-4">
            <p className="font-mono text-sm font-bold text-primary">{symbol}</p>
            <p className="mt-3 break-words font-mono text-xs text-foreground">
              {shape}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {role}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
