import SceneShell from "./SceneShell";

/**
 * 본문 대응: MeasureFirst.tsx #paired-selection — 표의 설명용 가정 숫자 그대로.
 * B−A = +0.2, +1.4, +0.5, +1.1, +0.8 → 합 4.0, 평균 +0.8.
 * 평균과의 편차 −0.6, +0.6, −0.3, +0.3, 0 → 제곱합 0.90 → ÷4 = 0.225 → √ ≈ 0.474 → ÷√5 ≈ 0.21.
 */
const ROWS = [
  { seed: 1, a: 82.1, b: 82.3 },
  { seed: 2, a: 81.8, b: 83.2 },
  { seed: 3, a: 82.5, b: 83.0 },
  { seed: 4, a: 82.0, b: 83.1 },
  { seed: 5, a: 82.4, b: 83.2 },
] as const;

const DELTAS = ROWS.map((row) => Math.round((row.b - row.a) * 10) / 10);
const MEAN = Math.round((DELTAS.reduce<number>((sum, d) => sum + d, 0) / DELTAS.length) * 10) / 10;
const SQ_SUM = DELTAS.reduce<number>((sum, d) => sum + (d - MEAN) ** 2, 0);
const SD = Math.sqrt(SQ_SUM / (DELTAS.length - 1));
const SE = SD / Math.sqrt(DELTAS.length);

const W = 360;
const H = 206;
const PLOT_L = 64;
const PLOT_R = 336;
const rowY = (index: number) => 34 + index * 30;
const recallX = (value: number) => PLOT_L + ((value - 81.5) / 2) * (PLOT_R - PLOT_L);
const DELTA_R = 270;
const deltaX = (value: number) => PLOT_L + (value / 1.6) * (DELTA_R - PLOT_L);

const A_COLOR = "#64748b";
const B_COLOR = "#2563eb";
const MEAN_COLOR = "#d97706";
const AXIS = "#94a3b8";

const signed = (value: number) => `${value > 0 ? "+" : value < 0 ? "−" : ""}${Math.abs(value).toFixed(1)}`;

const SCENES = [
  {
    label: "같은 seed끼리 잇기",
    summary: "seed 1의 A ↔ seed 1의 B",
    note: "seed는 학습·평가에 쓰는 난수 시작값입니다. 같은 seed의 A(원)와 B(네모)를 선으로 이었습니다. 축은 macro recall이며 숫자는 표의 설명용 가정입니다.",
  },
  {
    label: "차이만 남기기",
    summary: "+0.2 · +1.4 · +0.5 · +1.1 · +0.8",
    note: "각 줄에서 B−A를 먼저 뺍니다. 이제 막대 하나가 한 seed 안의 차이이고, 축은 recall이 아니라 차이(point)입니다.",
  },
  {
    label: "차이의 평균",
    summary: `4.0 ÷ 5 = ${signed(MEAN)}`,
    note: "다섯 차이를 더하면 4.0, 5로 나누면 평균 +0.8 point입니다. 점선이 그 평균입니다.",
  },
  {
    label: "흩어짐에서 standard error로",
    summary: `√(${SQ_SUM.toFixed(2)} ÷ 4) ÷ √5 ≈ ${SE.toFixed(2)}`,
    note: `막대 끝이 평균에서 벗어난 폭(−0.6, +0.6, −0.3, +0.3, 0)을 제곱해 더하면 ${SQ_SUM.toFixed(2)}입니다. 4로 나눠 제곱근을 취한 표본 표준편차 ≈ ${SD.toFixed(3)}를 √5로 나누면 standard error ≈ ${SE.toFixed(2)}입니다. standard error는 평균 차이가 얼마나 흔들릴 수 있는지의 크기이며, 띠는 평균 ± 그 값입니다.`,
  },
] as const;

