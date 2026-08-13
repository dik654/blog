import { motion } from "framer-motion";
import StepViz from "@/components/ui/step-viz";
import {
  ActionBox,
  AlertBox,
  DataBox,
  ModuleBox,
  StatusBox,
} from "@/components/viz/boxes";
import { C } from "./ContextVizData";

const STEPS = [
  {
    label: "InfiniBand는 HCA·switch·subnet management의 표준 fabric이다",
    body: "host queue와 RDMA transport, routed fabric 운영을 함께 제공하며 GPU 외 HPC·storage traffic에도 사용됩니다.",
  },
  {
    label: "data rate 세대와 link width를 합쳐 port 구성을 읽는다",
    body: "NDR·XDR 같은 세대명만 보지 않고 1x·2x·4x width, cable·breakout과 endpoint 실제 rate를 확인합니다.",
  },
  {
    label: "노드 안의 NVLink·PCIe와 밖의 HCA path를 연결한다",
    body: "rank-to-GPU와 GPU-to-HCA affinity가 잘못되면 빠른 fabric 앞에서 PCIe·NUMA hop이 병목이 될 수 있습니다.",
  },
  {
    label: "collective마다 이동량과 동기화 패턴이 다르다",
    body: "all-reduce·all-gather·reduce-scatter를 실제 rank 수와 message size로 측정해 algorithm과 topology의 상호작용을 봅니다.",
  },
  {
    label: "Ethernet·RoCE·InfiniBand는 같은 acceptance test로 비교한다",
    body: "application 완료 시간, accelerator wait, congestion counter와 link 장애 뒤 회복을 같은 조건에서 기록합니다.",
  },
];

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 7 },
  animate: { opacity: 1, y: 0 },
  transition: { delay },
});

function Architecture() {
  const nodes = [
    { x: 16, label: "application", sub: "MPI · NCCL · storage", color: C.host },
    { x: 132, label: "HCA", sub: "queue · RDMA", color: C.rdma },
    { x: 248, label: "switches", sub: "fabric paths", color: C.fabric },
    { x: 364, label: "subnet mgr", sub: "discover · route", color: C.good },
  ];
  return (
    <g>
      <text
        x={240}
        y={23}
        textAnchor="middle"
        fontSize={12}
        fontWeight={700}
        fill="var(--foreground)"
      >
        InfiniBand fabric components
      </text>
      {nodes.map((node, index) => (
        <motion.g key={node.label} {...reveal(0.08 + index * 0.12)}>
          <ModuleBox
            x={node.x}
            y={65}
            w={100}
            h={58}
            label={node.label}
            sub={node.sub}
            color={node.color}
          />
        </motion.g>
      ))}
      <DataBox
        x={68}
        y={153}
        w={344}
        h={30}
        label="adapter·switch·management·media를 한 fabric으로 운영"
        color={C.good}
      />
    </g>
  );
}

function RateWidth() {
  return (
    <g>
      <text
        x={240}
        y={23}
        textAnchor="middle"
        fontSize={12}
        fontWeight={700}
        fill="var(--foreground)"
      >
        data rate × link width → port
      </text>
      <DataBox
        x={28}
        y={63}
        w={124}
        h={58}
        label="rate generation"
        sub="per-lane signaling"
        color={C.rdma}
      />
      <text
        x={174}
        y={98}
        textAnchor="middle"
        fontSize={14}
        fontWeight={700}
        fill="var(--muted-foreground)"
      >
        ×
      </text>
      <DataBox
        x={196}
        y={63}
        w={112}
        h={58}
        label="link width"
        sub="1x · 2x · 4x"
        color={C.fabric}
      />
      <text
        x={330}
        y={98}
        textAnchor="middle"
        fontSize={14}
        fontWeight={700}
        fill="var(--muted-foreground)"
      >
        =
      </text>
      <ModuleBox
        x={352}
        y={59}
        w={104}
        h={66}
        label="port rate"
        sub="encoding · FEC 포함"
        color={C.good}
      />
      <AlertBox
        x={70}
        y={154}
        w={340}
        h={34}
        label="단·양방향과 payload goodput 표기를 구분"
        color={C.risk}
      />
    </g>
  );
}

