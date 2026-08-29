import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 5-step trajectory 끝에서만 reward +1 을 받을 때, return G_t 가
 * 감가율(γ=0.9)로 거꾸로 누적되며 이른 action 에도 같은 모양의 credit 이 도달한다는 것.
 * 마지막 장면은 같은 γ 로 horizon 을 20 step 까지 늘리면 첫 action 의 credit 이
 * 거의 사라진다는 것을 고정된 5-column layout 안에 별도 비교 줄로 보여 준다.
 * stage 높이는 네 장면 모두 같은 SVG 영역(트래젝토리 행 + return 막대 행 + 비교 행)을
 * 그리고 값·강조만 바꿔 고정한다.
 */
const SCENES = [
  "5-step trajectory, reward는 끝에만",
  "Return G_t: 끝에서 거꾸로 누적",
  "이른 action a1 에도 같은 모양의 credit",
  "Horizon 을 20 step 으로 늘리면 credit이 거의 사라짐",
] as const;

const NOTES = [
  "행동 a1..a5 를 고른 5-step trajectory 입니다. 중간 reward 는 전부 0 이고 마지막 step 에서만 r=+1 을 받습니다.",
  "Return G_t = r_t + γ·G_(t+1) 을 t=5 에서 t=1 방향으로 계산합니다. γ=0.9 이면 G5=1.00, G4=0.90, G3=0.81, G2=0.729, G1=0.656 입니다.",
  "Policy gradient 는 모든 action 의 log-probability 를 그 시점의 G_t 만큼 밀어 올립니다. a1 은 4 step 전 action 인데도 0.656 이라는 몫을 받는데, 이 몫이 a1 이 실제로 성공에 기여한 정도인지는 return 계산이 구분하지 않습니다.",
  "같은 γ=0.9 를 20-step trajectory 에 적용하면 첫 action 의 credit 은 γ^19 ≈ 0.135 로, 5-step 일 때(0.656)보다 훨씬 작아집니다. Trajectory 가 길어질수록 이른 action 에 남는 신호가 옅어지는 것이 long-horizon credit assignment 가 어려운 이유입니다.",
] as const;

type Step = { id: string; label: string };
const STEPS: readonly Step[] = [
  { id: "a1", label: "a1" },
  { id: "a2", label: "a2" },
  { id: "a3", label: "a3" },
  { id: "a4", label: "a4" },
  { id: "a5", label: "a5" },
];
const GAMMA = 0.9;
// G_t = r_t + γ·G_(t+1), 마지막 step 만 reward 1이라 G_t = γ^(5-t)
const G = [Math.pow(GAMMA, 4), Math.pow(GAMMA, 3), Math.pow(GAMMA, 2), Math.pow(GAMMA, 1), 1];
const G20_FIRST = Math.pow(GAMMA, 19);

const COL_X = [58, 148, 238, 328, 418];
const BAR_MAX = 62;
const BAR_BASE = 150;

export default function RlFoundationsForLlmPostTrainingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3200);
  const scene = scenes.active;
  return (
    <VizFrame
      eyebrow="Return · credit assignment"
      title="같은 trajectory 의 return이 거꾸로 누적되며 이른 action에도 credit을 남깁니다"
      description="위 행은 5-step trajectory와 reward, 가운데 막대는 각 시점의 return G_t, 아래 줄은 20-step으로 늘렸을 때 첫 action의 credit 비교입니다."
      note="실제 학습은 이런 trajectory를 수백~수천 개 뽑아 평균하며, reward 를 중간에도 줄 수 있습니다(다음 글의 dense reward). 그림은 sparse·단일 trajectory 로 단순화했습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Return의 역방향 누적과 credit assignment 문제"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(32rem,calc(100dvh-15rem))] min-h-[25rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scene + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>
          <div className="mt-4 border border-border p-3">
            <svg viewBox="0 0 480 190" className="mx-auto h-auto w-full max-w-[28rem]" role="img" aria-label="5-step trajectory의 return 역방향 누적과 20-step 비교">
              <text x={8} y={12} className="fill-muted-foreground font-mono text-[8px]">Trajectory</text>
              <text x={8} y={50} className="fill-muted-foreground font-mono text-[8px]">Return G_t</text>

              {STEPS.map((s, i) => {
                const x = COL_X[i];
                const isLast = i === STEPS.length - 1;
                const isFirst = i === 0;
                const highlight = scene >= 2 && isFirst;
                const barH = scene >= 1 ? G[i] * BAR_MAX : 0;
                return (
                  <g key={s.id}>
                    {i > 0 && (
                      <line x1={COL_X[i - 1] + 20} y1={22} x2={x - 20} y2={22} strokeWidth={1} className="stroke-border" />
                    )}
                    <rect
                      x={x - 18}
                      y={12}
                      width={36}
                      height={20}
                      strokeWidth={highlight ? 1.25 : 1}
                      className={highlight ? "fill-primary/10 stroke-primary" : "fill-transparent stroke-border"}
                    />
                    <text x={x} y={26} textAnchor="middle" className="fill-foreground font-mono text-[9px]">
                      {s.label}
                    </text>
                    <text x={x} y={44} textAnchor="middle" className="fill-muted-foreground font-mono text-[8px]">
                      {isLast ? "r=+1" : "r=0"}
                    </text>

                    <rect
                      x={x - 14}
                      y={BAR_BASE - barH}
                      width={28}
                      height={barH}
                      className={highlight ? "fill-primary/70" : "fill-muted-foreground/50"}
                    />
                    <line x1={x - 20} y1={BAR_BASE} x2={x + 20} y2={BAR_BASE} strokeWidth={1} className="stroke-border" />
                    <text x={x} y={166} textAnchor="middle" className="fill-muted-foreground font-mono text-[8px]">
                      {scene >= 1 ? `G${i + 1}=${G[i].toFixed(3)}` : "G? =–"}
                    </text>
                  </g>
                );
              })}

              <text x={8} y={184} className="fill-muted-foreground font-mono text-[8px]">
                {scene === 3
                  ? `T=5: G1=${G[0].toFixed(3)}  vs  T=20: G1≈${G20_FIRST.toFixed(3)}`
                  : "T=5 trajectory 기준(비교는 마지막 장면)"}
              </text>
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
