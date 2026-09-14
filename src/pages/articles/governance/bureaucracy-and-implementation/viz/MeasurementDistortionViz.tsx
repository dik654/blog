import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: measurement 의 ExplainedFormula — 잰 것에 보상을 걸수록 못 잰 것이 밀려난다 */
const SCENES = [
  "성과급 없이 직업의식만 있을 때",
  "성과급을 걸면 잰 쪽이 늘어난다",
  "더 걸면 못 잰 쪽이 더 줄어든다",
  "끝까지 걸면 못 잰 쪽이 사라진다",
] as const;

/** 두 과업이 시간을 두고 다투는 정도, 못 재는 과업에 대한 내적 동기 */
const GAMMA = 0.5;
const MU = 10;
/** 사회가 보는 단위당 가치. 재기 어려운 쪽이 더 중요한 경우를 둔다 */
const V1 = 1;
const V2 = 3;

const BETAS = [5, 10, 15, 20] as const;

const ACCENT = "#6366f1";
const OK = "#10b981";
const WARN = "#ef4444";
const MUTED = "#94a3b8";

const effortMeasured = (beta: number) => (beta - GAMMA * MU) / (1 - GAMMA * GAMMA);
const effortUnmeasured = (beta: number) => (MU - GAMMA * beta) / (1 - GAMMA * GAMMA);
const socialValue = (beta: number) =>
  V1 * effortMeasured(beta) + V2 * effortUnmeasured(beta);

const fmt = (v: number) => (Math.abs(v - Math.round(v)) < 1e-9 ? `${Math.round(v)}` : v.toFixed(2));

const BAR_X = 128;
const BAR_W = 220;
const SCALE = BAR_W / 20;

export default function MeasurementDistortionViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const step = scenes.active;
  const beta = BETAS[step];
  const e1 = effortMeasured(beta);
  const e2 = effortUnmeasured(beta);
  const value = socialValue(beta);

  const NOTES = [
    `보상을 잰 과업에 걸긴 하되 아주 약하게 두면(계수 ${beta}) 담당자는 잴 수 없는 쪽에만 ${fmt(e2)}만큼 힘을 씁니다. 사회가 보는 값의 합은 ${fmt(value)}입니다.`,
    `계수를 ${beta}로 올리면 잰 쪽 노력이 ${fmt(e1)}로 올라오지만 못 잰 쪽은 ${fmt(e2)}로 내려갑니다. 둘이 같은 시간을 두고 다투기 때문이고, 합은 ${fmt(value)}으로 줄었습니다.`,
    `계수 ${beta}에서 잰 쪽은 ${fmt(e1)}, 못 잰 쪽은 ${fmt(e2)}입니다. 관리 지표는 계속 좋아지는데 사회가 보는 값의 합은 ${fmt(value)}으로 더 줄어듭니다.`,
    `계수 ${beta}에서 못 잰 쪽 노력이 정확히 ${fmt(e2)}이 됩니다. 지표만 보면 가장 성공한 상태인데 합은 ${fmt(value)}으로 가장 낮습니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="측정과 유인"
      title="잴 수 있는 것에 보상을 걸수록 잴 수 없는 것이 밀려납니다"
      description="두 일이 같은 시간을 두고 다툴 때, 한쪽에만 걸린 보상은 다른 쪽을 끌어내립니다."
      note={`두 과업이 시간을 두고 다투는 정도를 ${GAMMA}, 잴 수 없는 일에 대한 직업의식을 ${MU}로 두었습니다. 사회가 보는 단위당 가치는 잰 쪽 ${V1}, 못 잰 쪽 ${V2}입니다.`}
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="성과급 계수와 두 과업의 노력"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>

          <div className="mt-4 w-full min-w-0 overflow-x-auto">
            <svg
              viewBox="0 0 480 200"
              role="img"
              aria-label={SCENES[step]}
              className="h-auto w-full min-w-[30rem] max-w-2xl"
            >
              <text x={BAR_X - 10} y={32} textAnchor="end" fontSize={9} fontWeight={700} fill={ACCENT}>
                성과급 계수
              </text>
              <rect x={BAR_X} y={20} width={beta * SCALE} height={14} fill={ACCENT} fillOpacity={0.25} stroke={ACCENT} strokeWidth={1} />
              <text x={BAR_X + BAR_W + 10} y={31} fontSize={9} fontWeight={700} fill={ACCENT}>
                {beta}
              </text>

              <text x={BAR_X - 10} y={68} textAnchor="end" fontSize={9} fontWeight={700} fill={OK}>
                잴 수 있는 일
              </text>
              <rect x={BAR_X} y={56} width={Math.max(e1 * SCALE, 0.6)} height={14} fill={OK} fillOpacity={0.5} stroke={OK} strokeWidth={1} />
              <text x={BAR_X + BAR_W + 10} y={67} fontSize={9} fontWeight={700} fill={OK}>
                {fmt(e1)}
              </text>
              <text x={BAR_X - 10} y={82} textAnchor="end" fontSize={7.5} fill={MUTED}>
                처리 건수 · 적발 실적
              </text>

              <text x={BAR_X - 10} y={106} textAnchor="end" fontSize={9} fontWeight={700} fill={WARN}>
                잴 수 없는 일
              </text>
              <rect x={BAR_X} y={94} width={Math.max(e2 * SCALE, 0.6)} height={14} fill={WARN} fillOpacity={0.5} stroke={WARN} strokeWidth={1} />
              <text x={BAR_X + BAR_W + 10} y={105} fontSize={9} fontWeight={700} fill={e2 <= 0.001 ? WARN : MUTED}>
                {fmt(e2)}
              </text>
              <text x={BAR_X - 10} y={120} textAnchor="end" fontSize={7.5} fill={MUTED}>
                판단의 질 · 어려운 사안
              </text>

              <line x1={BAR_X} y1={14} x2={BAR_X} y2={134} stroke={MUTED} strokeWidth={1} />

              <text x={BAR_X - 10} y={158} textAnchor="end" fontSize={9} fontWeight={700} fill={MUTED}>
                사회가 보는 값
              </text>
              <rect x={BAR_X} y={146} width={(value / 30) * BAR_W} height={14} fill={MUTED} fillOpacity={0.35} stroke={MUTED} strokeWidth={1} />
              <text x={BAR_X + BAR_W + 10} y={157} fontSize={9} fontWeight={700} fill={step === 0 ? OK : WARN}>
                {fmt(value)}
              </text>
              <text x={BAR_X} y={176} fontSize={8} fill={MUTED}>
                잰 쪽 × {V1} + 못 잰 쪽 × {V2}
              </text>
            </svg>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[step]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
