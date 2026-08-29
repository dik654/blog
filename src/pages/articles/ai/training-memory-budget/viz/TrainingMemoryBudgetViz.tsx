import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: weight·gradient·optimizer state가 parameter당 16byte로
 * 쌓이고, activation은 layer 수에 비례해 따로 쌓이다가 checkpointing이
 * 그 항만 O(√n)으로 눌러 준다. 4 장면 모두 같은 막대 표현을 재사용한다.
 */
const SCENES = [
  "Weight·gradient만 (4byte/param)",
  "Optimizer state까지 (16byte/param)",
  "Activation을 그대로 저장(layer 수에 비례)",
  "Activation checkpointing 적용(O(√n))",
] as const;

const NOTES = [
  "FP16 weight 2byte + FP16 gradient 2byte = parameter당 4byte, Ψ=7.5B면 30GB입니다.",
  "Adam의 FP32 master weight·momentum·variance 12byte가 더해져 16byte/param, Ψ=7.5B면 120GB입니다(ZeRO paper Figure 1).",
  "모든 layer의 activation을 그대로 두면 1,000-layer network에서 48GB까지 커집니다.",
  "Checkpoint 간격을 √n으로 두면 같은 network의 activation 메모리가 7GB로 줄고, 대신 forward를 한 번 더 실행해 학습 시간이 약 30% 늘어납니다.",
] as const;

type Bar = { label: string; value: number; max: number };

const SCENE_BARS: readonly Bar[][] = [
  [
    { label: "FP16 weight+gradient (GB)", value: 30, max: 130 },
  ],
  [
    { label: "FP16 weight+gradient (GB)", value: 30, max: 130 },
    { label: "FP32 optimizer state (GB)", value: 90, max: 130 },
    { label: "Model states 합 120GB", value: 120, max: 130 },
  ],
  [
    { label: "Activation (checkpointing 없음, GB)", value: 48, max: 50 },
  ],
  [
    { label: "Activation (checkpointing 없음, GB)", value: 48, max: 50 },
    { label: "Activation (checkpointing 적용, GB)", value: 7, max: 50 },
  ],
];

export default function TrainingMemoryBudgetViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const bars = SCENE_BARS[scenes.active];

  return (
    <VizFrame
      eyebrow="Training memory math · activation checkpointing"
      title="Model state가 16byte/param으로 쌓이고, checkpointing이 activation만 O(√n)으로 누른다"
      description="같은 막대 비교를 네 장면에 재사용해 model-state memory가 쌓이는 순서와 activation checkpointing의 절충을 보여 줍니다."
      note="수치는 ZeRO paper(Ψ=7.5B, K=12)와 Chen et al. 2016의 1,000-layer 실험을 단순화한 예시이며, 실제 모델의 activation 메모리는 batch·sequence 길이에 따라 달라집니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="학습 메모리 예산과 activation checkpointing"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(28rem,calc(100dvh-15rem))] min-h-[22rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          <div className="mt-6 space-y-3">
            {bars.map((bar) => {
              const width = Math.max(4, Math.round((bar.value / bar.max) * 100));
              return (
                <div key={bar.label} className="min-w-0">
                  <div className="flex items-baseline justify-between gap-2 text-xs">
                    <span className="font-bold text-foreground">{bar.label}</span>
                    <span className="font-mono text-muted-foreground">{bar.value}</span>
                  </div>
                  <div className="mt-1 h-3 w-full overflow-hidden border border-border bg-muted/40">
                    <div
                      className="h-full bg-primary/60"
                      style={{ width: `${width}%` }}
                    />
                  </div>
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
