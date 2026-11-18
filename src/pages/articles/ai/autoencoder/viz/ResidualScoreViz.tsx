import SceneShell from "./SceneShell";

/**
 * 본문 대응: reconstruction-anomaly-detection #threshold — 센서 12개를 같은 12개 좌표로 복원하고
 * s(x) = (1/12) Σ (x_j − x̂_j)², 그다음 τ와 비교한다. 잔차와 τ는 설명용 가정.
 * 잔차 [0.1,−0.2,0.1,0,1.2,−0.1,0.2,−0.1,0.1,0,−0.2,0.1] → 제곱합 1.62 → s = 0.135, τ = 0.1(가정) → 경보 후보.
 * 단위가 다른 경우: 센서 9의 원래 단위 잔차 10 → 제곱 100 → 합 101.61, 센서 9 몫 98.4%, 센서 5 몫 1.4%.
 */
const RESIDUAL: readonly number[] = [0.1, -0.2, 0.1, 0, 1.2, -0.1, 0.2, -0.1, 0.1, 0, -0.2, 0.1];
const RAW_RESIDUAL: readonly number[] = RESIDUAL.map((r, i) => (i === 8 ? 10 : r));
const N = RESIDUAL.length;
const TAU = 0.1;
const square = (values: readonly number[]) => values.map((r) => r * r);
const total = (values: readonly number[]) => values.reduce<number>((sum, v) => sum + v, 0);
const SQ = square(RESIDUAL);
const SQ_SUM = total(SQ);
const SCORE = SQ_SUM / N;
const RAW_SQ = square(RAW_RESIDUAL);
const RAW_SUM = total(RAW_SQ);
const pct = (v: number, sum: number) => `${((v / sum) * 100).toFixed(1)}%`;

const SCENES = [
  {
    label: "좌표별 차이",
    summary: "x_j − x̂_j · 센서 12개",
    note: "같은 feature 위치끼리 입력과 복원의 차이(residual)를 구합니다. 막대가 위면 복원이 실제보다 작고, 아래면 큽니다. 센서 5의 차이만 눈에 띄게 큽니다.",
  },
  {
    label: "제곱해 부호 지우기",
    summary: `제곱합 ${SQ_SUM.toFixed(2)}`,
    note: `제곱하면 부호가 사라지고 큰 차이는 더 커집니다. 센서 5의 1.2는 1.44가 되어 제곱합 ${SQ_SUM.toFixed(2)} 중 ${pct(SQ[4], SQ_SUM)}를 차지합니다.`,
  },
  {
    label: "평균 → 판정값과 비교",
    summary: `s = ${SQ_SUM.toFixed(2)} ÷ 12 = ${SCORE.toFixed(3)} > τ ${TAU}`,
    note: `제곱합을 feature 수 12로 나눈 ${SCORE.toFixed(3)}이 이 sample의 점수입니다. 가정한 τ=${TAU}보다 커서 경보 후보가 됩니다. 이 숫자는 모델이 잘 복원하지 못했다는 뜻일 뿐, 원인이나 조치를 알려 주지 않습니다.`,
  },
  {
    label: "단위가 다르면",
    summary: `센서 9가 합의 ${pct(RAW_SQ[8], RAW_SUM)}`,
    note: `센서 9만 scaling 없이 큰 단위로 남겨 두면, 그 단위의 차이 10(가정)이 제곱해 100이 됩니다. 제곱합 ${RAW_SUM.toFixed(2)} 중 센서 5의 1.44는 ${pct(RAW_SQ[4], RAW_SUM)}로 묻힙니다. 그래서 train에서 맞춘 scaler를 검증과 serving에 그대로 적용합니다.`,
  },
] as const;

const W = 340;
const H = 222;
const LEFT = 8;
const RIGHT = W - 8;
const SLOT = (RIGHT - LEFT) / N;
const BAR_W = SLOT * 0.62;
const TOP = 42;
const BOTTOM = 180;
const ZERO_SIGNED = (TOP + BOTTOM) / 2;

