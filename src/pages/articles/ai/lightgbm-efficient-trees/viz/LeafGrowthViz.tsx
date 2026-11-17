import SceneShell from "./SceneShell";

/**
 * 본문 대응: #leaf-growth — terminal gains [3,7,5]에서 level-wise와 leaf-wise가 같은 split 3번을 어디에 쓰는지.
 * 세 leaf가 같은 depth라고 가정합니다. leaf-wise의 새 leaf gain(B1 6, B2 2, B1a 6, B1b 1)은 설명용 가정입니다.
 * level-wise: A·B·C를 한 번씩 → leaf 6개, 모든 branch +1.
 * leaf-wise: max(3,7,5)=7 → B, max(3,5,6,2)=6 → B1, max(3,5,2,6,1)=6 → B1a → leaf 6개, B branch만 +3.
 */
type TreeNode = { id: string; x: number; y: number; gain: string; parent?: string; from: number };

const W = 300;
const H = 250;
/** level-wise 트리는 depth 한 단계만 자라므로 아래 빈 공간을 잘라 모바일에서 leaf-wise 트리가 함께 보이게 합니다. */
const LEVEL_H = 130;
const NODE_W = 44;
const NODE_H = 30;
const TOP_Y = 40;

const ROOTS: readonly TreeNode[] = [
  { id: "A", x: 50, y: TOP_Y, gain: "gain 3", from: 0 },
  { id: "B", x: 150, y: TOP_Y, gain: "gain 7", from: 0 },
  { id: "C", x: 250, y: TOP_Y, gain: "gain 5", from: 0 },
];

const LEVEL_NODES: readonly TreeNode[] = [
  ...ROOTS,
  { id: "A1", x: 25, y: 100, gain: "?", parent: "A", from: 1 },
  { id: "A2", x: 75, y: 100, gain: "?", parent: "A", from: 1 },
  { id: "B1", x: 125, y: 100, gain: "?", parent: "B", from: 1 },
  { id: "B2", x: 175, y: 100, gain: "?", parent: "B", from: 1 },
  { id: "C1", x: 225, y: 100, gain: "?", parent: "C", from: 1 },
  { id: "C2", x: 275, y: 100, gain: "?", parent: "C", from: 1 },
];

const LEAF_NODES: readonly TreeNode[] = [
  ...ROOTS,
  { id: "B1", x: 110, y: 100, gain: "gain 6", parent: "B", from: 2 },
  { id: "B2", x: 190, y: 100, gain: "gain 2", parent: "B", from: 2 },
  { id: "B1a", x: 75, y: 160, gain: "gain 6", parent: "B1", from: 3 },
  { id: "B1b", x: 145, y: 160, gain: "gain 1", parent: "B1", from: 3 },
  { id: "B1a·1", x: 45, y: 220, gain: "?", parent: "B1a", from: 4 },
  { id: "B1a·2", x: 105, y: 220, gain: "?", parent: "B1a", from: 4 },
];

/** 장면별로 방금 쪼갠 node. */
const LEAF_SPLIT_AT: Record<number, string> = { 2: "B", 3: "B1", 4: "B1a" };

const SCENES = [
  {
    label: "현재 terminal leaf 세 개",
    summary: "예상 gain [3, 7, 5]",
    note: "두 성장 규칙이 같은 시작점에서 출발합니다. gain은 그 leaf를 한 번 더 쪼갤 때 기대하는 loss 감소량입니다. 세 leaf가 같은 depth에 있다고 가정하고 위쪽 구조는 생략했습니다.",
  },
  {
    label: "level-wise: 같은 depth 전부",
    summary: "split 3번 → A·B·C 모두",
    note: "Level-wise는 같은 depth의 모든 node를 키웁니다. gain이 3인 A에도 split 하나를 쓰므로 split 3번 뒤 terminal leaf는 6개이고, 모든 branch가 한 단계씩 깊어집니다. 새 leaf의 gain은 이 그림에서 정하지 않았습니다(?).",
  },
  {
    label: "leaf-wise 1번째 split",
    summary: "max(3, 7, 5) = 7 → B",
    note: "Leaf-wise는 gain이 가장 큰 terminal leaf 하나만 확장합니다. A와 C는 그대로 두고 B를 B1·B2로 쪼갭니다. 새 leaf의 gain 6과 2는 다음 장면을 보이려는 가정입니다.",
  },
  {
    label: "leaf-wise 2번째 split",
    summary: "max(3, 5, 6, 2) = 6 → B1",
    note: "후보는 다시 모든 terminal leaf입니다. 가정한 gain으로는 B1의 6이 C의 5보다 커서 이번에도 B 쪽 leaf를 쪼갭니다.",
  },
  {
    label: "leaf-wise 3번째 split",
    summary: "max(3, 5, 2, 6, 1) = 6 → B1a",
    note: "두 규칙 모두 split 3번으로 terminal leaf 6개를 만들었지만, leaf-wise에서는 B 쪽 branch만 세 단계 깊어졌습니다. 같은 leaf budget에서 training loss를 빨리 줄일 수 있지만, 작은 data에서는 이런 깊고 작은 leaf가 overfit할 수 있어 num_leaves·min_data_in_leaf·max_depth를 함께 제한합니다.",
  },
] as const;

