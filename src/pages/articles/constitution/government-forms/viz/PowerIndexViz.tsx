import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "의석만 보면 다당은 작음",
    body: "300석 중 가당 140석·나당 140석·다당 20석입니다. 하지만 누구도 151석에 이르지 못하므로 의석 비율만으로 표결에서의 힘을 읽을 수 없습니다.",
  },
  {
    label: "이기는 연합에서 빠지면 지는 당을 표시",
    body: "가+나, 가+다, 나+다는 모두 과반입니다. 각 두 당 연합에서는 두 당 모두 결정적입니다. 세 당 연합에서는 어느 한 당을 빼도 과반이라 아무도 결정적이지 않습니다.",
  },
  {
    label: "결정적 횟수 2·2·2를 정규화",
    body: "세 당의 정규화 Banzhaf 값은 각각 1/3입니다. 이것은 주어진 표결 모형의 형식적 투표력이지, 장관 자리나 정책 양보를 그대로 예측하는 실제 협상력은 아닙니다.",
  },
  {
    label: "20석 이동으로 값이 1·0·0이 됨",
    body: "160·120·20으로 바뀌면 가당이 단독 과반입니다. 나당은 120석이 있어도 결과를 뒤집는 연합이 없어 Banzhaf 값이 0입니다. 힘은 의석 크기보다 정족수와 조합의 관계에서 나옵니다.",
  },
] as const;

const COLORS = ["#4f46e5", "#d97706", "#059669"];
const NAMES = ["가당", "나당", "다당"];
const SETUPS = [
  [140, 140, 20],
  [140, 140, 20],
  [140, 140, 20],
  [160, 120, 20],
] as const;

type Coalition = { label: string; seats: number; critical: string };

const COALITIONS: Coalition[] = [
  { label: "가 + 나", seats: 280, critical: "가 · 나" },
  { label: "가 + 다", seats: 160, critical: "가 · 다" },
  { label: "나 + 다", seats: 160, critical: "나 · 다" },
  { label: "가 + 나 + 다", seats: 300, critical: "없음" },
];

function SeatBars({ seats, y = 42 }: { seats: readonly number[]; y?: number }) {
  return (
    <g>
      {seats.map((seat, index) => {
        const rowY = y + index * 36;
        return (
          <g key={NAMES[index]}>
            <text x="52" y={rowY + 16} textAnchor="end" fontSize="9.5" fontWeight="700" fill={COLORS[index]}>{NAMES[index]}</text>
            <rect x="64" y={rowY} width={(seat / 300) * 390} height="22" rx="6" fill={COLORS[index]} fillOpacity="0.2" stroke={COLORS[index]} strokeWidth="1.2" />
            <text x="470" y={rowY + 16} fontSize="9.5" fontWeight="700" fill={COLORS[index]}>{seat}석</text>
          </g>
        );
      })}
      <line x1={64 + (151 / 300) * 390} y1={y - 8} x2={64 + (151 / 300) * 390} y2={y + 102} stroke="#dc2626" strokeWidth="1.2" strokeDasharray="4 3" />
      <text x={64 + (151 / 300) * 390} y={y + 119} textAnchor="middle" fontSize="9" fontWeight="700" fill="#dc2626">과반 151</text>
    </g>
  );
}

