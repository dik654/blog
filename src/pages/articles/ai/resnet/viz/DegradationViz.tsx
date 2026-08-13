import VizFrame from "@/components/viz/VizFrame";

const comparison = [
  ["Shallow plain net", "reachable training solution", "baseline train error"],
  [
    "Deeper plain net",
    "extra layers could express identity",
    "observed higher train error",
  ],
  [
    "Residual net",
    "extra branch starts near zero update",
    "easier optimization",
  ],
] as const;

export default function DegradationViz() {
  return (
    <VizFrame
      eyebrow="Degradation problem"
      title="더 큰 함수 집합이 더 낮은 training error를 자동으로 보장하지 않습니다"
      description="깊은 plain network는 얕은 해를 포함할 수 있지만 optimizer가 그 해를 찾기 어려웠고, residual parameterization은 identity 주변을 더 직접적으로 표현했습니다."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {comparison.map(([title, premise, result], index) => (
          <div key={title} className="min-w-0 border-t border-border/80 pt-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-foreground">{title}</p>
              <span className="font-mono text-xs text-primary">
                0{index + 1}
              </span>
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              {premise}
            </p>
            <p className="mt-2 text-xs font-semibold leading-5 text-foreground">
              {result}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
