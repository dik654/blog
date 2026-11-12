import SceneShell from "./SceneShell";

/**
 * 본문 대응: #collectives — all-reduce 는 모든 rank 가 원소별 합 전체를 받고,
 * reduce-scatter 는 그 합을 rank 수로 등분해 자기 index 조각만, all-gather 는 조각을 모아 전체를 돌려준다.
 * reduce-scatter 뒤 all-gather 가 all-reduce 와 같고, ring 배수는 (p−1)/p + (p−1)/p = 2(p−1)/p.
 * 그림은 rank 4 개로 줄였다(가정). p = 4 이면 0.75n + 0.75n = 1.5n.
 * 등식을 먼저 보이고(장면 4), 쪼갠 사이에 계산을 끼우는 장면은 그 뒤에 둔다(장면 5).
 */
const RANKS = [0, 1, 2, 3] as const;
const RANK_COLOR: readonly string[] = ["#2563eb", "#0d9488", "#d97706", "#7c3aed"];
const RANK_FILL: readonly string[] = ["#dbeafe", "#ccfbf1", "#fef3c7", "#ede9fe"];

const SCENES = [
  { label: "시작: rank 마다 부분합", summary: "보낸 양 0", note: "rank 는 collective 에 참여하는 GPU 하나입니다. 행을 나눠 계산한 TP 처럼 각 rank 는 같은 모양의 buffer n byte 를 들고 있지만 값은 자기 몫만 더한 부분합입니다. buffer 를 rank 수만큼 네 조각으로 나눠 그렸습니다." },
  { label: "All-reduce 한 번", summary: "GPU 당 2(p−1)/p · n = 1.5n", note: "모든 rank 가 네 조각 전부의 원소별 합 Σ 를 똑같이 받습니다. ring 방식이면 rank 하나가 내보내는 양은 2(p−1)/p · n 이고 p = 4 면 1.5n 입니다." },
  { label: "Reduce-scatter", summary: "GPU 당 (p−1)/p · n = 0.75n", note: "같은 합을 계산하되 rank i 는 자기 index 조각 Σ i 만 받습니다. 나머지 세 칸은 비어 있습니다." },
  { label: "이어서 all-gather", summary: "0.75n + 0.75n = 1.5n", note: "조각을 모아 모든 rank 에 전체를 돌려줍니다. 결과는 두 번째 장면의 all-reduce 와 같고, 두 단계에서 보낸 양을 더한 1.5n 도 같습니다." },
  { label: "쪼갠 사이에 계산을 끼웁니다", summary: "통신 없이 자기 조각만 처리", note: "둘로 쪼개면 reduce-scatter 가 끝난 이 상태와 all-gather 사이에 틈이 생깁니다. 아래 sequence parallel 절은 조각을 token 조각으로 잡고, 이 틈에 rank 마다 자기 token 조각에만 LayerNorm 을 적용한 뒤 all-gather 로 전체를 다시 모읍니다. 통신량은 그대로입니다." },
] as const;

const COL_X = (r: number) => 58 + r * 74;
const ROW_Y = (c: number) => 30 + c * 30;
const CELL_W = 62;
const CELL_H = 24;

type Cell = { text: string; fill: string; stroke: string; color: string; dashed: boolean };

function cellFor(active: number, rank: number, chunk: number): Cell {
  const empty: Cell = { text: "", fill: "none", stroke: "#cbd5e1", color: "#94a3b8", dashed: true };
  const sum: Cell = { text: `Σ ${chunk}`, fill: "#e2e8f0", stroke: "#0f172a", color: "#0f172a", dashed: false };
  if (active === 0) return { text: `부분 ${chunk}`, fill: RANK_FILL[rank], stroke: RANK_COLOR[rank], color: RANK_COLOR[rank], dashed: false };
  if (active === 1 || active === 3) return sum;
  if (chunk !== rank) return empty;
  if (active === 4) return { text: `Σ ${chunk} → LN`, fill: "#dcfce7", stroke: "#16a34a", color: "#15803d", dashed: false };
  return sum;
}

export default function CollectiveChunksViz() {
  return (
    <SceneShell
      eyebrow="세 collective"
      title="Reduce-scatter 뒤에 all-gather 를 하면 all-reduce 와 같은 결과가 됩니다"
      description="세로 한 줄이 rank 하나가 든 buffer 이고 칸 하나가 그 buffer 를 4등분한 조각입니다. Σ 는 네 rank 의 같은 조각을 원소별로 더한 합입니다. 4 rank 는 그림을 위한 가정입니다."
      ariaLabel="네 rank 의 buffer 조각이 all-reduce, reduce-scatter, all-gather 에서 어떻게 놓이는지"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 156" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {RANKS.map((rank) => (
            <text key={`h${rank}`} x={COL_X(rank) + CELL_W / 2} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill={RANK_COLOR[rank]}>
              rank {rank}
            </text>
          ))}
          {RANKS.map((chunk) => (
            <text key={`r${chunk}`} x={6} y={ROW_Y(chunk) + 16} fontSize={11} fill="#64748b">
              조각 {chunk}
            </text>
          ))}
          {RANKS.map((rank) =>
            RANKS.map((chunk) => {
              const cell = cellFor(active, rank, chunk);
              return (
                <g key={`${rank}-${chunk}`}>
                  <rect x={COL_X(rank)} y={ROW_Y(chunk)} width={CELL_W} height={CELL_H} rx={4} fill={cell.fill} stroke={cell.stroke} strokeWidth={1} strokeDasharray={cell.dashed ? "3 2" : undefined} />
                  <text x={COL_X(rank) + CELL_W / 2} y={ROW_Y(chunk) + 16} textAnchor="middle" fontSize={11} fontWeight={700} fill={cell.color}>
                    {cell.text}
                  </text>
                </g>
              );
            }),
          )}
        </svg>
      )}
    />
  );
}
