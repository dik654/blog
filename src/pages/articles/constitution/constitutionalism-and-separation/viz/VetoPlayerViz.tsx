import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "한 명이면 승인 구간이 넓음",
    body: "현상유지 q=10, 이상점 5인 사람은 0<x<10을 더 낫다고 봅니다. 경계 0과 10은 같은 거리라 포함하지 않습니다.",
  },
  {
    label: "둘이면 교집합만 남음",
    body: "이상점 7인 사람의 4<x<10을 겹치면 4<x<10만 두 사람이 함께 승인합니다.",
  },
  {
    label: "셋이면 8<x<10으로 좁아짐",
    body: "이상점 9의 승인 구간 8<x<10을 더 교차합니다. 사람 수 자체보다 서로 다른 승인 구간의 교집합이 핵심입니다.",
  },
  {
    label: "현상유지가 사이에 있으면 교집합이 빔",
    body: "q=6에서 이상점 5는 4<x<6, 이상점 7은 6<x<8을 원합니다. 둘 다 더 낫다고 보는 새 위치는 없습니다.",
  },
] as const;

const COLORS = ["#4f46e5", "#d97706", "#9333ea"];
const X0 = 55;
const SPAN = 470;
const toX = (value: number) => X0 + (value / 10) * SPAN;

const SETUPS = [
  { ideals: [5], q: 10 },
  { ideals: [5, 7], q: 10 },
  { ideals: [5, 7, 9], q: 10 },
  { ideals: [5, 7], q: 6 },
] as const;

function approval(ideal: number, statusQuo: number): [number, number] {
  const reflected = 2 * ideal - statusQuo;
  return [Math.min(statusQuo, reflected), Math.max(statusQuo, reflected)];
}

export default function VetoPlayerViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const { ideals, q } = SETUPS[step];
        const ranges = ideals.map((ideal) => approval(ideal, q));
        const low = Math.max(...ranges.map(([start]) => start));
        const high = Math.min(...ranges.map(([, end]) => end));
        const hasWinset = low < high;
        return (
          <svg viewBox="0 0 580 280" role="img" aria-label="거부권자의 승인 구간을 교차해 통과 가능 영역을 구하는 과정">
            <text x="290" y="22" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">
              한 축의 단순 모형 · 새 정책은 모두가 현상유지보다 좋아해야 통과
            </text>
            {ranges.map(([start, end], index) => {
              const y = 48 + index * 46;
              return (
                <g key={`${start}-${end}-${index}`}>
                  <text x="28" y={y + 19} fontSize="9.5" fontWeight="700" fill={COLORS[index]}>P{index + 1}</text>
                  <rect x={toX(start)} y={y + 9} width={toX(end) - toX(start)} height="10" rx="5" fill={COLORS[index]} fillOpacity="0.22" />
                  <circle cx={toX(start)} cy={y + 14} r="4.5" fill="var(--background)" stroke={COLORS[index]} strokeWidth="1.25" />
                  <circle cx={toX(end)} cy={y + 14} r="4.5" fill="var(--background)" stroke={COLORS[index]} strokeWidth="1.25" />
                  <circle cx={toX(ideals[index])} cy={y + 14} r="4" fill={COLORS[index]} />
                  <text x={Math.min(toX(end) - 4, 520)} y={y + 33} textAnchor="end" fontSize="8.5" fill={COLORS[index]}>
                    이상점 {ideals[index]} · {start}&lt;x&lt;{end}
                  </text>
                </g>
              );
            })}
            <line x1={X0} y1="206" x2={X0 + SPAN} y2="206" stroke="#94a3b8" strokeWidth="1.25" />
            {[0, 2, 4, 6, 8, 10].map((tick) => (
              <g key={tick}>
                <line x1={toX(tick)} y1="201" x2={toX(tick)} y2="211" stroke="#94a3b8" strokeWidth="1.25" />
                <text x={toX(tick)} y="225" textAnchor="middle" fontSize="8.5" fill="currentColor" opacity="0.6">{tick}</text>
              </g>
            ))}
            <line x1={toX(q)} y1="40" x2={toX(q)} y2="206" stroke="#64748b" strokeWidth="1.25" strokeDasharray="4 4" />
            <text x={Math.min(toX(q), 520)} y="38" textAnchor={q === 10 ? "end" : "middle"} fontSize="9.5" fontWeight="700" fill="#64748b">현상유지 q={q}</text>
            {hasWinset ? (
              <g>
                <rect x={toX(low)} y="238" width={toX(high) - toX(low)} height="12" rx="6" fill="#059669" fillOpacity="0.24" />
                <circle cx={toX(low)} cy="244" r="5.5" fill="var(--background)" stroke="#059669" strokeWidth="1.25" />
                <circle cx={toX(high)} cy="244" r="5.5" fill="var(--background)" stroke="#059669" strokeWidth="1.25" />
                <text x={(toX(low) + toX(high)) / 2} y="267" textAnchor="middle" fontSize="10" fontWeight="700" fill="#059669">
                  모두 승인: {low}&lt;x&lt;{high}
                </text>
              </g>
            ) : (
              <g>
                <line x1="212" y1="244" x2="368" y2="244" stroke="#dc2626" strokeWidth="1.25" />
                <text x="290" y="267" textAnchor="middle" fontSize="10" fontWeight="700" fill="#dc2626">교집합 없음 · 현상유지 고착</text>
              </g>
            )}
          </svg>
        );
      }}
    </StepViz>
  );
}
