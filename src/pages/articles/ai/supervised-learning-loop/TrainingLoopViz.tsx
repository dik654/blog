import VizFrame from "@/components/viz/VizFrame";
import {
  AnimatedSceneControls,
  useAnimatedScenes,
} from "@/components/viz/AnimatedSceneControls";

const SCENES = ["example", "batch", "forward", "update"] as const;

export default function TrainingLoopViz() {
  const scenes = useAnimatedScenes(SCENES.length);
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="Animated training loop"
      title="한 example의 뜻을 지킨 채 batch로 묶고, 같은 model을 통과시켜 한 번 update한다"
      description="각 장면은 새 용어 하나만 추가합니다. 마지막 장면에서만 네 단계를 하나의 반복으로 연결합니다."
      note="Batch는 여러 example을 계산상 묶는 축입니다. Batch의 row마다 서로 다른 model을 쓰는 것이 아닙니다."
    >
      <div
        tabIndex={0}
        role="group"
        aria-label="Supervised training loop 애니메이션"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="grid gap-4 lg:grid-cols-[1.15fr_auto_1fr_auto_1fr] lg:items-center">
          <div className={`border p-4 transition-opacity ${active <= 1 ? "border-sky-500 bg-sky-500/10" : "border-border opacity-55"}`}>
            <p className="text-xs font-black text-sky-600">EXAMPLE PAIR</p>
            <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <Glyph label="x" detail="pixel tensor" />
              <span className="text-primary">↔</span>
              <Glyph label="y" detail="정답 class" />
            </div>
            <div className={`mt-4 border-t border-sky-500/30 pt-3 transition-all ${active === 1 ? "opacity-100" : "opacity-45"}`}>
              <p className="font-mono text-xs">B × C × H × W</p>
              <div className="mt-2 flex gap-1">
                {[0, 1, 2, 3].map((row) => <span key={row} className="h-3 flex-1 border border-sky-500 bg-background" />)}
              </div>
            </div>
          </div>
          <Arrow active={active >= 2} />
          <div className={`border p-4 text-center transition-opacity ${active === 2 ? "border-violet-500 bg-violet-500/10" : "border-border opacity-55"}`}>
            <p className="text-xs font-black text-violet-600">SAME PARAMETERS</p>
            <div className="mx-auto mt-4 flex h-20 w-20 items-center justify-center rounded-full border border-violet-500 bg-background font-mono text-lg font-black">
              fθ
            </div>
            <p className="mt-3 text-xs text-muted-foreground">x → ŷ · intermediate 저장</p>
          </div>
          <Arrow active={active >= 3} />
          <div className={`border p-4 transition-opacity ${active === 3 ? "border-emerald-500 bg-emerald-500/10" : "border-border opacity-55"}`}>
            <p className="text-xs font-black text-emerald-600">ONE UPDATE</p>
            <div className="mt-4 space-y-2 text-xs">
              <Step label="loss" value="ŷ와 y 비교" />
              <Step label="backward" value="gradient 계산" />
              <Step label="optimizer" value="θ → θ′" />
            </div>
          </div>
        </div>
        <div className={`mt-5 border border-dashed p-4 transition-colors ${active === 3 ? "border-primary bg-primary/5" : "border-border"}`}>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
            <span>batch</span><span className="text-primary">→</span><span>forward</span><span className="text-primary">→</span><span>loss</span><span className="text-primary">→</span><span>backward</span><span className="text-primary">→</span><span>update</span><span className="text-primary">↺</span>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

function Glyph({ label, detail }: { label: string; detail: string }) {
  return <div className="min-w-0 border border-sky-500/60 bg-background p-3 text-center"><p className="font-mono text-lg font-black">{label}</p><p className="mt-1 text-[10px] text-muted-foreground">{detail}</p></div>;
}
function Arrow({ active }: { active: boolean }) { return <span aria-hidden className={`hidden text-xl font-black lg:block ${active ? "text-primary" : "text-border"}`}>→</span>; }
function Step({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between gap-3 border-b border-emerald-500/20 pb-2"><span className="font-mono font-bold">{label}</span><span className="text-muted-foreground">{value}</span></div>; }
