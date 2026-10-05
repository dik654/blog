import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";

const states = [
  { label: "지급 전", values: [14,86,92,0,8], paid: 0, text: "앞의 상환까지 끝난 A은행입니다. 예금 20의 지급 요구에 쓸 준비금은 14여서 6이 부족합니다." },
  { label: "급매 후 지급", values: [0,76,72,0,4], paid: 20, text: "장부가 10인 대출을 6에 팔면 손실은 4입니다. 준비금 20으로 지급한 뒤 대출 76, 예금 72, 자본 4가 남습니다." },
  { label: "차입 후 지급", values: [0,86,72,6,8], paid: 20, text: "처음 상태로 돌아가 준비금 6을 빌려 지급한 분기입니다. 대출을 팔지 않아 자본 8은 남지만 갚을 차입금 6이 새로 생깁니다." },
];
const names = ["준비금", "대출 장부가", "예금", "추가 차입금", "장부 자본"];
export default function LiquidityBranchViz() {
  const scene=useAnimatedScenes(states.length,4500);
  const s=states[scene.active];
  return <figure data-viz="liquidity-branches" className="my-8 border-y border-border py-4">
    <figcaption className="mb-3 text-sm leading-6">같은 은행, 같은 지급 요구 20억 원. 뒤의 두 장면은 서로 다른 선택이며 연속 거래가 아닙니다.</figcaption>
    <div data-viz-canvas tabIndex={0} role="group" aria-label="급매와 담보 차입의 장부 비교" onKeyDown={scene.onKeyDown} className="flex h-[min(530px,calc(100svh-150px))] flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
      <div className="min-h-0 flex-1 overflow-y-auto px-1 py-3">
        <dl className="space-y-3">{s.values.map((value,i)=><div key={names[i]} className="grid grid-cols-[7rem_1fr_2rem] items-center gap-2 text-xs"><dt>{names[i]}</dt><dd className="h-5 border border-border" aria-hidden="true"><div className="h-full bg-primary/30" style={{width:`${value}%`}}/></dd><dd className="text-right font-mono">{value}</dd></div>)}</dl>
        <p className="mt-5 font-mono text-sm">{s.values[0]} + {s.values[1]} = {s.values[2]} + {s.values[3]} + {s.values[4]}</p>
        <p className="mt-3 text-sm">지급 완료 <strong>{s.paid}</strong> · 모든 막대의 전체 길이는 100억 원</p>
        <p className="mt-3 text-sm leading-6">{s.text}</p>
      </div>
      <AnimatedSceneControls {...scene} labels={states.map(x=>x.label)}/>
    </div>
  </figure>;
}
