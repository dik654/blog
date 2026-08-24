import { motion } from "framer-motion";
import StepViz from "@/components/ui/step-viz";
import {
  AlertBox,
  DataBox,
  ModuleBox,
  StatusBox,
} from "@/components/viz/boxes";
import { C } from "./ContextVizData";

const STEPS = [
  {
    label: "EDSFF는 SSD와 서버의 공기 흐름을 함께 설계한다",
    body: "세로로 꽂는 1U 장치와 전용 커넥터는 저장 밀도뿐 아니라 CPU 쪽으로 흐르는 공기의 저항도 줄이려는 선택입니다.",
  },
  {
    label: "E1.S는 하나의 두께와 전력으로 고정되지 않는다",
    body: "표준은 여러 두께와 인클로저 옵션을 정의하므로 서버가 허용하는 기구·열 한계를 먼저 확인해야 합니다.",
  },
  {
    label: "E1과 E3는 서로 다른 섀시 목표를 가진다",
    body: "E1 계열은 1U 밀도, E3 계열은 더 넓은 장치와 다양한 서버 구성을 위한 패밀리입니다.",
  },
  {
    label: "세 폼팩터는 성능 등급이 아니라 배치 선택지다",
    body: "같은 컨트롤러·NAND 제품군도 여러 폼팩터로 나올 수 있으므로 SKU별 내구성·PLP·성능을 따로 비교합니다.",
  },
];

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 7 },
  animate: { opacity: 1, y: 0 },
  transition: { delay },
});

function Airflow() {
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
        1U 전면부와 공기 흐름
      </text>
      <ModuleBox
        x={20}
        y={55}
        w={132}
        h={74}
        label="2.5-inch bays"
        sub="vertical backplane"
        color={C.u2}
      />
      <motion.path
        d="M25 151 H147"
        stroke={C.u2}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <AlertBox
        x={173}
        y={68}
        w={116}
        h={50}
        label="air resistance"
        sub="섀시 설계 영향"
        color={C.err}
      />
      <ModuleBox
        x={314}
        y={55}
        w={146}
        h={74}
        label="EDSFF slots"
        sub="airflow-oriented"
        color={C.e1s}
      />
      <motion.path
        d="M318 151 H456"
        stroke={C.e1s}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <text
        x={240}
        y={188}
        textAnchor="middle"
        fontSize={9}
        fill="var(--muted-foreground)"
      >
        실제 냉각 성능은 드라이브·백플레인·팬·덕트 조합으로 검증
      </text>
    </g>
  );
}

function Thickness() {
  const variants = [
    { x: 21, label: "5.9 mm", progress: 0.24 },
    { x: 132, label: "8.01 mm", progress: 0.38 },
    { x: 243, label: "9.5 mm", progress: 0.52 },
    { x: 354, label: "15 / 25 mm", progress: 0.82 },
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
        E1.S 기구 옵션
      </text>
      {variants.map((item, index) => (
        <motion.g key={item.label} {...reveal(0.08 + index * 0.11)}>
          <StatusBox
            x={item.x}
            y={57}
            w={105}
            h={62}
            label={item.label}
            sub="enclosure option"
            color={C.e1s}
            progress={item.progress}
          />
        </motion.g>
      ))}
      <DataBox
        x={87}
        y={151}
        w={306}
        h={32}
        label="두꺼운 옵션일수록 베이 피치와 열 한계가 달라짐"
        color={C.e1s}
      />
    </g>
  );
}

function Families() {
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
        EDSFF 패밀리의 설계 범위
      </text>
      <ModuleBox
        x={28}
        y={56}
        w={194}
        h={72}
        label="E1.S / E1.L"
        sub="1U short · capacity ruler"
        color={C.e1s}
      />
      <ModuleBox
        x={258}
        y={56}
        w={194}
        h={72}
        label="E3.S / E3.L"
        sub="wider device family"
        color={C.m2}
      />
      <motion.path
        d="M125 139 H355"
        stroke={C.ok}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <DataBox
        x={83}
        y={157}
        w={314}
        h={30}
        label="서버가 지원하는 규격·두께·레인 조합을 확인"
        color={C.ok}
      />
    </g>
  );
}

function Compare() {
  const choices = [
    { x: 18, label: "M.2", sub: "내부 모듈", color: C.m2 },
    { x: 174, label: "U.2 / U.3", sub: "2.5-inch service", color: C.u2 },
    { x: 330, label: "EDSFF", sub: "density · airflow", color: C.e1s },
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
        패키지 선택과 SSD 등급을 분리
      </text>
      {choices.map((choice, index) => (
        <motion.g key={choice.label} {...reveal(0.08 + index * 0.14)}>
          <ModuleBox
            x={choice.x}
            y={55}
            w={132}
            h={62}
            label={choice.label}
            sub={choice.sub}
            color={choice.color}
          />
        </motion.g>
      ))}
      <AlertBox
        x={68}
        y={145}
        w={344}
        h={38}
        label="DWPD · PLP · 성능은 폼팩터가 아니라 SKU 사양"
        color={C.err}
      />
    </g>
  );
}

const SCENES = [Airflow, Thickness, Families, Compare];

export default function EdsffViz() {
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
