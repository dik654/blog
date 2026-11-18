import SceneShell from "./SceneShell";

/**
 * 본문 대응: softmax #case — 점수 (ln 2, 0) → 양수 (2, 1), 총량 3 → 몫 (2/3, 1/3).
 * 둘째 점수만 ln 2로 바꾸면 양수 (2, 2), 총량 4 → 몫 (1/2, 1/2).
 */
const SCENES = [
  {
    label: "두 점수 ln 2와 0",
    summary: "양수 2 + 1 = 3 → 2/3, 1/3",
    weights: [2, 1],
    scores: ["ln 2", "0"],
    note: "지수 계산으로 두 점수를 양수 2와 1로 바꾸고 둘을 이어 붙이면 총량 3입니다. 아래 막대는 같은 총량을 길이 1로 줄여 본 것이라 첫 후보가 2/3, 점수가 0인 둘째 후보도 1/3을 차지합니다.",
  },
  {
    label: "둘째 점수만 ln 2로",
    summary: "양수 2 + 2 = 4 → 1/2, 1/2",
    weights: [2, 2],
    scores: ["ln 2", "ln 2"],
    note: "첫 후보의 점수와 양수 값 2는 그대로입니다. 둘째 값이 1에서 2로 커져 총량이 4가 되었고, 같은 총량을 나눠 쓰므로 첫 후보의 몫이 2/3에서 1/2로 줄었습니다.",
  },
] as const;

const COLORS = ["#2563eb", "#d97706"] as const;
const W = 360;
const L = 76;
const R = 344;
const SPAN = R - L;
const MAX_TOTAL = 4;

function fraction(weight: number, total: number) {
  return weight === total / 2 ? "1/2" : `${weight}/${total}`;
}

export default function SharedTotalViz() {
  return (
    <SceneShell
      eyebrow="공유하는 총량"
      title="다른 후보의 값이 커지면 내 몫이 줄어듭니다"
      description="위 막대는 지수 계산으로 얻은 양수 값을 이어 붙인 길이(눈금 0–4)이고, 아래 막대는 그 총량을 1로 놓았을 때 각 후보가 차지하는 몫입니다. 두 점수는 본문의 가정 그대로입니다."
      ariaLabel="두 후보의 양수 값과 공동 총량, 그리고 몫이 둘째 점수 변화에 따라 바뀌는 두 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const total = scene.weights[0] + scene.weights[1];
        const absStart = [0, scene.weights[0]];
        return (
          <svg viewBox={`0 0 ${W} 176`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {[0, 1].map((index) => (
              <g key={index}>
                <rect x={L + index * 120} y={4} width={10} height={10} fill={COLORS[index]} fillOpacity={0.8} />
                <text x={L + index * 120 + 15} y={13} fontSize={11} fill="#475569">
                  후보 {index + 1} · 점수 {scene.scores[index]}
                </text>
              </g>
            ))}
            <text x={L - 8} y={50} textAnchor="end" fontSize={11} fill="#475569">
              양수 값
            </text>
            {[0, 1, 2, 3, 4].map((tick) => (
              <g key={tick}>
                <line x1={L + (tick / MAX_TOTAL) * SPAN} x2={L + (tick / MAX_TOTAL) * SPAN} y1={64} y2={68} stroke="#94a3b8" strokeWidth={1} />
                <text x={L + (tick / MAX_TOTAL) * SPAN} y={80} textAnchor="middle" fontSize={10} fill="#64748b">
                  {tick}
                </text>
              </g>
            ))}
            {scene.weights.map((weight, index) => (
              <g key={index}>
                <rect x={L + (absStart[index] / MAX_TOTAL) * SPAN} y={36} width={(weight / MAX_TOTAL) * SPAN} height={24} fill={COLORS[index]} fillOpacity={0.8} stroke="#ffffff" strokeWidth={1} />
                <text x={L + ((absStart[index] + weight / 2) / MAX_TOTAL) * SPAN} y={52} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">
                  {weight}
                </text>
              </g>
            ))}
            <line x1={L + (total / MAX_TOTAL) * SPAN} x2={L + (total / MAX_TOTAL) * SPAN} y1={30} y2={66} stroke="#0f172a" strokeWidth={1.25} />
            <text x={L + (total / MAX_TOTAL) * SPAN - 4} y={27} textAnchor={total === MAX_TOTAL ? "end" : "middle"} fontSize={11} fontWeight={700} fill="#0f172a">
              총량 {total}
            </text>
            <text x={L - 8} y={124} textAnchor="end" fontSize={11} fill="#475569">
              몫
            </text>
            {scene.weights.map((weight, index) => {
              const start = index === 0 ? 0 : scene.weights[0] / total;
              const share = weight / total;
              return (
                <g key={index}>
                  <rect x={L + start * SPAN} y={110} width={share * SPAN} height={24} fill={COLORS[index]} fillOpacity={0.8} stroke="#ffffff" strokeWidth={1} />
                  <text x={L + (start + share / 2) * SPAN} y={126} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">
                    {fraction(weight, total)}
                  </text>
                </g>
              );
            })}
            <text x={L} y={152} fontSize={10} fill="#64748b">
              0
            </text>
            <text x={R} y={152} textAnchor="end" fontSize={10} fill="#64748b">
              1
            </text>
            <text x={L} y={170} fontSize={11} fill="#334155">
              후보 1의 몫 = 2 ÷ {total}
            </text>
          </svg>
        );
      }}
    />
  );
}
