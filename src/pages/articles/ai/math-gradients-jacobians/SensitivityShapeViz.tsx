import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["x 손잡이", "y 손잡이", "gradient", "Jacobian"] as const;

export default function SensitivityShapeViz() {
  const scenes = useAnimatedScenes(SCENES.length);
  const active = scenes.active;
  return (
    <VizFrame
      eyebrow="Animated sensitivity shapes"
      title="손잡이 하나의 slope를 모으면 vector가 되고, output도 여러 개면 matrix가 된다"
      description="두 coordinate를 하나씩 움직인 뒤 gradient arrow와 Jacobian 표로 조합합니다."
      note="Gradient arrow의 steepest 설명은 Euclidean unit direction을 비교할 때의 local 결과입니다. Coordinate scale이나 norm이 바뀌면 해석도 달라집니다."
    >
      <div data-viz-canvas tabIndex={0} role="group" aria-label="편미분 gradient Jacobian 애니메이션" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
        <div className="grid gap-5 md:grid-cols-[1.15fr_0.85fr] md:items-center">
          <svg viewBox="0 0 360 260" className="h-auto w-full" aria-label="등고선과 coordinate별 변화 화살표">
            <path d="M42 218H326M68 236V30" fill="none" stroke="currentColor" strokeWidth="1" opacity=".35" />
            <ellipse cx="182" cy="135" rx="118" ry="76" fill="none" stroke="currentColor" strokeWidth="1" opacity=".22" />
            <ellipse cx="182" cy="135" rx="78" ry="49" fill="none" stroke="currentColor" strokeWidth="1" opacity=".35" />
            <ellipse cx="182" cy="135" rx="38" ry="24" fill="none" stroke="currentColor" strokeWidth="1" opacity=".5" />
            <circle cx="182" cy="135" r="5" fill="hsl(var(--primary))" />
            <path d="M182 135H268" fill="none" stroke={active === 0 ? "hsl(var(--primary))" : "currentColor"} strokeWidth="1.25" opacity={active === 0 || active === 2 ? 1 : .25} />
            <path d="m268 135-10-5v10Z" fill={active === 0 ? "hsl(var(--primary))" : "currentColor"} opacity={active === 0 || active === 2 ? 1 : .25} />
            <path d="M182 135V68" fill="none" stroke={active === 1 ? "hsl(var(--primary))" : "currentColor"} strokeWidth="1.25" opacity={active === 1 || active === 2 ? 1 : .25} />
            <path d="m182 68-5 10h10Z" fill={active === 1 ? "hsl(var(--primary))" : "currentColor"} opacity={active === 1 || active === 2 ? 1 : .25} />
            <path d="M182 135 262 75" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.25" opacity={active === 2 ? 1 : .15} />
            <path d="m262 75-11 2 6 8Z" fill="hsl(var(--primary))" opacity={active === 2 ? 1 : .15} />
            <text x="274" y="141" fontSize="11" fill="currentColor">∂f/∂x=4</text>
            <text x="190" y="62" fontSize="11" fill="currentColor">∂f/∂y=3</text>
            <text x="264" y="69" fontSize="11" fill="currentColor" opacity={active === 2 ? 1 : .2}>∇f=(4,3)</text>
          </svg>
          <div className="space-y-4">
            <Shape label="한 coordinate" value={active === 0 ? "x만 이동" : active === 1 ? "y만 이동" : "두 slope를 묶음"} active={active <= 2} />
            <Shape label="Scalar output" value="gradient = vector" active={active === 2} />
            <div className={`border p-4 transition-opacity ${active === 3 ? "border-primary opacity-100" : "border-border opacity-35"}`}>
              <p className="text-xs font-bold text-muted-foreground">Vector output</p>
              <div className="mt-3 grid grid-cols-2 gap-1 font-mono text-sm font-black">
                {[["1", "1"], ["3", "2"]].flat().map((value, index) => <span key={`${value}-${index}`} className="border border-border bg-background p-3 text-center">{value}</span>)}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">output 행 × input 열</p>
            </div>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

function Shape({ label, value, active }: { label: string; value: string; active: boolean }) { return <div className={`border-l pl-4 transition-opacity ${active ? "border-primary opacity-100" : "border-border opacity-35"}`}><p className="text-xs font-bold text-muted-foreground">{label}</p><p className="mt-1 font-mono text-base font-black">{value}</p></div>; }
