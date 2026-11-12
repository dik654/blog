import SceneShell from "./SceneShell";

/**
 * 본문 대응: #resource-accounting — 9@1 → 3@3 → 1@9.
 * 가로 칸 하나 = 후보 하나의 1단위(1,000번 갱신) 학습 구간.
 * 이어 학습: 9×1 + 3×(3−1) + 1×(9−3) = 9 + 6 + 6 = 21.
 * 처음부터 다시: 9×1 + 3×3 + 1×9 = 27. 모두 9단위: 9×9 = 81, 81 − 21 = 60.
 */
const NAMES = ["A", "B", "C", "D", "E", "F", "G", "H", "I"] as const;
const SCORE_1 = ["0.60", "0.59", "0.58", "0.57", "0.56", "0.55", "0.54", "0.53", "0.52"] as const;
const SCORE_3: readonly string[] = ["0.65", "0.63", "0.61"];

/** 이어 학습할 때 각 후보가 도달하는 누적 단위: A 9, B·C 3, 나머지 1 */
const REACH: readonly number[] = [9, 3, 3, 1, 1, 1, 1, 1, 1];
/** 재시작할 때 각 후보가 거치는 단계: A는 1·3·9단위 세 번, B·C는 1·3단위 두 번 */
const RESTART_GOALS: readonly (readonly number[])[] = [[1, 3, 9], [1, 3], [1, 3], [1], [1], [1], [1], [1], [1]];

const COLOR_R1 = "#64748b";
const COLOR_R2 = "#2563eb";
const COLOR_R3 = "#d97706";

const SCENES = [
  { label: "1단위: 아홉 후보 모두", summary: "9 × 1 = 9단위", note: "모든 후보가 첫 1단위를 학습합니다. 같은 지점의 점수로 상위 1/3인 A·B·C만 남깁니다. (가정)" },
  { label: "3단위: A·B·C만", summary: "3 × (3 − 1) = 6 · 누적 15", note: "상태를 보존해 이어 학습하므로 첫 칸은 다시 하지 않습니다. 세 후보가 2칸씩, 새로 6단위를 씁니다." },
  { label: "9단위: A만", summary: "1 × (9 − 3) = 6 · 합계 21", note: "3단위 점수 0.65·0.63·0.61 중 A만 6칸을 더 학습합니다. 색칠된 칸은 9 + 6 + 6 = 21칸입니다." },
  { label: "처음부터 다시 하면", summary: "9 + 9 + 9 = 27단위", note: "각 단계를 처음부터 다시 하면 같은 구간을 여러 번 학습합니다. 칸 숫자는 학습 횟수이고 합은 27입니다." },
  { label: "모두 9단위까지 하면", summary: "9 × 9 = 81 · 21보다 60 많음", note: "모두 끝까지 하면 81칸입니다. 진한 21칸 밖의 연한 칸 60개만큼 더 많습니다." },
] as const;

const LEFT = 26;
const TOP = 34;
const CELL = 24;
const ROW = 19;
const W = LEFT + 9 * CELL + 70;
const H = TOP + 9 * ROW + 14;

function cellColor(col: number) {
  if (col < 1) return COLOR_R1;
  if (col < 3) return COLOR_R2;
  return COLOR_R3;
}

export default function ResourceGridViz() {
  return (
    <SceneShell
      eyebrow="이어 학습 vs 다시 시작"
      title="칸을 세면 추가 학습량 21단위가 보입니다"
      description="한 줄이 후보 하나, 칸 하나가 1단위(1,000번 갱신)입니다. 회색은 1단위, 파랑은 3단위, 주황은 9단위 지점까지 가며 새로 학습한 칸입니다."
      note="후보 점수와 1단위=1,000번 갱신은 본문 3절의 가정입니다. 평가·저장·복구 비용은 세지 않았습니다."
      ariaLabel="아홉 후보의 학습 칸으로 본 이어 학습 21단위, 재시작 27단위, 전체 81단위"
      scenes={SCENES}
      render={(active) => {
        const limit = active === 0 ? 1 : active === 1 ? 3 : 9;
        const restart = active === 3;
        const all = active === 4;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[1, 3, 9].map((goal) => (
              <g key={goal}>
                <line x1={LEFT + goal * CELL} x2={LEFT + goal * CELL} y1={TOP - 8} y2={TOP + 9 * ROW} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 3" />
                <text x={LEFT + goal * CELL} y={TOP - 13} textAnchor="middle" fontSize={10} fill="#64748b">{goal}단위</text>
              </g>
            ))}
            {NAMES.map((name, row) => {
              const y = TOP + row * ROW;
              const reach = Math.min(REACH[row], limit);
              const score = active === 0 ? SCORE_1[row] : row === 0 && active >= 2 ? "0.70" : row < 3 ? SCORE_3[row] : SCORE_1[row];
              const stopped = !all && !restart && reach < limit;
              return (
                <g key={name}>
                  <text x={LEFT - 10} y={y + ROW / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#475569">{name}</text>
                  {Array.from({ length: 9 }, (_, col) => {
                    const trained = col < reach;
                    const filled = trained || all;
                    const times = RESTART_GOALS[row].filter((goal) => col < goal).length;
                    return (
                      <g key={col}>
                        <rect
                          x={LEFT + col * CELL + 1}
                          y={y + 2}
                          width={CELL - 2}
                          height={ROW - 4}
                          rx={2}
                          fill={trained ? cellColor(col) : filled ? "#cbd5e1" : "none"}
                          fillOpacity={trained ? (all ? 0.85 : 0.75) : filled ? 0.6 : 0}
                          stroke={filled ? "none" : "#cbd5e1"}
                          strokeWidth={1}
                        />
                        {restart && times > 0 && (
                          <text x={LEFT + col * CELL + CELL / 2} y={y + ROW / 2 + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ffffff">{times}</text>
                        )}
                      </g>
                    );
                  })}
                  {!restart && !all && (
                    <text x={LEFT + 9 * CELL + 8} y={y + ROW / 2 + 4} fontSize={10} fill={stopped ? "#94a3b8" : "#334155"} fontWeight={stopped ? 400 : 700}>
                      {score}{stopped ? " 중단" : ""}
                    </text>
                  )}
                  {restart && (
                    <text x={LEFT + 9 * CELL + 8} y={y + ROW / 2 + 4} fontSize={10} fill="#334155">
                      {RESTART_GOALS[row].reduce<number>((sum, goal) => sum + goal, 0)}칸
                    </text>
                  )}
                  {all && row === 4 && (
                    <text x={LEFT + 9 * CELL + 8} y={y + ROW / 2 + 4} fontSize={10} fill="#334155">연한 칸 60</text>
                  )}
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
