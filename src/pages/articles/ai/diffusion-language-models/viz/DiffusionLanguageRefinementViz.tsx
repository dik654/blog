import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["전부 MASK", "동시 예측", "낮은 신뢰도 재마스킹", "문장 완성"] as const;

const TOKENS = [
  ["[MASK]", "[MASK]", "[MASK]", "[MASK]", "[MASK]", "[MASK]"],
  ["작은", "모델은", "[MASK]", "지식을", "[MASK]", "찾는다"],
  ["작은", "모델은", "필요한?", "지식을", "[MASK]", "찾는다"],
  ["작은", "모델은", "필요한", "지식을", "밖에서", "찾는다"],
] as const;

const NOTES = [
  "응답 길이 L을 먼저 잡고 L개 위치를 absorbing MASK state로 시작합니다.",
  "Causal mask가 없는 Transformer가 현재 보이는 모든 token을 이용해 masked 위치들의 분포를 한 번에 냅니다.",
  "한 번 채웠다고 모두 확정하지 않습니다. 신뢰도가 낮은 위치를 다시 MASK로 보내 다음 step에서 문맥 전체로 고칩니다.",
  "정해진 step budget 뒤 MASK가 사라지면 문장이 완성됩니다. 병렬 token 예측과 빠른 wall-clock은 같은 말이 아닙니다.",
] as const;

export default function DiffusionLanguageRefinementViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  return (
    <VizFrame
      eyebrow="Masked discrete diffusion"
      title="왼쪽부터 쓰는 대신 문장 전체의 빈칸을 여러 번 고칩니다"
      description="각 장면은 한 reverse step의 상태입니다. 이미 확정된 token과 아직 MASK인 위치를 함께 읽고, 불확실한 위치만 다음 장면으로 넘깁니다."
      note="실제 sampler는 무작위 remasking, confidence 순위, block schedule 등 여러 정책을 쓸 수 있습니다. 이 그림은 low-confidence remasking의 직관을 보여 줍니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Diffusion language model 반복 복원"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(32rem,calc(100dvh-15rem))] min-h-[25rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Reverse step · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
            {TOKENS[scenes.active].map((token, index) => {
              const masked = token === "[MASK]";
              const uncertain = token.endsWith("?");
              return (
                <div
                  key={`${index}-${token}`}
                  className={`flex min-h-16 items-center justify-center border px-2 text-center font-mono text-xs font-bold ${
                    masked
                      ? "border-border bg-muted/40 text-muted-foreground"
                      : uncertain
                        ? "border-amber-600 bg-amber-500/5 text-foreground"
                        : "border-primary/55 bg-primary/5 text-foreground"
                  }`}
                >
                  {token}
                </div>
              );
            })}
          </div>
          <p className="mt-6 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
