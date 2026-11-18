import SceneShell from "./SceneShell";

/**
 * 본문 대응: #finalization-pruning Prune — updateCheckpoints가 더 높은 finalized epoch를 반영하면 prune이
 * finalized root를 찾고(없으면 오류), 그 node를 새 tree root로 만든 뒤 checkpoint slot 이하의 양립하지 않는 child를 지운다.
 * 노드 이름·개수·가로 위치는 설명용 배치다(가정). 가로축은 slot 순서만 나타내며 눈금은 없다.
 */
type NodeId = "R" | "P" | "X" | "Y" | "F" | "C1" | "C2" | "C3" | "C4";
type NodeState = "kept" | "removing" | "gone" | "missing";

const POS: Record<NodeId, { x: number; y: number; label: string }> = {
  R: { x: 28, y: 96, label: "R" },
  P: { x: 94, y: 96, label: "P" },
  X: { x: 94, y: 158, label: "X" },
  Y: { x: 162, y: 158, label: "Y" },
  F: { x: 162, y: 96, label: "F" },
  C1: { x: 214, y: 36, label: "C1" },
  C2: { x: 292, y: 96, label: "C2" },
  C3: { x: 368, y: 96, label: "C3" },
  C4: { x: 368, y: 158, label: "C4" },
};

const EDGES: readonly (readonly [NodeId, NodeId])[] = [
  ["R", "P"],
  ["R", "X"],
  ["P", "F"],
  ["P", "Y"],
  ["F", "C1"],
  ["F", "C2"],
  ["C2", "C3"],
  ["C2", "C4"],
];

const CHECKPOINT_X = 248;
const ABOVE: readonly NodeId[] = ["R", "P", "X", "Y"];

interface PruneScene {
  label: string;
  summary: string;
  note: string;
  states: Partial<Record<NodeId, NodeState>>;
  root: NodeId;
  focus: NodeId | null;
}

const SCENES: readonly PruneScene[] = [
  {
    label: "prune 전",
    summary: "store가 여러 후보를 유지",
    note: "Fork-choice store는 tree root R 아래 여러 후보 가지를 들고 있습니다. F는 새로 finalized된 epoch 10 checkpoint의 root입니다. 점선 세로줄은 그 checkpoint slot(finalized epoch의 첫 slot)이고, 노드 배치는 설명용입니다(가정).",
    states: {},
    root: "R",
    focus: null,
  },
  {
    label: "F를 못 찾으면",
    summary: "unknown-finalized-root 오류",
    note: "updateCheckpoints가 더 높은 finalized epoch를 반영하고 prune을 부르면, store는 먼저 finalized root를 찾습니다. 찾지 못하면 오류를 내고 tree는 그대로 둡니다.",
    states: { F: "missing" },
    root: "R",
    focus: "F",
  },
  {
    label: "F 위쪽 정리",
    summary: "F가 새 tree root",
    note: "F를 찾으면 기존 root R에서 F까지 내려오며 F의 후손이 아닌 node를 지우고, F를 새 tree root로 만듭니다. R, P와 F를 거치지 않는 가지 X, Y가 빠집니다.",
    states: { R: "removing", P: "removing", X: "removing", Y: "removing" },
    root: "F",
    focus: "F",
  },
  {
    label: "checkpoint slot 이하 child",
    summary: "C1 제거 · C2 유지",
    note: "F의 child 가운데 checkpoint slot 이하에 있는 C1은 finalized checkpoint와 양립하지 않는 child로 제거됩니다. Checkpoint slot 뒤의 C2는 남습니다.",
    states: { R: "gone", P: "gone", X: "gone", Y: "gone", C1: "removing" },
    root: "F",
    focus: "C1",
  },
  {
    label: "남는 것",
    summary: "F 아래 후보 tree",
    note: "남은 tree에서도 C3와 C4처럼 후보가 여럿일 수 있어 head는 fork choice에 따라 계속 바뀔 수 있습니다. 여기서 지운 것은 fork-choice 후보와 그 파생 index이며, block archive와 historical state 보관은 다른 owner가 결정합니다.",
    states: { R: "gone", P: "gone", X: "gone", Y: "gone", C1: "gone" },
    root: "F",
    focus: null,
  },
];

const ACCENT = "#2563eb";
const MUTED = "#64748b";
const LINE = "#94a3b8";
const BAD = "#dc2626";

