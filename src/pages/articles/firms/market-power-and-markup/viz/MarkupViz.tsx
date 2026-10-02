import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: stopping-point·markup-size·what-is-lost 절 */
const SCENES = [
  "값은 한계비용에서 멈췄습니다",
  "혼자 팔면 늘어나는 돈으로 멈춥니다",
  "틈과 함께 사라지는 몫이 생깁니다",
  "수요가 둔하면 값이 더 높습니다",
] as const;

/** 민감한 수요: 값 = 13 − 수량 / 둔한 수요: 값 = 19 − 2×수량. 둘 다 (6, 7)을 지납니다. */
const MC = 7;
const CURVES = [
  { a: 13, b: 1, label: "민감한 수요" },
  { a: 19, b: 2, label: "둔한 수요" },
] as const;

const qAt = (a: number, b: number, p: number) => (a - p) / b;
/** 늘어나는 돈이 한계비용과 같아지는 수량 */
const qStop = (a: number, b: number) => (a - MC) / (2 * b);
const pOf = (a: number, b: number, q: number) => a - b * q;

const Q_FREE = qAt(CURVES[0].a, CURVES[0].b, MC);
const Q_ONE = qStop(CURVES[0].a, CURVES[0].b);
const P_ONE = pOf(CURVES[0].a, CURVES[0].b, Q_ONE);
const GAP = Math.round(((P_ONE - MC) / P_ONE) * 100);
const LOST = ((P_ONE - MC) * (Q_FREE - Q_ONE)) / 2;

const P_ONE_B = pOf(CURVES[1].a, CURVES[1].b, qStop(CURVES[1].a, CURVES[1].b));
const GAP_B = Math.round(((P_ONE_B - MC) / P_ONE_B) * 100);

const DEMAND = "#6366f1";
const MR_COLOR = "#ef4444";
const COST = "#0ea5e9";
const LOSS = "#ef4444";
const MUTED = "#94a3b8";
const INK = "#334155";

const Q_MAX = 13;
const P_MAX = 20;
const X0 = 70;
const X1 = 300;
const Y0 = 158;
const Y1 = 24;

const xOf = (q: number) => X0 + (q / Q_MAX) * (X1 - X0);
const yOf = (p: number) => Y0 - (p / P_MAX) * (Y0 - Y1);