const BAR = "#64748b";
const HOT = "#dc2626";
const UNIT = "#d97706";
const ACCENT = "#2563eb";
const AXIS = "#94a3b8";

export default function ResidualScoreViz() {
  return (
    <SceneShell
      eyebrow="점수 한 개 만들기"
      title="센서 12개의 복원 차이가 점수 하나로 줄어드는 과정"
      description="막대 하나가 센서(feature) 하나입니다. x는 입력, x̂는 autoencoder가 복원한 값입니다. 잔차 값과 판정값 τ=0.1은 설명용 가정입니다."
      ariaLabel="센서 12개의 복원 잔차를 제곱하고 평균해 점수를 만든 뒤 판정값과 비교하는 과정"
      scenes={SCENES}
      render={(active) => {
        const signed = active === 0;
        const values = active === 3 ? RAW_SQ : signed ? RESIDUAL : SQ;
        const max = signed ? 1.4 : Math.max(...values);
        const half = (BOTTOM - TOP) / 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[500px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {values.map((v, i) => {
              const x = LEFT + i * SLOT + (SLOT - BAR_W) / 2;
              const color = active === 3 && i === 8 ? UNIT : i === 4 ? HOT : BAR;
              const len = signed ? (Math.abs(v) / max) * half : (v / max) * (BOTTOM - TOP);
              const y = signed ? (v >= 0 ? ZERO_SIGNED - len : ZERO_SIGNED) : BOTTOM - len;
              const showLabel = i === 4 || (active === 3 && i === 8);
              const valueText = signed ? v.toFixed(1) : v >= 10 ? v.toFixed(0) : v.toFixed(2);
              return (
                <g key={i}>
                  <rect x={x} y={y} width={BAR_W} height={Math.max(len, 0.8)} rx={1.5} fill={color} opacity={0.85} />
                  {showLabel && (
                    <text x={x + BAR_W / 2} y={signed ? y - 5 : Math.max(y - 5, TOP - 6)} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>{valueText}</text>
                  )}
                  <text x={x + BAR_W / 2} y={BOTTOM + 16} textAnchor="middle" fontSize={11} fill={i === 4 ? HOT : active === 3 && i === 8 ? UNIT : BAR}>{i + 1}</text>
                </g>
              );
            })}
            {active === 2 && (
              <>
                <line x1={LEFT} x2={RIGHT} y1={BOTTOM - (SCORE / max) * (BOTTOM - TOP)} y2={BOTTOM - (SCORE / max) * (BOTTOM - TOP)} stroke={ACCENT} strokeWidth={1.25} />
                <line x1={LEFT} x2={RIGHT} y1={BOTTOM - (TAU / max) * (BOTTOM - TOP)} y2={BOTTOM - (TAU / max) * (BOTTOM - TOP)} stroke={AXIS} strokeWidth={1} strokeDasharray="4 3" />
                <text x={RIGHT} y={BOTTOM - (SCORE / max) * (BOTTOM - TOP) - 22} textAnchor="end" fontSize={11} fill={ACCENT}>파랑 실선 = 평균 s</text>
                <text x={RIGHT} y={BOTTOM - (SCORE / max) * (BOTTOM - TOP) - 9} textAnchor="end" fontSize={11} fill={BAR}>회색 점선 = τ 0.1</text>
              </>
            )}
            <line x1={LEFT} x2={RIGHT} y1={signed ? ZERO_SIGNED : BOTTOM} y2={signed ? ZERO_SIGNED : BOTTOM} stroke={AXIS} strokeWidth={1} />
            <text x={RIGHT} y={BOTTOM + 34} textAnchor="end" fontSize={11} fill={BAR}>센서 번호</text>
            <text x={LEFT} y={16} fontSize={12} fontWeight={700} fill={active === 2 ? ACCENT : BAR}>
              {signed ? "x − x̂" : active === 2 ? `평균 ${SCORE.toFixed(3)} → 경보 후보` : active === 3 ? "제곱 (센서 9는 원래 단위, 가정)" : "(x − x̂)²"}
            </text>
          </svg>
        );
      }}
    />
  );
}