function MobilePowerDiagram({ step }: { step: number }) {
  const seats = SETUPS[step];
  if (step === 1) {
    return (
      <svg className="block sm:!hidden" viewBox="0 0 360 360" role="img" aria-label="모바일에서 승리 연합의 결정적 정당을 세는 표">
        <text x="180" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor">과반 연합에서 빠지면 지는 당을 표시</text>
        <text x="24" y="48" fontSize="9.5" fontWeight="700" fill="currentColor" opacity="0.65">이기는 연합</text>
        <text x="180" y="48" fontSize="9.5" fontWeight="700" fill="currentColor" opacity="0.65">합계</text>
        <text x="255" y="48" fontSize="9.5" fontWeight="700" fill="currentColor" opacity="0.65">결정적인 당</text>
        {COALITIONS.map((item, index) => {
          const y = 66 + index * 55;
          return (
            <g key={item.label}>
              <rect x="16" y={y - 15} width="328" height="42" rx="9" fill={index === 3 ? "#64748b0d" : "#2563eb0d"} stroke={index === 3 ? "#94a3b8" : "#60a5fa"} strokeWidth="1.1" />
              <text x="28" y={y + 10} fontSize="10" fontWeight="700" fill="currentColor">{item.label}</text>
              <text x="180" y={y + 10} fontSize="10" fill="currentColor">{item.seats}석</text>
              <text x="257" y={y + 10} fontSize="10" fontWeight="700" fill={item.critical === "없음" ? "#dc2626" : "#059669"}>{item.critical}</text>
            </g>
          );
        })}
        <rect x="36" y="292" width="288" height="46" rx="10" fill="#4f46e514" stroke="#4f46e5" strokeWidth="1.2" />
        <text x="180" y="312" textAnchor="middle" fontSize="10" fontWeight="700" fill="#4f46e5">결정적 횟수 · 2 · 2 · 2</text>
        <text x="180" y="328" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.68">세 당 연합에서는 누구를 빼도 과반이 남음</text>
      </svg>
    );
  }
  if (step === 2) {
    return (
      <svg className="block sm:!hidden" viewBox="0 0 360 350" role="img" aria-label="모바일에서 Banzhaf 투표력을 정규화하는 과정">
        <text x="180" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor">결정적 횟수 2 ÷ 전체 횟수 6</text>
        {NAMES.map((name, index) => {
          const y = 52 + index * 66;
          return (
            <g key={name}>
              <text x="48" y={y + 19} textAnchor="end" fontSize="10.5" fontWeight="700" fill={COLORS[index]}>{name}</text>
              <rect x="64" y={y} width="200" height="28" rx="8" fill={COLORS[index]} fillOpacity="0.55" />
              <text x="278" y={y + 19} fontSize="10" fontWeight="700" fill={COLORS[index]}>1/3</text>
            </g>
          );
        })}
        <rect x="24" y="260" width="312" height="68" rx="11" fill="#f59e0b14" stroke="#d97706" strokeWidth="1.1" />
        <text x="180" y="283" textAnchor="middle" fontSize="10" fontWeight="700" fill="#b45309">형식적 투표력은 세 당 모두 1/3</text>
        <text x="180" y="303" textAnchor="middle" fontSize="9.5" fill="currentColor">장관 자리나 정책 양보도</text>
        <text x="180" y="318" textAnchor="middle" fontSize="9.5" fill="currentColor">정확히 1/3이라는 뜻은 아닙니다</text>
      </svg>
    );
  }
  return (
    <svg className="block sm:!hidden" viewBox="0 0 360 350" role="img" aria-label="모바일에서 의석과 과반선을 비교하는 도식">
      <text x="180" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor">300석 의회 · 통과 정족수 151석</text>
      {seats.map((seat, index) => {
        const y = 48 + index * 54;
        return (
          <g key={NAMES[index]}>
            <text x="48" y={y + 20} textAnchor="end" fontSize="10.5" fontWeight="700" fill={COLORS[index]}>{NAMES[index]}</text>
            <rect x="64" y={y} width={(seat / 300) * 244} height="28" rx="7" fill={COLORS[index]} fillOpacity="0.25" stroke={COLORS[index]} strokeWidth="1.2" />
            <text x="316" y={y + 20} fontSize="10" fontWeight="700" fill={COLORS[index]}>{seat}</text>
          </g>
        );
      })}
      <line x1={64 + (151 / 300) * 244} y1="36" x2={64 + (151 / 300) * 244} y2="212" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="4 3" />
      <text x={64 + (151 / 300) * 244} y="228" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#dc2626">과반 151</text>
      <rect x="30" y="254" width="300" height="68" rx="11" fill={step === 0 ? "var(--muted)" : "#4f46e514"} opacity={step === 0 ? 0.48 : 1} stroke={step === 3 ? "#4f46e5" : "none"} strokeWidth="1.2" />
      <text x="180" y="279" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={step === 3 ? "#4f46e5" : "currentColor"}>{step === 0 ? "다당 의석 비율 6.7%" : "Banzhaf 값 · 1 · 0 · 0"}</text>
      <text x="180" y="299" textAnchor="middle" fontSize="9.5" fill="currentColor" opacity="0.7">{step === 0 ? "하지만 큰 두 당도 단독 과반이 아님" : "가당만 단독으로 결과를 만들 수 있음"}</text>
      <text x="180" y="314" textAnchor="middle" fontSize="9.5" fill="currentColor" opacity="0.7">{step === 0 ? "조합을 세어야 힘을 알 수 있음" : "120석 나당도 swing은 0"}</text>
    </svg>
  );
}

