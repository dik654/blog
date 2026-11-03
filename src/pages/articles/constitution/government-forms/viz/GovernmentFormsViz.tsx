import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "같은 의석과 같은 예산안에서 시작",
    body: "300석 의회에 가당 140석·나당 140석·다당 20석이 있습니다. 가당 출신 행정부가 예산안 P를 냈고 151표가 필요합니다. 다당이 어느 편에 서느냐가 첫 갈림길입니다.",
  },
  {
    label: "대통령제: 예산이 져도 대통령은 남음",
    body: "나당과 다당이 반대해 P가 부결되어도 가당 대통령의 임기는 보통 끝나지 않습니다. 타협·거부권·새 법안·다음 선거와 각 헌법의 예외적 출구를 따로 봐야 합니다.",
  },
  {
    label: "의원내각제: 151석이 정부의 생존도 정함",
    body: "가당은 다당의 지지나 묵인이 없으면 정부를 세우기 어렵습니다. 이미 선 정부가 신임을 잃으면 새 과반이 후임을 만들거나, 헌법이 허용하는 조건에서 총선으로 갑니다.",
  },
  {
    label: "준대통령제: 먼저 대통령과 총리의 권한을 나눠 봄",
    body: "가당 대통령은 남아도 나당·다당 160석이 총리를 지탱할 수 있습니다. 이때 P를 누가 통제하는지는 대통령 선출 방식 하나가 아니라 총리 책임, 해임권, 의회 해산권과 실제 다수파에 달렸습니다.",
  },
] as const;

const PARTY = [
  { name: "가당", seats: 140, color: "#4f46e5" },
  { name: "나당", seats: 140, color: "#d97706" },
  { name: "다당", seats: 20, color: "#059669" },
] as const;

const SYSTEMS = [
  { name: "대통령제", x: 22, color: "#4f46e5" },
  { name: "의원내각제", x: 207, color: "#059669" },
  { name: "준대통령제", x: 392, color: "#d97706" },
] as const;

function multiline(lines: readonly string[], x: number, y: number, color = "currentColor") {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize="9.5" fill={color}>
      {lines.map((line, index) => (
        <tspan key={line} x={x} dy={index === 0 ? 0 : 15}>{line}</tspan>
      ))}
    </text>
  );
}

function MobileDiagram({ step }: { step: number }) {
  const rows = [
    { name: "대통령제", color: "#4f46e5", lines: ["P가 져도 대통령 임기는 계속", "정책 교착과 대통령 생존이 분리됨"] },
    { name: "의원내각제", color: "#059669", lines: ["151석이 정부를 세우고 유지", "신임 상실 뒤 후임 구성 또는 총선"] },
    { name: "준대통령제", color: "#d97706", lines: ["대통령은 남고 총리는 151석에 의존", "누가 P를 맡는지 권한 배분 확인"] },
  ] as const;
  return (
    <svg className="block sm:!hidden" viewBox="0 0 360 426" role="img" aria-label="모바일에서 세로로 보는 정부 형태별 예산안 처리 경로">
      <text x="180" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor">가상 사례 · 예산안 P는 151표가 필요</text>
      <g>
        <rect x="20" y="32" width="320" height="32" rx="8" fill="var(--muted)" opacity="0.45" />
        {PARTY.map((party, index) => {
          const start = PARTY.slice(0, index).reduce((sum, item) => sum + item.seats, 0);
          const x = 20 + (start / 300) * 320;
          const width = (party.seats / 300) * 320;
          return (
            <g key={party.name}>
              <rect x={x} y="32" width={width} height="32" fill={party.color} fillOpacity="0.2" stroke={party.color} strokeWidth="1.2" />
              <text x={x + width / 2} y="52" textAnchor="middle" fontSize={index === 2 ? "8" : "10"} fontWeight="700" fill={party.color}>{party.name} {party.seats}</text>
            </g>
          );
        })}
      </g>
      <rect x="80" y="80" width="200" height="44" rx="10" fill="#2563eb14" stroke="#2563eb" strokeWidth="1.2" />
      <text x="180" y="99" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#2563eb">가당 행정부의 예산안 P</text>
      <text x="180" y="115" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.65">다당 20석의 선택이 통과를 가름</text>
      {rows.map((row, index) => {
        const y = 145 + index * 86;
        const active = step === 0 || step === index + 1;
        return (
          <g key={row.name} opacity={active ? 1 : 0.25}>
            <line x1="180" y1={index === 0 ? 124 : y - 12} x2="180" y2={y - 4} stroke={row.color} strokeWidth="1.2" />
            <circle cx="180" cy={y} r="4.5" fill={row.color} />
            <rect x="28" y={y + 8} width="304" height="62" rx="11" fill={`${row.color}12`} stroke={row.color} strokeWidth="1.2" />
            <text x="48" y={y + 31} fontSize="10.5" fontWeight="700" fill={row.color}>{row.name}</text>
            <text x="48" y={y + 49} fontSize="9.5" fill="currentColor">{row.lines[0]}</text>
            <text x="48" y={y + 63} fontSize="9.5" fill="currentColor" opacity="0.7">{row.lines[1]}</text>
          </g>
        );
      })}
      <text x="180" y="418" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={step === 0 ? "#475569" : rows[step - 1].color}>
        {step === 0 ? "같은 패배 뒤의 다음 동작이 달라집니다" : step === 1 ? "정책 패배와 대통령 퇴진은 별개입니다" : step === 2 ? "정책 과반과 정부 생존이 연결됩니다" : "두 행정부의 권한을 따로 읽습니다"}
      </text>
    </svg>
  );
}

