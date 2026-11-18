import SceneShell from "./SceneShell";

/**
 * 본문 대응: #hamt-amt — "Structural sharing" 카드 바로 앞.
 * 한 leaf가 바뀌면 그 path의 node와 상위 root만 새 CID를 얻고, 나머지 branch는 이전 CID를 재사용할 수 있습니다.
 * Tree 모양(root 1 · 중간 node 2 · leaf 4)은 그림을 위한 가정입니다. 7개 중 새 CID 3개, 재사용 4개.
 */
type NodeId = "R" | "N1" | "N2" | "L1" | "L2" | "L3" | "L4";

const NODES: readonly { id: NodeId; x: number; y: number; parent: NodeId | null }[] = [
  { id: "R", x: 180, y: 24, parent: null },
  { id: "N1", x: 95, y: 98, parent: "R" },
  { id: "N2", x: 265, y: 98, parent: "R" },
  { id: "L1", x: 50, y: 174, parent: "N1" },
  { id: "L2", x: 140, y: 174, parent: "N1" },
  { id: "L3", x: 220, y: 174, parent: "N2" },
  { id: "L4", x: 310, y: 174, parent: "N2" },
];
const PATH: readonly NodeId[] = ["L3", "N2", "R"];
const NEW_COUNT = PATH.length;
const REUSED_COUNT = NODES.length - NEW_COUNT;

const SCENES = [
  {
    label: "바뀌기 전",
    summary: `node ${NODES.length}개 · 모두 기존 CID`,
    note: "부모 node는 자식의 bytes가 아니라 자식의 CID를 담습니다. CID는 encoded bytes의 digest이므로 자식의 bytes가 달라지면 그 CID도 달라집니다.",
  },
  {
    label: "leaf 하나가 바뀝니다",
    summary: "L3 → L3′",
    note: "Leaf L3에 담긴 값이 바뀌면 L3의 bytes가 달라지고, 새 CID L3′가 생깁니다.",
  },
  {
    label: "위로 따라 올라갑니다",
    summary: "N2′ · R′ 새 CID",
    note: "N2는 L3의 CID를 품고 있으므로 L3′로 바꿔 적으면 N2의 bytes도 달라져 N2′가 됩니다. 같은 이유로 root도 R′가 됩니다.",
  },
  {
    label: "나머지는 재사용합니다",
    summary: `새 CID ${NEW_COUNT}개 · 재사용 ${REUSED_COUNT}개`,
    note: "L1·L2·L4와 N1은 bytes가 그대로라 이전 CID를 재사용할 수 있습니다. 바뀐 path의 node와 root만 새로 저장하면 됩니다.",
  },
] as const;

const W = 360;
const H = 200;
const BOX_W = 58;
const BOX_H = 38;
const BLUE = "#2563eb";
const GREEN = "#16a34a";
const GREY = "#94a3b8";
const TEXT = "#64748b";

function changedAt(id: NodeId, active: number) {
  if (id === "L3") return active >= 1;
  if (id === "N2" || id === "R") return active >= 2;
  return false;
}

export default function StructuralSharingViz() {
  return (
    <SceneShell
      eyebrow="Structural sharing"
      title="Leaf 하나가 바뀌면 그 위 path만 새 CID가 됩니다"
      description="상자 하나가 CID로 연결된 node 하나입니다. Root 1개·중간 node 2개·leaf 4개라는 모양은 설명을 위한 가정입니다."
      ariaLabel="한 leaf 변경이 path의 node와 root에만 새 CID를 만드는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {NODES.filter((node) => node.parent).map((node) => {
            const parent = NODES.find((item) => item.id === node.parent);
            if (!parent) return null;
            const hot = changedAt(node.id, active) && changedAt(parent.id, active);
            return (
              <line
                key={`e-${node.id}`}
                x1={parent.x}
                y1={parent.y + BOX_H / 2}
                x2={node.x}
                y2={node.y - BOX_H / 2}
                stroke={hot ? BLUE : GREY}
                strokeWidth={hot ? 1.25 : 1}
              />
            );
          })}
          {NODES.map((node) => {
            const changed = changedAt(node.id, active);
            const reused = active === 3 && !changed;
            const color = changed ? BLUE : reused ? GREEN : GREY;
            return (
              <g key={node.id}>
                <rect
                  x={node.x - BOX_W / 2}
                  y={node.y - BOX_H / 2}
                  width={BOX_W}
                  height={BOX_H}
                  rx={6}
                  fill={changed ? BLUE : "none"}
                  fillOpacity={changed ? 0.14 : 0}
                  stroke={color}
                  strokeWidth={changed || reused ? 1.25 : 1}
                />
                <text x={node.x} y={node.y + (changed || reused ? -1 : 4)} textAnchor="middle" fontSize={12} fontFamily="monospace" fontWeight={700} fill={changed ? BLUE : reused ? GREEN : TEXT}>
                  {changed ? `${node.id}′` : node.id}
                </text>
                {reused && (
                  <text x={node.x} y={node.y + 12} textAnchor="middle" fontSize={10} fill={GREEN}>재사용</text>
                )}
                {changed && (
                  <text x={node.x} y={node.y + 12} textAnchor="middle" fontSize={10} fill={BLUE}>새 CID</text>
                )}
              </g>
            );
          })}
        </svg>
      )}
    />
  );
}
