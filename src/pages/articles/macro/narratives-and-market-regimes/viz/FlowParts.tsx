/** 이 글의 흐름 그림이 함께 쓰는 상자와 화살표입니다. */
export function FlowBox({
  x,
  y,
  w,
  h,
  lines,
  color,
  dashed = false,
  dim = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  lines: readonly string[];
  color: string;
  dashed?: boolean;
  dim?: boolean;
}) {
  const lineHeight = 15;
  const first = y + h / 2 - ((lines.length - 1) * lineHeight) / 2 + 4;
  return (
    <g opacity={dim ? 0.32 : 1}>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="none" stroke={color} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
      {lines.map((line, index) => (
        <text key={line} x={x + w / 2} y={first + index * lineHeight} textAnchor="middle" fontSize={12} fontWeight={dim ? 400 : 700} fill={color}>
          {line}
        </text>
      ))}
    </g>
  );
}

export function FlowArrow({
  points,
  color,
  dashed = false,
  dim = false,
}: {
  points: readonly (readonly [number, number])[];
  color: string;
  dashed?: boolean;
  dim?: boolean;
}) {
  const [tipX, tipY] = points[points.length - 1];
  const [fromX, fromY] = points[points.length - 2];
  const angle = Math.atan2(tipY - fromY, tipX - fromX);
  const head = [angle + 2.6, angle - 2.6].map((a) => `${tipX + Math.cos(a) * 7},${tipY + Math.sin(a) * 7}`);
  return (
    <g opacity={dim ? 0.32 : 1}>
      <polyline points={points.map(([x, y]) => `${x},${y}`).join(" ")} fill="none" stroke={color} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
      <polygon points={`${tipX},${tipY} ${head.join(" ")}`} fill={color} />
    </g>
  );
}
