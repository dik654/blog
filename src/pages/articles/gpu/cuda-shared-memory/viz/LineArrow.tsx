/** 1.25px 선과 채운 머리로 된 연결 화살표입니다. */
export function LineArrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  const length = Math.hypot(x2 - x1, y2 - y1) || 1;
  const ux = (x2 - x1) / length;
  const uy = (y2 - y1) / length;
  const bx = x2 - ux * 6;
  const by = y2 - uy * 6;
  return (
    <g>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth={1.25} />
      <polygon points={`${x2},${y2} ${bx - uy * 3},${by + ux * 3} ${bx + uy * 3},${by - ux * 3}`} fill={color} />
    </g>
  );
}
