import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "네 문턱을 모두 통과할 확률은 0.30",
    body: "적발 0.50 × 신원 확인 0.80 × 유죄 판단 0.75 × 집행 1.00을 차례로 곱합니다. 앞 단계를 통과해야 다음 단계로 가므로 더하지 않습니다.",
  },
  {
    label: "법정 제재 S를 같은 단위의 부담 D(S)=30으로 바꿈",
    body: "징역 연수와 물건의 이익을 곧장 비교할 수 없습니다. 제재가 H에게 주는 부담을 이익과 같은 효용 단위로 바꿨다는 학습용 가정입니다.",
  },
  {
    label: "기대 제재 9를 이익 8과 비교하면 기대효용은 -1",
    body: "0.30 × 30 = 9이고 8 - 9 = -1입니다. 정확한 확률을 알고 위험에 중립적인 H라는 가정에서만 하지 않는 쪽이 낫다는 판정이 나옵니다.",
  },
  {
    label: "같은 기대 제재도 같은 정책은 아님",
    body: "확률 0.30·부담 30과 확률 0.05·부담 180은 모두 기대 제재 9를 만듭니다. 그러나 인식, 오판 피해, 집행 비용, 비례성과 한계 억제가 달라 서로 바꿔 쓸 수 없습니다.",
  },
] as const;

const C = {
  detect: "#4f46e5",
  identify: "#7c3aed",
  convict: "#0284c7",
  execute: "#0891b2",
  cost: "#dc2626",
  gain: "#d97706",
  ok: "#059669",
  muted: "#64748b",
} as const;

const probabilities = [
  { short: "적발", value: "0.50", color: C.detect },
  { short: "신원", value: "0.80", color: C.identify },
  { short: "유죄", value: "0.75", color: C.convict },
  { short: "집행", value: "1.00", color: C.execute },
] as const;

function MobileDeterrence({ step }: { step: number }) {
  return (
    <svg className="block sm:!hidden" viewBox="0 0 360 398" role="img" aria-label="H 사건의 제재 확률과 기대효용 계산을 세로로 보는 모바일 도식">
      <text x="180" y="18" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="currentColor">가상 H 사건 · 이익 G = 8효용 단위</text>
      <g opacity={step >= 0 ? 1 : 0.25}>
        {probabilities.map((item, index) => {
          const x = 20 + index * 82;
          return (
            <g key={item.short}>
              <rect x={x} y="34" width="72" height="48" rx="9" fill={`${item.color}12`} stroke={item.color} strokeWidth="1.2" />
              <text x={x + 36} y="54" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={item.color}>{item.short}</text>
              <text x={x + 36} y="72" textAnchor="middle" fontSize="10" fill="currentColor">{item.value}</text>
              {index < 3 && <text x={x + 77} y="63" textAnchor="middle" fontSize="12" fontWeight="700" fill={C.muted}>×</text>}
            </g>
          );
        })}
        <rect x="58" y="96" width="244" height="34" rx="9" fill="#0284c712" stroke={C.convict} strokeWidth="1.2" />
        <text x="180" y="117" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.convict}>최종 확률 p = 0.50 × 0.80 × 0.75 × 1.00 = 0.30</text>
      </g>

      <g opacity={step >= 1 ? 1 : 0.24}>
        <line x1="180" y1="130" x2="180" y2="145" stroke={C.cost} strokeWidth="1.2" />
        <circle cx="180" cy="149" r="4" fill={C.cost} />
        <rect x="48" y="156" width="264" height="52" rx="10" fill="#dc262612" stroke={C.cost} strokeWidth="1.2" />
        <text x="180" y="178" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.cost}>제재 S → 효용 부담 D(S) = 30</text>
        <text x="180" y="196" textAnchor="middle" fontSize="9.5" fill="currentColor">연수나 원화가 아니라 G와 같은 효용 단위</text>
      </g>

      <g opacity={step >= 2 ? 1 : 0.24}>
        <line x1="180" y1="208" x2="180" y2="223" stroke={C.ok} strokeWidth="1.2" />
        <circle cx="180" cy="227" r="4" fill={C.ok} />
        <rect x="38" y="234" width="284" height="70" rx="11" fill="#05966912" stroke={C.ok} strokeWidth="1.2" />
        <text x="180" y="257" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.ok}>기대 제재 = 0.30 × 30 = 9</text>
        <text x="180" y="278" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.gain}>행동 기대효용 = 8 - 9 = -1</text>
        <text x="180" y="295" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.7">모형의 가정 안에서 하지 않는 쪽이 큼</text>
      </g>

      <g opacity={step === 3 ? 1 : 0.22}>
        <rect x="28" y="324" width="146" height="50" rx="10" fill="#4f46e512" stroke={C.detect} strokeWidth="1.2" />
        <text x="101" y="345" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={C.detect}>0.30 × 30 = 9</text>
        <text x="101" y="363" textAnchor="middle" fontSize="9" fill="currentColor">높은 확률 · 낮은 부담</text>
        <rect x="186" y="324" width="146" height="50" rx="10" fill="#dc262612" stroke={C.cost} strokeWidth="1.2" />
        <text x="259" y="345" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={C.cost}>0.05 × 180 = 9</text>
        <text x="259" y="363" textAnchor="middle" fontSize="9" fill="currentColor">낮은 확률 · 높은 부담</text>
        <text x="180" y="392" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={C.cost}>곱은 같아도 비용·오판·비례성은 다릅니다</text>
      </g>
    </svg>
  );
}

