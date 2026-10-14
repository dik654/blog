import StepViz from "@/components/ui/step-viz";

const steps = [
  {
    label: "밀집 기준 20pJ",
    body: "아래쪽 연결이 다섯 시점의 값을 모두 처리하면 5회×4pJ=20pJ입니다.",
  },
  {
    label: "발화 계산 3pJ",
    body: "발화가 세 번뿐이고 발화당 계산이 1pJ라면 연결 계산은 3pJ입니다.",
  },
  {
    label: "상태 갱신 10pJ",
    body: "뉴런 전압은 발화하지 않은 시점에도 다섯 번 갱신됩니다. 5회×2pJ=10pJ를 더합니다.",
  },
  {
    label: "전달·입출력 10pJ",
    body: "발화 전달과 입력 변환에 10pJ가 들면 전체는 23pJ입니다. 이 가정에서는 밀집 기준보다 큽니다.",
  },
] as const;

const parts = [
  { label: "발화가 만든 연결 계산", value: 3, color: "bg-primary/45" },
  { label: "다섯 번의 전압 갱신", value: 10, color: "bg-emerald-500/40" },
  { label: "전달과 입출력", value: 10, color: "bg-amber-500/40" },
] as const;

export default function EnergyBoundaryViz() {
  return (
    <StepViz steps={steps}>
      {(step) => {
        const activeParts = step === 0 ? [] : parts.slice(0, step);
        const total =
          step === 0
            ? 20
            : activeParts.reduce((sum, part) => sum + part.value, 0);

        return (
          <div className="w-full max-w-3xl space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/75 bg-background p-4">
                <p className="text-xs font-semibold text-muted-foreground">
                  밀집 실행 기준
                </p>
                <p className="mt-2 font-mono text-lg font-black">
                  5 × 4pJ = 20pJ
                </p>
              </div>
              <div className="rounded-xl border border-primary/35 bg-primary/[0.04] p-4">
                <p className="text-xs font-semibold text-primary">
                  현재까지 센 SNN 장부
                </p>
                <p className="mt-2 font-mono text-lg font-black">{total}pJ</p>
              </div>
            </div>

            <div className="space-y-2">
              {step === 0 ? (
                <div className="rounded-lg border border-border/75 p-4">
                  <p className="text-sm font-bold">다섯 시점을 모두 처리</p>
                  <div className="mt-3 grid grid-cols-5 gap-1.5">
                    {Array.from({ length: 5 }, (_, index) => (
                      <span key={index} className="h-8 rounded-sm bg-muted" />
                    ))}
                  </div>
                </div>
              ) : (
                activeParts.map((part) => (
                  <div
                    key={part.label}
                    className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border/75 bg-background p-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold">{part.label}</p>
                      <div className="mt-2 h-3 overflow-hidden rounded-sm bg-muted/40">
                        <div
                          className={`h-full ${part.color}`}
                          style={{ width: `${part.value * 4}%` }}
                        />
                      </div>
                    </div>
                    <p className="font-mono text-sm font-black">
                      {part.value}pJ
                    </p>
                  </div>
                ))
              )}
            </div>

            <p className="text-xs leading-5 text-muted-foreground">
              모든 pJ 값은 원리를 비교하기 위한 가정입니다. 실제 값은
              칩·전압·배치·배선·입력 변환을 같은 범위에서 측정해야 합니다.
            </p>
          </div>
        );
      }}
    </StepViz>
  );
}
