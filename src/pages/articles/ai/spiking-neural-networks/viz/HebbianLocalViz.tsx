import StepViz from "@/components/ui/step-viz";

const steps = [
  {
    label: "앞 활동 0.5",
    body: "해당 연결로 들어오는 뉴런의 국소 활동만 봅니다.",
  },
  {
    label: "뒤 활동 0.8",
    body: "연결을 받은 뉴런의 활동도 같은 시간창에서 봅니다.",
  },
  {
    label: "국소 곱 0.4",
    body: "두 활동을 곱하면 0.5×0.8=0.4입니다.",
  },
  {
    label: "가중치 +0.04",
    body: "변화율 0.1을 곱해 Δw=0.04를 얻지만, 셋째 발화가 오답이라는 정보는 이 계산 안에 없습니다.",
  },
] as const;

export default function HebbianLocalViz() {
  return (
    <StepViz steps={steps}>
      {(step) => (
        <div className="w-full max-w-3xl space-y-5">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
            <div
              className={`rounded-xl border p-4 text-center ${
                step >= 0
                  ? "border-primary/35 bg-primary/[0.05]"
                  : "border-border"
              }`}
            >
              <p className="text-xs font-semibold text-muted-foreground">
                앞 뉴런
              </p>
              <p className="mt-2 font-mono text-lg font-black">0.5</p>
            </div>
            <span className="hidden text-muted-foreground sm:block">×</span>
            <div
              className={`rounded-xl border p-4 text-center ${
                step >= 1
                  ? "border-primary/35 bg-primary/[0.05]"
                  : "border-border"
              }`}
            >
              <p className="text-xs font-semibold text-muted-foreground">
                뒤 뉴런
              </p>
              <p className="mt-2 font-mono text-lg font-black">0.8</p>
            </div>
            <span className="hidden text-muted-foreground sm:block">× 0.1</span>
            <div
              className={`rounded-xl border p-4 text-center ${
                step >= 3
                  ? "border-amber-600/45 bg-amber-500/[0.08]"
                  : "border-border"
              }`}
            >
              <p className="text-xs font-semibold text-muted-foreground">
                연결 변화
              </p>
              <p className="mt-2 font-mono text-lg font-black">
                {step >= 3 ? "+0.04" : step >= 2 ? "0.4 × 0.1" : "?"}
              </p>
            </div>
          </div>
          <div className="rounded-lg border-l-2 border-amber-600/50 bg-amber-500/[0.04] p-4 text-sm leading-6 text-muted-foreground">
            국소 계산에 보이는 값: 앞 활동, 뒤 활동, 변화율. 보이지 않는 값:
            목표 발화열과 셋째 발화의 오답 여부.
          </div>
        </div>
      )}
    </StepViz>
  );
}
