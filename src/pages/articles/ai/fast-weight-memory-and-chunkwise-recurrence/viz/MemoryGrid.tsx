/**
 * 2×2 기억 행렬을 SVG 칸으로 그립니다. 칸(행 i, 열 j)은 값의 i번째 숫자 × 주소의 j번째 숫자입니다.
 * tone은 그 칸에 어떤 쓰기가 들어 있는지를 색과 테두리 모양으로 함께 구분합니다.
 */
export type CellTone = "first" | "second" | "changed" | "empty";

const FILL: Record<CellTone, string> = {
  first: "#dbeafe",
  second: "#fef3c7",
  changed: "#dcfce7",
  empty: "#f8fafc",
};
const STROKE: Record<CellTone, string> = {
  first: "#2563eb",
  second: "#d97706",
  changed: "#16a34a",
  empty: "#94a3b8",
};

export function MemoryGrid({
  x,
  y,
  cells,
  tones,
  readCols,
  cell = 62,
  rowH = 42,
}: {
  x: number;
  y: number;
  cells: readonly (readonly string[])[];
  tones: readonly (readonly CellTone[])[];
  readCols: readonly number[];
  cell?: number;
  rowH?: number;
}) {
  return (
    <g>
      {[0, 1].map((col) => (
        <text key={`h${col}`} x={x + col * cell + cell / 2} y={y - 8} textAnchor="middle" fontSize={12} fontWeight={readCols.includes(col) ? 700 : 400} fill={readCols.includes(col) ? "#2563eb" : "#64748b"}>
          {`열${col + 1}`}
        </text>
      ))}
      {[0, 1].map((row) => (
        <text key={`r${row}`} x={x - 6} y={y + row * rowH + rowH / 2 + 4} textAnchor="end" fontSize={12} fill="#64748b">
          {`행${row + 1}`}
        </text>
      ))}
      {[0, 1].map((row) =>
        [0, 1].map((col) => {
          const tone = tones[row][col];
          return (
            <g key={`${row}-${col}`}>
              <rect
                x={x + col * cell + 1}
                y={y + row * rowH + 1}
                width={cell - 2}
                height={rowH - 2}
                rx={4}
                fill={FILL[tone]}
                stroke={STROKE[tone]}
                strokeWidth={1}
                strokeDasharray={tone === "empty" ? "3 3" : undefined}
              />
              <text x={x + col * cell + cell / 2} y={y + row * rowH + rowH / 2 + 5} textAnchor="middle" fontSize={16} fontWeight={700} fill="#0f172a" fontFamily="ui-monospace, monospace">
                {cells[row][col]}
              </text>
            </g>
          );
        }),
      )}
      {readCols.map((col) => (
        <rect key={`c${col}`} x={x + col * cell - 2} y={y - 2} width={cell + 4} height={rowH * 2 + 4} rx={6} fill="none" stroke="#2563eb" strokeWidth={1.25} />
      ))}
    </g>
  );
}
