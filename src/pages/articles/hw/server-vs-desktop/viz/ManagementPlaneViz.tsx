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
    label: "BMC는 호스트 OS와 별도의 관리 컴퓨터다",
    body: "대기 전원과 관리 NIC를 사용해 센서·전원·원격 콘솔을 호스트 장애와 분리합니다.",
  },
  {
    label: "물리 슬롯보다 PCIe 토폴로지가 중요하다",
    body: "CPU 직결, 칩셋 업링크, PCIe 스위치가 각 슬롯의 실제 대역폭과 장애 범위를 결정합니다.",
  },
  {
    label: "듀얼 소켓은 자원을 늘리지만 NUMA도 만든다",
    body: "각 CPU에 로컬 메모리와 장치가 붙으므로 스레드·메모리·GPU 배치를 함께 설계해야 합니다.",
  },
  {
    label: "핫스왑은 커넥터가 아니라 전체 교체 경로다",
    body: "백플레인, 컨트롤러, 중복 데이터, 재빌드 절차가 모두 준비되어야 무중단 교체가 됩니다.",
  },
];

const show = (delay: number) => ({
  initial: { opacity: 0, y: 7 },
  animate: { opacity: 1, y: 0 },
  transition: { delay },
});

function Bmc() {
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
        out-of-band 관리 경로
      </text>
      <motion.g {...show(0.08)}>
        <ModuleBox
          x={24}
          y={58}
          w={120}
          h={62}
          label="Host CPU + OS"
          sub="서비스 경로"
          color={C.desktop}
        />
      </motion.g>
      <motion.g {...show(0.24)}>
        <ModuleBox
          x={180}
          y={52}
          w={120}
          h={74}
          label="BMC"
          sub="센서 · 전원 · KVM"
          color={C.server}
        />
      </motion.g>
      <motion.g {...show(0.4)}>
        <ModuleBox
          x={336}
          y={58}
          w={120}
          h={62}
          label="관리 콘솔"
          sub="Redfish · IPMI"
          color={C.ok}
        />
      </motion.g>
      <motion.path
        d="M144 89 H180 M300 89 H336"
        stroke={C.server}
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <motion.g {...show(0.6)}>
        <AlertBox
          x={112}
          y={150}
          w={256}
          h={34}
          label="호스트가 멈춰도 관리 경로는 유지"
          color={C.server}
        />
      </motion.g>
    </g>
  );
}

function Topology() {
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
        슬롯 아래에 숨은 경로
      </text>
      <ModuleBox
        x={178}
        y={42}
        w={124}
        h={50}
        label="CPU root"
        sub="직결 PCIe"
        color={C.server}
      />
      <motion.path
        d="M240 93 V112 H78 V132 M240 112 H198 V132 M240 112 H342 V132 M240 112 H438 V132"
        fill="none"
        stroke={C.server}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <DataBox x={25} y={135} w={106} h={34} label="GPU x16" color={C.server} />
      <DataBox x={145} y={135} w={106} h={34} label="NIC x16" color={C.ok} />
      <DataBox
        x={289}
        y={135}
        w={106}
        h={34}
        label="PCIe switch"
        color={C.hw}
      />
      <DataBox x={407} y={135} w={52} h={34} label="NVMe" color={C.desktop} />
      <text
        x={240}
        y={193}
        textAnchor="middle"
        fontSize={9}
        fill="var(--muted-foreground)"
      >
        공유 업링크와 oversubscription 비율 확인
      </text>
    </g>
  );
}

function Numa() {
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
        두 소켓은 하나의 균일한 메모리가 아님
      </text>
      <ModuleBox
        x={25}
        y={58}
        w={128}
        h={58}
        label="Socket 0"
        sub="local RAM + GPU 0"
        color={C.server}
      />
      <ModuleBox
        x={327}
        y={58}
        w={128}
        h={58}
        label="Socket 1"
        sub="local RAM + GPU 1"
        color={C.server}
      />
      <motion.path
        d="M153 87 H327"
        stroke={C.err}
        strokeWidth={2}
        strokeDasharray="5 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <DataBox
        x={190}
        y={68}
        w={100}
        h={38}
        label="socket link"
        sub="원격 접근"
        color={C.err}
      />
      <motion.g {...show(0.45)}>
        <ActionBox
          x={58}
          y={145}
          w={156}
          h={34}
          label="thread affinity"
          color={C.ok}
        />
        <ActionBox
          x={266}
          y={145}
          w={156}
          h={34}
          label="memory placement"
          color={C.ok}
        />
      </motion.g>
    </g>
  );
}

function HotSwap() {
  const steps = [
    { x: 15, label: "중복본", sub: "RAID · replica", color: C.server },
    { x: 130, label: "장애 감지", sub: "health event", color: C.err },
    { x: 245, label: "핫스왑", sub: "backplane", color: C.desktop },
    { x: 360, label: "재빌드", sub: "검증 후 복귀", color: C.ok },
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
        무중단 교체의 전체 조건
      </text>
      {steps.map((step, i) => (
        <motion.g key={step.label} {...show(0.08 + i * 0.12)}>
          <ModuleBox
            x={step.x}
            y={62}
            w={104}
            h={58}
            label={step.label}
            sub={step.sub}
            color={step.color}
          />
          {i < steps.length - 1 && (
            <line
              x1={step.x + 106}
              y1={91}
              x2={step.x + 113}
              y2={91}
              stroke="var(--muted-foreground)"
            />
          )}
        </motion.g>
      ))}
      <motion.g {...show(0.65)}>
        <DataBox
          x={91}
          y={149}
          w={298}
          h={32}
          label="교체 중에도 읽을 수 있는 데이터 경로가 먼저"
          color={C.ok}
        />
      </motion.g>
    </g>
  );
}

const SCENES = [Bmc, Topology, Numa, HotSwap];

export default function ManagementPlaneViz() {
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
