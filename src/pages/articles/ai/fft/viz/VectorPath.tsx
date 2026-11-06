export interface PathStep {
  dx: number;
  dy: number;
  label: string;
}

/** 머리에서 꼬리로 이어 붙인 화살표 한 개입니다. 선은 1.25px, 머리는 채운 삼각형입니다. */
export function Arrow({ x1, y1, x2, y2, color, dashed = false }: { x1: number; y1: number; x2: number; y2: number; color: string; dashed?: boolean }) {
  const length = Math.hypot(x2 - x1, y2 - y1) || 1;
  const ux = (x2 - x1) / length;
  const uy = (y2 - y1) / length;
  const head = 6;
  const bx = x2 - ux * head;
  const by = y2 - uy * head;
  return (
    <g>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "4 3" : undefined} />
      <polygon points={`${x2},${y2} ${bx - uy * 3},${by + ux * 3} ${bx + uy * 3},${by - ux * 3}`} fill={color} />
    </g>
  );
}

/**
 * 가로·세로 평면에 값들을 차례로 이어 붙입니다. 끝점이 곧 합입니다.
 * dy는 위쪽이 양수입니다. stagger는 같은 선 위 화살표가 겹치지 않게 화면에서만 아래로 미는 픽셀입니다.
 */
export default function VectorPath({
  steps,
  width,
  height,
  originX,
  originY,
  unit,
  stagger = 0,
  stepColor = "#64748b",
  endLabel,
  endBelow,
  ariaLabel,
}: {
  steps: readonly PathStep[];
  width: number;
  height: number;
  originX: number;
  originY: number;
  unit: number;
  stagger?: number;
  stepColor?: string;
  endLabel: string;
  endBelow?: boolean;
  ariaLabel: string;
}) {
  const points = steps.reduce<{ x: number; y: number }[]>(
    (acc, step) => {
      const last = acc[acc.length - 1];
      return [...acc, { x: last.x + step.dx, y: last.y + step.dy }];
    },
    [{ x: 0, y: 0 }],
  );
  const px = (x: number) => originX + x * unit;
  const py = (y: number) => originY - y * unit;
  const end = points[points.length - 1];
  const endsAtOrigin = end.x === 0 && end.y === 0;
  const labelBelow = endBelow ?? end.y < 0;
  const endX = px(end.x);
  const endAnchor = end.x < 0 || endX > width - 60 ? "end" : "start";
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={ariaLabel}>
      <line x1={8} x2={width - 8} y1={originY} y2={originY} stroke="#94a3b8" strokeWidth={1} />
      <line x1={originX} x2={originX} y1={6} y2={height - 6} stroke="#94a3b8" strokeWidth={1} />
      <text x={width - 8} y={originY + 14} textAnchor="end" fontSize={11} fill="#64748b">가로</text>
      <text x={originX + 5} y={15} fontSize={11} fill="#64748b">세로</text>
      {steps.map((step, index) => {
        const from = points[index];
        const to = points[index + 1];
        const shift = index * stagger;
        const along = step.dx !== 0 && step.dy !== 0 ? 0.3 : 0.5;
        const midX = px(from.x) + (px(to.x) - px(from.x)) * along;
        const midY = py(from.y) + (py(to.y) - py(from.y)) * along + shift;
        const horizontal = step.dy === 0;
        const diagonal = step.dx !== 0 && step.dy !== 0;
        return (
          <g key={index}>
            <Arrow x1={px(from.x)} y1={py(from.y) + shift} x2={px(to.x)} y2={py(to.y) + shift} color={stepColor} />
            <text
              x={horizontal ? midX : midX + (diagonal ? 10 : 9)}
              y={horizontal ? (from.y < 0 ? midY + 13 : midY - 4) : midY + 4}
              textAnchor={horizontal ? "middle" : "start"}
              fontSize={11}
              fontWeight={700}
              fill="#64748b"
            >
              {step.label}
            </text>
          </g>
        );
      })}
      {stagger > 0 && <line x1={endX} x2={endX} y1={py(end.y)} y2={py(end.y) + (steps.length - 1) * stagger} stroke="#2563eb" strokeWidth={1} strokeDasharray="2 2" />}
      {!endsAtOrigin && <Arrow x1={px(0)} y1={py(0)} x2={px(end.x)} y2={py(end.y)} color="#2563eb" dashed />}
      <circle cx={px(end.x)} cy={py(end.y)} r={3.5} fill="#2563eb" />
      <text
        x={endX + (endAnchor === "end" ? -6 : 6)}
        y={py(end.y) + (labelBelow ? 18 : -9)}
        textAnchor={endAnchor}
        fontSize={12}
        fontWeight={700}
        fill="#2563eb"
      >
        {endLabel}
      </text>
    </svg>
  );
}
