import V2SceneShell from "./V2SceneShell";

/**
 * 본문 대응: #protocol-fee — 정규화 예 S1000, √kLast 1000, √k 1100.
 * 증가 100의 1/6 = 16.667은 √k 1100의 1/66. feeTo가 새 LP s를 받아 s/(1000+s) = 1/66 → s = 1000/65 ≈ 15.384615.
 * 6√k − 증가분 = 6600 − 100 = 6500 = 5√k + √kLast. 비교: 1000/66 ≈ 15.152만 발행하면 15.152/1015.152 = 1/67.
 */
const ROOT_K_LAST = 1000;
const ROOT_K = 1100;
const GROWTH = ROOT_K - ROOT_K_LAST;
const PROTOCOL_PART = GROWTH / 6;
const SUPPLY = 1000;
const MINT = (SUPPLY * GROWTH) / (5 * ROOT_K + ROOT_K_LAST);

const W = 360;
const H = 214;
const X0 = 20;
const X1 = 340;
const unit = (X1 - X0) / ROOT_K;
const ZOOM_X0 = 110;
const ZOOM_X1 = 340;
const ZOOM_SPLIT = ZOOM_X0 + ((ZOOM_X1 - ZOOM_X0) * 5) / 6;

const SCENES = [
  {
    label: "√k 증가",
    summary: "√kLast 1000 → √k 1100",
    note: "√k는 두 reserve 곱의 제곱근으로, 이 절에서 유동성의 크기를 재는 척도입니다. 마지막 mint·burn 직후 1000이던 값이 거래 수수료가 쌓여 1100이 됐다고 정규화한 예입니다.",
  },
  {
    label: "증가분의 1/6",
    summary: "100 ÷ 6 ≈ 16.667 = 1100의 1/66",
    note: "늘어난 100을 5 : 1로 나눠 1/6인 16.667을 프로토콜 몫으로 봅니다. 이 몫은 지금 풀 전체 1100의 1/66, 약 1.515%입니다.",
  },
  {
    label: "새 지분까지 넣어 비율 맞추기",
    summary: "s ÷ (1000 + s) = 1/66 → s ≈ 15.384615",
    note: "feeTo가 새 LP s를 받으면 총공급도 1000 + s로 늘어납니다. 기존 1000의 1/66인 15.152만 발행하면 15.152 ÷ 1015.152 = 1/67이라 모자랍니다(비교용 계산). 늘어난 총공급 안에서 1/66이 되려면 s = 1000/65 ≈ 15.384615입니다.",
  },
  {
    label: "식의 분모",
    summary: "6 × 1100 − 100 = 5 × 1100 + 1000 = 6500",
    note: "같은 조건을 정리하면 s = 1000 × 100 ÷ (6√k − 증가분)입니다. 6√k − (√k − √kLast)가 곧 5√k + √kLast이므로 1000 × 100 ÷ 6500 ≈ 15.384615로 위 식과 같습니다. 교환량의 0.05%를 송금한 값이 아닙니다.",
  },
] as const;

export default function ProtocolFeeShareViz() {
  return (
    <V2SceneShell
      eyebrow="프로토콜 수수료 지분"
      title="새 지분이 총공급에 더해지므로 분모가 5√k + √kLast가 됩니다"
      description="위 막대는 √k(0~1100), 아래 막대는 LP 총공급입니다. 두 막대는 같은 길이 비율로 그렸고, 12절의 S1000·√k1100·√kLast1000 정규화 예를 그대로 씁니다."
      ariaLabel="√k 증가분의 6분의 1을 프로토콜 몫으로 보고 새 LP 지분 수를 정하는 과정"
      scenes={SCENES}
      render={(active) => {
        const protoX = X0 + (ROOT_K - PROTOCOL_PART) * unit;
        const supplyEnd = X0 + SUPPLY * unit;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={X0} y={14} fontSize={10} fontWeight={700} fill="#334155">√k</text>
            <rect x={X0} y={20} width={ROOT_K_LAST * unit} height={20} fill="#94a3b8" />
            <rect x={X0 + ROOT_K_LAST * unit} y={20} width={GROWTH * unit} height={20} fill={active === 0 ? "#2563eb" : "#93c5fd"} />
            {active >= 1 && <rect x={protoX} y={20} width={PROTOCOL_PART * unit} height={20} fill="#d97706" />}
            <text x={X0 + (ROOT_K_LAST * unit) / 2} y={34} textAnchor="middle" fontSize={10} fill="#ffffff">√kLast 1000</text>
            <text x={X1} y={14} textAnchor="end" fontSize={10} fill="#2563eb">증가 100</text>
            <line x1={X0 + ROOT_K_LAST * unit} x2={X0 + ROOT_K_LAST * unit} y1={18} y2={42} stroke="#334155" strokeWidth={1} />

            {active >= 1 && (
              <g>
                <line x1={X0 + ROOT_K_LAST * unit} y1={42} x2={ZOOM_X0} y2={66} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                <line x1={X1} y1={42} x2={ZOOM_X1} y2={66} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                <rect x={ZOOM_X0} y={66} width={ZOOM_SPLIT - ZOOM_X0} height={22} fill="#93c5fd" />
                <rect x={ZOOM_SPLIT} y={66} width={ZOOM_X1 - ZOOM_SPLIT} height={22} fill="#d97706" />
                <text x={(ZOOM_X0 + ZOOM_SPLIT) / 2} y={81} textAnchor="middle" fontSize={10} fill="#1e3a8a">기존 LP 몫 5/6 · 83.333</text>
                <text x={(ZOOM_SPLIT + ZOOM_X1) / 2} y={81} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ffffff">1/6</text>
                <text x={ZOOM_X1} y={102} textAnchor="end" fontSize={10} fill="#b45309">16.667 ÷ 1100 = 1/66</text>
                <text x={ZOOM_X0 - 6} y={81} textAnchor="end" fontSize={9} fill="#64748b">증가 100 확대</text>
              </g>
            )}

            {active >= 2 && (
              <g>
                <text x={X0} y={128} fontSize={10} fontWeight={700} fill="#334155">LP 총공급</text>
                <rect x={X0} y={134} width={SUPPLY * unit} height={20} fill="#94a3b8" />
                <rect x={supplyEnd} y={134} width={MINT * unit} height={20} fill="#d97706" />
                <text x={X0 + (SUPPLY * unit) / 2} y={148} textAnchor="middle" fontSize={10} fill="#ffffff">기존 LP 1000</text>
                <line x1={supplyEnd + (MINT * unit) / 2} y1={156} x2={supplyEnd + (MINT * unit) / 2} y2={168} stroke="#b45309" strokeWidth={1} />
                <text x={X1} y={180} textAnchor="end" fontSize={10} fontWeight={700} fill="#b45309">feeTo 새 지분 s ≈ 15.385</text>
                <text x={X0} y={200} fontSize={10} fill="#334155">새 총공급 중 feeTo 비율: 15.385 ÷ 1015.385 = 1/66</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
