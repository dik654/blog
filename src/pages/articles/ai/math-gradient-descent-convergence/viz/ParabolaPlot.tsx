import type { ReactNode } from "react";

/** f(x)=x²/2 곡선을 그리는 공통 좌표입니다. 그 위의 표시는 children이 sx, sy로 얹습니다. */
export default function ParabolaPlot({
  xRange,
  yMax,
  ticks,
  ariaLabel,
  children,
}: {
  xRange: number;
  yMax: number;
  ticks: readonly number[];
  ariaLabel: string;
  children: (sx: (x: number) => number, sy: (y: number) => number, base: number) => ReactNode;
}) {
  const left = 12;
  const right = 348;
  const base = 172;
  const top = 12;
  const sx = (x: number) => left + ((x + xRange) / (2 * xRange)) * (right - left);
  const sy = (y: number) => base - (y / yMax) * (base - top);
  const reach = Math.min(xRange, Math.sqrt(2 * yMax));
  const curve = Array.from({ length: 81 }, (_, index) => {
    const x = -reach + (index / 80) * 2 * reach;
    return `${sx(x).toFixed(1)},${sy((x * x) / 2).toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 360 216" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={ariaLabel}>
      <line x1={left} x2={right} y1={base} y2={base} stroke="#94a3b8" strokeWidth={1} />
      {ticks.map((tick) => (
        <text key={tick} x={sx(tick)} y={base + 38} textAnchor="middle" fontSize={11} fill="#64748b">{tick}</text>
      ))}
      <polyline points={curve} fill="none" stroke="#64748b" strokeWidth={1} />
      {children(sx, sy, base)}
    </svg>
  );
}
