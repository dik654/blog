/** 같은 ms 축에 계산·보관·복사를 줄별로 쌓는 시간표입니다. */
export interface GanttBar {
  row: number;
  from: number;
  to: number;
  label?: string;
  color: string;
  dashed?: boolean;
  rowSpan?: number;
}

export interface GanttMark {
  at: number;
  label: string;
  anchor?: "start" | "middle" | "end";
  color?: string;
}

const W = 360;
const LEFT = 66;
const RIGHT = 10;
const TOP = 24;
const ROW_H = 32;

export default function GanttChart({
  rows,
  axisMax,
  ticks,
  bars,
  marks = [],
  ariaLabel,
}: {
  rows: readonly string[];
  axisMax: number;
  ticks: readonly number[];
  bars: readonly GanttBar[];
  marks?: readonly GanttMark[];
  ariaLabel: string;
}) {
  const x = (ms: number) => LEFT + (ms / axisMax) * (W - LEFT - RIGHT);
  const bottom = TOP + rows.length * ROW_H;
  return (
    <svg viewBox={`0 0 ${W} ${bottom + 20}`} className="mx-auto h-auto w-full max-w-[600px] text-foreground" role="img" aria-label={ariaLabel}>
      {rows.map((row, index) => (
        <text key={row} x={LEFT - 6} y={TOP + index * ROW_H + 19} textAnchor="end" fontSize={12} fill="currentColor">{row}</text>
      ))}
      {ticks.map((tick) => (
        <g key={tick}>
          <line x1={x(tick)} x2={x(tick)} y1={TOP - 2} y2={bottom} stroke="#94a3b8" strokeOpacity={0.3} strokeWidth={1} />
          <text x={x(tick)} y={bottom + 14} textAnchor="middle" fontSize={11.5} fill="#64748b">{tick}</text>
        </g>
      ))}
      {marks.map((mark) => (
        <g key={mark.label}>
          <line x1={x(mark.at)} x2={x(mark.at)} y1={TOP - 6} y2={bottom} stroke={mark.color ?? "#16a34a"} strokeWidth={1.25} />
          <text x={x(mark.at)} y={TOP - 10} textAnchor={mark.anchor ?? "middle"} fontSize={12} fontWeight={700} fill={mark.color ?? "#16a34a"}>{mark.label}</text>
        </g>
      ))}
      {bars.map((bar, index) => {
        const y = TOP + bar.row * ROW_H + 3;
        const height = (bar.rowSpan ?? 1) * ROW_H - 6;
        return (
          <g key={index}>
            <rect
              x={x(bar.from)}
              y={y}
              width={x(bar.to) - x(bar.from)}
              height={height}
              rx={3}
              fill={bar.dashed ? "none" : bar.color}
              stroke={bar.dashed ? bar.color : "none"}
              strokeWidth={1}
              strokeDasharray={bar.dashed ? "4 3" : undefined}
            />
            {bar.label && (
              <text x={(x(bar.from) + x(bar.to)) / 2} y={y + height / 2 + 4} textAnchor="middle" fontSize={11.5} fontWeight={600} fill={bar.dashed ? bar.color : "#ffffff"}>
                {bar.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
