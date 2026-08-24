import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["x 입력", "inner rate", "outer rate", "전체 rate"] as const;

export default function ChainRateViz() {
  const scenes = useAnimatedScenes(SCENES.length);
  return (
    <VizFrame
      eyebrow="Animated chain rule"
      title="변화가 두 변환을 연속 통과하면 각 구간의 배율이 곱해진다"
      description="x=2에서 x→u는 3배, u=7에서 u→y는 14배입니다. 작은 x 변화가 두 배율을 차례로 통과합니다."
      note="곱셈은 기호 약분 장식이 아니라 같은 작은 변화가 첫 구간과 둘째 구간에서 연속 확대되는 실행 의미를 가집니다."
    >
      <div data-viz-canvas tabIndex={0} role="group" aria-label="chain rule 변화 배율 애니메이션" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
          <Node label="input" value="x=2" delta="Δx=0.01" active={scenes.active >= 0} color="sky" />
          <Rate value="×3" label="du/dx" active={scenes.active >= 1} />
          <Node label="middle" value="u=7" delta="Δu≈0.03" active={scenes.active >= 1} color="violet" />
          <Rate value="×14" label="dy/du" active={scenes.active >= 2} />
          <Node label="output" value="y=49" delta="Δy≈0.42" active={scenes.active >= 2} color="emerald" />
        </div>
        <div className={`mt-6 border-l pl-4 transition-opacity ${scenes.active === 3 ? "border-primary opacity-100" : "border-border opacity-40"}`}>
          <p className="text-xs font-bold text-muted-foreground">전체 전달 배율</p>
          <p className="mt-2 font-mono text-xl font-black">Δy ≈ 14 × 3 × Δx = 42Δx</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

function Node({ label, value, delta, active, color }: { label: string; value: string; delta: string; active: boolean; color: "sky" | "violet" | "emerald" }) {
  const styles = { sky: "border-sky-500 bg-sky-500/10", violet: "border-violet-500 bg-violet-500/10", emerald: "border-emerald-500 bg-emerald-500/10" } as const;
  return <div className={`border p-5 text-center transition-opacity duration-500 ${styles[color]} ${active ? "opacity-100" : "opacity-35"}`}><p className="font-mono text-[10px] font-bold uppercase text-muted-foreground">{label}</p><p className="mt-2 font-mono text-xl font-black">{value}</p><p className="mt-2 text-xs text-muted-foreground">{delta}</p></div>;
}
function Rate({ value, label, active }: { value: string; label: string; active: boolean }) { return <div className={`flex items-center justify-center gap-2 transition-colors ${active ? "text-primary" : "text-border"}`}><div className="text-center"><p className="font-mono text-base font-black">{value}</p><p className="text-[10px]">{label}</p></div><span aria-hidden>→</span></div>; }
