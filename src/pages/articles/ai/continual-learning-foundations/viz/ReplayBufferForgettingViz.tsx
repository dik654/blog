import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: replay buffer 크기(원인)가 task B 학습 후 task A 정확도
 * 유지(상태 변화)로 이어지고, 그 회복폭이 줄어드는 지점(결과)을 보여준다.
 */
const SCENES = [
  "01 buffer 없음",
  "02 buffer 1%",
  "03 buffer 10%",
  "04 buffer 50%",
] as const;

const BUFFER_LABELS = ["Buffer 0%", "Buffer 1%", "Buffer 10%", "Buffer 50%"] as const;
const TASK_A_AFTER = [55, 78, 85, 87] as const;
const TASK_A_BEFORE = 90;

const NOTES = [
  "Task A를 90% 정확도로 학습한 뒤 buffer 없이 task B를 학습하면 task A 정확도가 55%까지 떨어집니다. 35%p가 forgetting입니다.",
  "Task A 데이터의 1%만 buffer에 남겨도 정확도가 78%로 회복됩니다. 적은 표본만으로도 하락폭이 크게 줄어듭니다.",
  "Buffer를 10%로 늘리면 85%까지 회복됩니다. 하락폭이 5%p까지 줄었습니다.",
  "Buffer를 50%까지 늘려도 87%로, 10% 대비 개선은 2%p뿐입니다. 저장 비용 대비 이득이 줄어드는 지점입니다.",
] as const;

export default function ReplayBufferForgettingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const active = scenes.active;
  const current = TASK_A_AFTER[active];
  const drop = TASK_A_BEFORE - current;

  return (
    <VizFrame
      eyebrow="Experience replay"
      title="Replay buffer 크기가 클수록 forgetting이 줄지만 개선폭은 줄어듭니다"
      description="Task A를 90% 정확도로 학습한 뒤 task B를 학습할 때, replay buffer 크기에 따라 task A 정확도가 얼마나 유지되는지 보여줍니다."
      note="숫자는 buffer 크기와 forgetting의 관계를 보여주기 위한 예시 값이며 특정 논문의 실측치가 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Replay buffer size versus forgetting"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(28rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[active]}</h4>

          <div className="mt-6 flex items-end gap-3">
            {BUFFER_LABELS.map((label, index) => {
              const value = TASK_A_AFTER[index];
              const isActive = index === active;
              return (
                <div key={label} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-32 w-full items-end border border-border bg-muted/30">
                    <div
                      className={`w-full border-t ${isActive ? "border-primary bg-primary/25" : "border-border bg-muted-foreground/15"}`}
                      style={{ height: `${value}%` }}
                    />
                  </div>
                  <p className={`text-[11px] font-bold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                    {label}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">{value}%</p>
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-sm">
            Task A 정확도: <span className="font-mono font-bold text-foreground">{TASK_A_BEFORE}% → {current}%</span>{" "}
            <span className="text-muted-foreground">(forgetting {drop}%p)</span>
          </p>

          <p className="mt-6 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
