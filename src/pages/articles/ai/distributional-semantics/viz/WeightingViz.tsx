import VizFrame from "@/components/viz/VizFrame";

const values = [
  ["Observed joint", "P(w,c)", "actual pair frequency"],
  ["Independent baseline", "P(w)P(c)", "frequency-only expectation"],
  ["Ratio", "joint / baseline", "association strength"],
  ["Log + clamp", "PMI → PPMI", "additive nonnegative weight"],
] as const;

export default function WeightingViz() {
  return (
    <VizFrame
      eyebrow="Association weighting"
      title="PMI는 count를 독립 기대와 비교한 log-ratio로 바꿉니다"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {values.map(([name, expression, role], index) => (
          <div key={name} className="min-w-0 border-t border-border/80 pt-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-foreground">{name}</p>
              <span className="font-mono text-xs text-primary">
                0{index + 1}
              </span>
            </div>
            <p className="mt-3 break-words font-mono text-xs text-primary">
              {expression}
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
