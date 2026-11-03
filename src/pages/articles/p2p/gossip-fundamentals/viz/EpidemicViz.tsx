import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "P0만 message m42를 알고 있습니다",
    body: "여덟 node 중 publisher P0만 topic=blocks의 m42를 알고 있습니다. 이 장면은 fanout 2를 쓴 한 번의 표본입니다.",
  },
  {
    label: "P0가 무작위 두 peer에게 push합니다",
    body: "이 표본에서는 P1과 P2가 받았습니다. 다음 실행에서는 다른 peer가 선택되거나 packet이 손실될 수 있습니다.",
  },
  {
    label: "새로 안 peer도 push하고 중복이 생깁니다",
    body: "P1과 P2가 각각 두 peer를 고릅니다. P4가 두 번 선택돼 duplicate가 생기므로 message ID dedup이 필요합니다.",
  },
  {
    label: "여러 경로가 남은 peer까지 닿습니다",
    body: "이 표본은 P7까지 도달했지만 매 round 정확히 두 배가 되거나 모든 node에 도달한다는 보장은 아닙니다. Partition 안의 node는 계속 못 받습니다.",
  },
] as const;

const NODES = [
  { id: "P0", x: 34, y: 92 },
  { id: "P1", x: 142, y: 47 },
  { id: "P2", x: 142, y: 137 },
  { id: "P3", x: 265, y: 24 },
  { id: "P4", x: 265, y: 72 },
  { id: "P5", x: 265, y: 126 },
  { id: "P6", x: 402, y: 49 },
  { id: "P7", x: 402, y: 119 },
] as const;

const EDGES: readonly {
  from: number;
  to: number;
  round: number;
  duplicate?: boolean;
}[] = [
  { from: 0, to: 1, round: 1 },
  { from: 0, to: 2, round: 1 },
  { from: 1, to: 3, round: 2 },
  { from: 1, to: 4, round: 2 },
  { from: 2, to: 4, round: 2, duplicate: true },
  { from: 2, to: 5, round: 2 },
  { from: 3, to: 6, round: 3 },
  { from: 4, to: 6, round: 3, duplicate: true },
  { from: 5, to: 7, round: 3 },
];

const INFORMED = [
  new Set([0]),
  new Set([0, 1, 2]),
  new Set([0, 1, 2, 3, 4, 5]),
  new Set([0, 1, 2, 3, 4, 5, 6, 7]),
] as const;

const COLORS = {
  informed: "#4f46e5",
  duplicate: "#d97706",
  quiet: "#94a3b8",
};

function ArrowDefs() {
  return (
    <defs>
      <marker
        id="epidemic-arrow"
        viewBox="0 0 8 8"
        markerWidth="8"
        markerHeight="8"
        refX="6"
        refY="4"
        orient="auto"
        markerUnits="userSpaceOnUse"
      >
        <path d="M0 0 L8 4 L0 8 Z" fill="context-stroke" />
      </marker>
    </defs>
  );
}

function clippedEdge(from: (typeof NODES)[number], to: (typeof NODES)[number]) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  const ux = dx / length;
  const uy = dy / length;
  return {
    x1: from.x + ux * 17,
    y1: from.y + uy * 17,
    x2: to.x - ux * 23,
    y2: to.y - uy * 23,
  };
}

export default function EpidemicViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg
          viewBox="0 0 450 175"
          aria-label="여덟 node에서 message m42가 퍼지는 한 번의 표본"
        >
          <ArrowDefs />

          {EDGES.filter((edge) => edge.round <= step).map((edge) => {
            const line = clippedEdge(NODES[edge.from], NODES[edge.to]);
            const color = edge.duplicate ? COLORS.duplicate : COLORS.informed;
            return (
              <g key={`${edge.from}-${edge.to}-${edge.round}`}>
                <line
                  {...line}
                  stroke={color}
                  strokeWidth="1.2"
                  strokeDasharray={edge.duplicate ? "4 3" : undefined}
                  markerEnd="url(#epidemic-arrow)"
                />
                {edge.duplicate && (
                  <text
                    x={(line.x1 + line.x2) / 2}
                    y={(line.y1 + line.y2) / 2 - 5}
                    textAnchor="middle"
                    fontSize="8.5"
                    fontWeight="700"
                    fill={COLORS.duplicate}
                  >
                    duplicate
                  </text>
                )}
              </g>
            );
          })}

          {NODES.map((node, index) => {
            const informed = INFORMED[step].has(index);
            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="16"
                  fill={informed ? `${COLORS.informed}14` : `${COLORS.quiet}0d`}
                  stroke={informed ? COLORS.informed : COLORS.quiet}
                />
                <text
                  x={node.x}
                  y={node.y + 3.5}
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight="700"
                  fill={informed ? COLORS.informed : COLORS.quiet}
                >
                  {node.id}
                </text>
              </g>
            );
          })}

          <rect
            x="145"
            y="151"
            width="160"
            height="20"
            rx="5"
            fill={`${COLORS.informed}08`}
            stroke={COLORS.informed}
          />
          <text
            x="225"
            y="164.5"
            textAnchor="middle"
            fontSize="9"
            fill={COLORS.informed}
          >
            이 표본의 informed: {INFORMED[step].size}/8
          </text>
        </svg>
      )}
    </StepViz>
  );
}
