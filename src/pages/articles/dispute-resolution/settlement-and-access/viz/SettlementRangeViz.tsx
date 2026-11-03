import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "M이 1,200만원을 요구함",
    body: "청구액 1,200만원은 협상의 출발점일 뿐입니다. M은 포기·합의·재판 중 하나를 고르고, V도 합의·재판 중 하나를 고릅니다.",
  },
  {
    label: "M의 재판 대안값은 456만원",
    body: "0.90×0.70×1,200만원−300만원=456만원입니다. 이 단순 모형에서 M은 그보다 낮은 제안을 받느니 재판하는 편이 낫습니다.",
  },
  {
    label: "V의 재판 대안값은 848만원",
    body: "0.90×0.60×1,200만원+200만원=848만원입니다. V는 그보다 많이 지급하느니 재판하는 편이 낫습니다.",
  },
  {
    label: "456만~848만원이 겹침",
    body: "둘이 동시에 받아들일 수 있는 범위가 열립니다. 범위가 있다는 것만 알 수 있고, 실제 합의금이나 공정한 금액이 자동으로 정해지는 것은 아닙니다.",
  },
] as const;

const C = {
  claim: "#7c3aed",
  owner: "#0284c7",
  vendor: "#d97706",
  overlap: "#059669",
  muted: "#64748b",
  danger: "#dc2626",
} as const;

const CLAIM = 12;
const M_MIN = 4.56;
const V_MAX = 8.48;
const x = (value: number, start: number, span: number) => start + (value / CLAIM) * span;

function MobileRange({ step }: { step: number }) {
  return (
    <svg className="block sm:!hidden" viewBox="0 0 360 430" role="img" aria-label="가게 주인 M과 경보기 업체 V의 합의 범위를 계산하는 모바일 도식">
      <rect x="42" y="18" width="276" height="64" rx="11" fill="#7c3aed12" stroke={C.claim} strokeWidth="1.2" />
      <text x="180" y="42" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.claim}>M의 청구액 1,200만원</text>
      <text x="180" y="62" textAnchor="middle" fontSize="9.4" fill="currentColor">이 금액이 곧 합의금은 아님</text>

      <line x1="38" y1="126" x2="322" y2="126" stroke={C.muted} strokeWidth="1.2" />
      {[0, 4, 8, 12].map((tick) => {
        const tx = x(tick, 38, 284);
        return <g key={tick}><line x1={tx} y1="120" x2={tx} y2="132" stroke={C.muted} strokeWidth="1.2" /><text x={tx} y="148" textAnchor="middle" fontSize="9" fill={C.muted}>{tick === 0 ? "0" : `${tick}백만`}</text></g>;
      })}

      {step >= 1 && (
        <g>
          <line x1={x(M_MIN, 38, 284)} y1="98" x2={x(M_MIN, 38, 284)} y2="174" stroke={C.owner} strokeWidth="1.2" />
          <circle cx={x(M_MIN, 38, 284)} cy="98" r="4" fill={C.owner} />
          <text x={x(M_MIN, 38, 284)} y="88" textAnchor="middle" fontSize="9.4" fontWeight="700" fill={C.owner}>M 최저 456만</text>
        </g>
      )}
      {step >= 2 && (
        <g>
          <line x1={x(V_MAX, 38, 284)} y1="108" x2={x(V_MAX, 38, 284)} y2="184" stroke={C.vendor} strokeWidth="1.2" />
          <circle cx={x(V_MAX, 38, 284)} cy="184" r="4" fill={C.vendor} />
          <text x={x(V_MAX, 38, 284)} y="202" textAnchor="middle" fontSize="9.4" fontWeight="700" fill={C.vendor}>V 최고 848만</text>
        </g>
      )}
      {step >= 3 && (
        <g>
          <rect x={x(M_MIN, 38, 284)} y="112" width={x(V_MAX, 38, 284) - x(M_MIN, 38, 284)} height="28" rx="6" fill="#05966924" stroke={C.overlap} strokeWidth="1.2" />
          <text x={(x(M_MIN, 38, 284) + x(V_MAX, 38, 284)) / 2} y="130" textAnchor="middle" fontSize="9.2" fontWeight="700" fill={C.overlap}>합의 가능</text>
        </g>
      )}

      <rect x="32" y="230" width="296" height="70" rx="11" fill={step === 1 ? "#0284c712" : "#64748b0d"} stroke={step === 1 ? C.owner : "#cbd5e1"} strokeWidth="1.2" />
      <text x="180" y="254" textAnchor="middle" fontSize="9.8" fontWeight="700" fill={step === 1 ? C.owner : "currentColor"}>M: 0.90 × 0.70 × 12 − 3 = 4.56</text>
      <text x="180" y="274" textAnchor="middle" fontSize="9.2" fill="currentColor">미래 판결 기대액에서 자기 부담을 뺌</text>
      <text x="180" y="291" textAnchor="middle" fontSize="8.9" fill={C.muted}>단위: 백만원</text>

      <rect x="32" y="314" width="296" height="70" rx="11" fill={step === 2 ? "#d9770612" : "#64748b0d"} stroke={step === 2 ? C.vendor : "#cbd5e1"} strokeWidth="1.2" />
      <text x="180" y="338" textAnchor="middle" fontSize="9.8" fontWeight="700" fill={step === 2 ? C.vendor : "currentColor"}>V: 0.90 × 0.60 × 12 + 2 = 8.48</text>
      <text x="180" y="358" textAnchor="middle" fontSize="9.2" fill="currentColor">예상 지급액에 피할 수 있는 자기 부담을 더함</text>
      <text x="180" y="375" textAnchor="middle" fontSize="8.9" fill={C.muted}>M이 이길 확률을 V가 60%로 봄</text>

      <text x="180" y="416" textAnchor="middle" fontSize="9.6" fontWeight="700" fill={step === 3 ? C.overlap : C.danger}>
        {step === 3 ? "겹침은 가능한 범위이지 공정한 정답이 아닙니다" : "청구액과 실제 협상 범위를 구별합니다"}
      </text>
    </svg>
  );
}

