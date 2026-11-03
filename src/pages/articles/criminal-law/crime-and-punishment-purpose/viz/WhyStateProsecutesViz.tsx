import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "한 사건에서 재산 손실과 공적 규칙 위반이 함께 생김",
    body: "H가 경보기를 끄고 물건을 가져간 가상 사건입니다. 물건값을 돌려주는 일은 손실을 메우지만, 조사·강제력·동일한 규칙 적용의 문제까지 자동으로 끝내지는 않습니다.",
  },
  {
    label: "행위 전에 법이 금지와 가능한 제재를 정함",
    body: "국가가 처벌하려면 먼저 접근 가능하고 예측 가능한 법적 근거가 있어야 합니다. 사건 뒤에 금지를 만들어 H에게 거꾸로 적용할 수 없습니다.",
  },
  {
    label: "절차가 행위·책임·항변을 증명함",
    body: "공적 필요가 있다는 사실은 H의 유죄 증거가 아닙니다. 독립된 증명 문턱을 넘기 전에는 형벌 목적을 H에게 적용할 수 없습니다.",
  },
  {
    label: "유죄 뒤에야 형벌 목적이 형의 종류와 정도를 이끎",
    body: "응보·억제·무해화·재활은 유죄를 만드는 부품이 아니라, 유죄가 확인된 뒤 어떤 공적 반응이 정당한지 묻는 서로 다른 이유입니다.",
  },
] as const;

const COLORS = {
  event: "#d97706",
  law: "#4f46e5",
  proof: "#0284c7",
  sentence: "#059669",
  muted: "#64748b",
} as const;

function MobileFlow({ step }: { step: number }) {
  const rows = [
    { y: 88, label: "사전 법률", note: "행위 전에 금지·제재의 경계", color: COLORS.law },
    { y: 174, label: "유죄 판단", note: "행위·책임·항변을 별도로 증명", color: COLORS.proof },
    { y: 260, label: "형벌 목적", note: "유죄 뒤 형의 종류·정도를 판단", color: COLORS.sentence },
  ] as const;
  return (
    <svg className="block sm:!hidden" viewBox="0 0 360 376" role="img" aria-label="H 사건이 법률, 유죄 판단, 형벌 목적을 차례로 통과하는 모바일 흐름도">
      <rect x="28" y="18" width="304" height="48" rx="11" fill={`${COLORS.event}14`} stroke={COLORS.event} strokeWidth="1.2" />
      <text x="180" y="38" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={COLORS.event}>H가 경보기를 끄고 물건을 가져감</text>
      <text x="180" y="54" textAnchor="middle" fontSize="9.5" fill="currentColor" opacity="0.72">재산 손실과 공적 규칙 위반이 함께 생김</text>
      {rows.map((row, index) => {
        const active = step >= index + 1;
        const previousY = index === 0 ? 66 : rows[index - 1].y + 56;
        return (
          <g key={row.label} opacity={active ? 1 : 0.26}>
            <line x1="180" y1={previousY} x2="180" y2={row.y - 8} stroke={row.color} strokeWidth="1.2" />
            <circle cx="180" cy={row.y - 5} r="4" fill={row.color} />
            <rect x="36" y={row.y} width="288" height="56" rx="11" fill={`${row.color}12`} stroke={row.color} strokeWidth="1.2" />
            <text x="56" y={row.y + 23} fontSize="10.5" fontWeight="700" fill={row.color}>{index + 1}. {row.label}</text>
            <text x="56" y={row.y + 42} fontSize="9.5" fill="currentColor">{row.note}</text>
          </g>
        );
      })}
      <rect x="36" y="334" width="288" height="30" rx="8" fill={step === 0 ? "#64748b12" : `${rows[Math.max(0, step - 1)].color}12`} stroke={step === 0 ? COLORS.muted : rows[Math.max(0, step - 1)].color} strokeWidth="1.2" />
      <text x="180" y="353" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={step === 0 ? COLORS.muted : rows[Math.max(0, step - 1)].color}>
        {step === 0 ? "배상과 형사 절차는 서로 다른 질문입니다" : step === 1 ? "법이 먼저입니다" : step === 2 ? "공적 필요가 유죄 증거는 아닙니다" : "형벌 목적은 마지막에 작동합니다"}
      </text>
    </svg>
  );
}

