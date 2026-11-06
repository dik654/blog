import SceneShell from "./SceneShell";

/**
 * 본문 대응: #memory-and-bubbles — 지연 500 × 발행률 1 = 진행 중 500, 500/16 = 31.25, 올림 32, 16×32 = 512칸.
 * 평균 31.25를 칸으로 그리려고 네 줄 32개, 열두 줄 31개로 나눴다(4×32 + 12×31 = 500).
 */
const ROWS = 16;
const COLUMNS = 32;
const TOTAL = 500;
const LEFT = 44;
const TOP = 24;
const CELL = 9;
const LONG_ROWS = TOTAL - 31 * ROWS;
const INK = "#64748b";
const ACCENT = "#2563eb";
const CELLS = Array.from({ length: ROWS * COLUMNS }, (_, index) => ({ row: Math.floor(index / COLUMNS), column: index % COLUMNS, index }));

const SCENES = [
  { label: "진행 중인 요청", summary: "500 × 1 = 500개", note: "읽기 지연 500 clock과 발행률 1 warp-load/clock을 같은 모형에 넣으면 평균 500개 요청이 진행 중이어야 합니다(가정). 칸 하나는 warp의 load 명령 하나이며 lane의 주소나 메모리 sector가 아닙니다." },
  { label: "warp 16개로 나누기", summary: "500 ÷ 16 = 31.25개", note: "Resident warp를 16개로 제한하면 warp당 평균 31.25개입니다. 칸은 쪼갤 수 없어 네 줄은 32개, 열두 줄은 31개로 그렸습니다(그림의 가정). 세로선이 평균 자리입니다." },
  { label: "같은 정수 용량", summary: "16 × 32 = 512칸 ≥ 500", note: "각 warp에 같은 정수 용량을 둔 모형에서는 32개씩 수용할 여지가 필요합니다. 모든 warp가 매 순간 32개씩 진행해야 한다는 뜻이 아니어서 12칸이 남습니다. 실제 하드웨어 큐가 500개를 수용하는지는 이 계산으로 알 수 없습니다." },
] as const;

export default function LoadCapacityViz() {
  return (
    <SceneShell
      eyebrow="긴 읽기 지연의 산수"
      title="요청 500개를 warp 16개에 나누면 같은 용량 모형에서 warp당 32칸이 필요합니다"
      description="칸 하나가 진행 중인 warp load 하나입니다. 500 clock과 warp 16개는 모두 설명을 위한 가정값입니다."
      ariaLabel="진행 중인 요청 500개를 warp 16개로 나누는 격자 그림"
      scenes={SCENES}
      render={(index) => {
        const lengths = Array.from({ length: ROWS }, (_, row) => (row < LONG_ROWS ? 32 : 31));
        return (
          <svg viewBox="0 0 360 192" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
            {index > 0 && (
              <>
                <text x={LEFT - 6} y={TOP + 8} textAnchor="end" fontSize={11} fill={INK}>warp 1</text>
                <text x={LEFT - 6} y={TOP + 8 + 15 * CELL} textAnchor="end" fontSize={11} fill={INK}>16</text>
              </>
            )}
            {index === 2 && <text x={LEFT + COLUMNS * CELL} y={16} textAnchor="end" fontSize={12} fill={INK}>warp당 32칸</text>}
            {index === 1 && <text x={LEFT + 31.25 * CELL} y={16} textAnchor="end" fontSize={12} fontWeight={700} fill={ACCENT}>평균 31.25</text>}
            {CELLS.map(({ row, column, index: cell }) => {
              const filled = index === 0 ? cell < TOTAL : column < lengths[row];
              if (!filled && index === 0) return null;
              return (
                <rect
                  key={cell}
                  x={LEFT + column * CELL + 0.5}
                  y={TOP + row * CELL + 0.5}
                  width={CELL - 1}
                  height={CELL - 1}
                  fill={filled ? ACCENT : "none"}
                  opacity={filled ? 0.75 : 1}
                  stroke={filled ? "none" : "#d97706"}
                  strokeWidth={filled ? 0 : 1}
                  strokeDasharray={filled ? undefined : "2 1"}
                />
              );
            })}
            {index === 1 && <line x1={LEFT + 31.25 * CELL} x2={LEFT + 31.25 * CELL} y1={TOP - 4} y2={TOP + ROWS * CELL + 2} stroke="#d97706" strokeWidth={1} strokeDasharray="3 2" />}
            <text x={180} y={186} textAnchor="middle" fontSize={12} fontWeight={700} fill={index === 2 ? "#b45309" : INK}>
              {index === 0 ? "요청 500칸 · warp로 나누기 전" : index === 1 ? "4×32 + 12×31 = 500" : "점선 12칸 = 용량 512 − 평균 500"}
            </text>
          </svg>
        );
      }}
    />
  );
}
