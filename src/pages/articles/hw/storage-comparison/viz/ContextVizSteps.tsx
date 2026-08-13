import { motion } from "framer-motion";
import {
  ActionBox,
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

export function StepRequirements() {
  const metrics = [
    { label: "지연시간", sub: "평균 · tail", color: C.nvme, progress: 0.78 },
    { label: "처리량", sub: "burst · steady", color: C.info, progress: 0.66 },
    {
      label: "용량",
      sub: "working set · growth",
      color: C.sata,
      progress: 0.88,
    },
    {
      label: "운영성",
      sub: "hot-plug · multipath",
      color: C.sas,
      progress: 0.57,
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
        워크로드와 운영 요구를 분해
      </text>
      {metrics.map((metric, index) => (
        <motion.g key={metric.label} {...reveal(0.08 + index * 0.1)}>
          <StatusBox
            x={18 + (index % 2) * 231}
            y={45 + Math.floor(index / 2) * 70}
            w={213}
            h={56}
            label={metric.label}
            sub={metric.sub}
            color={metric.color}
            progress={metric.progress}
          />
        </motion.g>
      ))}
      <text
        x={240}
        y={193}
        textAnchor="middle"
        fontSize={9}
        fill="var(--muted-foreground)"
      >
        하나의 장치보다 서비스 경로 전체의 목표를 먼저 정의
      </text>
    </g>
  );
}

export function StepStack() {
  const layers = [
    {
      y: 40,
      label: "Application I/O",
      sub: "block size · sync policy · queue depth",
      color: C.info,
    },
    {
      y: 77,
      label: "Command model",
      sub: "ATA/AHCI · SCSI · NVMe",
      color: C.nvme,
    },
    {
      y: 114,
      label: "Transport + topology",
      sub: "SATA · SAS · PCIe · fabric",
      color: C.sas,
    },
    {
      y: 151,
      label: "Device + media",
      sub: "form factor · controller · NAND/HDD",
      color: C.sata,
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
        스토리지 경로의 네 계층
      </text>
      {layers.map((layer, index) => (
        <motion.g key={layer.label} {...reveal(0.08 + index * 0.11)}>
          <ActionBox
            x={58}
            y={layer.y}
            w={364}
            h={30}
            label={layer.label}
            sub={layer.sub}
            color={layer.color}
          />
        </motion.g>
      ))}
    </g>
  );
}

export function StepSata() {
  const path = [
    { x: 20, label: "host I/O", sub: "filesystem", color: C.info },
    { x: 132, label: "AHCI", sub: "host controller", color: C.sata },
    { x: 244, label: "SATA link", sub: "6 Gb/s ceiling", color: C.sata },
    { x: 356, label: "device", sub: "HDD or SSD", color: C.ok },
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
        단순한 SATA 포인트 투 포인트 경로
      </text>
      {path.map((stage, index) => (
        <motion.g key={stage.label} {...reveal(0.08 + index * 0.12)}>
          <ModuleBox
            x={stage.x}
            y={61}
            w={104}
            h={58}
            label={stage.label}
            sub={stage.sub}
            color={stage.color}
          />
          {index < path.length - 1 && (
            <line
              x1={stage.x + 105}
              y1={90}
              x2={stage.x + 111}
              y2={90}
              stroke="var(--muted-foreground)"
            />
          )}
        </motion.g>
      ))}
      <DataBox
        x={91}
        y={151}
        w={298}
        h={32}
        label="NCQ · 최대 32 outstanding commands"
        color={C.sata}
      />
    </g>
  );
}
