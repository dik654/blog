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
    label: "component 정격으로 장비 상한을 먼저 확인한다",
    body: "GPU뿐 아니라 CPU·memory·drive·NIC·fan을 넣고 OEM이 지원하는 PSU·airflow 구성인지 확인합니다.",
  },
  {
    label: "서버 전체 입력은 rPDU에서 workload별로 측정한다",
    body: "BMC component telemetry와 AC input을 같은 시간축에 맞춰 PSU 손실과 주변 부하를 포함합니다.",
  },
  {
    label: "평균·steady·burst를 분리해 envelope를 만든다",
    body: "계측 주기에 가려지는 짧은 ramp와 여러 노드의 실제 동시 최대를 별도로 확인합니다.",
  },
  {
    label: "power cap은 에너지와 완료 시간을 함께 바꾼다",
    body: "W만 줄었는지 작업당 Wh도 줄었는지, tail latency와 thermal throttle이 어떻게 변했는지 비교합니다.",
  },
  {
    label: "실패 후에도 남는 회로·PSU 용량으로 승인한다",
    body: "정상 합계가 아니라 feed 하나가 사라진 상태에서 peak workload를 지속할 수 있는지 시험합니다.",
  },
];

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 7 },
  animate: { opacity: 1, y: 0 },
  transition: { delay },
});

function Components() {
  const items = [
    { x: 16, label: "GPU", sub: "board limit", color: C.power },
    { x: 132, label: "CPU + RAM", sub: "socket · channels", color: C.heat },
    { x: 248, label: "I/O + fan", sub: "drive · NIC", color: C.cool },
    { x: 364, label: "PSU input", sub: "OEM envelope", color: C.safe },
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
        component limits → supported server envelope
      </text>
      {items.map((item, index) => (
        <motion.g key={item.label} {...reveal(0.08 + index * 0.12)}>
          <ModuleBox
            x={item.x}
            y={65}
            w={100}
            h={58}
            label={item.label}
            sub={item.sub}
            color={item.color}
          />
          {index < items.length - 1 && (
            <line
              x1={item.x + 101}
              y1={94}
              x2={item.x + 115}
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
        label="제품 maximum은 측정값이 아니라 검토 상한"
        color={C.risk}
      />
    </g>
  );
}

function Measure() {
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
        같은 시간축의 두 telemetry 계층
      </text>
      <ModuleBox
        x={24}
        y={58}
        w={164}
        h={68}
        label="BMC · device"
        sub="GPU · CPU · fan · throttle"
        color={C.power}
      />
      <ModuleBox
        x={292}
        y={58}
        w={164}
        h={68}
        label="rPDU input"
        sub="AC W · phase · outlet"
        color={C.safe}
      />
      <motion.path
        d="M188 92 H230 M292 92 H250"
        fill="none"
        stroke={C.cool}
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ActionBox
        x={211}
        y={132}
        w={58}
        h={48}
        label="time"
        sub="align"
        color={C.cool}
      />
      <DataBox
        x={55}
        y={184}
        w={370}
        h={12}
        label="workload ID · batch · ambient도 함께 기록"
        color={C.neutral}
      />
    </g>
  );
}

function Envelope() {
  const rows = [
    {
      y: 42,
      label: "average",
      sub: "energy accounting",
      progress: 0.48,
      color: C.neutral,
    },
    {
      y: 95,
      label: "steady",
      sub: "cooling design load",
      progress: 0.72,
      color: C.power,
    },
    {
      y: 148,
      label: "burst",
      sub: "electrical response",
      progress: 0.92,
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
        시간 창별로 다른 설계 입력
      </text>
      {rows.map((row, index) => (
        <motion.g key={row.label} {...reveal(0.08 + index * 0.13)}>
          <StatusBox x={52} w={376} h={48} {...row} />
        </motion.g>
      ))}
    </g>
  );
}

function Cap() {
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
        power cap의 종단 효과
      </text>
      <DataBox
        x={22}
        y={61}
        w={108}
        h={58}
        label="cap level"
        sub="device · rack"
        color={C.power}
      />
      <motion.line
        x1={130}
        y1={90}
        x2={169}
        y2={90}
        stroke={C.power}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ActionBox
        x={175}
        y={56}
        w={130}
        h={68}
        label="run workload"
        sub="same completion target"
        color={C.heat}
      />
      <motion.line
        x1={305}
        y1={90}
        x2={344}
        y2={90}
        stroke={C.heat}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ModuleBox
        x={350}
        y={61}
        w={108}
        h={58}
        label="result"
        sub="jobs · Wh · tail"
        color={C.safe}
      />
      <AlertBox
        x={70}
        y={153}
        w={340}
        h={34}
        label="낮은 W가 항상 낮은 작업당 에너지는 아님"
        color={C.risk}
      />
    </g>
  );
}

function Failure() {
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
        한 feed 상실 뒤의 승인 조건
      </text>
      <ModuleBox
        x={22}
        y={46}
        w={104}
        h={48}
        label="Feed A"
        sub="offline test"
        color={C.risk}
      />
      <ModuleBox
        x={22}
        y={126}
        w={104}
        h={48}
        label="Feed B"
        sub="remaining path"
        color={C.safe}
      />
      <motion.path
        d="M126 70 H171 M126 150 H171"
        fill="none"
        stroke={C.neutral}
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ActionBox
        x={177}
        y={76}
        w={126}
        h={64}
        label="peak workload"
        sub="no unsafe overload"
        color={C.heat}
      />
      <motion.line
        x1={303}
        y1={108}
        x2={342}
        y2={108}
        stroke={C.heat}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ModuleBox
        x={348}
        y={76}
        w={110}
        h={64}
        label="accept"
        sub="capacity + recovery"
        color={C.safe}
      />
      <DataBox
        x={82}
        y={162}
        w={316}
        h={26}
        label="전환·경보·checkpoint까지 함께 확인"
        color={C.power}
      />
    </g>
  );
}

const SCENES = [Components, Measure, Envelope, Cap, Failure];

export default function PowerEnvelopeViz() {
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
