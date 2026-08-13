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
    label: "UDIMM은 controller가 DRAM load를 직접 구동한다",
    body: "buffer가 없어 단순하지만 channel당 rank·DIMM 수가 늘수록 memory controller의 전기적 부담이 커집니다.",
  },
  {
    label: "RDIMM은 command/address를 register에서 다시 구동한다",
    body: "RCD가 controller의 load를 줄여 서버가 더 많은 rank와 용량을 안정적으로 구성하도록 돕습니다.",
  },
  {
    label: "3DS RDIMM은 DRAM die를 적층해 module 용량을 높인다",
    body: "논리 rank와 die stack 구조가 추가되므로 CPU와 BIOS가 해당 3DS 조합을 명시적으로 지원해야 합니다.",
  },
  {
    label: "MRDIMM은 rank의 data를 multiplex해 대역폭을 높인다",
    body: "현재 일부 Xeon 6 플랫폼 같은 명시적 지원 시스템에서만 사용할 수 있는 별도 module 기술입니다.",
  },
  {
    label: "모듈 타입보다 시스템 QVL과 population rule이 우선이다",
    body: "타입·용량·rank·density·DPC를 임의로 섞지 않고 제조사의 slot 순서와 firmware 요구를 따릅니다.",
  },
];

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 7 },
  animate: { opacity: 1, y: 0 },
  transition: { delay },
});

function Udimm() {
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
        UDIMM · direct electrical load
      </text>
      <ModuleBox
        x={22}
        y={64}
        w={128}
        h={62}
        label="Memory controller"
        sub="CA + data drive"
        color={C.info}
      />
      <motion.path
        d="M150 95 H202 M202 95 V65 M202 95 V142"
        fill="none"
        stroke={C.ddr5}
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ModuleBox
        x={214}
        y={42}
        w={116}
        h={52}
        label="DRAM rank 0"
        sub="direct load"
        color={C.ddr5}
      />
      <ModuleBox
        x={214}
        y={119}
        w={116}
        h={52}
        label="DRAM rank 1"
        sub="direct load"
        color={C.ddr5}
      />
      <StatusBox
        x={354}
        y={65}
        w={106}
        h={82}
        label="signal margin"
        sub="rank·DPC 영향"
        color={C.warn}
        progress={0.54}
      />
    </g>
  );
}

function Rdimm() {
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
        RDIMM · registered command/address
      </text>
      <ModuleBox
        x={20}
        y={65}
        w={116}
        h={60}
        label="Controller"
        sub="one registered load"
        color={C.info}
      />
      <motion.line
        x1={136}
        y1={95}
        x2={174}
        y2={95}
        stroke={C.ecc}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ActionBox
        x={180}
        y={61}
        w={116}
        h={68}
        label="RCD"
        sub="buffer + re-drive CA"
        color={C.ecc}
      />
      <motion.path
        d="M296 95 H334 M334 95 V61 M334 95 V144"
        fill="none"
        stroke={C.ecc}
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ModuleBox
        x={346}
        y={38}
        w={112}
        h={54}
        label="DRAM ranks"
        sub="registered path"
        color={C.ddr5}
      />
      <ModuleBox
        x={346}
        y={119}
        w={112}
        h={54}
        label="DRAM ranks"
        sub="registered path"
        color={C.ddr5}
      />
      <text
        x={240}
        y={193}
        textAnchor="middle"
        fontSize={9}
        fill="var(--muted-foreground)"
      >
        data path 구조와 지원 rank 수는 DDR 세대·module 사양에 따라 다름
      </text>
    </g>
  );
}

function ThreeDs() {
  const dies = [43, 60, 77, 94];
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
        3DS RDIMM · stacked DRAM packages
      </text>
      <ModuleBox
        x={20}
        y={59}
        w={126}
        h={60}
        label="RCD"
        sub="registered interface"
        color={C.ecc}
      />
      <motion.line
        x1={146}
        y1={89}
        x2={198}
        y2={89}
        stroke={C.ecc}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      {dies.map((y, index) => (
        <motion.g key={y} {...reveal(0.08 + index * 0.1)}>
          <rect
            x={210 + index * 5}
            y={y}
            width={108}
            height={42}
            rx={6}
            fill={`${C.ddr5}18`}
            stroke={C.ddr5}
          />
        </motion.g>
      ))}
      <ModuleBox
        x={348}
        y={58}
        w={112}
        h={62}
        label="logical ranks"
        sub="platform decoded"
        color={C.info}
      />
      <DataBox
        x={88}
        y={153}
        w={304}
        h={30}
        label="용량 증대 · CPU/BIOS 3DS 지원 필수"
        color={C.warn}
      />
    </g>
  );
}

function Mrdimm() {
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
        MRDIMM · multiplexed rank data
      </text>
      <ModuleBox
        x={20}
        y={47}
        w={118}
        h={54}
        label="Rank A"
        sub="independent data"
        color={C.ddr5}
      />
      <ModuleBox
        x={20}
        y={126}
        w={118}
        h={54}
        label="Rank B"
        sub="independent data"
        color={C.info}
      />
      <motion.path
        d="M138 74 H190 V112 M138 153 H190 V112"
        fill="none"
        stroke={C.ecc}
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ActionBox
        x={196}
        y={80}
        w={116}
        h={64}
        label="MRCD / MUX"
        sub="combine rank streams"
        color={C.ecc}
      />
      <motion.line
        x1={312}
        y1={112}
        x2={348}
        y2={112}
        stroke={C.ecc}
        strokeWidth={2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ModuleBox
        x={354}
        y={79}
        w={106}
        h={66}
        label="host channel"
        sub="platform-specific"
        color={C.warn}
      />
      <text
        x={240}
        y={195}
        textAnchor="middle"
        fontSize={9}
        fill="var(--muted-foreground)"
      >
        RDIMM과 임의 교체 불가 · CPU SKU와 board 지원 확인
      </text>
    </g>
  );
}

function Qualify() {
  const checks = [
    { x: 16, label: "type", sub: "UDIMM · RDIMM", color: C.ddr5 },
    { x: 132, label: "geometry", sub: "rank · density", color: C.info },
    { x: 248, label: "population", sub: "channel · DPC", color: C.warn },
    { x: 364, label: "firmware", sub: "QVL · training", color: C.ecc },
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
        DIMM qualification checklist
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
        x={74}
        y={151}
        w={332}
        h={34}
        label="같은 DDR5라도 notch·buffer·전기 규격이 다름"
        color={C.err}
      />
    </g>
  );
}

const SCENES = [Udimm, Rdimm, ThreeDs, Mrdimm, Qualify];

export default function DimmTypeViz() {
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
