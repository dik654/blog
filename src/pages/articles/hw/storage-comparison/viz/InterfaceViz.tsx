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
    label: "프로토콜·전송·커넥터를 분리해서 읽는다",
    body: "같은 물리 모양이 여러 인터페이스를 담을 수 있으므로 이름 하나로 전체 경로를 추정하지 않습니다.",
  },
  {
    label: "SATA NCQ는 한 장치의 요청을 최대 32개까지 정렬한다",
    body: "얕은 큐가 항상 느린 것은 아니며 낮은 동시성의 순차 작업에서는 장치 매체가 더 큰 병목일 수 있습니다.",
  },
  {
    label: "SAS는 tagged command와 경로 이중화에 집중한다",
    body: "expander와 dual-port target을 이용해 많은 드라이브와 두 개의 호스트 경로를 운영할 수 있습니다.",
  },
  {
    label: "NVMe는 메모리의 SQ/CQ 쌍으로 CPU 병렬성을 받는다",
    body: "호스트가 명령을 Submission Queue에 넣고 컨트롤러가 Completion Queue에 결과를 기록합니다.",
  },
  {
    label: "큐 상한 대신 실제 QD와 tail latency를 측정한다",
    body: "애플리케이션이 만드는 동시성과 장치의 정상 상태를 재현해 p99 지연시간과 CPU 비용을 비교합니다.",
  },
];

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 7 },
  animate: { opacity: 1, y: 0 },
  transition: { delay },
});

function Terms() {
  const columns = [
    { x: 18, label: "Command", sub: "ATA · SCSI · NVMe", color: C.nvme },
    { x: 174, label: "Transport", sub: "SATA · SAS · PCIe", color: C.sas },
    { x: 330, label: "Package", sub: "2.5in · M.2 · EDSFF", color: C.ok },
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
        서로 다른 선택 층
      </text>
      {columns.map((item, index) => (
        <motion.g key={item.label} {...reveal(0.08 + index * 0.14)}>
          <ModuleBox
            x={item.x}
            y={55}
            w={132}
            h={66}
            label={item.label}
            sub={item.sub}
            color={item.color}
          />
        </motion.g>
      ))}
      <DataBox
        x={74}
        y={151}
        w={332}
        h={32}
        label="서버 지원표에서 세 층의 조합을 함께 확인"
        color={C.info}
      />
    </g>
  );
}

function AhciQueue() {
  const slots = Array.from({ length: 8 }, (_, index) => index);
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
        SATA NCQ · 하나의 대기열
      </text>
      <ModuleBox
        x={20}
        y={61}
        w={100}
        h={58}
        label="AHCI port"
        sub="single device"
        color={C.sata}
      />
      <motion.line
        x1={120}
        y1={90}
        x2={150}
        y2={90}
        stroke={C.sata}
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      {slots.map((slot) => (
        <motion.g key={slot} {...reveal(0.08 + slot * 0.05)}>
          <rect
            x={154 + slot * 32}
            y={72}
            width={26}
            height={36}
            rx={4}
            fill={`${C.sata}12`}
            stroke={C.sata}
          />
          <text
            x={167 + slot * 32}
            y={95}
            textAnchor="middle"
            fontSize={8}
            fill={C.sata}
          >
            {slot + 1}
          </text>
        </motion.g>
      ))}
      <text
        x={282}
        y={127}
        textAnchor="middle"
        fontSize={9}
        fill="var(--muted-foreground)"
      >
        일부 슬롯만 표현 · 규격상 최대 32 outstanding
      </text>
      <DataBox
        x={99}
        y={153}
        w={282}
        h={30}
        label="낮은 QD에서는 매체 지연이 더 중요할 수 있음"
        color={C.sata}
      />
    </g>
  );
}

function SasPaths() {
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
        SAS · tagged I/O와 두 경로
      </text>
      <ModuleBox
        x={24}
        y={47}
        w={112}
        h={54}
        label="controller A"
        sub="active path"
        color={C.sas}
      />
      <ModuleBox
        x={24}
        y={126}
        w={112}
        h={54}
        label="controller B"
        sub="standby / active"
        color={C.info}
      />
      <motion.path
        d="M136 74 H194 V112 M136 153 H194 V112"
        fill="none"
        stroke={C.sas}
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ModuleBox
        x={200}
        y={81}
        w={112}
        h={62}
        label="dual-port target"
        sub="SCSI commands"
        color={C.sas}
      />
      <motion.line
        x1={312}
        y1={112}
        x2={345}
        y2={112}
        stroke={C.sas}
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ActionBox
        x={351}
        y={83}
        w={108}
        h={58}
        label="multipath"
        sub="failover policy"
        color={C.ok}
      />
      <text
        x={240}
        y={193}
        textAnchor="middle"
        fontSize={9}
        fill="var(--muted-foreground)"
      >
        드라이브·백플레인·컨트롤러가 모두 dual-path를 지원해야 함
      </text>
    </g>
  );
}

function NvmeQueues() {
  const rows = [
    { y: 45, label: "CPU 0 → SQ 0 / CQ 0", color: C.nvme, progress: 0.82 },
    { y: 98, label: "CPU 1 → SQ 1 / CQ 1", color: C.info, progress: 0.61 },
    { y: 151, label: "CPU 2 → SQ 2 / CQ 2", color: C.ok, progress: 0.43 },
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
        메모리에 놓인 NVMe queue pairs
      </text>
      {rows.map((row, index) => (
        <motion.g key={row.label} {...reveal(0.08 + index * 0.14)}>
          <StatusBox
            x={50}
            y={row.y}
            w={380}
            h={48}
            label={row.label}
            sub="host memory · DMA"
            color={row.color}
            progress={row.progress}
          />
        </motion.g>
      ))}
    </g>
  );
}

function Measure() {
  const metrics = [
    { x: 18, label: "actual QD", sub: "application", color: C.info },
    { x: 174, label: "p99 latency", sub: "steady state", color: C.err },
    { x: 330, label: "CPU / IOPS", sub: "host overhead", color: C.nvme },
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
        운영 부하로 검증할 세 지표
      </text>
      {metrics.map((metric, index) => (
        <motion.g key={metric.label} {...reveal(0.08 + index * 0.14)}>
          <ModuleBox
            x={metric.x}
            y={58}
            w={132}
            h={62}
            label={metric.label}
            sub={metric.sub}
            color={metric.color}
          />
        </motion.g>
      ))}
      <AlertBox
        x={74}
        y={149}
        w={332}
        h={34}
        label="최대 큐 개수는 실서비스 처리량 보장이 아님"
        color={C.err}
      />
    </g>
  );
}

const SCENES = [Terms, AhciQueue, SasPaths, NvmeQueues, Measure];

export default function InterfaceViz() {
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
