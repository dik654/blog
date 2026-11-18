/** 이 글의 흐름 그림이 함께 쓰는 SVG 조각입니다. 선은 1~1.25px, 색은 hex만 씁니다. */
export function Arrow({ points, color = "#94a3b8", on = false, dashed = false, head = true }: { points: readonly (readonly [number, number])[]; color?: string; on?: boolean; dashed?: boolean; head?: boolean }) {
  const [x2, y2] = points[points.length - 1];
  const [x1, y1] = points[points.length - 2];
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 6;
  const left = `${x2 - size * Math.cos(angle - 0.45)},${y2 - size * Math.sin(angle - 0.45)}`;
  const right = `${x2 - size * Math.cos(angle + 0.45)},${y2 - size * Math.sin(angle + 0.45)}`;
  return (
    <g opacity={on ? 1 : 0.25}>
      <polyline points={points.map(([x, y]) => `${x},${y}`).join(" ")} fill="none" stroke={color} strokeWidth={on ? 1.25 : 1} strokeDasharray={dashed ? "4 3" : undefined} />
      {head && <polygon points={`${x2},${y2} ${left} ${right}`} fill={color} />}
    </g>
  );
}

export function Node({ x, y, w, h, title, on = false, color = "#64748b", dashed = false }: { x: number; y: number; w: number; h: number; title: string; on?: boolean; color?: string; dashed?: boolean }) {
  return (
    <g opacity={on ? 1 : 0.6}>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={color} fillOpacity={on ? 0.14 : 0.05} stroke={color} strokeWidth={on ? 1.25 : 1} strokeDasharray={dashed ? "4 3" : undefined} />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize={11.5} fontWeight={on ? 700 : 500} fill="currentColor">{title}</text>
    </g>
  );
}
