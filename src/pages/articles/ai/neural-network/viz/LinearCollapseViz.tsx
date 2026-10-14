import StepViz from "@/components/ui/step-viz";

const steps = [
  {
    label: "아핀 층 두 개",
    body: "z₁=2x−1의 결과를 z₂=3z₁+2에 그대로 넣습니다.",
  },
  {
    label: "한 식으로 합치기",
    body: "분배하면 z₂=6x−1이 되어 중간 층을 정확히 없앨 수 있습니다.",
  },
  {
    label: "ReLU를 사이에 넣기",
    body: "x≤0.5에서는 2, x>0.5에서는 6x−1이 되어 입력 구간마다 식이 달라집니다.",
  },
] as const;

const samples = [0, 0.5, 1] as const;

export default function LinearCollapseViz() {
  return (
    <StepViz steps={steps}>
      {(step) => (
        <div className="w-full max-w-4xl">
          {step < 2 ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["첫째 층", "z₁=2x−1"],
                ["둘째 층", "z₂=3z₁+2"],
                ["합친 결과", "z₂=6x−1"],
              ].map(([label, value], index) => (
                <div
                  key={label}
                  className={`relative min-w-0 rounded-xl border bg-background p-5 ${step === 1 && index === 2 ? "border-emerald-500/35" : "border-border/75"}`}
                >
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="mt-3 break-words font-mono text-sm font-semibold">
                    {value}
                  </p>
                  {index < 2 && (
                    <span className="absolute -right-2.5 top-1/2 hidden -translate-y-1/2 bg-background px-1 text-muted-foreground sm:block">
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-3">
              {samples.map((x) => {
                const affine = 6 * x - 1;
                const relu = 3 * Math.max(0, 2 * x - 1) + 2;
                return (
                  <div
                    key={x}
                    className="rounded-xl border border-border/75 bg-background p-5"
                  >
                    <p className="text-xs text-muted-foreground">입력 x={x}</p>
                    <p className="mt-3 font-mono text-sm">아핀만: {affine}</p>
                    <p className="mt-2 font-mono text-sm font-semibold text-primary">
                      ReLU 포함: {relu}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