export default function PairedSeedViz() {
  return (
    <SceneShell
      eyebrow="짝지은 비교"
      title="seed마다 차이를 먼저 빼고 평균을 냅니다"
      description="한 줄이 seed 하나입니다. 숫자는 위 표의 설명용 가정이며 실제 모델 측정값이 아닙니다."
      ariaLabel="seed 다섯 개에서 후보 A와 B의 recall 차이, 평균, standard error 계산"
      scenes={SCENES}
      render={(active) => {
        const showPairs = active === 0;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {showPairs ? (
              <>
                {[81.5, 82.0, 82.5, 83.0, 83.5].map((tick) => (
                  <g key={tick}>
                    <line x1={recallX(tick)} x2={recallX(tick)} y1={20} y2={rowY(4) + 12} stroke="#e2e8f0" strokeWidth={1} />
                    <text x={recallX(tick)} y={H - 8} textAnchor="middle" fontSize={11} fill="#64748b">{tick.toFixed(1)}</text>
                  </g>
                ))}
                <circle cx={PLOT_L + 4} cy={10} r={4} fill={A_COLOR} />
                <text x={PLOT_L + 12} y={14} fontSize={11} fill="#475569">후보 A</text>
                <rect x={PLOT_L + 64} y={6} width={8} height={8} fill={B_COLOR} />
                <text x={PLOT_L + 76} y={14} fontSize={11} fill="#475569">후보 B</text>
                <text x={PLOT_R} y={14} textAnchor="end" fontSize={11} fill="#64748b">macro recall</text>
              </>
            ) : (
              <>
                {[0, 0.4, 0.8, 1.2, 1.6].map((tick) => (
                  <g key={tick}>
                    <line x1={deltaX(tick)} x2={deltaX(tick)} y1={20} y2={rowY(4) + 12} stroke="#e2e8f0" strokeWidth={1} />
                    <text x={deltaX(tick)} y={H - 8} textAnchor="middle" fontSize={11} fill="#64748b">{tick === 0 ? "0" : `+${tick.toFixed(1)}`}</text>
                  </g>
                ))}
                <text x={W - 8} y={14} textAnchor="end" fontSize={11} fill="#64748b">B−A (point)</text>
                {active === 3 && (
                  <rect x={deltaX(MEAN - SE)} y={20} width={deltaX(MEAN + SE) - deltaX(MEAN - SE)} height={rowY(4) - 8} fill={MEAN_COLOR} fillOpacity={0.12} />
                )}
                {active >= 2 && (
                  <>
                    <line x1={deltaX(MEAN)} x2={deltaX(MEAN)} y1={20} y2={rowY(4) + 12} stroke={MEAN_COLOR} strokeWidth={1.25} strokeDasharray="4 3" />
                    <text x={deltaX(MEAN) + 4} y={14} fontSize={11} fontWeight={700} fill={MEAN_COLOR}>
                      {active === 3 ? `평균 +0.8 ± ${SE.toFixed(2)}` : "평균 +0.8"}
                    </text>
                  </>
                )}
              </>
            )}
            {ROWS.map((row, index) => {
              const y = rowY(index);
              const delta = DELTAS[index];
              return (
                <g key={row.seed}>
                  <text x={8} y={y + 4} fontSize={12} fill="#475569">seed {row.seed}</text>
                  {showPairs ? (
                    <>
                      <line x1={recallX(row.a)} x2={recallX(row.b)} y1={y} y2={y} stroke={AXIS} strokeWidth={1} />
                      <circle cx={recallX(row.a)} cy={y} r={4.5} fill={A_COLOR} />
                      <rect x={recallX(row.b) - 4.5} y={y - 4.5} width={9} height={9} fill={B_COLOR} />
                    </>
                  ) : (
                    <>
                      <rect x={deltaX(0)} y={y - 7} width={deltaX(delta) - deltaX(0)} height={14} rx={2} fill={B_COLOR} fillOpacity={0.75} />
                      <text x={deltaX(delta) + 5} y={y + 4} fontSize={11} fontWeight={700} fill="#1e3a8a">
                        {signed(delta)}
                      </text>
                      {active === 3 && (
                        <text x={W - 8} y={y + 4} textAnchor="end" fontSize={11} fill={MEAN_COLOR}>
                          편차 {signed(Math.round((delta - MEAN) * 10) / 10)}
                        </text>
                      )}
                    </>
                  )}
                </g>
              );
            })}
            <line x1={PLOT_L} x2={showPairs ? PLOT_R : DELTA_R} y1={rowY(4) + 12} y2={rowY(4) + 12} stroke={AXIS} strokeWidth={1} />
          </svg>
        );
      }}
    />
  );
}
