import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "법과 증거가 재판 전망을 만듦",
    body: "계약조항·판례·경보기 로그가 책임 가능성 p와 인정될 금액 J를 바꿉니다. 법이 곧바로 합의금을 명령하는 단계는 아닙니다.",
  },
  {
    label: "시간과 비용을 넣어 대안값을 만듦",
    body: "같은 법 규칙도 지연 d, 각자의 부담 C, 집행 가능성에 따라 협상을 깨고 재판할 때의 값이 달라집니다.",
  },
  {
    label: "대안값이 겹치면 합의, 안 겹치면 재판",
    body: "M의 최저선과 V의 최고선이 겹치면 합의할 수 있습니다. 정보 차이로 전망이 크게 벌어지거나 비금전 목적이 크면 재판으로 갈 수 있습니다.",
  },
  {
    label: "법원 접근이 막히면 청구가 기록 전에 사라짐",
    body: "M의 부담이 300만원에서 800만원으로 오르면 대안값은 456만원에서 −44만원이 됩니다. 같은 권리가 있어도 법원을 실제 대안으로 쓰지 못하면 포기될 수 있습니다.",
  },
] as const;

const C = {
  law: "#7c3aed",
  forecast: "#0284c7",
  fallback: "#d97706",
  settle: "#059669",
  trial: "#dc2626",
  muted: "#64748b",
} as const;

function ConnectorV({ y1, y2, active }: { y1: number; y2: number; active: boolean }) {
  const color = active ? C.forecast : "#cbd5e1";
  return <g><line x1="180" y1={y1} x2="180" y2={y2 - 6} stroke={color} strokeWidth="1.2" /><circle cx="180" cy={y2 - 3} r="3" fill={color} /></g>;
}

function MobileFlow({ step }: { step: number }) {
  const blocked = step === 3;
  return (
    <svg className="block sm:!hidden" viewBox="0 0 360 520" role="img" aria-label="법 규칙이 재판 전망과 대안값을 거쳐 합의 또는 재판으로 이어지는 모바일 도식">
      <rect x="44" y="16" width="272" height="72" rx="11" fill="#7c3aed12" stroke={step >= 0 ? C.law : "#cbd5e1"} strokeWidth="1.2" />
      <text x="180" y="39" textAnchor="middle" fontSize="10.2" fontWeight="700" fill={C.law}>법 규칙 + 계약 + 증거</text>
      <text x="180" y="59" textAnchor="middle" fontSize="9.2" fill="currentColor">면책조항 · 판례 · 경보기 로그</text>
      <text x="180" y="76" textAnchor="middle" fontSize="8.9" fill={C.muted}>합의금을 직접 정하지 않음</text>

      <ConnectorV y1={88} y2={112} active={step >= 0} />
      <rect x="44" y="112" width="272" height="72" rx="11" fill="#0284c712" stroke={step >= 0 ? C.forecast : "#cbd5e1"} strokeWidth="1.2" />
      <text x="180" y="136" textAnchor="middle" fontSize="10.2" fontWeight="700" fill={C.forecast}>재판 전망 p · 인정 금액 J</text>
      <text x="180" y="156" textAnchor="middle" fontSize="9.2" fill="currentColor">M 70% · V 60% · J 1,200만원</text>
      <text x="180" y="173" textAnchor="middle" fontSize="8.9" fill={C.muted}>서로 다른 정보면 p도 달라짐</text>

      <ConnectorV y1={184} y2={208} active={step >= 1} />
      <rect x="44" y="208" width="272" height="80" rx="11" fill="#d9770612" stroke={step >= 1 ? C.fallback : "#cbd5e1"} strokeWidth="1.2" />
      <text x="180" y="232" textAnchor="middle" fontSize="10.2" fontWeight="700" fill={C.fallback}>시간 d · 부담 C · 집행 가능성</text>
      <text x="180" y="252" textAnchor="middle" fontSize="9.3" fill="currentColor">{blocked ? "M: 456만 → −44만원" : "M 최저 456만 · V 최고 848만원"}</text>
      <text x="180" y="271" textAnchor="middle" fontSize="8.9" fill={blocked ? C.trial : C.muted}>{blocked ? "접근비용 800만원이면 법원이 대안이 되지 않음" : "권리가 실제 협상력으로 바뀌는 지점"}</text>

      <ConnectorV y1={288} y2={318} active={step >= 2} />
      <rect x="22" y="318" width="146" height="72" rx="11" fill="#05966912" stroke={step >= 2 && !blocked ? C.settle : "#cbd5e1"} strokeWidth="1.2" />
      <text x="95" y="343" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.settle}>범위가 겹침</text>
      <text x="95" y="362" textAnchor="middle" fontSize="9.2" fill="currentColor">합의 가능</text>
      <text x="95" y="379" textAnchor="middle" fontSize="8.8" fill={C.muted}>실제 금액은 협상</text>
      <rect x="192" y="318" width="146" height="72" rx="11" fill="#dc262612" stroke={step >= 2 && !blocked ? C.trial : "#cbd5e1"} strokeWidth="1.2" />
      <text x="265" y="343" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.trial}>범위가 안 겹침</text>
      <text x="265" y="362" textAnchor="middle" fontSize="9.2" fill="currentColor">재판 가능</text>
      <text x="265" y="379" textAnchor="middle" fontSize="8.8" fill={C.muted}>정보·전망 차이</text>

      {blocked && (
        <g>
          <line x1="180" y1="390" x2="180" y2="418" stroke={C.trial} strokeWidth="1.2" />
          <circle cx="180" cy="421" r="3" fill={C.trial} />
          <rect x="44" y="424" width="272" height="60" rx="11" fill="#dc262612" stroke={C.trial} strokeWidth="1.2" />
          <text x="180" y="448" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.trial}>소송 전 포기 · 기록에 남지 않음</text>
          <text x="180" y="468" textAnchor="middle" fontSize="9.2" fill="currentColor">합의율·판결 통계만 보면 보이지 않음</text>
        </g>
      )}
      {!blocked && <text x="180" y="450" textAnchor="middle" fontSize="9.7" fontWeight="700" fill={C.law}>법 → 전망 → 대안값 → 분쟁 경로</text>}
      <text x="180" y="508" textAnchor="middle" fontSize="9.4" fontWeight="700" fill={blocked ? C.trial : C.muted}>
        {blocked ? "접근 가능성이 법의 그림자가 닿는 범위를 정합니다" : "판결이 없어도 법은 대안값을 통해 협상에 들어옵니다"}
      </text>
    </svg>
  );
}

