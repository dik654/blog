import StepViz from "@/components/ui/step-viz";

const STEPS = [
  { label: "가상 증거 평가를 π=0.92라고 둠", body: "출입 기록·영상·발견 물건과 H의 설명을 본 뒤 92%라고 숫자로 표현할 수 있다고 가정합니다. 실제 법관이 이렇게 확률을 적는다는 뜻이 아닙니다." },
  { label: "오류 비용이 같으면 장난감 문턱은 50%", body: "r=1이면 r/(1+r)=1/2입니다. π=0.92가 이를 넘으므로 이 모형은 유죄 쪽 기대손실이 작다고 말합니다." },
  { label: "오유죄가 10배 무거우면 문턱은 약 90.9%", body: "r=10이면 10/11≈0.909입니다. 같은 π=0.92가 아주 조금 넘습니다. 이것은 계산 예이지 형사법의 숫자 기준이 아닙니다." },
  { label: "100배면 99%라 판정이 바뀌지만 실제 법은 숫자를 쓰지 않음", body: "r=100이면 100/101≈0.990이라 π=0.92는 못 넘습니다. 실제 합리적 의심 없는 증명은 이 r이나 π를 정하지 않고 증거 전체와 남은 합리적 대안을 이유로 평가합니다." },
] as const;

const C = { evidence: "#0284c7", threshold: "#4f46e5", convict: "#dc2626", acquit: "#059669", caution: "#d97706", muted: "#64748b" } as const;
const PI = 0.92;
const threshold = (r: number) => r / (1 + r);
const pct = (n: number) => `${(n * 100).toFixed(n === 0.5 ? 0 : 1)}%`;

function currentRatio(step: number) {
  if (step <= 1) return 1;
  if (step === 2) return 10;
  return 100;
}

function MobileThreshold({ step }: { step: number }) {
  const r = currentRatio(step);
  const t = threshold(r);
  const verdict = PI > t ? "장난감 모형: 유죄 쪽 손실이 작음" : "장난감 모형: 무죄 쪽 손실이 작음";
  return (
    <svg className="block sm:!hidden" viewBox="0 0 360 390" role="img" aria-label="같은 가상 증거 확률과 다른 오류 비용 비를 비교하는 모바일 도식">
      <rect x="40" y="18" width="280" height="60" rx="11" fill="#0284c712" stroke={C.evidence} strokeWidth="1.2" />
      <text x="180" y="40" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.evidence}>가상 증거 평가 π = 0.92</text>
      <text x="180" y="59" textAnchor="middle" fontSize="9.5" fill="currentColor">실제 법정 수치가 아닌 사고실험의 입력</text>

      <line x1="38" y1="126" x2="322" y2="126" stroke={C.muted} strokeWidth="1.2" />
      {[0, 0.5, 0.75, 1].map((tick) => {
        const x = 38 + tick * 284;
        return <g key={tick}><line x1={x} y1="120" x2={x} y2="132" stroke={C.muted} strokeWidth="1.2" /><text x={x} y="147" textAnchor="middle" fontSize="8.8" fill={C.muted}>{Math.round(tick * 100)}%</text></g>;
      })}
      <line x1={38 + t * 284} y1="99" x2={38 + t * 284} y2="160" stroke={C.threshold} strokeWidth="1.2" />
      <circle cx={38 + t * 284} cy="99" r="4" fill={C.threshold} />
      <text x={Math.min(314, Math.max(46, 38 + t * 284))} y="88" textAnchor={t > 0.85 ? "end" : "middle"} fontSize="9.5" fontWeight="700" fill={C.threshold}>문턱 {pct(t)}</text>
      <line x1={38 + PI * 284} y1="113" x2={38 + PI * 284} y2="171" stroke={C.evidence} strokeWidth="1.2" />
      <circle cx={38 + PI * 284} cy="171" r="4.5" fill={C.evidence} />
      <text x={38 + PI * 284} y="188" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={C.evidence}>π 92%</text>

      <rect x="42" y="210" width="276" height="70" rx="11" fill={PI > t ? "#dc262612" : "#05966912"} stroke={PI > t ? C.convict : C.acquit} strokeWidth="1.2" />
      <text x="180" y="234" textAnchor="middle" fontSize="10" fontWeight="700" fill={PI > t ? C.convict : C.acquit}>{verdict}</text>
      <text x="180" y="255" textAnchor="middle" fontSize="9.5" fill="currentColor">r={r} → 문턱 {r}/{1 + r} = {pct(t)}</text>
      <text x="180" y="271" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.68">같은 π여도 가정한 오류 비가 판정을 바꿈</text>

      <rect x="32" y="306" width="296" height="56" rx="11" fill="#d9770612" stroke={C.caution} strokeWidth="1.2" />
      <text x="180" y="329" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.caution}>{step === 3 ? "실제 법: 합리적 의심 없음 ≠ 99%" : "아직 법적 증명 기준을 계산한 것이 아닙니다"}</text>
      <text x="180" y="348" textAnchor="middle" fontSize="9.2" fill="currentColor">{step === 3 ? "증거 전체·대안 설명·이유 제시로 판단" : "π와 r 모두 학습용 가정"}</text>
      <text x="180" y="385" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={C.caution}>구조를 이해하되 숫자를 법정 기준으로 읽지 않습니다</text>
    </svg>
  );
}

