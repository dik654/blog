import SceneShell from "./SceneShell";

/**
 * 본문 대응: #proportional-controls 의 잔여 노출 식 R = Σ p·L·(1−m).
 * 시나리오 1: (p, L, m) = (0.10, 100, 0.60) → 통제 전 10, 남는 비율 0.40 → 4.
 * 시나리오 2: (p, L, m) = (0.05, 200, 0.25) → 통제 전 10, 남는 비율 0.75 → 7.5.
 * 합계 4 + 7.5 = 11.5. 두 번째의 잔여 기여가 더 크다.
 */
const ROWS = [
  { name: "시나리오 1", p: 0.1, L: 100, m: 0.6 },
  { name: "시나리오 2", p: 0.05, L: 200, m: 0.25 },
] as const;

const DATA = ROWS.map((row) => {
  const inherent = Math.round(row.p * row.L * 100) / 100;
  const keep = Math.round((1 - row.m) * 100) / 100;
  const residual = Math.round(inherent * keep * 100) / 100;
  return { ...row, inherent, keep, residual };
});
const TOTAL = DATA.reduce<number>((sum, row) => sum + row.residual, 0);

const SCENES = [
  {
    label: "통제 전 노출 p × L",
    summary: "0.10×100 = 10 · 0.05×200 = 10",
    note: "가능성 p와 영향 L을 곱하면 통제 전 노출입니다. 두 시나리오는 p와 L이 다르지만 곱은 둘 다 10으로 같습니다.",
  },
  {
    label: "통제 뒤 남는 비율 (1 − m)",
    summary: "10×0.40 = 4 · 10×0.75 = 7.5",
    note: "검증된 통제 효과 m을 빼고 남는 비율을 곱합니다. m이 0.60인 시나리오 1은 4만 남고, m이 0.25인 시나리오 2는 7.5가 남습니다.",
  },
  {
    label: "잔여를 더한 내부 비교 지표",
    summary: "4 + 7.5 = 11.5",
    note: "통제 전에는 같았던 두 시나리오 중 두 번째가 더 큰 잔여 기여를 보이므로 추가 통제를 검토합니다. 이 값은 내부 비교 지표이며 confidence와 법적 의무를 함께 봐야 하고, 법적 의무 면제 근거가 아닙니다.",
  },
] as const;

const W = 360;
const H = 176;
const LEFT = 82;
const RIGHT = 20;
const MAX = 12;
const sx = (value: number) => ((W - LEFT - RIGHT) * value) / MAX;
const fmt = (value: number) => String(Math.round(value * 100) / 100);

export default function ResidualExposureViz() {
  return (
    <SceneShell
      eyebrow="잔여 노출 계산"
      title="통제 전에는 같은 10이어도 통제 효과에 따라 남는 크기가 달라집니다"
      description="p는 정한 기간의 추정 발생 가능성, L은 영향을 같은 내부 단위로 환산한 값, m은 검증된 통제가 줄이는 0~1 추정 비율입니다. 숫자는 글의 두 시나리오 예시이며 화폐값이나 고객의 범죄 확률이 아닙니다."
      ariaLabel="두 시나리오의 통제 전 노출 10과 10, 통제 뒤 잔여 4와 7.5, 합계 11.5"
      scenes={SCENES}
      render={(active) => {
        const barY = (index: number) => 26 + index * 50;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {DATA.map((row, index) => {
              const y = barY(index);
              const showResidual = active >= 1;
              return (
                <g key={row.name}>
                  <text x={0} y={y + 12} fontSize={11} fontWeight={700} fill="#334155">{row.name}</text>
                  <text x={0} y={y + 26} fontSize={10} fill="#64748b">
                    {`p ${row.p.toFixed(2)} · L ${row.L}`}
                  </text>
                  <rect
                    x={LEFT}
                    y={y}
                    width={sx(row.inherent)}
                    height={18}
                    rx={2}
                    fill={showResidual ? "none" : "#64748b"}
                    stroke="#64748b"
                    strokeWidth={1}
                    strokeDasharray={showResidual ? "3 3" : undefined}
                  />
                  {showResidual && (
                    <rect x={LEFT} y={y} width={sx(row.residual)} height={18} rx={2} fill={index === 1 ? "#d97706" : "#2563eb"} />
                  )}
                  <text x={LEFT + sx(row.inherent) + 4} y={y + 13} fontSize={11} fontWeight={700} fill="#334155">
                    {showResidual ? fmt(row.residual) : fmt(row.inherent)}
                  </text>
                  <text x={LEFT} y={y + 32} fontSize={10} fill="#64748b">
                    {showResidual
                      ? `통제 전 ${fmt(row.inherent)} × (1 − ${row.m.toFixed(2)}) = ${fmt(row.residual)}`
                      : `${row.p.toFixed(2)} × ${row.L} = ${fmt(row.inherent)}`}
                  </text>
                </g>
              );
            })}
            {active === 2 ? (
              <g>
                <text x={0} y={140} fontSize={11} fontWeight={700} fill="#334155">합계</text>
                <rect x={LEFT} y={128} width={sx(DATA[0].residual)} height={18} rx={2} fill="#2563eb" />
                <rect x={LEFT + sx(DATA[0].residual)} y={128} width={sx(DATA[1].residual)} height={18} rx={2} fill="#d97706" />
                <text x={LEFT + sx(TOTAL) + 4} y={141} fontSize={11} fontWeight={700} fill="#334155">{fmt(TOTAL)}</text>
                <text x={LEFT} y={162} fontSize={10} fill="#64748b">{`${fmt(DATA[0].residual)} + ${fmt(DATA[1].residual)} = ${fmt(TOTAL)}`}</text>
              </g>
            ) : (
              <text x={LEFT} y={141} fontSize={10} fill="#94a3b8">
                {active === 0 ? "다음 장면: 통제 효과 m 적용" : "점선 = 통제 전 10 · 칠한 부분 = 남는 노출"}
              </text>
            )}
          </svg>
        );
      }}
    />
  );
}
