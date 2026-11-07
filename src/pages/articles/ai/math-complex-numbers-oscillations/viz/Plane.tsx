import type { ReactNode } from "react";

export interface PlaneMap {
  x: (value: number) => number;
  y: (value: number) => number;
  unit: number;
}

/** 이 글의 좌표평면 Viz가 함께 쓰는 축. 두 축의 한 칸 길이는 언제나 같다. */
export function Plane({
  width,
  height,
  originX,
  originY,
  unit,
  xTicks = [],
  yTicks = [],
  xLabel = "가로",
  yLabel = "세로",
  ariaLabel,
  maxWidth = "max-w-[520px]",
  render,
}: {
  width: number;
  height: number;
  originX: number;
  originY: number;
  unit: number;
  xTicks?: readonly number[];
  yTicks?: readonly number[];
  xLabel?: string;
  yLabel?: string;
  ariaLabel: string;
  maxWidth?: string;
  render: (map: PlaneMap) => ReactNode;
}) {
  const map: PlaneMap = {
    x: (value) => originX + value * unit,
    y: (value) => originY - value * unit,
    unit,
  };
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={`mx-auto block h-auto w-full ${maxWidth}`} role="img" aria-label={ariaLabel}>
      <line x1={6} x2={width - 6} y1={originY} y2={originY} stroke="#94a3b8" strokeWidth={1} />
      <line x1={originX} x2={originX} y1={6} y2={height - 6} stroke="#94a3b8" strokeWidth={1} />
      {xTicks.map((tick) => (
        <g key={`x${tick}`}>
          <line x1={map.x(tick)} x2={map.x(tick)} y1={originY - 3} y2={originY + 3} stroke="#94a3b8" strokeWidth={1} />
          <text x={map.x(tick)} y={originY + 15} textAnchor="middle" fontSize={11} fill="#64748b">{tick < 0 ? `−${-tick}` : tick}</text>
        </g>
      ))}
      {yTicks.map((tick) => (
        <g key={`y${tick}`}>
          <line x1={originX - 3} x2={originX + 3} y1={map.y(tick)} y2={map.y(tick)} stroke="#94a3b8" strokeWidth={1} />
          <text x={originX - 6} y={map.y(tick) + 4} textAnchor="end" fontSize={11} fill="#64748b">{tick < 0 ? `−${-tick}` : tick}</text>
        </g>
      ))}
      <text x={width - 8} y={originY - 6} textAnchor="end" fontSize={11} fill="#64748b">{xLabel}</text>
      <text x={originX + 6} y={16} fontSize={11} fill="#64748b">{yLabel}</text>
      {render(map)}
    </svg>
  );
}

/** 끝에 작은 삼각형이 달린 화살표. 좌표는 SVG 좌표로 받는다. */
export function Arrow({ x1, y1, x2, y2, color, dashed = false, opacity = 1 }: { x1: number; y1: number; x2: number; y2: number; color: string; dashed?: boolean; opacity?: number }) {
  const length = Math.hypot(x2 - x1, y2 - y1);
  if (length < 0.5) return null;
  const ux = (x2 - x1) / length;
  const uy = (y2 - y1) / length;
  const size = Math.min(6, length * 0.5);
  const bx = x2 - ux * size;
  const by = y2 - uy * size;
  const px = -uy * size * 0.5;
  const py = ux * size * 0.5;
  return (
    <g opacity={opacity}>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "3 3" : undefined} />
      <polygon points={`${x2},${y2} ${bx + px},${by + py} ${bx - px},${by - py}`} fill={color} />
    </g>
  );
}

/** 머리꼬리로 이은 벡터 덧셈. 시작점과 각 항을 평면 좌표로 받아 그린다. */
export function TipToTail({ map, terms, colors, start = [0, 0], shift = 0 }: { map: PlaneMap; terms: readonly (readonly [number, number])[]; colors: readonly string[]; start?: readonly [number, number]; shift?: number }) {
  const points = terms.reduce<(readonly [number, number])[]>((acc, [dx, dy]) => {
    const [px, py] = acc[acc.length - 1];
    return [...acc, [px + dx, py + dy]];
  }, [start]);
  return (
    <g>
      {terms.map((_, index) => {
        const [ax, ay] = points[index];
        const [bx, by] = points[index + 1];
        const offset = shift * index;
        return <Arrow key={index} x1={map.x(ax)} y1={map.y(ay) + offset} x2={map.x(bx)} y2={map.y(by) + offset} color={colors[index % colors.length]} />;
      })}
    </g>
  );
}
