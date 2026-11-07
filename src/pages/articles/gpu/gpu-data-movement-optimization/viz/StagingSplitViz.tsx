import SceneShell from "./SceneShell";

/**
 * 본문 대응: #global-to-shared — threadblock tile 128×128을 warp 4개가 2×2로 나눌 때의 HBM 읽기.
 * 조각 4 KiB(64×32 fp16). 없음: warp 4 × (A 4 + B 4) = 32 KiB. Staging: A 8 + B 8 = 16 KiB.
 */
const SCENES = [
  { label: "2×2로 나눕니다", summary: "128×128 → warp당 64×64", note: "결과 구역을 warp 4개가 나눠 맡습니다. A는 위아래 두 조각, B는 좌우 두 조각이며 조각 하나는 64×32 fp16(값 하나 2 B), 곧 4 KiB입니다." },
  { label: "한 조각을 warp 둘이 씁니다", summary: "A1 → warp 0·1, B1 → warp 0·2", note: "A의 한 행 조각은 같은 가로줄(N 방향)의 warp 2개가, B의 한 열 조각은 같은 세로줄(M 방향)의 warp 2개가 씁니다. 모든 조각이 같은 사정입니다." },
  { label: "Staging 없음", summary: "4 × (4 + 4) = 32 KiB", note: "Warp마다 자기 A 조각과 B 조각을 HBM에서 직접 읽으므로 같은 값을 두 번씩 가져옵니다. A와 B를 곱할 때 도는 축 K를 32씩 나아갈 때마다 32 KiB입니다." },
  { label: "Staging", summary: "8 + 8 = 16 KiB", note: "A·B tile을 shared memory에 한 번씩만 내려놓고 warp들은 거기서 다시 읽습니다. 값을 읽는 횟수는 같아도 HBM 왕복은 절반입니다. 도착을 알리는 동기화(barrier)와 shared memory 용량 비용은 이 그림에 없습니다." },
] as const;

const AX = 66;
const GX = 112;
const CELL_W = 78;
const CELL_H = 58;
const STEP_X = CELL_W + 2;
const STEP_Y = CELL_H + 2;
const GRID_Y = 128;
const A_COLOR = "#2563eb";
const B_COLOR = "#d97706";
const MUTED = "#94a3b8";

function Arrow({ points }: { points: string }) {
  const coords = points.split(" ").map((pair) => pair.split(",").map(Number));
  const [tipX, tipY] = coords[coords.length - 1];
  const [prevX] = coords[coords.length - 2];
  const head = prevX === tipX
    ? `${tipX - 4},${tipY - 7} ${tipX + 4},${tipY - 7} ${tipX},${tipY}`
    : `${tipX - (tipX > prevX ? 7 : -7)},${tipY - 4} ${tipX - (tipX > prevX ? 7 : -7)},${tipY + 4} ${tipX},${tipY}`;
  return (
    <g>
      <polyline points={points} fill="none" stroke="#2563eb" strokeWidth={1.25} />
      <polygon points={head} fill="#2563eb" />
    </g>
  );
}

function Band({ y, label, on }: { y: number; label: string; on: boolean }) {
  return (
    <g>
      <rect x={16} y={y} width={308} height={20} rx={3} fill={on ? "#2563eb" : MUTED} fillOpacity={on ? 0.15 : 0.12} stroke={on ? "#2563eb" : MUTED} strokeWidth={1} />
      <text x={170} y={y + 14} textAnchor="middle" fontSize={11} fontWeight={700} fill={on ? "currentColor" : "#64748b"}>{label}</text>
    </g>
  );
}

function Bar({ label, value, shown, color }: { label: string; value: number; shown: boolean; color: string }) {
  return (
    <div className="grid grid-cols-[6.25rem_minmax(0,1fr)_3.75rem] items-center gap-2 text-xs sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        {shown && <div className="h-full rounded-sm" style={{ width: `${(value / 32) * 100}%`, backgroundColor: color }} />}
      </div>
      <span className="text-right font-mono font-bold">{shown ? `${value} KiB` : "−"}</span>
    </div>
  );
}

