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
    label: "오류가 생길 수 있는 경로를 먼저 나눈다",
    body: "DRAM cell, module 배선, memory bus, controller와 CPU cache는 서로 다른 보호 계층에 있습니다.",
  },
  {
    label: "DDR5 온다이 ECC는 DRAM 내부 cell을 보호한다",
    body: "READ 전에 die 내부 single-bit 오류를 교정하지만 bus나 다른 chip의 오류를 시스템에 대신 보고하지는 않습니다.",
  },
  {
    label: "시스템 ECC는 추가 data width와 controller logic을 사용한다",
    body: "ECC module과 지원 CPU·보드가 함께 codeword를 만들고 syndrome으로 전송 경로 오류를 감지·교정합니다.",
  },
  {
    label: "corrected error도 고장 전조로 기록한다",
    body: "교정됐다는 사실만으로 끝내지 않고 DIMM·rank·row별 증가 추세를 관찰해 예방 교체에 연결합니다.",
  },
  {
    label: "uncorrectable error의 격리·재부팅·복구 정책을 정한다",
    body: "애플리케이션 중단, page offlining, machine check와 failover를 서비스 RTO에 맞게 시험합니다.",
  },
];

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 7 },
  animate: { opacity: 1, y: 0 },
  transition: { delay },
});

function ErrorPath() {
  const layers = [
    { x: 16, label: "DRAM cell", sub: "on-die boundary", color: C.ddr5 },
    { x: 132, label: "DIMM", sub: "chips · traces", color: C.info },
    { x: 248, label: "memory bus", sub: "CA · DQ signals", color: C.warn },
    { x: 364, label: "controller", sub: "ECC · RAS", color: C.ecc },
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
        메모리 데이터의 보호 경계
      </text>
      {layers.map((layer, index) => (
        <motion.g key={layer.label} {...reveal(0.08 + index * 0.12)}>
          <ActionBox
            x={layer.x}
            y={65}
            w={100}
            h={58}
            label={layer.label}
            sub={layer.sub}
            color={layer.color}
          />
          {index < layers.length - 1 && (
            <line
              x1={layer.x + 101}
              y1={94}
              x2={layer.x + 115}
              y2={94}
              stroke="var(--muted-foreground)"
            />
          )}
        </motion.g>
      ))}
      <DataBox
        x={82}
        y={151}
        w={316}
        h={32}
        label="한 ECC 기능이 모든 경계를 보호하지는 않음"
        color={C.err}
      />
    </g>
  );
}

function OnDie() {
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
        DDR5 DRAM die 내부 READ
      </text>
      <DataBox
        x={22}
        y={67}
        w={108}
        h={48}
        label="cell array"
        sub="data + internal ECC"
        color={C.ddr5}
      />
      <motion.line
        x1={130}
        y1={91}
        x2={167}
        y2={91}
        stroke={C.ddr5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ActionBox
        x={173}
        y={60}
        w={124}
        h={62}
        label="on-die decode"
        sub="single-bit correction"
        color={C.ddr5}
      />
      <motion.line
        x1={297}
        y1={91}
        x2={334}
        y2={91}
        stroke={C.ddr5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ModuleBox
        x={340}
        y={60}
        w={118}
        h={62}
        label="DQ output"
        sub="to memory bus"
        color={C.info}
      />
      <AlertBox
        x={88}
        y={151}
        w={304}
        h={34}
        label="bus·module 오류는 on-die ECC 범위 밖"
        color={C.err}
      />
    </g>
  );
}

function SystemEcc() {
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
        시스템 ECC codeword 경로
      </text>
      <DataBox
        x={20}
        y={67}
        w={112}
        h={50}
        label="data bits"
        sub="cache line segment"
        color={C.info}
      />
      <text
        x={147}
        y={96}
        textAnchor="middle"
        fontSize={14}
        fontWeight={700}
        fill="var(--muted-foreground)"
      >
        +
      </text>
      <DataBox
        x={162}
        y={67}
        w={112}
        h={50}
        label="check bits"
        sub="ECC module width"
        color={C.ecc}
      />
      <motion.line
        x1={274}
        y1={92}
        x2={314}
        y2={92}
        stroke={C.ecc}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ActionBox
        x={320}
        y={60}
        w={140}
        h={64}
        label="memory controller"
        sub="encode · syndrome · report"
        color={C.ecc}
      />
      <DataBox
        x={73}
        y={153}
        w={334}
        h={30}
        label="정정 능력은 controller·module RAS 구성에 따라 달라짐"
        color={C.warn}
      />
    </g>
  );
}

function Telemetry() {
  const states = [
    {
      y: 41,
      label: "corrected count",
      sub: "DIMM · rank · row 추세",
      progress: 0.42,
      color: C.warn,
    },
    {
      y: 94,
      label: "threshold",
      sub: "경보 · page offline · 교체",
      progress: 0.68,
      color: C.err,
    },
    {
      y: 147,
      label: "post-repair",
      sub: "재발 여부 검증",
      progress: 0.28,
      color: C.ecc,
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
        교정 오류를 운영 신호로 전환
      </text>
      {states.map((state, index) => (
        <motion.g key={state.label} {...reveal(0.08 + index * 0.14)}>
          <StatusBox
            x={54}
            y={state.y}
            w={372}
            h={48}
            label={state.label}
            sub={state.sub}
            color={state.color}
            progress={state.progress}
          />
        </motion.g>
      ))}
    </g>
  );
}

function Recovery() {
  const actions = [
    { x: 16, label: "detect", sub: "machine check", color: C.err },
    { x: 132, label: "contain", sub: "page · rank", color: C.warn },
    { x: 248, label: "fail over", sub: "service RTO", color: C.info },
    { x: 364, label: "replace", sub: "DIMM · verify", color: C.ecc },
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
        uncorrectable error 대응 흐름
      </text>
      {actions.map((action, index) => (
        <motion.g key={action.label} {...reveal(0.08 + index * 0.12)}>
          <ActionBox
            x={action.x}
            y={65}
            w={100}
            h={58}
            label={action.label}
            sub={action.sub}
            color={action.color}
          />
          {index < actions.length - 1 && (
            <line
              x1={action.x + 101}
              y1={94}
              x2={action.x + 115}
              y2={94}
              stroke="var(--muted-foreground)"
            />
          )}
        </motion.g>
      ))}
      <AlertBox
        x={80}
        y={151}
        w={320}
        h={34}
        label="ECC는 backup·replication·failover를 대체하지 않음"
        color={C.err}
      />
    </g>
  );
}

const SCENES = [ErrorPath, OnDie, SystemEcc, Telemetry, Recovery];

export default function EccPathViz() {
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
