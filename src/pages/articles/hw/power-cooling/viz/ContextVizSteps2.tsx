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

export function StepRedundancy() {
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
        독립된 feed와 실패 후 잔여 용량
      </text>
      <ModuleBox
        x={24}
        y={43}
        w={112}
        h={52}
        label="Feed A"
        sub="upstream path A"
        color={C.power}
      />
      <ModuleBox
        x={24}
        y={124}
        w={112}
        h={52}
        label="Feed B"
        sub="upstream path B"
        color={C.safe}
      />
      <motion.path
        d="M136 69 H192 V109 M136 150 H192 V109"
        fill="none"
        stroke={C.neutral}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ActionBox
        x={198}
        y={77}
        w={118}
        h={64}
        label="server PSUs"
        sub="load sharing"
        color={C.heat}
      />
      <motion.line
        x1={316}
        y1={109}
        x2={352}
        y2={109}
        stroke={C.heat}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <DataBox
        x={358}
        y={77}
        w={102}
        h={64}
        label="peak load"
        sub="after one loss"
        color={C.risk}
      />
      <AlertBox
        x={88}
        y={166}
        w={304}
        h={26}
        label="upstream 공통점을 찾아야 진짜 독립 경로"
        color={C.risk}
      />
    </g>
  );
}

export function StepOperate() {
  const flow = [
    { x: 16, label: "observe", sub: "power · temp", color: C.power },
    { x: 132, label: "alert", sub: "trend · limit", color: C.heat },
    { x: 248, label: "control", sub: "cap · drain", color: C.cool },
    { x: 364, label: "verify", sub: "repair · test", color: C.safe },
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
        telemetry를 복구 동작으로 연결
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
      <DataBox
        x={78}
        y={153}
        w={324}
        h={30}
        label="정상 기준선 · 경보 임계값 · 정기 장애 훈련"
        color={C.safe}
      />
    </g>
  );
}