export default function GovernmentFormsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <>
        <MobileDiagram step={step} />
        <svg className="!hidden sm:!block" viewBox="0 0 580 310" role="img" aria-label="같은 의석과 예산안이 정부 형태에 따라 다른 경로로 처리되는 과정">
          <text x="290" y="20" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor">
            가상 사례 · 예산안 P는 151표가 있어야 통과
          </text>

          <g>
            <rect x="58" y="36" width="464" height="30" rx="8" fill="var(--muted)" opacity="0.45" />
            {PARTY.map((party, index) => {
              const start = PARTY.slice(0, index).reduce((sum, item) => sum + item.seats, 0);
              const x = 58 + (start / 300) * 464;
              const width = (party.seats / 300) * 464;
              return (
                <g key={party.name}>
                  <rect x={x} y="36" width={width} height="30" fill={party.color} fillOpacity="0.2" stroke={party.color} strokeWidth="1.2" />
                  <text x={x + width / 2} y="55" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={party.color}>
                    {party.name} {party.seats}
                  </text>
                </g>
              );
            })}
            <line x1={58 + (151 / 300) * 464} y1="31" x2={58 + (151 / 300) * 464} y2="72" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="3 3" />
          </g>

          <rect x="225" y="88" width="130" height="42" rx="10" fill="#2563eb14" stroke="#2563eb" strokeWidth="1.2" />
          <text x="290" y="106" textAnchor="middle" fontSize="10" fontWeight="700" fill="#2563eb">가당 행정부의 예산안 P</text>
          <text x="290" y="121" textAnchor="middle" fontSize="8.5" fill="currentColor" opacity="0.62">다당 20석의 선택이 통과를 가름</text>

          {SYSTEMS.map((system, index) => {
            const active = step === 0 || step === index + 1;
            const center = system.x + 83;
            return (
              <g key={system.name} opacity={active ? 1 : 0.28}>
                <path d={`M290 130 C290 154 ${center} 148 ${center} 164`} fill="none" stroke={system.color} strokeWidth="1.2" />
                <circle cx={center} cy="166" r="5" fill={system.color} />
                <rect x={system.x} y="180" width="166" height="105" rx="12" fill={`${system.color}12`} stroke={system.color} strokeWidth="1.2" />
                <text x={center} y="201" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={system.color}>{system.name}</text>
                {index === 0 && multiline(["P가 져도", "대통령 임기는 계속", "정책 교착과 생존 분리"], center, 222)}
                {index === 1 && multiline(["151석이 정부를 세움", "신임을 잃으면", "후임 구성 또는 총선"], center, 222)}
                {index === 2 && multiline(["대통령은 남고", "총리는 151석에 의존", "권한 배분을 다시 확인"], center, 222)}
              </g>
            );
          })}

          <text x="290" y="304" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={step === 0 ? "#475569" : SYSTEMS[step - 1].color}>
            {step === 0 ? "정부 형태는 같은 갈등의 다음 동작을 바꿉니다" : step === 1 ? "정책 패배와 대통령 퇴진은 같은 사건이 아닙니다" : step === 2 ? "정책 과반과 정부 생존 과반이 연결됩니다" : "준대통령제는 한 점이 아니라 두 행정부의 관계입니다"}
          </text>
        </svg>
        </>
      )}
    </StepViz>
  );
}
