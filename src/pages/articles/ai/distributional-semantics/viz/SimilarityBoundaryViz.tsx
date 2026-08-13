import VizFrame from "@/components/viz/VizFrame";

const layers = [
  ["Geometry", "cosine / dot product", "representation proximity"],
  ["Lexical relation", "synonym · antonym · related", "labeled distinction"],
  ["Task transfer", "retrieval · classification", "downstream utility"],
  ["Social evidence", "bias · subgroup audit", "deployment risk"],
] as const;

export default function SimilarityBoundaryViz() {
  return (
    <VizFrame
      eyebrow="Evaluation boundary"
      title="가까운 vector라는 사실에서 의미·정확성·공정성을 바로 결론 내리지 않습니다"
    >
      <div className="divide-y divide-border/70">
        {layers.map(([name, measure, claim]) => (
          <div
            key={name}
            className="grid min-w-0 gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[8rem_12rem_1fr] sm:gap-5"
          >
            <p className="text-sm font-bold text-foreground">{name}</p>
            <p className="break-words font-mono text-xs leading-5 text-primary">
              {measure}
            </p>
            <p className="text-xs leading-5 text-muted-foreground">{claim}</p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
