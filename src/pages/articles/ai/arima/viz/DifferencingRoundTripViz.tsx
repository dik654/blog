import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview — "d번 반복한 Zt=(1−B)^dYt에 stationary ARMA를 맞추고, forecast는 누적해 원래 level로 되돌립니다."
 * d=1 예시. 모든 숫자는 그림용 가정.
 * Y = 100, 104, 107, 112, 116 → ΔY = 4, 3, 5, 4
 * ARMA가 낸 변화량 예측(가정) = 4, 4 → level 예측 = 116+4 = 120, 120+4 = 124
 */
const LEVEL = [100, 104, 107, 112, 116] as const;
const DIFF = LEVEL.slice(1).map((value, i) => value - LEVEL[i]);
const DIFF_FORECAST = [4, 4] as const;
const LEVEL_FORECAST = DIFF_FORECAST.reduce<number[]>((acc, step) => [...acc, (acc.length ? acc[acc.length - 1] : LEVEL[LEVEL.length - 1]) + step], []);
const STEPS = LEVEL.length + DIFF_FORECAST.length;

const SCENES = [
  {
    label: "원 level Yₜ",
    summary: "100 → 116, 계속 오름",
    note: "level은 시점마다 평균이 올라가므로 같은 평균·분산을 전제하는 ARMA에 바로 넣기 어렵습니다.",
  },
  {
    label: "차분 ΔYₜ = Yₜ − Yₜ₋₁",
    summary: "4 · 3 · 5 · 4",
    note: "직전 값을 빼면 오르는 추세가 사라지고 매달의 증가분만 남습니다. 점 다섯 개가 증가분 네 개가 되어, 첫 시점은 차분 값이 없습니다.",
  },
  {
    label: "ARMA는 증가분을 예측",
    summary: "다음 두 증가분 4 · 4 (가정)",
    note: "ARMA가 맞추는 대상은 아래 증가분 series입니다. 예측도 증가분으로 나옵니다. 여기서 4와 4는 계산 흐름을 보이려고 정한 값입니다.",
  },
  {
    label: "누적해 level로 되돌림",
    summary: "116 + 4 = 120, 120 + 4 = 124",
    note: "마지막 관측 level 116에 예측 증가분을 차례로 더해 원래 단위의 예측을 만듭니다. 두 번째 예측은 실제 관측이 아니라 첫 번째 예측 120 위에 쌓입니다.",
  },
] as const;

const W = 360;
const LEFT = 30;
const RIGHT = 14;
const SLOT = (W - LEFT - RIGHT) / STEPS;
const cx = (t: number) => LEFT + SLOT * t + SLOT / 2;

const TOP_Y0 = 16;
const TOP_H = 92;
const LV_MIN = 96;
const LV_MAX = 128;
const ly = (value: number) => TOP_Y0 + TOP_H - ((value - LV_MIN) / (LV_MAX - LV_MIN)) * TOP_H;

const BOT_BASE = 196;
const BOT_UNIT = 11;
const H = 226;

export default function DifferencingRoundTripViz() {
  return (
    <SceneShell
      eyebrow="차분과 되돌리기"
      title="ARMA는 증가분을 예측하고, level 예측은 그 증가분을 쌓아 만듭니다"
      description="d=1인 경우입니다. 위는 원래 level, 아래는 직전 대비 증가분입니다. series 값과 예측 증가분은 모두 그림을 위한 가정입니다."
      ariaLabel="level series를 차분하고 예측 증가분을 누적해 level 예측으로 되돌리는 과정"
      scenes={SCENES}
      render={(active) => {
        const showDiff = active >= 1;
        const showDiffForecast = active >= 2;
        const showLevelForecast = active >= 3;
        const lastLevel = LEVEL[LEVEL.length - 1];
        const levelPath = LEVEL.map((value, t) => `${t === 0 ? "M" : "L"}${cx(t)},${ly(value)}`).join(" ");
        const forecastPath = [lastLevel, ...LEVEL_FORECAST].map((value, i) => `${i === 0 ? "M" : "L"}${cx(LEVEL.length - 1 + i)},${ly(value)}`).join(" ");
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={4} y={TOP_Y0 - 4} fontSize={10} fontWeight={700} fill="#64748b">level Y</text>
            <line x1={cx(LEVEL.length - 1) + SLOT / 2} x2={cx(LEVEL.length - 1) + SLOT / 2} y1={TOP_Y0} y2={BOT_BASE + 4} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
            <text x={cx(LEVEL.length - 1) + SLOT / 2 + 4} y={TOP_Y0 + 6} fontSize={9} fill="#94a3b8">예측 →</text>
            <path d={levelPath} fill="none" stroke="#64748b" strokeWidth={1.25} />
            {LEVEL.map((value, t) => (
              <g key={`l${t}`}>
                <circle cx={cx(t)} cy={ly(value)} r={3.5} fill="#64748b" />
                <text x={cx(t)} y={ly(value) - 8} textAnchor="middle" fontSize={10} fontWeight={700} fill="#334155">{value}</text>
              </g>
            ))}
            {showLevelForecast && (
              <>
                <path d={forecastPath} fill="none" stroke="#2563eb" strokeWidth={1.25} strokeDasharray="4 3" />
                {LEVEL_FORECAST.map((value, i) => (
                  <g key={`lf${i}`}>
                    <circle cx={cx(LEVEL.length + i)} cy={ly(value)} r={3.5} fill="#ffffff" stroke="#2563eb" strokeWidth={1.25} />
                    <text x={cx(LEVEL.length + i)} y={ly(value) - 8} textAnchor="middle" fontSize={10} fontWeight={700} fill="#2563eb">{value}</text>
                  </g>
                ))}
              </>
            )}

            <text x={4} y={BOT_BASE - 5 * BOT_UNIT - 12} fontSize={10} fontWeight={700} fill="#64748b">증가분 ΔY</text>
            <line x1={LEFT} x2={W - RIGHT} y1={BOT_BASE} y2={BOT_BASE} stroke="#94a3b8" strokeWidth={1} />
            {showDiff &&
              DIFF.map((value, i) => {
                const t = i + 1;
                const h = value * BOT_UNIT;
                return (
                  <g key={`d${t}`}>
                    <rect x={cx(t) - 9} y={BOT_BASE - h} width={18} height={h} rx={2} fill="#d97706" opacity={0.8} />
                    <text x={cx(t)} y={BOT_BASE - h - 4} textAnchor="middle" fontSize={10} fontWeight={700} fill="#334155">{value}</text>
                  </g>
                );
              })}
            {showDiff && (
              <text x={cx(0)} y={BOT_BASE - 5} textAnchor="middle" fontSize={9} fill="#94a3b8">없음</text>
            )}
            {showDiffForecast &&
              DIFF_FORECAST.map((value, i) => {
                const t = LEVEL.length + i;
                const h = value * BOT_UNIT;
                return (
                  <g key={`df${t}`}>
                    <rect x={cx(t) - 9} y={BOT_BASE - h} width={18} height={h} rx={2} fill="#ffffff" stroke="#d97706" strokeWidth={1.25} strokeDasharray="3 2" />
                    <text x={cx(t)} y={BOT_BASE - h - 4} textAnchor="middle" fontSize={10} fontWeight={700} fill="#d97706">{value}</text>
                  </g>
                );
              })}
            {Array.from({ length: STEPS }, (_, t) => (
              <text key={`t${t}`} x={cx(t)} y={H - 6} textAnchor="middle" fontSize={10} fill="#64748b">t{t + 1}</text>
            ))}
          </svg>
        );
      }}
    />
  );
}
