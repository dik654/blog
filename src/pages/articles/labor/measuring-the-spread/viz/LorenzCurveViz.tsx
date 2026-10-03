import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: overview·cumulate-and-draw·what-one-number-loses 절. 숫자는 Lorenz(1905) 218쪽의 반례 */
const SCENES = [
  "같은 100달러를 열 사람이 나눠 가집니다",
  "가난한 쪽부터 쌓아 올립니다",
  "쌓은 값을 그리면 두 곡선이 됩니다",
  "두 곡선이 가운데에서 엇갈립니다",
] as const;

/** Lorenz 218쪽 — 두 시점의 분배. 가난한 쪽부터 적혀 있습니다. */
const CASE_I = [6, 7, 8, 9, 10, 12, 12, 12, 12, 12] as const;
const CASE_II = [8, 8, 8, 8, 8, 8, 8, 14, 14, 16] as const;

const cumulate = (xs: readonly number[]) => {
  const out: number[] = [];
  xs.reduce((acc, v) => {
    out.push(acc + v);
    return acc + v;
  }, 0);
  return out;
};
const CUM_I = cumulate(CASE_I);
const CUM_II = cumulate(CASE_II);
/** 두 곡선이 같아지는 지점 */
const CROSS = CUM_I.findIndex((v, i) => v === CUM_II[i]) + 1;

const ONE = "#6366f1";
const TWO = "#ef4444";
const EVEN = "#94a3b8";
const MUTED = "#94a3b8";
const INK = "#334155";

const X0 = 66;
const X1 = 300;
const Y0 = 158;
const Y1 = 28;
const xOf = (p: number) => X0 + (p / 100) * (X1 - X0);
const yOf = (p: number) => Y0 - (p / 100) * (Y0 - Y1);
const path = (cum: readonly number[]) =>
  [`${xOf(0)},${yOf(0)}`, ...cum.map((v, i) => `${xOf((i + 1) * 10)},${yOf(v)}`)].join(" ");

