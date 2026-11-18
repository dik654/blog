import StateSceneShell from "./StateSceneShell";

/**
 * 본문 대응: #mpt-traversal — Branch·extension·leaf가 64-nibble path를 소비하는 방식,
 * inline/hash reference, 정상 부재 두 가지와 invalid proof의 차이.
 * 사례: root S 아래 slot 5 → 값 7. nibble 값과 trie 모양은 설명용 가정이다.
 * 소비 개수: Branch 1 + Extension 2 + Leaf 61 = 64.
 */

type NodeState = "idle" | "checked" | "active" | "absent" | "missing";
type Edge = "idle" | "on";

interface Scene {
  label: string;
  summary: string;
  note: string;
  path: readonly string[];
  consumed: number;
  divergeAt: number;
  rootSlot: string;
  root: NodeState;
  ext: NodeState;
  leaf: NodeState;
  refs: Edge;
  verdict: string;
  verdictColor: string;
}

const KEY5 = ["a", "3", "c", "1", "9", "…"] as const;

const SCENES: readonly Scene[] = [
  {
    label: "Branch",
    summary: "nibble a → child a",
    note: "Nibble은 4-bit 숫자 하나(0~f)입니다. Slot key 5를 Keccak-256하면 64개의 nibble path가 됩니다. Branch는 다음 nibble 하나를 읽어 0~f 16칸 중 그 칸의 child로 내려갑니다. 여기서는 a를 소비합니다.",
    path: KEY5, consumed: 1, divergeAt: -1, rootSlot: "a",
    root: "active", ext: "idle", leaf: "idle", refs: "idle",
    verdict: "진행 중 · 1/64 소비", verdictColor: "#2563eb",
  },
  {
    label: "Extension",
    summary: "공통 prefix 3c를 한 번에",
    note: "Extension은 아래 key들이 함께 쓰는 공통 prefix를 한 node에 담습니다. 요청 path의 다음 두 nibble 3·c가 그 prefix와 같으므로 한 번에 소비하고 child로 내려갑니다.",
    path: KEY5, consumed: 3, divergeAt: -1, rootSlot: "a",
    root: "checked", ext: "active", leaf: "idle", refs: "idle",
    verdict: "진행 중 · 3/64 소비", verdictColor: "#2563eb",
  },
  {
    label: "Leaf",
    summary: "suffix 61개 + 값 RLP(7)",
    note: "Leaf는 남은 suffix와 값을 함께 가집니다. 남은 61개 nibble이 leaf suffix와 같고, leaf 값이 expected RLP(7)과 byte 단위로 같아야 포함 proof가 성립합니다. 1+2+61=64개를 모두 소비했습니다.",
    path: KEY5, consumed: 6, divergeAt: -1, rootSlot: "a",
    root: "checked", ext: "checked", leaf: "active", refs: "idle",
    verdict: "포함 · slot 5 = 7", verdictColor: "#16a34a",
  },
  {
    label: "Child 참조",
    summary: "이 경로는 hash 참조, 짧은 child는 inline",
    note: "긴 child node는 parent에 Keccak hash로 적히고, 짧은 child node는 parent 안에 통째로 inline됩니다. 이 예시의 두 child는 짧지 않습니다. Extension은 child hash를, leaf는 61개 suffix와 값을 담으므로 둘 다 hash 참조로 그렸습니다. 그래도 verifier는 모든 edge를 32-byte hash로 가정하지 않고 두 방식을 모두 확인합니다.",
    path: KEY5, consumed: 6, divergeAt: -1, rootSlot: "a",
    root: "checked", ext: "checked", leaf: "checked", refs: "on",
    verdict: "edge마다 hash·inline 둘 다 확인", verdictColor: "#2563eb",
  },
  {
    label: "부재 ① 빈 child",
    summary: "nibble 4 → 빈 칸",
    note: "다른 key(가정)의 path가 4로 시작합니다. Root branch의 4번 칸이 비어 있으므로 S 아래 이 key가 없음을 증명할 수 있습니다. 이때도 S에서 그 branch node까지 hash가 맞아야 합니다.",
    path: ["4", "…"], consumed: 1, divergeAt: 0, rootSlot: "4",
    root: "absent", ext: "idle", leaf: "idle", refs: "idle",
    verdict: "정상 부재", verdictColor: "#16a34a",
  },
  {
    label: "부재 ② suffix 갈림",
    summary: "1·7 ≠ leaf의 1·9",
    note: "다른 key(가정)의 path a·3·c·1·7…는 extension까지 같지만, leaf suffix 1·9…와 두 번째 nibble에서 갈라집니다. 끝까지 온전한 hash chain이 있으면 이 갈림이 key의 부재를 증명합니다.",
    path: ["a", "3", "c", "1", "7", "…"], consumed: 4, divergeAt: 4, rootSlot: "a",
    root: "checked", ext: "checked", leaf: "absent", refs: "idle",
    verdict: "정상 부재", verdictColor: "#16a34a",
  },
  {
    label: "Invalid",
    summary: "node 누락 ≠ 부재",
    note: "Proof 배열이 extension 다음에서 끊겨 leaf node가 없습니다. 마지막으로 확인한 node가 부재를 설명하지 못하므로 정상 부재가 아니라 invalid proof입니다. RPC timeout이나 빈 배열도 같은 이유로 부재로 바꾸지 않습니다.",
    path: KEY5, consumed: 3, divergeAt: -1, rootSlot: "a",
    root: "checked", ext: "checked", leaf: "missing", refs: "idle",
    verdict: "검증 실패", verdictColor: "#dc2626",
  },
];

