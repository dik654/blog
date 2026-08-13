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
    label: "RU보다 서버의 전체 물리 envelope를 확인한다",
    body: "깊이·무게·rail·door·connector bend radius와 service clearance까지 맞아야 실제 rack에 배치할 수 있습니다.",
  },
  {
    label: "전원 경로는 utility에서 각 PSU까지 추적한다",
    body: "outlet이 달라도 UPS·switchgear·busway에서 다시 만나는 공통 장애가 있는지 single-line diagram으로 확인합니다.",
  },
  {
    label: "usable circuit capacity와 phase balance로 배치한다",
    body: "nameplate A를 그대로 채우지 않고 지역 전기 규정과 breaker derating, power factor, 실패 상태를 반영합니다.",
  },
  {
    label: "랙 전력과 같은 위치의 냉각 capacity를 맞춘다",
    body: "시설 평균 kW가 아니라 해당 rack footprint의 inlet·airflow 또는 coolant 공급이 실제 열 부하를 받을 수 있어야 합니다.",
  },
  {
    label: "정상·feed 상실·냉각 저하·정비를 인수 시험한다",
    body: "계측 기준선을 저장하고 경보, power cap, checkpoint, 안전 종료와 부품 교체가 의도대로 작동하는지 확인합니다.",
  },
];

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 7 },
  animate: { opacity: 1, y: 0 },
  transition: { delay },
});

function Mechanical() {
  const checks = [
    { x: 16, label: "height", sub: "RU", color: C.power },
    { x: 132, label: "depth", sub: "door · cable", color: C.cool },
    { x: 248, label: "weight", sub: "rack · floor", color: C.heat },
    { x: 364, label: "service", sub: "rail · lift", color: C.safe },
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
        rack fit는 네 방향의 envelope
      </text>
      {checks.map((check, index) => (
        <motion.g key={check.label} {...reveal(0.08 + index * 0.12)}>
          <ModuleBox
            x={check.x}
            y={65}
            w={100}
            h={58}
            label={check.label}
            sub={check.sub}
            color={check.color}
          />
        </motion.g>
      ))}
      <DataBox
        x={70}
        y={153}
        w={340}
        h={30}
        label="GPU 수는 RU만으로 결정되지 않음"
        color={C.risk}
      />
    </g>
  );
}

function Paths() {
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
        끝까지 분리된 전원 경로
      </text>
      <ModuleBox
        x={18}
        y={42}
        w={102}
        h={48}
        label="UPS A"
        sub="path A"
        color={C.power}
      />
      <ModuleBox
        x={18}
        y={126}
        w={102}
        h={48}
        label="UPS B"
        sub="path B"
        color={C.safe}
      />
      <motion.path
        d="M120 66 H170 V101 M120 150 H170 V115"
        fill="none"
        stroke={C.neutral}
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ActionBox
        x={176}
        y={76}
        w={112}
        h={64}
        label="rPDUs"
        sub="meter · phase"
        color={C.heat}
      />
      <motion.path
        d="M288 101 H334 V66 M288 115 H334 V150"
        fill="none"
        stroke={C.neutral}
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ModuleBox
        x={340}
        y={42}
        w={120}
        h={48}
        label="Server PSU A"
        sub="independent input"
        color={C.power}
      />
      <ModuleBox
        x={340}
        y={126}
        w={120}
        h={48}
        label="Server PSU B"
        sub="independent input"
        color={C.safe}
      />
      <AlertBox
        x={92}
        y={178}
        w={296}
        h={18}
        label="공통 upstream junction 표시"
        color={C.risk}
      />
    </g>
  );
}

function Capacity() {
  const rows = [
    {
      y: 42,
      label: "circuit usable",
      sub: "voltage · current · code",
      progress: 0.8,
      color: C.power,
    },
    {
      y: 95,
      label: "phase balance",
      sub: "L1 · L2 · L3 telemetry",
      progress: 0.64,
      color: C.cool,
    },
    {
      y: 148,
      label: "one-feed state",
      sub: "remaining capacity",
      progress: 0.72,
      color: C.safe,
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
        정상과 실패 상태의 electrical margin
      </text>
      {rows.map((row, index) => (
        <motion.g key={row.label} {...reveal(0.08 + index * 0.13)}>
          <StatusBox x={52} w={376} h={48} {...row} />
        </motion.g>
      ))}
    </g>
  );
}

function MatchCooling() {
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
        같은 rack footprint의 power와 cooling
      </text>
      <ModuleBox
        x={22}
        y={62}
        w={124}
        h={62}
        label="IT heat load"
        sub="measured rack input"
        color={C.heat}
      />
      <text
        x={166}
        y={99}
        textAnchor="middle"
        fontSize={14}
        fontWeight={700}
        fill="var(--muted-foreground)"
      >
        ≤
      </text>
      <ActionBox
        x={184}
        y={56}
        w={132}
        h={74}
        label="local capacity"
        sub="airflow or coolant"
        color={C.cool}
      />
      <motion.line
        x1={316}
        y1={93}
        x2={348}
        y2={93}
        stroke={C.cool}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ModuleBox
        x={354}
        y={62}
        w={104}
        h={62}
        label="margin"
        sub="failure included"
        color={C.safe}
      />
      <AlertBox
        x={74}
        y={154}
        w={332}
        h={34}
        label="facility 평균값으로 고밀도 rack을 숨기지 않음"
        color={C.risk}
      />
    </g>
  );
}

function Accept() {
  const flow = [
    { x: 16, label: "baseline", sub: "full workload", color: C.power },
    { x: 132, label: "power loss", sub: "one path", color: C.risk },
    { x: 248, label: "cooling loss", sub: "cap · drain", color: C.heat },
    { x: 364, label: "service", sub: "replace · retest", color: C.safe },
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
        rack acceptance sequence
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
        x={64}
        y={153}
        w={352}
        h={30}
        label="qualified personnel · approved procedure · saved evidence"
        color={C.safe}
      />
    </g>
  );
}

const SCENES = [Mechanical, Paths, Capacity, MatchCooling, Accept];

export default function RackPowerViz() {
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
