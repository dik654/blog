import { motion } from "framer-motion";
import StepViz from "@/components/ui/step-viz";
import {
  ActionBox,
  AlertBox,
  DataBox,
  ModuleBox,
} from "@/components/viz/boxes";
import { C } from "./ContextVizData";

const STEPS = [
  {
    label: "U.2는 2.5인치 베이에 PCIe를 연결한다",
    body: "금속 인클로저와 외부 접근형 커넥터를 사용하지만, 실제 핫플러그 여부는 서버 플랫폼이 결정합니다.",
  },
  {
    label: "안전한 교체는 소프트웨어에서 시작한다",
    body: "데이터 중복을 확인하고 I/O를 제거한 뒤 슬롯 식별·전원 제어·물리 교체 순서로 진행합니다.",
  },
  {
    label: "PLP는 전원 손실 때 진행 중인 쓰기를 보존한다",
    body: "PLP가 있는 SSD는 저장된 에너지로 휘발성 버퍼와 메타데이터를 NAND에 마무리할 수 있습니다.",
  },
  {
    label: "베이 수만큼 PCIe와 냉각 예산이 필요하다",
    body: "여러 x4 드라이브를 연결하려면 CPU 레인이나 PCIe 스위치, 백플레인과 풍량을 함께 설계해야 합니다.",
  },
];

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 7 },
  animate: { opacity: 1, y: 0 },
  transition: { delay },
});

function Package() {
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
        2.5-inch 패키지 안의 NVMe 경로
      </text>
      <ModuleBox
        x={24}
        y={62}
        w={122}
        h={62}
        label="U.2 SSD"
        sub="metal enclosure"
        color={C.u2}
      />
      <motion.line
        x1={146}
        y1={93}
        x2={183}
        y2={93}
        stroke={C.u2}
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ActionBox
        x={189}
        y={62}
        w={122}
        h={62}
        label="backplane"
        sub="power · presence"
        color={C.hw}
      />
      <motion.line
        x1={311}
        y1={93}
        x2={348}
        y2={93}
        stroke={C.u2}
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ModuleBox
        x={354}
        y={62}
        w={102}
        h={62}
        label="PCIe port"
        sub="typically x4"
        color={C.m2}
      />
      <DataBox
        x={89}
        y={151}
        w={302}
        h={32}
        label="외부 접근성 ≠ 자동 핫플러그 지원"
        color={C.err}
      />
    </g>
  );
}

function Replace() {
  const actions = [
    { x: 15, label: "중복 확인", sub: "service 유지", color: C.ok },
    { x: 132, label: "I/O 제거", sub: "namespace", color: C.m2 },
    { x: 249, label: "slot off", sub: "LED · power", color: C.u2 },
    { x: 366, label: "교체", sub: "rebuild · verify", color: C.e1s },
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
        핫플러그 작업 순서
      </text>
      {actions.map((action, index) => (
        <motion.g key={action.label} {...reveal(0.08 + index * 0.12)}>
          <ActionBox
            x={action.x}
            y={65}
            w={99}
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
        x={85}
        y={151}
        w={310}
        h={34}
        label="제품·서버의 공식 hot-plug 절차를 따름"
        color={C.err}
      />
    </g>
  );
}

function Plp() {
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
        Power Loss Protection의 역할
      </text>
      <DataBox
        x={18}
        y={69}
        w={100}
        h={46}
        label="host writes"
        sub="data + metadata"
        color={C.m2}
      />
      <motion.line
        x1={118}
        y1={92}
        x2={154}
        y2={92}
        stroke={C.m2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ModuleBox
        x={160}
        y={62}
        w={112}
        h={60}
        label="volatile buffer"
        sub="in-flight data"
        color={C.u2}
      />
      <motion.line
        x1={272}
        y1={92}
        x2={308}
        y2={92}
        stroke={C.u2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ModuleBox
        x={314}
        y={62}
        w={144}
        h={60}
        label="NAND"
        sub="persistent state"
        color={C.e1s}
      />
      <motion.path
        d="M216 128 V156 H314"
        fill="none"
        stroke={C.err}
        strokeWidth={1.4}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <DataBox
        x={48}
        y={143}
        w={168}
        h={36}
        label="stored energy"
        sub="전원 손실 시 flush"
        color={C.err}
      />
      <text
        x={386}
        y={166}
        textAnchor="middle"
        fontSize={9}
        fill="var(--muted-foreground)"
      >
        PLP 지원 범위는 제품 사양 확인
      </text>
    </g>
  );
}

function LaneBudget() {
  const bays = [20, 127, 234, 341];
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
        4개 베이 예시 · 총 x16 경로
      </text>
      {bays.map((x, index) => (
        <motion.g key={x} {...reveal(0.08 + index * 0.1)}>
          <ModuleBox
            x={x}
            y={48}
            w={86}
            h={52}
            label={`bay ${index}`}
            sub="PCIe x4"
            color={C.u2}
          />
          <line x1={x + 43} y1={101} x2={x + 43} y2={127} stroke={C.u2} />
        </motion.g>
      ))}
      <ActionBox
        x={80}
        y={130}
        w={320}
        h={48}
        label="CPU root port 또는 PCIe switch"
        sub="레인 · oversubscription · hot-plug 지원 확인"
        color={C.m2}
      />
    </g>
  );
}

const SCENES = [Package, Replace, Plp, LaneBudget];

export default function U2ServiceViz() {
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
