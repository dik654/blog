import VizFrame from "@/components/viz/VizFrame";

const outcomes = [
  { value: "HH", inCondition: true, inTarget: false },
  { value: "HT", inCondition: true, inTarget: true },
  { value: "TH", inCondition: false, inTarget: true },
  { value: "TT", inCondition: false, inTarget: false },
] as const;

export default function ConditionalProbabilityViz() {
  return (
    <VizFrame
      eyebrow="조건부확률의 시야"
      title="조건을 알게 되면 전체 경우를 다시 세지 않고, 남은 경우 안에서 비율을 계산합니다"
      description="A는 ‘앞면이 정확히 한 번’, B는 ‘첫 toss가 H’입니다. B를 알게 된 뒤에는 HH와 HT만 남고, 그중 A도 만족하는 HT가 절반입니다."
      note="P(A|B)는 A와 B가 얼마나 비슷한지를 재는 점수가 아닙니다. B가 일어났다는 정보를 받은 뒤 A가 일어날 확률입니다."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-foreground">전체 sample space</span>
            <span className="text-muted-foreground">각 outcome의 mass = 1/4</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {outcomes.map((outcome) => (
              <div
                key={outcome.value}
                className={`min-w-0 rounded-lg border px-3 py-5 text-center ${
                  outcome.inCondition
                    ? "border-primary/55 bg-primary/[0.06]"
                    : "border-border/70 bg-background text-muted-foreground"
                }`}
              >
                <p className="font-mono text-base font-bold">{outcome.value}</p>
                <p className="mt-2 text-[11px] leading-4">
                  {outcome.inCondition ? "B 안에 남음" : "B를 알면 제외"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0 border-t border-border/70 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="text-xs font-bold text-foreground">B 안에서 다시 정규화</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/70 bg-background px-3 py-4 text-center">
              <p className="font-mono text-sm font-bold">HH</p>
              <p className="mt-2 text-[11px] text-muted-foreground">A는 아님</p>
            </div>
            <div className="rounded-lg border border-primary/55 bg-primary/[0.06] px-3 py-4 text-center">
              <p className="font-mono text-sm font-bold">HT</p>
              <p className="mt-2 text-[11px] font-medium text-primary">A ∩ B</p>
            </div>
          </div>
          <div className="mt-5 border-t border-border/70 pt-4">
            <p className="font-mono text-sm font-bold text-foreground">P(A|B) = 1 / 2</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">남은 두 outcome 가운데 target을 만족하는 outcome은 하나입니다.</p>
          </div>
        </div>
      </div>
    </VizFrame>
  );
}