export default function LorenzCurveViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5000);
  const s = scenes.active;

  const NOTES = [
    `열 사람이 100달러를 나눠 가진 두 경우입니다. 위는 가장 적게 가진 사람이 ${CASE_I[0]}달러, 아래는 ${CASE_II[0]}달러입니다. 위는 가장 많이 가진 사람이 ${CASE_I[9]}달러, 아래는 ${CASE_II[9]}달러입니다. 어느 쪽이 더 고르게 나뉜 것입니까.`,
    `가난한 쪽부터 차례로 더해 갑니다. 위는 ${CASE_I[0]}, ${CUM_I[1]}, ${CUM_I[2]}로 쌓이고 아래는 ${CASE_II[0]}, ${CUM_II[1]}, ${CUM_II[2]}로 쌓입니다. 둘 다 열 사람을 다 더하면 100이 되므로 시작점과 끝점은 반드시 같습니다.`,
    `가로에 사람의 비율, 세로에 그들이 가진 몫의 비율을 두고 쌓은 값을 찍습니다. 똑같이 나눠 가졌다면 회색 대각선이 됩니다. 실제 두 경우는 그 아래로 처지고, 처진 정도가 쏠린 정도입니다.`,
    `그런데 두 곡선이 ${CROSS * 10}% 지점에서 만나고 그 앞뒤로 위아래가 바뀝니다. 아래쪽 ${CROSS * 10}%까지는 빨간 쪽이 더 많이 가졌고, 그 위로는 파란 쪽이 더 많이 가졌습니다. 어느 쪽이 더 쏠렸다고 말할 수 있습니까.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="쌓아서 그리기"
      title="가난한 쪽부터 쌓아 그리면 쏠린 정도가 곡선이 처진 정도로 보입니다"
      description="시작점과 끝점은 어떤 분배에서도 같으므로, 두 분배의 차이는 가운데가 얼마나 처졌는지에만 남습니다."
      note="숫자는 Lorenz(1905) 218쪽이 든 반례 그대로입니다. 열 사람에게 100달러를 나눈 두 경우입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="두 분배를 가난한 쪽부터 쌓아 그린 곡선과 그 교차"
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
              {s <= 1 && (
                <g>
                  {[
                    { label: "첫째 경우", xs: CASE_I, cum: CUM_I, y: 60, color: ONE },
                    { label: "둘째 경우", xs: CASE_II, cum: CUM_II, y: 118, color: TWO },
                  ].map((row) => (
                    <g key={row.label}>
                      <text x={14} y={row.y - 22} fontSize={8.5} fontWeight={700} fill={row.color}>
                        {row.label}
                      </text>
                      {row.xs.map((v, i) => (
                        <g key={i}>
                          <rect
                            x={74 + i * 38}
                            y={row.y - v * 1.1}
                            width={30}
                            height={v * 1.1}
                            rx={2}
                            fill={row.color}
                            opacity={0.65}
                          />
                          <text x={89 + i * 38} y={row.y + 11} fontSize={8} fontWeight={700} fill={INK} textAnchor="middle">
                            {v}
                          </text>
                          {s === 1 && (
                            <text x={89 + i * 38} y={row.y + 22} fontSize={7.5} fill={row.color} textAnchor="middle">
                              {row.cum[i]}
                            </text>
                          )}
                        </g>
                      ))}
                    </g>
                  ))}
                  <text x={14} y={178} fontSize={8} fill={MUTED}>
                    {s === 0
                      ? "왼쪽이 가장 적게 가진 사람, 오른쪽이 가장 많이 가진 사람입니다"
                      : "아래 작은 숫자가 왼쪽부터 더해 온 합입니다"}
                  </text>
                </g>
              )}

              {s >= 2 && (
                <g>
                  {/* 축 */}
                  <line x1={X0} y1={Y0} x2={X1 + 8} y2={Y0} stroke={MUTED} strokeWidth={0.75} />
                  <line x1={X0} y1={Y0} x2={X0} y2={Y1 - 6} stroke={MUTED} strokeWidth={0.75} />
                  <text x={X0 - 6} y={Y1 - 10} fontSize={8} fontWeight={700} fill={MUTED}>
                    가진 몫의 누적 %
                  </text>
                  <text x={(X0 + X1) / 2} y={Y0 + 27} fontSize={8} fontWeight={700} fill={MUTED} textAnchor="middle">
                    사람의 누적 %
                  </text>
                  {[0, 50, 100].map((p) => (
                    <text key={p} x={xOf(p)} y={Y0 + 13} fontSize={7.5} fill={MUTED} textAnchor="middle">
                      {p}
                    </text>
                  ))}

                  {/* 고르게 나눈 경우 */}
                  <line x1={xOf(0)} y1={yOf(0)} x2={xOf(100)} y2={yOf(100)} stroke={EVEN} strokeWidth={1.25} strokeDasharray="4 3" />

                  <polyline points={path(CUM_I)} fill="none" stroke={ONE} strokeWidth={1.25} />
                  <polyline points={path(CUM_II)} fill="none" stroke={TWO} strokeWidth={1.25} />

                  {s === 3 && (
                    <g>
                      <circle cx={xOf(CROSS * 10)} cy={yOf(CUM_I[CROSS - 1])} r={3.5} fill={INK} />
                      <line
                        x1={xOf(CROSS * 10)}
                        y1={yOf(CUM_I[CROSS - 1])}
                        x2={xOf(CROSS * 10)}
                        y2={Y0}
                        stroke={INK}
                        strokeWidth={1}
                        strokeDasharray="3 2"
                      />
                      <text x={xOf(CROSS * 10) + 7} y={yOf(CUM_I[CROSS - 1]) - 7} fontSize={8} fontWeight={700} fill={INK}>
                        {CROSS * 10}%에서 만남
                      </text>
                    </g>
                  )}

                  {/* 범례 */}
                  <g>
                    {[
                      { on: true, color: EVEN, label: "똑같이 나눈 경우", dash: true },
                      { on: true, color: ONE, label: "첫째 경우", dash: false },
                      { on: true, color: TWO, label: "둘째 경우", dash: false },
                    ].map((row, i) => (
                      <g key={row.label}>
                        <line
                          x1={330}
                          y1={48 + i * 18}
                          x2={352}
                          y2={48 + i * 18}
                          stroke={row.color}
                          strokeWidth={1.25}
                          strokeDasharray={row.dash ? "4 3" : undefined}
                        />
                        <text x={358} y={51 + i * 18} fontSize={8} fontWeight={700} fill={row.color}>
                          {row.label}
                        </text>
                      </g>
                    ))}
                  </g>

                  {s === 3 && (
                    <g>
                      <text x={330} y={120} fontSize={8} fill={TWO}>
                        아래 {CROSS * 10}%는 둘째가 더 가짐
                      </text>
                      <text x={330} y={134} fontSize={8} fill={ONE}>
                        위 {100 - CROSS * 10}%는 첫째가 더 가짐
                      </text>
                    </g>
                  )}
                </g>
              )}

              <text x={14} y={190} fontSize={8.5} fontWeight={700} fill={INK}>
                {s === 0
                  ? "가장 적게 가진 사람은 둘째가 많고, 가장 많이 가진 사람도 둘째가 많습니다"
                  : s === 1
                    ? "둘 다 마지막에는 100이 되므로 끝점이 같습니다"
                    : s === 2
                      ? "대각선에서 멀어질수록 쏠린 것입니다"
                      : `${CROSS * 10}% 앞뒤로 더 처진 쪽이 바뀝니다`}
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
