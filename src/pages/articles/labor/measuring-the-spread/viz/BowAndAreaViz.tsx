import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: one-number 절. 프로이센 숫자는 Lorenz(1905) 214쪽 표 */
const SCENES = [
  "똑같이 나누면 대각선 하나입니다",
  "프로이센의 두 해를 같은 칸에 올립니다",
  "휜 정도는 사이의 넓이입니다",
  "그 넓이를 삼각형으로 나눠 한 숫자로 만듭니다",
] as const;

/** Lorenz 214쪽: 계급별 인원 %와 소득 %를 가난한 쪽부터 쌓은 값 */
const PRUSSIA = {
  1892: {
    people: [70.1, 96.1, 98.6, 99.3, 99.9, 100],
    income: [41.2, 71.2, 79.8, 84.0, 91.4, 100],
  },
  1901: {
    people: [60.5, 95.3, 98.3, 99.1, 99.8, 100],
    income: [31.7, 67.0, 76.3, 80.8, 88.9, 100],
  },
} as const;

/** 대각선과 곡선 사이 넓이를 삼각형 넓이로 나눈 값 — 사다리꼴로 적분합니다 */
const ratio = (people: readonly number[], income: readonly number[]) => {
  let under = 0;
  let px = 0;
  let py = 0;
  for (let i = 0; i < people.length; i += 1) {
    under += ((py + income[i]) / 2) * (people[i] - px);
    px = people[i];
    py = income[i];
  }
  return (5000 - under) / 5000;
};
const R92 = ratio(PRUSSIA[1892].people, PRUSSIA[1892].income);
const R01 = ratio(PRUSSIA[1901].people, PRUSSIA[1901].income);

const EVEN = "#94a3b8";
const Y92 = "#6366f1";
const Y01 = "#ef4444";
const AREA = "#ef4444";
const MUTED = "#94a3b8";
const INK = "#334155";

const X0 = 66;
const X1 = 286;
const Y0 = 158;
const Y1 = 30;
const xOf = (p: number) => X0 + (p / 100) * (X1 - X0);
const yOf = (p: number) => Y0 - (p / 100) * (Y0 - Y1);
const line = (c: { people: readonly number[]; income: readonly number[] }) =>
  [`${xOf(0)},${yOf(0)}`, ...c.people.map((p, i) => `${xOf(p)},${yOf(c.income[i])}`)].join(" ");

