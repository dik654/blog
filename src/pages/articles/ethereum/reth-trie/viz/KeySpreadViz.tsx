import SceneShell from "./TrieSceneShell";

/**
 * 본문 대응: #prefix-set "Prefix가 적다는 사실만으로 빠르다고 단정하지 않습니다".
 * 가까운 key는 ancestor를 많이 공유하고 흩어진 key는 root 근처에서만 합쳐진다.
 * 3단계만 그린 모형 trie(가정): 가까운 두 key 3fa…·3fb… → 다시 볼 node 5개, 흩어진 두 key 3fa…·81c… → 7개.
 */
interface SpreadNode {
  id: string;
  x: number;
  y: number;
  parent: string | null;
}

const NODES: readonly SpreadNode[] = [
  { id: "root", x: 180, y: 18, parent: null },
  { id: "3", x: 100, y: 74, parent: "root" },
  { id: "8", x: 260, y: 74, parent: "root" },
  { id: "3f", x: 100, y: 130, parent: "3" },
  { id: "81", x: 260, y: 130, parent: "8" },
  { id: "3fa", x: 56, y: 186, parent: "3f" },
  { id: "3fb", x: 144, y: 186, parent: "3f" },
  { id: "81c", x: 260, y: 186, parent: "81" },
];

/** 바뀐 key가 끝나는 node에서 root까지 올라가며 만나는 node를 모읍니다. */
function pathTo(id: string): readonly string[] {
  const node = NODES.find((candidate) => candidate.id === id);
  if (!node) return [];
  return node.parent === null ? [node.id] : [node.id, ...pathTo(node.parent)];
}

const CASES: readonly { keys: readonly string[] }[] = [{ keys: ["3fa", "3fb"] }, { keys: ["3fa", "81c"] }];
const DIRTY_SETS = CASES.map((item) => new Set(item.keys.flatMap((key) => pathTo(key))));

const HOT = "#d97706";
const MUTED = "#94a3b8";
const TEXT = "#64748b";
const KEY = "#2563eb";

const SCENES = [
  {
    label: "가까운 두 key",
    summary: `바뀐 key 2개 → 다시 볼 node ${DIRTY_SETS[0].size}개`,
    note: "3fa…와 3fb…는 3f까지 같은 길을 씁니다. 두 key의 ancestor가 겹치므로 root, 3, 3f는 한 번만 다시 계산하면 됩니다.",
  },
  {
    label: "흩어진 두 key",
    summary: `바뀐 key 2개 → 다시 볼 node ${DIRTY_SETS[1].size}개`,
    note: "3fa…와 81c…는 root에서만 만납니다. 바뀐 key 수는 같은 2개인데 다시 볼 node가 늘어납니다. 실제 비용은 여기에 DB cache hit, inline/hash 경계, storage wipe와 branch collapse까지 겹치므로 changed key count와 visited node·read bytes·hash count를 함께 측정합니다.",
  },
] as const;

function KeySpreadFigure({ active }: { active: number }) {
  const dirty = DIRTY_SETS[active];
  const keys = new Set(CASES[active].keys);
  return (
    <svg viewBox="0 0 360 244" className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      {NODES.filter((node) => node.parent !== null).map((node) => {
        const parent = NODES.find((candidate) => candidate.id === node.parent) ?? NODES[0];
        const hot = dirty.has(node.id);
        return <path key={node.id} d={`M${parent.x} ${parent.y + 28} L${node.x} ${node.y}`} stroke={hot ? HOT : MUTED} strokeWidth={hot ? 1.25 : 1} fill="none" />;
      })}
      {NODES.map((node) => {
        const hot = dirty.has(node.id);
        const isKey = keys.has(node.id);
        const color = isKey ? KEY : hot ? HOT : MUTED;
        return (
          <g key={node.id}>
            <rect x={node.x - 34} y={node.y} width={68} height={28} rx={6} fill={hot ? color : "none"} fillOpacity={hot ? 0.14 : 0} stroke={color} strokeWidth={1} />
            <text x={node.x} y={node.y + 18} textAnchor="middle" fontSize={11.5} fontFamily="monospace" fontWeight={700} fill={hot ? color : TEXT}>
              {node.id === "root" ? "root" : `${node.id}…`}
            </text>
          </g>
        );
      })}
      <text x={180} y={238} textAnchor="middle" fontSize={10.5} fill={TEXT}>파랑 = 바뀐 key · 주황 = 그 key 때문에 다시 볼 ancestor</text>
    </svg>
  );
}

export default function KeySpreadViz() {
  return (
    <SceneShell
      eyebrow="shared prefix"
      title="같은 key 2개라도 어디에 있느냐에 따라 다시 볼 node 수가 다릅니다"
      description="3단계만 그린 모형 trie입니다(가정). 실제 trie는 단계마다 최대 16갈래이고 extension이 여러 단계를 한 node로 줄일 수 있습니다."
      ariaLabel="가까운 두 key와 흩어진 두 key가 다시 계산해야 하는 ancestor node 수 비교"
      scenes={SCENES}
      render={(active) => <KeySpreadFigure active={active} />}
    />
  );
}
