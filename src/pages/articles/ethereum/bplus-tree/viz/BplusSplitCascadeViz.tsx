import BplusSceneShell from "./BplusSceneShell";

/**
 * 본문 대응: #updates 첫 문단 — leaf split이 parent로, parent split이 root로 전파되고
 * root가 나뉠 때만 모든 leaf 경로가 함께 한 단계 길어진다.
 * Leaf 용량 4는 본문의 예. internal page가 child를 최대 3개 가리킨다는 값과 나머지 leaf의 채움은 설명용 가정.
 */
const W = 360;
const H = 222;
const LEVEL_Y: readonly number[] = [14, 66, 118, 170];
const BOX_H = 18;
const LEAF_CELL = 7;
const LEAF_CAP = 4;
const NODE_CELL = 10;
const NODE_CAP = 3;
const LEAF_PITCH = 34.4;
const LEAF_W = LEAF_CELL * LEAF_CAP;

const GRAY = "#94a3b8";
const FILL = "#64748b";
const RED = "#b91c1c";
const BLUE = "#2563eb";
const INK = "#475569";

const leafX = (slot: number) => 10 + slot * LEAF_PITCH;
const leafCenter = (slot: number) => leafX(slot) + LEAF_W / 2;
const mean = (values: readonly number[]) => values.reduce<number>((sum, value) => sum + value, 0) / values.length;

interface LeafState {
  slot: number;
  fill: number;
  changed?: boolean;
}

interface NodeState {
  level: number;
  childXs: readonly number[];
  changed?: boolean;
}

const OTHER_LEAVES: readonly LeafState[] = [
  { slot: 2, fill: 3 },
  { slot: 3, fill: 3 },
  { slot: 4, fill: 2 },
  { slot: 5, fill: 3 },
  { slot: 6, fill: 3 },
  { slot: 7, fill: 2 },
  { slot: 8, fill: 3 },
  { slot: 9, fill: 2 },
];

const P2 = mean([4, 5, 6].map(leafCenter));
const P3 = mean([7, 8, 9].map(leafCenter));
const P1_FULL = mean([0, 2, 3].map(leafCenter));
const P1_OVER = mean([0, 1, 2, 3].map(leafCenter));
const P1A = mean([0, 1].map(leafCenter));
const P1B = mean([2, 3].map(leafCenter));
const R1 = mean([P1A, P1B]);
const R2 = mean([P2, P3]);

interface TreeState {
  leaves: readonly LeafState[];
  nodes: readonly NodeState[];
  pages: number;
}

const STATES: readonly TreeState[] = [
  {
    leaves: [{ slot: 0, fill: 5, changed: true }, ...OTHER_LEAVES],
    nodes: [
      { level: 2, childXs: [0, 2, 3].map(leafCenter) },
      { level: 2, childXs: [4, 5, 6].map(leafCenter) },
      { level: 2, childXs: [7, 8, 9].map(leafCenter) },
      { level: 1, childXs: [P1_FULL, P2, P3] },
    ],
    pages: 3,
  },
  {
    leaves: [{ slot: 0, fill: 2, changed: true }, { slot: 1, fill: 3, changed: true }, ...OTHER_LEAVES],
    nodes: [
      { level: 2, childXs: [0, 1, 2, 3].map(leafCenter), changed: true },
      { level: 2, childXs: [4, 5, 6].map(leafCenter) },
      { level: 2, childXs: [7, 8, 9].map(leafCenter) },
      { level: 1, childXs: [P1_OVER, P2, P3] },
    ],
    pages: 3,
  },
  {
    leaves: [{ slot: 0, fill: 2 }, { slot: 1, fill: 3 }, ...OTHER_LEAVES],
    nodes: [
      { level: 2, childXs: [0, 1].map(leafCenter), changed: true },
      { level: 2, childXs: [2, 3].map(leafCenter), changed: true },
      { level: 2, childXs: [4, 5, 6].map(leafCenter) },
      { level: 2, childXs: [7, 8, 9].map(leafCenter) },
      { level: 1, childXs: [P1A, P1B, P2, P3], changed: true },
    ],
    pages: 3,
  },
  {
    leaves: [{ slot: 0, fill: 2 }, { slot: 1, fill: 3 }, ...OTHER_LEAVES],
    nodes: [
      { level: 2, childXs: [0, 1].map(leafCenter) },
      { level: 2, childXs: [2, 3].map(leafCenter) },
      { level: 2, childXs: [4, 5, 6].map(leafCenter) },
      { level: 2, childXs: [7, 8, 9].map(leafCenter) },
      { level: 1, childXs: [P1A, P1B], changed: true },
      { level: 1, childXs: [P2, P3], changed: true },
      { level: 0, childXs: [R1, R2], changed: true },
    ],
    pages: 4,
  },
];

