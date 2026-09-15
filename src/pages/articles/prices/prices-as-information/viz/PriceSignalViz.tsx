import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: sufficient 절의 ExplainedFormula — 개별 비교의 합이 전체 최적과 같다 */
const SCENES = [
  "재료값이 2씩 올랐습니다",
  "값이 8이 됩니다",
  "8을 못 내는 쪽이 물러납니다",
  "아무도 전체를 계산하지 않았습니다",
] as const;

const WTP = [10, 9, 8, 7, 6, 5] as const;
const MC = [4, 5, 6, 7, 8, 9] as const;
const SHOCK = 2;
const P_BEFORE = 7;
const P_AFTER = 8;

const mcAfter = (i: number) => MC[i] + SHOCK;
const gainAfter = (i: number) => WTP[i] - mcAfter(i);
const cumAfter = (n: number) =>
  Array.from({ length: n }, (_, i) => gainAfter(i)).reduce((a, b) => a + b, 0);

const Q_AFTER = WTP.filter((w) => w >= P_AFTER).length;
const BEST_AFTER = Math.max(
  ...Array.from({ length: WTP.length }, (_, i) => cumAfter(i + 1)),
);

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const COL = 56;
const X0 = 96;

export default function PriceSignalViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const s = scenes.active;
  const price = s === 0 ? P_BEFORE : P_AFTER;

  const NOTES = [
    `파는 쪽 여섯 모두 드는 값이 ${SHOCK}씩 올랐습니다. 사는 쪽은 이 사실을 모릅니다. 재료가 비싸진 것인지 다른 곳에서 더 급하게 쓰게 된 것인지도 알 수 없습니다.`,
    `값이 ${P_BEFORE}에서 ${P_AFTER}로 움직입니다. 앞 글의 조정이 그대로 일어난 것이고, 사는 쪽이 받는 것은 이 숫자 하나뿐입니다.`,
    `${P_AFTER}까지 낼 수 있던 사람까지만 남고 ${WTP[3]}과 ${WTP[4]}과 ${WTP[5]}인 셋이 물러납니다. 각자는 자기 숫자를 ${P_AFTER}과 견주었을 뿐이고 남의 사정은 여전히 모릅니다.`,
    `쌍별 차이가 ${gainAfter(0)}, ${gainAfter(1)}, ${gainAfter(2)}, ${gainAfter(3)}이라 누적의 봉우리가 ${BEST_AFTER}이고 그 자리가 ${Q_AFTER}쌍입니다. 각자의 비교를 더한 수와 같습니다. 전체를 계산한 사람은 아무도 없습니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="값 하나가 전달하는 것"
      title="각자가 자기 숫자와 값을 견준 결과가 전체 최적과 같아집니다"
      description="왜 값이 올랐는지 아무도 모르는 채로, 물러나야 할 사람이 정확히 물러납니다."
      note="파는 쪽 전체에 같은 충격이 온 경우입니다. 한쪽에만 오거나 값이 정수로 떨어지지 않으면 이 그림이 덜 깔끔해집니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="값 변화에 대한 개별 반응과 전체 결과"
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
              <text x={14} y={24} fontSize={8} fontWeight={700} fill={MUTED}>
                드는 값
              </text>
              {MC.map((m, i) => (
                <g key={`m${i}`}>
                  <text x={X0 + i * COL} y={24} fontSize={9} fill={MUTED} textDecoration="line-through">
                    {m}
                  </text>
                  <text x={X0 + i * COL + 16} y={24} fontSize={10} fontWeight={700} fill={WARN}>
                    {mcAfter(i)}
                  </text>
                </g>
              ))}

              <text x={14} y={52} fontSize={8} fontWeight={700} fill={MUTED}>
                낼 수 있는
              </text>
              {WTP.map((w, i) => {
                const stays = s < 2 ? true : w >= price;
                return (
                  <text
                    key={`w${i}`}
                    x={X0 + i * COL}
                    y={52}
                    fontSize={10}
                    fontWeight={700}
                    fill={stays ? ACCENT : MUTED}
                    fillOpacity={stays ? 1 : 0.35}
                  >
                    {w}
                  </text>
                );
              })}
              {s >= 2 &&
                WTP.map((w, i) =>
                  w >= price ? null : (
                    <text key={`x${i}`} x={X0 + i * COL + 18} y={52} fontSize={8} fill={MUTED} fillOpacity={0.6}>
                      물러남
                    </text>
                  ),
                )}

              <line x1={14} y1={64} x2={456} y2={64} stroke={MUTED} strokeWidth={0.75} strokeOpacity={0.4} />

              <text x={14} y={84} fontSize={8.5} fontWeight={700} fill={MUTED}>
                시장 값
              </text>
              <text x={X0} y={84} fontSize={14} fontWeight={700} fill={s === 0 ? MUTED : ACCENT}>
                {price}
              </text>
              {s >= 1 && (
                <text x={X0 + 30} y={84} fontSize={9} fill={MUTED}>
                  {P_BEFORE}에서 올라온 값 · 사는 쪽이 받는 것은 이 숫자 하나뿐
                </text>
              )}

              {s >= 3 && (
                <>
                  <text x={14} y={112} fontSize={8} fontWeight={700} fill={MUTED}>
                    쌍별 차이
                  </text>
                  {WTP.map((_, i) => {
                    const g = gainAfter(i);
                    return (
                      <text
                        key={`g${i}`}
                        x={X0 + i * COL}
                        y={112}
                        fontSize={9.5}
                        fontWeight={700}
                        fill={g > 0 ? OK : g === 0 ? MUTED : WARN}
                      >
                        {g > 0 ? "+" : ""}
                        {g}
                      </text>
                    );
                  })}
                  <text x={14} y={132} fontSize={8} fontWeight={700} fill={MUTED}>
                    누적
                  </text>
                  {WTP.map((_, i) => (
                    <text
                      key={`c${i}`}
                      x={X0 + i * COL}
                      y={132}
                      fontSize={9.5}
                      fontWeight={700}
                      fill={i + 1 === Q_AFTER ? ACCENT : MUTED}
                    >
                      {cumAfter(i + 1)}
                      {i + 1 === Q_AFTER ? " ←" : ""}
                    </text>
                  ))}
                </>
              )}

              <line x1={14} y1={148} x2={456} y2={148} stroke={MUTED} strokeWidth={0.75} strokeOpacity={0.4} />
              <text x={14} y={168} fontSize={9} fontWeight={700} fill={s >= 2 ? OK : MUTED}>
                {s < 2
                  ? "사는 쪽은 드는 값이 바뀐 것을 모릅니다"
                  : `각자의 비교를 더하면 ${Q_AFTER}명이 남습니다`}
              </text>
              <text x={14} y={188} fontSize={9} fontWeight={700} fill={s === 3 ? ACCENT : MUTED}>
                {s === 3
                  ? `누적이 가장 큰 자리도 ${Q_AFTER}쌍이고 그때 ${BEST_AFTER}입니다 · 두 수가 같습니다`
                  : "왜 올랐는지는 아무도 알려 주지 않았습니다"}
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
