/** 이 글의 경로 그림이 함께 쓰는 화살표입니다. */
export function Arrow({ x1, y1, x2, y2, color = "#64748b", dashed = false }: { x1: number; y1: number; x2: number; y2: number; color?: string; dashed?: boolean }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 6;
  const left = `${x2 - size * Math.cos(angle - 0.45)},${y2 - size * Math.sin(angle - 0.45)}`;
  const right = `${x2 - size * Math.cos(angle + 0.45)},${y2 - size * Math.sin(angle + 0.45)}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} strokeDasharray={dashed ? "3 3" : undefined} />
      <polygon points={`${x2},${y2} ${left} ${right}`} fill={color} />
    </g>
  );
}

/** 한두 줄 라벨을 가진 상자입니다. */
export function Box({ x, y, w, h = 40, line1, line2, color = "#94a3b8", dim = false, dashed = false, line2Color = "#64748b" }: { x: number; y: number; w: number; h?: number; line1: string; line2?: string; color?: string; dim?: boolean; dashed?: boolean; line2Color?: string }) {
  const middle = y + h / 2;
  return (
    <g opacity={dim ? 0.4 : 1}>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={color} fillOpacity={0.12} stroke={color} strokeWidth={1} strokeDasharray={dashed ? "3 3" : undefined} />
      <text x={x + w / 2} y={line2 ? middle - 3 : middle + 4} textAnchor="middle" fontSize={10.5} fontWeight={700} className="fill-foreground">{line1}</text>
      {line2 && <text x={x + w / 2} y={middle + 11} textAnchor="middle" fontSize={10} fontWeight={700} fill={line2Color}>{line2}</text>}
    </g>
  );
}
