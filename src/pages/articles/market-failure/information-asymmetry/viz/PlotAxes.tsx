const AXIS = "#94a3b8";
const TEXT = "#64748b";

export interface PlotTick {
  value: number;
  label: string;
}

export interface PlotLegendItem {
  label: string;
  color: string;
  dash?: string;
}

/** 이 글의 선 그래프가 함께 쓰는 축과 범례입니다. 선은 직접 그리고 좌표 함수만 넘겨받습니다. */
export default function PlotAxes({
  left,
  right,
  top,
  bottom,
  xTicks,
  yTicks,
  xLabel,
  sx,
  sy,
  legend,
  legendY,
}: {
  left: number;
  right: number;
  top: number;
  bottom: number;
  xTicks: readonly PlotTick[];
  yTicks: readonly PlotTick[];
  xLabel: string;
  sx: (value: number) => number;
  sy: (value: number) => number;
  legend: readonly PlotLegendItem[];
  legendY: number;
}) {
  return (
    <g>
      {legend.map((item, index) => (
        <g key={item.label} transform={`translate(${left}, ${legendY + index * 15})`}>
          <line x1={0} x2={18} y1={-4} y2={-4} stroke={item.color} strokeWidth={1.25} strokeDasharray={item.dash} />
          <text x={23} y={0} fontSize={10.5} fontWeight={700} fill={item.color}>{item.label}</text>
        </g>
      ))}
      {yTicks.map((tick) => (
        <g key={tick.label}>
          <line x1={left} x2={right} y1={sy(tick.value)} y2={sy(tick.value)} stroke={AXIS} strokeWidth={1} strokeOpacity={0.22} />
          <text x={left - 5} y={sy(tick.value) + 3.5} textAnchor="end" fontSize={10.5} fill={TEXT}>{tick.label}</text>
        </g>
      ))}
      <line x1={left} x2={right} y1={bottom} y2={bottom} stroke={AXIS} strokeWidth={1} />
      <line x1={left} x2={left} y1={top} y2={bottom} stroke={AXIS} strokeWidth={1} />
      {xTicks.map((tick) => (
        <text key={tick.label} x={sx(tick.value)} y={bottom + 14} textAnchor="middle" fontSize={10.5} fill={TEXT}>{tick.label}</text>
      ))}
      <text x={right} y={bottom + 28} textAnchor="end" fontSize={10.5} fontWeight={700} fill={TEXT}>{xLabel}</text>
    </g>
  );
}
