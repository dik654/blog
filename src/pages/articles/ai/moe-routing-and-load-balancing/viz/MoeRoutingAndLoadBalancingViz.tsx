import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 Viz 에 한 mechanism: router 가 한 expert 로 drift 하다가(collapse), capacity 를
 * 넘은 slot 이 drop 되고, bias 갱신이 몇 step 안에 부하를 다시 고르게 되돌리는 장면.
 * 8 expert · top-2 · token 1,024 는 본문 worked example 과 같은 숫자다.
 * stage 높이는 모든 장면에서 같다. gradient·glow·shadow·굵은 선 없음.
 */
const SCENES = ["Uniform routing", "Expert 0 drift", "Capacity drops overflow", "Bias correction (3 step)", "Rebalanced"] as const;

const NOTES = [
  "8 expert가 slot 2,048개(token 1,024 × top-2)를 고르게 나눠 받아 expert당 256개입니다. Bias는 아직 0입니다.",
  "초기 편차가 되먹임을 만들어 expert 0이 614 slot(이상 비율의 2.4배)을 받고 나머지는 평균 아래로 내려갑니다. Capacity 320은 아직 표시만 됩니다.",
  "φ=1.25의 capacity 320을 넘은 294 slot(짙은 표시)은 계산되지 않고 버려집니다. Expert 0 수요의 약 48%가 token dropping입니다.",
  "Auxiliary-loss-free bias가 3 step 갱신됩니다. 과부하 expert 0은 bias가 −0.002로 내려가고 가장 부족한 expert 5는 +0.003으로 올라 다음 선택 점수를 바꿉니다.",
  "Bias가 선택 점수를 눌러 부하가 다시 평균 256 근처로 모입니다. Drop은 사라지고 bias는 이 수준에서 갱신을 멈춥니다.",
] as const;

const N = 8;
const IDEAL = 256;
const CAPACITY = 320;

const UNIFORM = [256, 256, 256, 256, 256, 256, 256, 256];
const COLLAPSED = [614, 205, 205, 205, 205, 205, 205, 204];
const CORRECTING = [430, 235, 235, 235, 235, 235, 235, 208];
const REBALANCED = [270, 250, 254, 253, 251, 260, 253, 257];

const BIAS_ZERO = [0, 0, 0, 0, 0, 0, 0, 0];
const BIAS_STEP3 = [-0.002, 0, 0, 0, 0, 0.003, 0, 0.001];
const BIAS_HOLD = [-0.002, 0.001, 0, 0, 0.001, 0.003, 0, 0.001];

interface Scene {
  counts: readonly number[];
  bias: readonly number[];
  showCapacity: boolean;
  showDrop: boolean;
  verdict: string;
}

const SCENE_DATA: readonly Scene[] = [
  { counts: UNIFORM, bias: BIAS_ZERO, showCapacity: false, showDrop: false, verdict: "balanced · 256 / expert · bias 0" },
  { counts: COLLAPSED, bias: BIAS_ZERO, showCapacity: true, showDrop: false, verdict: "expert 0 → 614 slot (2.4×) · rest below average" },
  { counts: COLLAPSED, bias: BIAS_ZERO, showCapacity: true, showDrop: true, verdict: "capacity 320 · overflow 294 dropped" },
  { counts: CORRECTING, bias: BIAS_STEP3, showCapacity: true, showDrop: false, verdict: "bias step 3 · e0 −0.002 · e5 +0.003" },
  { counts: REBALANCED, bias: BIAS_HOLD, showCapacity: false, showDrop: false, verdict: "back near 256 / expert · bias holds" },
];

const CHART_X = 24;
const CHART_W = 592;
const BAR_GAP = 10;
const BAR_W = (CHART_W - BAR_GAP * (N - 1)) / N;
const BASELINE_Y = 172;
const MAX_BAR_H = 128;
const MAX_COUNT = 660;

function barHeight(count: number): number {
  return (Math.min(count, MAX_COUNT) / MAX_COUNT) * MAX_BAR_H;
}

export default function MoeRoutingAndLoadBalancingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  const scene = SCENE_DATA[scenes.active];
  const capacityY = BASELINE_Y - barHeight(CAPACITY);

  return (
    <VizFrame
      eyebrow="Load balancing · expert collapse"
      title="Router가 한 expert로 drift 하면 capacity가 token을 버리고, bias 갱신이 부하를 되돌립니다"
      description="여덟 막대는 expert 0부터 7까지 이번 step에 받은 slot 수입니다. 점선은 capacity factor 1.25의 상한이고, 상한을 넘은 부분은 drop으로 표시합니다. 아래 숫자는 auxiliary-loss-free bias입니다."
      note="8 expert·top-2·token 1,024는 본문 worked example과 같은 값입니다. 실제 학습에서는 수백~수천 expert와 수백만 token 단위로 같은 되먹임이 훨씬 느리게, 훨씬 큰 규모로 나타납니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Router drift, capacity overflow, bias correction 장면"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(32rem,calc(100dvh-15rem))] min-h-[25rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            MoE routing step · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>
          <div className="mt-4 w-full overflow-x-auto">
            <svg viewBox="0 0 640 240" className="h-auto w-full min-w-[32rem]" role="img" aria-hidden="true">
              <text x={CHART_X} y={14} className="fill-muted-foreground text-[9px]">8 experts · top-2 · 1,024 tokens · ideal 256 / expert</text>

              {scene.showCapacity && (
                <>
                  <line x1={CHART_X} y1={capacityY} x2={CHART_X + CHART_W} y2={capacityY} className="stroke-amber-600/70" strokeWidth={1} strokeDasharray="4 3" />
                  <text x={CHART_X + CHART_W - 74} y={capacityY - 4} className="fill-amber-600 text-[8px]">capacity 320</text>
                </>
              )}

              {scene.counts.map((count, index) => {
                const x = CHART_X + index * (BAR_W + BAR_GAP);
                const kept = scene.showDrop ? Math.min(count, CAPACITY) : count;
                const dropped = scene.showDrop ? Math.max(0, count - CAPACITY) : 0;
                const keptH = barHeight(kept);
                const dropH = barHeight(kept + dropped) - keptH;
                const hot = count === Math.max(...scene.counts) && count > IDEAL * 1.2;
                return (
                  <g key={index}>
                    <rect x={x} y={BASELINE_Y - keptH} width={BAR_W} height={keptH} className={hot ? "fill-amber-500/55" : "fill-primary/55"} />
                    {dropH > 0 && (
                      <rect x={x} y={BASELINE_Y - keptH - dropH} width={BAR_W} height={dropH} className="fill-amber-600/85 stroke-amber-700" strokeWidth={1} />
                    )}
                    <rect x={x} y={BASELINE_Y - keptH - dropH} width={BAR_W} height={Math.max(keptH + dropH, 1)} className="fill-transparent stroke-border" strokeWidth={1} />
                    <text x={x + BAR_W / 2} y={BASELINE_Y + 14} textAnchor="middle" className="fill-muted-foreground text-[8px] font-bold">e{index}</text>
                    <text x={x + BAR_W / 2} y={BASELINE_Y - keptH - dropH - 4} textAnchor="middle" className="fill-foreground text-[8px]">{count}</text>
                  </g>
                );
              })}

              <text x={CHART_X} y={198} className="fill-muted-foreground text-[9px]">auxiliary-loss-free bias (top-k 선택 점수에만 더함)</text>
              {scene.bias.map((bias, index) => {
                const x = CHART_X + index * (BAR_W + BAR_GAP);
                const sign = bias > 0 ? "+" : bias < 0 ? "−" : "±";
                const cls = bias > 0 ? "fill-primary" : bias < 0 ? "fill-amber-600" : "fill-muted-foreground";
                return (
                  <text key={index} x={x + BAR_W / 2} y={212} textAnchor="middle" className={`${cls} text-[9px] font-bold`}>
                    {sign}{Math.abs(bias).toFixed(3)}
                  </text>
                );
              })}

              <rect x={CHART_X} y={222} width={CHART_W} height={16} className="fill-transparent stroke-primary/60" strokeWidth={1} />
              <text x={CHART_X + 8} y={233} className="fill-foreground text-[9px] font-bold">{scene.verdict}</text>
            </svg>
          </div>
          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
