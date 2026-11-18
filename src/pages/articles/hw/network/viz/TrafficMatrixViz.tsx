import NetworkSceneShell from "./NetworkSceneShell";

/**
 * 본문 대응: #workload-contract — 같은 100 Gb/s 링크라도 checkpoint 하나와
 * barrier에 맞춘 all-to-all은 traffic matrix 모양이 다르다.
 * 본문의 "수백 rank"를 8 rank로 줄여 칸을 셀 수 있게 했다(가정).
 * 8×8 = 64칸, 대각선 8칸 제외 56칸, 한 열에 다른 rank 7개.
 */
const RANKS = 8;
const CELL = 28;
const LEFT = 52;
const TOP = 40;
const W = LEFT + RANKS * CELL + 16;
const H = TOP + RANKS * CELL + 12;
const CHECKPOINT = { src: 0, dst: 7 };
const FOCUS_COLUMN = 3;
const OFF_DIAGONAL = RANKS * RANKS - RANKS;

const SCENES = [
  {
    label: "행렬 읽는 법",
    summary: "8 × 8 = 64칸",
    mode: "empty",
    note: "가로줄은 보내는 rank(source), 세로줄은 받는 rank(destination)입니다. 한 칸은 그 한 쌍 사이의 전송입니다. 대각선은 자기 자신이라 비워 둡니다. 본문은 수백 rank를 말하지만 칸을 셀 수 있게 8개로 줄였습니다(가정).",
  },
  {
    label: "큰 checkpoint 하나",
    summary: "채운 칸 1개",
    mode: "checkpoint",
    note: "큰 checkpoint 하나를 옮기는 흐름은 행렬에서 한 칸입니다. 보내는 쪽 하나, 받는 쪽 하나가 링크를 씁니다. 칸 크기는 양을 나타내지 않습니다.",
  },
  {
    label: "barrier에 맞춘 all-to-all",
    summary: `채운 칸 ${OFF_DIAGONAL}개`,
    mode: "all",
    note: `barrier는 모든 rank가 도착할 때까지 기다렸다가 함께 다음 단계로 넘어가는 지점입니다. 그 직후 모든 rank가 자기 자신을 뺀 나머지 모두에게 보내므로 8 × 8 − 8 = ${OFF_DIAGONAL}개 칸이 함께 시작합니다. 링크는 앞 장면과 같은 100 Gb/s입니다.`,
  },
  {
    label: "받는 쪽 하나로 몰림",
    summary: `한 열에 ${RANKS - 1}개 동시 도착`,
    mode: "column",
    note: `fan-in은 한 목적지로 여러 source가 동시에 보내는 정도입니다. all-to-all에서는 rank ${FOCUS_COLUMN} 열에 ${RANKS - 1}개가 같은 순간 도착하고, checkpoint 행렬은 어느 열도 1칸을 넘지 않습니다. 링크 속도가 같아도 이 모양이 달라 queue와 tail이 다르게 나타납니다.`,
  },
] as const;

type Mode = (typeof SCENES)[number]["mode"];
const SCENE_LIST: readonly { label: string; summary: string; mode: Mode; note: string }[] = SCENES;

function cellFill(mode: Mode, src: number, dst: number) {
  if (src === dst) return { fill: "#94a3b8", opacity: 0.18 };
  if (mode === "checkpoint") {
    return src === CHECKPOINT.src && dst === CHECKPOINT.dst ? { fill: "#2563eb", opacity: 0.9 } : { fill: "#ffffff", opacity: 0 };
  }
  if (mode === "all") return { fill: "#2563eb", opacity: 0.6 };
  if (mode === "column") {
    return dst === FOCUS_COLUMN ? { fill: "#d97706", opacity: 0.9 } : { fill: "#2563eb", opacity: 0.22 };
  }
  return { fill: "#ffffff", opacity: 0 };
}

export default function TrafficMatrixViz() {
  const cells = Array.from({ length: RANKS * RANKS }, (_, index) => ({
    src: Math.floor(index / RANKS),
    dst: index % RANKS,
  }));
  return (
    <NetworkSceneShell
      eyebrow="Traffic matrix"
      title="같은 링크 위의 두 흐름은 행렬 모양부터 다릅니다"
      description="칸 하나가 (보내는 rank, 받는 rank) 한 쌍입니다. 채운 칸은 그 쌍 사이에 전송이 있다는 뜻이고, 양의 크기는 그리지 않습니다."
      ariaLabel="8 rank traffic matrix에서 checkpoint 한 흐름과 all-to-all 56개 흐름 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENE_LIST[active];
        const mode = scene.mode;
        return (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mx-auto h-auto w-full max-w-[300px]"
            role="img"
            aria-label={`${scene.label}: ${scene.summary}`}
          >
            <text x={LEFT + (RANKS * CELL) / 2} y={14} textAnchor="middle" fontSize={11} fill="#64748b">
              받는 rank (destination) →
            </text>
            <text
              x={14}
              y={TOP + (RANKS * CELL) / 2}
              textAnchor="middle"
              fontSize={11}
              fill="#64748b"
              transform={`rotate(-90 14 ${TOP + (RANKS * CELL) / 2})`}
            >
              ← 보내는 rank (source)
            </text>
            {Array.from({ length: RANKS }, (_, i) => (
              <g key={`label-${i}`}>
                <text x={LEFT + i * CELL + CELL / 2} y={TOP - 8} textAnchor="middle" fontSize={10} fill="#64748b">
                  {i}
                </text>
                <text x={LEFT - 8} y={TOP + i * CELL + CELL / 2 + 3} textAnchor="end" fontSize={10} fill="#64748b">
                  {i}
                </text>
              </g>
            ))}
            {cells.map(({ src, dst }) => {
              const style = cellFill(mode, src, dst);
              return (
                <rect
                  key={`${src}-${dst}`}
                  x={LEFT + dst * CELL + 1}
                  y={TOP + src * CELL + 1}
                  width={CELL - 2}
                  height={CELL - 2}
                  rx={3}
                  fill={style.fill}
                  fillOpacity={style.opacity}
                  stroke="#94a3b8"
                  strokeOpacity={0.6}
                  strokeWidth={1}
                />
              );
            })}
            {mode === "column" && (
              <rect
                x={LEFT + FOCUS_COLUMN * CELL}
                y={TOP}
                width={CELL}
                height={RANKS * CELL}
                fill="none"
                stroke="#d97706"
                strokeWidth={1.25}
                rx={3}
              />
            )}
          </svg>
        );
      }}
    />
  );
}
