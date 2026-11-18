import SceneShell from "./StorageSceneShell";

/**
 * 본문 대응: #proof-layout — location은 leaf 삽입 순서, position은 모든 node의 post-order index.
 * Append할 때 높이가 같은 마지막 두 peak를 합치며 번호를 붙이면 post-order가 되고,
 * 11 leaves에서 peak는 position 14·17·18, node는 2×11−3 = 19개입니다(본문 식과 같음).
 */
interface MmrNode {
  position: number;
  height: number;
  first: number;
  last: number;
  children: readonly number[];
}

function buildMmr(leafCount: number): MmrNode[] {
  const nodes: MmrNode[] = [];
  const peaks: number[] = [];
  for (let leaf = 0; leaf < leafCount; leaf += 1) {
    nodes.push({ position: nodes.length, height: 0, first: leaf, last: leaf, children: [] });
    peaks.push(nodes.length - 1);
    while (peaks.length >= 2 && nodes[peaks[peaks.length - 1]].height === nodes[peaks[peaks.length - 2]].height) {
      const right = peaks.pop() as number;
      const left = peaks.pop() as number;
      nodes.push({
        position: nodes.length,
        height: nodes[left].height + 1,
        first: nodes[left].first,
        last: nodes[right].last,
        children: [left, right],
      });
      peaks.push(nodes.length - 1);
    }
  }
  return nodes;
}

const LEAVES = 11;
const NODES = buildMmr(LEAVES);
/** leaf N개를 넣었을 때 생긴 node 수 = 2N − popcount(N) */
const nodeCount = (leafCount: number) => 2 * leafCount - leafCount.toString(2).split("").filter((bit) => bit === "1").length;
/** 그 시점의 peak = 아직 부모가 없는 node */
const peaksAt = (leafCount: number) => {
  const count = nodeCount(leafCount);
  const shown = NODES.slice(0, count);
  const hasParent = new Set(shown.flatMap((node) => node.children));
  return shown.filter((node) => !hasParent.has(node.position)).map((node) => node.position);
};

const W = 360;
const LEFT = 22;
const STEP = (W - 2 * LEFT) / (LEAVES - 1);
const LEAF_Y = 176;
const LEVEL = 40;
const R = 11;
const nx = (node: MmrNode) => LEFT + ((node.first + node.last) / 2) * STEP;
const ny = (node: MmrNode) => LEAF_Y - node.height * LEVEL;

const STEPS = [2, 3, 4, 8, 10, 11] as const;

const SCENES = STEPS.map((leafCount, index) => {
  const peaks = peaksAt(leafCount);
  return {
    leafCount,
    previous: index === 0 ? 0 : nodeCount(STEPS[index - 1]),
    label: `leaf ${leafCount}개`,
    summary: `${leafCount} = ${leafCount.toString(2)}₂ · peak ${peaks.length} · node ${nodeCount(leafCount)}`,
    note: [
      "L0이 position 0, L1이 position 1을 받고, 두 자식 뒤에 부모가 position 2를 받습니다. Post-order는 자식들을 먼저 번호 매기고 부모를 그 뒤에 매기는 순서입니다.",
      "L2는 position 3입니다. 짝이 없으니 혼자 peak가 되고, peak는 position 2와 3 두 개입니다. 앞의 0·1·2는 바뀌지 않았습니다.",
      "L3(position 4)가 오면 L2와 합친 부모가 5, 높이가 같아진 2와 5를 합친 부모가 6을 받습니다. Peak는 6 하나로 줄었지만 0~5의 position은 그대로입니다.",
      "L4~L7을 같은 규칙으로 붙이면 position 7~14가 새로 생기고, 8개 leaf를 덮는 peak가 position 14입니다. 앞의 0~6은 이번에도 그대로입니다.",
      "L8·L9가 position 15·16을 받고 그 부모가 17입니다. 높이가 다른 14와 17은 합쳐지지 않아 peak가 둘입니다.",
      "L10이 position 18을 받아 peak가 14·17·18 세 개, node가 19개입니다. 아래 식의 3 peaks·19 nodes와 같은 그림입니다.",
    ][index],
  };
});

export default function MmrAppendPositionViz() {
  return (
    <SceneShell
      eyebrow="Append 순서대로 번호 붙이기"
      title="Leaf를 붙일 때마다 새 번호만 뒤에 생기고 앞 번호는 바뀌지 않습니다"
      description="원 안 숫자가 position, 아래 L 번호가 location(leaf 삽입 순서)입니다. Peak는 아직 부모가 없는 node, 곧 각 완전 이진트리(mountain)의 꼭대기로, 이중 테두리로 표시합니다. 파란 원은 직전 장면 이후 새로 생긴 node입니다."
      ariaLabel="MMR에 leaf를 2, 3, 4, 8, 10, 11개 append할 때 post-order position과 peak가 생기는 여섯 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const count = nodeCount(scene.leafCount);
        const peaks = new Set(peaksAt(scene.leafCount));
        const shown = NODES.slice(0, count);
        return (
          <svg viewBox={`0 0 ${W} 214`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {shown.flatMap((node) =>
              node.children.map((child) => (
                <line key={`${node.position}-${child}`} x1={nx(node)} y1={ny(node)} x2={nx(NODES[child])} y2={ny(NODES[child])} stroke="#94a3b8" strokeWidth={1} />
              )),
            )}
            {NODES.filter((node) => node.height === 0).map((node) => (
              <text key={`loc-${node.first}`} x={nx(node)} y={LEAF_Y + R + 15} textAnchor="middle" fontSize={10} fill={node.first < scene.leafCount ? "#64748b" : "#cbd5e1"}>L{node.first}</text>
            ))}
            {NODES.map((node) => {
              const visible = node.position < count;
              const fresh = visible && node.position >= scene.previous;
              const peak = peaks.has(node.position);
              if (!visible) {
                return <circle key={node.position} cx={nx(node)} cy={ny(node)} r={R} fill="none" stroke="#e2e8f0" strokeWidth={1} strokeDasharray="2 2" />;
              }
              return (
                <g key={node.position}>
                  <circle cx={nx(node)} cy={ny(node)} r={R} fill={fresh ? "#2563eb" : "#ffffff"} stroke={peak ? "#0f172a" : "#94a3b8"} strokeWidth={peak ? 1.25 : 1} />
                  {peak && <circle cx={nx(node)} cy={ny(node)} r={R + 3} fill="none" stroke="#0f172a" strokeWidth={1} />}
                  <text x={nx(node)} y={ny(node) + 3.5} textAnchor="middle" fontSize={10} fontWeight={700} fill={fresh ? "#ffffff" : "#334155"}>{node.position}</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