export default function DeterrenceViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <>
          <MobileDeterrence step={step} />
          <svg className="!hidden sm:!block" viewBox="0 0 700 300" role="img" aria-label="H 사건의 제재 확률과 기대효용 계산 도식">
            <text x="350" y="20" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="currentColor">가상 H 사건 · 이익 G = 8효용 단위</text>
            {probabilities.map((item, index) => {
              const x = 30 + index * 126;
              return (
                <g key={item.short} opacity={1}>
                  <rect x={x} y="42" width="104" height="54" rx="10" fill={`${item.color}12`} stroke={item.color} strokeWidth="1.2" />
                  <text x={x + 52} y="64" textAnchor="middle" fontSize="10" fontWeight="700" fill={item.color}>{item.short}</text>
                  <text x={x + 52} y="84" textAnchor="middle" fontSize="10" fill="currentColor">{item.value}</text>
                  {index < 3 && <text x={x + 115} y="74" textAnchor="middle" fontSize="13" fontWeight="700" fill={C.muted}>×</text>}
                </g>
              );
            })}
            <g opacity={step >= 0 ? 1 : 0.25}>
              <line x1="524" y1="69" x2="548" y2="69" stroke={C.convict} strokeWidth="1.2" />
              <circle cx="552" cy="69" r="4" fill={C.convict} />
              <rect x="560" y="42" width="112" height="54" rx="10" fill="#0284c712" stroke={C.convict} strokeWidth="1.2" />
              <text x="616" y="64" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.convict}>최종 p</text>
              <text x="616" y="84" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor">0.30</text>
            </g>

            <g opacity={step >= 1 ? 1 : 0.22}>
              <rect x="64" y="138" width="238" height="68" rx="12" fill="#dc262612" stroke={C.cost} strokeWidth="1.2" />
              <text x="183" y="162" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.cost}>제재 S를 같은 단위로 변환</text>
              <text x="183" y="184" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor">D(S) = 30효용 단위</text>
              <text x="183" y="198" textAnchor="middle" fontSize="8.5" fill="currentColor" opacity="0.65">법정 연수를 그대로 넣은 값이 아님</text>
            </g>

            <g opacity={step >= 2 ? 1 : 0.22}>
              <line x1="302" y1="172" x2="326" y2="172" stroke={C.ok} strokeWidth="1.2" />
              <circle cx="330" cy="172" r="4" fill={C.ok} />
              <rect x="338" y="130" width="298" height="84" rx="12" fill="#05966912" stroke={C.ok} strokeWidth="1.2" />
              <text x="487" y="156" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.ok}>기대 제재 = 0.30 × 30 = 9</text>
              <text x="487" y="181" textAnchor="middle" fontSize="11" fontWeight="700" fill={C.gain}>행동 기대효용 = 8 - 9 = -1</text>
              <text x="487" y="201" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.68">모형의 가정 안에서 하지 않는 쪽이 큼</text>
            </g>

            <g opacity={step === 3 ? 1 : 0.2}>
              <rect x="112" y="240" width="212" height="42" rx="10" fill="#4f46e512" stroke={C.detect} strokeWidth="1.2" />
              <text x="218" y="258" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={C.detect}>확률 0.30 × 부담 30 = 9</text>
              <text x="218" y="274" textAnchor="middle" fontSize="8.8" fill="currentColor">검거 자원과 높은 확실성</text>
              <rect x="376" y="240" width="212" height="42" rx="10" fill="#dc262612" stroke={C.cost} strokeWidth="1.2" />
              <text x="482" y="258" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={C.cost}>확률 0.05 × 부담 180 = 9</text>
              <text x="482" y="274" textAnchor="middle" fontSize="8.8" fill="currentColor">오판·집행 비용과 비례성</text>
              <text x="350" y="298" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={C.cost}>같은 곱은 같은 정책을 뜻하지 않습니다</text>
            </g>
          </svg>
        </>
      )}
    </StepViz>
  );
}
