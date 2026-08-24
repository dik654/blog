import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["가능한 경우", "Event 묶기", "조건으로 가지치기", "곱으로 복원"] as const;

export default function ProbabilityTreeViz() {
  const scenes = useAnimatedScenes(SCENES.length);
  const active = scenes.active;
  const leaves = [
    { label: "HH", x: 520, y: 50 },
    { label: "HT", x: 520, y: 120 },
    { label: "TH", x: 520, y: 210 },
    { label: "TT", x: 520, y: 280 },
  ];
  return <VizFrame eyebrow="Animated probability tree" title="경우를 모두 펼친 뒤 질문에 맞는 가지를 남긴다" description="두 번의 coin toss를 sample space·event·conditional probability·chain rule의 순서로 읽습니다." note="조건은 원래 probability를 지우는 것이 아니라, 남은 branch의 mass 합이 다시 1이 되도록 재정규화합니다.">
    <div data-viz-canvas tabIndex={0} role="group" aria-label="probability outcome event conditioning 애니메이션" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
      <svg viewBox="0 0 760 330" className="h-auto w-full" aria-label="두 번 동전 던지기 확률 나무">
        <text x="55" y="170" fontSize="13" fill="currentColor">start</text>
        <path d="M100 160 L270 85 M100 160 L270 245" fill="none" stroke="currentColor" strokeOpacity=".35" strokeWidth="1.1" />
        <path d="M285 85 L500 50 M285 85 L500 120 M285 245 L500 210 M285 245 L500 280" fill="none" stroke="currentColor" strokeOpacity=".35" strokeWidth="1.1" />
        <text x="275" y="79" textAnchor="middle" fontSize="14" fill="currentColor">H · 1/2</text>
        <text x="275" y="265" textAnchor="middle" fontSize="14" fill="currentColor">T · 1/2</text>
        {leaves.map(({ label, x, y }) => {
          const event = label === "HT" || label === "TH";
          const survives = label.startsWith("H");
          const opacity = active >= 2 && !survives ? .14 : 1;
          return <g key={label} opacity={opacity}>
            <circle cx={x} cy={y} r="21" fill={event && active >= 1 ? "#ede9fe" : "var(--background)"} stroke={event && active >= 1 ? "#8b5cf6" : "currentColor"} strokeWidth="1.2" />
            <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor">{label}</text>
            <text x={x + 55} y={y + 5} fontSize="13" fill="currentColor">1/4</text>
          </g>;
        })}
        <rect x="470" y="91" width="100" height="148" rx="8" fill="none" stroke="#8b5cf6" strokeWidth="1.1" strokeDasharray="5 5" opacity={active >= 1 && active < 2 ? 1 : 0} />
        <text x="585" y="170" fontSize="13" fill="#8b5cf6" opacity={active >= 1 && active < 2 ? 1 : 0}>A: exactly one H</text>
        <text x="600" y="92" fontSize="13" fill="#0ea5e9" opacity={active >= 2 ? 1 : 0}>B: first toss is H</text>
        <text x="600" y="118" fontSize="13" fill="#0ea5e9" opacity={active >= 2 ? 1 : 0}>HT / (HH+HT) = 1/2</text>
        <text x="360" y="318" textAnchor="middle" fontSize="13" fill="#f97316" opacity={active >= 3 ? 1 : 0}>P(HT)=P(H)·P(T|H)=(1/2)(1/2)</text>
      </svg>
      <div className="mt-5 grid gap-4 border-t border-border pt-5 md:grid-cols-4">
        <Fact label="Space" value="Ω={HH,HT,TH,TT}" detail="가능한 outcome 전체" active={active === 0} />
        <Fact label="Event" value="A={HT,TH}" detail="질문에 맞는 부분집합" active={active === 1} />
        <Fact label="Condition" value="B={HH,HT}" detail="남은 mass를 다시 1로" active={active === 2} />
        <Fact label="Chain" value="joint = product" detail="순서별 조건부확률 곱" active={active === 3} />
      </div>
      <AnimatedSceneControls {...scenes} labels={SCENES} />
    </div>
  </VizFrame>;
}

function Fact({ label, value, detail, active }: { label: string; value: string; detail: string; active: boolean }) {
  return <div className={`border-l pl-4 ${active ? "border-primary" : "border-border"}`}><p className="text-xs font-bold text-muted-foreground">{label}</p><p className="mt-2 font-mono text-sm font-black">{value}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p></div>;
}
