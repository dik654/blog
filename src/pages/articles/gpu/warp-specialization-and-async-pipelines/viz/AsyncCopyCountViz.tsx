import SceneShell from "./SceneShell";

/**
 * 본문 대응: #async-copy — 같은 32 KB stage(A 16 KB + B 16 KB)를 채우는 명령 수.
 * cp.async: 128 thread × 16 B = 2 KB 한 줄, 32 KB ÷ 2 KB = 16줄, 128 × 16 = 2,048 명령.
 * TMA: 128×64 bf16 = 16 KB box 하나가 명령 1개, A·B 두 box = 명령 2개.
 */
const COLS = 128;
const ROWS = 16;
const GX = 44;
const GW = 300;
const CELL_W = GW / COLS;
const ROW_H = 7;
const GY = 30;
const SPLIT = 5;
const rowY = (row: number) => GY + row * ROW_H + (row >= 8 ? SPLIT : 0);

const SCENES = [
  { label: "cp.async 한 번", summary: "128 thread × 16 B = 2 KB", count: "명령 128개", note: "칸 하나가 thread 하나의 16 B 명령입니다. 128 thread 가 한 번씩 내면 한 줄, 곧 2 KB 가 찹니다. 각 thread 는 자기 주소를 직접 계산합니다." },
  { label: "32 KB 를 채우려면", summary: "16번 × 128 = 2,048 명령", count: "명령 2,048개", note: "32 KB ÷ 2 KB = 16줄이므로 thread 마다 16번, 모두 합쳐 2,048번의 명령과 그만큼의 주소 계산이 듭니다." },
  { label: "TMA box 하나", summary: "128×64 bf16 = 16 KB = 명령 1개", count: "명령 1개", note: "Thread 하나가 cp.async.bulk.tensor 한 명령으로 A tile 의 box 16 KB 를 통째로 옮깁니다. 주소 계산은 hardware 가 tensor map 을 보고 합니다." },
  { label: "A·B 두 box", summary: "명령 2개 · 2,048의 천 분의 일", count: "명령 2개", note: "B 도 box 하나라 stage 32 KB 가 명령 2개로 찹니다. 2,048번에 비해 천 분의 일이라 producer 는 warp 하나로 충분해집니다." },
] as const;

const C = { cp: "#0284c7", tma: "#d97706", empty: "#94a3b8" } as const;

export default function AsyncCopyCountViz() {
  return (
    <SceneShell
      eyebrow="명령 수 비교"
      title="같은 32 KB stage 를 cp.async 는 2,048번, TMA 는 2번에 채웁니다"
      description="큰 사각형이 shared memory stage 하나(위 A 16 KB, 아래 B 16 KB)입니다. Box 는 tensor map 이 가리키는 행렬에서 한 번에 옮길 직사각형 조각입니다."
      ariaLabel="32 KB stage 를 cp.async 명령 2,048개와 TMA 명령 2개로 채우는 비교"
      scenes={SCENES}
      render={(active) => {
        const tma = active >= 2;
        const rowsLit = active === 0 ? 1 : active === 1 ? ROWS : 0;
        const boxesLit = active === 2 ? 1 : active === 3 ? 2 : 0;
        return (
          <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={GX} y={18} fontSize={10} fontWeight={700} fill={tma ? C.tma : C.cp}>{tma ? "TMA: thread 1개가 box 단위로" : "cp.async: 128 thread 가 16 B 씩"}</text>
            <text x={GX + GW} y={18} textAnchor="end" fontSize={10} fill="currentColor" opacity={0.7}>{tma ? "A·B 각 16 KB" : "128 칸 = 2 KB"}</text>
            <text x={GX - 8} y={rowY(4)} textAnchor="end" fontSize={10} fontWeight={700} fill="currentColor">A</text>
            <text x={GX - 8} y={rowY(4) + 10} textAnchor="end" fontSize={10} fill="currentColor" opacity={0.7}>16 KB</text>
            <text x={GX - 8} y={rowY(12)} textAnchor="end" fontSize={10} fontWeight={700} fill="currentColor">B</text>
            <text x={GX - 8} y={rowY(12) + 10} textAnchor="end" fontSize={10} fill="currentColor" opacity={0.7}>16 KB</text>
            {[0, 8].map((start, half) => (
              <rect
                key={start}
                x={GX}
                y={rowY(start)}
                width={GW}
                height={ROW_H * 8}
                fill={half < boxesLit ? `${C.tma}40` : "none"}
                stroke={half < boxesLit ? C.tma : C.empty}
                strokeWidth={1}
              />
            ))}
            {Array.from({ length: rowsLit }, (_, row) =>
              Array.from({ length: COLS }, (_, col) => (
                <rect
                  key={`${row}-${col}`}
                  x={GX + col * CELL_W + 0.3}
                  y={rowY(row) + 0.6}
                  width={CELL_W - 0.6}
                  height={ROW_H - 1.2}
                  fill={`${C.cp}66`}
                />
              )),
            )}
            {active === 0 ? (
              <text x={GX + GW / 2} y={rowY(3) + 4} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.8}>↑ 맨 윗줄 = 128 thread 가 한 번씩 낸 cp.async</text>
            ) : null}
            {boxesLit >= 1 ? (
              <text x={GX + GW / 2} y={rowY(4) + 3} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.tma}>box 128×64 · 명령 1</text>
            ) : null}
            {boxesLit === 2 ? (
              <text x={GX + GW / 2} y={rowY(12) + 3} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.tma}>box 128×64 · 명령 1</text>
            ) : null}
            <text x={GX} y={rowY(15) + ROW_H + 22} fontSize={10.5} fill="currentColor" opacity={0.75}>{active === 1 ? "16줄 × 128 칸" : tma ? "16 KB box × 2" : "1줄 × 128 칸"}</text>
            <text x={GX + GW} y={rowY(15) + ROW_H + 24} textAnchor="end" fontSize={13} fontWeight={700} fill={tma ? C.tma : C.cp}>{SCENES[active].count}</text>
          </svg>
        );
      }}
    />
  );
}
