import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["한국", "미국 연방법원", "영국 대법원", "세 체계를 함께 비교"] as const;

const systems = [
  {
    name: "한국",
    headline: "같은 사건의 환송과 다른 유사 사건을 구분합니다",
    points: ["상급심 판단은 해당 사건의 하급심을 기속", "대법원 판례는 유사 사건의 해석 기준을 제시", "기존 대법원 의견 변경은 전원합의체 심판 사항"],
  },
  {
    name: "미국 연방법원",
    headline: "위에서 아래로의 구속과 자기 판례 존중을 구분합니다",
    points: ["하급법원은 같은 관할의 상급법원 판례를 따름", "연방대법원은 자기 판례를 원칙적으로 존중", "변경에는 단순한 의견 차이보다 강한 이유를 요구"],
  },
  {
    name: "영국 대법원",
    headline: "종전 결정을 보통 따르지만 신중하게 이탈할 수 있습니다",
    points: ["종전 최고법원 결정을 통상 구속적인 것으로 취급", "옳다고 보일 때 이전 결정에서 이탈 가능", "확실성과 일관성 때문에 매우 신중하게 행사"],
  },
] as const;

export default function JurisdictionForceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const step = scenes.active;

  return (
    <VizFrame
      documentFlow
      eyebrow="나라가 바뀌면 힘도 바뀝니다"
      title="‘앞 판결이 구속한다’는 한 문장만으로는 세 법체계를 설명할 수 없습니다"
      description="같은 사건인지, 다른 유사 사건인지, 어느 법원이 어느 법원을 보는지부터 가릅니다."
      note="세 체계의 핵심 차이를 학습용으로 압축했습니다. 실제 사건에서는 관할, 심급, 법 분야와 판결 형식을 추가로 확인해야 합니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="한국 미국 영국의 판례 효력 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="min-h-[53rem] py-1 sm:min-h-[33rem]">
          <p className="text-[11px] font-black text-primary">장면 {step + 1} / {SCENES.length}</p>
          <h4 className="mt-2 text-base font-bold text-foreground">{SCENES[step]}</h4>
          <div className="mt-4 grid min-w-0 gap-3 md:grid-cols-3">
            {systems.map((system, index) => {
              const active = step === 3 || step === index;
              return (
                <div key={system.name} className={`rounded-xl border p-4 transition-opacity ${active ? "border-primary/45 bg-primary/[0.05] opacity-100" : "border-border bg-muted/20 opacity-40"}`}>
                  <p className="text-sm font-black text-primary">{system.name}</p>
                  <p className="mt-2 text-sm font-bold leading-6 text-foreground">{system.headline}</p>
                  <ul className="mt-3 space-y-2 text-xs leading-5 text-muted-foreground">
                    {system.points.map((point) => <li key={point}>• {point}</li>)}
                  </ul>
                </div>
              );
            })}
          </div>
          <p className="mt-4 border-l-2 border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {step === 0 && "한국 법원조직법 제8조의 문언은 '해당 사건'을 가리킵니다. 다른 유사 사건에서 대법원 판례는 일반적인 해석 기준을 제시하지만, 미국식 수직적 선례구속과 같은 문장으로 단순 치환하면 안 됩니다."}
            {step === 1 && "미국 연방법원에서는 수직적 선례구속과 같은 법원이 자기 판례를 존중하는 수평적 선례구속을 구분합니다. 어느 회로와 어느 법원인지가 먼저입니다."}
            {step === 2 && "영국 대법원은 1966년 Practice Statement를 확립된 법리로 다룹니다. 이전 결정을 떠날 수 있지만 확실성과 일관성 때문에 그 권한을 조심스럽게 씁니다."}
            {step === 3 && "공통점은 앞 판단이 출발점을 제공한다는 것입니다. 차이는 누가 반드시 따라야 하는지, 누가 어떤 문턱과 절차로 바꿀 수 있는지입니다."}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
