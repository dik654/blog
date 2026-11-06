/** 이 글의 흐름 그림이 함께 쓰는 SVG 조각입니다. 선은 1~1.25px, 색은 hex만 씁니다. */
export function Arrow({ x1, y1, x2, y2, color = "#94a3b8", on = false, dashed = false, head = true }: { x1: number; y1: number; x2: number; y2: number; color?: string; on?: boolean; dashed?: boolean; head?: boolean }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 6;
  const left = `${x2 - size * Math.cos(angle - 0.45)},${y2 - size * Math.sin(angle - 0.45)}`;
  const right = `${x2 - size * Math.cos(angle + 0.45)},${y2 - size * Math.sin(angle + 0.45)}`;
  return (
    <g opacity={on ? 1 : 0.4}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={on ? 1.25 : 1} strokeDasharray={dashed ? "4 3" : undefined} />
      {head && <polygon points={`${x2},${y2} ${left} ${right}`} fill={color} />}
    </g>
  );
}

export function Box({ x, y, w, h, title, sub, color = "#64748b", on = false, dashed = false }: { x: number; y: number; w: number; h: number; title: string; sub?: string; color?: string; on?: boolean; dashed?: boolean }) {
  const cx = x + w / 2;
  return (
    <g opacity={on ? 1 : 0.55}>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={color} fillOpacity={on ? 0.14 : 0.05} stroke={color} strokeWidth={on ? 1.25 : 1} strokeDasharray={dashed ? "4 3" : undefined} />
      <text x={cx} y={sub ? y + h / 2 - 3 : y + h / 2 + 4} textAnchor="middle" fontSize={13} fontWeight={on ? 700 : 500} fill="currentColor">{title}</text>
      {sub && <text x={cx} y={y + h / 2 + 12} textAnchor="middle" fontSize={11.5} fill="currentColor">{sub}</text>}
    </g>
  );
}
