import VizFrame from "@/components/viz/VizFrame";

const views = [
  [
    "Optimization",
    "identity 주변의 function parameterization",
    "원 논문의 직접 동기",
  ],
  ["Signal paths", "짧고 긴 computational path의 공존", "후속 분석"],
  ["Loss landscape", "architecture별 curvature 관찰", "시각화·경험 분석"],
  ["Backbone reuse", "stage feature를 downstream head에 전달", "응용 결과"],
] as const;

export default function InterpretationViz() {
  return (
    <VizFrame
      eyebrow="Claim boundary"
      title="Residual network을 설명하는 여러 관점은 증거 수준이 다릅니다"
    >
      <div className="divide-y divide-border/70">
        {views.map(([name, claim, level]) => (
          <div
            key={name}
            className="grid min-w-0 gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[8rem_1fr_8rem] sm:gap-5"
          >
            <p className="text-sm font-bold text-foreground">{name}</p>
            <p className="text-xs leading-5 text-muted-foreground">{claim}</p>
            <p className="text-xs font-semibold text-primary sm:text-right">
              {level}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
