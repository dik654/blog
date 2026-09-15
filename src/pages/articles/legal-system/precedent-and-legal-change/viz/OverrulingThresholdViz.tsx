import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: when-to-overrule 의 ExplainedFormula — 남은 기간과 신뢰 이익의 비교 */
const SCENES = [
  "남은 기간이 짧으면 두는 편이 낫다",
  "길어져도 아직 모자란다",
  "충분히 길어지면 뒤집는다",
  "신뢰 이익이 작으면 같은 기간에도 뒤집는다",
] as const;

/** 사건당 개선, 신뢰 이익 손실, 안정성 훼손 */
const DELTA_GAIN = 3;
const RELIANCE_HIGH = 40;
const RELIANCE_LOW = 10;
const STABILITY = 20;

const SETUP: Array<{ d: number; reliance: number }> = [
  { d: 0.9, reliance: RELIANCE_HIGH },
  { d: 0.95, reliance: RELIANCE_HIGH },
  { d: 0.97, reliance: RELIANCE_HIGH },
  { d: 0.95, reliance: RELIANCE_LOW },
];

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const futureGain = (d: number) => (d / (1 - d)) * DELTA_GAIN;
const cost = (reliance: number) => reliance + STABILITY;

const fmt = (v: number) =>
  Math.abs(v - Math.round(v)) < 1e-9 ? `${Math.round(v)}` : v.toFixed(1);

const BAR_X = 148;
const BAR_W = 240;
const MAX = 110;

export default function OverrulingThresholdViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const step = scenes.active;
  const { d, reliance } = SETUP[step];
  const gain = futureGain(d);
  const loss = cost(reliance);
  const overrule = gain > loss;

  const NOTES = [
    `다음에 같은 문제가 또 올 몫을 ${d}로 두면 앞으로 얻을 개선의 합이 ${fmt(gain)}입니다. 뒤집을 때 치르는 값은 신뢰 이익 ${reliance}과 안정성 ${STABILITY}을 더해 ${fmt(loss)}이라 두는 편이 낫습니다.`,
    `몫을 ${d}로 올리면 앞으로 얻을 개선이 ${fmt(gain)}까지 커집니다. 그래도 ${fmt(loss)}에는 모자라 아직 뒤집을 때가 아닙니다. 경계가 가까워졌다는 것은 보입니다.`,
    `몫이 ${d}이면 개선의 합이 ${fmt(gain)}이 되어 ${fmt(loss)}을 넘습니다. 같은 규칙, 같은 개선 폭인데 남은 기간이 길다는 이유만으로 판정이 바뀝니다.`,
    `몫을 다시 ${d}로 되돌려도, 그 규칙에 맞춰 해 둔 것이 적어 신뢰 이익이 ${reliance}뿐이면 치르는 값이 ${fmt(loss)}으로 내려가 ${fmt(gain)}이 이를 넘습니다. 재산과 계약에서 변경이 드물고 절차에서 상대적으로 잦은 이유입니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="선례 변경"
      title="뒤집을지는 앞으로 얻을 것과 이미 쌓인 것을 견줘 정합니다"
      description="개선은 앞으로 계속 쌓이고, 신뢰 이익은 이미 쌓여 있습니다."
      note={`사건당 개선 ${DELTA_GAIN}, 안정성 훼손 ${STABILITY}으로 두고 신뢰 이익만 바꾼 예입니다. 단위는 서로 비교하기 위한 것이며 실제 금액이 아닙니다.`}
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="선례를 뒤집는 조건"
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
                또 올 몫
              </text>
              <rect x={BAR_X} y={20} width={d * BAR_W} height={14} fill={ACCENT} fillOpacity={0.25} stroke={ACCENT} strokeWidth={1} />
              <text x={BAR_X + BAR_W + 10} y={32} fontSize={9} fontWeight={700} fill={ACCENT}>
                {d}
              </text>

              <text x={BAR_X - 10} y={70} textAnchor="end" fontSize={9} fontWeight={700} fill={overrule ? OK : MUTED}>
                앞으로 얻을 개선
              </text>
              <rect x={BAR_X} y={58} width={Math.max((gain / MAX) * BAR_W, 1)} height={16} fill={OK} fillOpacity={0.45} stroke={OK} strokeWidth={1} />
              <text x={BAR_X + Math.max((gain / MAX) * BAR_W, 1) + 8} y={70} fontSize={9.5} fontWeight={700} fill={OK}>
                {fmt(gain)}
              </text>
              <text x={BAR_X - 10} y={84} textAnchor="end" fontSize={7.5} fill={MUTED}>
                {d} ÷ (1 − {d}) × {DELTA_GAIN}
              </text>

              <text x={BAR_X - 10} y={114} textAnchor="end" fontSize={9} fontWeight={700} fill={overrule ? MUTED : WARN}>
                뒤집을 때 치르는 값
              </text>
              <rect x={BAR_X} y={102} width={Math.max((loss / MAX) * BAR_W, 1)} height={16} fill={WARN} fillOpacity={0.45} stroke={WARN} strokeWidth={1} />
              <text x={BAR_X + Math.max((loss / MAX) * BAR_W, 1) + 8} y={114} fontSize={9.5} fontWeight={700} fill={WARN}>
                {fmt(loss)}
              </text>
              <text x={BAR_X - 10} y={128} textAnchor="end" fontSize={7.5} fill={MUTED}>
                신뢰 {reliance} + 안정성 {STABILITY}
              </text>

              <line x1={BAR_X} y1={52} x2={BAR_X} y2={132} stroke={MUTED} strokeWidth={1} />

              <text x={BAR_X - 10} y={162} textAnchor="end" fontSize={9} fontWeight={700} fill={overrule ? OK : WARN}>
                판정
              </text>
              <text x={BAR_X} y={162} fontSize={10} fontWeight={700} fill={overrule ? OK : WARN}>
                {overrule ? "뒤집는 쪽이 낫습니다" : "그대로 두는 쪽이 낫습니다"}
              </text>
              <text x={BAR_X} y={182} fontSize={9} fill={MUTED}>
                {overrule
                  ? "앞으로 쌓일 개선이 이미 쌓인 것을 넘었습니다"
                  : "이미 쌓인 것이 앞으로 쌓일 개선보다 큽니다"}
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
