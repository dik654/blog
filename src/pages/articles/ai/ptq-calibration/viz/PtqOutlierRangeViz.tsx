import SceneShell from "./SceneShell";

/**
 * 본문 대응: #dynamic-static-outliers — channel 하나가 훨씬 크면 tensor 전체 min/max를 정해
 * 나머지 channel의 rounding error가 커진다.
 * 값·눈금 수는 설명용 가정: 보통 channel 7개(|x| ≤ 0.9), outlier channel 16, 대칭 눈금 17개(간격 = R/8).
 * outlier 없음: R 0.9 → 간격 0.1125, 최대 오차 ≈ 0.03 / outlier 있음: R 16 → 간격 2, 보통 channel은 모두 0으로.
 */
const NORMAL = [0.82, -0.47, 0.31, -0.9, 0.55, -0.2, 0.68] as const;
const OUTLIER = 16;
const TICKS = 17;
const HALF = (TICKS - 1) / 2;

const rangeOf = (values: readonly number[]) => Math.max(...values.map((v) => Math.abs(v)));
const quantize = (x: number, range: number) => {
  const step = range / HALF;
  return Math.round(x / step) * step;
};
const maxError = (range: number) => Math.max(...NORMAL.map((x) => Math.abs(quantize(x, range) - x)));

const R_CLEAN = rangeOf(NORMAL);
const R_OUT = rangeOf([...NORMAL, OUTLIER]);
const ERR_CLEAN = maxError(R_CLEAN);
const ERR_OUT = maxError(R_OUT);

const fmt = (value: number, digits = 2) => value.toFixed(digits);

const SCENES = [
  {
    label: "Outlier가 없으면 눈금이 촘촘합니다",
    summary: `range ±${fmt(R_CLEAN, 1)} · 간격 ${fmt(R_CLEAN / HALF, 3)}`,
    note: `보통 channel 7개 중 가장 큰 크기가 0.9이므로 range가 ±0.9가 되고, 눈금 17개가 그 안에 촘촘히 놓입니다. 각 값은 가장 가까운 눈금으로 반올림되며 가장 큰 rounding error도 ${fmt(ERR_CLEAN, 3)} 정도입니다. 값과 눈금 수는 설명용 가정입니다.`,
  },
  {
    label: "Channel 하나가 16이면 range가 그 값을 따라갑니다",
    summary: `range ±${OUTLIER} · 간격 ${fmt(R_OUT / HALF, 0)}`,
    note: "같은 tensor에 16짜리 outlier channel(가정)이 하나 들어오면 min/max가 그 channel로 정해집니다. 눈금 수는 그대로 17개라 간격이 2로 벌어지고, 나머지 7개 channel은 모두 가운데 한 칸 안에 몰립니다.",
  },
  {
    label: "나머지 channel은 모두 0으로 반올림됩니다",
    summary: `최대 rounding error ${fmt(ERR_CLEAN, 3)} → ${fmt(ERR_OUT, 1)}`,
    note: "간격이 2이면 크기가 1보다 작은 값은 모두 0으로 반올림됩니다. 보통 channel이 가진 정보가 사라지고, rounding error는 값 자체 크기만큼 커집니다. Outlier handling은 이 난이도를 다른 곳으로 옮기는 방법들입니다.",
  },
] as const;

const W = 360;
const LEFT = 16;
const AXIS_W = W - 2 * LEFT;
const AXIS_Y = 70;
const ERR_AXIS = 1;

export default function PtqOutlierRangeViz() {
  return (
    <SceneShell
      eyebrow="Outlier activation"
      title="큰 channel 하나가 모든 channel의 눈금 간격을 정합니다"
      description="가로줄은 한 tensor의 range(0을 가운데 둔 대칭 range, 가정)이고 세로 눈금 17개가 표현 가능한 값입니다(가정). 파란 점은 보통 channel 7개, 빨간 점은 outlier channel, 주황 점은 반올림된 값입니다. 모든 값은 설명용 가정입니다."
      ariaLabel="outlier channel이 tensor range를 넓혀 나머지 channel의 rounding error를 키우는 과정"
      scenes={SCENES}
      render={(active) => {
        const range = active === 0 ? R_CLEAN : R_OUT;
        const px = (x: number) => LEFT + ((x + range) / (2 * range)) * AXIS_W;
        const showOutlier = active >= 1;
        const showRounded = active !== 1;
        const err = active === 0 ? ERR_CLEAN : active === 2 ? ERR_OUT : null;
        return (
          <svg viewBox={`0 0 ${W} 176`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={LEFT} y={14} fontSize={11} fontWeight={700} fill="#475569">
              range ±{active === 0 ? fmt(R_CLEAN, 1) : OUTLIER} · 눈금 {TICKS}개
            </text>
            <line x1={LEFT} x2={W - LEFT} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {Array.from({ length: TICKS }, (_, i) => {
              const x = LEFT + (i / (TICKS - 1)) * AXIS_W;
              return <line key={i} x1={x} x2={x} y1={AXIS_Y - 6} y2={AXIS_Y + 6} stroke="#94a3b8" strokeWidth={1} />;
            })}
            <text x={LEFT} y={AXIS_Y + 20} textAnchor="middle" fontSize={11} fill="#64748b">
              −{active === 0 ? fmt(R_CLEAN, 1) : OUTLIER}
            </text>
            <text x={W / 2} y={AXIS_Y + 20} textAnchor="middle" fontSize={11} fill="#64748b">
              0
            </text>
            <text x={W - LEFT} y={AXIS_Y + 20} textAnchor="middle" fontSize={11} fill="#64748b">
              {active === 0 ? fmt(R_CLEAN, 1) : OUTLIER}
            </text>
            {NORMAL.map((x, i) => (
              <circle key={`v${i}`} cx={px(x)} cy={AXIS_Y - 16 - (i % 3) * 7} r={3.5} fill="#2563eb" fillOpacity={0.75} />
            ))}
            {showOutlier && <circle cx={px(OUTLIER)} cy={AXIS_Y - 16} r={4} fill="#dc2626" />}
            {showOutlier && (
              <text x={px(OUTLIER)} y={AXIS_Y - 26} textAnchor="end" fontSize={11} fontWeight={700} fill="#dc2626">
                outlier 16
              </text>
            )}
            {showRounded &&
              NORMAL.map((x, i) => (
                <circle key={`q${i}`} cx={px(quantize(x, range))} cy={AXIS_Y + 34} r={3.5} fill="#d97706" fillOpacity={0.75} />
              ))}
            <text x={LEFT} y={AXIS_Y + 56} fontSize={11} fill="#b45309" opacity={showRounded ? 1 : 0}>
              반올림된 값
            </text>

            <text x={LEFT} y={144} fontSize={11} fontWeight={700} fill="#475569">
              보통 channel의 최대 rounding error
            </text>
            <rect x={LEFT} y={152} width={AXIS_W} height={14} rx={3} fill="none" stroke="#cbd5e1" strokeWidth={1} />
            {err !== null && <rect x={LEFT} y={152} width={Math.max((err / ERR_AXIS) * AXIS_W, 2)} height={14} rx={3} fill="#d97706" fillOpacity={0.6} />}
            <text x={W - LEFT - 4} y={163} textAnchor="end" fontSize={11} fontWeight={700} fill="currentColor">
              {err === null ? "—" : fmt(err, active === 0 ? 3 : 1)}
            </text>
          </svg>
        );
      }}
    />
  );
}