const SCENES = [
  {
    label: "leaf가 넘칩니다",
    summary: "leaf 용량 4 → 다섯 항목",
    note: "용량 4인 leaf [10,20,30,40]에 25가 들어가 다섯 항목이 됩니다(본문의 예). 빨간 칸이 용량을 넘은 자리입니다. 이 그림에서는 internal page가 child를 최대 3개까지 가리킨다고 가정합니다.",
  },
  {
    label: "leaf 분할 → parent가 넘침",
    summary: "parent의 child 3개 → 4개",
    note: "Leaf를 [10,20]과 [25,30,40]으로 나누고 parent에 새 right leaf의 경계 25와 downlink를 올립니다. Parent가 이미 child 3개로 가득 차 있었다면(가정) 이제 parent가 넘칩니다.",
  },
  {
    label: "parent 분할 → root가 넘침",
    summary: "root의 child 3개 → 4개",
    note: "Parent도 둘로 나뉘고 새 parent의 경계가 root로 올라갑니다. 여기까지는 어느 leaf의 깊이도 바뀌지 않았습니다. Root에서 leaf까지는 여전히 page 3장입니다.",
  },
  {
    label: "root 분할 → 새 root",
    summary: "모든 leaf 경로 3장 → 4장",
    note: "Root가 나뉘면 그 위에 새 root가 하나 생깁니다. 새 page가 맨 위에 붙으므로 모든 leaf의 경로가 함께 한 단계 길어지고, leaf는 계속 같은 깊이에 있습니다.",
  },
] as const;

function Leaf({ leaf }: { leaf: LeafState }) {
  const x = leafX(leaf.slot);
  const y = LEVEL_Y[3];
  const cells = Math.max(leaf.fill, LEAF_CAP);
  return (
    <g>
      {Array.from({ length: cells }, (_, cell) => {
        const over = cell >= LEAF_CAP;
        const filled = cell < leaf.fill;
        return (
          <rect
            key={cell}
            x={x + cell * LEAF_CELL}
            y={y}
            width={LEAF_CELL - 1}
            height={BOX_H}
            fill={over ? RED : filled ? (leaf.changed ? BLUE : FILL) : "none"}
            stroke={over ? RED : GRAY}
            strokeWidth={1}
          />
        );
      })}
    </g>
  );
}

function Node({ node }: { node: NodeState }) {
  const count = node.childXs.length;
  const cells = Math.max(count, NODE_CAP);
  const center = mean(node.childXs);
  const width = cells * NODE_CELL;
  const x = center - width / 2;
  const y = LEVEL_Y[node.level];
  const childTop = LEVEL_Y[node.level + 1];
  return (
    <g>
      {node.childXs.map((childX) => (
        <line key={childX} x1={center} y1={y + BOX_H} x2={childX} y2={childTop} stroke={GRAY} strokeWidth={1} />
      ))}
      {Array.from({ length: cells }, (_, cell) => {
        const over = cell >= NODE_CAP;
        const filled = cell < count;
        return (
          <rect
            key={cell}
            x={x + cell * NODE_CELL}
            y={y}
            width={NODE_CELL - 1}
            height={BOX_H}
            fill={over ? RED : filled ? (node.changed ? BLUE : FILL) : "none"}
            stroke={over ? RED : GRAY}
            strokeWidth={1}
          />
        );
      })}
    </g>
  );
}

export default function BplusSplitCascadeViz() {
  return (
    <BplusSceneShell
      eyebrow="분할의 전파"
      title="분할은 위로 올라가고, root가 나뉠 때만 높이가 늘어납니다"
      description="작은 칸 하나가 page 안의 자리 하나입니다. 채운 칸은 회색, 이번 장면에서 바뀐 page는 파란색, 용량을 넘은 자리는 빨간색입니다. 교과서적 모형이며 internal 용량 3은 설명용 가정입니다."
      ariaLabel="leaf 분할이 parent와 root로 전파되고 root 분할 때 모든 leaf 경로가 한 단계 길어지는 과정"
      scenes={SCENES}
      render={(active) => {
        const state = STATES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={8} y={LEVEL_Y[0] + 13} fontSize={12} fontWeight={700} fill={state.pages === 4 ? BLUE : INK}>
              root → leaf: page {state.pages}장
            </text>
            {state.nodes.map((node) => (
              <Node key={`${node.level}-${node.childXs.join("-")}`} node={node} />
            ))}
            {state.leaves.map((leaf) => (
              <Leaf key={leaf.slot} leaf={leaf} />
            ))}
            <line x1={8} x2={W - 8} y1={LEVEL_Y[3] + BOX_H + 8} y2={LEVEL_Y[3] + BOX_H + 8} stroke={GRAY} strokeWidth={1} strokeDasharray="3 3" />
            <text x={8} y={LEVEL_Y[3] + BOX_H + 24} fontSize={12} fill={INK}>모든 leaf가 같은 깊이</text>
          </svg>
        );
      }}
    />
  );
}
