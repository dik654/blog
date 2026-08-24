import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["Chord", "Slope 변화", "Curvature 범위", "Condition"] as const;

export default function CurvatureShapeViz() {
  const scenes = useAnimatedScenes(SCENES.length);
  const active = scenes.active;
  return <VizFrame eyebrow="Animated function geometry" title="같은 그릇 모양 안에서도 위·아래 curvature 경계가 보장의 속도를 바꾼다" description="Chord inequality에서 시작해 gradient 변화 상한 L, 최소 curvature μ, 비율 L/μ를 순서대로 겹쳐 봅니다." note="Convexity는 아래로 굽는 방향을 금지하고, smoothness와 strong convexity는 각각 너무 급한 굽음과 너무 평평한 굽음을 제한합니다.">
    <div data-viz-canvas tabIndex={0} role="group" aria-label="convexity smoothness condition number 애니메이션" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
      <svg viewBox="0 0 760 300" className="h-auto w-full" aria-label="convex curve chord tangent and curvature bounds">
        <line x1="55" y1="255" x2="705" y2="255" stroke="currentColor" strokeOpacity=".25" strokeWidth="1" />
        <line x1="100" y1="272" x2="100" y2="30" stroke="currentColor" strokeOpacity=".25" strokeWidth="1" />
        <path d="M120 55 Q380 445 640 55" fill="none" stroke="#0ea5e9" strokeWidth="1.25" />
        <line x1="185" y1="130" x2="575" y2="130" stroke="#8b5cf6" strokeWidth="1.1" strokeDasharray="6 5" opacity={active === 0 ? 1 : .18} />
        <circle cx="185" cy="130" r="5" fill="var(--background)" stroke="#8b5cf6" opacity={active === 0 ? 1 : .2} />
        <circle cx="575" cy="130" r="5" fill="var(--background)" stroke="#8b5cf6" opacity={active === 0 ? 1 : .2} />
        <line x1="205" y1="258" x2="365" y2="95" stroke="#f97316" strokeWidth="1.1" opacity={active === 1 ? 1 : .16} />
        <line x1="395" y1="95" x2="555" y2="258" stroke="#f97316" strokeWidth="1.1" opacity={active === 1 ? 1 : .16} />
        <path d="M180 80 Q380 360 580 80" fill="none" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 5" opacity={active >= 2 ? .8 : .1} />
        <path d="M250 115 Q380 330 510 115" fill="none" stroke="#eab308" strokeWidth="1" strokeDasharray="4 5" opacity={active >= 2 ? .8 : .1} />
        <text x="380" y="42" textAnchor="middle" fontSize="14" fill="currentColor">objective geometry</text>
        <text x="655" y="80" fontSize="13" fill="#22c55e" opacity={active >= 2 ? 1 : .15}>L: upper bend</text>
        <text x="520" y="175" fontSize="13" fill="#eab308" opacity={active >= 2 ? 1 : .15}>μ: lower bend</text>
        <g opacity={active === 3 ? 1 : .14}>
          <rect x="245" y="225" width="270" height="48" fill="var(--background)" stroke="currentColor" strokeOpacity=".35" />
          <text x="380" y="255" textAnchor="middle" fontSize="18" fontWeight="700" fill="currentColor">κ = L / μ</text>
        </g>
      </svg>
      <div className="mt-5 grid gap-4 border-t border-border pt-5 md:grid-cols-4">
        <Fact label="Convex" value="graph ≤ chord" active={active === 0} />
        <Fact label="Smooth" value="slope change ≤ L" active={active === 1} />
        <Fact label="Strong convex" value="bend ≥ μ" active={active === 2} />
        <Fact label="Condition" value="κ=L/μ" active={active === 3} />
      </div>
      <AnimatedSceneControls {...scenes} labels={SCENES} />
    </div>
  </VizFrame>;
}

function Fact({ label, value, active }: { label: string; value: string; active: boolean }) { return <div className={`border-l pl-4 ${active ? "border-primary" : "border-border"}`}><p className="text-xs font-bold text-muted-foreground">{label}</p><p className="mt-2 font-mono text-sm font-black">{value}</p></div>; }
