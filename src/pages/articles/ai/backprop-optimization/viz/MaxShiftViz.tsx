import SceneShell from "./SceneShell";

/**
 * 본문 대응: softmax #trace — z=(ln 2, 0)에서 최댓값 ln 2를 빼면 (0, −ln 2),
 * 지수 값 (2, 1) → (1, 1/2)로 둘 다 1/2배, 합 3 → 3/2, 확률은 (2/3, 1/3) 그대로.
 * (1,000+ln 2, 1,000)도 최댓값을 빼면 같은 (0, −ln 2)가 된다(가정한 입력).
 */
const COLORS = ["#2563eb", "#d97706"] as const;
const W = 360;
const L = 92;
const R = 312;
const SPAN = R - L;
const MAX_TOTAL = 3;

type Row = { label: string; weights: readonly [number, number] | null; texts: readonly [string, string] };

const SCENES = [
  {
    label: "원래 점수 (ln 2, 0)",
    summary: "지수 값 2, 1 · 합 3",
    rows: [{ label: "지수 값", weights: [2, 1], texts: ["2", "1"] }] as readonly Row[],
    note: "두 점수를 그대로 지수에 넣으면 2와 1, 합은 3입니다. 아래 몫 막대는 2/3과 1/3입니다.",
  },
  {
    label: "최댓값 ln 2를 빼면 (0, −ln 2)",
    summary: "지수 값 1, 1/2 · 합 3/2",
    rows: [
      { label: "빼기 전", weights: [2, 1], texts: ["2", "1"] },
      { label: "뺀 뒤", weights: [1, 0.5], texts: ["1", "1/2"] },
    ] as readonly Row[],
    note: "두 지수 값이 모두 절반이 되고 합도 3에서 3/2로 절반이 됩니다. 분자와 분모가 같은 비율로 줄었으므로 몫 막대는 2/3과 1/3 그대로입니다.",
  },
  {
    label: "1,000을 더한 (1,000+ln 2, 1,000)",
    summary: "최댓값을 빼면 다시 (0, −ln 2)",
    rows: [
      { label: "바로 넣으면", weights: null, texts: ["", ""] },
      { label: "최댓값 뺀 뒤", weights: [1, 0.5], texts: ["1", "1/2"] },
    ] as readonly Row[],
    note: "큰 점수를 곧바로 지수에 넣으면 컴퓨터의 숫자 범위를 넘을 수 있어 길이를 그리지 않았습니다. 최댓값 1,000+ln 2를 먼저 빼면 두 점수의 차이만 남아 (0, −ln 2)를 계산하고, 몫은 앞 장면과 같습니다. 이 동작이 max shift입니다.",
  },
] as const;

function x(value: number) {
  return L + (value / MAX_TOTAL) * SPAN;
}

export default function MaxShiftViz() {
  return (
    <SceneShell
      eyebrow="Max shift"
      title="모든 점수에서 같은 값을 빼면 길이는 줄어도 몫은 같습니다"
      description="위쪽 막대는 지수 계산으로 얻은 양수 값을 이어 붙인 길이(눈금 0–3), 맨 아래 막대는 합을 1로 놓았을 때의 몫입니다. 점수 1,000을 더한 입력은 본문의 가정입니다."
      ariaLabel="원래 점수, 최댓값을 뺀 점수, 1,000을 더한 점수에서 지수 값과 몫을 비교하는 세 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} 200`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {[0, 1, 2, 3].map((tick) => (
              <g key={tick}>
                <line x1={x(tick)} x2={x(tick)} y1={16} y2={112} stroke="#e2e8f0" strokeWidth={1} />
                <text x={x(tick)} y={12} textAnchor="middle" fontSize={10} fill="#64748b">
                  {tick}
                </text>
              </g>
            ))}
            {scene.rows.map((row, rowIndex) => {
              const y = 28 + rowIndex * 44;
              const total = row.weights ? row.weights[0] + row.weights[1] : 0;
              return (
                <g key={row.label}>
                  <text x={L - 8} y={y + 16} textAnchor="end" fontSize={11} fill="#475569">
                    {row.label}
                  </text>
                  {row.weights ? (
                    <>
                      <rect x={x(0)} y={y} width={x(row.weights[0]) - x(0)} height={24} fill={COLORS[0]} fillOpacity={0.8} stroke="#ffffff" strokeWidth={1} />
                      <rect x={x(row.weights[0])} y={y} width={x(row.weights[1]) - x(0)} height={24} fill={COLORS[1]} fillOpacity={0.8} stroke="#ffffff" strokeWidth={1} />
                      <text x={x(row.weights[0] / 2)} y={y + 16} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">
                        {row.texts[0]}
                      </text>
                      <text x={x(row.weights[0] + row.weights[1] / 2)} y={y + 16} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">
                        {row.texts[1]}
                      </text>
                      <text x={x(total) + 6} y={y + 16} fontSize={11} fontWeight={700} fill="#0f172a">
                        합 {total === 1.5 ? "3/2" : total}
                      </text>
                    </>
                  ) : (
                    <>
                      <rect x={x(0)} y={y} width={W - 6 - x(0)} height={24} fill="none" stroke="#dc2626" strokeWidth={1.25} strokeDasharray="5 4" />
                      <text x={(x(0) + W - 6) / 2} y={y + 16} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b91c1c">
                        숫자 범위를 넘을 수 있음 →
                      </text>
                    </>
                  )}
                </g>
              );
            })}
            <line x1={L} x2={R} y1={126} y2={126} stroke="#cbd5e1" strokeWidth={1} />
            <text x={L - 8} y={160} textAnchor="end" fontSize={11} fill="#475569">
              몫
            </text>
            <rect x={L} y={144} width={(2 / 3) * SPAN} height={24} fill={COLORS[0]} fillOpacity={0.8} stroke="#ffffff" strokeWidth={1} />
            <rect x={L + (2 / 3) * SPAN} y={144} width={(1 / 3) * SPAN} height={24} fill={COLORS[1]} fillOpacity={0.8} stroke="#ffffff" strokeWidth={1} />
            <text x={L + (1 / 3) * SPAN} y={160} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">
              2/3
            </text>
            <text x={L + (5 / 6) * SPAN} y={160} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">
              1/3
            </text>
            <text x={L} y={186} fontSize={10} fill="#64748b">
              0
            </text>
            <text x={R} y={186} textAnchor="end" fontSize={10} fill="#64748b">
              1
            </text>
            <text x={(L + R) / 2} y={186} textAnchor="middle" fontSize={11} fill="#334155">
              장면이 바뀌어도 같은 몫
            </text>
          </svg>
        );
      }}
    />
  );
}
