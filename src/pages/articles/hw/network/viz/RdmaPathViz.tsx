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
    label: "socket path와 RDMA path는 control과 data movement가 다르다",
    body: "RDMA는 등록된 memory와 NIC DMA를 쓰지만 연결·queue·completion과 recovery logic은 애플리케이션에 남습니다.",
  },
  {
    label: "memory 등록은 DMA 가능한 주소와 권한을 고정한다",
    body: "pinning과 key 관리 비용이 있으므로 hot path마다 등록하지 않고 안전한 cache·lifetime 정책을 둡니다.",
  },
  {
    label: "work queue와 completion queue가 비동기 전송을 연결한다",
    body: "queue depth와 polling 전략은 throughput, CPU 사용과 tail latency의 교환을 만듭니다.",
  },
  {
    label: "RoCE v2는 ECN·PFC·sender control을 end-to-end로 맞춘다",
    body: "선택한 loss mode에 맞춰 host와 모든 switch hop의 traffic class·threshold·buffer와 counter를 검증합니다.",
  },
  {
    label: "GPUDirect path는 GPU·NIC의 PCIe topology까지 포함한다",
    body: "가까운 HCA affinity, root complex와 driver support를 확인하고 host-staged 경로와 collective로 비교합니다.",
  },
];

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 7 },
  animate: { opacity: 1, y: 0 },
  transition: { delay },
});

function Compare() {
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
        socket과 RDMA data path
      </text>
      <ModuleBox
        x={18}
        y={42}
        w={106}
        h={48}
        label="app buffer"
        sub="socket path"
        color={C.host}
      />
      <ActionBox
        x={154}
        y={42}
        w={116}
        h={48}
        label="kernel stack"
        sub="protocol · copy"
        color={C.neutral}
      />
      <ModuleBox
        x={300}
        y={42}
        w={106}
        h={48}
        label="NIC"
        sub="wire"
        color={C.fabric}
      />
      <motion.path
        d="M124 66 H154 M270 66 H300"
        fill="none"
        stroke={C.neutral}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ModuleBox
        x={18}
        y={128}
        w={106}
        h={48}
        label="registered mem"
        sub="RDMA path"
        color={C.good}
      />
      <ActionBox
        x={154}
        y={128}
        w={116}
        h={48}
        label="work queue"
        sub="post · complete"
        color={C.rdma}
      />
      <ModuleBox
        x={300}
        y={128}
        w={106}
        h={48}
        label="NIC DMA"
        sub="direct movement"
        color={C.fabric}
      />
      <motion.path
        d="M124 152 H154 M270 152 H300"
        fill="none"
        stroke={C.rdma}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <DataBox
        x={414}
        y={67}
        w={52}
        h={90}
        label="wire"
        sub="fabric"
        color={C.fabric}
      />
    </g>
  );
}

function Register() {
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
        memory registration lifecycle
      </text>
      <ModuleBox
        x={20}
        y={64}
        w={112}
        h={62}
        label="virtual memory"
        sub="buffer lifetime"
        color={C.host}
      />
      <motion.line
        x1={132}
        y1={95}
        x2={172}
        y2={95}
        stroke={C.host}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ActionBox
        x={178}
        y={57}
        w={124}
        h={76}
        label="pin + map"
        sub="lkey · rkey · access"
        color={C.rdma}
      />
      <motion.line
        x1={302}
        y1={95}
        x2={342}
        y2={95}
        stroke={C.rdma}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ModuleBox
        x={348}
        y={64}
        w={112}
        h={62}
        label="NIC DMA"
        sub="authorized region"
        color={C.good}
      />
      <AlertBox
        x={68}
        y={154}
        w={344}
        h={34}
        label="등록 비용·권한·해제 순서를 hot path 밖에서 관리"
        color={C.risk}
      />
    </g>
  );
}

function Queues() {
  const rows = [
    {
      y: 42,
      label: "send / receive queue",
      sub: "posted work requests",
      progress: 0.74,
      color: C.rdma,
    },
    {
      y: 95,
      label: "NIC execution",
      sub: "DMA + transport",
      progress: 0.62,
      color: C.fabric,
    },
    {
      y: 148,
      label: "completion queue",
      sub: "poll · event · error",
      progress: 0.86,
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
        비동기 queue pipeline
      </text>
      {rows.map((row, index) => (
        <motion.g key={row.label} {...reveal(0.08 + index * 0.13)}>
          <StatusBox x={52} w={376} h={48} {...row} />
        </motion.g>
      ))}
    </g>
  );
}

function Congestion() {
  const nodes = [
    { x: 16, label: "queue", sub: "mark threshold", color: C.fabric },
    { x: 132, label: "ECN", sub: "congestion mark", color: C.rdma },
    { x: 248, label: "CNP", sub: "receiver feedback", color: C.risk },
    { x: 364, label: "sender", sub: "rate control", color: C.good },
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
        RoCE v2 congestion feedback loop
      </text>
      {nodes.map((node, index) => (
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
          {index < nodes.length - 1 && (
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
        x={70}
        y={153}
        w={340}
        h={34}
        label="PFC를 쓰면 pause·buffer·deadlock counter도 관찰"
        color={C.risk}
      />
    </g>
  );
}

function GpuDirect() {
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
        GPU memory ↔ NIC DMA topology
      </text>
      <ModuleBox
        x={24}
        y={60}
        w={126}
        h={68}
        label="GPU memory"
        sub="registered CUDA buffer"
        color={C.host}
      />
      <motion.line
        x1={150}
        y1={94}
        x2={190}
        y2={94}
        stroke={C.host}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ActionBox
        x={196}
        y={55}
        w={112}
        h={78}
        label="PCIe path"
        sub="root · ACS · IOMMU"
        color={C.rdma}
      />
      <motion.line
        x1={308}
        y1={94}
        x2={348}
        y2={94}
        stroke={C.rdma}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ModuleBox
        x={354}
        y={60}
        w={102}
        h={68}
        label="HCA / NIC"
        sub="network DMA"
        color={C.good}
      />
      <DataBox
        x={70}
        y={156}
        w={340}
        h={30}
        label="GPU별 nearest NIC affinity와 fallback path 기록"
        color={C.fabric}
      />
    </g>
  );
}

const SCENES = [Compare, Register, Queues, Congestion, GpuDirect];

export default function RdmaPathViz() {
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
