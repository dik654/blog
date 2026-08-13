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
    label: "Ethernet link는 MAC·lane·PHY·FEC·media의 계약이다",
    body: "port speed와 cage 모양만 맞추지 않고 NIC·switch·module·cable 양 끝의 전체 조합을 확인합니다.",
  },
  {
    label: "breakout은 물리 port 하나를 독립 lane group으로 나눈다",
    body: "switch ASIC의 port group, cable fanout과 endpoint speed가 같은 lane mapping을 지원해야 합니다.",
  },
  {
    label: "leaf-spine은 여러 equal-cost path로 east-west traffic을 분산한다",
    body: "ECMP hash와 traffic matrix가 path를 고르게 쓰는지, 한 uplink 손실 뒤 oversubscription이 얼마나 늘어나는지 봅니다.",
  },
  {
    label: "media는 거리뿐 아니라 전력·서비스·qualification의 선택이다",
    body: "DAC·AOC·pluggable optic마다 reach, bend, 교체 단위와 supported FEC·fiber·polarity가 다릅니다.",
  },
  {
    label: "FEC·CRC·drop·queue counter를 application tail과 맞춘다",
    body: "link가 up이어도 corrected error와 queue가 증가할 수 있으므로 기준선과 p99 변화를 같은 시간축에서 비교합니다.",
  },
];

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 7 },
  animate: { opacity: 1, y: 0 },
  transition: { delay },
});

function Contract() {
  const nodes = [
    { x: 16, label: "MAC rate", sub: "port speed", color: C.host },
    { x: 132, label: "lane · PHY", sub: "encoding · FEC", color: C.rdma },
    { x: 248, label: "module", sub: "electrical · optic", color: C.fabric },
    { x: 364, label: "media", sub: "copper · fiber", color: C.good },
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
        Ethernet link compatibility chain
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
      <DataBox
        x={74}
        y={153}
        w={332}
        h={30}
        label="양 끝의 supported combination이 모두 일치해야 함"
        color={C.risk}
      />
    </g>
  );
}

function Breakout() {
  const ys = [42, 82, 122, 162];
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
        한 port의 lane group fanout
      </text>
      <ModuleBox
        x={24}
        y={70}
        w={132}
        h={68}
        label="switch port"
        sub="multiple electrical lanes"
        color={C.host}
      />
      <motion.path
        d="M156 104 H210 M210 104 V66 M210 104 V106 M210 104 V146 M210 104 V186"
        fill="none"
        stroke={C.fabric}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      {ys.map((y, index) => (
        <motion.g key={y} {...reveal(0.08 + index * 0.1)}>
          <DataBox
            x={224}
            y={y}
            w={224}
            h={28}
            label={`endpoint lane group ${index + 1}`}
            color={index === 3 ? C.good : C.fabric}
          />
        </motion.g>
      ))}
    </g>
  );
}

function LeafSpine() {
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
        leaf-spine equal-cost paths
      </text>
      <ModuleBox
        x={74}
        y={38}
        w={120}
        h={48}
        label="Spine A"
        sub="ECMP path"
        color={C.fabric}
      />
      <ModuleBox
        x={286}
        y={38}
        w={120}
        h={48}
        label="Spine B"
        sub="ECMP path"
        color={C.fabric}
      />
      <ModuleBox
        x={74}
        y={128}
        w={120}
        h={48}
        label="Leaf 1"
        sub="host-facing"
        color={C.host}
      />
      <ModuleBox
        x={286}
        y={128}
        w={120}
        h={48}
        label="Leaf 2"
        sub="host-facing"
        color={C.host}
      />
      <motion.path
        d="M134 128 V86 M134 128 L346 86 M346 128 L134 86 M346 128 V86"
        fill="none"
        stroke={C.good}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <AlertBox
        x={181}
        y={92}
        w={118}
        h={28}
        label="hash + traffic matrix"
        color={C.risk}
      />
    </g>
  );
}

function Media() {
  const items = [
    { x: 16, label: "DAC", sub: "short copper", color: C.host },
    { x: 132, label: "AOC", sub: "fixed optical", color: C.rdma },
    { x: 248, label: "optics", sub: "module + fiber", color: C.fabric },
    { x: 364, label: "qualify", sub: "reach · FEC · OS", color: C.good },
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
        media 선택과 qualification
      </text>
      {items.map((item, index) => (
        <motion.g key={item.label} {...reveal(0.08 + index * 0.12)}>
          <ActionBox
            x={item.x}
            y={65}
            w={100}
            h={58}
            label={item.label}
            sub={item.sub}
            color={item.color}
          />
        </motion.g>
      ))}
      <DataBox
        x={66}
        y={153}
        w={348}
        h={30}
        label="cage가 같아도 speed·wavelength·fiber는 다를 수 있음"
        color={C.risk}
      />
    </g>
  );
}

function Counters() {
  const rows = [
    {
      y: 42,
      label: "physical",
      sub: "FEC · CRC · optical power",
      progress: 0.4,
      color: C.fabric,
    },
    {
      y: 95,
      label: "fabric",
      sub: "drop · queue · ECN · flap",
      progress: 0.66,
      color: C.rdma,
    },
    {
      y: 148,
      label: "application",
      sub: "goodput · completion p99",
      progress: 0.78,
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
        계층을 잇는 운영 telemetry
      </text>
      {rows.map((row, index) => (
        <motion.g key={row.label} {...reveal(0.08 + index * 0.13)}>
          <StatusBox x={52} w={376} h={48} {...row} />
        </motion.g>
      ))}
    </g>
  );
}

const SCENES = [Contract, Breakout, LeafSpine, Media, Counters];

export default function EthernetFabricViz() {
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