export default function StagingSplitViz() {
  return (
    <SceneShell
      eyebrow="GEMM의 조각 나누기"
      title="한 조각을 warp 둘이 쓰면 staging이 HBM 왕복을 절반으로 줄입니다"
      description="GEMM은 행렬 곱 C = A × B입니다. Warp는 함께 도는 thread 32개 묶음, HBM은 global memory입니다. 칸 하나가 warp 하나의 몫이고 왼쪽이 A 조각, 위쪽이 B 조각입니다."
      ariaLabel="warp 4개가 A와 B 조각을 나눠 쓸 때 staging 유무에 따른 HBM 읽기 양"
      scenes={SCENES}
      render={(active) => {
        const hbmCount = active === 2 ? "HBM 2번" : active === 3 ? "HBM 1번" : "4 KiB";
        const lit = (piece: "A1" | "A2" | "B1" | "B2") => active !== 1 || piece === "A1" || piece === "B1";
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 340 252" className="mx-auto h-auto w-full max-w-[400px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <Band y={2} label="HBM (global memory)" on={active >= 2} />
              <Band y={44} label={active === 2 ? "shared memory · 거치지 않음" : "shared memory"} on={active === 3} />
              {active === 2 && (
                <>
                  <Arrow points="36,22 36,157 64,157" />
                  <text x={46} y={37} fontSize={11} fill="currentColor">warp 4개가 각자 A 4 + B 4 KiB</text>
                  <text x={46} y={79} fontSize={11} fontWeight={700} fill="currentColor">같은 값을 warp 수만큼 왕복</text>
                </>
              )}
              {active === 3 && (
                <>
                  <Arrow points="36,22 36,42" />
                  <Arrow points="36,64 36,157 64,157" />
                  <text x={46} y={37} fontSize={11} fontWeight={700} fill="currentColor">A 8 KiB · B 8 KiB를 한 번씩</text>
                  <text x={46} y={79} fontSize={11} fill="currentColor">warp가 여기서 다시 읽음</text>
                </>
              )}
              {(["B1", "B2"] as const).map((piece, col) => (
                <g key={piece} opacity={lit(piece) ? 1 : 0.35}>
                  <rect x={GX + col * STEP_X} y={86} width={CELL_W} height={38} rx={3} fill={B_COLOR} fillOpacity={0.2} stroke={B_COLOR} strokeWidth={1} />
                  <text x={GX + col * STEP_X + CELL_W / 2} y={102} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">{piece}</text>
                  <text x={GX + col * STEP_X + CELL_W / 2} y={117} textAnchor="middle" fontSize={11} fill="currentColor">{hbmCount}</text>
                </g>
              ))}
              {(["A1", "A2"] as const).map((piece, row) => (
                <g key={piece} opacity={lit(piece) ? 1 : 0.35}>
                  <rect x={AX} y={GRID_Y + row * STEP_Y} width={42} height={CELL_H} rx={3} fill={A_COLOR} fillOpacity={0.2} stroke={A_COLOR} strokeWidth={1} />
                  <text x={AX + 21} y={GRID_Y + row * STEP_Y + 16} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">{piece}</text>
                  <text x={AX + 21} y={GRID_Y + row * STEP_Y + 32} textAnchor="middle" fontSize={10} fill="currentColor">{hbmCount === "4 KiB" ? "4 KiB" : "HBM"}</text>
                  <text x={AX + 21} y={GRID_Y + row * STEP_Y + 46} textAnchor="middle" fontSize={10} fill="currentColor">{hbmCount === "4 KiB" ? "" : hbmCount.slice(4)}</text>
                </g>
              ))}
              {[0, 1, 2, 3].map((warp) => {
                const row = Math.floor(warp / 2);
                const col = warp % 2;
                const a = row === 0 ? "A1" : "A2";
                const b = col === 0 ? "B1" : "B2";
                const showA = active >= 2 || (active === 1 && a === "A1");
                const showB = active >= 2 || (active === 1 && b === "B1");
                const x = GX + col * STEP_X;
                const y = GRID_Y + row * STEP_Y;
                return (
                  <g key={warp}>
                    <rect x={x} y={y} width={CELL_W} height={CELL_H} rx={3} fill={MUTED} fillOpacity={0.1} stroke={MUTED} strokeWidth={1} />
                    <text x={x + CELL_W / 2} y={y + 14} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">{`warp ${warp}`}</text>
                    <text x={x + CELL_W / 2} y={y + 27} textAnchor="middle" fontSize={10} fill="#64748b">64×64</text>
                    {showA && (
                      <g>
                        <rect x={x + 8} y={y + 33} width={29} height={20} rx={3} fill={A_COLOR} />
                        <text x={x + 22.5} y={y + 47} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">{a}</text>
                      </g>
                    )}
                    {showB && (
                      <g>
                        <rect x={x + 41} y={y + 33} width={29} height={20} rx={3} fill={B_COLOR} />
                        <text x={x + 55.5} y={y + 47} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">{b}</text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
            <div className="mt-3 space-y-2">
              <Bar label="Staging 없음" value={32} shown={active >= 2} color="#64748b" />
              <Bar label="Staging" value={16} shown={active >= 3} color="#2563eb" />
            </div>
          </div>
        );
      }}
    />
  );
}
