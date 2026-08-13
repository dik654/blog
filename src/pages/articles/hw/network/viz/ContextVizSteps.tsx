import { motion } from "framer-motion";
import {
  ActionBox,
  AlertBox,
  DataBox,
  ModuleBox,
  StatusBox,
} from "@/components/viz/boxes";
import { C } from "./ContextVizData";

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 7 },
  animate: { opacity: 1, y: 0 },
  transition: { delay },
});

export function StepTraffic() {
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
        workload traffic matrix
      </text>
      <ModuleBox
        x={20}
        y={54}
        w={112}
        h={54}
        label="Node A"
        sub="source"
        color={C.host}
      />
      <ModuleBox
        x={20}
        y={130}
        w={112}
        h={54}
        label="Node B"
        sub="source"
        color={C.host}
      />
      <motion.path
        d="M132 81 C202 81 208 61 274 61 M132 157 C202 157 208 137 274 137 M132 81 C203 81 210 137 274 137"
        fill="none"
        stroke={C.fabric}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ModuleBox
        x={280}
        y={34}
        w={112}
        h={54}
        label="Storage"
        sub="bulk read/write"
        color={C.fabric}
      />
      <ModuleBox
        x={280}
        y={110}
        w={112}
        h={54}
        label="Workers"
        sub="fan-in · all-to-all"
        color={C.rdma}
      />
      <DataBox
        x={334}
        y={171}
        w={126}
        h={22}
        label="bytes · flows · time"
        color={C.good}
      />
    </g>
  );
}

export function StepGoodput() {
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
        line rate에서 application 완료까지
      </text>
      <ModuleBox
        x={20}
        y={64}
        w={112}
        h={62}
        label="line rate"
        sub="PHY bits / second"
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
        label="data path"
        sub="headers · queue · retry"
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
        label="goodput"
        sub="payload / completion"
        color={C.good}
      />
      <AlertBox
        x={72}
        y={154}
        w={336}
        h={34}
        label="p50만큼 p99와 CPU·GPU wait가 중요"
        color={C.risk}
      />
    </g>
  );
}

export function StepFabric() {
  const rows = [
    {
      y: 42,
      label: "host-facing capacity",
      sub: "NIC × active hosts",
      progress: 0.88,
      color: C.host,
    },
    {
      y: 95,
      label: "leaf uplinks",
      sub: "ECMP paths · oversubscription",
      progress: 0.66,
      color: C.fabric,
    },
    {
      y: 148,
      label: "failure state",
      sub: "one path removed",
      progress: 0.52,
      color: C.risk,
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
        fabric 계층별 usable capacity
      </text>
      {rows.map((row, index) => (
        <motion.g key={row.label} {...reveal(0.08 + index * 0.13)}>
          <StatusBox x={52} w={376} h={48} {...row} />
        </motion.g>
      ))}
    </g>
  );
}
