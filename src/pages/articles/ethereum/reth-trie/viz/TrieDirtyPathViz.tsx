import SceneShell from "./TrieSceneShell";

/**
 * 본문 대응: #overview "이 글의 고정 사례" — parent root r100, A의 balance 10→11, 계산 root r101을 block 101 header와 비교.
 * 트리 모양(1·8번 칸 subtree, 같은 branch 아래 leaf B)은 설명용 가정.
 * 다시 encode/hash하는 node 4개(leaf A, branch, extension, root), 기존 hash를 재사용하는 subtree 3개(B, 1…, 8…).
 */
type Role = "dirty" | "reuse";
interface TrieNode {
  id: string;
  x: number;
  y: number;
  title: string;
  role: Role;
  /** 이 node가 처음 바뀌는 장면 */
  from: number;
}

const NODES: readonly TrieNode[] = [
  { id: "root", x: 180, y: 22, title: "root branch", role: "dirty", from: 2 },
  { id: "s1", x: 58, y: 86, title: "1번 칸 subtree", role: "reuse", from: 2 },
  { id: "ext", x: 180, y: 86, title: "3번 칸 · ext f a", role: "dirty", from: 2 },
  { id: "s8", x: 302, y: 86, title: "8번 칸 subtree", role: "reuse", from: 2 },
  { id: "br", x: 180, y: 150, title: "branch", role: "dirty", from: 2 },
  { id: "leafA", x: 118, y: 214, title: "leaf A", role: "dirty", from: 1 },
  { id: "leafB", x: 242, y: 214, title: "leaf B", role: "reuse", from: 2 },
];
const EDGES: readonly (readonly [string, string])[] = [
  ["root", "s1"],
  ["root", "ext"],
  ["root", "s8"],
  ["ext", "br"],
  ["br", "leafA"],
  ["br", "leafB"],
];
const DIRTY = NODES.filter((node) => node.role === "dirty").length;
const REUSED = NODES.filter((node) => node.role === "reuse").length;

const DIRTY_COLOR = "#d97706";
const REUSE_COLOR = "#16a34a";
const MUTED = "#94a3b8";
const TEXT = "#64748b";
const BOX_W = 104;
const BOX_H = 34;

const SCENES = [
  {
    label: "parent root r100",
    summary: "모든 node의 hash를 이미 앎",
    note: "block 100까지의 state가 이 trie이고, root를 접은 값이 r100입니다. 아직 아무것도 바뀌지 않았으므로 모든 node에 기존 hash가 있습니다.",
  },
  {
    label: "leaf A 다시 encode",
    summary: "balance 10 → 11",
    note: "A의 balance가 10에서 11로 바뀌면 account RLP가 달라지므로 leaf A를 다시 encode하고 hash합니다.",
  },
  {
    label: "ancestor를 위로",
    summary: `다시 계산 ${DIRTY}개 · 재사용 ${REUSED}개`,
    note: "leaf A가 바뀌면 그 값을 품은 branch, extension, root가 차례로 달라집니다. A와 prefix를 공유하지 않는 1번·8번 칸 subtree와 옆 leaf B는 기존 hash를 그대로 씁니다. 짧은 node가 parent 안에 inline되면 hash 수는 node 수와 같지 않을 수 있습니다.",
  },
  {
    label: "header와 비교",
    summary: "같을 때만 받아들임",
    note: "새로 접은 root r101이 block 101 header의 state root와 정확히 같을 때만 실행 결과를 받아들입니다. 다르면 sibling hash를 얼마나 재사용했든 block을 거절합니다.",
  },
] as const;

function nodeById(id: string) {
  return NODES.find((node) => node.id === id) ?? NODES[0];
}

function colorOf(node: TrieNode, active: number) {
  if (active < node.from) return MUTED;
  return node.role === "dirty" ? DIRTY_COLOR : REUSE_COLOR;
}

function statusOf(node: TrieNode, active: number) {
  if (node.id === "root") return active >= 3 ? "r101" : active >= 2 ? "다시 hash" : "r100";
  if (active < node.from) return "기존 hash";
  if (node.id === "leafA") return "balance 11 · 다시 hash";
  return node.role === "dirty" ? "다시 hash" : "기존 hash 재사용";
}

function DirtyPathFigure({ active }: { active: number }) {
  return (
    <div className="min-w-0">
      <svg viewBox="0 0 360 256" className="mx-auto h-auto w-full max-w-[400px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
        {EDGES.map(([fromId, toId]) => {
          const from = nodeById(fromId);
          const to = nodeById(toId);
          const hot = to.role === "dirty" && active >= to.from;
          return <path key={`${fromId}-${toId}`} d={`M${from.x} ${from.y + BOX_H} L${to.x} ${to.y}`} stroke={hot ? DIRTY_COLOR : MUTED} strokeWidth={hot ? 1.25 : 1} fill="none" />;
        })}
        {NODES.map((node) => {
          const color = colorOf(node, active);
          const lit = active >= node.from;
          return (
            <g key={node.id}>
              <rect x={node.x - BOX_W / 2} y={node.y} width={BOX_W} height={BOX_H} rx={6} fill={lit ? color : "none"} fillOpacity={lit ? 0.14 : 0} stroke={color} strokeWidth={1} strokeDasharray={node.role === "reuse" && lit ? "4 3" : undefined} />
              <text x={node.x} y={node.y + 14} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={lit ? color : TEXT}>{node.title}</text>
              <text x={node.x} y={node.y + 27} textAnchor="middle" fontSize={10} fill={lit ? color : TEXT}>{statusOf(node, active)}</text>
            </g>
          );
        })}
      </svg>
      <div className="mt-3 grid grid-cols-1 gap-2 text-xs leading-5 sm:grid-cols-2">
        <div className={`rounded-lg border px-3 py-2 ${active === 3 ? "border-primary text-foreground" : "border-border text-muted-foreground"}`}>
          <strong>r101 = block 101 header root</strong> → 결과를 받아들임
        </div>
        <div className={`rounded-lg border px-3 py-2 ${active === 3 ? "border-red-500/70 text-foreground" : "border-border text-muted-foreground"}`}>
          <strong>r101 ≠ header root</strong> → block 전체가 invalid
        </div>
      </div>
    </div>
  );
}

export default function TrieDirtyPathViz() {
  return (
    <SceneShell
      eyebrow="dirty path · sibling 재사용"
      title="A의 balance 하나가 바뀌면 root까지의 길만 다시 계산합니다"
      description="주황 실선은 다시 encode·hash하는 node, 초록 점선은 기존 hash를 그대로 쓰는 subtree입니다. 1번·8번 칸과 leaf B가 있는 트리 모양은 설명용 가정입니다."
      ariaLabel="account A의 balance 변경이 leaf에서 root까지 다시 hash되고 sibling subtree hash는 재사용되는 과정"
      scenes={SCENES}
      render={(active) => <DirtyPathFigure active={active} />}
    />
  );
}