function Topology() {
  return (
    <g>
      <text
        x={240}
        y={23}
        textAnchor="middle"
        fontSize={12}
        fontWeight={700}
        fill="var(--foreground)"
      >
        GPU에서 remote rank까지
      </text>
      <ModuleBox
        x={18}
        y={64}
        w={104}
        h={62}
        label="GPU"
        sub="rank buffer"
        color={C.host}
      />
      <motion.line
        x1={122}
        y1={95}
        x2={152}
        y2={95}
        stroke={C.host}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ActionBox
        x={158}
        y={58}
        w={96}
        h={74}
        label="NVLink / PCIe"
        sub="local topology"
        color={C.rdma}
      />
      <motion.line
        x1={254}
        y1={95}
        x2={284}
        y2={95}
        stroke={C.rdma}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ModuleBox
        x={290}
        y={64}
        w={78}
        h={62}
        label="HCA"
        sub="affinity"
        color={C.fabric}
      />
      <motion.line
        x1={368}
        y1={95}
        x2={398}
        y2={95}
        stroke={C.fabric}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ModuleBox
        x={404}
        y={64}
        w={60}
        h={62}
        label="fabric"
        sub="remote"
        color={C.good}
      />
      <DataBox
        x={64}
        y={154}
        w={352}
        h={30}
        label="rank placement · NUMA · nearest HCA를 함께 고정"
        color={C.risk}
      />
    </g>
  );
}

function Collectives() {
  const rows = [
    {
      y: 42,
      label: "all-reduce",
      sub: "reduce + distribute",
      progress: 0.86,
      color: C.rdma,
    },
    {
      y: 95,
      label: "all-gather",
      sub: "collect every shard",
      progress: 0.72,
      color: C.fabric,
    },
    {
      y: 148,
      label: "reduce-scatter",
      sub: "reduce to shards",
      progress: 0.66,
      color: C.good,
    },
  ];
  return (
    <g>
      <text
        x={240}
        y={23}
        textAnchor="middle"
        fontSize={12}
        fontWeight={700}
        fill="var(--foreground)"
      >
        collective별 communication pattern
      </text>
      {rows.map((row, index) => (
        <motion.g key={row.label} {...reveal(0.08 + index * 0.13)}>
          <StatusBox x={52} w={376} h={48} {...row} />
        </motion.g>
      ))}
    </g>
  );
}

function Compare() {
  const flow = [
    { x: 16, label: "same ranks", sub: "placement fixed", color: C.host },
    { x: 132, label: "same data", sub: "size · dtype", color: C.rdma },
    { x: 248, label: "stress", sub: "load · failure", color: C.risk },
    { x: 364, label: "decide", sub: "time · ops", color: C.good },
  ];
  return (
    <g>
      <text
        x={240}
        y={23}
        textAnchor="middle"
        fontSize={12}
        fontWeight={700}
        fill="var(--foreground)"
      >
        fabric A/B acceptance
      </text>
      {flow.map((node, index) => (
        <motion.g key={node.label} {...reveal(0.08 + index * 0.12)}>
          <ActionBox
            x={node.x}
            y={65}
            w={100}
            h={58}
            label={node.label}
            sub={node.sub}
            color={node.color}
          />
          {index < flow.length - 1 && (
            <line
              x1={node.x + 101}
              y1={94}
              x2={node.x + 115}
              y2={94}
              stroke="var(--muted-foreground)"
            />
          )}
        </motion.g>
      ))}
      <AlertBox
        x={76}
        y={153}
        w={328}
        h={34}
        label="최고 pair bandwidth가 아닌 종단 완료 시간으로 선택"
        color={C.risk}
      />
    </g>
  );
}

const SCENES = [Architecture, RateWidth, Topology, Collectives, Compare];

export default function CollectiveFabricViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const Scene = SCENES[step];
        return (
          <svg
            viewBox="0 0 480 200"
            className="w-full max-w-3xl"
            style={{ height: "auto" }}
          >
            <Scene />
          </svg>
        );
      }}
    </StepViz>
  );
}
