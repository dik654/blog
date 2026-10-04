import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import { methodCosts } from "../model";

const SCENES = ["각자 30개", "모아서 90개", "추가 비용 60", "추가 비용 180"] as const;
const EXTRA = [0, 0, 60, 180] as const;
const NOTES = [
  "(가정) 세 업체가 같은 규격 부품을 각각 30개 만듭니다. 각자 B를 고르면 60+4×30=180이고 세 업체 합계는 540입니다.",
  "(가정) 한 전문 생산자가 세 주문을 모아 90개를 만들면 C의 300+1×90=390이 최저입니다. 생산 비용만 보면 150을 줄입니다. 완제품 업체 세 곳이 하나로 합병했다는 뜻은 아닙니다.",
  "운송·검사·계약 등 추가 비용 합계를 60으로 두면 전체는 390+60=450입니다. 각자 만들 때의 540보다 90 작습니다. 이 차이가 고객의 가격 인하로 모두 돌아간다는 보장은 없습니다.",
  "추가 비용이 180이면 390+180=570으로 각자 만들 때보다 30 비쌉니다. 주문을 모을 수 있다는 사실만으로 분업이 언제나 유리해지지는 않습니다.",
] as const;
export default function DifferentiationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5400), s = scenes.active;
  const separate = methodCosts(30).minimum * 3, pooled = methodCosts(90).minimum;
  const total = s === 0 ? separate : pooled + EXTRA[s];
  return <VizFrame eyebrow="같은 부품 90개" title="세 곳의 주문을 모으면 설비 비용을 나눌 수 있다"
    description="세 고객의 30개씩을 한 생산자가 처리하는 경우를 비교합니다. 생산량과 부품 규격을 바꾸지 않습니다."
    note="(가정) 세 곳의 일정이 맞고 함께 생산할 여력이 있습니다. 운송·검사·계약 비용은 뒤 장면에서 별도로 더합니다.">
    <div data-viz-canvas tabIndex={0} role="group" aria-label="세 업체의 개별 생산과 주문 합산 비교" onKeyDown={scenes.onKeyDown}
      className="flex h-[37rem] min-w-0 flex-col gap-4 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
        <h4 className="text-base font-bold">{s + 1}. {SCENES[s]}</h4>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map(n => <div key={n} className="border-l-2 border-primary/50 pl-2 text-sm leading-6"><p>고객 {n}</p><p className="font-bold">30개</p><p>{s === 0 ? "각자 B" : "함께 주문"}</p></div>)}
        </div>
        <div aria-live="polite" className="border-y border-border py-3 text-sm leading-7">
          <p>{s === 0 ? "180 × 3 = 540" : `C 생산 390 + 추가 ${EXTRA[s]} = ${total}`}</p>
          <p className="font-bold">{s === 0 ? "비교 기준 540" : `기준 540에서 ${separate - total >= 0 ? "절약" : "증가"} ${Math.abs(separate - total)}`}</p>
        </div>
        <p className="text-sm leading-7">{NOTES[s]}</p>
      </div>
      <AnimatedSceneControls {...scenes} labels={SCENES} />
    </div>
  </VizFrame>;
}
