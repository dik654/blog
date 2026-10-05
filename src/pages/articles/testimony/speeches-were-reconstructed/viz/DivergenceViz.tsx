import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: why-they-diverge 절 — 같은 일을 본 사람들이 갈리는 두 이유 */
const SCENES = [
  "같은 일을 본 사람이 셋 있습니다",
  "첫째 이유는 기억이 온전하지 않아서입니다",
  "둘째 이유는 한쪽을 편들어서입니다",
  "둘은 섞이는 방식이 다릅니다",
] as const;

const MEM = "#f59e0b";
const BIAS = "#ef4444";
const TRUTH = "#334155";
const MUTED = "#94a3b8";

/** 설명을 위한 그림입니다. 실제 측정값이 아닙니다. */
const TRUE_X = 240;
const MEM_SPREAD = [-46, 12, 38];
const BIAS_SHIFT = [52, 58, 44];

export default function DivergenceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5000);
  const s = scenes.active;

  const NOTES = [
    `같은 사건을 세 사람이 보았습니다. 저자는 같은 일에 대한 목격자들의 말이 서로 맞지 않아 결론을 내는 데 품이 들었다고 적습니다. 그 어긋남의 이유를 두 가지로 적어 두었습니다.`,
    `첫째는 기억이 온전하지 않아서입니다. 세 사람의 말이 참값을 중심으로 이쪽저쪽 흩어집니다. 흩어지는 방향에 규칙이 없으므로, 사람이 늘어나고 그 말을 모으면 가운데로 모여듭니다.`,
    `둘째는 한쪽을 지나치게 편들어서입니다. 이때는 세 사람이 모두 같은 쪽으로 쏠립니다. 방향에 규칙이 있으므로 사람을 아무리 늘려도 가운데로 모이지 않습니다. 더 많은 증언이 더 확실한 오답을 만듭니다.`,
    `그래서 두 어긋남은 다루는 방법이 다릅니다. 흩어지는 쪽은 증언을 모아 줄일 수 있고, 쏠리는 쪽은 모아도 줄지 않아 증언한 사람이 어느 편에 있었는지를 따로 물어야 합니다. 저자가 둘을 나란히 적어 둔 것이 이 차이를 보게 합니다.`,
  ] as const;

  const points = s === 1 ? MEM_SPREAD : s >= 2 ? BIAS_SHIFT : [0, 0, 0];

  return (
    <VizFrame
      eyebrow="어긋나는 두 방식"
      title="기억이 흐려 흩어지는 것과 편들어 쏠리는 것은 다루는 방법이 다릅니다"
      description="흩어지는 어긋남은 증언을 모으면 줄어들지만, 쏠리는 어긋남은 모을수록 더 확실한 오답이 됩니다."
      note="두 이유는 투키디데스 1권 22절에 적힌 것이고, 흩어짐과 쏠림의 그림은 그 둘의 차이를 보이기 위해 이 글이 그린 것입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="증언이 흩어지는 경우와 한쪽으로 쏠리는 경우의 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100svh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
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
              {/* 축 */}
              <line x1={60} y1={132} x2={420} y2={132} stroke={MUTED} strokeWidth={0.75} />
              <line x1={TRUE_X} y1={48} x2={TRUE_X} y2={140} stroke={TRUTH} strokeWidth={1.25} strokeDasharray="4 3" />
              <text x={TRUE_X} y={42} fontSize={8.5} fontWeight={700} fill={TRUTH} textAnchor="middle">
                실제로 일어난 일
              </text>
              <text x={60} y={150} fontSize={7.5} fill={MUTED}>
                한쪽으로 치우친 말
              </text>
              <text x={420} y={150} fontSize={7.5} fill={MUTED} textAnchor="end">
                반대쪽으로 치우친 말
              </text>

              {/* 증언 세 개 */}
              {[0, 1, 2].map((i) => {
                const x = TRUE_X + points[i];
                const color = s === 1 ? MEM : s >= 2 ? BIAS : MUTED;
                return (
                  <g key={i}>
                    <circle cx={x} cy={74 + i * 20} r={5} fill={color} opacity={0.85} />
                    <text x={x} y={77 + i * 20} fontSize={7} fontWeight={700} fill="#ffffff" textAnchor="middle">
                      {i + 1}
                    </text>
                    <line x1={x} y1={82 + i * 20} x2={x} y2={132} stroke={color} strokeWidth={0.75} strokeDasharray="2 2" opacity={0.6} />
                  </g>
                );
              })}

              {/* 평균 */}
              {s >= 1 && (
                <g>
                  <circle
                    cx={TRUE_X + points.reduce((a, b) => a + b, 0) / 3}
                    cy={132}
                    r={4}
                    fill={s === 1 ? MEM : BIAS}
                  />
                  <text
                    x={TRUE_X + points.reduce((a, b) => a + b, 0) / 3}
                    y={168}
                    fontSize={8}
                    fontWeight={700}
                    fill={s === 1 ? MEM : BIAS}
                    textAnchor="middle"
                  >
                    셋을 모은 자리
                  </text>
                </g>
              )}

              {s === 3 && (
                <g>
                  <text x={60} y={186} fontSize={8.5} fontWeight={700} fill={MEM}>
                    흩어짐 · 모으면 줄어듦
                  </text>
                  <text x={250} y={186} fontSize={8.5} fontWeight={700} fill={BIAS}>
                    쏠림 · 모아도 줄지 않음
                  </text>
                </g>
              )}

              {s !== 3 && (
                <text x={60} y={186} fontSize={8.5} fontWeight={700} fill={TRUTH}>
                  {s === 0
                    ? "세 사람의 말이 서로 맞지 않습니다"
                    : s === 1
                      ? "방향에 규칙이 없어 모으면 가운데로 갑니다"
                      : "방향에 규칙이 있어 모아도 가운데로 가지 않습니다"}
                </text>
              )}
              <text x={60} y={196} fontSize={7.5} fill={MUTED}>
                위치는 설명을 위한 그림이고 실제 측정값이 아닙니다
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
