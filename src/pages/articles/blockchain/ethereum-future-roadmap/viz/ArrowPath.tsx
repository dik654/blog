/** 꺾인 선과 끝 화살촉을 함께 그립니다. 마지막 구간의 방향으로 촉을 돌립니다. */
export default function ArrowPath({
  points,
  color,
  dashed = false,
  width = 1,
  opacity = 1,
}: {
  points: readonly (readonly [number, number])[];
  color: string;
  dashed?: boolean;
  width?: number;
  opacity?: number;
}) {
  const [x1, y1] = points[points.length - 2];
  const [x2, y2] = points[points.length - 1];
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = [angle + 2.6, angle - 2.6].map((a) => `${x2 + 7 * Math.cos(a)},${y2 + 7 * Math.sin(a)}`);
  return (
    <g opacity={opacity}>
      <polyline points={points.map((p) => p.join(",")).join(" ")} fill="none" stroke={color} strokeWidth={width} strokeDasharray={dashed ? "3 3" : undefined} />
      <polygon points={`${x2},${y2} ${head[0]} ${head[1]}`} fill={color} />
    </g>
  );
}