function stateOf(scene: PruneScene, id: NodeId): NodeState {
  return scene.states[id] ?? "kept";
}

export default function ForkchoicePruneViz() {
  return (
    <SceneShell
      eyebrow="Fork-choice prune"
      title="Finalized root를 새 tree root로 올리고 양립하지 않는 후보를 지웁니다"
      description="원 하나가 fork-choice store의 block node이고 왼쪽에서 오른쪽으로 slot 순서입니다. 빨간 점선은 이번 단계에서 지우는 node, 바깥 원이 하나 더 둘린 node가 현재 tree root입니다. 이름과 배치는 설명용입니다(가정)."
      ariaLabel="finalized root F를 찾아 tree root로 만들고 충돌 후보를 제거하는 다섯 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const visible = (id: NodeId) => stateOf(scene, id) !== "gone";
        return (
          <svg viewBox="0 0 400 222" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={CHECKPOINT_X} x2={CHECKPOINT_X} y1={10} y2={210} stroke={ACCENT} strokeWidth={1} strokeDasharray="4 4" />
            <text x={CHECKPOINT_X - 6} y={204} textAnchor="end" fontSize={12} fill={ACCENT}>
              epoch 10 checkpoint slot
            </text>
            <line x1={4} x2={396} y1={214} y2={214} stroke={LINE} strokeWidth={1} />
            <path d="M 396 214 l -6 -4 l 0 8 z" fill={LINE} />
            <text x={4} y={204} fontSize={12} fill={MUTED}>
              slot 순서 →
            </text>
            {EDGES.filter(([a, b]) => visible(a) && visible(b)).map(([a, b]) => {
              const removing = stateOf(scene, a) === "removing" || stateOf(scene, b) === "removing";
              return (
                <line
                  key={`${a}-${b}`}
                  x1={POS[a].x}
                  y1={POS[a].y}
                  x2={POS[b].x}
                  y2={POS[b].y}
                  stroke={removing ? BAD : LINE}
                  strokeWidth={1}
                  strokeDasharray={removing ? "4 3" : undefined}
                />
              );
            })}
            {(Object.keys(POS) as NodeId[]).filter(visible).map((id) => {
              const state = stateOf(scene, id);
              const isRoot = scene.root === id;
              const isFinal = id === "F";
              const stroke = state === "removing" ? BAD : state === "missing" ? MUTED : isFinal ? ACCENT : LINE;
              return (
                <g key={id}>
                  <circle
                    cx={POS[id].x}
                    cy={POS[id].y}
                    r={18}
                    fill="#ffffff"
                    fillOpacity={state === "missing" ? 0 : 1}
                    stroke={stroke}
                    strokeWidth={isRoot ? 1.25 : 1}
                    strokeDasharray={state === "removing" || state === "missing" ? "4 3" : undefined}
                  />
                  {isRoot && <circle cx={POS[id].x} cy={POS[id].y} r={22} fill="none" stroke={stroke} strokeWidth={1} />}
                  <text x={POS[id].x} y={POS[id].y + 4} textAnchor="middle" fontSize={14} fontWeight={700} fill={state === "removing" ? BAD : isFinal ? ACCENT : "#334155"}>
                    {POS[id].label}
                  </text>
                </g>
              );
            })}
            {active === 1 && (
              <text x={POS.F.x} y={POS.F.y - 24} textAnchor="middle" fontSize={12} fontWeight={700} fill={BAD}>
                store에 없음 → 오류
              </text>
            )}
            {active >= 2 && (
              <text x={POS.F.x} y={POS.F.y + 38} textAnchor="middle" fontSize={12} fontWeight={700} fill={ACCENT}>
                새 tree root
              </text>
            )}
            {active === 0 && (
              <text x={6} y={POS.R.y - 30} fontSize={12} fill={MUTED}>
                tree root
              </text>
            )}
            {active === 2 &&
              ABOVE.map((id) => (
                <text key={`x-${id}`} x={POS[id].x + 14} y={POS[id].y - 15} fontSize={14} fontWeight={700} fill={BAD}>
                  ×
                </text>
              ))}
            {active === 3 && (
              <text x={POS.C1.x + 24} y={POS.C1.y + 5} fontSize={14} fontWeight={700} fill={BAD}>
                ×
              </text>
            )}
          </svg>
        );
      }}
    />
  );
}
