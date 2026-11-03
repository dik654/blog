import StepViz from "@/components/ui/step-viz";

const STEPS = [
  { label: "사실과 판정을 교차하면 네 칸이 생김", body: "H가 실제로 했는지와 재판이 유죄로 판단했는지는 다른 축입니다. 두 축을 교차하면 맞은 판정 두 칸과 오류 두 칸이 보입니다." },
  { label: "하지 않은 H를 유죄로 하면 오유죄", body: "국가가 무고한 사람의 자유·명예·생활을 침해하고 형사 절차의 신뢰도 해칩니다. 조심해서 피할 수 없는 국가 오류입니다." },
  { label: "실제로 한 H를 무죄로 하면 오무죄", body: "피해 회복과 책임 추궁이 좌절되고 재범·억제·공공 안전의 비용이 남을 수 있습니다. 이 오류도 작다고 전제할 수 없습니다." },
  { label: "법은 두 오류의 위험을 같은 자리에 두지 않음", body: "무죄 추정과 높은 증명 기준은 오유죄 위험을 특히 경계하는 법적 배분입니다. 다만 두 오류의 무게를 숫자로 넣어 법정 기준을 자동 계산하지는 않습니다." },
] as const;

const C = { ok: "#059669", falseConviction: "#dc2626", falseAcquittal: "#d97706", accent: "#4f46e5", muted: "#64748b" } as const;

function MobileMatrix({ step }: { step: number }) {
  const cells = [
    { x: 30, y: 102, label: "맞게 유죄", color: C.ok, focus: false },
    { x: 186, y: 102, label: "오유죄", color: C.falseConviction, focus: step === 1 || step === 3 },
    { x: 30, y: 166, label: "오무죄", color: C.falseAcquittal, focus: step === 2 || step === 3 },
    { x: 186, y: 166, label: "맞게 무죄", color: C.ok, focus: false },
  ] as const;
  return (
    <svg className="block sm:!hidden" viewBox="0 0 360 352" role="img" aria-label="H 사건의 실제 사실과 판정이 만드는 두 오류의 모바일 행렬">
      <text x="204" y="20" textAnchor="middle" fontSize="10" fontWeight="700" fill="currentColor">H가 실제로 했는가</text>
      <text x="108" y="43" textAnchor="middle" fontSize="9.5" fill="currentColor" opacity="0.7">했다</text>
      <text x="264" y="43" textAnchor="middle" fontSize="9.5" fill="currentColor" opacity="0.7">하지 않았다</text>
      <text x="18" y="82" fontSize="9.5" fontWeight="700" fill="currentColor">판정</text>
      <text x="18" y="132" fontSize="9" fill="currentColor" opacity="0.7">유죄</text>
      <text x="18" y="196" fontSize="9" fill="currentColor" opacity="0.7">무죄</text>
      {cells.map((cell) => (
        <g key={cell.label} opacity={step === 0 || cell.focus ? 1 : 0.25}>
          <rect x={cell.x} y={cell.y} width="144" height="54" rx="10" fill={`${cell.color}${cell.focus ? "22" : "12"}`} stroke={cell.color} strokeWidth="1.2" />
          <text x={cell.x + 72} y={cell.y + 32} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={cell.color}>{cell.label}</text>
        </g>
      ))}
      <rect x="30" y="244" width="300" height="76" rx="11" fill={step === 1 ? "#dc262612" : step === 2 ? "#d9770612" : step === 3 ? "#4f46e512" : "#64748b0d"} stroke={step === 1 ? C.falseConviction : step === 2 ? C.falseAcquittal : step === 3 ? C.accent : C.muted} strokeWidth="1.2" />
      <text x="180" y="268" textAnchor="middle" fontSize="10" fontWeight="700" fill={step === 1 ? C.falseConviction : step === 2 ? C.falseAcquittal : step === 3 ? C.accent : C.muted}>
        {step === 0 ? "대각선은 맞고 나머지 두 칸이 오류" : step === 1 ? "국가가 없던 형벌 피해를 만듦" : step === 2 ? "피해·책임·안전의 비용이 남음" : "오류 배분은 법적 선택"}
      </text>
      <text x="180" y="290" textAnchor="middle" fontSize="9.2" fill="currentColor">
        {step === 0 ? "사실은 판정 순간 직접 보이지 않습니다" : step === 1 ? "자유·명예·생활과 절차 신뢰의 손실" : step === 2 ? "놓아주는 오류도 작다고 둘 수 없음" : "장난감 비용식이 법정 기준을 만들지는 않음"}
      </text>
      <text x="180" y="309" textAnchor="middle" fontSize="9.2" fill="currentColor" opacity="0.72">
        {step === 3 ? "무죄 추정과 높은 증명 기준이 위험을 배분" : "같은 H 사건의 서로 다른 잘못"}
      </text>
      <text x="180" y="346" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={C.accent}>의심의 크기보다 먼저, 틀릴 때 어느 칸으로 가는지 봅니다</text>
    </svg>
  );
}

