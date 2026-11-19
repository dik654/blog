import SceneShell from "./SceneShell";

/**
 * 본문 대응: #coverage — ρ = (range 밖 원소 수) / (원소 수), ρ_worst = max over layer·slice.
 * 본문 해석: 전체 0.01%여도 긴 한국어 slice의 layer 20이 4%.
 * 25개 중 1개(가정) = 4%. 두 숫자가 함께 성립하려면 그 칸의 원소는 전체의 0.01% / 4% = 0.25% 이하.
 */
const CELL_N = 25;
const CELL_OUT = 1;
const CELL_RHO = CELL_OUT / CELL_N; // 0.04
const OVERALL_RHO = 0.0001; // .01%
const MAX_SHARE = OVERALL_RHO / CELL_RHO; // 0.0025 = 0.25%
const GRID = Math.round(Math.sqrt(1 / MAX_SHARE)); // 20 → 20×20 = 400칸

const pct = (value: number, digits: number) => `${(value * 100).toFixed(digits)}%`;

const SCENES = [
  {
    label: "한 칸 안에서 range 밖 원소를 셉니다",
    summary: `${CELL_OUT} / ${CELL_N} = ${pct(CELL_RHO, 0)}`,
    note: "Layer 20의 긴 한국어 slice만 떼어 봅니다. Validation 원소 하나하나가 그 layer의 range R 안에 들면 0, 밖이면 1로 표시하고 1의 개수를 원소 수로 나눕니다. 원소 25개 중 1개는 설명용 가정이며, 비율 4%는 본문의 값입니다.",
  },
  {
    label: "전체 0.01%와 한 칸 4%는 함께 성립합니다",
    summary: `그 칸 ≤ 전체의 ${pct(MAX_SHARE, 2)}`,
    note: `작은 칸 400개 전체가 validation 원소 전체이고 칸 하나가 그 ${pct(MAX_SHARE, 2)}입니다. 4%가 range 밖인 칸이 전체의 ${pct(MAX_SHARE, 2)}를 차지하고 나머지 칸이 모두 0이라면 전체 비율이 4% × ${pct(MAX_SHARE, 2)} = 0.01%가 됩니다. 반대로 전체가 0.01%라면 4%인 칸은 전체의 0.25%를 넘을 수 없습니다.`,
  },
  {
    label: "평균 대신 최대값이 그 칸을 집어냅니다",
    summary: `ρ_worst = ${pct(CELL_RHO, 0)} · 평균 ${pct(OVERALL_RHO, 2)}`,
    note: "모든 layer·slice의 비율 중 최대값을 남기면 평균에 묻힌 칸이 드러납니다. 그 칸에 대해서는 표본 보강과 higher precision bypass를 같은 validation에서 비교합니다. 낮은 saturation이 task quality를 보장하지는 않습니다.",
  },
] as const;

const W = 360;
const LEFT = 12;
const BAR_W = W - 2 * LEFT;

