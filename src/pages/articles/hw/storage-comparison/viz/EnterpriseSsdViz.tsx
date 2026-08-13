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
    label: "DWPD는 보증 기간 안의 쓰기 예산이다",
    body: "하루 쓰기량을 용량으로 나눠 필요한 DWPD를 구하고, 데이터시트의 workload와 warranty 조건을 함께 확인합니다.",
  },
  {
    label: "PLP는 갑작스러운 전원 손실의 쓰기 경로를 보호한다",
    body: "저장 에너지를 이용해 진행 중인 데이터와 메타데이터를 비휘발성 매체에 일관되게 마무리합니다.",
  },
  {
    label: "Over-provisioning은 쓰기 증폭과 정상 상태를 조정한다",
    body: "여유 NAND가 garbage collection과 wear leveling에 선택지를 주지만 최적 비율은 제품과 workload마다 다릅니다.",
  },
  {
    label: "평균 IOPS보다 tail latency와 QoS를 본다",
    body: "혼합 읽기·쓰기와 장시간 부하에서 p99 지연시간이 서비스 제한 안에 들어오는지 확인합니다.",
  },
  {
    label: "마지막 선택은 실측·관찰·복구 절차까지 확인해 확정한다",
    body: "펌웨어를 고정하고 SMART·NVMe log를 수집하며 전원 손실과 장치 교체를 시험합니다.",
  },
];

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 7 },
  animate: { opacity: 1, y: 0 },
  transition: { delay },
});

function WriteBudget() {
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
        일일 쓰기량에서 endurance 역산
      </text>
      <DataBox
        x={20}
        y={61}
        w={112}
        h={52}
        label="daily writes"
        sub="host TB/day"
        color={C.info}
      />
      <text
        x={147}
        y={93}
        textAnchor="middle"
        fontSize={14}
        fontWeight={700}
        fill="var(--muted-foreground)"
      >
        ÷
      </text>
      <DataBox
        x={162}
        y={61}
        w={112}
        h={52}
        label="drive capacity"
        sub="usable TB"
        color={C.sata}
      />
      <text
        x={289}
        y={93}
        textAnchor="middle"
        fontSize={14}
        fontWeight={700}
        fill="var(--muted-foreground)"
      >
        =
      </text>
      <ModuleBox
        x={304}
        y={57}
        w={156}
        h={60}
        label="required DWPD"
        sub="여유율 포함"
        color={C.nvme}
      />
      <motion.path
        d="M98 132 H382"
        stroke={C.ok}
        strokeWidth={2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <DataBox
        x={70}
        y={153}
        w={340}
        h={30}
        label="보증 연수 · workload 정의 · TBW 조건도 함께 확인"
        color={C.ok}
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
        전원 손실 시 SSD 내부 경로
      </text>
      <DataBox
        x={20}
        y={66}
        w={104}
        h={48}
        label="host write"
        sub="ack policy"
        color={C.info}
      />
      <motion.line
        x1={124}
        y1={90}
        x2={158}
        y2={90}
        stroke={C.info}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ModuleBox
        x={164}
        y={60}
        w={116}
        h={60}
        label="buffer + map"
        sub="volatile state"
        color={C.sas}
      />
      <motion.line
        x1={280}
        y1={90}
        x2={314}
        y2={90}
        stroke={C.sas}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ModuleBox
        x={320}
        y={60}
        w={140}
        h={60}
        label="NAND"
        sub="persistent state"
        color={C.ok}
      />
      <motion.path
        d="M222 126 V157 H320"
        fill="none"
        stroke={C.err}
        strokeWidth={1.4}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <DataBox
        x={44}
        y={143}
        w={178}
        h={38}
        label="stored energy"
        sub="flush on power loss"
        color={C.err}
      />
      <text
        x={389}
        y={164}
        textAnchor="middle"
        fontSize={9}
        fill="var(--muted-foreground)"
      >
        보호 범위는 제품별 검증
      </text>
    </g>
  );
}

function OverProvisioning() {
  const blocks = [
    { x: 27, label: "host data", progress: 0.82, color: C.nvme },
    { x: 177, label: "free pool", progress: 0.52, color: C.ok },
    { x: 327, label: "GC work", progress: 0.34, color: C.sas },
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
        여유 NAND가 만드는 선택 공간
      </text>
      {blocks.map((block, index) => (
        <motion.g key={block.label} {...reveal(0.08 + index * 0.14)}>
          <StatusBox
            x={block.x}
            y={58}
            w={126}
            h={62}
            label={block.label}
            sub="steady-state"
            color={block.color}
            progress={block.progress}
          />
        </motion.g>
      ))}
      <ActionBox
        x={82}
        y={151}
        w={316}
        h={34}
        label="wear leveling · garbage collection · spare replacement"
        color={C.ok}
      />
    </g>
  );
}

function Qos() {
  const rows = [
    {
      y: 42,
      label: "평균 latency",
      sub: "대부분의 요청",
      progress: 0.35,
      color: C.ok,
    },
    {
      y: 95,
      label: "p99 latency",
      sub: "느린 1% 요청",
      progress: 0.68,
      color: C.sas,
    },
    {
      y: 148,
      label: "timeout budget",
      sub: "서비스 상한",
      progress: 0.9,
      color: C.err,
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
        평균보다 꼬리 지연시간 관리
      </text>
      {rows.map((row, index) => (
        <motion.g key={row.label} {...reveal(0.08 + index * 0.14)}>
          <StatusBox
            x={54}
            y={row.y}
            w={372}
            h={48}
            label={row.label}
            sub={row.sub}
            color={row.color}
            progress={row.progress}
          />
        </motion.g>
      ))}
    </g>
  );
}

function Qualify() {
  const actions = [
    { x: 16, label: "measure", sub: "real workload", color: C.info },
    { x: 132, label: "observe", sub: "logs · health", color: C.nvme },
    { x: 248, label: "inject", sub: "power · path fault", color: C.err },
    { x: 364, label: "recover", sub: "replace · rebuild", color: C.ok },
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
        운영 적합성 검증 루프
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
        x={87}
        y={151}
        w={306}
        h={34}
        label="데이터시트는 검증 시작점이지 운영 보장이 아님"
        color={C.err}
      />
    </g>
  );
}

const SCENES = [WriteBudget, Plp, OverProvisioning, Qos, Qualify];

export default function EnterpriseSsdViz() {
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
