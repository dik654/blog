import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["입력 변화", "첫 배율 3", "둘째 배율 14", "전체 배율 42"] as const;
const COLUMNS = [
  { label: "x=2", delta: "Δx=0.01", rule: "입력" },
  { label: "u=7", delta: "Δu=0.03", rule: "×3" },
  { label: "y=49", delta: "Δy≈0.42", rule: "×14" },
] as const;
const CAPTIONS = [
  "입력을 2에서 2.01로 바꿉니다. 변화량은 0.01입니다.",
  "u=3x+1은 변화량에도 정확히 3을 곱합니다. 0.01이 0.03이 됩니다.",
  "u=7에서 제곱의 미분계수는 14입니다. 0.03의 변화가 약 0.42로 전달됩니다.",
  "전체 배율은 14×3=42입니다. 실제 변화 0.4209와 예측 0.42의 차이는 0.0009입니다.",
] as const;

export default function ChainRateViz() {
  const scenes = useAnimatedScenes(SCENES.length);
  return (
    <VizFrame eyebrow="연결된 변화" title="작은 변화가 두 구간의 배율을 차례로 거칩니다" description="가정 사례의 2→7→49에서 현재 위치와 작은 변화량을 함께 추적합니다." note="첫 구간은 정확한 3배이고 둘째 구간의 14배는 u=7 근처에서의 근사입니다.">
      <div data-viz-canvas tabIndex={0} role="group" aria-label="연쇄법칙 변화 배율 애니메이션" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
        <div className="grid grid-cols-3 gap-4 sm:gap-6">
          {COLUMNS.map((c,i) => <div key={c.label} className={`min-w-0 border-y py-4 text-center transition-opacity ${scenes.active >= i ? "border-primary opacity-100" : "border-border opacity-35"}`}>
            <p className="text-xs font-bold text-primary">{c.rule}</p><p className="mt-3 font-mono font-bold">{c.label}</p><p className="mt-3 font-mono text-[11px]">{c.delta}</p>
          </div>)}
        </div>
        <div className="flex h-36 items-center py-5" aria-live="polite"><p className="text-sm leading-6">{CAPTIONS[scenes.active]}</p></div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
