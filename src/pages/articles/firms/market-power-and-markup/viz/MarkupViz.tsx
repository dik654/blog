import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import { optimum, welfare } from "../model";
const SCENES = ["기본", "다른 수요", "비용 9", "한도 2", "잉여"] as const;
const NOTES = [
  "p=13−q, 한계비용 7에서 수량 3·가격 10·이익 9입니다. 탄력성 절댓값 10/3의 역수와 가격 기준 마크업 30%가 같습니다.",
  "p=19−2q로 수요를 바꾸고 비용 7을 유지하면 수량 3·가격 13입니다. 탄력성 절댓값 13/6과 마크업 6/13, 약 46.15%입니다. 가정한 두 수요의 비교입니다.",
  "기본 수요를 유지하고 한계비용을 9로 바꾸면 수량 2·가격 11입니다. 탄력성 절댓값 11/2, 마크업 2/11로 바뀝니다. 비용이 결과와 무관한 것은 아닙니다.",
  "기본 수요와 비용 7에서 생산 한도를 2로 두면 수량 2·가격 11입니다. 한계수입 9가 한계비용 7보다 크지만 더 만들 수 없습니다. 이 경계에는 내부 최적점의 마크업 등식을 적용하지 않습니다.",
  "기본 수요·비용을 유지한 수량 6의 전체 잉여는 18, 수량 3에서는 13.5입니다. 소비자에서 생산자로 이전된 9와 전체에서 사라진 4.5를 구분합니다. 고정비와 외부 효과를 생략한 비교입니다.",
] as const;
export default function MarkupViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5500), s = scenes.active;
  const v = s === 1 ? optimum(7, 19, 2) : s === 2 ? optimum(9) : s === 3 ? optimum(7, 13, 1, 2) : optimum();
  return <VizFrame eyebrow="같은 계산의 조건 변경" title="수요·비용·생산 한도를 따로 바꿔 비교한다"
    description="마크업은 가격을 분모로 계산합니다. 최적점이 움직이면 그 점의 탄력성도 달라질 수 있습니다."
    note="(가정) 선형 수요·단일 상품·동일 가격입니다. 마지막 잉여 계산은 동일한 기본 수요와 비용을 유지합니다.">
    <div data-viz-canvas tabIndex={0} role="group" aria-label="수요 비용 한도와 잉여의 비교" onKeyDown={scenes.onKeyDown}
      className="flex h-[37rem] min-w-0 flex-col gap-4 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
        <h4 className="text-base font-bold">{SCENES[s]}</h4>
        {s < 4 ? <div className="grid grid-cols-2 gap-3 text-sm leading-7" aria-live="polite">
          <div><p>수량 · 가격</p><p className="font-bold">{v.quantity} · {v.price}</p></div>
          <div><p>이익</p><p className="font-bold">{v.profit}</p></div>
          <div><p>한계수입 · 비용</p><p className="font-bold">{v.marginalRevenue} · {v.marginalCost}</p></div>
          <div><p>가격 기준 마크업</p><p className="font-bold">{((v.markup ?? 0) * 100).toFixed(2)}%</p></div>
          <div className="col-span-2"><p>탄력성 절댓값 {Math.abs(v.elasticity ?? 0).toFixed(4)}</p><p>{s === 3 ? "생산 한도의 경계 · 내부 등식 제외" : "매끄러운 내부 최적점"}</p></div>
        </div> : <div className="space-y-4 text-sm leading-7" aria-live="polite">
          {[6, 3].map(q => { const w = welfare(q); return <div key={q} className="border-l-2 border-primary/50 pl-3"><p className="font-bold">수량 {q} · 가격 {w.price}</p><p>소비자 {w.consumer} + 생산자 {w.producer} = {w.total}</p><p>기준 18보다 작은 잉여 {w.lost}</p></div>; })}
        </div>}
        <p className="text-sm leading-7">{NOTES[s]}</p>
      </div>
      <AnimatedSceneControls {...scenes} labels={SCENES} />
    </div>
  </VizFrame>;
}
