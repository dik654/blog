import { motion } from "framer-motion";
import {
  ActionBox,
  AlertBox,
  DataBox,
  ModuleBox,
} from "@/components/viz/boxes";
import { C } from "./ContextVizData";

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 7 },
  animate: { opacity: 1, y: 0 },
  transition: { delay },
});

export function StepRdma() {
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
        RDMA control path와 data path
      </text>
      <ModuleBox
        x={20}
        y={43}
        w={122}
        h={54}
        label="application"
        sub="register · post work"
        color={C.host}
      />
      <ModuleBox
        x={20}
        y={123}
        w={122}
        h={54}
        label="completion"
        sub="poll · event · recover"
        color={C.risk}
      />
      <motion.path
        d="M142 70 H185 M142 150 H185"
        fill="none"
        stroke={C.neutral}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ActionBox
        x={191}
        y={76}
        w={112}
        h={64}
        label="NIC queues"
        sub="DMA engine"
        color={C.rdma}
      />
      <motion.line
        x1={303}
        y1={108}
        x2={344}
        y2={108}
        stroke={C.rdma}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ModuleBox
        x={350}
        y={76}
        w={110}
        h={64}
        label="registered memory"
        sub="remote endpoint"
        color={C.good}
      />
      <DataBox
        x={94}
        y={180}
        w={292}
        h={16}
        label="payload DMA는 줄어도 setup·completion·recovery는 남음"
        color={C.fabric}
      />
    </g>
  );
}

export function StepValidate() {
  const flow = [
    { x: 16, label: "pair test", sub: "size · depth", color: C.host },
    { x: 132, label: "contention", sub: "incast · all-to-all", color: C.rdma },
    { x: 248, label: "failure", sub: "drop · reroute", color: C.risk },
    { x: 364, label: "application", sub: "goodput · p99", color: C.good },
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
        fabric acceptance sequence
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
        x={74}
        y={153}
        w={332}
        h={34}
        label="link rate 표가 아니라 재현 가능한 결과로 승인"
        color={C.risk}
      />
    </g>
  );
}
