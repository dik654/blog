import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #merkle-api — tree v1(leaf = 00‖u32be(len)‖data, inner = 01‖left‖right), c는 index 2=10₂.
 * 모든 digest는 Node.js crypto SHA-256으로 이 schema를 다시 계산한 값입니다.
 * H(c)=aa8d78cb… H(d)=dd761f8d… H(a,b)=c91d8084… H(c,d)=3d1f97dd… root=004b7b71…
 * 실패 동작 aside의 두 경우:
 *  - index 3(11₂)으로 읽으면 첫 level에서 c가 right → H(d,c)=c56650cc…, root=b27b6900…
 *  - child를 hash 크기순으로 정렬하면 level 0은 aa8d<dd76이라 그대로, level 1은 3d1f<c91d라 H(c,d)가 left → root=5a5af965…
 */
type Side = "L" | "R" | "";
type Role = "current" | "sibling" | "idle" | "fail" | "ok";

interface NodeView {
  label: string;
  value: string;
  role: Role;
  side: Side;
}

interface SceneData {
  label: string;
  summary: string;
  note: string;
  bits: string;
  nodes: { root: NodeView; ab: NodeView; cd: NodeView; a: NodeView; b: NodeView; c: NodeView; d: NodeView };
  lines: readonly [string, string];
}

const idle = (label: string, value = ""): NodeView => ({ label, value, role: "idle", side: "" });

const SCENES: readonly SceneData[] = [
  {
    label: "c는 index 2 = 10₂",
    summary: "leaf a·b·c·d = index 0·1·2·3",
    note: "왼쪽부터 index 0~3을 붙이면 c는 2, 이진수로 10₂입니다. 검증자는 c와 sibling 두 개, index만 받고 먼저 c를 leaf 입력으로 hash합니다.",
    bits: "10₂ · 아직 읽지 않음",
    nodes: {
      root: idle("root", "?"),
      ab: idle("H(a,b)"),
      cd: idle("H(c,d)"),
      a: idle("a · 0"),
      b: idle("b · 1"),
      c: { label: "c · 2", value: "aa8d78cb…", role: "current", side: "" },
      d: idle("d · 3"),
    },
    lines: ["leaf: 00‖00000001‖63 → aa8d78cb…", "level 1: 아직 계산 전"],
  },
  {
    label: "낮은 bit 0: c가 왼쪽",
    summary: "H(c,d) = 3d1f97dd…",
    note: "낮은 bit부터 읽습니다. 첫 bit가 0이라 current H(c)가 left, sibling H(d)가 right에 놓이고, prefix 01을 붙여 c·d subtree 값을 만듭니다.",
    bits: "10₂의 낮은 bit = 0 → current left",
    nodes: {
      root: idle("root", "?"),
      ab: idle("H(a,b)"),
      cd: { label: "H(c,d)", value: "3d1f97dd…", role: "current", side: "" },
      a: idle("a · 0"),
      b: idle("b · 1"),
      c: { label: "c · 2", value: "aa8d78cb…", role: "current", side: "L" },
      d: { label: "d · 3", value: "dd761f8d…", role: "sibling", side: "R" },
    },
    lines: ["level 0: 01‖aa8d78cb‖dd761f8d → 3d1f97dd…", "level 1: 아직 계산 전"],
  },
  {
    label: "다음 bit 1: c·d가 오른쪽",
    summary: "root 004b7b71… = expected",
    note: "다음 bit는 1이라 current인 c·d subtree가 right, sibling H(a,b)가 left입니다. 나온 root가 expected와 같아 검증이 통과합니다.",
    bits: "10₂의 다음 bit = 1 → current right",
    nodes: {
      root: { label: "root =", value: "004b7b71…", role: "ok", side: "" },
      ab: { label: "H(a,b)", value: "c91d8084…", role: "sibling", side: "L" },
      cd: { label: "H(c,d)", value: "3d1f97dd…", role: "current", side: "R" },
      a: idle("a · 0"),
      b: idle("b · 1"),
      c: { label: "c · 2", value: "aa8d78cb…", role: "current", side: "L" },
      d: { label: "d · 3", value: "dd761f8d…", role: "sibling", side: "R" },
    },
    lines: ["level 0: 01‖aa8d78cb‖dd761f8d → 3d1f97dd…", "level 1: 01‖c91d8084‖3d1f97dd → 004b7b71… = expected"],
  },
  {
    label: "index를 3(11₂)으로 잘못 주면",
    summary: "root b27b6900… ≠ expected",
    note: "같은 c·sibling이라도 index 3이면 첫 bit가 1이라 c가 right, H(d)가 left에 놓입니다. 첫 level 값부터 바뀌어 root가 달라지고 false로 끝납니다.",
    bits: "11₂의 낮은 bit = 1 → current right (다음 bit도 1)",
    nodes: {
      root: { label: "root ≠", value: "b27b6900…", role: "fail", side: "" },
      ab: { label: "H(a,b)", value: "c91d8084…", role: "sibling", side: "L" },
      cd: { label: "H(d,c)", value: "c56650cc…", role: "fail", side: "R" },
      a: idle("a · 0"),
      b: idle("b · 1"),
      c: { label: "c · 2", value: "aa8d78cb…", role: "current", side: "R" },
      d: { label: "d · 3", value: "dd761f8d…", role: "sibling", side: "L" },
    },
    lines: ["level 0: 01‖dd761f8d‖aa8d78cb → c56650cc…", "level 1: 01‖c91d8084‖c56650cc → b27b6900… ≠"],
  },
  {
    label: "child를 hash 크기순으로 정렬하면",
    summary: "root 5a5af965… ≠ expected",
    note: "Index bit 대신 작은 hash를 left에 두면, 첫 level은 aa8d…<dd76…라 우연히 같지만 다음 level에서 3d1f…<c91d…라 H(c,d)가 left로 가 ordered tree와 다른 root가 됩니다.",
    bits: "bit 무시 · 작은 hash가 left",
    nodes: {
      root: { label: "root ≠", value: "5a5af965…", role: "fail", side: "" },
      ab: { label: "H(a,b)", value: "c91d8084…", role: "sibling", side: "R" },
      cd: { label: "H(c,d)", value: "3d1f97dd…", role: "current", side: "L" },
      a: idle("a · 0"),
      b: idle("b · 1"),
      c: { label: "c · 2", value: "aa8d78cb…", role: "current", side: "L" },
      d: { label: "d · 3", value: "dd761f8d…", role: "sibling", side: "R" },
    },
    lines: ["level 0: 01‖aa8d78cb‖dd761f8d → 3d1f97dd…", "level 1: 01‖3d1f97dd‖c91d8084 → 5a5af965… ≠"],
  },
];

