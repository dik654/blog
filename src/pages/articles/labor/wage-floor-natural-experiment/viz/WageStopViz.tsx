import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: two-counts·many-buyers·one-buyer·two-predictions 절 */
const SCENES = [
  "사람을 늘릴수록 더 파는 몫이 줄어듭니다",
  "사는 쪽이 여럿이면 8에서 5명입니다",
  "사는 쪽이 하나면 6에서 3명입니다",
  "바닥을 9로 걸면 둘이 반대로 움직입니다",
] as const;

/** n번째 사람이 한 시간에 더 만들어 파는 몫 */
const value = (n: number) => 13 - n;
/** 임금 w를 부르면 오는 사람 수 */
const supply = (w: number) => w - 3;
/** 그 사람 수를 부르려면 줘야 하는 임금 */
const wageFor = (n: number) => n + 3;
/** 사는 쪽이 하나일 때 n번째 사람을 더 쓰는 데 드는 값 */
const extraCost = (n: number) => wageFor(n) + (n - 1);

const N_MAX = 6;
const COMP_N = 5;
const COMP_W = wageFor(COMP_N);
const ONE_N = 3;
const ONE_W = wageFor(ONE_N);
const FLOOR = 9;
/** 바닥을 걸면 임금이 더 오르지 않으므로 더 쓰는 값이 바닥에 고정됩니다 */
const COMP_FLOOR_N = 13 - FLOOR;
const ONE_FLOOR_N = Math.min(supply(FLOOR), 13 - FLOOR);

const VALUE = "#6366f1";
const WAGE = "#0ea5e9";
const EXTRA = "#ef4444";
const FLOOR_C = "#334155";
const MUTED = "#94a3b8";
const INK = "#334155";

const X0 = 62;
const COL = 46;
const BASE = 150;
const UNIT = 8.4;

const xOf = (n: number) => X0 + (n - 1) * COL;
const yOf = (v: number) => BASE - v * UNIT;

