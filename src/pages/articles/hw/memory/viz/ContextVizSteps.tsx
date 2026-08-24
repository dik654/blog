import { motion } from "framer-motion";
import { DataBox, ModuleBox, StatusBox } from "@/components/viz/boxes";
import { C } from "./ContextVizData";

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 7 },
  animate: { opacity: 1, y: 0 },
  transition: { delay },
});

export function StepRequirements() {
  const metrics = [
    {
      label: "용량",
      sub: "working set + headroom",
      color: C.ddr5,
      progress: 0.82,
    },
    {
      label: "대역폭",
      sub: "cores × data rate",
      color: C.info,
      progress: 0.72,
    },
    {
      label: "지연시간",
      sub: "local · NUMA · tail",
      color: C.warn,
      progress: 0.46,
    },
    {
      label: "오류 정책",
      sub: "detect · correct · retire",
      color: C.ecc,
      progress: 0.64,
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
        메모리 요구량 네 축
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
        제품명보다 workload와 실패 비용을 먼저 수치화
      </text>
    </g>
  );
}

export function StepBandwidth() {
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
        이론 메모리 대역폭 구성 요소
      </text>
      <DataBox
        x={20}
        y={62}
        w={112}
        h={52}
        label="data rate"
        sub="MT/s"
        color={C.ddr5}
      />
      <text
        x={147}
        y={94}
        textAnchor="middle"
        fontSize={14}
        fontWeight={700}
        fill="var(--muted-foreground)"
      >
        ×
      </text>
      <DataBox
        x={162}
        y={62}
        w={112}
        h={52}
        label="bus width"
        sub="bytes / transfer"
        color={C.info}
      />
      <text
        x={289}
        y={94}
        textAnchor="middle"
        fontSize={14}
        fontWeight={700}
        fill="var(--muted-foreground)"
      >
        ×
      </text>
      <DataBox
        x={304}
        y={62}
        w={156}
        h={52}
        label="active channels"
        sub="고르게 채운 채널"
        color={C.ecc}
      />
      <motion.path
        d="M94 133 H386"
        stroke={C.ecc}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <DataBox
        x={74}
        y={153}
        w={332}
        h={30}
        label="실효값 = 이론값 × workload 이용률"
        color={C.warn}
      />
    </g>
  );
}

export function StepPopulation() {
  const channels = [34, 104, 174, 244, 314, 384];
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
        채널을 먼저 채우는 1DPC 예시
      </text>
      {channels.map((x, index) => (
        <motion.g key={x} {...reveal(0.08 + index * 0.08)}>
          <ModuleBox
            x={x}
            y={54}
            w={62}
            h={58}
            label={`CH${index}`}
            sub="1 DIMM"
            color={C.ddr5}
          />
          <line x1={x + 31} y1={112} x2={x + 31} y2={139} stroke={C.ddr5} />
        </motion.g>
      ))}
      <ModuleBox
        x={75}
        y={142}
        w={330}
        h={42}
        label="Memory controller"
        sub="interleave across populated channels"
        color={C.info}
      />
      <text
        x={240}
        y={197}
        textAnchor="middle"
        fontSize={9}
        fill="var(--muted-foreground)"
      >
        2DPC는 용량을 늘리지만 허용 속도·timing이 달라질 수 있음
      </text>
    </g>
  );
}
