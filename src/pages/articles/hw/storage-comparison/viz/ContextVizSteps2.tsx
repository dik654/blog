import { motion } from "framer-motion";
import { DataBox, ModuleBox } from "@/components/viz/boxes";
import { C } from "./ContextVizData";

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 7 },
  animate: { opacity: 1, y: 0 },
  transition: { delay },
});

export function StepSas() {
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
        SAS 다중 경로와 확장 구조
      </text>
      <motion.g {...reveal(0.08)}>
        <ModuleBox
          x={20}
          y={47}
          w={112}
          h={54}
          label="Host A"
          sub="initiator path A"
          color={C.sas}
        />
        <ModuleBox
          x={20}
          y={124}
          w={112}
          h={54}
          label="Host B"
          sub="initiator path B"
          color={C.info}
        />
      </motion.g>
      <motion.path
        d="M132 74 H182 V112 M132 151 H182 V112"
        fill="none"
        stroke={C.sas}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.22 }}
      />
      <motion.g {...reveal(0.3)}>
        <ModuleBox
          x={188}
          y={81}
          w={112}
          h={62}
          label="SAS expander"
          sub="fan-out · routing"
          color={C.sas}
        />
      </motion.g>
      <motion.path
        d="M300 112 H342 M342 112 V68 M342 112 V155"
        fill="none"
        stroke={C.sas}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.4 }}
      />
      <motion.g {...reveal(0.48)}>
        <ModuleBox
          x={348}
          y={42}
          w={112}
          h={54}
          label="dual-port drive"
          sub="target port A"
          color={C.sas}
        />
        <ModuleBox
          x={348}
          y={128}
          w={112}
          h={54}
          label="drive shelf"
          sub="many targets"
          color={C.ok}
        />
      </motion.g>
      <text
        x={240}
        y={196}
        textAnchor="middle"
        fontSize={9}
        fill="var(--muted-foreground)"
      >
        두 포트의 핵심은 합산 속도보다 경로 장애 격리
      </text>
    </g>
  );
}

export function StepNvme() {
  const cores = [
    { x: 18, label: "CPU 0", color: C.nvme },
    { x: 105, label: "CPU 1", color: C.info },
    { x: 192, label: "CPU 2", color: C.ok },
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
        NVMe Submission / Completion Queue
      </text>
      {cores.map((core, index) => (
        <motion.g key={core.label} {...reveal(0.08 + index * 0.11)}>
          <DataBox
            x={core.x}
            y={48}
            w={73}
            h={32}
            label={core.label}
            color={core.color}
          />
          <ModuleBox
            x={core.x}
            y={95}
            w={73}
            h={54}
            label="SQ · CQ"
            sub="queue pair"
            color={core.color}
          />
          <line
            x1={core.x + 36.5}
            y1={80}
            x2={core.x + 36.5}
            y2={94}
            stroke={core.color}
          />
        </motion.g>
      ))}
      <motion.path
        d="M54 150 V165 H326 M141 150 V165 M228 150 V165"
        fill="none"
        stroke={C.nvme}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.46 }}
      />
      <motion.g {...reveal(0.54)}>
        <ModuleBox
          x={326}
          y={88}
          w={136}
          h={76}
          label="NVMe controller"
          sub="DMA · namespace · media"
          color={C.nvme}
        />
      </motion.g>
      <text
        x={171}
        y={191}
        textAnchor="middle"
        fontSize={9}
        fill="var(--muted-foreground)"
      >
        큐 수·깊이·CPU affinity는 구현과 설정에 따라 달라짐
      </text>
    </g>
  );
}
