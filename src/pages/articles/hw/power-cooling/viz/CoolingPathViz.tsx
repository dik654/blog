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
    label: "공랭은 cold aisle에서 hot aisle까지 한 방향으로 흐른다",
    body: "서버 방향, blanking panel과 cable opening을 정리해 뜨거운 배기가 inlet으로 돌아오지 않게 합니다.",
  },
  {
    label: "수동 GPU는 카드가 아니라 섀시가 공기를 움직인다",
    body: "heatsink 압력 강하와 카드별 요구 풍량을 fan wall·duct·firmware가 만족하는 OEM 구성을 사용합니다.",
  },
  {
    label: "open-air 카드는 인접 장치의 흡기까지 가열한다",
    body: "tower에서는 효과적일 수 있지만 밀집 rack에서는 slot 간격과 전체 섀시 배기를 실제 구성으로 시험해야 합니다.",
  },
  {
    label: "direct-to-chip은 cold plate에서 facility loop까지 이어진다",
    body: "manifold·CDU·facility water의 유량, 압력, 재질 호환과 누수 대응이 모두 qualification 대상입니다.",
  },
  {
    label: "센서는 평균보다 열 경로의 병목을 찾는 데 쓴다",
    body: "rack inlet 상·중·하, component hotspot, air 또는 coolant supply/return을 같은 workload와 시간축에 맞춥니다.",
  },
];

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 7 },
  animate: { opacity: 1, y: 0 },
  transition: { delay },
});

function Aisle() {
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
        cold aisle → server → hot aisle
      </text>
      <ModuleBox
        x={20}
        y={65}
        w={112}
        h={62}
        label="cold inlet"
        sub="controlled air"
        color={C.cool}
      />
      <motion.line
        x1={132}
        y1={96}
        x2={176}
        y2={96}
        stroke={C.cool}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ActionBox
        x={182}
        y={57}
        w={116}
        h={78}
        label="rack server"
        sub="duct · sink · fan"
        color={C.power}
      />
      <motion.line
        x1={298}
        y1={96}
        x2={342}
        y2={96}
        stroke={C.heat}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ModuleBox
        x={348}
        y={65}
        w={112}
        h={62}
        label="hot exhaust"
        sub="return path"
        color={C.heat}
      />
      <AlertBox
        x={76}
        y={154}
        w={328}
        h={34}
        label="blanking·containment로 recirculation 차단"
        color={C.risk}
      />
    </g>
  );
}

function Passive() {
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
        수동 카드의 냉각 시스템
      </text>
      <ModuleBox
        x={20}
        y={64}
        w={116}
        h={62}
        label="fan wall"
        sub="pressure + airflow"
        color={C.cool}
      />
      <motion.line
        x1={136}
        y1={95}
        x2={174}
        y2={95}
        stroke={C.cool}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ActionBox
        x={180}
        y={58}
        w={120}
        h={74}
        label="passive GPU"
        sub="fin stack · no card fan"
        color={C.power}
      />
      <motion.line
        x1={300}
        y1={95}
        x2={338}
        y2={95}
        stroke={C.heat}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ModuleBox
        x={344}
        y={64}
        w={116}
        h={62}
        label="rear exhaust"
        sub="OEM fan curve"
        color={C.heat}
      />
      <DataBox
        x={72}
        y={154}
        w={336}
        h={30}
        label="GPU 단품이 아니라 서버 SKU로 thermal qualification"
        color={C.safe}
      />
    </g>
  );
}

function OpenAir() {
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
        open-air 카드의 재흡기 위험
      </text>
      <ModuleBox
        x={24}
        y={54}
        w={132}
        h={66}
        label="GPU A"
        sub="fan → fin → chassis"
        color={C.power}
      />
      <ModuleBox
        x={324}
        y={54}
        w={132}
        h={66}
        label="GPU B"
        sub="warmer intake"
        color={C.risk}
      />
      <motion.path
        d="M156 87 C205 40 275 40 324 87 M324 107 C274 154 206 154 156 107"
        fill="none"
        stroke={C.heat}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ActionBox
        x={188}
        y={73}
        w={104}
        h={56}
        label="chassis air"
        sub="mixed recirculation"
        color={C.heat}
      />
      <AlertBox
        x={64}
        y={157}
        w={352}
        h={32}
        label="spacing·side panel·cable까지 실제 조립 상태로 시험"
        color={C.risk}
      />
    </g>
  );
}

function Liquid() {
  const nodes = [
    { x: 16, label: "cold plate", sub: "component", color: C.power },
    { x: 132, label: "manifold", sub: "rack flow", color: C.cool },
    { x: 248, label: "CDU", sub: "heat exchange", color: C.safe },
    { x: 364, label: "facility", sub: "reject heat", color: C.heat },
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
        direct-to-chip technology cooling system
      </text>
      {nodes.map((node, index) => (
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
          {index < nodes.length - 1 && (
            <line
              x1={node.x + 101}
              y1={94}
              x2={node.x + 115}
              y2={94}
              stroke={C.cool}
            />
          )}
        </motion.g>
      ))}
      <DataBox
        x={66}
        y={153}
        w={348}
        h={30}
        label="flow · pressure drop · chemistry · leak · service"
        color={C.risk}
      />
    </g>
  );
}

function Observe() {
  const rows = [
    {
      y: 42,
      label: "rack inlet",
      sub: "top · middle · bottom",
      progress: 0.58,
      color: C.cool,
    },
    {
      y: 95,
      label: "component hotspot",
      sub: "temperature · throttle",
      progress: 0.76,
      color: C.heat,
    },
    {
      y: 148,
      label: "transport margin",
      sub: "fan · flow · supply/return",
      progress: 0.64,
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
        열 경로를 따라 배치한 telemetry
      </text>
      {rows.map((row, index) => (
        <motion.g key={row.label} {...reveal(0.08 + index * 0.13)}>
          <StatusBox x={52} w={376} h={48} {...row} />
        </motion.g>
      ))}
    </g>
  );
}

const SCENES = [Aisle, Passive, OpenAir, Liquid, Observe];

export default function CoolingPathViz() {
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
