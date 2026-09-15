import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: pooling·unravelling 절 — 구별할 수 없으면 좋은 것부터 빠져나간다 */
const SCENES = [
  "여섯 대 모두 거래되는 것이 맞습니다",
  "산 쪽은 어느 차인지 모릅니다",
  "값마다 나오는 차의 평균을 따져 봅니다",
  "값 6에서 멈추고 세 대가 사라집니다",
] as const;

/** 판 쪽이 그 차를 갖고 있을 때의 값 */
const SELL = [2, 4, 6, 8, 10, 12] as const;
/** 산 쪽은 같은 차를 판 쪽의 몇 배로 치는가 */
const K = 1.5;
const BUY = SELL.map((v) => v * K);

const offered = (p: number) => SELL.filter((v) => v <= p).length;
const avgAt = (p: number) =>
  BUY.slice(0, offered(p)).reduce((a, b) => a + b, 0) / offered(p);
const holds = (p: number) => avgAt(p) >= p;

const P_STAR = SELL.filter(holds).reduce((a, b) => Math.max(a, b), 0);
const Q_TRADED = offered(P_STAR);
const GAIN = SELL.map((v, i) => BUY[i] - v);
const REALIZED = GAIN.slice(0, Q_TRADED).reduce((a, b) => a + b, 0);
const LOST = GAIN.slice(Q_TRADED).reduce((a, b) => a + b, 0);

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const COL = 58;
const X0 = 116;

