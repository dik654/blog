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

export function StepEccLayers() {
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
        서로 다른 두 ECC 경계
      </text>
      <ModuleBox
        x={22}
        y={59}
        w={178}
        h={72}
        label="DDR5 on-die ECC"
        sub="DRAM cell array 내부"
        color={C.ddr5}
      />
      <motion.line
        x1={200}
        y1={95}
        x2={278}
        y2={95}
        stroke={C.err}
        strokeWidth={1.2}
        strokeDasharray="5 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ModuleBox
        x={280}
        y={59}
        w={178}
        h={72}
        label="System ECC"
        sub="module · bus · controller"
        color={C.ecc}
      />
      <DataBox
        x={54}
        y={153}
        w={160}
        h={30}
        label="내부 cell 보호"
        color={C.ddr5}
      />
      <DataBox
        x={266}
        y={153}
        w={160}
        h={30}
        label="end-to-end 경로 보호"
        color={C.ecc}
      />
      <text
        x={240}
        y={196}
        textAnchor="middle"
        fontSize={9}
        fill="var(--muted-foreground)"
      >
        온다이 ECC만으로 ECC UDIMM/RDIMM이 되는 것은 아님
      </text>
    </g>
  );
}

export function StepCompatibility() {
  const checks = [
    { x: 16, label: "CPU", sub: "memory controller", color: C.info },
    { x: 132, label: "Board", sub: "slot key · routing", color: C.ddr5 },
    { x: 248, label: "Firmware", sub: "training · QVL", color: C.warn },
    { x: 364, label: "DIMMs", sub: "type · rank · DPC", color: C.ecc },
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
        부팅 가능한 조합의 네 조건
      </text>
      {checks.map((check, index) => (
        <motion.g key={check.label} {...reveal(0.08 + index * 0.12)}>
          <ActionBox
            x={check.x}
            y={65}
            w={100}
            h={58}
            label={check.label}
            sub={check.sub}
            color={check.color}
          />
          {index < checks.length - 1 && (
            <line
              x1={check.x + 101}
              y1={94}
              x2={check.x + 115}
              y2={94}
              stroke="var(--muted-foreground)"
            />
          )}
        </motion.g>
      ))}
      <AlertBox
        x={82}
        y={151}
        w={316}
        h={34}
        label="UDIMM과 RDIMM은 혼용하거나 임의 교체할 수 없음"
        color={C.err}
      />
    </g>
  );
}