export default function WhyStateProsecutesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <>
          <MobileFlow step={step} />
          <svg className="!hidden sm:!block" viewBox="0 0 700 286" role="img" aria-label="H 사건이 법률, 유죄 판단, 형벌 목적을 차례로 통과하는 흐름도">
            <rect x="24" y="28" width="164" height="78" rx="13" fill={`${COLORS.event}14`} stroke={COLORS.event} strokeWidth="1.2" />
            <text x="106" y="54" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={COLORS.event}>가상 H 사건</text>
            <text x="106" y="75" textAnchor="middle" fontSize="9.5" fill="currentColor">경보기 해제 · 물건 취득</text>
            <text x="106" y="94" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.68">손실 회복만으로 끝나지 않음</text>

            {[
              { x: 220, label: "1. 사전 법률", note: ["금지와 제재의", "예측 가능한 경계"], color: COLORS.law },
              { x: 386, label: "2. 유죄 판단", note: ["행위·책임·항변", "독립된 증명"], color: COLORS.proof },
              { x: 552, label: "3. 형벌 목적", note: ["유죄 뒤 형의", "종류와 정도"], color: COLORS.sentence },
            ].map((box, index) => {
              const active = step >= index + 1;
              const startX = index === 0 ? 188 : box.x - 32;
              return (
                <g key={box.label} opacity={active ? 1 : 0.25}>
                  <line x1={startX} y1="67" x2={box.x - 11} y2="67" stroke={box.color} strokeWidth="1.2" />
                  <circle cx={box.x - 7} cy="67" r="4" fill={box.color} />
                  <rect x={box.x} y="28" width="136" height="78" rx="13" fill={`${box.color}12`} stroke={box.color} strokeWidth="1.2" />
                  <text x={box.x + 68} y="54" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={box.color}>{box.label}</text>
                  <text x={box.x + 68} y="76" textAnchor="middle" fontSize="9.5" fill="currentColor">{box.note[0]}</text>
                  <text x={box.x + 68} y="93" textAnchor="middle" fontSize="9.5" fill="currentColor">{box.note[1]}</text>
                </g>
              );
            })}

            <g opacity={step === 0 ? 1 : 0.4}>
              <rect x="46" y="146" width="252" height="76" rx="12" fill="#d9770610" stroke={COLORS.event} strokeWidth="1.2" />
              <text x="66" y="170" fontSize="10" fontWeight="700" fill={COLORS.event}>민사상 질문</text>
              <text x="66" y="192" fontSize="9.5" fill="currentColor">누가 어떤 손실을 메워야 하는가?</text>
              <text x="66" y="210" fontSize="9" fill="currentColor" opacity="0.65">물건 반환·손해배상과 형사 절차는 병존 가능</text>
            </g>
            <g opacity={step === 0 || step === 3 ? 1 : 0.4}>
              <rect x="326" y="146" width="328" height="76" rx="12" fill="#05966910" stroke={COLORS.sentence} strokeWidth="1.2" />
              <text x="346" y="170" fontSize="10" fontWeight="700" fill={COLORS.sentence}>형사상 질문</text>
              <text x="346" y="192" fontSize="9.5" fill="currentColor">유죄가 증명된 뒤 어떤 공적 반응이 정당한가?</text>
              <text x="346" y="210" fontSize="9" fill="currentColor" opacity="0.65">응보 · 억제 · 무해화 · 재활은 이 단계에서 작동</text>
            </g>
            <text x="350" y="264" textAnchor="middle" fontSize="10" fontWeight="700" fill={step === 0 ? COLORS.event : step === 1 ? COLORS.law : step === 2 ? COLORS.proof : COLORS.sentence}>
              {step === 0 ? "손실의 가격과 공적 반응은 같은 문제가 아닙니다" : step === 1 ? "처벌하려면 사건보다 법이 먼저 있어야 합니다" : step === 2 ? "공적 필요가 H의 유죄를 대신 증명하지 않습니다" : "형벌 목적은 유죄 뒤에야 형을 이끕니다"}
            </text>
          </svg>
        </>
      )}
    </StepViz>
  );
}