export default function LemonsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const s = scenes.active;

  const NOTES = [
    `중고차 여섯 대가 있고 판 쪽에게 각각 ${SELL.join(", ")}의 값이 있습니다. 산 쪽은 같은 차를 ${K}배로 쳐서 ${BUY.join(", ")}입니다. 어느 대를 봐도 산 쪽이 더 높게 치므로 여섯 대 모두 거래되는 것이 맞고 합쳐 ${REALIZED + LOST}이 생깁니다.`,
    `그런데 산 쪽은 겉만 보고 어느 대가 어느 대인지 구별하지 못합니다. 알 수 있는 것은 값 하나를 부르면 그 값 아래인 차만 나온다는 것뿐이라, 나온 차들의 평균에 대고 값을 매길 수밖에 없습니다.`,
    `값 ${SELL[0]}이면 한 대만 나와 평균이 ${avgAt(2)}이고, 값 ${SELL[2]}이면 세 대가 나와 평균이 ${avgAt(6)}입니다. 값 ${SELL[3]}이면 네 대가 나오는데 평균이 ${avgAt(8)}이라 값보다 낮습니다. 값을 올릴수록 나쁜 쪽이 섞여 평균이 따라 오르지 못합니다.`,
    `그래서 값이 ${P_STAR}에서 멈추고 ${Q_TRADED}대만 거래됩니다. 남은 세 대는 산 쪽이 ${BUY.slice(Q_TRADED).join(", ")}로 치고 판 쪽이 ${SELL.slice(Q_TRADED).join(", ")}로 치니 전부 거래되는 것이 맞는데, 구별할 방법이 없어 ${LOST}이 사라집니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="한쪽만 알 때"
      title="구별할 수 없으면 값이 평균을 말하고, 평균보다 나은 것이 빠져나갑니다"
      description="산 쪽이 어느 대인지 모르면 나온 차들의 평균에 값을 맞추게 되고, 그 값으로는 좋은 차가 나오지 않습니다."
      note="중고차 여섯 대로 줄인 예입니다. 판 쪽은 자기 차를 정확히 알고 산 쪽은 전혀 모른다고 둔 계산입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="구별할 수 없을 때 값과 거래되는 대수"
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
              <text x={14} y={26} fontSize={8} fontWeight={700} fill={MUTED}>
                {s === 2 ? "부른 값" : "몇째 차"}
              </text>
              {SELL.map((v, i) => (
                <text
                  key={`h${i}`}
                  x={X0 + i * COL}
                  y={26}
                  fontSize={8}
                  fontWeight={700}
                  fill={MUTED}
                >
                  {s === 2 ? v : `${i + 1}대`}
                </text>
              ))}

              {s !== 2 && (
                <>
                  <text x={14} y={50} fontSize={8.5} fontWeight={700} fill={MUTED}>
                    판 쪽에게는
                  </text>
                  {SELL.map((v, i) => (
                    <text
                      key={`s${i}`}
                      x={X0 + i * COL}
                      y={50}
                      fontSize={10}
                      fontWeight={700}
                      fill={s === 3 && i >= Q_TRADED ? WARN : MUTED}
                      fillOpacity={s === 3 && i >= Q_TRADED ? 0.9 : 1}
                    >
                      {v}
                    </text>
                  ))}

                  <text x={14} y={74} fontSize={8.5} fontWeight={700} fill={ACCENT}>
                    산 쪽에게는
                  </text>
                  {BUY.map((v, i) => (
                    <text
                      key={`b${i}`}
                      x={X0 + i * COL}
                      y={74}
                      fontSize={10}
                      fontWeight={700}
                      fill={s === 1 ? MUTED : ACCENT}
                      fillOpacity={s === 1 ? 0.3 : 1}
                    >
                      {s === 1 ? "?" : v}
                    </text>
                  ))}
                </>
              )}

              {s === 2 && (
                <>
                  <text x={14} y={50} fontSize={8.5} fontWeight={700} fill={MUTED}>
                    나오는 차
                  </text>
                  {SELL.map((p, i) => (
                    <text
                      key={`o${i}`}
                      x={X0 + i * COL}
                      y={50}
                      fontSize={10}
                      fontWeight={700}
                      fill={MUTED}
                    >
                      {offered(p)}대
                    </text>
                  ))}

                  <text x={14} y={74} fontSize={8.5} fontWeight={700} fill={ACCENT}>
                    그 차들의 평균
                  </text>
                  {SELL.map((p, i) => (
                    <text
                      key={`a${i}`}
                      x={X0 + i * COL}
                      y={74}
                      fontSize={10}
                      fontWeight={700}
                      fill={holds(p) ? OK : WARN}
                    >
                      {avgAt(p)}
                    </text>
                  ))}
                </>
              )}

              <line
                x1={14}
                y1={86}
                x2={456}
                y2={86}
                stroke={MUTED}
                strokeWidth={0.75}
                strokeOpacity={0.4}
              />

              {s === 0 && (
                <>
                  <text x={14} y={110} fontSize={8.5} fontWeight={700} fill={OK}>
                    거래되면 생기는
                  </text>
                  {GAIN.map((g, i) => (
                    <text
                      key={`g${i}`}
                      x={X0 + i * COL}
                      y={110}
                      fontSize={10.5}
                      fontWeight={700}
                      fill={OK}
                    >
                      +{g}
                    </text>
                  ))}
                  <text x={14} y={134} fontSize={9} fontWeight={700} fill={OK}>
                    어느 대를 봐도 산 쪽이 더 높게 치므로 여섯 대 모두 거래되는 것이 맞습니다
                  </text>
                </>
              )}

              {s === 1 && (
                <>
                  <text x={14} y={110} fontSize={9} fontWeight={700} fill={MUTED}>
                    산 쪽이 알 수 있는 것은 부른 값 아래인 차만 나온다는 것뿐입니다
                  </text>
                  <text x={14} y={134} fontSize={9} fontWeight={700} fill={WARN}>
                    그래서 나온 차들의 평균에 대고 값을 매기게 됩니다
                  </text>
                </>
              )}

              {s === 2 && (
                <>
                  <text x={14} y={110} fontSize={8.5} fontWeight={700} fill={MUTED}>
                    평균이 값 이상인가
                  </text>
                  {SELL.map((p, i) => (
                    <text
                      key={`j${i}`}
                      x={X0 + i * COL}
                      y={110}
                      fontSize={10}
                      fontWeight={700}
                      fill={holds(p) ? OK : WARN}
                    >
                      {holds(p) ? "낸다" : "안 낸다"}
                    </text>
                  ))}
                  <text x={14} y={134} fontSize={9} fontWeight={700} fill={WARN}>
                    값을 올릴수록 나쁜 쪽이 섞여 평균이 값을 따라 오르지 못합니다
                  </text>
                </>
              )}

              {s === 3 && (
                <>
                  <text x={14} y={110} fontSize={8.5} fontWeight={700} fill={MUTED}>
                    어떻게 되나
                  </text>
                  {SELL.map((_, i) => (
                    <text
                      key={`r${i}`}
                      x={X0 + i * COL}
                      y={110}
                      fontSize={9.5}
                      fontWeight={700}
                      fill={i < Q_TRADED ? OK : WARN}
                    >
                      {i < Q_TRADED ? "팔림" : "안 나옴"}
                    </text>
                  ))}
                  <text x={14} y={134} fontSize={9} fontWeight={700} fill={WARN}>
                    값 {P_STAR}에서 멈춰 {Q_TRADED}대만 거래되고 나머지 세 대의 {LOST}이 사라집니다
                  </text>
                </>
              )}

              <text
                x={14}
                y={162}
                fontSize={9}
                fontWeight={700}
                fill={s >= 2 ? WARN : s === 1 ? MUTED : OK}
              >
                {s === 3
                  ? `살린 이득 ${REALIZED} · 사라진 이득 ${LOST} · 원래 있던 이득 ${REALIZED + LOST}`
                  : s === 2
                    ? `평균이 값을 넘는 마지막 자리가 ${P_STAR}입니다`
                    : s === 1
                      ? "판 쪽은 자기 차를 알고 산 쪽은 모릅니다"
                      : `전부 거래되면 ${REALIZED + LOST}이 생깁니다`}
              </text>

              <text x={14} y={186} fontSize={8.5} fill={MUTED}>
                {s === 3
                  ? "사라진 세 대는 나쁜 차가 아니라 좋은 차입니다"
                  : "판 쪽 값이 높은 차일수록 산 쪽에게도 값진 차입니다"}
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
