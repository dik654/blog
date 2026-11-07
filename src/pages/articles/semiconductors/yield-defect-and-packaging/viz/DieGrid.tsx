import { GRID_COLS, GRID_ROWS } from "./dieOrder";

const CELL = 6.8;

/** 다이 1000칸. 표시값 0은 비운 칸, 1은 결함 1개, 2는 결함 2개 이상입니다. */
export default function DieGrid({ marks, label, y = 0 }: { marks: ReadonlyMap<number, 0 | 1 | 2>; label: string; y?: number }) {
  return (
    <g transform={`translate(0 ${y})`} role="img" aria-label={label}>
      {Array.from({ length: GRID_COLS * GRID_ROWS }, (_, index) => {
        const mark = marks.get(index);
        const x = (index % GRID_COLS) * CELL;
        const cy = Math.floor(index / GRID_COLS) * CELL;
        return (
          <g key={index}>
            <rect x={x + 0.4} y={cy + 0.4} width={CELL - 0.8} height={CELL - 0.8} fill={mark === 2 ? "#dc2626" : mark === 1 ? "#d97706" : "#94a3b8"} fillOpacity={mark === 0 ? 0 : mark ? 1 : 0.28} />
            {mark === 2 && <circle cx={x + CELL / 2} cy={cy + CELL / 2} r={1.3} fill="#ffffff" />}
          </g>
        );
      })}
    </g>
  );
}
