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

export function StepEnergy() {
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
        전기 입력에서 열 제거까지
      </text>
      <ModuleBox
        x={18}
        y={63}
        w={112}
        h={60}
        label="rPDU input"
        sub="measured AC power"
        color={C.power}
      />
      <motion.line
        x1={130}
        y1={93}
        x2={171}
        y2={93}
        stroke={C.power}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ActionBox
        x={177}
        y={58}
        w={126}
        h={70}
        label="server workload"
        sub="compute + fan + PSU loss"
        color={C.heat}
      />
      <motion.line
        x1={303}
        y1={93}
        x2={344}
        y2={93}
        stroke={C.heat}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ModuleBox
        x={350}
        y={63}
        w={112}
        h={60}
        label="heat rejection"
        sub="air or liquid loop"
        color={C.cool}
      />
      <DataBox
        x={78}
        y={153}
        w={324}
        h={30}
        label="IT input ≈ room heat load · facility overhead는 별도"
        color={C.safe}
      />
    </g>
  );
}

export function StepEnvelope() {
  const states = [
    {
      y: 42,
      label: "idle / background",
      sub: "baseline + management",
      progress: 0.22,
      color: C.neutral,
    },
    {
      y: 95,
      label: "steady workload",
      sub: "representative concurrency",
      progress: 0.68,
      color: C.power,
    },
    {
      y: 148,
      label: "burst / failure state",
      sub: "short ramp + remaining feed",
      progress: 0.9,
      color: C.heat,
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
        서로 다른 시간 척도의 power envelope
      </text>
      {states.map((state, index) => (
        <motion.g key={state.label} {...reveal(0.08 + index * 0.13)}>
          <StatusBox
            x={52}
            y={state.y}
            w={376}
            h={48}
            label={state.label}
            sub={state.sub}
            progress={state.progress}
            color={state.color}
          />
        </motion.g>
      ))}
    </g>
  );
}

export function StepHeatPath() {
  const path = [
    { x: 16, label: "chip", sub: "junction", color: C.heat },
    { x: 132, label: "interface", sub: "sink · plate", color: C.power },
    { x: 248, label: "transport", sub: "air · coolant", color: C.cool },
    { x: 364, label: "facility", sub: "reject heat", color: C.safe },
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
        component에서 실외까지의 열 저항
      </text>
      {path.map((node, index) => (
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
          {index < path.length - 1 && (
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
        x={82}
        y={153}
        w={316}
        h={30}
        label="가장 포화된 구간이 전체 지속 성능을 제한"
        color={C.risk}
      />
    </g>
  );
}
