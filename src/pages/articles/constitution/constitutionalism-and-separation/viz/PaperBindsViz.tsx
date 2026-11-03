import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "각자는 불만이 있어도 남의 반응을 모름",
    body: "기자·공무원·야당·지역정부·유권자가 따로 판단하면, 먼저 나서는 비용 때문에 위반을 보아도 동시에 움직이기 어렵습니다.",
  },
  {
    label: "미리 공개된 선이 생김",
    body: "가상 헌법은 언론사 폐쇄에 법원의 사전 영장이 필요하다고 정합니다. 어떤 행동이 선을 넘는지 모두가 같은 문장으로 확인할 수 있습니다.",
  },
  {
    label: "행정부가 영장 없이 폐쇄 명령",
    body: "공개된 명령과 명확한 조항이 만나면 서로 다른 행위자들이 같은 사건을 위반 후보로 인식하기 쉬워집니다.",
  },
  {
    label: "공통 신호가 대응의 조정을 돕음",
    body: "법원 판단·공무원의 집행 거부·언론 보도·정치적 책임 추궁이 서로의 행동을 보이게 합니다. 다만 실제 제동은 독립성과 집행 능력이 있어야 가능합니다.",
  },
] as const;

const ACTORS = ["기자", "공무원", "야당", "지역정부", "유권자"];
const COLORS = ["#2563eb", "#7c3aed", "#d97706", "#0891b2", "#16a34a"];

export default function PaperBindsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 580 280" role="img" aria-label="공개된 헌법 조항이 흩어진 판단을 공통 신호로 바꾸는 과정">
          <defs>
            <marker id="constitution-signal-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0 0L7 3.5L0 7Z" fill="#94a3b8" />
            </marker>
          </defs>
          <text x="290" y="22" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">
            가상 사례 · 영장 없는 언론사 폐쇄 명령 E
          </text>
          {ACTORS.map((actor, index) => {
            const y = 50 + index * 36;
            const converged = step >= 2;
            return (
              <g key={actor}>
                <rect x="28" y={y} width="92" height="26" rx="8" fill={`${COLORS[index]}14`} stroke={COLORS[index]} strokeWidth="1.25" />
                <text x="74" y={y + 17} textAnchor="middle" fontSize="10" fontWeight="700" fill={COLORS[index]}>{actor}</text>
                <text x="140" y={y + 17} fontSize="9.5" fill="currentColor" opacity="0.65">
                  {step === 0 ? ["보도할까?", "집행할까?", "항의할까?", "소송할까?", "투표할까?"][index] : step === 1 ? "영장 없이는 폐쇄 불가" : "명령 E는 영장이 없음"}
                </text>
                {converged && (
                  <line x1="266" y1={y + 13} x2="327" y2="140" stroke="#94a3b8" strokeWidth="1.25" markerEnd="url(#constitution-signal-arrow)" />
                )}
              </g>
            );
          })}
          <rect x="335" y="105" width="215" height="70" rx="12" fill={step >= 2 ? "#ef444414" : "var(--muted)"} stroke={step >= 2 ? "#ef4444" : "#94a3b8"} strokeWidth="1.25" />
          <text x="442.5" y="128" textAnchor="middle" fontSize="10" fontWeight="700" fill={step >= 2 ? "#dc2626" : "currentColor"}>
            {step < 1 ? "공통 기준 없음" : step === 1 ? "공개된 헌법선" : "같은 위반 후보 E"}
          </text>
          <text x="442.5" y="148" textAnchor="middle" fontSize="9.5" fill="currentColor" opacity="0.68">
            {step < 1 ? "판단 시점이 흩어짐" : step === 1 ? "영장 없이는 폐쇄 불가" : "영장 없는 폐쇄 명령"}
          </text>
          <text x="442.5" y="163" textAnchor="middle" fontSize="8.5" fill="currentColor" opacity="0.55">
            {step === 3 ? "대응 가능성이 커짐 · 자동 제동은 아님" : "판단을 모을 초점"}
          </text>
          <rect x="28" y="238" width="522" height="28" rx="8" fill="var(--muted)" opacity="0.55" />
          <text x="289" y="256" textAnchor="middle" fontSize="10" fontWeight="700" fill="currentColor">
            {step === 0 ? "문제가 있어도 누가 함께 움직일지 모릅니다" : step === 1 ? "문서는 나중 행동의 공통 기준을 미리 만듭니다" : step === 2 ? "명확하고 공개된 위반은 같은 사건을 가리키게 합니다" : "법원·공무원·언론·정치가 실제로 독립적일 때 제약으로 이어집니다"}
          </text>
        </svg>
      )}
    </StepViz>
  );
}
