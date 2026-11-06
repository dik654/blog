import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 관측·변경·노동 세 고리와, 자동화가 변경 고리로 들어가는 연결.
 * 칸은 순서만 나타낸다. 첫 등장 용어는 칸 안에서 쉬운 말과 함께 적는다.
 */
const LOOPS = [
  { name: "관측", steps: ["사용자가 겪는 성공률·지연(SLI)", "목표(SLO)가 깎이는 속도", "그 속도로 호출", "서버 지표로 원인 좁히기"] },
  { name: "변경", steps: ["모든 바뀜을 한 파이프라인으로", "작은 비율부터 적용", "바뀐 쪽·안 바뀐 쪽 지표 비교", "밖에서 바뀐 서버 찾기"] },
  { name: "노동", steps: ["반복 수작업(toil) 측정", "상한 두기", "남는 시간 확보", "자동화 만들기"] },
] as const;

const SCENES = [
  { label: "관측 고리", summary: "지표를 두 묶음으로", note: "사용자가 겪는 것으로 호출하고, 서버가 보여 주는 것은 호출된 사람이 원인을 좁히는 대시보드가 됩니다." },
  { label: "변경 고리", summary: "경로를 하나로", note: "비교 결과로 다음 단계로 갈지 정하고, 원하는 상태와 실제 상태를 주기적으로 맞춰 봅니다." },
  { label: "노동 고리", summary: "수작업을 세고 묶기", note: "손으로 반복하고, 자동화할 수 있고, 끝나도 서비스가 나아지지 않고, 서버 수에 비례해 느는 일을 셉니다." },
  { label: "노동에서 변경으로", summary: "자동화도 변경", note: "자동화도 변경이라 변경 고리를 통과해야 합니다. 패치 자동화인 unattended-upgrades는 수작업을 없앴지만 문(gate) 없이 돌아 사고가 됐습니다." },
] as const;

export default function ThreeLoopsViz() {
  return (
    <SceneShell
      eyebrow="서버 운영 지도"
      title="관측·변경·노동 세 고리는 각자 돌고, 자동화에서 만납니다"
      description="번호는 고리 안의 순서입니다. 강조된 묶음이 지금 보는 고리입니다."
      ariaLabel="관측, 변경, 노동 세 고리의 단계와 자동화가 변경 고리로 들어가는 연결"
      scenes={SCENES}
      render={(active) => (
        <div className="space-y-1">
          {LOOPS.map((loop, loopIndex) => {
            const on = loopIndex === active || (active === 3 && loopIndex === 1);
            return (
              <div key={loop.name}>
                <div className={`rounded-lg border px-2 py-1.5 ${on ? "border-primary" : "border-border/60"}`}>
                  <p className={`mb-1 text-xs font-bold ${on ? "text-primary" : "text-muted-foreground"}`}>{loop.name} 고리</p>
                  <ol className={`${on ? "grid" : "hidden sm:grid"} auto-rows-[2.875rem] grid-cols-2 gap-1.5 sm:auto-rows-auto sm:grid-cols-4`}>
                    {loop.steps.map((step, stepIndex) => (
                      <li key={step} className={`rounded-md border px-2 py-1 text-xs leading-[1.1rem] sm:py-1.5 sm:leading-5 ${on ? "border-primary/50 text-foreground" : "border-border/50 text-muted-foreground"}`}>
                        <span className="mr-1 font-mono font-bold">{stepIndex + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
                {loopIndex === 1 && (
                  <p className={`mt-1 text-center text-xs font-bold ${active === 3 ? "text-red-700 dark:text-red-400" : "invisible"}`} aria-hidden={active !== 3}>↑ 노동 고리의 자동화가 변경 고리로 들어갑니다</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    />
  );
}
