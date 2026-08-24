import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["두 점", "h=1", "h=0.25", "접선"] as const;
const rows = [
  { h: "2", slope: "8", x2: 286, y2: 44, line: "M114 194 L286 44" },
  { h: "1", slope: "7", x2: 228, y2: 101, line: "M114 194 L228 101" },
  { h: "0.25", slope: "6.25", x2: 176, y2: 154, line: "M114 194 L176 154" },
  { h: "→0", slope: "6", x2: 144, y2: 175, line: "M66 224 L250 108" },
] as const;

export default function SecantTangentViz() {
  const scenes = useAnimatedScenes(SCENES.length);
  const row = rows[scenes.active];
  return (
    <VizFrame
      eyebrow="Animated local change"
      title="두 점의 평균 기울기에서 간격 h를 줄이면 한 점의 local slope가 드러난다"
      description="고정한 x=3과 움직이는 x+h를 잇는 선이 접선으로 가까워지는 과정을 봅니다."
      note="그림은 f(x)=x²의 좌표를 설명용으로 투영했습니다. 기울기 수치는 exact difference quotient 6+h를 사용합니다."
    >
      <div data-viz-canvas tabIndex={0} role="group" aria-label="할선에서 접선으로 가는 미분 애니메이션" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
        <div className="grid gap-5 md:grid-cols-[1.4fr_0.6fr] md:items-center">
          <svg viewBox="0 0 360 250" className="h-auto w-full" aria-label="x 제곱 곡선과 움직이는 할선">
            <path d="M42 220H334M58 232V22" fill="none" stroke="currentColor" strokeWidth="1" opacity=".35" />
            <path d="M76 226 C104 210 130 184 158 151 C188 116 222 76 302 26" fill="none" stroke="currentColor" strokeWidth="1.25" />
            <path d={row.line} fill="none" stroke="hsl(var(--primary))" strokeWidth="1.25" className="transition-all duration-700" />
            <circle cx="114" cy="194" r="5" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="1.25" />
            <circle cx={row.x2} cy={row.y2} r="5" fill="hsl(var(--primary))" className="transition-all duration-700" />
            <text x="101" y="215" fontSize="11" fill="currentColor">x=3</text>
            <text x={Math.min(row.x2 + 8, 310)} y={Math.max(row.y2 - 8, 18)} fontSize="11" fill="currentColor">x+h</text>
          </svg>
          <div className="space-y-4">
            <Metric label="입력 간격" value={`h = ${row.h}`} active />
            <Metric label="평균 기울기" value={`6 + h = ${row.slope}`} active={scenes.active >= 1} />
            <Metric label="local slope" value="f′(3) = 6" active={scenes.active === 3} />
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

function Metric({ label, value, active }: { label: string; value: string; active: boolean }) { return <div className={`border-l pl-4 transition-opacity ${active ? "border-primary opacity-100" : "border-border opacity-40"}`}><p className="text-xs font-bold text-muted-foreground">{label}</p><p className="mt-1 font-mono text-lg font-black">{value}</p></div>; }
