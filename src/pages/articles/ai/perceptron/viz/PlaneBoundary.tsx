/**
 * 두 입력 평면 위에 점과 결정 경계 w₁x₁+w₂x₂+b=0을 그리는 SVG 조각입니다.
 * 1로 판정하는 반평면(z>0)만 옅게 칠하고, 점의 색은 정답, 빨간 테두리는 오답을 뜻합니다.
 */

type Vec = readonly [number, number];

export interface PlaneLine {
  w1: number;
  w2: number;
  b: number;
}

export interface PlanePoint {
  x: number;
  y: number;
  /** 이 점이 받아야 할 정답 */
  target: 0 | 1;
  /** 점 옆에 적을 짧은 글자 */
  tag: string;
  /** 태그를 점의 어느 쪽에 둘지 */
  tagSide?: "above" | "below";
}

const ONE = "#059669";
const ZERO = "#64748b";
const WRONG = "#dc2626";
const LINE = "#2563eb";
const AXIS = "#94a3b8";

function clipHalfPlane(corners: readonly Vec[], line: PlaneLine): Vec[] {
  const f = (p: Vec) => line.w1 * p[0] + line.w2 * p[1] + line.b;
  return corners.flatMap((p, index) => {
    const q = corners[(index + 1) % corners.length];
    const fp = f(p);
    const fq = f(q);
    const own: Vec[] = fp > 0 ? [p] : [];
    const t = fp / (fp - fq);
    const cross: Vec[] = fp * fq < 0 ? [[p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]] : [];
    return [...own, ...cross];
  });
}

function lineSegment(corners: readonly Vec[], line: PlaneLine): Vec[] {
  const f = (p: Vec) => line.w1 * p[0] + line.w2 * p[1] + line.b;
  return corners.flatMap((p, index) => {
    const q = corners[(index + 1) % corners.length];
    const fp = f(p);
    const fq = f(q);
    if (fp * fq >= 0) return [];
    const t = fp / (fp - fq);
    return [[p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])] as Vec];
  });
}

export default function PlaneBoundary({
  left,
  top,
  size,
  lo,
  hi,
  axisX,
  axisY,
  line,
  oldLine,
  points,
}: {
  left: number;
  top: number;
  size: number;
  lo: number;
  hi: number;
  axisX: string;
  axisY: string;
  line: PlaneLine | null;
  oldLine?: PlaneLine | null;
  points: readonly PlanePoint[];
}) {
  const sx = (x: number) => left + ((x - lo) / (hi - lo)) * size;
  const sy = (y: number) => top + size - ((y - lo) / (hi - lo)) * size;
  const corners: readonly Vec[] = [
    [lo, lo],
    [hi, lo],
    [hi, hi],
    [lo, hi],
  ];
  const region = line ? clipHalfPlane(corners, line) : [];
  const seg = line ? lineSegment(corners, line) : [];
  const oldSeg = oldLine ? lineSegment(corners, oldLine) : [];
  const zOf = (p: PlanePoint) => (line ? line.w1 * p.x + line.w2 * p.y + line.b : null);

  return (
    <g>
      <rect x={left} y={top} width={size} height={size} fill="none" stroke={AXIS} strokeWidth={1} />
      {region.length > 2 && (
        <polygon points={region.map(([x, y]) => `${sx(x)},${sy(y)}`).join(" ")} fill={ONE} fillOpacity={0.1} />
      )}
      <line x1={sx(0)} x2={sx(0)} y1={top} y2={top + size} stroke={AXIS} strokeWidth={0.75} strokeDasharray="2 3" />
      <line x1={left} x2={left + size} y1={sy(0)} y2={sy(0)} stroke={AXIS} strokeWidth={0.75} strokeDasharray="2 3" />
      <text x={left} y={top + size + 15} fontSize={11} fill={ZERO}>
        가로 {axisX} · 세로 {axisY}
      </text>
      {oldSeg.length === 2 && (
        <line x1={sx(oldSeg[0][0])} y1={sy(oldSeg[0][1])} x2={sx(oldSeg[1][0])} y2={sy(oldSeg[1][1])} stroke={AXIS} strokeWidth={1} strokeDasharray="4 3" />
      )}
      {seg.length === 2 && (
        <line x1={sx(seg[0][0])} y1={sy(seg[0][1])} x2={sx(seg[1][0])} y2={sy(seg[1][1])} stroke={LINE} strokeWidth={1.25} />
      )}
      {points.map((p) => {
        const z = zOf(p);
        const wrong = z !== null && (z > 0 ? 1 : 0) !== p.target;
        const color = p.target === 1 ? ONE : ZERO;
        const below = p.tagSide === "below";
        return (
          <g key={p.tag}>
            <circle cx={sx(p.x)} cy={sy(p.y)} r={7} fill={p.target === 1 ? color : "none"} fillOpacity={0.9} stroke={wrong ? WRONG : color} strokeWidth={wrong ? 1.25 : 1} />
            {wrong && <circle cx={sx(p.x)} cy={sy(p.y)} r={11} fill="none" stroke={WRONG} strokeWidth={1.25} />}
            <text x={sx(p.x)} y={below ? sy(p.y) + 24 : sy(p.y) - 16} textAnchor="middle" fontSize={10} fill={wrong ? WRONG : ZERO}>
              {p.tag}
            </text>
          </g>
        );
      })}
    </g>
  );
}
