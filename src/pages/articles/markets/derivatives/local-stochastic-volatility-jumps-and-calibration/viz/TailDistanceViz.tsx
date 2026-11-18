import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case 둘째 문단 — 연 20%의 하루 표준 흔들림 20%÷√252≈1.26%, 하루 −10%는 10÷1.26≈7.9배.
 * 가로 = 하루 수익률(%). 곡선 = 표준편차 1.26%인 단순 정규 그림의 모양(세로 눈금 없음).
 * 칸 하나 = 1.26%. 확률 숫자는 본문에 없어 적지 않는다.
 */
const W = 360;
const H = 190;
const X_LEFT = 16;
const X_RIGHT = 344;
const R_MIN = -11;
const R_MAX = 4;
const Y_BASE = 130;
const PEAK = 80;
const SIGMA = 20 / Math.sqrt(252);
const SHOCK = -10;
const RATIO = Math.abs(SHOCK) / SIGMA;
const x = (ret: number) => X_LEFT + ((ret - R_MIN) / (R_MAX - R_MIN)) * (X_RIGHT - X_LEFT);
const CURVE = Array.from({ length: 151 }, (_, index) => R_MIN + (index * (R_MAX - R_MIN)) / 150)
  .map((ret) => `${x(ret).toFixed(1)},${(Y_BASE - PEAK * Math.exp(-0.5 * (ret / SIGMA) ** 2)).toFixed(1)}`)
  .join(" ");
const STEPS = Array.from({ length: 8 }, (_, index) => -(index + 1) * SIGMA);

const SCENES = [
  { label: "하루 표준 흔들림", summary: "20% ÷ √252 ≈ 1.26%", note: "연 20%를 거래일 252일의 제곱근으로 나누면 하루 표준 흔들림은 약 1.26%입니다. 곡선은 이 값 하나로 그린 단순 정규 그림이고, 가운데 띠가 ±1.26%입니다." },
  { label: "1.26%씩 칸으로 재기", summary: "칸 하나 = 1.26%", note: "아래쪽으로 1.26%씩 칸을 이어 붙입니다. 몇 칸만 가도 곡선은 바닥에 붙어 보이지 않을 만큼 낮아집니다." },
  { label: "하루 −10%의 자리", summary: `−10 ÷ 1.26 ≈ ${RATIO.toFixed(1)}칸`, note: "하루 −10% 이동은 약 7.9칸 바깥입니다. 실제로 이런 이동이 관측된다면 연속적인 작은 흔들림만으로 꼬리를 설명하기 어렵다는 신호로 읽습니다." },
] as const;

const CURVE_COLOR = "#2563eb";
const STEP_COLOR = "#64748b";
const SHOCK_COLOR = "#dc2626";

export default function TailDistanceViz() {
  return (
    <SceneShell
      eyebrow="꼬리까지의 거리"
      title="하루 −10%는 1.26% 칸으로 약 7.9칸 떨어져 있습니다"
      description="가로축은 하루 수익률(%)입니다. 곡선은 연 20% 흔들림 하나만 쓰는 단순 정규 그림의 모양이며 세로 눈금은 없습니다."
      ariaLabel="표준편차 1.26퍼센트인 정규 곡선과 1.26퍼센트 칸으로 잰 하루 마이너스 10퍼센트의 위치, 약 7.9칸"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <rect x={x(-SIGMA)} y={Y_BASE - PEAK - 6} width={x(SIGMA) - x(-SIGMA)} height={PEAK + 6} fill="#dbeafe" opacity={active === 0 ? 1 : 0.5} />
          <polyline points={CURVE} fill="none" stroke={CURVE_COLOR} strokeWidth={1.25} />
          <line x1={X_LEFT} x2={X_RIGHT} y1={Y_BASE} y2={Y_BASE} stroke="#94a3b8" strokeWidth={1} />
          {[-10, -5, 0].map((tick) => (
            <g key={tick}>
              <line x1={x(tick)} x2={x(tick)} y1={Y_BASE} y2={Y_BASE + 5} stroke="#94a3b8" strokeWidth={1} />
              <text x={x(tick)} y={Y_BASE + 18} textAnchor="middle" fontSize={12} fill="#64748b">{tick === 0 ? "0%" : `${tick}%`}</text>
            </g>
          ))}
          <text x={x(0)} y={Y_BASE - PEAK - 12} textAnchor="middle" fontSize={12} fontWeight={700} fill={CURVE_COLOR}>±1.26%</text>

          {active >= 1 &&
            STEPS.map((value, index) => (
              <g key={value}>
                <line x1={x(value)} x2={x(value)} y1={Y_BASE + 26} y2={Y_BASE + 36} stroke={STEP_COLOR} strokeWidth={1} />
                <text x={(x(value) + x(value + SIGMA)) / 2} y={Y_BASE + 50} textAnchor="middle" fontSize={11} fill={STEP_COLOR}>{index + 1}</text>
              </g>
            ))}
          {active >= 1 && <line x1={x(STEPS[7])} x2={x(0)} y1={Y_BASE + 31} y2={Y_BASE + 31} stroke={STEP_COLOR} strokeWidth={1} />}
          {active >= 1 && <text x={x(0) + 6} y={Y_BASE + 35} fontSize={11} fill={STEP_COLOR}>칸 번호</text>}

          {active === 2 && (
            <g>
              <line x1={x(SHOCK)} x2={x(SHOCK)} y1={Y_BASE - 64} y2={Y_BASE + 2} stroke={SHOCK_COLOR} strokeWidth={1.25} />
              <circle cx={x(SHOCK)} cy={Y_BASE} r={4} fill={SHOCK_COLOR} />
              <text x={x(SHOCK) + 6} y={Y_BASE - 54} fontSize={12} fontWeight={700} fill={SHOCK_COLOR}>하루 −10%</text>
              <text x={x(SHOCK) + 6} y={Y_BASE - 38} fontSize={12} fill={SHOCK_COLOR}>약 {RATIO.toFixed(1)}칸 바깥</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