const NIBBLES = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"] as const;
const OCCUPIED = new Set(["2", "a", "e"]);
const SLOT_W = 18;
const SLOT_X0 = 36;
const slotX = (nibble: string) => SLOT_X0 + NIBBLES.indexOf(nibble as (typeof NIBBLES)[number]) * SLOT_W;

function stroke(state: NodeState) {
  if (state === "active") return "#2563eb";
  if (state === "absent") return "#16a34a";
  if (state === "missing") return "#dc2626";
  if (state === "checked") return "#64748b";
  return "#cbd5e1";
}

function fill(state: NodeState) {
  if (state === "active") return "#eff6ff";
  if (state === "absent") return "#f0fdf4";
  if (state === "missing") return "#fef2f2";
  return "#ffffff";
}

function PathStrip({ scene }: { scene: Scene }) {
  const widths = scene.path.map((n) => (n === "…" ? 92 : 30));
  const xs = widths.map((_, i) => 20 + widths.slice(0, i).reduce<number>((sum, w) => sum + w + 4, 0));
  return (
    <g>
      <text x={20} y={12} fontSize={12} fill="#475569">요청 path k (64 nibbles, 앞자리 가정)</text>
      {scene.path.map((n, i) => {
        const used = i < scene.consumed;
        const diverge = i === scene.divergeAt;
        return (
          <g key={i}>
            <rect
              x={xs[i]} y={18} width={widths[i]} height={22} rx={4}
              fill={diverge ? "#fef3c7" : used ? "#dbeafe" : "#ffffff"}
              stroke={diverge ? "#d97706" : used ? "#2563eb" : "#cbd5e1"} strokeWidth={1}
            />
            <text x={xs[i] + widths[i] / 2} y={34} textAnchor="middle" fontSize={13} fontFamily="monospace" fill="#0f172a">
              {n === "…" ? (scene.path.length > 2 ? "… 59개" : "… 63개") : n}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function Diagram({ scene }: { scene: Scene }) {
  const selX = slotX(scene.rootSlot) + SLOT_W / 2;
  const extReached = scene.ext !== "idle";
  const leafReached = scene.leaf !== "idle";
  return (
    <svg viewBox="0 0 360 262" className="mx-auto h-auto w-full max-w-[400px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
      <PathStrip scene={scene} />

      {/* Root branch */}
      <text x={20} y={64} fontSize={12} fill="#475569">root S · Branch (16칸)</text>
      <text x={340} y={64} textAnchor="end" fontSize={11} fill="#64748b">점선 칸 = 빈 child</text>
      <rect x={SLOT_X0 - 4} y={70} width={16 * SLOT_W + 8} height={32} rx={6} fill={fill(scene.root)} stroke={stroke(scene.root)} strokeWidth={1} />
      {NIBBLES.map((n) => {
        const selected = n === scene.rootSlot && scene.root !== "idle";
        const occupied = OCCUPIED.has(n);
        return (
          <g key={n}>
            <rect
              x={slotX(n) + 1} y={74} width={SLOT_W - 2} height={24} rx={3}
              fill={selected ? (occupied ? "#2563eb" : "#ffffff") : occupied ? "#e2e8f0" : "#ffffff"}
              stroke={selected ? (occupied ? "#2563eb" : "#16a34a") : "#cbd5e1"}
              strokeWidth={1} strokeDasharray={occupied ? undefined : "2 2"}
            />
            <text x={slotX(n) + SLOT_W / 2} y={91} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={selected && occupied ? "#ffffff" : "#475569"}>{n}</text>
          </g>
        );
      })}

      {/* root → extension edge */}
      <line x1={slotX("a") + SLOT_W / 2} y1={102} x2={180} y2={134} stroke={extReached ? "#64748b" : "#cbd5e1"} strokeWidth={1} />
      {scene.refs === "on" && (
        <g>
          <rect x={192} y={110} width={112} height={19} rx={3} fill="#ffffff" stroke="#2563eb" strokeWidth={1} />
          <text x={248} y={124} textAnchor="middle" fontSize={11} fill="#2563eb">hash 32B 참조</text>
        </g>
      )}

      {/* Extension */}
      <rect x={90} y={134} width={180} height={34} rx={6} fill={fill(scene.ext)} stroke={stroke(scene.ext)} strokeWidth={1} />
      <text x={180} y={149} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0f172a">Extension</text>
      <text x={180} y={163} textAnchor="middle" fontSize={11} fontFamily="monospace" fill="#475569">공통 prefix 3c</text>

      {/* extension → leaf edge */}
      <line x1={180} y1={168} x2={180} y2={196} stroke={leafReached ? (scene.leaf === "missing" ? "#dc2626" : "#64748b") : "#cbd5e1"} strokeWidth={1} strokeDasharray={scene.leaf === "missing" ? "3 3" : undefined} />
      {scene.refs === "on" && (
        <g>
          <rect x={192} y={172} width={130} height={19} rx={3} fill="#ffffff" stroke="#2563eb" strokeWidth={1} />
          <text x={257} y={186} textAnchor="middle" fontSize={11} fill="#2563eb">hash 32B 참조</text>
        </g>
      )}

      {scene.refs === "on" && (
        <text x={16} y={148} fontSize={10} fill="#2563eb">
          <tspan x={16} dy={0}>짧은 child면</tspan>
          <tspan x={16} dy={13}>통째로 inline</tspan>
        </text>
      )}

      {/* Leaf */}
      <rect
        x={30} y={196} width={300} height={40} rx={6}
        fill={fill(scene.leaf)} stroke={stroke(scene.leaf)} strokeWidth={1}
        strokeDasharray={scene.leaf === "missing" ? "4 3" : undefined}
      />
      {scene.leaf === "missing" ? (
        <text x={180} y={220} textAnchor="middle" fontSize={12} fontWeight={700} fill="#dc2626">Leaf node 없음 (배열 끊김)</text>
      ) : (
        <>
          <text x={180} y={212} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0f172a">Leaf</text>
          <text x={180} y={228} textAnchor="middle" fontSize={11} fontFamily="monospace" fill="#475569">suffix 1 9 … (61개) · 값 RLP(7)</text>
        </>
      )}

      {/* verdict */}
      <text x={20} y={256} fontSize={12} fill="#475569">판정</text>
      <text x={56} y={256} fontSize={13} fontWeight={700} fill={scene.verdictColor}>{scene.verdict}</text>
      {scene.root !== "idle" && scene.rootSlot !== "a" && (
        <circle cx={selX} cy={86} r={13} fill="none" stroke="#16a34a" strokeWidth={1.25} />
      )}
    </svg>
  );
}

export default function MptPathConsumeViz() {
  return (
    <StateSceneShell
      eyebrow="MPT path 소비"
      title="세 종류의 node가 64개 nibble을 나눠 소비합니다"
      description="Storage root S 아래 slot 5의 값 7을 찾는 경로입니다. Nibble 값과 trie 모양(Branch → Extension → Leaf)은 설명용 가정입니다."
      ariaLabel="Branch, extension, leaf가 nibble path를 소비하는 방식과 정상 부재, invalid proof의 차이"
      scenes={SCENES}
      render={(active) => <Diagram scene={SCENES[active]} />}
    />
  );
}
