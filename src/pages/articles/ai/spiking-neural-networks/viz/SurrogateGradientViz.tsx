import StepViz from "@/components/ui/step-viz";

const trace = [
  { t: 1, before: "1.180000", distance: "0.180000", spike: 1, slope: 0.277008 },
  { t: 2, before: "0.244000", distance: "−0.756000", spike: 0, slope: 0.04377 },
  { t: 3, before: "1.095200", distance: "0.095200", spike: 1, slope: 0.45899 },
  { t: 4, before: "0.376160", distance: "−0.623840", spike: 0, slope: 0.05893 },
  { t: 5, before: "1.000928", distance: "0.000928", spike: 1, slope: 0.990784 },
] as const;

const steps = trace.map((row) => ({
  label: `${row.t}번째 기울기`,
  body: `순방향은 발화 ${row.spike}을 냅니다. 역방향은 문턱 거리 ${row.distance}에 fast-sigmoid 기울기를 적용합니다.`,
}));

export default function SurrogateGradientViz() {
  return (
    <StepViz steps={steps}>
      {(step) => {
        const row = trace[step];
        return (
          <div className="w-full max-w-3xl space-y-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-border/75 bg-background p-4">
                <p className="text-xs font-semibold text-muted-foreground">
                  리셋 전 전압
                </p>
                <p className="mt-2 font-mono text-sm font-bold">{row.before}</p>
              </div>
              <div className="rounded-lg border border-border/75 bg-background p-4">
                <p className="text-xs font-semibold text-muted-foreground">
                  문턱까지 거리 z
                </p>
                <p className="mt-2 font-mono text-sm font-bold">
                  {row.distance}
                </p>
              </div>
              <div className="rounded-lg border border-primary/35 bg-primary/[0.05] p-4">
                <p className="text-xs font-semibold text-primary">
                  순방향 발화
                </p>
                <p className="mt-2 font-mono text-sm font-bold">
                  H(z) = {row.spike}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border/75 bg-background p-4">
              <div className="flex min-w-0 items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground">
                    역방향에서 빌리는 기울기 · α=5
                  </p>
                  <p className="mt-2 break-words font-mono text-xs font-bold">
                    1 ÷ (1 + 5 × |{row.distance}|)²
                  </p>
                </div>
                <p className="shrink-0 font-mono text-base font-black">
                  {row.slope.toFixed(6)}
                </p>
              </div>
              <div className="mt-4 h-5 overflow-hidden rounded-md border border-border bg-muted/30">
                <div
                  className="h-full bg-primary/45 transition-[width] duration-300"
                  style={{ width: `${Math.max(3, row.slope * 100)}%` }}
                />
              </div>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                문턱에 가까울수록 막대가 깁니다. 이 값은 hard step의 정확한
                미분이 아니라 학습에 쓰는 대체 신호입니다.
              </p>
            </div>
          </div>
        );
      }}
    </StepViz>
  );
}
