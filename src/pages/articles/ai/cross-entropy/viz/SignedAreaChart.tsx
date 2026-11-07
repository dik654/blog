/**
 * KL 항을 부호 있는 넓이로 그리는 공용 그림. 폭=평균을 내는 분포의 비중, 높이=로그 비율, 넓이=그 항의 기여.
 * 높이가 무한대인 항은 눈금에 맞춘 길이 대신 위가 열린 점선 기둥으로, 폭이 0인 항은 세로 점선으로 그린다.
 */
export interface SignedColumn {
  name: string;
  weight: number;
  height: number | "infinite";
  contribution: string;
}

const X0 = 30;
const WIDTH = 300;
const ZERO_Y = 92;
const UNIT = 34;
const TOP = 18;

export default function SignedAreaChart({ columns, ariaLabel }: { columns: readonly SignedColumn[]; ariaLabel: string }) {
  const xs = columns.map((_, index) => X0 + WIDTH * columns.slice(0, index).reduce<number>((sum, column) => sum + column.weight, 0));
  return (
    <svg viewBox="0 0 360 188" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={ariaLabel}>
      {columns.map((column, index) => {
        const x = xs[index];
        const w = WIDTH * column.weight;
        const center = x + w / 2;
        const labelX = Math.min(Math.max(center, X0 + 22), X0 + WIDTH - 8);
        const nameLabel = (
          <text x={labelX} y={182} textAnchor={column.weight < 0.2 && index > 0 ? "end" : "middle"} fontSize={12} fill="#64748b">
            {`${column.name} · 폭 ${column.weight}`}
          </text>
        );
        if (column.weight === 0) {
          return (
            <g key={column.name}>
              <line x1={x} x2={x} y1={TOP} y2={ZERO_Y + 56} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
              <text x={x - 6} y={TOP + 12} textAnchor="end" fontSize={12} fontWeight={700} fill="#64748b">{column.contribution}</text>
              {nameLabel}
            </g>
          );
        }
        if (column.height === "infinite") {
          return (
            <g key={column.name}>
              <path d={`M${x + 1} ${TOP} V${ZERO_Y} H${x + w - 1} V${TOP}`} fill="#dc2626" fillOpacity={0.12} stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
              <text x={center} y={ZERO_Y - 26} textAnchor="middle" fontSize={18} fontWeight={700} fill="#dc2626">∞</text>
              {nameLabel}
            </g>
          );
        }
        const size = Math.abs(column.height) * UNIT;
        const positive = column.height >= 0;
        return (
          <g key={column.name}>
            {size > 0 && (
              <rect x={x + 1} y={positive ? ZERO_Y - size : ZERO_Y} width={w - 2} height={size} fill={positive ? "#d97706" : "#16a34a"} fillOpacity={0.3} stroke={positive ? "#d97706" : "#16a34a"} strokeWidth={1} />
            )}
            <text x={labelX} y={positive ? ZERO_Y - size - 5 : ZERO_Y + size + 14} textAnchor={column.weight < 0.2 && index > 0 ? "end" : "middle"} fontSize={13} fontWeight={700} fill={positive ? "#b45309" : "#15803d"}>
              {column.contribution}
            </text>
            {nameLabel}
          </g>
        );
      })}
      <line x1={X0} x2={X0 + WIDTH} y1={ZERO_Y} y2={ZERO_Y} stroke="#94a3b8" strokeWidth={1} />
    </svg>
  );
}
