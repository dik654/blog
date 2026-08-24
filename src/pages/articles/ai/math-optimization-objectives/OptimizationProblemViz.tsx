import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["점수 함수", "허용 구간", "제약 적용", "정답 분리"] as const;

export default function OptimizationProblemViz() {
  const scenes = useAnimatedScenes(SCENES.length);
  const active = scenes.active;
  return (
    <VizFrame
      eyebrow="Animated optimization problem"
      title="낮은 점을 찾기 전에 움직여도 되는 영역부터 고정한다"
      description="같은 objective라도 feasible set이 달라지면 선택 가능한 minimizer가 달라지는 과정을 한 축 위에서 봅니다."
      note="검은 점 x=3은 unconstrained minimizer입니다. 허용 구간이 [0,2]이면 그 점을 답으로 제출할 수 없습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="objective feasible set minimizer 애니메이션"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <svg viewBox="0 0 760 270" className="h-auto w-full" aria-label="제약 구간과 두 minimizer 위치">
          <line x1="70" y1="190" x2="700" y2="190" stroke="currentColor" strokeOpacity=".35" strokeWidth="1" />
          {[0, 1, 2, 3, 4].map((value) => (
            <g key={value}>
              <line x1={110 + value * 135} y1="184" x2={110 + value * 135} y2="198" stroke="currentColor" strokeOpacity=".45" strokeWidth="1" />
              <text x={110 + value * 135} y="220" textAnchor="middle" fontSize="14" fill="currentColor">{value}</text>
            </g>
          ))}
          <path d="M110 60 Q515 250 650 60" fill="none" stroke="#0ea5e9" strokeWidth="1.2" opacity={active >= 0 ? 1 : .25} />
          <rect x="110" y="170" width="270" height="8" rx="4" fill="#8b5cf6" opacity={active >= 1 ? .85 : .12} />
          <circle cx="515" cy="190" r="8" fill="var(--background)" stroke="currentColor" strokeWidth="1.2" opacity={active >= 0 ? 1 : .2} />
          <circle cx="380" cy="190" r="8" fill={active >= 2 ? "#8b5cf6" : "var(--background)"} stroke="#8b5cf6" strokeWidth="1.2" opacity={active >= 1 ? 1 : .2} />
          <path d="M500 142 C462 122 420 125 390 155" fill="none" stroke="#f97316" strokeWidth="1.1" strokeDasharray="5 5" opacity={active >= 2 ? 1 : 0} />
          <path d="M390 155 l8 -2 l-4 8" fill="none" stroke="#f97316" strokeWidth="1.1" opacity={active >= 2 ? 1 : 0} />
          <text x="515" y="35" textAnchor="middle" fontSize="13" fill="currentColor" opacity={active >= 0 ? 1 : .25}>unconstrained x*=3</text>
          <text x="245" y="158" textAnchor="middle" fontSize="13" fill="#8b5cf6" opacity={active >= 1 ? 1 : .15}>feasible set [0,2]</text>
          <text x="380" y="250" textAnchor="middle" fontSize="13" fill="#8b5cf6" opacity={active >= 3 ? 1 : .2}>constrained x*=2 · f*=3</text>
        </svg>
        <div className="mt-5 grid gap-4 border-t border-border pt-5 md:grid-cols-3">
          <Fact label="Objective" value="f(x)=(x−3)²+2" detail="선택 x를 scalar 점수로 평가" active={active === 0} />
          <Fact label="Constraint" value="0≤x≤2" detail="제출 가능한 선택을 제한" active={active === 1 || active === 2} />
          <Fact label="Answer" value="argmin=2 · min=3" detail="위치와 최솟값을 따로 기록" active={active === 3} />
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

function Fact({ label, value, detail, active }: { label: string; value: string; detail: string; active: boolean }) {
  return <div className={`border-l pl-4 transition-colors ${active ? "border-primary" : "border-border"}`}><p className="text-xs font-bold text-muted-foreground">{label}</p><p className="mt-2 font-mono text-base font-black">{value}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p></div>;
}
