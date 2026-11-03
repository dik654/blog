import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "Root bytes가 child CID를 담습니다",
    body: "Project root는 raw hello block과 src directory의 CID를 link로 담습니다. 화살표는 parent bytes 안의 link 방향입니다.",
  },
  {
    label: "lib.rs bytes를 바꾸면 leaf CID가 바뀝니다",
    body: "lib.rs v1을 v2로 고치면 leaf bytes의 digest가 달라져 C_lib1 대신 C_lib2가 생깁니다.",
  },
  {
    label: "바뀐 link가 ancestor CID까지 올라갑니다",
    body: "src bytes에 C_lib2가 들어가 C_src2가 되고, root bytes에 C_src2가 들어가 C_root2가 됩니다.",
  },
  {
    label: "안 바뀐 hello block은 그대로 재사용합니다",
    body: "Root가 새로 생겨도 raw hello CID는 같습니다. 구조적 공유가 version 간 deduplication을 가능하게 합니다.",
  },
] as const;

const COLORS = {
  root: "#4f46e5",
  directory: "#0284c7",
  leaf: "#059669",
  changed: "#dc2626",
  quiet: "#94a3b8",
};

function ArrowDefs() {
  return (
    <defs>
      <marker
        id="dag-arrow"
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

function Node({
  x,
  y,
  title,
  cid,
  color,
  dimmed,
}: {
  x: number;
  y: number;
  title: string;
  cid: string;
  color: string;
  dimmed?: boolean;
}) {
  return (
    <g opacity={dimmed ? 0.3 : 1}>
      <rect
        x={x}
        y={y}
        width="120"
        height="42"
        rx="7"
        fill={`${color}0d`}
        stroke={color}
      />
      <text
        x={x + 60}
        y={y + 17}
        textAnchor="middle"
        fontSize="9.5"
        fontWeight="700"
        fill={color}
      >
        {title}
      </text>
      <text
        x={x + 60}
        y={y + 32}
        textAnchor="middle"
        fontSize="8.5"
        fill={color}
      >
        {cid}
      </text>
    </g>
  );
}

function Edge({
  x1,
  y1,
  x2,
  y2,
  color,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth="1.2"
      markerEnd="url(#dag-arrow)"
    />
  );
}

export default function MerkleDAGViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const leafChanged = step >= 1;
        const ancestorsChanged = step >= 2;
        return (
          <svg
            viewBox="0 0 500 230"
            aria-label="lib.rs 변경이 project Merkle DAG root까지 전파되는 과정"
          >
            <ArrowDefs />

            <Edge
              x1={228}
              y1={62}
              x2={94}
              y2={88}
              color={step === 3 ? COLORS.leaf : COLORS.quiet}
            />
            <Edge
              x1={272}
              y1={62}
              x2={406}
              y2={88}
              color={ancestorsChanged ? COLORS.changed : COLORS.quiet}
            />
            <Edge
              x1={410}
              y1={142}
              x2={410}
              y2={160}
              color={leafChanged ? COLORS.changed : COLORS.quiet}
            />

            <Node
              x={190}
              y={14}
              title="project root"
              cid={ancestorsChanged ? "C_root2" : "C_root1"}
              color={ancestorsChanged ? COLORS.changed : COLORS.root}
            />
            <Node
              x={34}
              y={94}
              title="readme · raw “hello”"
              cid="bafk…4yeq · reused"
              color={COLORS.leaf}
              dimmed={step === 1 || step === 2}
            />
            <Node
              x={350}
              y={94}
              title="src directory"
              cid={ancestorsChanged ? "C_src2" : "C_src1"}
              color={ancestorsChanged ? COLORS.changed : COLORS.directory}
            />
            <Node
              x={350}
              y={166}
              title={leafChanged ? "lib.rs · bytes v2" : "lib.rs · bytes v1"}
              cid={leafChanged ? "C_lib2" : "C_lib1"}
              color={leafChanged ? COLORS.changed : COLORS.leaf}
            />

            <text
              x="250"
              y="223"
              textAnchor="middle"
              fontSize="8.5"
              fill="var(--muted-foreground)"
            >
              C_root·C_src·C_lib는 흐름을 읽기 위한 축약 이름입니다
            </text>
          </svg>
        );
      }}
    </StepViz>
  );
}
