import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 6-station 경로에서 sparse reward(끝에만 +1)로는 여러 rollout 이
 * 목표 전에 멈춰 reward 가 전부 0 으로 남고, 같은 경로에 process reward(단계마다
 * 목표에 가까워진 만큼)를 주면 매 step 에 신호가 생겨 policy 가 goal 로 수렴한다는 것.
 * stage 높이는 네 장면 모두 같은 station 행 + reward 막대 행 + rollout 표시 행을
 * 그리고 값·강조만 바꿔 고정한다.
 */
const SCENES = [
  "Sparse reward: 목표(S6)에 도달해야만 +1",
  "세 rollout 모두 목표 전에 멈춰 reward가 0",
  "Process reward: 매 step마다 진척만큼 신호",
  "신호 덕에 policy가 goal 방향으로 수렴",
] as const;

const NOTES = [
  "S1에서 시작해 S6(goal)에 도달해야만 reward +1을 받는 sparse reward 환경입니다. 그 전까지는 어떤 step도 0입니다.",
  "세 번의 독립 rollout이 각각 S3·S2·S4에서 멈췄습니다. 셋 다 목표에 못 미쳐 reward는 여전히 0이라 policy가 어느 방향이 나은지 배울 신호가 없습니다.",
  "같은 경로에 process reward를 주면 S1→S6 진척 비율만큼 매 step마다 값을 받습니다. S3까지 갔다면 이미 0.5라는 부분 신호가 남습니다.",
  "매 step 신호가 있으니 policy gradient가 매 rollout마다 0이 아닌 방향을 얻어, 몇 번 반복하지 않고도 S1→S6로 곧장 수렴합니다.",
] as const;

const STATIONS = ["S1", "S2", "S3", "S4", "S5", "S6"] as const;
const N = STATIONS.length;
const COL_X = [40, 96, 152, 208, 264, 320];
const STOPS = [2, 1, 3]; // 0-indexed: S3, S2, S4 에서 멈춘 세 rollout
const BAR_MAX = 56;
const BAR_BASE = 168;

export default function RewardDesignForVerifiableRlViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3200);
  const scene = scenes.active;
  const showBars = scene >= 2;
  return (
    <VizFrame
      eyebrow="Sparse reward · process reward"
      title="같은 경로에서 sparse reward는 신호가 없고 process reward는 매 step 신호를 남깁니다"
      description="위 행은 S1~S6 station, 가운데 점은 세 rollout이 멈춘 자리, 아래 막대는 각 station의 reward 값입니다."
      note="실제로는 수십~수백 rollout을 병렬로 굴리고 reward 함수 하나를 여러 trajectory에 반복 적용합니다. 그림은 3개 rollout·6-station 경로로 단순화했습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Sparse reward와 process reward의 신호 차이"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(32rem,calc(100dvh-15rem))] min-h-[25rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scene + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>
          <div className="mt-4 border border-border p-3">
            <svg viewBox="0 0 360 190" className="mx-auto h-auto w-full max-w-[24rem]" role="img" aria-label="6-station 경로의 sparse·process reward 비교">
              <text x={6} y={12} className="fill-muted-foreground font-mono text-[8px]">Station</text>
              <text x={6} y={52} className="fill-muted-foreground font-mono text-[8px]">Rollout</text>
              <text x={6} y={92} className="fill-muted-foreground font-mono text-[8px]">Reward</text>

              {STATIONS.map((label, i) => {
                const x = COL_X[i];
                const isGoal = i === N - 1;
                const reached = scene === 3;
                return (
                  <g key={label}>
                    {i > 0 && <line x1={COL_X[i - 1] + 14} y1={22} x2={x - 14} y2={22} strokeWidth={1} className="stroke-border" />}
                    <rect
                      x={x - 14}
                      y={12}
                      width={28}
                      height={20}
                      strokeWidth={isGoal ? 1.25 : 1}
                      className={isGoal ? "fill-primary/10 stroke-primary" : "fill-transparent stroke-border"}
                    />
                    <text x={x} y={26} textAnchor="middle" className="fill-foreground font-mono text-[8px]">
                      {isGoal ? "Goal" : label}
                    </text>

                    {STOPS.includes(i) && scene <= 1 && (
                      <circle cx={x} cy={44} r={4} strokeWidth={1} className={scene === 1 ? "fill-muted-foreground/60 stroke-border" : "fill-transparent stroke-border"} />
                    )}
                    {isGoal && reached && (
                      <circle cx={x} cy={44} r={4} strokeWidth={1.25} className="fill-primary stroke-primary" />
                    )}

                    <rect
                      x={x - 10}
                      y={BAR_BASE - (showBars ? ((i + 1) / N) * BAR_MAX : 0)}
                      width={20}
                      height={showBars ? ((i + 1) / N) * BAR_MAX : 0}
                      className={reached && isGoal ? "fill-primary/70" : "fill-muted-foreground/50"}
                    />
                    <line x1={x - 14} y1={BAR_BASE} x2={x + 14} y2={BAR_BASE} strokeWidth={1} className="stroke-border" />
                    <text x={x} y={182} textAnchor="middle" className="fill-muted-foreground font-mono text-[8px]">
                      {showBars ? ((i + 1) / N).toFixed(2) : i === N - 1 ? "0/+1" : "0"}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scene]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
