import PipelineSceneShell from "./PipelineSceneShell";

/**
 * 본문 대응: #benchmark 두 번째 ExplainedFormula의 별도 예시.
 * A(.5, 8ms, 10GB), B(.7, 9ms, 12GB), C(.3, 11ms, 8GB). 세 축 모두 작을수록 좋음.
 * A는 B를 세 축 모두에서 이김 → B 제거. A와 C는 축마다 승자가 갈림 → 둘 다 frontier.
 */
type Id = "A" | "B" | "C";

const CANDIDATES: Record<Id, { loss: number; p95: number; memory: number; color: string }> = {
  A: { loss: 0.5, p95: 8, memory: 10, color: "#2563eb" },
  B: { loss: 0.7, p95: 9, memory: 12, color: "#64748b" },
  C: { loss: 0.3, p95: 11, memory: 8, color: "#d97706" },
};

const AXES = [
  { key: "loss", label: "quality loss", min: 0.2, max: 0.8, format: (v: number) => v.toFixed(1).replace(/^0/, "") },
  { key: "p95", label: "p95", min: 7, max: 12, format: (v: number) => `${v}ms` },
  { key: "memory", label: "memory", min: 7, max: 13, format: (v: number) => `${v}GB` },
] as const;

const SCENES = [
  {
    label: "A와 B 비교",
    summary: "A가 세 축 모두 더 작음 → B 지배됨",
    pair: ["A", "B"] as readonly Id[],
    note: "quality loss .5 대 .7, p95 8ms 대 9ms, memory 10GB 대 12GB로 A가 세 축 모두에서 B보다 작습니다. 어느 축에서도 B를 고를 이유가 없으니 A가 B를 지배하고 B는 frontier에서 빠집니다.",
  },
  {
    label: "A와 C 비교",
    summary: "축마다 승자가 갈림 → 둘 다 남음",
    pair: ["A", "C"] as readonly Id[],
    note: "C는 quality loss(.3)와 memory(8GB)에서 A보다 작지만 p95는 11ms로 A의 8ms보다 깁니다. A가 이기는 축과 C가 이기는 축이 함께 있으므로 어느 쪽도 다른 쪽을 지배하지 못합니다.",
  },
  {
    label: "남은 frontier",
    summary: "{A, C} · B 제거",
    pair: ["A", "C"] as readonly Id[],
    note: "지배당하지 않은 A와 C만 frontier에 남습니다. frontier는 하나를 자동으로 고르지 않으며, 둘 중 무엇을 쓸지는 traffic 가치와 운영 복잡도로 마지막에 결정합니다.",
  },
] as const;

const W = 360;
const ROW_H = 58;
const TOP = 22;
const H = TOP + AXES.length * ROW_H + 8;
const X0 = 18;
const X1 = 280;

function winnerOf(axis: (typeof AXES)[number]["key"], pair: readonly Id[]): Id {
  const [first, second] = pair;
  return CANDIDATES[first][axis] <= CANDIDATES[second][axis] ? first : second;
}

export default function ParetoViz() {
  return (
    <PipelineSceneShell
      eyebrow="Pareto frontier · 설명용 세 후보"
      title="모든 축에서 지는 후보만 지우고, 축마다 승자가 갈리면 둘 다 남깁니다"
      description="세 줄은 각각 작을수록 좋은 축이고, 점은 후보의 측정값입니다. A·B·C는 앞 표의 양자화·가지치기 후보와 다른 별도 예시이며, 셋 모두 hard guardrail을 통과했다고 가정합니다."
      ariaLabel="후보 A, B, C를 quality loss, p95, memory 세 축에서 비교해 B를 제거하고 A와 C를 frontier로 남김"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const final = active === 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={X0} y={12} fontSize={10} fill="#64748b">← 작을수록 좋음</text>
            <text x={W - 4} y={12} textAnchor="end" fontSize={10} fontWeight={700} fill="#475569">
              {active === 2 ? "frontier" : "이 축의 우세"}
            </text>
            {AXES.map((axis, index) => {
              const y = TOP + index * ROW_H;
              const lineY = y + 36;
              const sx = (value: number) => X0 + ((value - axis.min) / (axis.max - axis.min)) * (X1 - X0);
              const winner = winnerOf(axis.key, scene.pair);
              return (
                <g key={axis.key}>
                  <text x={X0} y={y + 10} fontSize={11} fontWeight={700} fill="#334155">{axis.label}</text>
                  <line x1={X0} x2={X1} y1={lineY} y2={lineY} stroke="#cbd5e1" strokeWidth={1} />
                  {(Object.keys(CANDIDATES) as Id[]).map((id) => {
                    const value = CANDIDATES[id][axis.key];
                    const inPair = scene.pair.includes(id);
                    const faded = final ? id === "B" : !inPair;
                    const cx = sx(value);
                    return (
                      <g key={id} opacity={faded ? 0.25 : 1}>
                        <circle cx={cx} cy={lineY} r={6} fill={final && id === "B" ? "#ffffff" : CANDIDATES[id].color} stroke={CANDIDATES[id].color} strokeWidth={1} />
                        <text x={cx} y={lineY - 10} textAnchor="middle" fontSize={10} fontWeight={700} fill={CANDIDATES[id].color}>{id}</text>
                        <text x={cx} y={lineY + 17} textAnchor="middle" fontSize={9.5} fill="#475569">{axis.format(value)}</text>
                      </g>
                    );
                  })}
                  <text x={W - 4} y={lineY + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={active === 2 ? "#0f172a" : CANDIDATES[winner].color}>
                    {active === 2 ? "A · C" : winner}
                  </text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
