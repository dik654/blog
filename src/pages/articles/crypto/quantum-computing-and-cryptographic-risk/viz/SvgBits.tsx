/** 이 글의 SVG Viz가 함께 쓰는 상자와 화살표입니다. */
export function Arrow({ x1, y1, x2, y2, color = "#64748b", dashed = false }: { x1: number; y1: number; x2: number; y2: number; color?: string; dashed?: boolean }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 7;
  const head = [angle - 0.45, angle + 0.45].map((a) => `${(x2 - size * Math.cos(a)).toFixed(1)},${(y2 - size * Math.sin(a)).toFixed(1)}`);
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "4 3" : undefined} />
      <polyline points={`${head[0]} ${x2},${y2} ${head[1]}`} fill="none" stroke={color} strokeWidth={1.25} />
    </g>
  );
}

export function Box({
  x,
  y,
  w,
  h,
  text,
  sub,
  color = "#64748b",
  live = true,
  dashed = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  sub?: string;
  color?: string;
  live?: boolean;
  dashed?: boolean;
}) {
  return (
    <g opacity={live ? 1 : 0.4}>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={live ? `${color}1a` : "none"} stroke={color} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 3 : h / 2 + 5)} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>
        {text}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" fontSize={12} fill={color}>
          {sub}
        </text>
      )}
    </g>
  );
}
