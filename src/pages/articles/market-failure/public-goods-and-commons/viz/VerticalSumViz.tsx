import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: vertical-sum 절 — 비경합재는 값을 세로로 더해야 한다 */
const SCENES = [
  "각자에게는 이만큼의 값이 있습니다",
  "한 개를 셋이 같이 누립니다",
  "세로로 더한 값과 드는 값을 견줍니다",
  "혼자서는 아무도 만들지 않습니다",
] as const;

/** 가로등 한 개씩 늘릴 때 세 사람이 각각 더 얻는 값 */
const VALUES = [
  { who: "가", v: [6, 5, 4, 3] },
  { who: "나", v: [4, 3, 2, 1] },
  { who: "다", v: [2, 2, 1, 1] },
] as const;
/** 가로등 한 개를 세우는 데 드는 값 */
const COST = 9;

const colSum = (i: number) => VALUES.reduce((a, r) => a + r.v[i], 0);
const SUMS = [0, 1, 2, 3].map(colSum);
const GAINS = SUMS.map((s) => s - COST);
const CUM = GAINS.map((_, i) => GAINS.slice(0, i + 1).reduce((a, b) => a + b, 0));
const Q_BEST = CUM.indexOf(Math.max(...CUM)) + 1;
const Q_ALONE = VALUES.filter((r) => r.v[0] >= COST).length;

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const COL = 68;
const X0 = 150;
const ROW_Y = [46, 64, 82] as const;

