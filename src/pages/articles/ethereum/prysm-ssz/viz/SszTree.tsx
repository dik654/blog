import { TREE_NAMES, TREE_VALUES, type NodeTone, type TreeNodeId } from "./sszTreeData";

/** DemoRecord의 container tree(gindex 1–7)와 validators list subtree를 같은 좌표에 그립니다. */

const W = 340;
const H = 236;
const H_NO_LIST = 166;
const BOX_W = 72;
const BOX_H = 36;

const POS: Readonly<Record<TreeNodeId, { x: number; y: number }>> = {
  "1": { x: 170, y: 22 },
  "2": { x: 90, y: 82 },
  "3": { x: 250, y: 82 },
  "4": { x: 46, y: 142 },
  "5": { x: 134, y: 142 },
  "6": { x: 210, y: 142 },
  "7": { x: 294, y: 142 },
  cv: { x: 96, y: 206 },
  len: { x: 176, y: 206 },
};

const EDGES: readonly (readonly [TreeNodeId, TreeNodeId])[] = [
  ["1", "2"],
  ["1", "3"],
  ["2", "4"],
  ["2", "5"],
  ["3", "6"],
  ["3", "7"],
];

const LIST_EDGES: readonly (readonly [TreeNodeId, TreeNodeId])[] = [
  ["5", "cv"],
  ["5", "len"],
];

const TONE: Readonly<Record<NodeTone, { stroke: string; text: string; dash?: string; opacity: number }>> = {
  base: { stroke: "#94a3b8", text: "#64748b", opacity: 1 },
  active: { stroke: "#2563eb", text: "#2563eb", opacity: 1 },
  sibling: { stroke: "#d97706", text: "#b45309", opacity: 1 },
  target: { stroke: "#16a34a", text: "#15803d", opacity: 1 },
  missing: { stroke: "#dc2626", text: "#dc2626", dash: "3 3", opacity: 1 },
  dim: { stroke: "#94a3b8", text: "#94a3b8", opacity: 0.4 },
};

export default function SszTree({
  tones,
  values,
  showList,
  pathEdges = [],
  ariaLabel,
}: {
  tones: Partial<Record<TreeNodeId, NodeTone>>;
  values?: Partial<Record<TreeNodeId, string>>;
  showList: boolean;
  pathEdges?: readonly (readonly [TreeNodeId, TreeNodeId])[];
  ariaLabel: string;
}) {
  const ids = (Object.keys(POS) as TreeNodeId[]).filter((id) => showList || (id !== "cv" && id !== "len"));
  const edges = showList ? [...EDGES, ...LIST_EDGES] : EDGES;
  const onPath = (a: TreeNodeId, b: TreeNodeId) => pathEdges.some(([p, q]) => (p === a && q === b) || (p === b && q === a));

  return (
    <svg viewBox={`0 0 ${W} ${showList ? H : H_NO_LIST}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={ariaLabel}>
      {edges.map(([a, b]) => (
        <line
          key={`${a}-${b}`}
          x1={POS[a].x}
          y1={POS[a].y + BOX_H / 2}
          x2={POS[b].x}
          y2={POS[b].y - BOX_H / 2}
          stroke={onPath(a, b) ? "#2563eb" : "#cbd5e1"}
          strokeWidth={onPath(a, b) ? 1.25 : 1}
        />
      ))}
      {ids.map((id) => {
        const tone = TONE[tones[id] ?? "dim"];
        const isList = id === "cv" || id === "len";
        return (
          <g key={id} opacity={tone.opacity}>
            <rect
              x={POS[id].x - BOX_W / 2}
              y={POS[id].y - BOX_H / 2}
              width={BOX_W}
              height={BOX_H}
              rx={6}
              fill="none"
              stroke={tone.stroke}
              strokeWidth={tones[id] && tones[id] !== "base" && tones[id] !== "dim" ? 1.25 : 1}
              strokeDasharray={tone.dash}
            />
            <text x={POS[id].x} y={POS[id].y - 4} textAnchor="middle" fontSize={9} fill={tone.text}>
              {isList ? TREE_NAMES[id] : `${id} · ${TREE_NAMES[id]}`}
            </text>
            <text x={POS[id].x} y={POS[id].y + 10} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="ui-monospace, monospace" fill={tone.text}>
              {values?.[id] ?? TREE_VALUES[id]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
