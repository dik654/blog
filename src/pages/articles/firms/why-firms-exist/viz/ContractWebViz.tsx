import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["매번 따로 정한다", "미리 범위를 정한다", "범위 안에서 배정한다", "장기 외주와 비교한다"] as const;
const NOTES = [
  "(가정) 같은 담당자에게 여섯 작업을 요청할 때마다 범위·대금·납기를 새로 협상합니다. 여섯 번의 합의가 필요합니다.",
  "(가정) 보수·업무 범위·기간 등을 먼저 정하고 그 범위 안의 세부 작업을 나중에 배정합니다. 고용 계약에 아무 내용도 쓰지 않는다는 뜻은 아닙니다.",
  "여섯 작업 지시는 그대로 남습니다. 줄일 수 있는 것은 반복 협상의 일부이며, 지시·검사·분쟁 처리에는 여전히 비용이 듭니다.",
  "외부 공급자와도 기본 계약 하나 아래 여러 주문을 넣을 수 있습니다. 계약서가 하나라는 사실만으로 고용 관계나 기업 내부가 되지는 않습니다.",
] as const;

export default function ContractWebViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200), s = scenes.active;
  return (
    <VizFrame eyebrow="같은 상대에게 여섯 작업" title="반복해서 협상하는 부분과 나중에 정하는 부분을 나눈다"
      description="사람 수를 바꾸지 않고 계약과 작업 지시를 비교합니다. 이 그림의 여섯 작업도 설명을 위한 가정입니다."
      note="지시 권한은 약정과 법의 제한을 받습니다. 계약의 명칭이나 장수만으로 법적 관계를 판정하지 않습니다.">
      <div data-viz-canvas tabIndex={0} role="group" aria-label="여섯 작업의 계약과 지시 비교" onKeyDown={scenes.onKeyDown}
        className="flex h-[37rem] min-h-[32rem] min-w-0 flex-col gap-5 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto pr-1">
        <h4 className="text-base font-bold">{s + 1}. {SCENES[s]}</h4>
        <p className="border-y border-border py-3 text-sm leading-7">{s === 0 ? "요청자 ↔ 담당자: 매번 조건 합의" : s === 3 ? "발주자 ↔ 외부 공급자: 기본 계약 + 개별 주문" : "회사 ↔ 근로자: 보수·업무 범위 등을 먼저 합의"}</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => <div key={i} className="border-l-2 border-primary/50 pl-3 text-sm leading-6">
            <p className="font-bold">작업 {i + 1}</p>
            <p>{s === 0 ? "조건 협상 → 실행" : s === 1 ? "세부 배정은 나중에" : s === 3 ? "주문 → 이행 확인" : "허용 범위 확인 → 배정"}</p>
          </div>)}
        </div>
        <p aria-live="polite" className="text-sm leading-7">{NOTES[s]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
