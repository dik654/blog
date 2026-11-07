import type { ReactNode } from "react";

const PAD = 14;

/** 두 축의 한 칸 길이가 같은 좌표 평면입니다. 안쪽 그림은 render가 sx, sy로 좌표를 바꿔 그립니다. */
export function Plane({
  minX,
  maxX,
  minY,
  maxY,
  unit,
  label,
  className = "mx-auto h-auto w-full max-w-[240px] sm:max-w-[340px]",
  render,
}: {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  unit: number;
  label: string;
  className?: string;
  render: (sx: (x: number) => number, sy: (y: number) => number) => ReactNode;
}) {
  const sx = (x: number) => PAD + (x - minX) * unit;
  const sy = (y: number) => PAD + (maxY - y) * unit;
  const xs = Array.from({ length: maxX - minX + 1 }, (_, i) => minX + i);
  const ys = Array.from({ length: maxY - minY + 1 }, (_, i) => minY + i);
  return (
    <svg viewBox={`0 0 ${(maxX - minX) * unit + 2 * PAD} ${(maxY - minY) * unit + 2 * PAD}`} className={className} role="img" aria-label={label}>
      {xs.map((x) => (
        <line key={`x${x}`} x1={sx(x)} x2={sx(x)} y1={sy(maxY)} y2={sy(minY)} stroke="#94a3b8" strokeWidth={1} opacity={x === 0 ? 0.9 : 0.2} />
      ))}
      {ys.map((y) => (
        <line key={`y${y}`} x1={sx(minX)} x2={sx(maxX)} y1={sy(y)} y2={sy(y)} stroke="#94a3b8" strokeWidth={1} opacity={y === 0 ? 0.9 : 0.2} />
      ))}
      {render(sx, sy)}
    </svg>
  );
}

/** 화면 좌표로 그리는 화살표입니다. */
export function Arrow({
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
  const length = Math.hypot(x2 - x1, y2 - y1);
  const ux = (x2 - x1) / length;
  const uy = (y2 - y1) / length;
  const size = 7;
  const baseX = x2 - ux * size;
  const baseY = y2 - uy * size;
  const head = `${x2},${y2} ${baseX - uy * 3.5},${baseY + ux * 3.5} ${baseX + uy * 3.5},${baseY - ux * 3.5}`;
  return (
    <g opacity={opacity}>
      <line x1={x1} y1={y1} x2={baseX} y2={baseY} stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "4 3" : undefined} />
      <polygon points={head} fill={color} />
    </g>
  );
}
