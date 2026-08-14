import {
  AnimatedSceneControls,
  useAnimatedScenes,
} from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["방향", "안전한 보폭", "진동", "발산", "멈춤 판정"] as const;
const paths = [
  { eta: "η=0.5", points: [4, 2, 1, .5], color: "#22c55e", label: "수축" },
  { eta: "η=2", points: [4, -4, 4, -4], color: "#eab308", label: "진동" },
  { eta: "η=3", points: [4, -8, 16], color: "#f97316", label: "발산" },
] as const;

export default function DescentDynamicsViz() {
  const scenes = useAnimatedScenes(SCENES.length);
  const active = scenes.active;
  const selected = active <= 1 ? paths[0] : active === 2 ? paths[1] : paths[2];
  const scale = (x: number) => 380 + x * 22;
  return <VizFrame eyebrow="Animated descent dynamics" title="같은 negative gradient라도 step size가 경로와 결론을 바꾼다" description="f(x)=x²/2, x₀=4에서 수축·진동·발산을 같은 축에 놓고 마지막에 stopping signal의 한계를 확인합니다." note="Gradient가 작은 것은 first-order stationary signal입니다. Nonconvex 문제에서는 global optimum이나 generalization을 자동으로 증명하지 않습니다.">
    <div data-viz-canvas tabIndex={0} role="group" aria-label="gradient descent step convergence 애니메이션" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
      <svg viewBox="0 0 760 310" className="h-auto w-full" aria-label="quadratic 위 gradient descent 위치 변화">
        <line x1="45" y1="250" x2="715" y2="250" stroke="currentColor" strokeOpacity=".3" strokeWidth="1" />
        <line x1="380" y1="40" x2="380" y2="270" stroke="currentColor" strokeOpacity=".2" strokeWidth="1" />
        <path d="M95 45 Q380 455 665 45" fill="none" stroke="#0ea5e9" strokeWidth="1.25" />
        {selected.points.map((point, index) => {
          const cx = Math.max(65, Math.min(695, scale(point)));
          const cy = Math.max(58, 250 - Math.min(180, point * point * 7));
          return <g key={`${point}-${index}`} opacity={index <= Math.max(0, active) ? 1 : .18}>
            {index > 0 && <line x1={Math.max(65, Math.min(695, scale(selected.points[index - 1])))} y1={Math.max(58, 250 - Math.min(180, selected.points[index - 1] ** 2 * 7))} x2={cx} y2={cy} stroke={selected.color} strokeWidth="1.1" strokeDasharray="5 4" />}
            <circle cx={cx} cy={cy} r={index === 0 ? 7 : 5} fill={index === 0 ? "var(--background)" : selected.color} stroke={selected.color} strokeWidth="1.2" />
            <text x={cx} y={cy - 13} textAnchor="middle" fontSize="12" fill="currentColor">x{index}</text>
          </g>;
        })}
        <text x="380" y="292" textAnchor="middle" fontSize="13" fill="currentColor">minimum x*=0</text>
        <text x="610" y="96" textAnchor="middle" fontSize="14" fontWeight="700" fill={selected.color}>{selected.eta} · {selected.label}</text>
      </svg>
      <div className="mt-5 grid gap-4 border-t border-border pt-5 md:grid-cols-3">
        <Fact label="Update" value="xₜ₊₁=(1−η)xₜ" detail="방향에 보폭을 곱해 다음 위치 선택" active={active === 0} />
        <Fact label="Stability" value="|1−η|<1" detail="이 quadratic에서만 쓰는 수축 조건" active={active >= 1 && active <= 3} />
        <Fact label="Stop" value="‖∇f‖≤εg" detail="멈춤 신호이지 global proof는 아님" active={active === 4} />
      </div>
      <AnimatedSceneControls {...scenes} labels={SCENES} />
    </div>
  </VizFrame>;
}

function Fact({ label, value, detail, active }: { label: string; value: string; detail: string; active: boolean }) { return <div className={`border-l pl-4 ${active ? "border-primary" : "border-border"}`}><p className="text-xs font-bold text-muted-foreground">{label}</p><p className="mt-2 font-mono text-base font-black">{value}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p></div>; }
