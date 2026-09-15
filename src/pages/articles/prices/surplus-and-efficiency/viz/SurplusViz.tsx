import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: total-surplus 절의 ExplainedFormula — 쌍마다의 차이를 더한 것이 총잉여다 */
const SCENES = [
  "산 쪽이 남긴 것",
  "판 쪽이 남긴 것",
  "쌍으로 보면 값이 지워집니다",
  "네 번째까지가 가장 큽니다",
] as const;

/** 3편과 같은 시장 */
const WTP = [10, 9, 8, 7, 6, 5] as const;
const MC = [4, 5, 6, 7, 8, 9] as const;
const PRICE = 7;

const pairGain = (i: number) => WTP[i] - MC[i];
const cumUpTo = (n: number) =>
  Array.from({ length: n }, (_, i) => pairGain(i)).reduce((a, b) => a + b, 0);

const CS = WTP.filter((w) => w >= PRICE).reduce((a, w) => a + (w - PRICE), 0);
const PS = MC.filter((m) => m <= PRICE).reduce((a, m) => a + (PRICE - m), 0);
const BEST = cumUpTo(4);

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const ROW_X = 110;
const UNIT = 14;
/** 0선 — 양수는 오른쪽, 음수는 왼쪽으로 자란다 */
const ZERO_X = 220;

