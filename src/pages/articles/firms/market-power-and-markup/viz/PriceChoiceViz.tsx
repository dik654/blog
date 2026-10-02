import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: facing-demand·marginal-revenue 절 — 하나 더 팔면 팔던 것의 값도 내려간다 */
const SCENES = [
  "값을 고르면 수량이 따라옵니다",
  "받는 돈은 값과 수량이 만드는 넓이입니다",
  "더해지는 몫과 깎이는 몫이 함께 생깁니다",
  "그래서 늘어나는 돈은 값보다 낮습니다",
] as const;

/** 1단계에서 쓰던 수요: 값 = 13 − 수량. 균형값 7에서 수량 6이 나옵니다. */
const A = 13;
const P_HI = 10;
const Q_HI = A - P_HI;
const P_LO = 9;
const Q_LO = A - P_LO;

const DEMAND = "#6366f1";
const MR = "#ef4444";
const ADD = "#0ea5e9";
const CUT = "#ef4444";
const MUTED = "#94a3b8";
const INK = "#334155";

const Q_MAX = 13;
const P_MAX = 14;
const X0 = 70;
const X1 = 320;
const Y0 = 158;
const Y1 = 26;

const xOf = (q: number) => X0 + (q / Q_MAX) * (X1 - X0);
const yOf = (p: number) => Y0 - (p / P_MAX) * (Y0 - Y1);