export default function MarkupViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5000);
  const s = scenes.active;

  const c = s === 3 ? CURVES[1] : CURVES[0];
  const qs = qStop(c.a, c.b);
  const ps = pOf(c.a, c.b, qs);
  const gap = Math.round(((ps - MC) / ps) * 100);

  const NOTES = [
    `1단계에서는 아무도 값을 고르지 않았습니다. 사려는 쪽과 팔려는 쪽이 만난 자리가 값이었고, 거기서 값은 하나를 더 만드는 데 드는 값과 같았습니다 — 수량 ${Q_FREE}, 값 ${MC}.`,
    `혼자 팔면 기준이 값이 아니라 늘어나는 돈입니다. 그 돈이 ${MC}과 같아지는 수량 ${Q_ONE}에서 멈추고, 값은 거기서 수요 선을 올려다봐 ${P_ONE}으로 읽습니다.`,
    `값 ${P_ONE}과 한계비용 ${MC} 사이가 틈입니다. 그런데 수량도 ${Q_FREE}에서 ${Q_ONE}으로 줄어, 값보다 더 쳐주었을 거래 ${Q_FREE - Q_ONE}개가 아예 사라집니다. 빨간 삼각형 ${LOST}가 누구에게도 가지 않은 몫입니다.`,
    `수요를 둔한 쪽으로 바꿔도 멈추는 수량은 같습니다. 그런데 값은 ${P_ONE}이 아니라 ${P_ONE_B}이고 틈은 ${GAP}%에서 ${GAP_B}%로 벌어집니다. 틈을 정하는 것은 크기도 비용도 아닌 수요의 민감도입니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="멈추는 자리"
      title="값은 늘어나는 돈이 한계비용과 같아지는 수량에서 멈추고, 그 위 수요 선에서 읽힙니다"
      description="벌어진 틈의 크기는 수요가 값에 얼마나 민감한지로 정해지고, 틈과 함께 누구에게도 가지 않는 몫이 생깁니다."
      note="두 수요 모두 1단계의 균형점을 지나도록 맞췄습니다. 숫자는 관계를 보이기 위한 것입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="혼자 팔 때 멈추는 수량과 값, 그리고 사라지는 몫"
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
              {/* 사라지는 몫 */}
              {s === 2 && (
                <polygon
                  points={`${xOf(Q_ONE)},${yOf(P_ONE)} ${xOf(Q_FREE)},${yOf(MC)} ${xOf(Q_ONE)},${yOf(MC)}`}
                  fill={LOSS}
                  opacity={0.25}
                  stroke={LOSS}
                  strokeWidth={1}
                />
              )}

              {/* 축 */}
              <line x1={X0} y1={Y0} x2={X1 + 12} y2={Y0} stroke={MUTED} strokeWidth={0.75} />
              <line x1={X0} y1={Y0} x2={X0} y2={Y1 - 4} stroke={MUTED} strokeWidth={0.75} />
              <text x={X0 - 6} y={Y1 - 8} fontSize={8} fontWeight={700} fill={MUTED}>
                값
              </text>
              <text x={X1 + 12} y={Y0 + 14} fontSize={8} fontWeight={700} fill={MUTED} textAnchor="end">
                수량
              </text>

              {/* 한계비용 */}
              <line x1={X0} y1={yOf(MC)} x2={X1 + 6} y2={yOf(MC)} stroke={COST} strokeWidth={1.25} strokeDasharray="5 3" />
              <text x={X0 - 6} y={yOf(MC) + 3} fontSize={8} fontWeight={700} fill={COST} textAnchor="end">
                한계비용 {MC}
              </text>

              {/* 수요와 늘어나는 돈 */}
              <line x1={xOf(0)} y1={yOf(c.a)} x2={xOf(c.a / c.b)} y2={yOf(0)} stroke={DEMAND} strokeWidth={1.25} />
              <text x={xOf(1.4)} y={yOf(c.a - c.b * 1.4) - 5} fontSize={8} fontWeight={700} fill={DEMAND}>
                {c.label}
              </text>
              {s >= 1 && (
                <g>
                  <line x1={xOf(0)} y1={yOf(c.a)} x2={xOf(c.a / (2 * c.b))} y2={yOf(0)} stroke={MR_COLOR} strokeWidth={1.25} />
                  <text x={xOf(c.a / (2 * c.b)) + 3} y={yOf(0) + 12} fontSize={8} fontWeight={700} fill={MR_COLOR}>
                    늘어나는 돈
                  </text>
                </g>
              )}

              {/* 1단계의 자리 */}
              <circle cx={xOf(Q_FREE)} cy={yOf(MC)} r={3} fill={COST} />
              {s === 0 && (
                <text x={xOf(Q_FREE) + 6} y={yOf(MC) + 14} fontSize={8} fontWeight={700} fill={COST}>
                  수량 {Q_FREE} · 값 {MC}
                </text>
              )}

              {/* 멈추는 자리 */}
              {s >= 1 && (
                <g>
                  <line x1={xOf(qs)} y1={yOf(ps)} x2={xOf(qs)} y2={Y0} stroke={INK} strokeWidth={1} strokeDasharray="3 2" />
                  <line x1={X0} y1={yOf(ps)} x2={xOf(qs)} y2={yOf(ps)} stroke={INK} strokeWidth={1} strokeDasharray="3 2" />
                  <circle cx={xOf(qs)} cy={yOf(ps)} r={3.5} fill={DEMAND} />
                  <circle cx={xOf(qs)} cy={yOf(MC)} r={2.5} fill={MR_COLOR} />
                  <text x={xOf(qs)} y={Y0 + 14} fontSize={8} fontWeight={700} fill={INK} textAnchor="middle">
                    수량 {qs}
                  </text>
                  <text x={X0 - 6} y={yOf(ps) + 3} fontSize={8} fontWeight={700} fill={DEMAND} textAnchor="end">
                    값 {ps}
                  </text>
                </g>
              )}

              {/* 오른쪽 셈 */}
              <text x={348} y={42} fontSize={8} fontWeight={700} fill={MUTED}>
                값과 한계비용의 틈
              </text>
              <text x={348} y={66} fontSize={16} fontWeight={700} fill={s >= 1 ? DEMAND : MUTED}>
                {s >= 1 ? `${gap}%` : "0%"}
              </text>
              <text x={348} y={82} fontSize={8} fill={MUTED}>
                {s >= 1 ? `(${ps} − ${MC}) ÷ ${ps}` : "값이 한계비용과 같습니다"}
              </text>
              <text x={348} y={106} fontSize={8} fontWeight={700} fill={MUTED}>
                사라지는 몫
              </text>
              <text x={348} y={126} fontSize={14} fontWeight={700} fill={s === 2 ? LOSS : MUTED}>
                {s === 2 ? LOST : s >= 1 ? "·" : "0"}
              </text>
              {s === 3 && (
                <text x={348} y={148} fontSize={8} fontWeight={700} fill={INK}>
                  {GAP}% → {GAP_B}%
                </text>
              )}

              <text x={14} y={186} fontSize={8.5} fontWeight={700} fill={INK}>
                {s === 0
                  ? `아무도 고르지 않은 값 ${MC}에서 수량 ${Q_FREE}`
                  : s === 1
                    ? `늘어나는 돈이 ${MC}과 같아지는 수량 ${Q_ONE}에서 멈춥니다`
                    : s === 2
                      ? `일어나지 않은 거래 ${Q_FREE - Q_ONE}개 · 사라진 몫 ${LOST}`
                      : `멈추는 수량은 같은데 값은 ${P_ONE} 대신 ${P_ONE_B}입니다`}
              </text>
              <text x={14} y={196} fontSize={7.5} fill={MUTED}>
                값은 고르는 것이지만 그 값이 어디에 멈출지는 수요가 정합니다
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