export default function BowAndAreaViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5000);
  const s = scenes.active;

  const NOTES = [
    `모두가 똑같이 가졌다면 아래 10%가 전체의 10%를, 아래 50%가 50%를 가집니다. 점이 전부 대각선 위에 놓이므로 곡선이 아니라 직선 하나가 됩니다. 어떤 분배든 시작점과 끝점은 이 직선과 같습니다.`,
    `Lorenz가 실제로 그린 자료입니다. 1892년에는 아래 ${PRUSSIA[1892].people[0]}%가 전체 소득의 ${PRUSSIA[1892].income[0]}%를 가졌고, 1901년에는 아래 ${PRUSSIA[1901].people[0]}%가 ${PRUSSIA[1901].income[0]}%를 가졌습니다. 1901년 선이 더 아래에 있습니다.`,
    `대각선과 곡선 사이가 벌어진 만큼이 쏠린 정도입니다. Lorenz의 표현으로는 활이 휜 만큼입니다. 다만 넓이 자체는 그림의 크기에 따라 달라지므로 그대로 쓸 수 없습니다.`,
    `그래서 그 넓이를 대각선 아래 삼각형 전체 넓이로 나눕니다. 똑같이 나누면 0이고 한 사람이 다 가지면 1에 가까워집니다. 프로이센은 ${R92.toFixed(3)}에서 ${R01.toFixed(3)}로 커졌습니다. 이 나눗셈은 Lorenz의 글에는 없고 이 글이 그의 곡선에서 이어 적은 것입니다.`,
  ] as const;

  const cur = s === 0 ? null : PRUSSIA[1901];

  return (
    <VizFrame
      eyebrow="한 숫자로 줄이기"
      title="대각선과 곡선 사이의 넓이를 삼각형 넓이로 나누면 크기와 무관한 한 숫자가 됩니다"
      description="똑같이 나누면 0, 한 사람이 다 가지면 1에 가까워지므로 서로 다른 나라와 시점을 같은 자 위에 올릴 수 있습니다."
      note="프로이센 숫자는 Lorenz(1905) 214쪽 표를 가난한 쪽부터 쌓은 값입니다. 넓이 비는 이 글이 그 곡선에서 계산한 것입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="대각선과 곡선 사이 넓이로 쏠린 정도를 한 숫자로 만드는 과정"
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
              {/* 휜 넓이 */}
              {s >= 2 && cur && (
                <polygon
                  points={`${xOf(0)},${yOf(0)} ${xOf(100)},${yOf(100)} ${[...cur.people]
                    .map((p, i) => `${xOf(p)},${yOf(cur.income[i])}`)
                    .reverse()
                    .join(" ")}`}
                  fill={AREA}
                  opacity={0.18}
                />
              )}

              <line x1={X0} y1={Y0} x2={X1 + 8} y2={Y0} stroke={MUTED} strokeWidth={0.75} />
              <line x1={X0} y1={Y0} x2={X0} y2={Y1 - 6} stroke={MUTED} strokeWidth={0.75} />
              <text x={X0 - 6} y={Y1 - 10} fontSize={8} fontWeight={700} fill={MUTED}>
                소득의 누적 %
              </text>
              <text x={(X0 + X1) / 2} y={Y0 + 27} fontSize={8} fontWeight={700} fill={MUTED} textAnchor="middle">
                사람의 누적 %
              </text>
              {[0, 50, 100].map((p) => (
                <text key={p} x={xOf(p)} y={Y0 + 13} fontSize={7.5} fill={MUTED} textAnchor="middle">
                  {p}
                </text>
              ))}

              <line x1={xOf(0)} y1={yOf(0)} x2={xOf(100)} y2={yOf(100)} stroke={EVEN} strokeWidth={1.25} strokeDasharray="4 3" />

              {s === 0 &&
                [10, 30, 50, 70, 90].map((p) => (
                  <g key={p}>
                    <circle cx={xOf(p)} cy={yOf(p)} r={2.5} fill={EVEN} />
                    <text x={xOf(p) + 5} y={yOf(p) - 4} fontSize={7.5} fill={MUTED}>
                      {p}·{p}
                    </text>
                  </g>
                ))}

              {s >= 1 && (
                <g>
                  <polyline points={line(PRUSSIA[1892])} fill="none" stroke={Y92} strokeWidth={1.25} />
                  <polyline points={line(PRUSSIA[1901])} fill="none" stroke={Y01} strokeWidth={1.25} />
                </g>
              )}

              {/* 범례 */}
              <g>
                {[
                  { on: true, color: EVEN, label: "똑같이 나눈 경우", dash: true },
                  { on: s >= 1, color: Y92, label: "프로이센 1892", dash: false },
                  { on: s >= 1, color: Y01, label: "프로이센 1901", dash: false },
                ].map((row, i) =>
                  row.on ? (
                    <g key={row.label}>
                      <line x1={316} y1={46 + i * 18} x2={338} y2={46 + i * 18} stroke={row.color} strokeWidth={1.25} strokeDasharray={row.dash ? "4 3" : undefined} />
                      <text x={344} y={49 + i * 18} fontSize={8} fontWeight={700} fill={row.color}>
                        {row.label}
                      </text>
                    </g>
                  ) : null,
                )}
              </g>

              {s === 3 && (
                <g>
                  <text x={316} y={116} fontSize={8} fontWeight={700} fill={MUTED}>
                    넓이 ÷ 삼각형
                  </text>
                  <text x={316} y={136} fontSize={12} fontWeight={700} fill={Y92}>
                    1892 · {R92.toFixed(3)}
                  </text>
                  <text x={316} y={154} fontSize={12} fontWeight={700} fill={Y01}>
                    1901 · {R01.toFixed(3)}
                  </text>
                </g>
              )}

              <text x={14} y={190} fontSize={8.5} fontWeight={700} fill={INK}>
                {s === 0
                  ? "아래 50%가 전체의 50%를 가지면 점은 대각선 위에 놓입니다"
                  : s === 1
                    ? `아래 ${PRUSSIA[1901].people[0]}%가 가진 몫이 ${PRUSSIA[1892].income[0]}%에서 ${PRUSSIA[1901].income[0]}%쪽으로 내려갔습니다`
                    : s === 2
                      ? "넓이는 그림 크기를 바꾸면 같이 바뀌므로 그대로 쓸 수 없습니다"
                      : `${R92.toFixed(3)} → ${R01.toFixed(3)} · 0이면 똑같이 나눈 것입니다`}
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