export default function PriceChoiceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4800);
  const s = scenes.active;

  const NOTES = [
    `파는 쪽이 하나뿐이면 값을 받아들이는 것이 아니라 고르게 됩니다. 다만 고를 수 있는 것은 값 하나뿐이고 수량은 따라옵니다. ${P_HI}을 부르면 ${Q_HI}개가 팔리고, ${P_LO}으로 내리면 ${Q_LO}개가 팔립니다.`,
    `받는 돈은 값에 수량을 곱한 넓이입니다. ${P_HI} × ${Q_HI} = ${P_HI * Q_HI}이고 ${P_LO} × ${Q_LO} = ${P_LO * Q_LO}입니다. 값을 내렸는데 받는 돈은 늘었습니다. 그렇다고 계속 내리는 것이 답은 아닙니다.`,
    `값을 ${P_HI}에서 ${P_LO}으로 내려 하나를 더 팔 때 두 가지가 같이 일어납니다. 새 손님에게서 ${P_LO}을 더 받고(파란 칸), 원래 ${P_HI}에 사던 ${Q_HI}명에게서 하나당 1씩 덜 받습니다(빨간 칸). 늘어난 돈은 ${P_LO} − ${Q_HI} = ${P_LO - Q_HI}입니다.`,
    `그래서 하나 더 팔 때 늘어나는 돈은 그 값보다 늘 낮습니다. 깎이는 몫이 빠지기 때문입니다. 아래 빨간 선이 그 늘어나는 돈이고, 수요 선보다 두 배 빠르게 내려갑니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="값을 고르는 쪽"
      title="하나 더 팔려면 이미 팔던 것의 값도 함께 내려야 합니다"
      description="그래서 하나 더 팔 때 늘어나는 돈은 그때 받는 값보다 낮고, 멈추는 자리가 값이 아니라 그 늘어나는 돈으로 정해집니다."
      note="1단계에서 쓰던 직선 수요를 그대로 가져왔습니다. 숫자는 관계를 보이기 위한 것입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="값을 내려 하나 더 팔 때 더해지는 몫과 깎이는 몫"
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
              {/* 받는 돈의 넓이 */}
              {s === 1 && (
                <g>
                  <rect
                    x={X0}
                    y={yOf(P_LO)}
                    width={xOf(Q_LO) - X0}
                    height={Y0 - yOf(P_LO)}
                    fill={DEMAND}
                    opacity={0.14}
                  />
                  <text x={xOf(Q_LO / 2)} y={yOf(P_LO / 2)} fontSize={8.5} fontWeight={700} fill={DEMAND} textAnchor="middle">
                    {P_LO} × {Q_LO} = {P_LO * Q_LO}
                  </text>
                </g>
              )}

              {/* 더해지는 몫과 깎이는 몫 */}
              {s === 2 && (
                <g>
                  <rect
                    x={xOf(Q_HI)}
                    y={yOf(P_LO)}
                    width={xOf(Q_LO) - xOf(Q_HI)}
                    height={Y0 - yOf(P_LO)}
                    fill={ADD}
                    opacity={0.3}
                    stroke={ADD}
                    strokeWidth={1}
                  />
                  <rect
                    x={X0}
                    y={yOf(P_HI)}
                    width={xOf(Q_HI) - X0}
                    height={yOf(P_LO) - yOf(P_HI)}
                    fill={CUT}
                    opacity={0.3}
                    stroke={CUT}
                    strokeWidth={1}
                  />
                  <text x={xOf(Q_HI) + 14} y={Y0 - 8} fontSize={8} fontWeight={700} fill={ADD}>
                    +{P_LO}
                  </text>
                  <text x={X0 + 8} y={yOf(P_HI) - 4} fontSize={8} fontWeight={700} fill={CUT}>
                    −{Q_HI}
                  </text>
                </g>
              )}

              {/* 축 */}
              <line x1={X0} y1={Y0} x2={X1 + 12} y2={Y0} stroke={MUTED} strokeWidth={0.75} />
              <line x1={X0} y1={Y0} x2={X0} y2={Y1 - 6} stroke={MUTED} strokeWidth={0.75} />
              <text x={X0 - 6} y={Y1 - 10} fontSize={8} fontWeight={700} fill={MUTED}>
                값
              </text>
              <text x={X1 + 12} y={Y0 + 14} fontSize={8} fontWeight={700} fill={MUTED} textAnchor="end">
                수량
              </text>

              {/* 수요 */}
              <line x1={xOf(0)} y1={yOf(A)} x2={xOf(A)} y2={yOf(0)} stroke={DEMAND} strokeWidth={1.25} />
              <text x={xOf(10.5)} y={yOf(A - 10.5) - 5} fontSize={8} fontWeight={700} fill={DEMAND}>
                수요
              </text>

              {/* 늘어나는 돈 */}
              {s === 3 && (
                <g>
                  <line x1={xOf(0)} y1={yOf(A)} x2={xOf(A / 2)} y2={yOf(0)} stroke={MR} strokeWidth={1.25} />
                  <text x={xOf(A / 2) + 4} y={yOf(0) + 12} fontSize={8} fontWeight={700} fill={MR}>
                    늘어나는 돈
                  </text>
                </g>
              )}

              {/* 두 점 */}
              {[
                { p: P_HI, q: Q_HI, dy: -7 },
                { p: P_LO, q: Q_LO, dy: 13 },
              ].map((pt) => (
                <g key={pt.p}>
                  <circle cx={xOf(pt.q)} cy={yOf(pt.p)} r={3} fill={DEMAND} />
                  <text x={xOf(pt.q) + 6} y={yOf(pt.p) + pt.dy} fontSize={8} fill={INK}>
                    값 {pt.p} · {pt.q}개
                  </text>
                </g>
              ))}

              {/* 오른쪽 셈 */}
              <text x={352} y={44} fontSize={8} fontWeight={700} fill={MUTED}>
                값을 1 내릴 때
              </text>
              <text x={352} y={64} fontSize={8.5} fill={s === 2 ? ADD : MUTED}>
                더 받는 몫 +{P_LO}
              </text>
              <text x={352} y={80} fontSize={8.5} fill={s === 2 ? CUT : MUTED}>
                깎이는 몫 −{Q_HI}
              </text>
              <text x={352} y={102} fontSize={14} fontWeight={700} fill={s >= 2 ? MR : MUTED}>
                {s >= 2 ? P_LO - Q_HI : "?"}
              </text>
              <text x={352} y={118} fontSize={8} fill={MUTED}>
                {s >= 2 ? "늘어나는 돈" : "아직 세지 않았습니다"}
              </text>
              {s >= 3 && (
                <text x={352} y={138} fontSize={8} fontWeight={700} fill={MR}>
                  값 {P_LO}보다 낮습니다
                </text>
              )}

              <text x={14} y={186} fontSize={8.5} fontWeight={700} fill={INK}>
                {s === 0
                  ? "고르는 것은 값 하나뿐이고 수량은 따라옵니다"
                  : s === 1
                    ? `값을 내렸는데 받는 돈은 ${P_HI * Q_HI}에서 ${P_LO * Q_LO}로 늘었습니다`
                    : s === 2
                      ? `새로 받는 ${P_LO}에서 이미 팔던 ${Q_HI}개의 깎인 몫을 뺍니다`
                      : "늘어나는 돈은 수요 선보다 두 배 빠르게 내려갑니다"}
              </text>
              <text x={14} y={196} fontSize={7.5} fill={MUTED}>
                깎이는 몫은 이미 팔던 수량이 많을수록 커집니다
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
