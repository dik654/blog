import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["현재 관측", "미래 비교", "첫 행동 실행", "실제 관측으로 수정"] as const;
const NOTES = [
  "현재 위치 0과 목표 2를 고정합니다. 아직 현실의 물체를 움직이지 않았습니다.",
  "네 행동 순서를 모델 안에서 두 단계씩 펼칩니다. 예측 비용이 가장 작은 [+1,+1]을 고릅니다.",
  "계획 전체가 아니라 첫 +1만 실제 환경에 보냅니다. 모델은 다음 위치를 1.0으로 예상했습니다.",
  "센서가 돌려준 위치는 0.8입니다. 예측 1.0을 버리고 0.8에서 후보 비용을 다시 계산합니다.",
] as const;

const PLANS = [
  { actions: "−1, −1", initial: "−2.0", initialCost: "16.00", observed: "−1.2", observedCost: "10.24" },
  { actions: "−1, +1", initial: "0.0", initialCost: "4.00", observed: "0.8", observedCost: "1.44" },
  { actions: "+1, −1", initial: "0.0", initialCost: "4.00", observed: "0.8", observedCost: "1.44" },
  { actions: "+1, +1", initial: "2.0", initialCost: "0.00", observed: "2.8", observedCost: "0.64" },
] as const;

/** 설명용 1차원 모델. 학습된 encoder나 로봇 제어기를 실행하지 않습니다. */
export default function WorldPlanningViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800, { loop: false });
  const step = scenes.active;
  const revised = step === 3;

  return (
    <VizFrame
      eyebrow="폐루프 계획"
      title="예측으로 하나를 고르고, 현실을 본 뒤 다시 계산합니다"
      description="위치 0에서 목표 2로 가는 같은 사례를 관측·예측·실행·재관측 네 장면으로 추적합니다."
      note="위치와 행동은 메커니즘을 검산하기 위한 1차원 가정입니다. 실제 학습된 잠재 표현이나 로봇 실측값이 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-scene="world-model-planning-viz"
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="월드모델이 행동 후보를 비교하고 실제 관측으로 다시 계획하는 네 장면"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary sm:h-[min(34rem,calc(100svh-15rem))] sm:min-h-[27rem]"
      >
        <div key={step} data-viz-live-only className="flex min-h-0 flex-1 flex-col justify-center">
          <div className="grid grid-cols-4 gap-1 sm:gap-3">
            {SCENES.map((label, index) => (
              <div
                key={label}
                className={`min-w-0 border-t-2 pt-2 ${step >= index ? "border-primary text-foreground" : "border-border text-muted-foreground"}`}
              >
                <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
                <strong className="mt-1 block break-keep text-[10px] leading-4 sm:text-xs sm:leading-5">{label}</strong>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
            <div className="border-l-2 border-sky-500 bg-card px-2 py-2 sm:px-3 sm:py-3">
              <span className="text-[10px] font-bold text-sky-700 dark:text-sky-300">출발점</span>
              <strong className="mt-1 block text-lg sm:text-xl">x = {revised ? "0.8" : "0"}</strong>
              <span className="mt-1 block break-keep text-[10px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">
                {revised ? "센서가 확인한 새 위치" : "처음 관측한 위치"}
              </span>
            </div>
            <div className={`border-l-2 bg-card px-2 py-2 sm:px-3 sm:py-3 ${step >= 2 ? "border-amber-500" : "border-border"}`}>
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300">현실의 응답</span>
              <strong className="mt-1 block text-lg sm:text-xl">{step < 2 ? "대기" : step === 2 ? "예측 1.0" : "관측 0.8"}</strong>
              <span className="mt-1 block break-keep text-[10px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">
                {step < 2 ? "후보를 고르는 동안 실행하지 않음" : step === 2 ? "첫 +1을 보낸 직후" : "0.2 오차를 다음 계획에 반영"}
              </span>
            </div>
          </div>

          <p className="mt-3 border-l border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">{NOTES[step]}</p>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PLANS.map((plan, index) => {
              const selected = index === 3 && step >= 1;
              return (
                <div key={plan.actions} className={`min-w-0 border px-2 py-2 ${selected ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/25" : "border-border"}`}>
                  <strong className="block font-mono text-xs">[{plan.actions}]</strong>
                  <span className="mt-1 block text-[10px] leading-4 text-muted-foreground">끝 {revised ? plan.observed : plan.initial}</span>
                  <span className="block text-[10px] leading-4 text-muted-foreground">비용 {revised ? plan.observedCost : plan.initialCost}</span>
                  {selected ? <span className="mt-1 block text-[9px] font-bold text-emerald-700 dark:text-emerald-300">현재 후보 중 최소</span> : null}
                </div>
              );
            })}
          </div>
        </div>

        <AnimatedSceneControls {...scenes} labels={SCENES} />
        <ol className="static-reading-only mt-4 list-decimal space-y-3 pl-5 text-sm leading-6">
          {SCENES.map((label, index) => (
            <li key={label}>
              <strong>{label}</strong>
              <span className="mt-1 block text-muted-foreground">{NOTES[index]}</span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}
