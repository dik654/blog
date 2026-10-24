import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const scenes = [
  {
    label: "현재 policy",
    title: "Policy θ₀가 같은 prompt q를 네 번 받습니다",
    state: "q + θ₀",
    result: "아직 completion 없음",
    note: "이번 update의 출발 policy와 prompt ID를 먼저 고정합니다.",
  },
  {
    label: "Rollout",
    title: "θ₀가 completion o₁·o₂·o₃·o₄를 만듭니다",
    state: "o₁ · o₂ · o₃ · o₄",
    result: "G=4 sampled completions",
    note: "Policy가 바뀌면 같은 prompt의 rollout distribution도 달라집니다.",
  },
  {
    label: "검증",
    title: "고정된 verifier가 네 결과를 같은 규칙으로 채점합니다",
    state: "r = [1, 0, 1, 0]",
    result: "평균 reward = 0.5",
    note: "Parser·test·sandbox version이 바뀌면 같은 completion의 reward도 달라질 수 있습니다.",
  },
  {
    label: "상대 신호",
    title: "같은 prompt 안에서 평균보다 나은 결과를 구분합니다",
    state: "Â = [+1, −1, +1, −1]",
    result: "좋은 두 경로는 강화, 나쁜 두 경로는 억제",
    note: "모든 reward가 같으면 group 안에서 비교할 신호가 사라집니다.",
  },
  {
    label: "Policy 갱신",
    title: "상대 신호로 θ₀를 갱신해 θ₁을 만듭니다",
    state: "θ₀ → update → θ₁",
    result: "다음 rollout은 θ₁에서 다시 생성",
    note: "Rollout과 update는 한 번으로 끝나지 않고 새 policy를 출발점으로 반복됩니다.",
  },
] as const;

const stages = ["현재 정책", "응답 생성", "보상 검증", "상대 신호", "정책 갱신"] as const;

export default function OnlineLoopViz() {
  const controls = useAnimatedScenes(scenes.length, 6200);
  const scene = scenes[controls.active];

  return (
    <VizFrame
      eyebrow="On-policy RL loop"
      title="현재 policy가 만든 기록이 바로 다음 policy를 바꿉니다"
      description="Teacher trace를 미리 고정하는 SFT와 달리, GRPO의 rollout data는 policy가 갱신될 때마다 다시 만들어집니다. 아래 숫자는 상태 전이를 설명하는 가정입니다."
    >
      <div
        id={controls.playbackId}
        data-viz
        data-viz-scene="open-r1-online-loop-viz"
        data-story-index={controls.active}
        data-viz-canvas
        role="group"
        aria-label="현재 policy에서 rollout·reward·relative advantage·새 policy로 이어지는 애니메이션"
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="min-w-0 overflow-hidden border-y border-border/70 bg-background px-3 py-4 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-6 sm:py-6"
      >
        <div data-viz-live-only>
          <p className="text-[11px] font-black tracking-[0.12em] text-primary">
            상태 전이 · {String(controls.active + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-2 min-h-[3.5rem] break-keep text-base font-bold leading-6 sm:min-h-[2.5rem] sm:text-lg sm:leading-7">
            {scene.title}
          </h3>

          <div className="mt-4 grid grid-cols-5 gap-px bg-border p-px sm:mt-5">
            {stages.map((stage, index) => {
              const completed = index < controls.active;
              const active = index === controls.active;
              return (
                <div
                  key={stage}
                  className={`min-w-0 bg-background px-1 py-2 text-center sm:px-3 sm:py-3 ${
                    active ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <span className="font-mono text-[9px] font-black text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <strong className="mt-1 block break-keep text-[10px] leading-4 sm:text-xs">
                    {stage}
                  </strong>
                  <span className="mt-1 block text-[9px] leading-4">
                    {active ? "처리 중" : completed ? "완료" : "대기"}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-3">
            <div className="min-w-0 border-l-2 border-primary/55 pl-4">
              <p className="text-[10px] font-bold text-muted-foreground">
                현재 기록
              </p>
              <p className="mt-2 break-words font-mono text-sm font-bold leading-6 text-foreground">
                {scene.state}
              </p>
            </div>
            <div className="min-w-0 border-l-2 border-border pl-4">
              <p className="text-[10px] font-bold text-muted-foreground">
                이번 단계의 결과
              </p>
              <p className="mt-2 break-keep text-sm font-bold leading-6 text-foreground">
                {scene.result}
              </p>
            </div>
          </div>

          <p className="mt-4 min-h-[3.75rem] border-l border-primary/50 pl-4 text-xs leading-5 text-muted-foreground sm:mt-5 sm:min-h-[3rem] sm:text-sm sm:leading-6">
            {scene.note}
          </p>
        </div>

        <AnimatedSceneControls labels={scenes.map((item) => item.label)} {...controls} />

        <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">
          {scenes.map((item, index) => (
            <li key={item.label}>
              <strong>
                {String(index + 1).padStart(2, "0")} · {item.label} — {item.title}
              </strong>
              <span className="mt-1 block font-mono text-xs text-foreground">
                {item.state} · {item.result}
              </span>
              <span className="mt-1 block text-muted-foreground">
                {item.note}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}
