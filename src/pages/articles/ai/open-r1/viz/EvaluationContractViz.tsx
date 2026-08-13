import VizFrame from "@/components/viz/VizFrame";

const axes = [
  ["Task", "revision · contamination rule"],
  ["Prompt", "template · reasoning prefill"],
  ["Sampling", "T · top-p · max tokens · K"],
  ["Scoring", "parser · verifier · runtime"],
  ["Report", "mean · uncertainty · length · cost"],
] as const;

export default function EvaluationContractViz() {
  return (
    <VizFrame
      eyebrow="Evaluation contract"
      title="Model 이름과 score 사이에 있는 실험 조건을 함께 고정합니다"
    >
      <div className="grid gap-5 md:grid-cols-5">
        {axes.map(([title, body]) => (
          <div key={title} className="min-w-0 border-t border-border/80 pt-4">
            <p className="text-sm font-bold text-foreground">{title}</p>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">
              {body}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
