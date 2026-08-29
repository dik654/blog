import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * Action chunking 하나의 mechanism만 보여 준다: chunk 길이가 늘어나면
 * model 호출 수는 줄지만, chunk 도중 관측을 반영하지 못하는 open-loop 위험이
 * 늘고, temporal ensembling이 그 위험을 겹친 예측의 가중 평균으로 완화한다.
 */
const STEP_COUNT = 12;
const STEPS = Array.from({ length: STEP_COUNT }, (_, index) => index);

const SCENES = [
  "Step마다 재예측 (k=1)",
  "Chunk로 한 번에 예측 (k=6)",
  "Chunk 도중 방해 → stale 구간",
  "여러 chunk를 가중 평균 (temporal ensembling)",
] as const;

const NOTES = [
  "매 timestep마다 새로 예측하면 disturbance에는 빠르게 반응하지만, model 호출이 timestep 수만큼 필요합니다.",
  "Chunk 하나로 여러 timestep을 한 번에 예측하면 호출 수가 줄어듭니다. ACT의 k=100 ablation에서는 성공률이 1%(k=1)에서 44%(k=100)로 올랐습니다.",
  "Chunk 실행 도중 물체가 움직여도 새 observation을 반영하지 못해, 이후 step은 이미 낡은(stale) 계획을 그대로 실행합니다.",
  "매 step마다 새 chunk를 다시 예측하고, 겹치는 여러 예측을 최근 것일수록 큰 가중치로 평균해 하나의 action만 실행합니다.",
] as const;

type Tone = "primary" | "muted" | "alert";

const TONE_CLASS: Record<Tone, string> = {
  primary: "border-primary/55 bg-primary/8 text-foreground",
  muted: "border-border bg-muted/30 text-muted-foreground",
  alert: "border-amber-500/60 bg-amber-500/10 text-amber-700 dark:text-amber-400",
};

// Scene 0~2 는 같은 12-step timeline 위에서 chunk 경계·stale 구간만 바뀐다.
const TIMELINE_SCENES: Record<
  number,
  { chunkStarts: number[]; staleFrom: number | null }
> = {
  0: { chunkStarts: STEPS, staleFrom: null },
  1: { chunkStarts: [0, 6], staleFrom: null },
  2: { chunkStarts: [0, 6], staleFrom: 3 },
};

function stepTone(step: number, config: { chunkStarts: number[]; staleFrom: number | null }): Tone {
  if (config.staleFrom !== null) {
    const nextBoundary = config.chunkStarts.find((start) => start > step) ?? STEP_COUNT;
    if (step >= config.staleFrom && step < nextBoundary) return "alert";
  }
  const groupIndex = config.chunkStarts.filter((start) => start <= step).length - 1;
  return groupIndex % 2 === 0 ? "primary" : "muted";
}

// Scene 3(ensembling) 전용: 서로 다른 시점에 시작한 chunk 세 개가 t=4 를 함께 예측한다.
const ENSEMBLE_CHUNKS = [
  { label: "Chunk A (t=0 시작)", start: 0, length: 6, ageAtT: 4 },
  { label: "Chunk B (t=2 시작)", start: 2, length: 6, ageAtT: 2 },
  { label: "Chunk C (t=4 시작)", start: 4, length: 6, ageAtT: 0 },
] as const;
const ENSEMBLE_M = 0.5; // 예시 가중치일 뿐 논문이 고정한 값이 아니다.
const ENSEMBLE_TARGET = 4;

function relativeWeight(age: number) {
  return Math.exp(-ENSEMBLE_M * age);
}
const ENSEMBLE_MAX_WEIGHT = Math.max(
  ...ENSEMBLE_CHUNKS.map((chunk) => relativeWeight(chunk.ageAtT)),
);

export default function RobotActionRepresentationsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const timelineConfig = TIMELINE_SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="Action chunking"
      title="Chunk 길이는 model 호출 수와 open-loop 위험을 함께 정합니다"
      description="같은 12-timestep 구간을 k=1, k=6, disturbance, temporal ensembling 네 조건에서 봅니다."
      note="Chunk 길이·disturbance 시점·ensembling 가중치(m)는 mechanism을 보여 주기 위한 예시 값입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Action chunking과 temporal ensembling"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(32rem,calc(100dvh-15rem))] min-h-[25rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          <div className="mt-6 min-h-[9rem]">
            {timelineConfig ? (
              <div>
                <div className="grid grid-cols-12 gap-1">
                  {STEPS.map((step) => (
                    <div
                      key={step}
                      className={`flex h-9 items-center justify-center border text-[11px] font-bold ${TONE_CLASS[stepTone(step, timelineConfig)]}`}
                    >
                      {step}
                    </div>
                  ))}
                </div>
                <div className="mt-1 grid grid-cols-12 gap-1">
                  {STEPS.map((step) => (
                    <div key={step} className="text-center text-[10px] font-black text-primary">
                      {timelineConfig.chunkStarts.includes(step) ? "call" : ""}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {ENSEMBLE_CHUNKS.map((chunk) => {
                  return (
                    <div key={chunk.label} className="grid grid-cols-12 items-center gap-1">
                      <div
                        className="col-span-12 grid grid-cols-12 gap-1"
                        style={{ gridTemplateColumns: "repeat(12, minmax(0, 1fr))" }}
                      >
                        <div
                          className="flex h-9 items-center gap-1 border border-primary/45 bg-primary/6 px-2 text-[10px] font-bold text-foreground"
                          style={{ gridColumn: `${chunk.start + 1} / span ${chunk.length}` }}
                        >
                          <span className="truncate">{chunk.label}</span>
                        </div>
                        <div
                          className="flex h-9 items-center justify-center border border-amber-500/60 bg-amber-500/10 text-[10px] font-black text-amber-700 dark:text-amber-400"
                          style={{ gridColumn: `${ENSEMBLE_TARGET + 1} / span 1` }}
                        >
                          t=4
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="mt-3 space-y-1.5 border-t border-border/60 pt-3">
                  {ENSEMBLE_CHUNKS.map((chunk) => {
                    const weight = relativeWeight(chunk.ageAtT);
                    const widthPct = (weight / ENSEMBLE_MAX_WEIGHT) * 100;
                    return (
                      <div key={chunk.label} className="flex items-center gap-2">
                        <span className="w-40 shrink-0 truncate text-[10px] text-muted-foreground">
                          {chunk.label} 예측의 t=4 가중치
                        </span>
                        <span className="h-3 flex-1 border border-border bg-muted/20">
                          <span
                            className="block h-full bg-primary/45"
                            style={{ width: `${widthPct}%` }}
                          />
                        </span>
                        <span className="w-14 shrink-0 text-right font-mono text-[10px] text-foreground">
                          w≈{weight.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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
