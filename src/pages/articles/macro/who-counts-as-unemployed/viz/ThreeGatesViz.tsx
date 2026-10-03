import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: three-conditions 절 — 세 조건을 차례로 거는 그림. 기준은 19차 ICLS 47항 */
const SCENES = [
  "일할 나이의 사람 100명에서 시작합니다",
  "첫째, 그 주에 한 시간도 일하지 않았습니까",
  "둘째, 최근 넉 주에 일을 찾았습니까",
  "셋째, 지금 당장 일할 수 있습니까",
] as const;

/** 설명을 위해 만든 100명짜리 보기입니다. 실제 자료가 아닙니다. */
const TOTAL = 100;
const WORKED = 60;
const NOT_WORKED = TOTAL - WORKED;
const SOUGHT = 12;
const NOT_SOUGHT = NOT_WORKED - SOUGHT;
const AVAILABLE = 9;
const NOT_AVAILABLE = SOUGHT - AVAILABLE;

const WORK = "#94a3b8";
const PASS = "#6366f1";
const OUT = "#ef4444";
const FINAL = "#0ea5e9";
const MUTED = "#94a3b8";
const INK = "#334155";

const COLS = 20;
const CELL = 12;
const X0 = 24;
const Y0 = 44;

export default function ThreeGatesViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);
  const s = scenes.active;

  /** 각 사람이 어느 단계에서 걸러지는지 */
  const colorOf = (i: number) => {
    if (i < WORKED) return s >= 1 ? WORK : PASS;
    if (i < WORKED + NOT_SOUGHT) return s >= 2 ? OUT : PASS;
    if (i < WORKED + NOT_SOUGHT + NOT_AVAILABLE) return s >= 3 ? OUT : PASS;
    return s >= 3 ? FINAL : PASS;
  };

  const NOTES = [
    `일할 나이에 있는 사람 ${TOTAL}명을 놓고 시작합니다. 이 가운데 몇 명을 실업자로 셀지는 관찰이 아니라 규칙이 정합니다. 국제 기준은 그 규칙을 세 조건으로 적어 두었습니다.`,
    `첫째 조건은 그 주에 한 시간도 일하지 않았다는 것입니다. 여기서는 ${WORKED}명이 한 시간 이상 일했으므로 빠집니다. 한 시간이라는 선이 낮다는 점이 중요합니다. 주말에 몇 시간만 일해도 일한 사람으로 셉니다.`,
    `둘째 조건은 최근 넉 주 안에 실제로 일을 찾아봤다는 것입니다. 남은 ${NOT_WORKED}명 가운데 ${NOT_SOUGHT}명은 찾지 않았으므로 빠집니다. 일하고 싶지만 찾기를 그만둔 사람이 여기서 빠집니다.`,
    `셋째 조건은 자리가 생기면 지금 당장 일할 수 있다는 것입니다. ${SOUGHT}명 가운데 ${NOT_AVAILABLE}명이 당장은 어렵다고 해서 빠지고, ${AVAILABLE}명이 남습니다. 실업률은 이 ${AVAILABLE}명을 일하는 사람 ${WORKED}명과 더한 수로 나눈 ${((AVAILABLE / (WORKED + AVAILABLE)) * 100).toFixed(1)}%입니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="세 개의 문"
      title="실업자는 세 조건을 모두 통과한 사람으로 정의됩니다"
      description="관찰로 세는 것이 아니라 규칙으로 거릅니다. 조건 하나를 바꾸면 같은 사람들에서 다른 숫자가 나옵니다."
      note="100명짜리 보기는 설명을 위해 만든 것이고 실제 자료가 아닙니다. 세 조건은 19차 ICLS 결의 47항 그대로입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="세 조건을 차례로 걸러 실업자를 가려내는 과정"
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
              <text x={X0} y={34} fontSize={8} fontWeight={700} fill={MUTED}>
                일할 나이의 사람 {TOTAL}명
              </text>
              {Array.from({ length: TOTAL }, (_, i) => (
                <rect
                  key={i}
                  x={X0 + (i % COLS) * CELL}
                  y={Y0 + Math.floor(i / COLS) * CELL}
                  width={CELL - 3}
                  height={CELL - 3}
                  rx={1.5}
                  fill={colorOf(i)}
                  opacity={colorOf(i) === WORK || colorOf(i) === OUT ? 0.35 : 0.85}
                />
              ))}

              {/* 단계별 셈 */}
              <g>
                {[
                  { on: s >= 1, color: WORK, n: WORKED, label: "한 시간 이상 일함" },
                  { on: s >= 2, color: OUT, n: NOT_SOUGHT, label: "찾지 않음" },
                  { on: s >= 3, color: OUT, n: NOT_AVAILABLE, label: "지금은 못 함" },
                ].map((row, i) =>
                  row.on ? (
                    <g key={row.label}>
                      <rect x={288} y={44 + i * 22} width={10} height={10} rx={2} fill={row.color} opacity={0.4} />
                      <text x={304} y={53 + i * 22} fontSize={8} fill={MUTED}>
                        −{row.n} {row.label}
                      </text>
                    </g>
                  ) : null,
                )}
              </g>

              {s >= 3 && (
                <g>
                  <rect x={288} y={116} width={10} height={10} rx={2} fill={FINAL} opacity={0.85} />
                  <text x={304} y={125} fontSize={8.5} fontWeight={700} fill={FINAL}>
                    실업자 {AVAILABLE}명
                  </text>
                  <text x={288} y={146} fontSize={8} fill={MUTED}>
                    실업률 = {AVAILABLE} ÷ ({WORKED} + {AVAILABLE})
                  </text>
                  <text x={288} y={166} fontSize={15} fontWeight={700} fill={FINAL}>
                    {((AVAILABLE / (WORKED + AVAILABLE)) * 100).toFixed(1)}%
                  </text>
                </g>
              )}

              <text x={X0} y={186} fontSize={8.5} fontWeight={700} fill={INK}>
                {s === 0
                  ? "몇 명을 실업자로 셀지는 관찰이 아니라 규칙이 정합니다"
                  : s === 1
                    ? `한 시간이라는 선 아래로 ${WORKED}명이 일한 사람이 됩니다`
                    : s === 2
                      ? `찾기를 그만둔 ${NOT_SOUGHT}명이 여기서 빠집니다`
                      : `세 문을 다 통과한 ${AVAILABLE}명만 실업자입니다`}
              </text>
              <text x={X0} y={196} fontSize={7.5} fill={MUTED}>
                분모는 전체가 아니라 일하는 사람과 실업자를 더한 수입니다
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
