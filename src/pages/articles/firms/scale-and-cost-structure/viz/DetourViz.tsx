import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: roundabout·minimum-market 절 — 돌아가는 방법은 시장이 그만큼 커야 열린다 */
const SCENES = [
  "곧장 만들면 많이 만들어도 그대로입니다",
  "돌아가면 싸지는데 먼저 들여야 합니다",
  "한 번 더 돌아가려면 더 큰 시장이 필요합니다",
  "실제로 쓰이는 것은 아래쪽 테두리뿐입니다",
] as const;

/** 곧장 만들 때의 단위당 값. 먼저 들이는 몫이 없어 시장 크기와 무관합니다. */
const DIRECT = 10;
/** 돌아가는 방법: [먼저 들이는 몫, 그 뒤 단위당 값] */
const DETOURS = [
  { label: "한 번 돌아감", setup: 60, unit: 4, color: "#6366f1" },
  { label: "두 번 돌아감", setup: 300, unit: 1, color: "#0ea5e9" },
] as const;

const cost = (setup: number, unit: number, n: number) => setup / n + unit;
/** 곧장 가는 쪽과 값이 같아지는 시장 크기 */
const breakEven = (setup: number, unit: number, against: number) =>
  setup / (against - unit);

const N1 = breakEven(DETOURS[0].setup, DETOURS[0].unit, DIRECT);
const N2 =
  (DETOURS[1].setup - DETOURS[0].setup) /
  (DETOURS[0].unit - DETOURS[1].unit);
const C2 = cost(DETOURS[0].setup, DETOURS[0].unit, N2);

const DIRECT_COLOR = "#94a3b8";
const PICK = "#ef4444";
const MUTED = "#94a3b8";
const INK = "#334155";

const N_MAX = 120;
const C_MAX = 20;
const X0 = 74;
const X1 = 404;
const Y0 = 150;
const Y1 = 36;

const xOf = (n: number) => X0 + (n / N_MAX) * (X1 - X0);
const yOf = (c: number) => Y0 - (c / C_MAX) * (Y0 - Y1);

/** 세로 상한 안에 들어오는 구간만 그립니다 */
const curve = (setup: number, unit: number) => {
  const start = setup / (C_MAX - unit);
  const pts: string[] = [];
  for (let i = 0; i <= 60; i += 1) {
    const n = start + ((N_MAX - start) * i) / 60;
    pts.push(`${xOf(n).toFixed(1)},${yOf(cost(setup, unit, n)).toFixed(1)}`);
  }
  return pts.join(" ");
};

/** 장면 4의 아래쪽 테두리 — 각 시장 크기에서 실제로 골라지는 방법 */
const envelope = () => {
  const pts: string[] = [`${xOf(1)},${yOf(DIRECT)}`, `${xOf(N1)},${yOf(DIRECT)}`];
  for (let i = 0; i <= 40; i += 1) {
    const n = N1 + ((N2 - N1) * i) / 40;
    pts.push(`${xOf(n).toFixed(1)},${yOf(cost(60, 4, n)).toFixed(1)}`);
  }
  for (let i = 0; i <= 40; i += 1) {
    const n = N2 + ((N_MAX - N2) * i) / 40;
    pts.push(`${xOf(n).toFixed(1)},${yOf(cost(300, 1, n)).toFixed(1)}`);
  }
  return pts.join(" ");
};

