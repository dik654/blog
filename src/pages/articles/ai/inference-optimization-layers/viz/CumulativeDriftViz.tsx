import SceneShell from "./SceneShell";

/**
 * 본문 대응: #decision — 5%씩 세 번 느려지면 1.05³−1 = 15.7625%.
 * 100 → 105 → 110.25 → 115.7625. 직전 비교는 매번 +5%.
 */
const AXIS = 120;
const STEPS = [
  { name: "처음 기준", value: 100 },
  { name: "변경 1", value: 105 },
  { name: "변경 2", value: 110.25 },
  { name: "변경 3", value: 115.7625 },
] as const;

const SCENES = [
  { label: "첫 변경", summary: "직전 +5% · 처음 기준 +5%", shown: 1, total: "+5%", note: "첫 변경에서는 직전과 처음 기준이 같아서 두 비교의 답이 같습니다." },
  { label: "두 번째 변경", summary: "직전 +5% · 처음 기준 +10.25%", shown: 2, total: "+10.25%", note: "직전 버전과 비교하면 또 5%입니다. 처음 기준에서 보면 늘어난 값에 5%가 다시 붙어 10.25%입니다." },
  { label: "세 번째 변경", summary: "직전 +5% · 처음 기준 +15.7625%", shown: 3, total: "+15.7625%", note: "매번 10% 이내라는 조건은 세 번 모두 통과하는데 처음 기준보다 15.7625% 나빠졌습니다. 마지막 승인 기준과 비교하는 규칙이 함께 필요한 이유입니다." },
] as const;

export default function CumulativeDriftViz() {
  return (
    <SceneShell
      eyebrow="쌓이는 악화"
      title="매번 5%는 작아 보여도 세 번이면 처음보다 15.7625% 느립니다"
      description="처음 기준의 시간을 100으로 놓은 상대값입니다. 빨간 칸이 처음 기준을 넘어선 부분입니다."
      ariaLabel="변경이 쌓일 때 처음 기준 대비 시간"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="relative space-y-2">
              {STEPS.map((step, index) => {
                const visible = index <= scene.shown;
                return (
                  <div key={step.name} className="grid grid-cols-[4rem_minmax(0,1fr)_4.75rem] items-center gap-2 text-xs">
                    <span className={visible ? "font-bold" : "text-muted-foreground/50"}>{step.name}</span>
                    <div className="relative h-6 rounded-sm bg-muted/40" role="img" aria-label={visible ? `${step.name}: ${step.value}` : `${step.name}: 아직 없음`}>
                      {visible && (
                        <>
                          <div className="absolute inset-y-0 left-0 bg-[#94a3b8]" style={{ width: `${(100 / AXIS) * 100}%` }} />
                          {step.value > 100 && <div className="absolute inset-y-0 bg-[#b91c1c]" style={{ left: `${(100 / AXIS) * 100}%`, width: `${((step.value - 100) / AXIS) * 100}%` }} />}
                        </>
                      )}
                    </div>
                    <span className={`text-right font-mono ${visible ? "font-bold" : "text-muted-foreground/50"}`}>{visible ? step.value : "−"}</span>
                  </div>
                );
              })}
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 font-mono text-xs">
              <div>
                <dt className="text-muted-foreground">직전 버전 대비</dt>
                <dd className="mt-0.5 font-bold">+5%</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">처음 기준 대비</dt>
                <dd className="mt-0.5 font-bold text-[#b91c1c] dark:text-[#fca5a5]">{scene.total}</dd>
              </div>
            </dl>
          </div>
        );
      }}
    />
  );
}