function Tree({
  nodes,
  active,
  splitNow,
  label,
  detail,
  focused,
  height = H,
}: {
  height?: number;
  nodes: readonly TreeNode[];
  active: number;
  splitNow: readonly string[];
  label: string;
  detail: string;
  focused: boolean;
}) {
  const shown = nodes.filter((node) => node.from <= active);
  const byId = new Map(shown.map((node) => [node.id, node]));
  return (
    <div className={`min-w-0 rounded-lg border p-2 ${focused ? "border-primary" : "border-border"}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 px-1">
        <p className="text-sm font-bold">{label}</p>
        <p className="font-mono text-xs text-muted-foreground">{detail}</p>
      </div>
      <svg viewBox={`0 0 ${W} ${height}`} className="mt-1 block h-auto w-full" role="img" aria-label={`${label}: ${detail}`}>
        <text x={W / 2} y={12} textAnchor="middle" fontSize={10} fill="#64748b">
          위쪽 구조 생략 · 세 leaf는 같은 depth(가정)
        </text>
        {ROOTS.map((root) => (
          <line key={root.id} x1={W / 2} y1={17} x2={root.x} y2={root.y - NODE_H / 2} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
        ))}
        {shown
          .filter((node) => node.parent)
          .map((node) => {
            const parent = byId.get(node.parent ?? "");
            if (!parent) return null;
            return (
              <line
                key={`edge-${node.id}`}
                x1={parent.x}
                y1={parent.y + NODE_H / 2}
                x2={node.x}
                y2={node.y - NODE_H / 2}
                stroke="#94a3b8"
                strokeWidth={1}
              />
            );
          })}
        {shown.map((node) => {
          const split = splitNow.includes(node.id);
          const isParent = shown.some((other) => other.parent === node.id);
          return (
            <g key={node.id}>
              <rect
                x={node.x - NODE_W / 2}
                y={node.y - NODE_H / 2}
                width={NODE_W}
                height={NODE_H}
                rx={4}
                fill={split ? "#dbeafe" : isParent ? "#f1f5f9" : "#ffffff"}
                stroke={split ? "#2563eb" : "#94a3b8"}
                strokeWidth={split ? 1.25 : 1}
              />
              <text x={node.x} y={node.y - 2} textAnchor="middle" fontSize={11} fontWeight={700} fill="#0f172a">
                {node.id}
              </text>
              <text x={node.x} y={node.y + 10} textAnchor="middle" fontSize={10} fill={isParent ? "#94a3b8" : "#334155"}>
                {node.gain}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function LeafGrowthViz() {
  return (
    <SceneShell
      eyebrow="같은 split 3번"
      title="Level-wise는 고르게, leaf-wise는 gain이 큰 쪽으로 깊어집니다"
      description="왼쪽(위)은 level-wise, 오른쪽(아래)은 leaf-wise입니다. 파란 테두리는 이번에 쪼갠 leaf, 회색으로 채운 칸은 이미 쪼개져 terminal이 아닌 node입니다. gain [3, 7, 5]는 글의 예이고 그 밖의 gain 수치는 가정입니다."
      ariaLabel="gain 3, 7, 5인 세 leaf에서 level-wise와 leaf-wise 성장이 split 3번을 쓰는 위치 비교"
      scenes={SCENES}
      render={(active) => {
        const levelDone = active >= 1;
        const leafSplits = Math.max(0, active - 1);
        const leafSplitNow = LEAF_SPLIT_AT[active];
        return (
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <Tree
              nodes={LEVEL_NODES}
              active={levelDone ? 1 : 0}
              splitNow={active === 1 ? ["A", "B", "C"] : []}
              label="level-wise"
              detail={levelDone ? "split 3 · leaf 6 · 모두 +1" : "split 0 · leaf 3"}
              focused={active === 1}
              height={LEVEL_H}
            />
            <Tree
              nodes={LEAF_NODES}
              active={active}
              splitNow={leafSplitNow ? [leafSplitNow] : []}
              label="leaf-wise"
              detail={`split ${leafSplits} · leaf ${3 + leafSplits}${leafSplits > 0 ? ` · B 쪽 +${leafSplits}` : ""}`}
              focused={active >= 2}
            />
          </div>
        );
      }}
    />
  );
}
