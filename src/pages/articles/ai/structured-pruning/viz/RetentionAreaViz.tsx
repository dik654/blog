import SceneShell from "./SceneShell";

/**
 * 본문 대응: #shape-propagation — input·output width를 각각 75% 남기면 dense arithmetic은 α·β = .5625가 남는다.
 * 칸 하나 = 각 축 폭의 1/4(그림용 분할). 16칸 → input 축 1/4 제거 12칸 → output 축 1/4 제거 9칸.
 */
const N = 4;
const CELL = 34;
const GAP = 4;
const LEFT = 64;
const TOP = 30;
const DROP_IN = 1;
const DROP_OUT = 2;

const SCENES = [
  {
    label: "원래 dense 계산",
    summary: "16칸 = 100%",
    note: "token row 하나가 모든 input과 모든 output의 조합을 계산하므로 계산량은 이 사각형의 넓이에 비례합니다. 칸 하나는 각 축 폭의 1/4로 나눈 그림용 분할입니다.",
  },
  {
    label: "input width를 75% 남김 (α = .75)",
    summary: "12칸 = 75%",
    note: "input channel 1/4을 지우면 그 행 전체가 사라집니다. 남은 비율을 이 글은 retention ratio라 부르고 input 쪽을 α로 씁니다.",
  },
  {
    label: "output width도 75% 남김 (β = .75)",
    summary: ".75 × .75 = 56.25%",
    note: "output 쪽 1/4(β = .75)은 남은 12칸에서 다시 열 하나를 지웁니다. 두 축이 각각 줄어 넓이는 75%가 아니라 9/16 = 56.25%입니다.",
  },
  {
    label: "dependency를 실제로 제거해 작은 dense 행렬로",
    summary: "3×3 dense · 계산 43.75% 감소",
    note: "줄어드는 것은 bias·memory·launch를 뺀 주된 arithmetic입니다. alignment와 occupancy 때문에 latency가 정확히 43.75% 줄었다는 뜻은 아닙니다.",
  },
] as const;

export default function RetentionAreaViz() {
  return (
    <SceneShell
      eyebrow="두 축의 retention"
      title="두 축을 각각 75% 남기면 남는 계산은 넓이 9/16입니다"
      description="세로는 input width(d_in), 가로는 output width(d_out)입니다. 채운 칸은 아직 계산하는 input·output 조합, 점선 칸은 지운 조합입니다."
      ariaLabel="input과 output width를 각각 75퍼센트 남길 때 dense 계산 넓이가 16칸에서 9칸으로 줄어드는 과정"
      scenes={SCENES}
      render={(active) => {
        const packed = active === 3;
        const size = packed ? N - 1 : N;
        const rows = Array.from({ length: size }, (_, row) => row);
        const keptRows = rows.filter((row) => packed || !(active >= 1 && row === DROP_IN));
        const keptCount = packed ? 9 : keptRows.length * (active >= 2 ? N - 1 : N);
        const gridW = N * CELL + (N - 1) * GAP;
        return (
          <svg viewBox="0 0 320 210" className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={LEFT + gridW / 2} y={TOP - 12} textAnchor="middle" fontSize={11} fill="#64748b">
              output width d_out →
            </text>
            <text x={LEFT - 12} y={TOP + gridW / 2} textAnchor="middle" fontSize={11} fill="#64748b" transform={`rotate(-90 ${LEFT - 12} ${TOP + gridW / 2})`}>
              input width d_in →
            </text>
            {rows.map((row) =>
              Array.from({ length: size }, (_, col) => {
                const removed = !packed && ((active >= 1 && row === DROP_IN) || (active >= 2 && col === DROP_OUT));
                return (
                  <rect
                    key={`${row}-${col}`}
                    x={LEFT + col * (CELL + GAP)}
                    y={TOP + row * (CELL + GAP)}
                    width={CELL}
                    height={CELL}
                    rx={4}
                    fill={removed ? "none" : "#2563eb"}
                    fillOpacity={removed ? 0 : 0.75}
                    stroke={removed ? "#94a3b8" : "#1d4ed8"}
                    strokeWidth={1}
                    strokeDasharray={removed ? "3 3" : undefined}
                  />
                );
              }),
            )}
            <text x={LEFT + gridW + 18} y={TOP + 40} fontSize={22} fontWeight={700} fill="#2563eb">
              {keptCount}
            </text>
            <text x={LEFT + gridW + 18} y={TOP + 58} fontSize={11} fill="#64748b">
              / 16칸
            </text>
            <text x={LEFT + gridW + 18} y={TOP + 84} fontSize={13} fontWeight={700} fill="#64748b">
              {Number(((keptCount / 16) * 100).toFixed(2))}%
            </text>
          </svg>
        );
      }}
    />
  );
}
