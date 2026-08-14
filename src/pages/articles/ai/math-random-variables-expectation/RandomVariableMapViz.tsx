import { AnimatedSceneControls, useAnimatedScenes } from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["Outcome", "숫자로 매핑", "같은 값 합치기", "무게중심"] as const;

export default function RandomVariableMapViz() {
  const scenes = useAnimatedScenes(SCENES.length);
  const active = scenes.active;
  const outcomes = [
    { name: "HH", value: 2, y: 55 },
    { name: "HT", value: 1, y: 115 },
    { name: "TH", value: 1, y: 175 },
    { name: "TT", value: 0, y: 235 },
  ];
  return <VizFrame eyebrow="Animated random-variable map" title="복잡한 outcome을 질문에 필요한 숫자로 접어 넣는다" description="동전 순서는 남겨 두되, 앞면 개수 X가 같은 outcome의 probability mass를 한 값으로 합칩니다." note="Random variable은 무작위로 흔들리는 기호가 아니라 sample space에서 숫자로 가는 deterministic function입니다.">
    <div data-viz-canvas tabIndex={0} role="group" aria-label="random variable mapping expectation 애니메이션" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
      <svg viewBox="0 0 760 300" className="h-auto w-full" aria-label="동전 outcome에서 앞면 개수와 expectation으로 가는 지도">
        <text x="90" y="28" textAnchor="middle" fontSize="13" fill="currentColor">Ω outcomes</text>
        <text x="360" y="28" textAnchor="middle" fontSize="13" fill="currentColor" opacity={active >= 1 ? 1 : .18}>X(ω) · head count</text>
        {outcomes.map(({ name, value, y }) => <g key={name}>
          <rect x="45" y={y - 22} width="90" height="38" rx="7" fill="var(--background)" stroke="currentColor" strokeOpacity=".45" strokeWidth="1" />
          <text x="90" y={y + 3} textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor">{name}</text>
          <path d={`M135 ${y - 3} C210 ${y - 3}, 250 ${72 + (2 - value) * 80}, 315 ${72 + (2 - value) * 80}`} fill="none" stroke="#0ea5e9" strokeWidth="1.1" opacity={active >= 1 ? .8 : .12} />
        </g>)}
        {[2, 1, 0].map((value, index) => <g key={value} opacity={active >= 1 ? 1 : .18}>
          <circle cx="355" cy={72 + index * 80} r="25" fill={value === 1 && active >= 2 ? "#ede9fe" : "var(--background)"} stroke={value === 1 && active >= 2 ? "#8b5cf6" : "currentColor"} strokeWidth="1.1" />
          <text x="355" y={78 + index * 80} textAnchor="middle" fontSize="16" fontWeight="700" fill="currentColor">{value}</text>
          <text x="412" y={78 + index * 80} fontSize="13" fill="currentColor">p={value === 1 ? "1/2" : "1/4"}</text>
        </g>)}
        <line x1="520" y1="238" x2="705" y2="238" stroke="currentColor" strokeOpacity=".45" strokeWidth="1" opacity={active >= 3 ? 1 : .15} />
        {[0, 1, 2].map((value) => <g key={value} opacity={active >= 3 ? 1 : .15}>
          <line x1={550 + value * 60} y1="230" x2={550 + value * 60} y2="246" stroke="currentColor" strokeWidth="1" />
          <text x={550 + value * 60} y="268" textAnchor="middle" fontSize="13" fill="currentColor">{value}</text>
        </g>)}
        <path d="M610 190 L610 228 M603 217 L610 228 L617 217" fill="none" stroke="#f97316" strokeWidth="1.2" opacity={active >= 3 ? 1 : 0} />
        <text x="610" y="170" textAnchor="middle" fontSize="13" fill="#f97316" opacity={active >= 3 ? 1 : 0}>E[X]=1</text>
      </svg>
      <div className="mt-5 grid gap-4 border-t border-border pt-5 md:grid-cols-4">
        <Fact label="Outcome" value="HT" detail="실험의 원래 결과" active={active === 0} />
        <Fact label="Map" value="X(HT)=1" detail="앞면 개수로 변환" active={active === 1} />
        <Fact label="Induced mass" value="P(X=1)=1/2" detail="HT와 TH mass 합산" active={active === 2} />
        <Fact label="Center" value="E[X]=1" detail="값×probability의 합" active={active === 3} />
      </div>
      <AnimatedSceneControls {...scenes} labels={SCENES} />
    </div>
  </VizFrame>;
}

function Fact({ label, value, detail, active }: { label: string; value: string; detail: string; active: boolean }) { return <div className={`border-l pl-4 ${active ? "border-primary" : "border-border"}`}><p className="text-xs font-bold text-muted-foreground">{label}</p><p className="mt-2 font-mono text-sm font-black">{value}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p></div>; }