export default function WageStopViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5000);
  const s = scenes.active;

  const NOTES = [
    `가게가 사람을 한 명 더 써서 한 시간에 더 만들어 파는 몫을 적어 봅니다. 첫 사람은 ${value(1)}, 둘째는 ${value(2)}, 이렇게 한 명씩 줄어 다섯째는 ${value(5)}입니다. 손이 늘수록 자리가 좁아지고 기다리는 시간이 생기기 때문입니다.`,
    `사는 가게가 여럿이면 가게 하나가 임금을 흔들 수 없습니다. 임금 ${COMP_W}이면 ${supply(COMP_W)}명이 오고, 가게는 더 파는 몫이 ${COMP_W}보다 큰 자리까지만 씁니다. 두 수가 만나는 ${COMP_N}명에서 멈추고 임금은 ${COMP_W}입니다.`,
    `사는 가게가 하나뿐이면 한 명 더 부르려고 임금을 올릴 때 이미 일하던 사람의 임금도 함께 오릅니다. ${ONE_N + 1}번째를 쓰려면 임금을 ${wageFor(ONE_N)}에서 ${wageFor(ONE_N + 1)}로 올려야 하므로 드는 값은 ${wageFor(ONE_N + 1)}이 아니라 ${extraCost(ONE_N + 1)}입니다. 그래서 ${ONE_N}명에서 멈추고 임금은 ${ONE_W}입니다.`,
    `바닥을 ${FLOOR}로 걸면 임금이 더 오르지 않으므로 한 명 더 쓰는 값이 ${FLOOR}에 고정됩니다. 여럿이 사던 쪽은 ${COMP_N}명에서 ${COMP_FLOOR_N}명으로 줄고, 하나가 사던 쪽은 ${ONE_N}명에서 ${ONE_FLOOR_N}명으로 늘어 둘 다 ${COMP_FLOOR_N}명이 됩니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="멈추는 자리"
      title="같은 숫자 묶음에서 사는 쪽이 여럿일 때와 하나일 때가 다른 자리에서 멈춥니다"
      description="그리고 같은 바닥을 걸었을 때 두 경우의 사람 수가 서로 반대 방향으로 움직입니다."
      note="한 명 단위로 끊어 본 표입니다. 쪼개지 않고 이어서 풀면 멈추는 자리가 3.3명·임금 6.3으로 조금 다릅니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="사람 수에 따른 더 파는 몫과 임금, 그리고 바닥을 걸었을 때의 변화"
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
              <text x={14} y={30} fontSize={8} fontWeight={700} fill={MUTED}>
                몇 번째 사람
              </text>
              {Array.from({ length: N_MAX }, (_, i) => (
                <text key={`h${i}`} x={xOf(i + 1)} y={30} fontSize={8} fontWeight={700} fill={MUTED} textAnchor="middle">
                  {i + 1}
                </text>
              ))}

              {/* 더 파는 몫 */}
              <polyline
                points={Array.from({ length: N_MAX }, (_, i) => `${xOf(i + 1)},${yOf(value(i + 1))}`).join(" ")}
                fill="none"
                stroke={VALUE}
                strokeWidth={1.25}
              />
              {Array.from({ length: N_MAX }, (_, i) => (
                <g key={`v${i}`}>
                  <circle cx={xOf(i + 1)} cy={yOf(value(i + 1))} r={2.5} fill={VALUE} />
                  <text x={xOf(i + 1)} y={yOf(value(i + 1)) - 6} fontSize={8} fontWeight={700} fill={VALUE} textAnchor="middle">
                    {value(i + 1)}
                  </text>
                </g>
              ))}

              {/* 임금 */}
              {s >= 1 && (
                <g>
                  <polyline
                    points={Array.from({ length: N_MAX }, (_, i) => `${xOf(i + 1)},${yOf(wageFor(i + 1))}`).join(" ")}
                    fill="none"
                    stroke={WAGE}
                    strokeWidth={1.25}
                  />
                  {Array.from({ length: N_MAX }, (_, i) => (
                    <text key={`w${i}`} x={xOf(i + 1)} y={yOf(wageFor(i + 1)) + 13} fontSize={8} fill={WAGE} textAnchor="middle">
                      {wageFor(i + 1)}
                    </text>
                  ))}
                </g>
              )}

              {/* 하나가 살 때 더 드는 값 */}
              {s >= 2 && (
                <g>
                  <polyline
                    points={Array.from({ length: N_MAX }, (_, i) => `${xOf(i + 1)},${yOf(extraCost(i + 1))}`).join(" ")}
                    fill="none"
                    stroke={EXTRA}
                    strokeWidth={1.25}
                    strokeDasharray={s === 3 ? "4 3" : undefined}
                  />
                </g>
              )}

              {/* 바닥 */}
              {s === 3 && (
                <g>
                  <line x1={X0 - 24} y1={yOf(FLOOR)} x2={xOf(N_MAX) + 14} y2={yOf(FLOOR)} stroke={FLOOR_C} strokeWidth={1.25} />
                  <text x={X0 - 28} y={yOf(FLOOR) + 3} fontSize={8} fontWeight={700} fill={FLOOR_C} textAnchor="end">
                    바닥 {FLOOR}
                  </text>
                </g>
              )}

              {/* 멈추는 자리 */}
              {s === 1 && (
                <g>
                  <line x1={xOf(COMP_N)} y1={34} x2={xOf(COMP_N)} y2={BASE + 6} stroke={WAGE} strokeWidth={1.25} />
                  <text x={xOf(COMP_N) + 4} y={44} fontSize={8} fontWeight={700} fill={WAGE}>
                    {COMP_N}명 · 임금 {COMP_W}
                  </text>
                </g>
              )}
              {s === 2 && (
                <g>
                  <line x1={xOf(ONE_N)} y1={34} x2={xOf(ONE_N)} y2={BASE + 6} stroke={EXTRA} strokeWidth={1.25} />
                  <text x={xOf(ONE_N) + 4} y={44} fontSize={8} fontWeight={700} fill={EXTRA}>
                    {ONE_N}명 · 임금 {ONE_W}
                  </text>
                </g>
              )}
              {s === 3 && (
                <g>
                  <line x1={xOf(COMP_FLOOR_N)} y1={34} x2={xOf(COMP_FLOOR_N)} y2={BASE + 6} stroke={FLOOR_C} strokeWidth={1.25} />
                  <text x={xOf(COMP_FLOOR_N) + 4} y={44} fontSize={8} fontWeight={700} fill={FLOOR_C}>
                    둘 다 {COMP_FLOOR_N}명
                  </text>
                </g>
              )}

              <line x1={X0 - 24} y1={BASE + 6} x2={xOf(N_MAX) + 6} y2={BASE + 6} stroke={MUTED} strokeWidth={0.75} />

              {/* 오른쪽 범례 — 선 끝이 서로 겹치지 않도록 고정 위치에 둡니다 */}
              <g>
                {[
                  { on: true, color: VALUE, label: "더 파는 몫", dash: false },
                  { on: s >= 1, color: WAGE, label: "불러야 하는 임금", dash: false },
                  { on: s >= 2, color: EXTRA, label: "한 명 더 쓰는 값", dash: s === 3 },
                  { on: s === 3, color: FLOOR_C, label: `바닥 ${FLOOR}`, dash: false },
                ].map((row, i) =>
                  row.on ? (
                    <g key={row.label}>
                      <line
                        x1={344}
                        y1={48 + i * 17}
                        x2={364}
                        y2={48 + i * 17}
                        stroke={row.color}
                        strokeWidth={1.25}
                        strokeDasharray={row.dash ? "4 3" : undefined}
                      />
                      <text x={370} y={51 + i * 17} fontSize={8} fontWeight={700} fill={row.color}>
                        {row.label}
                      </text>
                    </g>
                  ) : null,
                )}
              </g>

              {s === 3 && (
                <g>
                  <text x={344} y={134} fontSize={8} fontWeight={700} fill={MUTED}>
                    바닥 {FLOOR}을 걸면
                  </text>
                  <text x={344} y={150} fontSize={8.5} fill={WAGE}>
                    여럿이 사던 쪽 {COMP_N} → {COMP_FLOOR_N}
                  </text>
                  <text x={344} y={164} fontSize={8.5} fill={EXTRA}>
                    하나가 사던 쪽 {ONE_N} → {ONE_FLOOR_N}
                  </text>
                </g>
              )}

              <text x={14} y={186} fontSize={8.5} fontWeight={700} fill={INK}>
                {s === 0
                  ? `첫 사람 ${value(1)}에서 다섯째 ${value(5)}까지 한 명씩 줄어듭니다`
                  : s === 1
                    ? `더 파는 몫과 불러야 하는 임금이 만나는 ${COMP_N}명에서 멈춥니다`
                    : s === 2
                      ? `한 명 더 쓰는 값이 임금보다 커서 ${ONE_N}명에서 먼저 멈춥니다`
                      : `같은 바닥이 한쪽은 줄이고 다른 쪽은 늘립니다`}
              </text>
              <text x={14} y={196} fontSize={7.5} fill={MUTED}>
                세로는 한 시간에 오가는 값, 가로는 몇 번째 사람인지입니다
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
