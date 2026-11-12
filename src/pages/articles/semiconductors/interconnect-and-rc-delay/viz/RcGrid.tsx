import type { ReactNode } from "react";

/**
 * 저항(행 높이, Ω)과 용량(열 너비, fF)을 같은 축척으로 놓은 칸 그림입니다.
 * 칸 넓이 = 저항 × 용량 = 시간. 저항이 그 용량보다 뒤에 있으면 칸을 비웁니다.
 */
export interface GridRow {
  label: string;
  ohm: number;
}

export interface GridCol {
  label: string;
  ff: number;
}

export interface GridGeometry {
  xs: readonly number[];
  ys: readonly number[];
}

const LINE = "#94a3b8";
const TEXT = "#64748b";

export default function RcGrid({
  x0,
  y0,
  pxPerFf,
  pxPerOhm,
  rows,
  cols,
  cellText,
  cellColor,
  overlay,
}: {
  x0: number;
  y0: number;
  pxPerFf: number;
  pxPerOhm: number;
  rows: readonly GridRow[];
  cols: readonly GridCol[];
  /** null이면 그 저항이 그 용량의 충전 경로에 없다는 뜻으로 빈 칸을 그립니다. */
  cellText: (row: number, col: number) => string | null;
  cellColor: (row: number, col: number) => string;
  overlay?: (geometry: GridGeometry) => ReactNode;
}) {
  const xs = cols.reduce<number[]>((acc, col) => [...acc, acc[acc.length - 1] + col.ff * pxPerFf], [x0]);
  const ys = rows.reduce<number[]>((acc, row) => [...acc, acc[acc.length - 1] + row.ohm * pxPerOhm], [y0]);
  return (
    <g>
      {cols.map((col, j) => (
        <text key={col.label} x={(xs[j] + xs[j + 1]) / 2} y={y0 - 8} textAnchor="middle" fontSize={13} fill={TEXT}>
          {col.label}
        </text>
      ))}
      {rows.map((row, i) => (
        <text key={row.label} x={x0 - 8} y={(ys[i] + ys[i + 1]) / 2 + 4} textAnchor="end" fontSize={13} fill={TEXT}>
          {row.label}
        </text>
      ))}
      {rows.map((row, i) =>
        cols.map((col, j) => {
          const text = cellText(i, j);
          const x = xs[j];
          const y = ys[i];
          const w = xs[j + 1] - x;
          const h = ys[i + 1] - y;
          const color = cellColor(i, j);
          return (
            <g key={`${row.label}-${col.label}`}>
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                fill={text === null ? "none" : color}
                fillOpacity={text === null ? 0 : 0.18}
                stroke={text === null ? LINE : color}
                strokeWidth={1}
                strokeDasharray={text === null ? "3 3" : undefined}
              />
              <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize={13} fontWeight={text === null ? 400 : 700} fill={text === null ? TEXT : color}>
                {text === null ? "없음" : text}
              </text>
            </g>
          );
        }),
      )}
      {overlay?.({ xs, ys })}
    </g>
  );
}
