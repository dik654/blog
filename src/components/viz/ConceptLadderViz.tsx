import VizFrame from "@/components/viz/VizFrame";

export default function ConceptLadderViz({
  title,
  description,
  steps,
}: {
  title: string;
  description: string;
  steps: readonly { label: string; detail: string }[];
}) {
  return (
    <VizFrame
      eyebrow="Concept composition map"
      title={title}
      description={description}
      note="각 상자는 앞 개념을 이해한 뒤에만 다음 상자로 넘어가는 학습 경계입니다."
    >
      <div
        data-viz-canvas
        role="img"
        aria-label={`${title} 개념 조합 지도`}
        className="grid min-w-0 gap-3 md:grid-flow-col md:auto-cols-fr"
      >
        {steps.map((step, index) => (
          <div
            key={step.label}
            className="relative min-w-0 border border-border bg-background px-4 py-5"
          >
            <p className="text-xs font-black text-primary">
              {String(index + 1).padStart(2, "0")}
            </p>
            <p className="mt-2 text-sm font-black leading-5">{step.label}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {step.detail}
            </p>
            {index < steps.length - 1 ? (
              <span
                aria-hidden
                className="absolute -bottom-3 left-1/2 text-primary md:-right-3 md:bottom-auto md:left-auto md:top-1/2"
              >
                →
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
