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
    label: "신뢰성은 고장 확률이 아니라 서비스 영향으로 본다",
    body: "어떤 부품이 고장나는지보다 감지·격리·교체·복구까지 서비스가 유지되는지가 중요합니다.",
  },
  {
    label: "ECC는 메모리 오류를 교정하거나 드러낸다",
    body: "교정 가능한 오류는 처리하고, 교정 불가능한 오류는 로그와 경보로 올려 조용한 손상을 줄입니다.",
  },
  {
    label: "이중 전원은 독립된 두 경로여야 한다",
    body: "각 PSU가 전체 부하를 감당하고 별도 전원 피드에 연결되어야 한 경로의 고장을 견딥니다.",
  },
  {
    label: "핫스왑은 복구 시간을 줄이는 수단이다",
    body: "데이터 중복과 상태 감지가 먼저 있고, 교체 후 재빌드와 검증을 거쳐 정상 상태로 돌아옵니다.",
  },
  {
    label: "마지막 판단은 RTO와 장애 예산으로 한다",
    body: "허용 중단 시간과 현장 접근 시간을 기준으로 필요한 중복 계층만 선택합니다.",
  },
];

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 7 },
  animate: { opacity: 1, y: 0 },
  transition: { delay },
});

function FailureBudget() {
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
        failure → detect → contain → recover
      </text>
      <AlertBox
        x={18}
        y={67}
        w={96}
        h={48}
        label="부품 고장"
        sub="예상 가능한 사건"
        color={C.err}
      />
      <ActionBox
        x={133}
        y={67}
        w={96}
        h={48}
        label="감지"
        sub="sensor · log"
        color={C.desktop}
      />
      <ActionBox
        x={248}
        y={67}
        w={96}
        h={48}
        label="격리"
        sub="redundancy"
        color={C.server}
      />
      <ModuleBox
        x={363}
        y={67}
        w={96}
        h={48}
        label="복구"
        sub="replace · rebuild"
        color={C.ok}
      />
      {[114, 229, 344].map((x, i) => (
        <motion.line
          key={x}
          x1={x}
          y1={91}
          x2={x + 18}
          y2={91}
          stroke={C.ok}
          strokeWidth={1.2}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.18 + i * 0.12 }}
        />
      ))}
      <DataBox
        x={103}
        y={149}
        w={274}
        h={32}
        label="목표: 허용 중단 시간 안에 정상 상태로 복귀"
        color={C.ok}
      />
    </g>
  );
}

function Ecc() {
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
        메모리 오류 처리 경로
      </text>
      <DataBox
        x={18}
        y={72}
        w={92}
        h={38}
        label="memory word"
        sub="data + check bits"
        color={C.server}
      />
      <motion.line
        x1={116}
        y1={91}
        x2={153}
        y2={91}
        stroke={C.server}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ActionBox
        x={159}
        y={65}
        w={104}
        h={52}
        label="ECC decode"
        sub="syndrome 계산"
        color={C.server}
      />
      <motion.path
        d="M269 91 H303 M303 91 V55 M303 91 V132"
        fill="none"
        stroke={C.server}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ModuleBox
        x={315}
        y={34}
        w={142}
        h={48}
        label="correctable"
        sub="교정 + 카운터 증가"
        color={C.ok}
      />
      <AlertBox
        x={315}
        y={109}
        w={142}
        h={48}
        label="uncorrectable"
        sub="경보 · 격리 · 중단"
        color={C.err}
      />
      <text
        x={240}
        y={191}
        textAnchor="middle"
        fontSize={9}
        fill="var(--muted-foreground)"
      >
        ECC도 모니터링과 교체 정책이 없으면 운영 신호가 되지 못함
      </text>
    </g>
  );
}

function Power() {
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
        1+1 전원 경로의 조건
      </text>
      <ModuleBox
        x={18}
        y={51}
        w={112}
        h={58}
        label="Feed A"
        sub="PDU · circuit A"
        color={C.server}
      />
      <ModuleBox
        x={18}
        y={128}
        w={112}
        h={58}
        label="Feed B"
        sub="PDU · circuit B"
        color={C.ok}
      />
      <motion.path
        d="M130 80 H177 M130 157 H177"
        stroke={C.server}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <StatusBox
        x={183}
        y={49}
        w={120}
        h={62}
        label="PSU A"
        sub="전체 부하 가능"
        color={C.server}
        progress={0.5}
      />
      <StatusBox
        x={183}
        y={126}
        w={120}
        h={62}
        label="PSU B"
        sub="전체 부하 가능"
        color={C.ok}
        progress={0.5}
      />
      <motion.path
        d="M303 80 H343 V118 M303 157 H343 V118"
        fill="none"
        stroke={C.ok}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ModuleBox
        x={350}
        y={87}
        w={110}
        h={62}
        label="Server load"
        sub="N+1 용량 이내"
        color={C.desktop}
      />
    </g>
  );
}

function DriveRecovery() {
  const stages = [
    { x: 15, label: "degraded", sub: "중복본으로 서비스", color: C.err },
    { x: 132, label: "replace", sub: "핫스왑", color: C.desktop },
    { x: 249, label: "rebuild", sub: "데이터 복원", color: C.server },
    { x: 366, label: "verify", sub: "정상 복귀", color: C.ok },
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
        드라이브 장애 복구 상태 머신
      </text>
      {stages.map((stage, i) => (
        <motion.g key={stage.label} {...enter(0.08 + i * 0.12)}>
          <ModuleBox
            x={stage.x}
            y={65}
            w={99}
            h={58}
            label={stage.label}
            sub={stage.sub}
            color={stage.color}
          />
          {i < stages.length - 1 && (
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
        x={106}
        y={151}
        w={268}
        h={34}
        label="재빌드 중 두 번째 장애와 성능 저하도 예산에 포함"
        color={C.err}
      />
    </g>
  );
}

function Rto() {
  const rows = [
    {
      label: "개발 장비",
      value: "수 시간 허용",
      progress: 0.25,
      color: C.desktop,
    },
    {
      label: "내부 서비스",
      value: "수십 분 이내",
      progress: 0.58,
      color: C.hw,
    },
    {
      label: "24/7 서비스",
      value: "분 단위 복구",
      progress: 0.92,
      color: C.server,
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
        허용 중단 시간이 플랫폼을 결정
      </text>
      {rows.map((row, i) => (
        <motion.g key={row.label} {...enter(0.08 + i * 0.14)}>
          <StatusBox
            x={47}
            y={36 + i * 53}
            w={386}
            h={50}
            label={row.label}
            sub={row.value}
            color={row.color}
            progress={row.progress}
          />
        </motion.g>
      ))}
    </g>
  );
}

const SCENES = [FailureBudget, Ecc, Power, DriveRecovery, Rto];

export default function ReliabilityViz() {
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