export default function SettlementRangeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <>
          <MobileRange step={step} />
          <svg className="!hidden sm:!block" viewBox="0 0 700 320" role="img" aria-label="가게 주인 M과 경보기 업체 V의 합의 범위를 계산하는 도식">
            <rect x="28" y="34" width="170" height="68" rx="12" fill="#7c3aed12" stroke={C.claim} strokeWidth="1.2" />
            <text x="113" y="60" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.claim}>M의 청구액 1,200만원</text>
            <text x="113" y="81" textAnchor="middle" fontSize="9.2" fill="currentColor">출발점이지 합의금이 아님</text>

            <line x1="246" y1="108" x2="666" y2="108" stroke={C.muted} strokeWidth="1.2" />
            {[0, 3, 6, 9, 12].map((tick) => {
              const tx = x(tick, 246, 420);
              return <g key={tick}><line x1={tx} y1="102" x2={tx} y2="114" stroke={C.muted} strokeWidth="1.2" /><text x={tx} y="130" textAnchor="middle" fontSize="8.9" fill={C.muted}>{tick === 0 ? "0" : `${tick}백만`}</text></g>;
            })}

            {step >= 1 && <g><line x1={x(M_MIN, 246, 420)} y1="72" x2={x(M_MIN, 246, 420)} y2="154" stroke={C.owner} strokeWidth="1.2" /><circle cx={x(M_MIN, 246, 420)} cy="72" r="4" fill={C.owner} /><text x={x(M_MIN, 246, 420)} y="61" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={C.owner}>M 최저 456만원</text></g>}
            {step >= 2 && <g><line x1={x(V_MAX, 246, 420)} y1="82" x2={x(V_MAX, 246, 420)} y2="164" stroke={C.vendor} strokeWidth="1.2" /><circle cx={x(V_MAX, 246, 420)} cy="164" r="4" fill={C.vendor} /><text x={x(V_MAX, 246, 420)} y="183" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={C.vendor}>V 최고 848만원</text></g>}
            {step >= 3 && <g><rect x={x(M_MIN, 246, 420)} y="94" width={x(V_MAX, 246, 420) - x(M_MIN, 246, 420)} height="28" rx="6" fill="#05966924" stroke={C.overlap} strokeWidth="1.2" /><text x={(x(M_MIN, 246, 420) + x(V_MAX, 246, 420)) / 2} y="112" textAnchor="middle" fontSize="9.3" fontWeight="700" fill={C.overlap}>합의 가능 범위</text></g>}

            <rect x="34" y="202" width="292" height="76" rx="12" fill={step === 1 ? "#0284c712" : "#64748b0d"} stroke={step === 1 ? C.owner : "#cbd5e1"} strokeWidth="1.2" />
            <text x="180" y="228" textAnchor="middle" fontSize="10.2" fontWeight="700" fill={step === 1 ? C.owner : "currentColor"}>M: 0.90 × 0.70 × 12 − 3 = 4.56</text>
            <text x="180" y="250" textAnchor="middle" fontSize="9.3" fill="currentColor">미래 판결 기대액 − M의 소송부담</text>
            <text x="180" y="268" textAnchor="middle" fontSize="8.8" fill={C.muted}>단위: 백만원</text>

            <rect x="374" y="202" width="292" height="76" rx="12" fill={step === 2 ? "#d9770612" : "#64748b0d"} stroke={step === 2 ? C.vendor : "#cbd5e1"} strokeWidth="1.2" />
            <text x="520" y="228" textAnchor="middle" fontSize="10.2" fontWeight="700" fill={step === 2 ? C.vendor : "currentColor"}>V: 0.90 × 0.60 × 12 + 2 = 8.48</text>
            <text x="520" y="250" textAnchor="middle" fontSize="9.3" fill="currentColor">예상 지급액 + 피할 수 있는 V의 소송부담</text>
            <text x="520" y="268" textAnchor="middle" fontSize="8.8" fill={C.muted}>V가 보는 M 승소 가능성 60%</text>

            <text x="350" y="307" textAnchor="middle" fontSize="10" fontWeight="700" fill={step === 3 ? C.overlap : C.danger}>
              {step === 3 ? "겹침은 가능한 협상 범위이지 공정한 금액의 자동 답이 아닙니다" : "청구액 → 각자의 재판 대안값 → 겹치는 범위 순서로 봅니다"}
            </text>
          </svg>
        </>
      )}
    </StepViz>
  );
}
