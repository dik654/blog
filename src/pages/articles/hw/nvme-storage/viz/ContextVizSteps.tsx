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

export function StepLayers() {
  const packages = [
    { x: 18, label: "M.2", sub: "내부 모듈", color: C.m2 },
    { x: 174, label: "U.2 / U.3", sub: "2.5-inch bay", color: C.u2 },
    { x: 330, label: "EDSFF", sub: "E1 · E3 family", color: C.e1s },
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
        같은 명령 · 다른 물리 패키지
      </text>
      <motion.g {...reveal(0.08)}>
        <DataBox
          x={82}
          y={40}
          w={316}
          h={30}
          label="Application → NVMe commands → PCIe transport"
          color={C.ok}
        />
      </motion.g>
      <motion.path
        d="M240 73 V94 M84 94 H396"
        fill="none"
        stroke={C.ok}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.2 }}
      />
      {packages.map((item, index) => (
        <motion.g key={item.label} {...reveal(0.3 + index * 0.12)}>
          <line
            x1={item.x + 66}
            y1={94}
            x2={item.x + 66}
            y2={110}
            stroke={item.color}
          />
          <ModuleBox
            x={item.x}
            y={112}
            w={132}
            h={58}
            label={item.label}
            sub={item.sub}
            color={item.color}
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
        폼팩터만으로 NAND 종류·내구성·실성능을 알 수 없음
      </text>
    </g>
  );
}

export function StepWorkload() {
  const metrics = [
    {
      label: "접근 패턴",
      sub: "sequential · random",
      color: C.m2,
      progress: 0.72,
    },
    {
      label: "읽기 / 쓰기",
      sub: "ratio · write amp",
      color: C.u2,
      progress: 0.58,
    },
    { label: "큐 깊이", sub: "latency · IOPS", color: C.ok, progress: 0.44 },
    {
      label: "부하 시간",
      sub: "burst · sustained",
      color: C.e1s,
      progress: 0.86,
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
        벤치마크 전에 I/O 프로파일 작성
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
        같은 SSD도 큐 깊이와 지속 시간에 따라 결과가 달라짐
      </text>
    </g>
  );
}

export function StepThermal() {
  const stages = [
    { x: 16, label: "write load", sub: "controller + NAND", color: C.m2 },
    { x: 132, label: "heat", sub: "power → temperature", color: C.u2 },
    { x: 248, label: "cooling path", sub: "spreader · airflow", color: C.e1s },
    { x: 364, label: "steady rate", sub: "지속 처리량", color: C.ok },
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
        지속 성능을 만드는 열 경로
      </text>
      {stages.map((stage, index) => (
        <motion.g key={stage.label} {...reveal(0.08 + index * 0.12)}>
          <ActionBox
            x={stage.x}
            y={67}
            w={100}
            h={54}
            label={stage.label}
            sub={stage.sub}
            color={stage.color}
          />
          {index < stages.length - 1 && (
            <line
              x1={stage.x + 101}
              y1={94}
              x2={stage.x + 115}
              y2={94}
              stroke="var(--muted-foreground)"
            />
          )}
        </motion.g>
      ))}
      <motion.g {...reveal(0.58)}>
        <DataBox
          x={85}
          y={151}
          w={310}
          h={32}
          label="열 배출량 < 발생량이면 온도 제한으로 성능 하향"
          color={C.err}
        />
      </motion.g>
    </g>
  );
}
