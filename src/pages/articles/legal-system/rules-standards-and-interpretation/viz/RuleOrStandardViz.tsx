import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: cost-comparison 의 ExplainedFormula — 사안 수가 어느 쪽을 싸게 만드는가 */
const SCENES = [
  "사안이 적으면 기준이 싸다",
  "어느 지점에서 뒤집힌다",
  "사안이 많으면 규칙이 압도한다",
  "오분류 손해가 크면 문턱이 밀린다",
] as const;

/** 제정 비용(한 번), 사안당 판단 비용, 사안당 기대 오분류 손해 */
const C_RULE = 1000;
const C_STANDARD = 12;
const MISS_LOW = 2;
const MISS_HIGH = 8;

const CASES = [20, 100, 500] as const;
/** 마지막 장면은 같은 사안 수에서 오분류 손해만 키워 뒤집히는 것을 보인다 */
const N_FLIP = 200;

const ACCENT = "#6366f1";
const OK = "#10b981";
const WARN = "#ef4444";
const MUTED = "#94a3b8";

const ruleCost = (n: number, miss: number) => C_RULE + n * miss;
const standardCost = (n: number) => n * C_STANDARD;
/** 두 총비용이 같아지는 사안 수 */
const breakEven = (miss: number) => C_RULE / (C_STANDARD - miss);

const fmt = (v: number) =>
  Math.abs(v - Math.round(v)) < 1e-9 ? `${Math.round(v)}` : v.toFixed(1);

const BAR_X = 138;
const BAR_W = 250;
const MAX = 6200;

export default function RuleOrStandardViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const step = scenes.active;
  const miss = step === 3 ? MISS_HIGH : MISS_LOW;
  const n = step === 3 ? N_FLIP : CASES[step];
  const rule = ruleCost(n, miss);
  const standard = standardCost(n);
  const cross = breakEven(miss);

  const NOTES = [
    `사안이 한 해 ${n}건이면 규칙을 만드는 데 ${C_RULE}이 들고 그 뒤로 사안마다 ${miss}씩 오분류 손해가 붙어 합계 ${fmt(rule)}입니다. 기준은 사안마다 ${C_STANDARD}씩만 들어 ${fmt(standard)}이라 더 쌉니다.`,
    `사안이 ${n}건이면 두 값이 ${fmt(rule)}으로 정확히 같아집니다. 제정 비용을 사안 수로 나눈 값이 사안당 절약분과 맞아떨어지는 지점이고, 계산하면 ${fmt(cross)}건입니다.`,
    `사안이 ${n}건이 되면 규칙 ${fmt(rule)} 대 기준 ${fmt(standard)}으로 격차가 벌어집니다. 제정 비용은 한 번뿐인데 판단 비용은 사안마다 붙기 때문입니다.`,
    `사안이 ${n}건이면 오분류 손해가 ${MISS_LOW}일 때는 규칙이 ${fmt(ruleCost(n, MISS_LOW))}으로 기준 ${fmt(standard)}보다 쌉니다. 그런데 손해를 ${miss}로 올리면 규칙이 ${fmt(rule)}이 되어 뒤집힙니다. 문턱이 ${fmt(breakEven(MISS_LOW))}건에서 ${fmt(cross)}건으로 밀렸기 때문입니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="규칙과 기준"
      title="어느 쪽이 싼지는 사안이 몇 건이냐가 정합니다"
      description="미리 정해 두는 비용은 한 번이고, 사안마다 판단하는 비용은 건수만큼 붙습니다."
      note={`제정 비용 ${C_RULE}, 사안당 판단 비용 ${C_STANDARD}, 사안당 기대 오분류 손해 ${MISS_LOW}으로 둔 예입니다. 단위는 서로 비교하기 위한 것이며 실제 금액이 아닙니다.`}
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="사안 수에 따른 규칙과 기준의 총비용"
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
              <text x={BAR_X - 10} y={34} textAnchor="end" fontSize={9} fontWeight={700} fill={MUTED}>
                한 해 사안 수
              </text>
              <text x={BAR_X} y={34} fontSize={11} fontWeight={700} fill={ACCENT}>
                {n}건
              </text>
              <text x={BAR_X + 60} y={34} fontSize={9} fill={MUTED}>
                사안당 오분류 손해 {miss}
              </text>

              <text x={BAR_X - 10} y={72} textAnchor="end" fontSize={9} fontWeight={700} fill={rule < standard ? OK : WARN}>
                규칙으로 두면
              </text>
              <rect x={BAR_X} y={60} width={Math.max((rule / MAX) * BAR_W, 1)} height={16} fill={rule < standard ? OK : WARN} fillOpacity={0.45} stroke={rule < standard ? OK : WARN} strokeWidth={1} />
              <text x={BAR_X + Math.max((rule / MAX) * BAR_W, 1) + 8} y={72} fontSize={9.5} fontWeight={700} fill={rule < standard ? OK : WARN}>
                {fmt(rule)}
              </text>
              <text x={BAR_X - 10} y={86} textAnchor="end" fontSize={7.5} fill={MUTED}>
                제정 {C_RULE} + {n}×{miss}
              </text>

              <text x={BAR_X - 10} y={116} textAnchor="end" fontSize={9} fontWeight={700} fill={standard < rule ? OK : WARN}>
                기준으로 두면
              </text>
              <rect x={BAR_X} y={104} width={Math.max((standard / MAX) * BAR_W, 1)} height={16} fill={standard < rule ? OK : WARN} fillOpacity={0.45} stroke={standard < rule ? OK : WARN} strokeWidth={1} />
              <text x={BAR_X + Math.max((standard / MAX) * BAR_W, 1) + 8} y={116} fontSize={9.5} fontWeight={700} fill={standard < rule ? OK : WARN}>
                {fmt(standard)}
              </text>
              <text x={BAR_X - 10} y={130} textAnchor="end" fontSize={7.5} fill={MUTED}>
                {n}×{C_STANDARD}
              </text>

              <line x1={BAR_X} y1={54} x2={BAR_X} y2={134} stroke={MUTED} strokeWidth={1} />

              <text x={BAR_X - 10} y={160} textAnchor="end" fontSize={9} fontWeight={700} fill={MUTED}>
                뒤집히는 문턱
              </text>
              <text x={BAR_X} y={160} fontSize={9.5} fontWeight={700} fill={ACCENT}>
                {fmt(cross)}건
              </text>
              <text x={BAR_X + 70} y={160} fontSize={9} fill={MUTED}>
                제정 비용 ÷ (판단 비용 − 오분류 손해)
              </text>
              <text x={BAR_X - 10} y={182} textAnchor="end" fontSize={9} fontWeight={700} fill={rule < standard ? OK : WARN}>
                판정
              </text>
              <text x={BAR_X} y={182} fontSize={9.5} fontWeight={700} fill={rule < standard ? OK : WARN}>
                {rule < standard
                  ? "미리 적어 두는 쪽이 쌉니다"
                  : rule === standard
                    ? "두 방식의 비용이 같습니다"
                    : "사안마다 판단하는 쪽이 쌉니다"}
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
