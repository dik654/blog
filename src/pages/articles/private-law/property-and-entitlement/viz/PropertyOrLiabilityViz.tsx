import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: two-protections 의 ExplainedFormula — 거래비용이 보호 방식을 가른다 */
const SCENES = [
  "상대가 한 명이면 사고팔면 된다",
  "상대가 많아지면 협상이 멈춘다",
  "그때 값을 매겨 옮기는 길이 있다",
  "다만 값을 잘못 매기면 그게 손해다",
] as const;

/** 옮겼을 때의 가치와 지금 주인들의 가치, 그리고 상황별 거래비용·평가오차 */
const SETUP = [
  { label: "이웃 한 명", gain: 60, cost: 10, error: 8 },
  { label: "토지 200필지", gain: 4000, cost: 5000, error: 800 },
  { label: "토지 200필지", gain: 4000, cost: 5000, error: 800 },
  { label: "값을 재기 어려운 경우", gain: 4000, cost: 5000, error: 4600 },
] as const;

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const fmt = (v: number) => v.toLocaleString("ko-KR");

const BAR_X = 152;
const BAR_W = 236;

export default function PropertyOrLiabilityViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const step = scenes.active;
  const { label, gain, cost, error } = SETUP[step];
  const max = Math.max(gain, cost, error) * 1.1;
  const dealHappens = cost < gain;
  const liabilityBetter = !dealHappens && error < gain;

  const NOTES = [
    `옮기면 ${fmt(gain)}만큼 더 값이 나는 자원이 있고 협상에 드는 비용이 ${fmt(cost)}입니다. 이득이 더 크므로 둘이 만나 사고팔면 끝납니다. 동의 없이는 못 가져가게 두는 편이 낫습니다.`,
    `같은 자원이 ${label}로 쪼개져 있으면 협상 비용이 ${fmt(cost)}으로 뜁니다. 한 사람만 버텨도 전체가 무산되므로, 이득 ${fmt(gain)}이 있는데도 거래가 일어나지 않습니다.`,
    `이때 다른 길이 있습니다. 동의를 받는 대신 값을 매겨 옮기고 그 값을 물어 주는 것입니다. 평가 오차 ${fmt(error)}이 이득 ${fmt(gain)}보다 작으면 거래가 막힌 채로 두는 것보다 낫습니다.`,
    `그런데 값을 재기 어려운 자원이면 오차가 ${fmt(error)}까지 커집니다. 이득 ${fmt(gain)}보다 커지므로 값을 매겨 옮기는 길도 손해가 되고, 동의 없이는 못 가져가게 두는 편으로 되돌아갑니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="두 가지 보호"
      title="동의를 받게 할지 값을 매겨 옮기게 할지는 협상 비용이 정합니다"
      description="협상이 될 만하면 동의를 요구하고, 되지 않으면 값을 매기는 쪽이 대안이 됩니다."
      note="가치와 비용을 같은 단위로 어림잡을 수 있다고 둔 비교입니다. 실제로는 세 값 모두 사건 밖에서 관측되지 않습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="협상 비용과 보호 방식의 선택"
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
              <text x={BAR_X - 10} y={30} textAnchor="end" fontSize={9} fontWeight={700} fill={MUTED}>
                상황
              </text>
              <text x={BAR_X} y={30} fontSize={9.5} fontWeight={700} fill={ACCENT}>
                {label}
              </text>

              <text x={BAR_X - 10} y={62} textAnchor="end" fontSize={9} fontWeight={700} fill={OK}>
                옮겨서 느는 값
              </text>
              <rect x={BAR_X} y={50} width={Math.max((gain / max) * BAR_W, 1)} height={16} fill={OK} fillOpacity={0.45} stroke={OK} strokeWidth={1} />
              <text x={BAR_X + Math.max((gain / max) * BAR_W, 1) + 8} y={62} fontSize={9.5} fontWeight={700} fill={OK}>
                {fmt(gain)}
              </text>

              <text x={BAR_X - 10} y={96} textAnchor="end" fontSize={9} fontWeight={700} fill={dealHappens ? MUTED : WARN}>
                협상에 드는 비용
              </text>
              <rect x={BAR_X} y={84} width={Math.max((cost / max) * BAR_W, 1)} height={16} fill={WARN} fillOpacity={0.4} stroke={WARN} strokeWidth={1} />
              <text x={BAR_X + Math.max((cost / max) * BAR_W, 1) + 8} y={96} fontSize={9.5} fontWeight={700} fill={WARN}>
                {fmt(cost)}
              </text>

              {step >= 2 && (
                <g>
                  <text x={BAR_X - 10} y={130} textAnchor="end" fontSize={9} fontWeight={700} fill={liabilityBetter ? OK : WARN}>
                    값을 잘못 매길 손해
                  </text>
                  <rect x={BAR_X} y={118} width={Math.max((error / max) * BAR_W, 1)} height={16} fill={liabilityBetter ? OK : WARN} fillOpacity={0.4} stroke={liabilityBetter ? OK : WARN} strokeWidth={1} />
                  <text x={BAR_X + Math.max((error / max) * BAR_W, 1) + 8} y={130} fontSize={9.5} fontWeight={700} fill={liabilityBetter ? OK : WARN}>
                    {fmt(error)}
                  </text>
                </g>
              )}

              <line x1={BAR_X} y1={44} x2={BAR_X} y2={step >= 2 ? 138 : 104} stroke={MUTED} strokeWidth={1} />

              <text x={BAR_X - 10} y={166} textAnchor="end" fontSize={9} fontWeight={700} fill={MUTED}>
                판정
              </text>
              <text x={BAR_X} y={166} fontSize={10} fontWeight={700} fill={dealHappens || !liabilityBetter ? ACCENT : OK}>
                {dealHappens
                  ? "동의 없이는 못 가져가게 둔다"
                  : liabilityBetter
                    ? "값을 매겨 옮기고 물어 주게 한다"
                    : "동의 없이는 못 가져가게 둔다"}
              </text>
              <text x={BAR_X} y={186} fontSize={9} fill={MUTED}>
                {dealHappens
                  ? "협상 비용이 이득보다 작아 거래가 성사됩니다"
                  : liabilityBetter
                    ? "거래가 막혔고 평가 오차가 이득보다 작습니다"
                    : "거래도 막히고 평가 오차도 이득보다 큽니다"}
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
