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
    label: "Filecoin은 수명이 다른 저장 경로를 동시에 사용한다",
    body: "sealing scratch, sealed·unsealed sector, chain·miner metadata를 같은 디스크 등급으로 묶지 않습니다.",
  },
  {
    label: "Sealing scratch는 짧은 수명과 높은 쓰기 처리량이 중요하다",
    body: "동시 sector 작업의 scratch 합계와 정상 상태 쓰기량을 기준으로 빠른 SSD 용량과 endurance를 잡습니다.",
  },
  {
    label: "Proving과 retrieval은 장기 데이터의 접근 지연을 제한한다",
    body: "sealed sector는 증명에서 낮은 지연으로 읽혀야 하고 unsealed copy는 retrieval 정책에 따라 별도 용량을 소비합니다.",
  },
  {
    label: "Worker와 sector storage 사이의 네트워크도 저장 경로다",
    body: "로컬 NVMe가 빨라도 이동 경로가 포화되면 pipeline이 멈추므로 동시 작업의 총 전송량으로 링크를 설계합니다.",
  },
  {
    label: "백업과 복구 시간을 포함해 계층을 확정한다",
    body: "sectorstore 설정과 miner state, sealed·cache·unsealed 데이터의 복구 방법을 정하고 장애 훈련으로 검증합니다.",
  },
];

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 7 },
  animate: { opacity: 1, y: 0 },
  transition: { delay },
});

function Paths() {
  const paths = [
    { x: 15, label: "scratch", sub: "temporary · write-heavy", color: C.nvme },
    { x: 132, label: "sealed", sub: "durable · proving", color: C.sas },
    { x: 249, label: "unsealed", sub: "retrieval policy", color: C.info },
    { x: 366, label: "metadata", sub: "small · critical", color: C.err },
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
        서로 다른 수명과 실패 비용
      </text>
      {paths.map((path, index) => (
        <motion.g key={path.label} {...reveal(0.08 + index * 0.12)}>
          <ModuleBox
            x={path.x}
            y={58}
            w={99}
            h={66}
            label={path.label}
            sub={path.sub}
            color={path.color}
          />
        </motion.g>
      ))}
      <DataBox
        x={82}
        y={153}
        w={316}
        h={32}
        label="용량 · 지연 · 쓰기량 · 복구 목표를 경로별 계산"
        color={C.ok}
      />
    </g>
  );
}

function Scratch() {
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
        동시 sealing 작업의 scratch 예산
      </text>
      <DataBox
        x={20}
        y={63}
        w={112}
        h={50}
        label="sector size"
        sub="per job"
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
        ×
      </text>
      <DataBox
        x={162}
        y={63}
        w={112}
        h={50}
        label="scratch factor"
        sub="pipeline stage"
        color={C.sas}
      />
      <text
        x={289}
        y={93}
        textAnchor="middle"
        fontSize={14}
        fontWeight={700}
        fill="var(--muted-foreground)"
      >
        ×
      </text>
      <DataBox
        x={304}
        y={63}
        w={156}
        h={50}
        label="concurrent jobs"
        sub="scheduler limit"
        color={C.nvme}
      />
      <motion.path
        d="M96 133 H384"
        stroke={C.ok}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <StatusBox
        x={90}
        y={147}
        w={300}
        h={48}
        label="scratch capacity + headroom"
        sub="steady write · DWPD · failure restart"
        color={C.ok}
        progress={0.78}
      />
    </g>
  );
}

function LongTerm() {
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
        장기 sector의 두 읽기 경로
      </text>
      <ModuleBox
        x={20}
        y={66}
        w={128}
        h={62}
        label="sealed sectors"
        sub="proof source"
        color={C.sas}
      />
      <motion.path
        d="M148 97 H201 M201 97 V67 M201 97 V147"
        fill="none"
        stroke={C.sas}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ActionBox
        x={213}
        y={42}
        w={116}
        h={54}
        label="proving"
        sub="deadline · latency"
        color={C.err}
      />
      <ActionBox
        x={213}
        y={121}
        w={116}
        h={54}
        label="retrieval"
        sub="unsealed copy"
        color={C.info}
      />
      <motion.line
        x1={329}
        y1={69}
        x2={363}
        y2={69}
        stroke={C.err}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <motion.line
        x1={329}
        y1={148}
        x2={363}
        y2={148}
        stroke={C.info}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ModuleBox
        x={369}
        y={74}
        w={91}
        h={70}
        label="service"
        sub="proof + data"
        color={C.ok}
      />
      <text
        x={240}
        y={193}
        textAnchor="middle"
        fontSize={9}
        fill="var(--muted-foreground)"
      >
        용량 비용과 proof/retrieval 지연을 함께 최적화
      </text>
    </g>
  );
}

function NetworkPath() {
  const stages = [
    { x: 16, label: "worker", sub: "PC1 · PC2", color: C.nvme },
    { x: 132, label: "scratch", sub: "local fast SSD", color: C.info },
    { x: 248, label: "network", sub: "aggregate flow", color: C.err },
    { x: 364, label: "sector store", sub: "durable pool", color: C.sas },
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
        sector 이동의 종단 경로
      </text>
      {stages.map((stage, index) => (
        <motion.g key={stage.label} {...reveal(0.08 + index * 0.12)}>
          <ActionBox
            x={stage.x}
            y={65}
            w={100}
            h={58}
            label={stage.label}
            sub={stage.sub}
            color={stage.color}
          />
          {index < stages.length - 1 && (
            <line
              x1={stage.x + 101}
              y1={94}
              x2={stage.x + 115}
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
        label="링크는 모든 동시 작업의 합산 전송량으로 검증"
        color={C.err}
      />
    </g>
  );
}

function Recovery() {
  const rows = [
    {
      y: 42,
      label: "miner state + config",
      sub: "작고 복구에 필수",
      progress: 0.96,
      color: C.err,
    },
    {
      y: 95,
      label: "sealed / unsealed",
      sub: "용량 큼 · 접근성 중요",
      progress: 0.72,
      color: C.sas,
    },
    {
      y: 148,
      label: "cache / scratch",
      sub: "재생성 비용과 시간 평가",
      progress: 0.48,
      color: C.nvme,
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
        데이터별 복구 우선순위
      </text>
      {rows.map((row, index) => (
        <motion.g key={row.label} {...reveal(0.08 + index * 0.14)}>
          <StatusBox
            x={52}
            y={row.y}
            w={376}
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

const SCENES = [Paths, Scratch, LongTerm, NetworkPath, Recovery];

export default function FilecoinStorageViz() {
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
