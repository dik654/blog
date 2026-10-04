import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";

const states = [
  { label: "부족한 6", a: "14 → 20 필요", b: "남는 6 보유", offer: "거래 전", note: "A는 오늘 20을 보내야 하는데 14만 갖고 있습니다. B에게는 빌려줄 수 있는 6이 있습니다. A의 부족분과 은행 전체의 부족분은 같은 것이 아닙니다." },
  { label: "서로의 선택", a: "중앙은행에서 5%", b: "중앙은행에 맡겨 4%", offer: "4%에서 5% 사이를 협상", note: "두 은행 모두 이 거래를 실제로 이용할 자격과 담보를 갖췄다고 가정합니다. 수수료·위험·규제 비용 차이는 아직 넣지 않습니다." },
  { label: "은행끼리 거래", a: "B에게 4.6%로 빌림", b: "A에게 6을 보냄", offer: "하루 이자 약 75,616원", note: "6억 × 0.046 ÷ 365로 계산합니다. A의 돈은 6 늘고 B의 돈은 6 줄어 은행 전체 금액은 같습니다. A가 B에게 갚을 의무가 새로 생깁니다." },
  { label: "조건 인상", a: "다른 차입 선택 5.25%", b: "다른 예치 선택 4.25%", offer: "4.85%라면 하루 약 79,726원", note: "다른 차이가 그대로여서 거래금리도 0.25%포인트 오른 경우입니다. 하루 비용은 약 4,110원 늘지만 실제 시장금리가 꼭 같은 폭으로 움직인다는 보장은 없습니다." },
];

export default function FundingChoiceViz(){
 const scene=useAnimatedScenes(states.length,4500);const s=states[scene.active];
 return <figure data-viz="funding-choice" className="my-8 border-y border-border py-4">
 <figcaption className="mb-3 text-sm leading-6">금액 단위는 억 원, 금리는 가정한 연이율입니다. 1년을 365일로 나눠 하루 이자를 계산합니다.</figcaption>
 <div data-viz-canvas tabIndex={0} role="group" aria-label="같은 6억 원을 빌리는 네 장면" onKeyDown={scene.onKeyDown} className="flex h-[min(540px,calc(100dvh-150px))] flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
 <div className="min-h-0 flex-1 overflow-y-auto px-1 py-3">
 <div className="grid grid-cols-2 gap-3"><div className="border-b border-border pb-3"><h3 className="font-semibold">A은행 · 돈이 필요</h3><p className="mt-2 text-sm leading-6">{s.a}</p></div><div className="border-b border-border pb-3"><h3 className="font-semibold">B은행 · 돈이 남음</h3><p className="mt-2 text-sm leading-6">{s.b}</p></div></div>
 <p className="my-5 text-lg font-semibold tabular-nums">{s.offer}</p><p className="text-sm leading-7">{s.note}</p>
 </div><AnimatedSceneControls {...scene} labels={states.map(x=>x.label)}/></div></figure>;
}
