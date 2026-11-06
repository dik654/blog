/** 두 점을 잇는 1.25px 화살표입니다. 머리는 끝점에 닿습니다. */
export default function SvgArrow({
  x1,
  y1,
  x2,
  y2,
  color,
  dashed = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  dashed?: boolean;
}) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const ux = Math.cos(angle);
  const uy = Math.sin(angle);
  const baseX = x2 - ux * 7;
  const baseY = y2 - uy * 7;
  const head = `M ${x2} ${y2} L ${baseX - uy * 4} ${baseY + ux * 4} L ${baseX + uy * 4} ${baseY - ux * 4} Z`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={baseX} y2={baseY} stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "3 3" : undefined} />
      <path d={head} fill={color} />
    </g>
  );
}
