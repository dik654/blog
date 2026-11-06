import { polar, sectorPath } from "./dialGeometry";

const SEEN = "#2563eb";
const UNSEEN = "#dc2626";
const MUTED = "#64748b";

/**
 * 한 RoPE 차원의 각도를 시계 바늘처럼 그립니다.
 * 파란 부채꼴 = 학습 동안 본 각도. seen이 "all"이면 원 전체를 이미 봤다는 뜻입니다.
 * 빨간 점선 부채꼴 = 학습 동안 보지 못한 구간.
 */
export function PhaseDial({
  cx,
  cy,
  radius,
  seen,
  needle,
  needleTwo,
  ghost,
  unseenTo,
  title,
  value,
}: {
  cx: number;
  cy: number;
  radius: number;
  seen: number | "all" | null;
  needle: number;
  needleTwo?: number;
  ghost?: number;
  unseenTo?: number;
  title: string;
  value: string;
}) {
  const tip = polar(cx, cy, radius, needle);
  const tipTwo = needleTwo === undefined ? null : polar(cx, cy, radius, needleTwo);
  const ghostTip = ghost === undefined ? null : polar(cx, cy, radius, ghost);
  return (
    <g>
      <text x={cx} y={cy - radius - 12} textAnchor="middle" fontSize={13} fontWeight={700} fill={MUTED}>{title}</text>
      {seen === "all" && <circle cx={cx} cy={cy} r={radius} fill={SEEN} opacity={0.2} />}
      {typeof seen === "number" && <path d={sectorPath(cx, cy, radius, 0, seen)} fill={SEEN} opacity={0.3} />}
      {unseenTo !== undefined && typeof seen === "number" && (
        <path d={sectorPath(cx, cy, radius, seen, unseenTo)} fill={UNSEEN} fillOpacity={0.1} stroke={UNSEEN} strokeWidth={1} strokeDasharray="3 3" />
      )}
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#94a3b8" strokeWidth={1} />
      {ghostTip && <line x1={cx} y1={cy} x2={ghostTip.x} y2={ghostTip.y} stroke={MUTED} strokeWidth={1} strokeDasharray="3 3" />}
      {tipTwo && <line x1={cx} y1={cy} x2={tipTwo.x} y2={tipTwo.y} stroke="#d97706" strokeWidth={1.25} />}
      <line x1={cx} y1={cy} x2={tip.x} y2={tip.y} stroke="#0f172a" strokeWidth={1.25} className="dark:hidden" />
      <line x1={cx} y1={cy} x2={tip.x} y2={tip.y} stroke="#e2e8f0" strokeWidth={1.25} className="hidden dark:block" />
      <circle cx={cx} cy={cy} r={2.5} fill={MUTED} />
      <text x={cx} y={cy + radius + 20} textAnchor="middle" fontSize={13} fontWeight={700} fill={MUTED}>{value}</text>
    </g>
  );
}
