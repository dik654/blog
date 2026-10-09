import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import { sale } from "../model";
const SCENES = ["두 계획", "매출", "+9 −3", "이익"] as const;
const NOTES = [
  "같은 기간 가격 10에는 3개, 가격 9에는 4개가 팔린다는 가정입니다. 과거 판매분의 가격을 바꾸는 일이 아닙니다.",
  "매출은 각각 10×3=30과 9×4=36입니다. 값을 내린 계획에서 매출은 6 늘었습니다.",
  "새로 팔리는 한 개에서 9를 더 받지만 다른 세 개는 하나당 1씩 덜 받습니다. 두 변화의 합은 9−3=6입니다.",
  "하나 더 만드는 비용은 7입니다. 매출 증가 6에서 7을 빼면 이익이 1 줄어듭니다. 두 계획의 이익은 9와 8입니다.",
] as const;
export default function PriceChoiceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5400), s = scenes.active;
  const a = sale(3), b = sale(4);
  return <VizFrame eyebrow="같은 판매 기간" title="가격을 낮춘 계획에서 전체 이익까지 비교한다"
    description="새 판매 한 개의 가격뿐 아니라 앞의 세 개에 해당하는 수량의 가격 차이도 셉니다."
    note="(가정) 같은 물건·동일 가격·단위 비용 7이며 생산할 여력이 충분합니다.">
    <div data-viz-canvas tabIndex={0} role="group" aria-label="가격 10과 9의 판매 계획 비교" onKeyDown={scenes.onKeyDown}
      className="flex h-[37rem] min-w-0 flex-col gap-4 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
        <h4 className="text-base font-bold">{SCENES[s]}</h4>
        <div className="flex min-h-[18.5rem] flex-col gap-4 sm:min-h-0">
        <div className="grid grid-cols-2 gap-3">
          {[a, b].map(v => <div className="border-l-2 border-primary/50 pl-3 text-sm leading-7" key={v.quantity}>
            <p className="font-bold">가격 {v.price} · {v.quantity}개</p>
            <p>{s >= 1 ? `매출 ${v.revenue}` : "가격 × 수량"}</p>
            {s === 3 && <><p>비용 {v.cost}</p><p className="font-bold">이익 {v.profit}</p></>}
          </div>)}
        </div>
        {s >= 2 && <div aria-live="polite" className="border-y border-border py-3 text-sm leading-7">
          <p>새 한 개 +9</p><p>다른 세 개 −3</p><p className="font-bold">매출 증가 +6</p>
          {s === 3 && <><p>추가 생산 비용 −7</p><p className="font-bold">이익 변화 −1</p></>}
        </div>}
        </div>
        <p className="min-h-[7rem] text-sm leading-7 min-[390px]:min-h-[5.25rem] sm:min-h-0">{NOTES[s]}</p>
      </div>
      <AnimatedSceneControls {...scenes} labels={SCENES} />
    </div>
  </VizFrame>;
}
