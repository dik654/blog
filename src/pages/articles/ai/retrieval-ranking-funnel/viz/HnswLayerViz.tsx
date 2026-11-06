import SceneShell from "./SceneShell";

/**
 * 본문 대응: #reading-hnsw — 위층의 장거리 탐색에서 아래층의 세밀한 이웃 탐색으로 내려옵니다.
 * 점 위치·연결·층 수는 설명용 가정입니다. 같은 벡터는 모든 층에서 같은 가로 위치에 있습니다.
 */
type NodeId = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "T";
const POS: Record<NodeId, [number, number]> = {
  A: [34, 10], B: [72, 34], C: [96, 6], D: [122, 28], E: [156, 12], F: [188, 6],
  G: [232, 36], H: [272, 24], I: [254, 4], J: [302, 36], K: [326, 8], T: [224, 8],
};
const QUERY: [number, number] = [214, 22];

const LAYERS: { name: string; top: number; nodes: NodeId[]; links: [NodeId, NodeId][] }[] = [
  { name: "위층 · 점 2개", top: 18, nodes: ["A", "H"], links: [["A", "H"]] },
  { name: "중간층 · 점 5개", top: 90, nodes: ["A", "D", "F", "H", "K"], links: [["A", "D"], ["D", "F"], ["F", "H"], ["H", "K"]] },
  {
    name: "맨 아래층 · 모든 점",
    top: 162,
    nodes: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "T"],
    links: [["A", "B"], ["A", "C"], ["B", "D"], ["C", "D"], ["D", "E"], ["E", "F"], ["F", "G"], ["G", "H"], ["G", "J"], ["H", "I"], ["H", "K"], ["J", "K"], ["I", "T"]],
  },
];

/** 장면별로 지나온 [층, 점] 경로입니다. */
const PATHS: [number, NodeId][][] = [
  [],
  [[0, "A"], [0, "H"]],
  [[0, "A"], [0, "H"], [1, "H"], [1, "F"], [2, "F"], [2, "G"]],
  [[0, "A"], [0, "H"], [1, "H"], [1, "F"], [2, "F"], [2, "G"]],
];

const SCENES = [
  { label: "층마다 점의 수가 다릅니다", summary: "위로 갈수록 적고 성김", note: "점 하나가 문서 벡터입니다. 벡터는 확률적으로 선택된 층에 배치되고, 이 그림의 맨 아래층에는 모든 점이 있습니다. ◆는 질의 위치입니다." },
  { label: "위층에서 멀리 건너뜀", summary: "A → H", note: "위층에서는 긴 연결로 질의 쪽을 향해 크게 이동합니다. 여기서는 A보다 질의에 가까운 H까지 갑니다." },
  { label: "내려오며 세밀하게", summary: "H → F → G", note: "같은 점을 타고 아래층으로 내려와 더 촘촘한 이웃을 봅니다. 이 그림에서는 연결된 이웃 중 더 가까운 점이 없을 때 멈춥니다." },
  { label: "근사 탐색의 한계", summary: "멈춘 곳 G · 가장 가까운 점 T", note: "이 예에서 T가 질의에 더 가깝지만 G에서 곧바로 이어지지 않아 놓쳤습니다. 전수 비교와 같은 결과를 자동으로 보장하지 않으므로 재현율·지연 시간·메모리를 함께 측정합니다." },
] as const;

const BAND_H = 46;
const key = (layer: number, node: NodeId) => `${layer}-${node}`;

export default function HnswLayerViz() {
  return (
    <SceneShell
      eyebrow="HNSW의 층"
      title="위층에서 크게 건너뛰고 아래층에서 세밀하게 찾습니다"
      description="근접 그래프는 가까운 벡터끼리 선으로 이은 망입니다. 점 위치와 연결, 층 수는 설명용 가정이고 실제 벡터 공간은 훨씬 고차원입니다."
      ariaLabel="세 층의 근접 그래프를 내려오며 질의에 가까운 점을 찾는 과정"
      scenes={SCENES}
      render={(active) => {
        const path = PATHS[active];
        const visited = new Set(path.map(([layer, node]) => key(layer, node)));
        const segments = path.slice(1).map((step, index) => [path[index], step] as const);
        return (
          <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {LAYERS.map((layer, layerIndex) => (
              <g key={layer.name}>
                <text x={6} y={layer.top - 5} fontSize={11} fontWeight={600} fill="#64748b">{layer.name}</text>
                <rect x={0.5} y={layer.top} width={359} height={BAND_H} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} />
                {layer.links.map(([from, to]) => (
                  <line key={`${from}${to}`} x1={POS[from][0]} y1={layer.top + POS[from][1]} x2={POS[to][0]} y2={layer.top + POS[to][1]} stroke="#94a3b8" strokeWidth={1} />
                ))}
                <path d={`M${QUERY[0]} ${layer.top + QUERY[1] - 5}l5 5l-5 5l-5 -5z`} fill="#d97706" opacity={layerIndex === 2 ? 1 : 0.45} />
                {layer.nodes.map((node) => {
                  const on = visited.has(key(layerIndex, node));
                  const missed = active === 3 && layerIndex === 2 && node === "T";
                  return (
                    <g key={node}>
                      <circle cx={POS[node][0]} cy={layer.top + POS[node][1]} r={on ? 5 : 3.5} fill={on ? "#2563eb" : missed ? "#ffffff" : "#64748b"} stroke={missed ? "#dc2626" : "none"} strokeWidth={1.25} />
                      {(on || missed) && (
                        <text x={POS[node][0] + (missed ? -13 : 8)} y={layer.top + POS[node][1] + (missed ? 4 : -1)} fontSize={11} fontWeight={700} fill={missed ? "#dc2626" : "#2563eb"}>{node}</text>
                      )}
                    </g>
                  );
                })}
              </g>
            ))}
            {segments.map(([[fromLayer, fromNode], [toLayer, toNode]]) => (
              <line
                key={`${fromLayer}${fromNode}${toLayer}${toNode}`}
                x1={POS[fromNode][0]}
                y1={LAYERS[fromLayer].top + POS[fromNode][1]}
                x2={POS[toNode][0]}
                y2={LAYERS[toLayer].top + POS[toNode][1]}
                stroke="#2563eb"
                strokeWidth={1.25}
                strokeDasharray={fromLayer === toLayer ? undefined : "3 3"}
              />
            ))}
          </svg>
        );
      }}
    />
  );
}
