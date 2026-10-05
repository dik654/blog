import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: the-check·what-broke 절 — 되먹임 고리와 실제로 일어난 일 */
const SCENES = [
  "모자라면 한 사람 몫이 줄어듭니다",
  "줄어든 몫이 사람 수를 도로 누릅니다",
  "그래서 한 사람 몫은 제자리로 돌아옵니다",
  "그런데 실제로는 그렇게 되지 않았습니다",
] as const;

const NODES = [
  { id: 0, label: "사람이 는다", x: 90, y: 54 },
  { id: 1, label: "한 사람 몫이 준다", x: 236, y: 54 },
  { id: 2, label: "먹고살기 어려워진다", x: 236, y: 132 },
  { id: 3, label: "사람 수가 눌린다", x: 90, y: 132 },
] as const;

const LOOP = "#6366f1";
const BREAK = "#ef4444";
const FLAT = "#94a3b8";
const MUTED = "#94a3b8";
const INK = "#334155";

export default function CheckLoopViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5000);
  const s = scenes.active;

  const shown = s === 0 ? 2 : s === 1 ? 4 : 4;

  const NOTES = [
    `모자람이 생기면 가장 먼저 한 사람에게 돌아가는 몫이 줄어듭니다. 앞 그림에서 1이던 몫이 0.31까지 내려간 그 자리입니다.`,
    `Malthus의 셈에서 줄어든 몫은 거기서 멈추지 않습니다. 먹고살기 어려워지면 혼인이 늦어지고 아이가 덜 살아남아 사람 수가 도로 눌립니다. 늘어난 것이 그 늘어남을 막는 쪽으로 돌아옵니다.`,
    `고리가 닫히면 한 사람 몫은 내려갔다가 다시 올라와 같은 자리로 돌아옵니다. 총량은 계속 커지는데 한 사람 몫은 긴 눈으로 보면 제자리입니다. 이것이 이 셈의 결론입니다.`,
    `실제로는 이렇게 되지 않았습니다. 지난 두 세기 동안 사람도 늘고 한 사람 몫도 함께 올랐습니다. 고리가 틀린 것이 아니라 고리에 들어가는 두 가정이 깨졌습니다 — 먹일 수 있는 양이 더하기로만 늘지 않았고, 몫이 늘어도 사람 수가 그만큼 늘지 않았습니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="되먹임 고리"
      title="늘어난 것이 그 늘어남을 막는 쪽으로 돌아오면 한 사람 몫은 제자리에 묶입니다"
      description="이 고리가 닫혀 있는 한 총량이 아무리 커져도 한 사람 몫은 올라가지 않습니다. 실제로 올라갔다면 고리의 어느 가정이 깨진 것입니다."
      note="고리 자체는 Malthus(1798)의 구조이고, 마지막 장면의 판정은 이후 두 세기의 결과를 이 글이 그 구조에 대어 본 것입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="인구와 한 사람 몫 사이의 되먹임 고리와 그 가정이 깨지는 자리"
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
              <defs>
                <marker id="chk-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 z" fill={LOOP} />
                </marker>
              </defs>

              {/* 고리의 화살표 */}
              {[
                [0, 1],
                [1, 2],
                [2, 3],
                [3, 0],
              ].map(([a, b], i) =>
                i < shown ? (
                  <line
                    key={i}
                    x1={NODES[a].x + (NODES[a].y === NODES[b].y ? 56 : 0)}
                    y1={NODES[a].y + (NODES[a].y === NODES[b].y ? 0 : 14)}
                    x2={NODES[b].x - (NODES[a].y === NODES[b].y ? 56 : 0)}
                    y2={NODES[b].y - (NODES[a].y === NODES[b].y ? 0 : 14)}
                    stroke={s === 3 && i === 3 ? BREAK : LOOP}
                    strokeWidth={1.25}
                    strokeDasharray={s === 3 && i === 3 ? "4 3" : undefined}
                    markerEnd="url(#chk-arrow)"
                  />
                ) : null,
              )}

              {NODES.map((n, i) => (
                <g key={n.id} opacity={i < (s === 0 ? 2 : 4) ? 1 : 0.25}>
                  <rect x={n.x - 54} y={n.y - 13} width={108} height={26} rx={4} fill={LOOP} opacity={0.1} stroke={LOOP} strokeWidth={1.25} />
                  <text x={n.x} y={n.y + 3} fontSize={8} fontWeight={700} fill={INK} textAnchor="middle">
                    {n.label}
                  </text>
                </g>
              ))}

              {s === 3 && (
                <g>
                  <text x={163} y={168} fontSize={8} fontWeight={700} fill={BREAK} textAnchor="middle">
                    이 되돌림이 약해졌습니다
                  </text>
                </g>
              )}

              {/* 오른쪽: 한 사람 몫의 시간 경로 */}
              <g>
                <text x={318} y={38} fontSize={8} fontWeight={700} fill={MUTED}>
                  한 사람 몫
                </text>
                <line x1={318} y1={132} x2={458} y2={132} stroke={MUTED} strokeWidth={0.75} />
                <line x1={318} y1={132} x2={318} y2={46} stroke={MUTED} strokeWidth={0.75} />
                {s >= 2 && (
                  <polyline
                    points="318,92 340,110 362,96 384,112 406,94 428,108 450,92"
                    fill="none"
                    stroke={FLAT}
                    strokeWidth={1.25}
                  />
                )}
                {s === 3 && (
                  <polyline
                    points="318,92 345,86 372,76 399,66 426,58 450,52"
                    fill="none"
                    stroke={BREAK}
                    strokeWidth={1.25}
                  />
                )}
                {s >= 2 && (
                  <text x={322} y={146} fontSize={7.5} fill={s === 3 ? MUTED : INK}>
                    {s === 3 ? "회색이 이 셈의 예측" : "오르내려도 제자리"}
                  </text>
                )}
                {s === 3 && (
                  <text x={322} y={158} fontSize={7.5} fontWeight={700} fill={BREAK}>
                    빨강이 실제로 일어난 일
                  </text>
                )}
              </g>

              <text x={14} y={186} fontSize={8.5} fontWeight={700} fill={INK}>
                {s === 0
                  ? "모자람은 먼저 한 사람 몫으로 나타납니다"
                  : s === 1
                    ? "줄어든 몫이 사람 수를 도로 누릅니다"
                    : s === 2
                      ? "고리가 닫히면 한 사람 몫은 제자리에 묶입니다"
                      : "고리가 틀린 것이 아니라 들어가는 가정 둘이 깨졌습니다"}
              </text>
              <text x={14} y={196} fontSize={7.5} fill={MUTED}>
                되돌림이 약해지거나 먹일 수 있는 양이 곱으로 늘면 고리가 풀립니다
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