export default function PtqWorstSliceViz() {
  return (
    <SceneShell
      eyebrow="Saturation coverage"
      title="전체 0.01% 안에 4%짜리 칸이 숨을 수 있습니다"
      description="Saturation은 값이 scale이 표현할 수 있는 range R 밖으로 나가 끝값에 잘리는 일입니다. 점·칸 개수는 설명용 가정이고, 0.01%와 4%는 본문의 사례 값이며, 0.25%는 두 값에서 나눈 결과입니다."
      ariaLabel="한 layer·slice의 포화 비율 계산과 전체 평균에 숨는 최악 칸"
      scenes={SCENES}
      render={(active) => {
        const cell = 6;
        const gap = 1;
        return (
          <svg viewBox={`0 0 ${W} 176`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {active === 0 && (
              <g>
                <text x={LEFT} y={14} fontSize={11} fontWeight={700} fill="#475569">
                  layer 20 · 긴 한국어 slice (원소 {CELL_N}개, 가정)
                </text>
                {Array.from({ length: CELL_N }, (_, i) => {
                  const out = i === CELL_N - 3;
                  const x = LEFT + 14 + (i % 5) * 30;
                  const y = 40 + Math.floor(i / 5) * 26;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r={8} fill={out ? "none" : "#2563eb"} fillOpacity={0.25} stroke={out ? "#dc2626" : "#2563eb"} strokeWidth={1} />
                      <text x={x} y={y + 3.5} textAnchor="middle" fontSize={10} fontWeight={700} fill={out ? "#dc2626" : "#2563eb"}>
                        {out ? 1 : 0}
                      </text>
                    </g>
                  );
                })}
                <text x={196} y={56} fontSize={12} fill="#2563eb">
                  0 = range R 안
                </text>
                <text x={196} y={78} fontSize={12} fill="#dc2626">
                  1 = range R 밖
                </text>
                <text x={196} y={114} fontSize={13} fontWeight={700} fill="currentColor">
                  ρ = {CELL_OUT} / {CELL_N} = {pct(CELL_RHO, 0)}
                </text>
              </g>
            )}
            {active === 1 && (
              <g>
                <text x={LEFT} y={14} fontSize={11} fontWeight={700} fill="#475569">
                  전체 validation 원소 = {GRID * GRID}칸 (칸당 {pct(MAX_SHARE, 2)})
                </text>
                {Array.from({ length: GRID * GRID }, (_, i) => {
                  const hot = i === GRID * GRID - 1;
                  return (
                    <rect
                      key={i}
                      x={LEFT + (i % GRID) * (cell + gap)}
                      y={22 + Math.floor(i / GRID) * (cell + gap)}
                      width={cell}
                      height={cell}
                      fill={hot ? "#dc2626" : "#94a3b8"}
                      fillOpacity={hot ? 0.9 : 0.25}
                    />
                  );
                })}
                <text x={186} y={60} fontSize={11} fill="#dc2626" fontWeight={700}>
                  빨간 칸: layer 20 · 긴 한국어
                </text>
                <text x={186} y={78} fontSize={11} fill="#dc2626">
                  그 안의 4%가 range 밖
                </text>
                <text x={186} y={104} fontSize={11} fill="currentColor">
                  4% × {pct(MAX_SHARE, 2)} = 0.01%
                </text>
                <text x={186} y={122} fontSize={11} fill="#64748b">
                  = 본문의 전체 비율
                </text>
              </g>
            )}
            {active === 2 && (
              <g>
                <text x={LEFT} y={14} fontSize={11} fontWeight={700} fill="#475569">
                  같은 축에서 비교 (0 ~ 4%)
                </text>
                <text x={LEFT} y={46} fontSize={11} fill="#475569">
                  전체 평균 ρ
                </text>
                <rect x={LEFT} y={54} width={BAR_W} height={20} rx={3} fill="none" stroke="#cbd5e1" strokeWidth={1} />
                <rect x={LEFT} y={54} width={Math.max((OVERALL_RHO / CELL_RHO) * BAR_W, 1.5)} height={20} fill="#64748b" />
                <text x={W - LEFT - 4} y={68} textAnchor="end" fontSize={11} fontWeight={700} fill="#475569">
                  {pct(OVERALL_RHO, 2)}
                </text>
                <text x={LEFT} y={100} fontSize={11} fill="#dc2626" fontWeight={700}>
                  ρ_worst = max over layer·slice
                </text>
                <rect x={LEFT} y={108} width={BAR_W} height={20} rx={3} fill="#dc2626" fillOpacity={0.55} />
                <text x={W - LEFT - 4} y={122} textAnchor="end" fontSize={11} fontWeight={700} fill="#ffffff">
                  {pct(CELL_RHO, 0)}
                </text>
                <text x={LEFT} y={152} fontSize={11} fill="currentColor">
                  → 그 칸에 표본 보강 · higher precision bypass 비교
                </text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