export default function VerticalSumViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const s = scenes.active;

  const NOTES = [
    `가로등을 한 개씩 늘릴 때 세 사람이 각각 더 얻는 값입니다. 가는 ${VALUES[0].v.join(", ")}, 나는 ${VALUES[1].v.join(", ")}, 다는 ${VALUES[2].v.join(", ")}입니다. 여기까지는 앞 글들의 사려는 줄과 같은 숫자입니다.`,
    `그런데 가로등은 한 개를 세우면 셋이 같이 누립니다. 가가 본다고 해서 나의 몫이 줄지 않습니다. 그래서 한 개의 값은 옆으로 나열하는 것이 아니라 세로로 더해야 하고, 합이 ${SUMS.join(", ")}입니다.`,
    `드는 값은 한 개당 ${COST}입니다. 세로로 더한 값과 견주면 차이가 ${GAINS.map((g) => (g > 0 ? `+${g}` : g)).join(", ")}이고 ${Q_BEST}개째까지가 봉우리입니다. 셋째부터는 셋의 값을 다 합쳐도 드는 값에 못 미칩니다.`,
    `이제 각자에게 맡겨 보겠습니다. 첫 개의 값이 가에게 ${VALUES[0].v[0]}, 나에게 ${VALUES[1].v[0]}, 다에게 ${VALUES[2].v[0]}이고 드는 값은 ${COST}입니다. 혼자 세울 사람이 ${Q_ALONE}명이라 한 개도 만들어지지 않습니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="같이 쓰는 것의 값"
      title="한 사람이 더 누려도 줄지 않으면 값을 세로로 더합니다"
      description="한 개를 여럿이 같이 누리는 것에서는 한 개의 값이 한 사람의 값이 아니라 모두의 값을 합친 것입니다."
      note="세 사람과 가로등 네 개로 줄인 예입니다. 각자의 값을 정확히 안다고 둔 계산이며, 그 전제는 다음 절에서 풉니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="세로로 더한 값과 드는 값"
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
                가로등 몇째 개
              </text>
              {[0, 1, 2, 3].map((i) => (
                <text
                  key={`h${i}`}
                  x={X0 + i * COL}
                  y={24}
                  fontSize={8}
                  fontWeight={700}
                  fill={MUTED}
                >
                  {i + 1}째
                </text>
              ))}

              {VALUES.map((row, r) => (
                <g key={row.who}>
                  <text x={14} y={ROW_Y[r]} fontSize={8.5} fontWeight={700} fill={MUTED}>
                    {row.who}가 더 얻는 값
                  </text>
                  {row.v.map((v, i) => (
                    <text
                      key={`v${r}${i}`}
                      x={X0 + i * COL}
                      y={ROW_Y[r]}
                      fontSize={10}
                      fontWeight={700}
                      fill={s === 3 && i === 0 ? WARN : ACCENT}
                      fillOpacity={s === 3 && i > 0 ? 0.25 : 1}
                    >
                      {v}
                    </text>
                  ))}
                </g>
              ))}

              {s === 1 && (
                <>
                  {[0, 1, 2, 3].map((i) => (
                    <line
                      key={`ar${i}`}
                      x1={X0 + i * COL - 9}
                      y1={34}
                      x2={X0 + i * COL - 9}
                      y2={110}
                      stroke={OK}
                      strokeWidth={1.25}
                      strokeDasharray="3 3"
                    />
                  ))}
                </>
              )}

              <line
                x1={14}
                y1={98}
                x2={456}
                y2={98}
                stroke={MUTED}
                strokeWidth={0.75}
                strokeOpacity={0.4}
              />

              <g opacity={s >= 1 && s < 3 ? 1 : 0.25}>
                <text x={14} y={118} fontSize={8.5} fontWeight={700} fill={OK}>
                  세로로 더한 값
                </text>
                {SUMS.map((v, i) => (
                  <text
                    key={`s${i}`}
                    x={X0 + i * COL}
                    y={118}
                    fontSize={11}
                    fontWeight={700}
                    fill={OK}
                  >
                    {v}
                  </text>
                ))}
              </g>

              <g opacity={s === 2 ? 1 : 0.25} display={s === 3 ? "none" : undefined}>
                <text x={14} y={140} fontSize={8.5} fontWeight={700} fill={MUTED}>
                  드는 값
                </text>
                {SUMS.map((_, i) => (
                  <text
                    key={`c${i}`}
                    x={X0 + i * COL}
                    y={140}
                    fontSize={10}
                    fontWeight={700}
                    fill={MUTED}
                  >
                    {COST}
                  </text>
                ))}
              </g>

              {s === 2 && (
                <>
                  <text x={14} y={162} fontSize={8.5} fontWeight={700} fill={MUTED}>
                    차이
                  </text>
                  {GAINS.map((g, i) => (
                    <text
                      key={`g${i}`}
                      x={X0 + i * COL}
                      y={162}
                      fontSize={10.5}
                      fontWeight={700}
                      fill={g > 0 ? OK : WARN}
                    >
                      {g > 0 ? "+" : ""}
                      {g}
                    </text>
                  ))}
                </>
              )}

              {s === 3 && (
                <>
                  <text x={14} y={140} fontSize={8.5} fontWeight={700} fill={WARN}>
                    혼자 세우면
                  </text>
                  {VALUES.map((row, r) => (
                    <text
                      key={`a${r}`}
                      x={X0 + r * COL}
                      y={140}
                      fontSize={9}
                      fontWeight={700}
                      fill={WARN}
                    >
                      {row.who} {row.v[0]} &lt; {COST}
                    </text>
                  ))}
                  <text x={14} y={162} fontSize={9} fontWeight={700} fill={WARN}>
                    셋이 합치면 {SUMS[0]}이라 남는데 혼자서는 아무도 못 세웁니다
                  </text>
                </>
              )}

              <text
                x={14}
                y={186}
                fontSize={9}
                fontWeight={700}
                fill={s === 3 ? WARN : s === 2 ? OK : MUTED}
              >
                {s === 3
                  ? `만들어지는 개수 ${Q_ALONE}개 · 맞는 개수 ${Q_BEST}개`
                  : s === 2
                    ? `맞는 개수는 ${Q_BEST}개입니다 · 누적 차이가 ${CUM.map((v) => (v > 0 ? `+${v}` : v)).join(", ")}`
                    : s === 1
                      ? "한 개를 셋이 같이 누리므로 값이 세로로 쌓입니다"
                      : "여기까지는 각자의 값일 뿐입니다"}
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