function HConnector({ x1, x2, active }: { x1: number; x2: number; active: boolean }) {
  const color = active ? C.forecast : "#cbd5e1";
  return <g><line x1={x1} y1="100" x2={x2 - 7} y2="100" stroke={color} strokeWidth="1.2" /><circle cx={x2 - 3} cy="100" r="3" fill={color} /></g>;
}

export default function ShadowOfJudgmentViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const blocked = step === 3;
        return (
          <>
            <MobileFlow step={step} />
            <svg className="!hidden sm:!block" viewBox="0 0 700 330" role="img" aria-label="법 규칙이 재판 전망과 대안값을 거쳐 합의 또는 재판으로 이어지는 도식">
              <rect x="20" y="58" width="146" height="84" rx="12" fill="#7c3aed12" stroke={C.law} strokeWidth="1.2" />
              <text x="93" y="84" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.law}>법 규칙 · 계약 · 증거</text>
              <text x="93" y="105" textAnchor="middle" fontSize="8.9" fill="currentColor">면책조항 · 판례 · 로그</text>
              <text x="93" y="124" textAnchor="middle" fontSize="8.6" fill={C.muted}>합의금을 직접 정하지 않음</text>

              <HConnector x1={166} x2={190} active={step >= 0} />
              <rect x="190" y="58" width="146" height="84" rx="12" fill="#0284c712" stroke={C.forecast} strokeWidth="1.2" />
              <text x="263" y="84" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.forecast}>재판 전망 p · 금액 J</text>
              <text x="263" y="105" textAnchor="middle" fontSize="8.9" fill="currentColor">M 70% · V 60%</text>
              <text x="263" y="124" textAnchor="middle" fontSize="8.6" fill={C.muted}>J 1,200만원</text>

              <HConnector x1={336} x2={360} active={step >= 1} />
              <rect x="360" y="58" width="146" height="84" rx="12" fill="#d9770612" stroke={step >= 1 ? C.fallback : "#cbd5e1"} strokeWidth="1.2" />
              <text x="433" y="84" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.fallback}>시간 · 비용 · 집행</text>
              <text x="433" y="105" textAnchor="middle" fontSize="8.9" fill="currentColor">{blocked ? "M 456만 → −44만" : "M 456만 · V 848만"}</text>
              <text x="433" y="124" textAnchor="middle" fontSize="8.6" fill={blocked ? C.trial : C.muted}>{blocked ? "접근비용이 대안을 없앰" : "각자의 재판 대안값"}</text>

              <HConnector x1={506} x2={530} active={step >= 2} />
              <rect x="530" y="34" width="150" height="60" rx="12" fill="#05966912" stroke={step >= 2 && !blocked ? C.settle : "#cbd5e1"} strokeWidth="1.2" />
              <text x="605" y="60" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.settle}>범위가 겹치면</text>
              <text x="605" y="80" textAnchor="middle" fontSize="9.2" fill="currentColor">합의 가능</text>
              <rect x="530" y="106" width="150" height="60" rx="12" fill="#dc262612" stroke={step >= 2 && !blocked ? C.trial : "#cbd5e1"} strokeWidth="1.2" />
              <text x="605" y="132" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.trial}>범위가 안 겹치면</text>
              <text x="605" y="152" textAnchor="middle" fontSize="9.2" fill="currentColor">재판 가능</text>

              <rect x="76" y="206" width="548" height="76" rx="12" fill={blocked ? "#dc262612" : "#64748b0d"} stroke={blocked ? C.trial : "#cbd5e1"} strokeWidth="1.2" />
              <text x="350" y="232" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={blocked ? C.trial : C.law}>
                {blocked ? "M의 소송부담이 300만원 → 800만원" : "법은 재판 전망을 통해 협상에 들어옵니다"}
              </text>
              <text x="350" y="254" textAnchor="middle" fontSize="9.5" fill="currentColor">
                {blocked ? "재판 대안값 456만원 → −44만원 · 소송 전에 포기될 수 있음" : "새 판결이 p나 J를 바꾸면 재판을 열지 않아도 합의 범위가 움직임"}
              </text>
              <text x="350" y="272" textAnchor="middle" fontSize="8.8" fill={C.muted}>
                {blocked ? "포기된 청구는 판결 통계에 나타나지 않음" : "그러나 정보·비용·협상력도 실제 결과를 함께 정함"}
              </text>

              <text x="350" y="318" textAnchor="middle" fontSize="10" fontWeight="700" fill={blocked ? C.trial : C.muted}>
                {blocked ? "접근 가능성이 법의 그림자가 닿는 범위를 정합니다" : "법 → 전망 → 대안값 → 합의·재판·포기"}
              </text>
            </svg>
          </>
        );
      }}
    </StepViz>
  );
}