export default function ProofThresholdViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const r = currentRatio(step);
        const t = threshold(r);
        const verdict = PI > t;
        return (
          <>
            <MobileThreshold step={step} />
            <svg className="!hidden sm:!block" viewBox="0 0 700 300" role="img" aria-label="같은 가상 증거 확률과 다른 오류 비용 비를 비교하는 도식">
              <rect x="28" y="32" width="202" height="70" rx="12" fill="#0284c712" stroke={C.evidence} strokeWidth="1.2" />
              <text x="129" y="58" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.evidence}>가상 증거 평가 π = 0.92</text>
              <text x="129" y="79" textAnchor="middle" fontSize="9.3" fill="currentColor">실제 법정 수치가 아닌 입력</text>
              <text x="129" y="94" textAnchor="middle" fontSize="8.5" fill="currentColor" opacity="0.65">출입 기록 · 영상 · 발견 물건 · H의 설명</text>

              <line x1="274" y1="90" x2="650" y2="90" stroke={C.muted} strokeWidth="1.2" />
              {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
                const x = 274 + tick * 376;
                return <g key={tick}><line x1={x} y1="84" x2={x} y2="96" stroke={C.muted} strokeWidth="1.2" /><text x={x} y="111" textAnchor="middle" fontSize="8.5" fill={C.muted}>{Math.round(tick * 100)}%</text></g>;
              })}
              <line x1={274 + t * 376} y1="50" x2={274 + t * 376} y2="124" stroke={C.threshold} strokeWidth="1.2" />
              <circle cx={274 + t * 376} cy="50" r="4" fill={C.threshold} />
              <text x={Math.min(648, 274 + t * 376)} y="40" textAnchor={t > 0.85 ? "end" : "middle"} fontSize="9.5" fontWeight="700" fill={C.threshold}>장난감 문턱 {pct(t)}</text>
              <line x1={274 + PI * 376} y1="74" x2={274 + PI * 376} y2="136" stroke={C.evidence} strokeWidth="1.2" />
              <circle cx={274 + PI * 376} cy="136" r="4.5" fill={C.evidence} />
              <text x={274 + PI * 376} y="154" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={C.evidence}>π 92%</text>

              <rect x="78" y="176" width="260" height="72" rx="12" fill={verdict ? "#dc262612" : "#05966912"} stroke={verdict ? C.convict : C.acquit} strokeWidth="1.2" />
              <text x="208" y="201" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={verdict ? C.convict : C.acquit}>{verdict ? "모형: 유죄 쪽 기대손실이 작음" : "모형: 무죄 쪽 기대손실이 작음"}</text>
              <text x="208" y="224" textAnchor="middle" fontSize="10" fill="currentColor">r={r} → {r}/{1 + r} = {pct(t)}</text>
              <text x="208" y="240" textAnchor="middle" fontSize="8.8" fill="currentColor" opacity="0.66">같은 π도 오류 비 가정에 따라 판정이 바뀜</text>

              <rect x="370" y="176" width="262" height="72" rx="12" fill="#d9770612" stroke={C.caution} strokeWidth="1.2" />
              <text x="501" y="201" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.caution}>{step === 3 ? "실제 법: 합리적 의심 없음 ≠ 99%" : "법적 기준을 산출한 것이 아님"}</text>
              <text x="501" y="224" textAnchor="middle" fontSize="9.2" fill="currentColor">{step === 3 ? "증거 전체와 대안 설명을 이유로 평가" : "π와 r은 모두 사고실험의 가정"}</text>
              <text x="501" y="241" textAnchor="middle" fontSize="8.8" fill="currentColor" opacity="0.66">백분율을 판결 기준으로 옮기지 않음</text>
              <text x="350" y="286" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.caution}>숫자는 오류 배분의 구조를 보이고, 법은 실제 판단 규칙을 정합니다</text>
            </svg>
          </>
        );
      }}
    </StepViz>
  );
}
