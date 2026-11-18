import SceneShell from "./SceneShell";

/**
 * 본문 대응: #update-clock — B_eff = 16 sample × 4회 누적 × 8 rank = 512,
 * U = 51,200 ÷ 512 = 100 updates/epoch, T = 10 × 100 = 1,000.
 * 위 격자 = rank 8개 × micro-batch 4개(칸 하나에 16 sample).
 * 아래 띠 = epoch 10줄 × update 100칸(칸 하나가 update 1회 = 512 sample).
 */
const MICRO = 16;
const ACCUM = 4;
const RANKS = 8;
const EPOCHS = 10;
const DATASET = 51200;
const PER_UPDATE = MICRO * ACCUM * RANKS;
const PER_EPOCH = Math.ceil(DATASET / PER_UPDATE);
const TOTAL = EPOCHS * PER_EPOCH;

const SCENES = [
  {
    label: "rank 하나의 누적",
    summary: `${MICRO} × ${ACCUM} = ${MICRO * ACCUM} sample`,
    note: "micro-batch는 한 번의 forward/backward가 읽는 묶음입니다. rank 하나가 16 sample씩 네 번 gradient를 모으는 동안 parameter는 바뀌지 않습니다.",
  },
  {
    label: "여덟 rank가 모이면 update 1회",
    summary: `${MICRO * ACCUM} × ${RANKS} = ${PER_UPDATE} sample`,
    note: "rank 8개가 64 sample씩 모은 뒤 optimizer.step이 한 번 실행됩니다. 이 update 1회가 소비한 512가 effective batch입니다.",
  },
  {
    label: "한 epoch은 update 100칸",
    summary: `${DATASET.toLocaleString("en-US")} ÷ ${PER_UPDATE} = ${PER_EPOCH}`,
    note: "아래 띠의 칸 하나가 update 1회입니다. 51,200은 512로 나누어떨어져 ceil을 해도 한 epoch은 100칸입니다.",
  },
  {
    label: "열 epoch이 total budget",
    summary: `${EPOCHS} × ${PER_EPOCH} = T=${TOTAL.toLocaleString("en-US")}`,
    note: "열 줄의 칸을 모두 세면 1,000입니다. scheduler의 t는 이 칸을 셉니다. batch 구성이 바뀌면 같은 10 epoch이라도 다시 계산합니다.",
  },
] as const;

const W = 360;
const GRID_X = 44;
const COL_W = 36;
const CELL_H = 15;
const GRID_Y = 26;
const STRIP_Y = 132;
const STRIP_X = 40;
const STRIP_CELL = 3;
const STRIP_ROW = 9;

export default function UpdateBudgetViz() {
  return (
    <SceneShell
      eyebrow="update budget"
      title="sample 16개가 update 1,000회로 바뀌는 곱셈"
      description="위 격자의 칸 하나는 micro-batch 16 sample, 아래 띠의 칸 하나는 optimizer update 1회입니다. 숫자는 모두 본문의 16·4·8·51,200·10 epoch에서 계산했습니다."
      ariaLabel="micro-batch, 누적, rank를 곱해 update당 sample을 구하고 epoch과 total budget으로 넓혀 가는 계산"
      scenes={SCENES}
      render={(active) => (
        <svg
          viewBox={`0 0 ${W} 244`}
          role="img"
          aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
          className="mx-auto block h-auto w-full max-w-[560px] text-foreground"
        >
          <text x={GRID_X - 6} y={GRID_Y - 8} textAnchor="end" className="text-[14px] sm:text-[9px]" fill="#64748b">
            rank
          </text>
          {Array.from({ length: RANKS }, (_, rank) => {
            const lit = active === 0 ? rank === 0 : active === 1;
            const x = GRID_X + rank * COL_W;
            return (
              <g key={rank} opacity={lit ? 1 : active >= 2 ? 0.25 : 0.3}>
                <text x={x + 15} y={GRID_Y - 8} textAnchor="middle" className="text-[15px] sm:text-[10px]" fill="#64748b">
                  {rank + 1}
                </text>
                {Array.from({ length: ACCUM }, (_, step) => (
                  <g key={step}>
                    <rect
                      x={x}
                      y={GRID_Y + step * (CELL_H + 3)}
                      width={30}
                      height={CELL_H}
                      rx={3}
                      fill={lit ? "#dbeafe" : "none"}
                      stroke={lit ? "#2563eb" : "#94a3b8"}
                      strokeWidth={1}
                    />
                    <text
                      x={x + 15}
                      y={GRID_Y + step * (CELL_H + 3) + 11}
                      textAnchor="middle"
                      className="text-[15px] sm:text-[10px]"
                      fill={lit ? "#1e3a8a" : "#64748b"}
                    >
                      {MICRO}
                    </text>
                  </g>
                ))}
              </g>
            );
          })}
          {Array.from({ length: ACCUM }, (_, step) => (
            <text key={step} x={GRID_X - 6} y={GRID_Y + step * (CELL_H + 3) + 11} textAnchor="end" className="text-[15px] sm:text-[10px]" fill="#64748b">
              μ{step + 1}
            </text>
          ))}
          <text x={GRID_X} y={GRID_Y + ACCUM * (CELL_H + 3) + 18} className="text-[16px] sm:text-[11px]" fontWeight={700} fill="currentColor">
            {active === 0
              ? "rank 1: 16 × 4 = 64 (아직 update 아님)"
              : active === 1
                ? "64 × 8 = 512 sample → step 1회"
                : "update 1회(512 sample) = 띠 한 칸"}
          </text>
          {Array.from({ length: EPOCHS }, (_, epoch) => {
            const rowLit = active === 3 || (active === 2 && epoch === 0);
            const firstOnly = active === 1 && epoch === 0;
            const y = STRIP_Y + epoch * STRIP_ROW;
            return (
              <g key={epoch}>
                {(epoch === 0 || epoch === EPOCHS - 1) && (
                  <text x={STRIP_X - 4} y={y + 6} textAnchor="end" className="text-[13px] sm:text-[8px]" fill="#64748b">
                    ep{epoch + 1}
                  </text>
                )}
                <rect
                  x={STRIP_X}
                  y={y}
                  width={PER_EPOCH * STRIP_CELL}
                  height={STRIP_ROW - 3}
                  fill={rowLit ? "#dbeafe" : "none"}
                  stroke={rowLit ? "#2563eb" : "#cbd5e1"}
                  strokeWidth={rowLit ? 0.6 : 0.5}
                />
                {rowLit &&
                  Array.from({ length: PER_EPOCH - 1 }, (_, cell) => (
                    <line
                      key={cell}
                      x1={STRIP_X + (cell + 1) * STRIP_CELL}
                      x2={STRIP_X + (cell + 1) * STRIP_CELL}
                      y1={y}
                      y2={y + STRIP_ROW - 3}
                      stroke="#2563eb"
                      strokeWidth={0.4}
                    />
                  ))}
                {(firstOnly || (active === 2 && epoch === 0)) && (
                  <rect x={STRIP_X} y={y} width={STRIP_CELL} height={STRIP_ROW - 3} fill="#2563eb" />
                )}
              </g>
            );
          })}
          <text x={STRIP_X} y={STRIP_Y + EPOCHS * STRIP_ROW + 14} className="text-[16px] sm:text-[11px]" fontWeight={700} fill={active >= 2 ? "currentColor" : "#94a3b8"}>
            {active === 3 ? "10줄 × 100칸 = T = 1,000" : active === 2 ? "51,200 ÷ 512 = 100칸 / epoch" : "epoch 10줄 × update 칸"}
          </text>
        </svg>
      )}
    />
  );
}
