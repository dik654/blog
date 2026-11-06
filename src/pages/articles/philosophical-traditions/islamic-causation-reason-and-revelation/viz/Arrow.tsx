/** 두 점을 잇는 얇은 화살표입니다. 끝에 작은 머리를 직접 그려 marker id가 겹치지 않게 합니다. */
export default function Arrow({
  x1,
  y1,
  x2,
  y2,
  color,
  dashed = false,
  opacity = 1,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  dashed?: boolean;
  opacity?: number;
}) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = 6;
  const a = { x: x2 - head * Math.cos(angle - 0.5), y: y2 - head * Math.sin(angle - 0.5) };
  const b = { x: x2 - head * Math.cos(angle + 0.5), y: y2 - head * Math.sin(angle + 0.5) };
  return (
    <g opacity={opacity} fill="none" stroke={color} strokeWidth={1.25}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} strokeDasharray={dashed ? "4 3" : undefined} />
      <path d={`M${a.x} ${a.y}L${x2} ${y2}L${b.x} ${b.y}`} />
    </g>
  );
}