export default function SurplusViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4000);
  const s = scenes.active;

  const NOTES = [
    `값이 ${PRICE}일 때 낼 수 있었던 금액이 ${WTP[0]}이던 사람은 ${WTP[0] - PRICE}만큼 덜 냈고, ${WTP[1]}이던 사람은 ${WTP[1] - PRICE}만큼 덜 냈습니다. 넷을 더하면 ${CS}입니다. 마지막으로 산 사람은 낼 수 있던 금액이 값과 같아 남는 것이 없습니다.`,
    `파는 쪽도 같습니다. 드는 값이 ${MC[0]}이던 사람은 ${PRICE - MC[0]}만큼 더 받았고 ${MC[1]}이던 사람은 ${PRICE - MC[1]}만큼 더 받았습니다. 합이 ${PS}으로 사는 쪽과 우연히 같습니다. 두 값이 같을 이유는 없고 여기서는 두 줄의 모양이 대칭이라 그렇습니다.`,
    `산 쪽과 판 쪽을 쌍으로 묶으면 값이 상쇄되어 사라집니다. 첫 쌍은 ${WTP[0]}과 ${MC[0]}이라 ${pairGain(0)}, 둘째는 ${pairGain(1)}, 셋째는 ${pairGain(2)}입니다. 값이 얼마든 이 차이는 변하지 않습니다.`,
    `넷째 쌍은 ${WTP[3]}과 ${MC[3]}이라 차이가 ${pairGain(3)}이고, 다섯째는 ${WTP[4]}과 ${MC[4]}이라 ${pairGain(4)}입니다. 누적이 ${cumUpTo(3)}에서 ${cumUpTo(4)}으로 유지되다 ${cumUpTo(5)}으로 내려갑니다. 앞 글의 균형 수량 넷이 바로 이 봉우리입니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="거래가 만든 값을 재는 자"
      title="쌍으로 묶으면 값이 지워지고 차이만 남습니다"
      description="산 쪽이 남긴 것과 판 쪽이 남긴 것을 더하면 값이 상쇄되어, 낼 수 있던 금액과 드는 값의 차이만 남습니다."
      note="앞 글과 같은 시장입니다. 사람마다의 금액을 같은 자로 더할 수 있다고 둔 계산입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="소비자잉여와 생산자잉여, 그리고 쌍별 차이"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(s + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[s]}</h4>

          <div className="mt-4 w-full min-w-0 overflow-x-auto">
            <svg
              viewBox="0 0 480 200"
              role="img"
              aria-label={SCENES[s]}
              className="h-auto w-full min-w-[30rem] max-w-2xl"
            >
              <text x={14} y={20} fontSize={8} fontWeight={700} fill={MUTED}>
                {s < 2 ? `값 ${PRICE}에서` : "쌍마다"}
              </text>
              <line x1={ZERO_X} y1={26} x2={ZERO_X} y2={158} stroke={MUTED} strokeWidth={0.75} strokeOpacity={0.5} />
              <text x={ROW_X} y={20} fontSize={8} fontWeight={700} fill={MUTED}>
                {s === 0
                  ? "낼 수 있던 금액 − 값"
                  : s === 1
                    ? "값 − 드는 값"
                    : "낼 수 있던 금액 − 드는 값"}
              </text>

              {WTP.map((w, i) => {
                const y = 30 + i * 21;
                const m = MC[i];
                const traded = s < 2 ? (s === 0 ? w >= PRICE : m <= PRICE) : true;
                const v = s === 0 ? w - PRICE : s === 1 ? PRICE - m : pairGain(i);
                const label =
                  s === 0
                    ? `${w} − ${PRICE}`
                    : s === 1
                      ? `${PRICE} − ${m}`
                      : `${w} − ${m}`;
                const positive = v > 0;
                const dim = s < 2 && !traded;
                const color = dim ? MUTED : positive ? OK : v === 0 ? MUTED : WARN;
                return (
                  <g key={i} opacity={dim ? 0.3 : 1}>
                    <text x={14} y={y + 11} fontSize={8.5} fill={MUTED}>
                      {i + 1}번째
                    </text>
                    <text x={ROW_X} y={y + 11} fontSize={8.5} fill={MUTED}>
                      {label}
                    </text>
                    <rect
                      x={v < 0 ? ZERO_X - Math.abs(v) * UNIT : ZERO_X}
                      y={y}
                      width={Math.max(Math.abs(v) * UNIT, 1)}
                      height={13}
                      fill={color}
                      fillOpacity={0.35}
                      stroke={color}
                      strokeWidth={1}
                    />
                    <text
                      x={v < 0 ? ZERO_X - Math.abs(v) * UNIT - 6 : ZERO_X + v * UNIT + 6}
                      y={y + 11}
                      textAnchor={v < 0 ? "end" : "start"}
                      fontSize={9.5}
                      fontWeight={700}
                      fill={color}
                    >
                      {v > 0 ? "+" : ""}
                      {v}
                    </text>
                    {s === 3 && (
                      <text
                        x={340}
                        y={y + 11}
                        fontSize={9}
                        fontWeight={700}
                        fill={i === 3 ? ACCENT : MUTED}
                      >
                        누적 {cumUpTo(i + 1)}
                        {i === 3 ? " ←" : ""}
                      </text>
                    )}
                  </g>
                );
              })}

              <line x1={14} y1={162} x2={456} y2={162} stroke={MUTED} strokeWidth={0.75} strokeOpacity={0.4} />
              <text x={14} y={180} fontSize={9} fontWeight={700} fill={MUTED}>
                {s === 0
                  ? `산 쪽이 남긴 것 ${CS}`
                  : s === 1
                    ? `판 쪽이 남긴 것 ${PS} · 둘을 더하면 ${CS + PS}`
                    : s === 2
                      ? `쌍의 차이에는 값 ${PRICE}이 들어 있지 않습니다`
                      : `가장 큰 누적은 ${BEST}이고 네 번째 쌍까지입니다`}
              </text>
              <text x={14} y={195} fontSize={9} fill={MUTED}>
                {s === 3
                  ? "다섯째부터는 드는 값이 낼 수 있던 금액보다 커서 만들수록 줄어듭니다"
                  : s === 2
                    ? "그래서 누가 얼마를 가져갔는지와 전체가 얼마인지는 다른 질문입니다"
                    : "값보다 더 낼 수 있었던 만큼, 값보다 덜 들었던 만큼입니다"}
              </text>
            </svg>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[s]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
