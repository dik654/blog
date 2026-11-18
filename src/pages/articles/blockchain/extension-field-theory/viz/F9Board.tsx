import type { ReactNode } from "react";
import { ALL_CELLS, BOARD_H, BOARD_W, CELL_H, CELL_INSET, CELL_W, GRID_X, GRID_Y, cellX, cellY, centerX, centerY, elementName } from "./f9Geometry";

export type CellTone = "base" | "focus" | "ok" | "bad" | "dim" | "warn";

const TONE: Record<CellTone, { stroke: string; fill: string; fillOpacity: number; dash?: string; sub: string }> = {
  base: { stroke: "#94a3b8", fill: "#94a3b8", fillOpacity: 0, sub: "#64748b" },
  focus: { stroke: "#2563eb", fill: "#2563eb", fillOpacity: 0.12, sub: "#2563eb" },
  ok: { stroke: "#16a34a", fill: "#16a34a", fillOpacity: 0.1, sub: "#15803d" },
  bad: { stroke: "#dc2626", fill: "#dc2626", fillOpacity: 0.08, dash: "4 3", sub: "#dc2626" },
  warn: { stroke: "#d97706", fill: "#d97706", fillOpacity: 0.1, sub: "#b45309" },
  dim: { stroke: "#cbd5e1", fill: "#94a3b8", fillOpacity: 0.06, dash: "3 3", sub: "#94a3b8" },
};

export interface CellView {
  tone: CellTone;
  sub?: string;
}

/** 본문 대응: 아홉 원소의 3×3 칸. 각 Viz가 칸의 색과 아래 글자, 그리고 덧그림만 정합니다. */
export default function F9Board({
  cell,
  ariaLabel,
  overlay,
}: {
  cell: (a: number, b: number) => CellView;
  ariaLabel: string;
  overlay?: ReactNode;
}) {
  return (
    <svg viewBox={`0 0 ${BOARD_W} ${BOARD_H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={ariaLabel}>
      {[0, 1, 2].map((a) => (
        <text key={`a${a}`} x={centerX(a)} y={GRID_Y - 10} textAnchor="middle" fontSize={12} fill="#64748b">
          a={a}
        </text>
      ))}
      {[0, 1, 2].map((b) => (
        <text key={`b${b}`} x={GRID_X - 8} y={centerY(b) + 4} textAnchor="end" fontSize={12} fill="#64748b">
          b={b}
        </text>
      ))}
      {ALL_CELLS.map(([a, b]) => {
        const view = cell(a, b);
        const tone = TONE[view.tone];
        return (
          <g key={`${a}-${b}`}>
            <rect
              x={cellX(a)}
              y={cellY(b)}
              width={CELL_W - 2 * CELL_INSET}
              height={CELL_H - 2 * CELL_INSET}
              rx={8}
              fill={tone.fill}
              fillOpacity={tone.fillOpacity}
              stroke={tone.stroke}
              strokeWidth={view.tone === "base" || view.tone === "dim" ? 1 : 1.25}
              strokeDasharray={tone.dash}
            />
            <text x={centerX(a)} y={centerY(b) - 8} textAnchor="middle" fontSize={15} fontWeight={700} fill={view.tone === "dim" ? "#94a3b8" : "currentColor"}>
              {elementName(a, b)}
            </text>
            <text x={centerX(a)} y={centerY(b) + 6} textAnchor="middle" fontSize={9.5} fill="#94a3b8" fontFamily="ui-monospace, monospace">
              [{a},{b}]
            </text>
            {view.sub && (
              <text x={centerX(a)} y={centerY(b) + 19} textAnchor="middle" fontSize={10.5} fontWeight={600} fill={tone.sub}>
                {view.sub}
              </text>
            )}
          </g>
        );
      })}
      {overlay}
    </svg>
  );
}
