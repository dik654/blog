import StackedSceneShell from "./StackedSceneShell";

/**
 * 본문 대응: capm 절 — 요구 수익률 = 무위험 수익률 + 베타 × 시장 초과 수익률.
 * 본문 예시 r_f = 3%, E[r_m] − r_f = 5%. β = 1.2 → 3 + 6 = 9%.
 * β = 0 → 3%, β = 1 → 8%(시장 자체), β = 2 → 13%는 같은 식의 산술(β 값은 예시).
 */
const RF = 3;
const PREMIUM = 5;
const BETAS = [0, 1, 1.2, 2];
const required = (beta: number) => RF + beta * PREMIUM;
const fmt = (v: number) => (Number.isInteger(v) ? `${v}` : v.toFixed(1));

const SCENES = [
  {
    label: "β = 0 · 시장과 따로 움직임",
    summary: `${RF} + 0×${PREMIUM} = ${fmt(required(0))}%`,
    note: `시장이 어떻게 움직이든 따라 움직이지 않으면 피할 수 없는 위험을 지지 않습니다. 얹히는 몫이 0이라 요구 수익률은 무위험 수익률 ${RF}%에 머뭅니다(β 값은 예시).`,
  },
  {
    label: "β = 1 · 시장과 같은 만큼",
    summary: `${RF} + 1×${PREMIUM} = ${fmt(required(1))}%`,
    note: `베타가 1이면 시장과 같은 만큼 움직입니다. ${RF} + 1×${PREMIUM} = ${fmt(required(1))}%로, 시장 전체를 들고 있을 때의 기대 수익률(${RF} + ${PREMIUM})과 같습니다.`,
  },
  {
    label: "β = 1.2 · 본문 예시",
    summary: `${RF} + 1.2×${PREMIUM} = ${fmt(required(1.2))}%`,
    note: `시장이 1%포인트 움직일 때 평균 1.2%포인트 움직이는 자산입니다. 위험 한 단위의 값 ${PREMIUM}%에 1.2를 곱한 ${fmt(1.2 * PREMIUM)}%가 바닥 ${RF}% 위에 얹혀 ${fmt(required(1.2))}%입니다.`,
  },
  {
    label: "β = 2 · 두 배로",
    summary: `${RF} + 2×${PREMIUM} = ${fmt(required(2))}%`,
    note: `두 배로 움직이면 얹히는 몫도 두 배인 ${2 * PREMIUM}%가 되어 ${fmt(required(2))}%입니다(β 값은 예시). 곱해지는 것은 총 변동성이 아니라 시장과 겹치는 양뿐입니다.`,
  },
];

const ACCENT = "#6366f1";
const MUTED = "#94a3b8";
const INK = "#64748b";

const X0 = 96;
const PX_PER_PCT = 18; // 14% → 252px
const ARROW_PX = 40; // 1%p 움직임 → 40px

export default function CapmBuildViz() {
  return (
    <StackedSceneShell
      eyebrow="요구 수익률 조립"
      title="바닥 위에 '위험의 양 × 한 단위의 값'을 얹습니다"
      description="베타는 시장이 1%포인트 움직일 때 이 자산이 평균적으로 몇 %포인트 움직이는지입니다. 무위험 수익률 3%와 시장 초과 수익률 5%는 본문 식의 예시 값입니다."
      note="균형에서 성립할 관계를 말하는 모형이며 실제 수익률을 예측하지 않습니다. 본문은 실무에서 이 값을 정답이 아니라 출발점으로 쓴다고 적습니다."
      ariaLabel="베타에 따라 무위험 수익률 위에 얹히는 위험 보상"
      scenes={SCENES}
      render={(s) => {
        const beta = BETAS[s];
        const extra = beta * PREMIUM;
        const moveW = beta * ARROW_PX;
        return (
          <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[500px]" role="img" aria-label={`${SCENES[s].label}: ${SCENES[s].summary}`}>
            <text x={6} y={22} fontSize={10.5} fontWeight={700} fill={INK}>시장</text>
            <line x1={X0} y1={18} x2={X0 + ARROW_PX} y2={18} stroke={INK} strokeWidth={1.25} />
            <polygon points={`${X0 + ARROW_PX},14 ${X0 + ARROW_PX + 7},18 ${X0 + ARROW_PX},22`} fill={INK} />
            <text x={X0 + ARROW_PX + 12} y={22} fontSize={10.5} fill={INK}>+1%p</text>

            <text x={6} y={46} fontSize={10.5} fontWeight={700} fill={ACCENT}>이 자산</text>
            {moveW > 0 ? (
              <>
                <line x1={X0} y1={42} x2={X0 + moveW} y2={42} stroke={ACCENT} strokeWidth={1.25} />
                <polygon points={`${X0 + moveW},38 ${X0 + moveW + 7},42 ${X0 + moveW},46`} fill={ACCENT} />
              </>
            ) : (
              <circle cx={X0} cy={42} r={3} fill={ACCENT} />
            )}
            <text x={X0 + moveW + 12} y={46} fontSize={10.5} fontWeight={700} fill={ACCENT}>
              평균 +{fmt(beta)}%p
            </text>

            <line x1={6} y1={62} x2={354} y2={62} stroke={MUTED} strokeWidth={0.75} strokeOpacity={0.6} />

            <text x={6} y={96} fontSize={10.5} fontWeight={700} fill={INK}>요구 수익률</text>
            <rect x={X0} y={82} width={RF * PX_PER_PCT} height={22} fill={MUTED} fillOpacity={0.3} stroke={INK} strokeWidth={1} />
            <text x={X0 + (RF * PX_PER_PCT) / 2} y={97} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={INK}>{RF}%</text>
            {extra > 0 && (
              <>
                <rect x={X0 + RF * PX_PER_PCT} y={82} width={extra * PX_PER_PCT} height={22} fill={ACCENT} fillOpacity={0.3} stroke={ACCENT} strokeWidth={1} />
                <text x={X0 + (RF + extra / 2) * PX_PER_PCT} y={97} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={ACCENT}>
                  {fmt(beta)}×{PREMIUM} = {fmt(extra)}%
                </text>
              </>
            )}
            <text x={X0} y={122} fontSize={10} fill={INK}>바닥: 무위험 수익률</text>
            {extra > 0 && (
              <text x={X0 + RF * PX_PER_PCT + 4} y={136} fontSize={10} fill={ACCENT}>베타 × 위험 한 단위의 값</text>
            )}

            <text x={6} y={162} fontSize={11} fontWeight={700} fill={ACCENT}>
              {RF} + {fmt(beta)}×{PREMIUM} = {fmt(required(beta))}%
            </text>
          </svg>
        );
      }}
    />
  );
}
