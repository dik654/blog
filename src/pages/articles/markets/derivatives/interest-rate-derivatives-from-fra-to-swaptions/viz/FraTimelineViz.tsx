import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 명목 10억, 계약금리 4%, 실제 기준금리 6%, 기간 0.25년.
 * 기간 말 차액 10억×0.02×0.25 = 500만 원. 결제일에 미리 받으면 500만×(1−0.06×0.25) = 492.5만 원(연준 지침서 식).
 * 대출 이자 10억×0.06×0.25 = 1,500만 원(대출금리 = 기준금리 6%라고 가정), 1,500만 − 500만 = 1,000만 = 10억×0.04×0.25.
 * 492.5만을 6%로 3개월 굴리면 492.5만×1.015 ≈ 499.9만 원(가정) → 1,500만 − 499.9만 ≈ 1,000만.
 */
const W = 360;
const H = 196;
const TICKS = [
  { x: 50, top: "오늘", bottom: "계약" },
  { x: 180, top: "3개월 뒤", bottom: "결제일 · 금리 확정" },
  { x: 310, top: "6개월 뒤", bottom: "대출 기간 끝" },
] as const;

const SCENES = [
  {
    label: "오늘: 4%를 정합니다",
    summary: "명목 10억 · 계약금리 4%",
    note: "3개월 뒤 시작하는 한 기간의 금리를 4%로 정합니다. 명목금액 10억 원은 이자를 계산할 기준일 뿐 서로 주고받지 않습니다(2절).",
  },
  {
    label: "결제일: 6%로 확정",
    summary: "500만 × 0.985 = 492.5만 원",
    note: "실제 기준금리가 6%로 정해지면 기간 말 기준 차액은 10억×0.02×0.25=500만 원입니다. 이 계약, 곧 선도금리계약(FRA)은 기간이 시작되는 결제일에 미리 정산하므로, 연준 지침서 식의 할인계수 1−0.06×0.25=0.985를 곱한 492만 5천 원을 받습니다(변동을 받고 4%를 지급하는 방향).",
  },
  {
    label: "기간 끝: 대출 이자",
    summary: "1,500만 − 약 500만 ≈ 1,000만 원",
    note: "대출금리가 기준금리 6%와 같다면(가정) 3개월 이자는 10억×0.06×0.25=1,500만 원입니다. 결제일에 받은 492만 5천 원을 6%로 3개월 굴리면(가정) 약 499만 9천 원이고, 이를 빼면 약 1,000만 원, 곧 4% 이자입니다. 3절의 단순 기간 말 계산(500만 원)으로 빼면 정확히 1,000만 원입니다.",
  },
] as const;

export default function FraTimelineViz() {
  return (
    <SceneShell
      eyebrow="선도금리계약(FRA)의 시간표"
      title="금리는 3개월 뒤 정해지고, 돈은 결제일과 기간 끝에 움직입니다"
      description="가로축은 시간입니다. 10억·4%·6%·0.25년은 3절의 숫자이고, 대출금리가 기준금리와 같다는 것은 설명을 위한 가정입니다."
      ariaLabel="오늘 4퍼센트 계약, 3개월 뒤 6퍼센트 확정과 492만 5천 원 결제, 6개월 뒤 대출 이자 1,500만 원과 순이자 1,000만 원"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={30} x2={W - 30} y1={96} y2={96} stroke="#94a3b8" strokeWidth={1} />
          <rect x={TICKS[1].x} y={90} width={TICKS[2].x - TICKS[1].x} height={12} rx={2} fill="#2563eb" opacity={0.18} />
          <text x={(TICKS[1].x + TICKS[2].x) / 2} y={86} textAnchor="middle" fontSize={11} fill="#1d4ed8">금리가 적용되는 0.25년</text>
          {TICKS.map((tick, i) => (
            <g key={tick.top} opacity={i <= active ? 1 : 0.35}>
              <circle cx={tick.x} cy={96} r={i === active ? 6 : 4} fill={i === active ? "#2563eb" : "#64748b"} />
              <text x={tick.x} y={120} textAnchor="middle" fontSize={12} fontWeight={700} fill="#334155">{tick.top}</text>
              <text x={tick.x} y={135} textAnchor="middle" fontSize={10} fill="#64748b">{tick.bottom}</text>
            </g>
          ))}

          <g opacity={active === 0 ? 1 : 0.4}>
            <rect x={14} y={22} width={84} height={40} rx={8} fill="none" stroke="#2563eb" strokeWidth={1} />
            <text x={56} y={39} textAnchor="middle" fontSize={11} fill="#334155">계약금리</text>
            <text x={56} y={55} textAnchor="middle" fontSize={14} fontWeight={700} fill="#1d4ed8">4%</text>
          </g>

          {active >= 1 && (
            <g opacity={active === 1 ? 1 : 0.4}>
              <rect x={128} y={22} width={104} height={40} rx={8} fill="none" stroke="#64748b" strokeWidth={1} />
              <text x={180} y={39} textAnchor="middle" fontSize={11} fill="#334155">기준금리 확정</text>
              <text x={180} y={55} textAnchor="middle" fontSize={14} fontWeight={700} fill="#334155">6%</text>
              <line x1={180} x2={180} y1={142} y2={160} stroke="#16a34a" strokeWidth={1.25} />
              <path d="M 180 166 l -5 -7 h 10 z" fill="#16a34a" />
              <text x={180} y={182} textAnchor="middle" fontSize={13} fontWeight={700} fill="#15803d">+492.5만 받음</text>
            </g>
          )}

          {active >= 2 && (
            <g>
              <rect x={258} y={22} width={96} height={40} rx={8} fill="none" stroke="#dc2626" strokeWidth={1} />
              <text x={306} y={39} textAnchor="middle" fontSize={11} fill="#334155">대출 이자(6%)</text>
              <text x={306} y={55} textAnchor="middle" fontSize={14} fontWeight={700} fill="#b91c1c">−1,500만</text>
              <text x={352} y={160} textAnchor="end" fontSize={11} fill="#64748b">결제금을 굴린 값 ≈ +500만(가정)</text>
              <text x={352} y={182} textAnchor="end" fontSize={13} fontWeight={700} fill="#1d4ed8">순 ≈ −1,000만 = 4%</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
