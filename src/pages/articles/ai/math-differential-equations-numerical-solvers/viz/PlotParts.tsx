import type { Scale } from "./plotHelpers";

/** 그래프의 왼쪽·아래 축과 눈금입니다. */
export function PlotAxes({
  sx,
  sy,
  xTicks,
  yTicks,
  xLabel,
  yLabel,
  xMax,
  yBottom,
  yTop,
}: {
  sx: Scale;
  sy: Scale;
  xTicks: readonly number[];
  yTicks: readonly number[];
  xLabel: string;
  yLabel: string;
  xMax: number;
  yBottom: number;
  yTop: number;
}) {
  const left = sx(xTicks[0]);
  const base = sy(yBottom);
  return (
    <g>
      <path d={`M${left} ${sy(yTop)}V${base}H${sx(xMax)}`} fill="none" stroke="#94a3b8" strokeWidth={1} />
      {xTicks.map((tick) => (
        <g key={`x${tick}`}>
          <line x1={sx(tick)} x2={sx(tick)} y1={base} y2={base + 4} stroke="#94a3b8" strokeWidth={1} />
          <text x={sx(tick)} y={base + 15} textAnchor="middle" fontSize={11.5} fill="#64748b">{tick}</text>
        </g>
      ))}
      {yTicks.map((tick) => (
        <g key={`y${tick}`}>
          <line x1={left - 4} x2={left} y1={sy(tick)} y2={sy(tick)} stroke="#94a3b8" strokeWidth={1} />
          <text x={left - 7} y={sy(tick) + 3.5} textAnchor="end" fontSize={11.5} fill="#64748b">{tick}</text>
        </g>
      ))}
      <text x={left} y={sy(yTop) - 7} fontSize={11.5} fill="#64748b">{yLabel}</text>
      <text x={sx(xMax)} y={base + 29} textAnchor="end" fontSize={11.5} fill="#64748b">{xLabel}</text>
    </g>
  );
}

export interface LegendItem {
  label: string;
  color: string;
  kind?: "line" | "dash" | "dot" | "ring" | "box";
}

/** 그림 위 범례입니다. HTML이므로 좁은 폭에서 줄바꿈됩니다. */
export function PlotLegend({ items }: { items: readonly LegendItem[] }) {
  return (
    <ul className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs leading-5 text-muted-foreground">
      {items.map(({ label, color, kind = "line" }) => (
        <li key={label} className="flex items-center gap-1.5">
          <svg width={20} height={10} viewBox="0 0 20 10" aria-hidden="true" className="shrink-0">
            {kind === "line" && <line x1={1} x2={19} y1={5} y2={5} stroke={color} strokeWidth={1.25} />}
            {kind === "dash" && <line x1={1} x2={19} y1={5} y2={5} stroke={color} strokeWidth={1.25} strokeDasharray="4 3" />}
            {kind === "dot" && <circle cx={10} cy={5} r={3.5} fill={color} />}
            {kind === "ring" && <circle cx={10} cy={5} r={3.5} fill="none" stroke={color} strokeWidth={1.25} />}
            {kind === "box" && <rect x={3} y={1} width={14} height={8} rx={1.5} fill={color} />}
          </svg>
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}
