import SceneShell from "./SceneShell";

/**
 * 본문 대응: #encrypt-decrypt — 칸 하나 = 5를 한 번 곱함. 6×7 = 42칸.
 * 줄 끝(8의 거듭제곱): 8,18,6,2,16,13,12 / 열 끝(17의 거듭제곱): 17,13,14,8,21,12.
 */
const ALICE = "#2563eb";
const BOB = "#b45309";
const DONE = "#047857";
const INK = "#64748b";
const COLS = 6;
const ROWS = 7;
const CELL_W = 38;
const CELL_H = 23;
const X0 = 62;
const Y0 = 8;

const powers = (base: number, count: number) =>
  Array.from({ length: count }, (_, index) =>
    Array.from({ length: index + 1 }).reduce<number>((value) => (value * base) % 23, 1),
  );
const ROW_ENDS = powers(8, ROWS);
const COL_ENDS = powers(17, COLS);

const SCENES = [
  { label: "Alice: 6칸 묶음을 7번", summary: "(5⁶)⁷ → 12", note: "한 줄(6칸)은 5를 6번 곱한 것이고 그 나머지가 공개값 8입니다. 그래서 줄을 하나 쌓을 때마다 8을 곱하는 셈이며, 일곱째 줄에서 가리개 12가 됩니다." },
  { label: "Bob: 7칸 묶음을 6번", summary: "(5⁷)⁶ → 12", note: "같은 칸을 세로로 묶으면 한 열(7칸)은 5를 7번 곱한 첫 전송값 17입니다. 열을 하나 더할 때마다 17을 곱하며, 여섯째 열에서 12가 됩니다." },
  { label: "칸 수가 같습니다", summary: "6×7 = 42 → 12", note: "묶는 방향만 다를 뿐 칸은 모두 42개이고 5를 42번 곱한 나머지는 12입니다. 그래서 Bob이 Alice가 메시지에 곱했던 값과 같은 값을 얻어 제거할 수 있습니다." },
] as const;

export default function ExponentGridViz() {
  return (
    <SceneShell
      eyebrow="지수의 곱"
      title="같은 42칸을 가로로 묶느냐 세로로 묶느냐의 차이입니다"
      description="칸 하나가 5를 한 번 곱한 것입니다. 오른쪽 수는 그 줄까지, 아래 수는 그 열까지 곱한 뒤 23으로 나눈 나머지입니다."
      ariaLabel="6곱하기 7 격자를 가로 줄과 세로 열로 묶어 모두 42칸이 되어 나머지 12에 도착하는 그림"
      scenes={SCENES}
      render={(active) => {
        const byRow = active === 0;
        const byCol = active === 1;
        return (
          <svg viewBox="0 0 360 212" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {Array.from({ length: ROWS }, (_, row) =>
              Array.from({ length: COLS }, (__, col) => {
                const last = row === ROWS - 1 && col === COLS - 1;
                const color = active === 2 ? (last ? DONE : "#94a3b8") : byRow ? ALICE : BOB;
                const band = byRow ? row : col;
                return (
                  <rect
                    key={`${row}-${col}`}
                    x={X0 + col * CELL_W}
                    y={Y0 + row * CELL_H}
                    width={CELL_W - 2}
                    height={CELL_H - 2}
                    rx={2}
                    fill={color}
                    fillOpacity={active === 2 ? (last ? 1 : 0.3) : band % 2 === 0 ? 0.75 : 0.35}
                  />
                );
              }),
            )}
            {ROW_ENDS.map((value, row) => (
              <g key={row} opacity={byCol ? 0.25 : 1}>
                <text x={X0 - 8} y={Y0 + row * CELL_H + 15} textAnchor="end" fontSize={11} fill={INK}>{row + 1}번째 줄</text>
                <text x={X0 + COLS * CELL_W + 6} y={Y0 + row * CELL_H + 15} fontSize={12} fontWeight={row === ROWS - 1 ? 700 : 500} fill={row === ROWS - 1 ? ALICE : INK}>→ {value}</text>
              </g>
            ))}
            {COL_ENDS.map((value, col) => (
              <text key={col} x={X0 + col * CELL_W + (CELL_W - 2) / 2} y={Y0 + ROWS * CELL_H + 18} textAnchor="middle" opacity={byRow ? 0.25 : 1} fontSize={12} fontWeight={col === COLS - 1 ? 700 : 500} fill={col === COLS - 1 ? BOB : INK}>↓{value}</text>
            ))}
          </svg>
        );
      }}
    />
  );
}
