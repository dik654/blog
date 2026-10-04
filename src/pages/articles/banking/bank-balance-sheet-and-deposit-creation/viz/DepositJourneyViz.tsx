import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";

const states = [
  { label: "출발", a: [20,80,92,8], b: [0,0], customer: [0,0], total: 0, note: "A은행은 오늘 보낼 수 있는 20과 나중에 받을 80을 갖고 있습니다. 고객에게 갚을 92를 빼면 8이 남습니다." },
  { label: "10 빌리기", a: [20,90,102,8], b: [0,0], customer: [10,10], total: 10, note: "차주의 통장에 10을 적고, 나중에 돌려받을 10도 적습니다. 기존 고객의 92와 오늘 보낼 20은 줄지 않습니다." },
  { label: "6 보내기", a: [14,90,96,8], b: [6,6], customer: [4,10], total: 10, note: "차주가 B은행 판매자에게 6을 보냅니다. A의 두 칸에서 6이 나가 B의 두 칸에 붙고, 두 은행을 합친 새 통장 잔액은 여전히 10입니다." },
  { label: "4 갚기", a: [14,86,92,8], b: [6,6], customer: [0,6], total: 6, note: "차주가 남은 4로 원금을 갚습니다. A가 받을 돈과 차주의 통장 잔액이 함께 4 줄고, 판매자에게 간 6은 남습니다." },
];
const names = ["오늘 보낼 수 있는 돈", "나중에 받을 돈", "고객에게 갚을 돈", "둘을 뺀 주주 몫"];

export default function DepositJourneyViz() {
  const scene = useAnimatedScenes(states.length, 4000);
  const s = states[scene.active];
  return <figure data-viz="deposit-journey" className="my-8 border-y border-border py-4">
    <figcaption className="mb-3 text-sm leading-6">단위는 모두 억 원입니다. B은행은 기존 장부를 생략하고 이 거래로 달라진 두 칸만 보입니다.</figcaption>
    <div data-viz-canvas tabIndex={0} role="group" aria-label="빌리고 보내고 갚는 네 장면" onKeyDown={scene.onKeyDown} className="flex h-[min(600px,calc(100dvh-150px))] flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
      <div className="min-h-0 flex-1 overflow-y-auto px-1 py-3">
        <h3 className="mb-3 font-semibold">A은행 · 같은 네 칸</h3>
        <dl className="grid grid-cols-2 gap-x-3 gap-y-4">{s.a.map((value,i)=><div key={names[i]} className="border-b border-border pb-2"><dt className="text-xs leading-5">{names[i]}</dt><dd className="mt-1 text-2xl font-semibold tabular-nums">{value}</dd></div>)}</dl>
        <p className="my-3 font-mono text-sm">{s.a[0]} + {s.a[1]} = {s.a[2]} + {s.a[3]}</p>
        <div className="grid grid-cols-2 gap-3 border-y border-border py-3 text-sm leading-6"><p>B가 받은 돈 <strong>+{s.b[0]}</strong><br/>B가 고객에게 갚을 돈 <strong>+{s.b[1]}</strong></p><p>차주의 통장 <strong>{s.customer[0]}</strong><br/>차주가 갚을 원금 <strong>{s.customer[1]}</strong></p></div>
        <p className="mt-3 text-sm">두 은행을 합친 통장 잔액의 증가: <strong>+{s.total}</strong></p>
        <p className="mt-3 text-sm leading-6">{s.note}</p>
      </div>
      <AnimatedSceneControls {...scene} labels={states.map(x=>x.label)}/>
    </div>
  </figure>;
}
