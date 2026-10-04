import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import { methodCosts } from "../model";

const QUANTITIES = [20, 5, 10, 80, 100] as const;
const SCENES = ["20개", "5개", "10개 동률", "80개 동률", "100개"] as const;
const NOTES = [
  "20개에서는 B의 합계 140이 가장 작습니다. 60을 먼저 쓰고 4씩 스무 번 더합니다. 하나당 평균은 7입니다.",
  "5개라면 A가 50으로 가장 작습니다. B는 먼저 쓰는 60을 다섯 개에 나누므로 평균 16입니다. 설비가 가능해도 새로 갖추는 편이 더 비쌉니다.",
  "10개에서는 A와 B가 모두 100입니다. B가 엄격히 더 싸지는 첫 정수 수량은 11개입니다. 같은 비용인 선택을 낭비라고 단정하지 않습니다.",
  "80개에서는 B와 C가 모두 380입니다. C의 300은 별도 대안의 전체 준비 비용이며 B의 60에 더하는 금액이 아닙니다. C가 더 싸지는 것은 81개부터입니다.",
  "100개에서는 C가 400으로 최저입니다. B 자체도 20개의 평균 7에서 100개의 4.6으로 낮아졌습니다. 같은 방법의 고정비 배분 효과와 다른 방법으로 바꾸는 효과를 따로 볼 수 있습니다.",
] as const;
export default function DetourViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5400), c = methodCosts(QUANTITIES[scenes.active]);
  return <VizFrame eyebrow="같은 부품, 세 방법" title="먼저 쓰는 돈과 개수만큼 더 쓰는 돈을 합친다"
    description="숫자는 같은 기간의 비용 단위입니다. 품질·생산량을 맞추고 세 방법 중 하나를 새로 선택한다고 가정합니다."
    note="(가정) 판매할 수량을 알고 가동 여력이 충분합니다. 재료비 등 생략한 비용은 세 방식에서 같으며 실제 업체의 견적이 아닙니다.">
    <div data-viz-canvas tabIndex={0} role="group" aria-label="수량별 세 생산 방법의 비용" onKeyDown={scenes.onKeyDown}
      className="flex h-[37rem] min-w-0 flex-col gap-4 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
        <h4 className="text-base font-bold">{c.quantity}개 · 최저 {c.minimum} · 방법 {c.minimizers.join(" 또는 ")}</h4>
        <div className="space-y-4" aria-live="polite">
          {c.rows.map(m => <div key={m.id} className="border-l-2 border-primary/50 pl-3">
            <p className="text-sm font-bold">{m.id} · {m.label} {m.total === c.minimum ? "(최저)" : ""}</p>
            <p className="mt-1 text-sm">{m.setup} + {m.unit} × {c.quantity} = {m.total}</p>
            <p className="mt-1 text-sm text-muted-foreground">하나당 평균 {Number(m.average.toFixed(2))}</p>
          </div>)}
        </div>
        <p className="text-sm leading-7">{NOTES[scenes.active]}</p>
      </div>
      <AnimatedSceneControls {...scenes} labels={SCENES} />
    </div>
  </VizFrame>;
}
