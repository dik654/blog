import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism만 보여 준다: 같은 12-step 경로 위에서 (1) 전체를 그대로 쌓는
 * trajectory memory, (2) anchor만 고해상도로 남기는 anchor-trajectory memory,
 * (3) 같은 위치·다른 시간을 함께 인덱싱하는 spatial-temporal memory가
 * 반복 방문을 어떻게 다르게 다루는지 대비한다.
 */
const STEP_COUNT = 12;
const STEPS = Array.from({ length: STEP_COUNT }, (_, index) => index);
const ANCHOR_STEPS = new Set([0, 4, 8]);
const REVISIT_STEP = 11;
const MATCHED_ANCHOR = 4; // step 11이 공간적으로 다시 만나는 anchor

const SCENES = [
  "Trajectory memory: 전체를 그대로 쌓는다",
  "Anchor-trajectory memory: 주요 지점만 고해상도로",
  "Spatial-temporal memory: 같은 위치·다른 시간을 인덱싱",
  "반복 방문을 걸러 재방문을 피한다",
] as const;

const NOTES = [
  "매 step의 observation을 전부 그대로 저장하면 기억은 정확하지만 경로가 길어질수록 메모리와 검색 비용이 그만큼 늘어납니다.",
  "분기점처럼 다시 참조할 값이 큰 step만 anchor로 남기고, 나머지는 가벼운 space-time indicator로 압축합니다.",
  "Step 11은 anchor step 4와 같은 위치를 다른 시간에 다시 지납니다. 위치와 시간을 함께 인덱싱해야 이 둘이 '같은 곳'임을 알 수 있습니다.",
  "같은 곳으로 판정되면 처음 보는 곳처럼 다시 탐색하지 않고, 이미 아는 anchor의 정보로 대체하거나 다른 경로로 replan합니다.",
] as const;

type Tone = "full" | "anchor" | "compressed" | "match" | "skip";

function stepTone(step: number, scene: number): Tone {
  if (step === REVISIT_STEP) {
    if (scene === 2) return "match";
    if (scene === 3) return "skip";
    if (scene === 0) return "full";
    return "compressed";
  }
  if (ANCHOR_STEPS.has(step)) {
    if (scene === 0) return "full";
    if (step === MATCHED_ANCHOR && scene === 2) return "match";
    return "anchor";
  }
  return scene === 0 ? "full" : "compressed";
}

const TONE_CLASS: Record<Tone, string> = {
  full: "border-primary/50 bg-primary/8 text-foreground",
  anchor: "border-primary bg-primary/20 text-foreground",
  compressed: "border-border bg-muted/15 text-muted-foreground/70",
  match: "border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-400",
  skip: "border-dashed border-amber-500/70 bg-amber-500/5 text-amber-700 dark:text-amber-400",
};

const TONE_LABEL: Record<Tone, string> = {
  full: "",
  anchor: "anchor",
  compressed: "",
  match: "match",
  skip: "skip",
};

export default function VisionLanguageNavigationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);

  return (
    <VizFrame
      eyebrow="Trajectory and spatial-temporal memory"
      title="Anchor로 압축한 기억이 같은 위치를 다른 시간에 알아봅니다"
      description="같은 12-step 경로를 trajectory memory, anchor 압축, spatial-temporal 매칭, 재방문 회피 네 조건에서 봅니다."
      note="Anchor 위치와 revisit 지점은 mechanism을 보여 주기 위한 예시이며 실제 경로 길이나 anchor 선정 규칙이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Trajectory memory와 anchor-trajectory memory 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(32rem,calc(100dvh-15rem))] min-h-[25rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          <div className="mt-6">
            <div className="grid grid-cols-12 gap-1">
              {STEPS.map((step) => {
                const tone = stepTone(step, scenes.active);
                return (
                  <div
                    key={step}
                    className={`flex h-9 items-center justify-center border text-[11px] font-bold ${TONE_CLASS[tone]}`}
                  >
                    {step}
                  </div>
                );
              })}
            </div>
            <div className="mt-1 grid grid-cols-12 gap-1">
              {STEPS.map((step) => {
                const tone = stepTone(step, scenes.active);
                return (
                  <div key={step} className="text-center text-[9px] font-black text-amber-700 dark:text-amber-400">
                    {TONE_LABEL[tone]}
                  </div>
                );
              })}
            </div>
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