const STROKE: Record<Role, string> = {
  current: "#2563eb",
  sibling: "#d97706",
  idle: "#94a3b8",
  fail: "#dc2626",
  ok: "#16a34a",
};

const W = 380;
const NODE_W = 84;
const NODE_H = 38;
const POS = {
  root: [190, 8],
  ab: [100, 76],
  cd: [280, 76],
  a: [50, 144],
  b: [145, 144],
  c: [235, 144],
  d: [330, 144],
} as const;
type Key = keyof typeof POS;
const EDGES: readonly [Key, Key][] = [
  ["root", "ab"],
  ["root", "cd"],
  ["ab", "a"],
  ["ab", "b"],
  ["cd", "c"],
  ["cd", "d"],
];
const KEYS: readonly Key[] = ["root", "ab", "cd", "a", "b", "c", "d"];

function TreeNode({ k, view }: { k: Key; view: NodeView }) {
  const [cx, y] = POS[k];
  const color = STROKE[view.role];
  const muted = view.role === "idle";
  return (
    <g>
      <rect
        x={cx - NODE_W / 2}
        y={y}
        width={NODE_W}
        height={NODE_H}
        rx={6}
        fill={muted ? "none" : color}
        fillOpacity={muted ? 0 : 0.12}
        stroke={color}
        strokeWidth={muted ? 1 : 1.25}
      />
      <text x={cx} y={y + 15} textAnchor="middle" fontSize={13} fontWeight={700} fill={muted ? "#64748b" : color}>
        {view.label}
      </text>
      <text x={cx} y={y + 30} textAnchor="middle" fontSize={12} fontFamily="ui-monospace, monospace" fill="#64748b">
        {view.value}
      </text>
      {view.side && (
        <text x={cx + NODE_W / 2 - 7} y={y + 14} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>
          {view.side}
        </text>
      )}
    </g>
  );
}

export default function MerkleIndexTreeViz() {
  return (
    <SceneShell
      eyebrow="index bit와 좌우 자리"
      title="index 2의 bit 0·1이 c의 자리를 left, right 순으로 정합니다"
      description="설명용 tree v1의 네 leaf입니다. 파랑은 current, 주황은 sibling이고 L·R은 그 level의 hash 입력에서 놓인 자리입니다. 값은 이 글의 schema를 SHA-256으로 다시 계산한 앞 8자리입니다."
      note="마지막 두 장면은 본문 '실패 동작'의 wrong index와 크기순 정렬을 같은 c·sibling으로 계산한 예입니다."
      ariaLabel="네 leaf Merkle tree에서 index 2의 bit에 따라 c의 좌우 자리가 정해지고, 잘못된 index와 크기순 정렬은 다른 root를 만드는 다섯 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} 190`} className="mx-auto h-auto w-full max-w-[400px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {EDGES.map(([from, to]) => {
                const [fx, fy] = POS[from];
                const [tx, ty] = POS[to];
                return <line key={`${from}-${to}`} x1={fx} y1={fy + NODE_H} x2={tx} y2={ty} stroke="#94a3b8" strokeWidth={1} />;
              })}
              {KEYS.map((k) => (
                <TreeNode key={k} k={k} view={scene.nodes[k]} />
              ))}
            </svg>
            <StableSceneStack
              active={active}
              className="mt-3"
              scenes={SCENES.map((item) => (
                <div key={item.label} className="space-y-1 font-mono text-[11px] leading-5 sm:text-xs">
                  <p className="font-sans font-semibold text-primary">index 읽기: {item.bits}</p>
                  {item.lines.map((line) => (
                    <p key={line} className="break-all text-muted-foreground">
                      {line}
                    </p>
                  ))}
                </div>
              ))}
            />
          </div>
        );
      }}
    />
  );
}