export default function DetourViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4800);
  const s = scenes.active;

  const NOTES = [
    `못을 ${DIRECT}의 값으로 하나씩 손으로 박는다고 해 봅니다. 백 개를 박아도 천 개를 박아도 하나당 ${DIRECT}입니다. 많이 만든다는 것만으로는 단위당 값이 내려가지 않습니다. 내려가려면 만드는 방법이 바뀌어야 합니다.`,
    `망치를 먼저 만들면 ${DETOURS[0].setup}이 들고 그다음부터는 하나당 ${DETOURS[0].unit}입니다. 못이 ${N1}개보다 적으면 망치를 만드는 쪽이 손해입니다. Young의 문장이 이것입니다 — 못 하나를 박으려고 망치를 만드는 것은 낭비입니다.`,
    `망치를 찍어 내는 틀을 또 만들면 ${DETOURS[1].setup}이 들고 하나당 ${DETOURS[1].unit}까지 내려갑니다. 그런데 이 방법은 못이 ${N2}개를 넘어야 열립니다. 한 번 더 돌아갈 때마다 필요한 시장이 더 커집니다.`,
    `시장 크기마다 실제로 골라지는 것은 가장 아래에 있는 선 하나뿐입니다. 단위당 값이 내려간 자리를 보면 공장이 커진 것이 아니라 그 크기에서 비로소 열린 방법으로 갈아탄 것입니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="돌아가는 방법"
      title="단위당 값은 시장이 커져서가 아니라 더 돌아가는 방법이 열려서 내려갑니다"
      description="돌아가는 방법마다 먼저 들이는 몫이 있고, 그 몫을 나눠 질 만큼 시장이 커졌을 때만 그 방법이 싸집니다."
      note="숫자는 관계를 보이기 위해 만든 것입니다. 가로축은 만들 개수, 세로축은 하나당 드는 값입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="시장 크기에 따라 어느 생산 방법이 싼지가 바뀌는 그림"
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
              {/* 축 */}
              <line x1={X0} y1={Y0} x2={X1} y2={Y0} stroke={MUTED} strokeWidth={0.75} />
              <line x1={X0} y1={Y0} x2={X0} y2={Y1 - 6} stroke={MUTED} strokeWidth={0.75} />
              <text x={X0 - 6} y={Y1 - 10} fontSize={8} fontWeight={700} fill={MUTED}>
                하나당 드는 값
              </text>
              <text x={X1} y={Y0 + 24} fontSize={8} fontWeight={700} fill={MUTED} textAnchor="end">
                만들 개수
              </text>
              {[0, 40, 80, 120].map((n) => (
                <text key={`x${n}`} x={xOf(n)} y={Y0 + 12} fontSize={7.5} fill={MUTED} textAnchor="middle">
                  {n}
                </text>
              ))}

              {/* 곧장 가는 방법 */}
              <line
                x1={xOf(0)}
                y1={yOf(DIRECT)}
                x2={xOf(N_MAX)}
                y2={yOf(DIRECT)}
                stroke={DIRECT_COLOR}
                strokeWidth={s === 3 ? 0.75 : 1.25}
                opacity={s === 3 ? 0.35 : 1}
              />
              <text
                x={X0 - 6}
                y={yOf(DIRECT) + 3}
                fontSize={8}
                fontWeight={700}
                fill={DIRECT_COLOR}
                textAnchor="end"
              >
                곧장 {DIRECT}
              </text>

              {/* 돌아가는 방법 */}
              {DETOURS.map((d, i) =>
                s >= i + 1 ? (
                  <g key={d.label}>
                    <polyline
                      points={curve(d.setup, d.unit)}
                      fill="none"
                      stroke={d.color}
                      strokeWidth={s === 3 ? 0.75 : 1.25}
                      opacity={s === 3 ? 0.35 : 1}
                    />
                    <text
                      x={xOf(N_MAX) + 4}
                      y={yOf(cost(d.setup, d.unit, N_MAX)) + (i === 0 ? -5 : 10)}
                      fontSize={7.5}
                      fontWeight={700}
                      fill={d.color}
                    >
                      {d.label}
                    </text>
                  </g>
                ) : null,
              )}

              {/* 갈아타는 자리 */}
              {s >= 1 && (
                <g>
                  <line
                    x1={xOf(N1)}
                    y1={yOf(DIRECT)}
                    x2={xOf(N1)}
                    y2={Y0}
                    stroke={PICK}
                    strokeWidth={1}
                    strokeDasharray="3 2"
                  />
                  <circle cx={xOf(N1)} cy={yOf(DIRECT)} r={3} fill={PICK} />
                  <text x={xOf(N1)} y={Y0 + 24} fontSize={8} fontWeight={700} fill={PICK} textAnchor="middle">
                    {N1}개
                  </text>
                </g>
              )}
              {s >= 2 && (
                <g>
                  <line
                    x1={xOf(N2)}
                    y1={yOf(C2)}
                    x2={xOf(N2)}
                    y2={Y0}
                    stroke={PICK}
                    strokeWidth={1}
                    strokeDasharray="3 2"
                  />
                  <circle cx={xOf(N2)} cy={yOf(C2)} r={3} fill={PICK} />
                  <text x={xOf(N2)} y={Y0 + 24} fontSize={8} fontWeight={700} fill={PICK} textAnchor="middle">
                    {N2}개
                  </text>
                </g>
              )}

              {/* 아래쪽 테두리 */}
              {s === 3 && (
                <polyline points={envelope()} fill="none" stroke={PICK} strokeWidth={1.25} />
              )}

              <text x={14} y={186} fontSize={8.5} fontWeight={700} fill={INK}>
                {s === 0
                  ? `개수가 늘어도 하나당 ${DIRECT} 그대로입니다`
                  : s === 1
                    ? `${N1}개를 넘어야 망치를 만드는 쪽이 싸집니다`
                    : s === 2
                      ? `${N2}개를 넘어야 한 번 더 돌아가는 쪽이 싸집니다`
                      : `${N1}개와 ${N2}개에서 쓰는 방법이 바뀝니다`}
              </text>
              <text x={14} y={196} fontSize={7.5} fill={MUTED}>
                먼저 들이는 몫이 클수록 그 방법이 열리는 시장도 큽니다
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
