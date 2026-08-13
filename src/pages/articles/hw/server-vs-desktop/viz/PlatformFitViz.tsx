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
    label: "CPU보다 먼저 작업의 모양을 적는다",
    body: "지연시간, 병렬 작업 수, 메모리 작업 집합, 연결 장치를 각각 수치로 분리합니다.",
  },
  {
    label: "CPU 직결 PCIe 예산을 장치별로 배분한다",
    body: "GPU·NVMe·고속 NIC가 동시에 필요하면 슬롯뿐 아니라 레인과 스위치 토폴로지를 봐야 합니다.",
  },
  {
    label: "메모리 채널은 코어에 데이터를 공급한다",
    body: "코어가 많아도 채널과 NUMA 배치가 맞지 않으면 메모리 대기 시간이 처리량을 제한합니다.",
  },
  {
    label: "요구량을 만족하는 가장 작은 플랫폼을 고른다",
    body: "데스크톱에서 시작해 I/O·메모리·운영 요구가 넘을 때 워크스테이션이나 서버로 이동합니다.",
  },
];

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 7 },
  animate: { opacity: 1, y: 0 },
  transition: { delay },
});

function WorkloadShape() {
  const metrics = [
    {
      label: "응답 지연",
      sub: "single-thread",
      color: C.desktop,
      progress: 0.7,
    },
    {
      label: "병렬 작업",
      sub: "jobs in flight",
      color: C.server,
      progress: 0.86,
    },
    { label: "작업 집합", sub: "RAM capacity", color: C.hw, progress: 0.62 },
    {
      label: "연결 장치",
      sub: "GPU · NVMe · NIC",
      color: C.ok,
      progress: 0.78,
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
        워크로드 요구량 분해
      </text>
      {metrics.map((metric, i) => (
        <motion.g key={metric.label} {...reveal(0.08 + i * 0.1)}>
          <StatusBox
            x={18 + (i % 2) * 231}
            y={46 + Math.floor(i / 2) * 70}
            w={213}
            h={56}
            label={metric.label}
            sub={metric.sub}
            color={metric.color}
            progress={metric.progress}
          />
        </motion.g>
      ))}
      <text
        x={240}
        y={193}
        textAnchor="middle"
        fontSize={9}
        fill="var(--muted-foreground)"
      >
        제품명 비교 전에 필요한 자원의 상한부터 기록
      </text>
    </g>
  );
}

function LaneBudget() {
  const devices = [
    { x: 20, label: "GPU", sub: "x16", color: C.server },
    { x: 122, label: "NVMe 0", sub: "x4", color: C.desktop },
    { x: 224, label: "NVMe 1", sub: "x4", color: C.desktop },
    { x: 326, label: "100G NIC", sub: "x8", color: C.ok },
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
        예시 · 직결 장치에 x32 필요
      </text>
      {devices.map((device, i) => (
        <motion.g key={device.label} {...reveal(0.08 + i * 0.1)}>
          <DataBox
            x={device.x}
            y={48}
            w={86}
            h={40}
            label={device.label}
            sub={device.sub}
            color={device.color}
          />
          <line
            x1={device.x + 43}
            y1={91}
            x2={device.x + 43}
            y2={119}
            stroke={device.color}
            strokeWidth={1.5}
          />
        </motion.g>
      ))}
      <motion.g {...reveal(0.52)}>
        <ModuleBox
          x={63}
          y={122}
          w={354}
          h={48}
          label="CPU root complex"
          sub="직결 레인 · bifurcation · switch 확인"
          color={C.server}
        />
      </motion.g>
      <text
        x={240}
        y={193}
        textAnchor="middle"
        fontSize={9}
        fill="var(--muted-foreground)"
      >
        칩셋 경유 장치는 업링크를 공유할 수 있음
      </text>
    </g>
  );
}

function MemoryPath() {
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
        코어 수와 메모리 공급 경로
      </text>
      <motion.g {...reveal(0.08)}>
        <ModuleBox
          x={22}
          y={55}
          w={125}
          h={60}
          label="Desktop socket"
          sub="2 memory channels"
          color={C.desktop}
        />
        <StatusBox
          x={22}
          y={130}
          w={125}
          h={50}
          label="낮은 지연"
          sub="작은 작업 집합"
          color={C.desktop}
          progress={0.48}
        />
      </motion.g>
      <motion.g {...reveal(0.28)}>
        <ModuleBox
          x={177}
          y={55}
          w={125}
          h={60}
          label="Server socket"
          sub="다채널 DDR5"
          color={C.server}
        />
        <StatusBox
          x={177}
          y={130}
          w={125}
          h={50}
          label="높은 공급 폭"
          sub="많은 코어·장치"
          color={C.server}
          progress={0.9}
        />
      </motion.g>
      <motion.g {...reveal(0.48)}>
        <AlertBox
          x={332}
          y={55}
          w={126}
          h={60}
          label="2-socket NUMA"
          sub="원격 메모리 경로"
          color={C.err}
        />
        <DataBox
          x={332}
          y={139}
          w={126}
          h={30}
          label="스레드·메모리 고정"
          color={C.ok}
        />
      </motion.g>
    </g>
  );
}

function SelectPlatform() {
  const choices = [
    { x: 18, label: "Desktop", sub: "단일 GPU · 2채널", color: C.desktop },
    { x: 174, label: "Workstation", sub: "중간 I/O · ECC", color: C.hw },
    { x: 330, label: "Server", sub: "대용량 · 원격 운영", color: C.server },
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
        후보를 단계적으로 확장
      </text>
      {choices.map((choice, i) => (
        <motion.g key={choice.label} {...reveal(0.08 + i * 0.14)}>
          <ModuleBox
            x={choice.x}
            y={58}
            w={132}
            h={66}
            label={choice.label}
            sub={choice.sub}
            color={choice.color}
          />
        </motion.g>
      ))}
      <motion.path
        d="M84 133 H396"
        stroke={C.ok}
        strokeWidth={2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.5 }}
      />
      <motion.g {...reveal(0.68)}>
        <DataBox
          x={98}
          y={151}
          w={284}
          h={32}
          label="측정값이 경계를 넘을 때만 오른쪽으로 이동"
          color={C.ok}
        />
      </motion.g>
    </g>
  );
}

const SCENES = [WorkloadShape, LaneBudget, MemoryPath, SelectPlatform];

export default function PlatformFitViz() {
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