export default function TwoErrorsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <>
          <MobileMatrix step={step} />
          <svg className="!hidden sm:!block" viewBox="0 0 680 288" role="img" aria-label="H 사건의 실제 사실과 판정이 만드는 두 오류의 행렬">
            <text x="306" y="20" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="currentColor">H가 실제로 했는가</text>
            <text x="220" y="43" textAnchor="middle" fontSize="9.5" fill="currentColor" opacity="0.7">했다</text>
            <text x="392" y="43" textAnchor="middle" fontSize="9.5" fill="currentColor" opacity="0.7">하지 않았다</text>
            <text x="58" y="62" fontSize="9.5" fontWeight="700" fill="currentColor">재판 판정</text>
            <text x="76" y="94" fontSize="9.5" fill="currentColor">유죄</text>
            <text x="76" y="150" fontSize="9.5" fill="currentColor">무죄</text>
            {[
              { x: 136, y: 54, label: "맞게 유죄", color: C.ok, focus: false },
              { x: 308, y: 54, label: "오유죄", color: C.falseConviction, focus: step === 1 || step === 3 },
              { x: 136, y: 110, label: "오무죄", color: C.falseAcquittal, focus: step === 2 || step === 3 },
              { x: 308, y: 110, label: "맞게 무죄", color: C.ok, focus: false },
            ].map((cell) => (
              <g key={cell.label} opacity={step === 0 || cell.focus ? 1 : 0.25}>
                <rect x={cell.x} y={cell.y} width="168" height="48" rx="10" fill={`${cell.color}${cell.focus ? "22" : "12"}`} stroke={cell.color} strokeWidth="1.2" />
                <text x={cell.x + 84} y={cell.y + 29} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={cell.color}>{cell.label}</text>
              </g>
            ))}
            <rect x="504" y="54" width="150" height="104" rx="12" fill={step === 1 ? "#dc262612" : step === 2 ? "#d9770612" : step === 3 ? "#4f46e512" : "#64748b0d"} stroke={step === 1 ? C.falseConviction : step === 2 ? C.falseAcquittal : step === 3 ? C.accent : C.muted} strokeWidth="1.2" />
            <text x="579" y="79" textAnchor="middle" fontSize="10" fontWeight="700" fill={step === 1 ? C.falseConviction : step === 2 ? C.falseAcquittal : step === 3 ? C.accent : C.muted}>
              {step === 0 ? "두 오류" : step === 1 ? "오유죄의 손실" : step === 2 ? "오무죄의 손실" : "법적 위험 배분"}
            </text>
            <text x="579" y="101" textAnchor="middle" fontSize="9" fill="currentColor">{step === 1 ? "자유·명예·생활" : step === 2 ? "피해·책임·재범" : step === 3 ? "무죄 추정" : "사실은 직접 보이지 않음"}</text>
            <text x="579" y="119" textAnchor="middle" fontSize="9" fill="currentColor">{step === 1 ? "국가 강제력의 신뢰" : step === 2 ? "억제·공공 안전" : step === 3 ? "높은 증명 기준" : "증거로 판정해야 함"}</text>
            <text x="579" y="143" textAnchor="middle" fontSize="8.5" fill="currentColor" opacity="0.66">{step === 3 ? "비용식이 법을 자동 산출하지 않음" : "어느 쪽도 0으로 만들 수 없음"}</text>
            <line x1="136" y1="196" x2="470" y2="196" stroke={C.accent} strokeWidth="1.2" />
            <circle cx="132" cy="196" r="4" fill={C.accent} />
            <circle cx="474" cy="196" r="4" fill={C.accent} />
            <text x="303" y="221" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.accent}>의심의 크기보다 먼저 틀릴 때 어느 칸으로 가는지 봅니다</text>
            <text x="303" y="245" textAnchor="middle" fontSize="9.5" fill="currentColor">{step === 0 ? "맞은 판정 두 칸과 오류 두 칸을 분리합니다" : step === 1 ? "오유죄는 국가가 무고한 H에게 직접 만드는 피해입니다" : step === 2 ? "오무죄도 피해자와 사회에 실제 비용을 남깁니다" : "법은 오유죄 위험을 특히 경계하지만 숫자 비로 기준을 정하지 않습니다"}</text>
          </svg>
        </>
      )}
    </StepViz>
  );
}
