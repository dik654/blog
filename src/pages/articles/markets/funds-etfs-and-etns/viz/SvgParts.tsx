/** 이 글의 SVG Viz가 함께 쓰는 상자와 화살표입니다. */
export function Box({
  x,
  y,
  w,
  h,
  lines,
  tone = "#94a3b8",
  dashed = false,
  fill = "none",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  lines: readonly string[];
  tone?: string;
  dashed?: boolean;
  fill?: string;
}) {
  const startY = y + h / 2 - ((lines.length - 1) * 15) / 2 + 4;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={fill} stroke={tone} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
      {lines.map((line, index) => (
        <text key={line} x={x + w / 2} y={startY + index * 15} textAnchor="middle" fontSize={index === 0 ? 12 : 11} fontWeight={index === 0 ? 700 : 400} fill={index === 0 ? "currentColor" : "#64748b"}>
          {line}
        </text>
      ))}
    </g>
  );
}

export function Arrow({ x1, y1, x2, y2, tone = "#94a3b8", dashed = false }: { x1: number; y1: number; x2: number; y2: number; tone?: string; dashed?: boolean }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 7;
  const a = `${x2 - size * Math.cos(angle - 0.45)},${y2 - size * Math.sin(angle - 0.45)}`;
  const b = `${x2 - size * Math.cos(angle + 0.45)},${y2 - size * Math.sin(angle + 0.45)}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={tone} strokeWidth={1} strokeDasharray={dashed ? "3 3" : undefined} />
      <polygon points={`${x2},${y2} ${a} ${b}`} fill={tone} />
    </g>
  );
}