export default function PowerIndexViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const seats = SETUPS[step];
        const power = step === 3 ? [1, 0, 0] : [1 / 3, 1 / 3, 1 / 3];
        return (
          <>
          <MobilePowerDiagram step={step} />
          <svg className="!hidden sm:!block" viewBox="0 0 580 300" role="img" aria-label="의석에서 결정적 연합을 세어 Banzhaf 투표력을 구하는 과정">
            <text x="290" y="20" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor">
              가중 표결 게임 · 300석, 통과 정족수 151석
            </text>

            {(step === 0 || step === 3) && <SeatBars seats={seats} />}

            {step === 0 && (
              <g>
                <rect x="96" y="211" width="388" height="54" rx="12" fill="var(--muted)" opacity="0.48" />
                <text x="290" y="233" textAnchor="middle" fontSize="10" fontWeight="700" fill="currentColor">다당 의석 비율 6.7%</text>
                <text x="290" y="251" textAnchor="middle" fontSize="9.5" fill="currentColor" opacity="0.68">그러나 어느 큰 당도 다당 없이 단독 과반이 아닙니다</text>
              </g>
            )}

            {step === 1 && (
              <g>
                <text x="48" y="48" fontSize="9.5" fontWeight="700" fill="currentColor" opacity="0.65">이기는 연합</text>
                <text x="275" y="48" fontSize="9.5" fontWeight="700" fill="currentColor" opacity="0.65">합계</text>
                <text x="384" y="48" fontSize="9.5" fontWeight="700" fill="currentColor" opacity="0.65">빠지면 지는 당</text>
                {COALITIONS.map((item, index) => {
                  const y = 64 + index * 45;
                  return (
                    <g key={item.label}>
                      <rect x="38" y={y - 15} width="504" height="34" rx="8" fill={index === 3 ? "#64748b0d" : "#2563eb0d"} stroke={index === 3 ? "#94a3b8" : "#60a5fa"} strokeWidth="1.1" />
                      <text x="52" y={y + 6} fontSize="10" fontWeight="700" fill="currentColor">{item.label}</text>
                      <text x="278" y={y + 6} fontSize="10" fill="currentColor">{item.seats}석</text>
                      <text x="388" y={y + 6} fontSize="10" fontWeight="700" fill={item.critical === "없음" ? "#dc2626" : "#059669"}>{item.critical}</text>
                    </g>
                  );
                })}
                <text x="290" y="266" textAnchor="middle" fontSize="10" fontWeight="700" fill="#4f46e5">결정적 횟수 · 가당 2 · 나당 2 · 다당 2</text>
              </g>
            )}

            {step === 2 && (
              <g>
                <text x="290" y="52" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.7">결정적 횟수 ÷ 전체 결정적 횟수 6</text>
                {power.map((value, index) => {
                  const y = 78 + index * 55;
                  return (
                    <g key={NAMES[index]}>
                      <text x="70" y={y + 20} textAnchor="end" fontSize="10" fontWeight="700" fill={COLORS[index]}>{NAMES[index]}</text>
                      <rect x="86" y={y} width={value * 1050} height="28" rx="8" fill={COLORS[index]} fillOpacity="0.55" />
                      <text x="454" y={y + 20} fontSize="10" fontWeight="700" fill={COLORS[index]}>2/6 = 1/3</text>
                    </g>
                  );
                })}
                <rect x="92" y="247" width="396" height="35" rx="9" fill="#f59e0b14" stroke="#d97706" strokeWidth="1.1" />
                <text x="290" y="269" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#b45309">형식적 투표력 1/3 · 실제 연립 협상 결과 1/3이라는 뜻은 아님</text>
              </g>
            )}

            {step === 3 && (
              <g>
                <rect x="104" y="210" width="372" height="58" rx="12" fill="#4f46e514" stroke="#4f46e5" strokeWidth="1.2" />
                <text x="290" y="233" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#4f46e5">Banzhaf 값 · 1 · 0 · 0</text>
                <text x="290" y="251" textAnchor="middle" fontSize="9.5" fill="currentColor" opacity="0.68">가당만 단독으로 결과를 만들 수 있어 나당·다당의 swing이 없습니다</text>
              </g>
            )}
          </svg>
          </>
        );
      }}
    </StepViz>
  );
}
