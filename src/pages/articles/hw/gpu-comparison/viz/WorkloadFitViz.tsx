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
    label: "먼저 최대 작업 집합을 VRAM에 넣을 수 있는 후보만 남김",
    body: "회로 크기·배치 크기·라이브러리 버퍼가 바뀌면 같은 prover도 필요한 용량이 달라짐",
  },
  {
    label: "MSM은 점과 스칼라를 읽어 버킷에 흩어 모으는 과정",
    body: "대역폭과 불규칙 메모리 접근, 버킷 누적 커널의 균형이 중요",
  },
  {
    label: "NTT는 butterfly 연산과 단계마다 이어지는 메모리 재배치",
    body: "코어 수만이 아니라 유효 대역폭·공유 메모리·커널 융합이 처리량을 결정",
  },
  {
    label: "실제 prover는 NTT·MSM·해시·전송이 이어진 파이프라인",
    body: "가장 느린 한 단계와 CPU↔GPU 경계가 종단 시간을 지배",
  },
  {
    label: "다중 GPU의 이득은 분할 가능한 일과 합산 비용의 차이",
    body: "독립 증명은 수평 확장이 쉽고, 한 증명의 잦은 합산은 interconnect에 민감",
  },
  {
    label: "정답 GPU 대신 재현 가능한 선택 절차를 남김",
    body: "실제 입력으로 peak VRAM·커널 시간·전송 시간·전력 제한 후 클럭을 함께 기록",
  },
];

function CapacityGate() {
  const candidates = [
    { label: "4090", value: 24, x: 24, color: C.consumer },
    { label: "5090", value: 32, x: 134, color: C.memory },
    { label: "A100", value: 80, x: 244, color: C.datacenter },
    { label: "H100", value: 80, x: 354, color: C.compute },
  ];
  return (
    <g>
      <text
        x={240}
        y={18}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill="var(--foreground)"
      >
        예시 · peak working set 30GB
      </text>
      {candidates.map((gpu, i) => (
        <motion.g
          key={gpu.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <StatusBox
            x={gpu.x}
            y={49}
            w={102}
            h={61}
            label={`${gpu.label} · ${gpu.value}GB`}
            sub={gpu.value >= 30 ? "용량 통과" : "용량 부족"}
            color={gpu.value >= 30 ? C.ok : C.danger}
            progress={Math.min(gpu.value / 80, 1)}
          />
          <circle
            cx={gpu.x + 51}
            cy={133}
            r={12}
            fill={gpu.value >= 30 ? `${C.ok}22` : `${C.danger}22`}
            stroke={gpu.value >= 30 ? C.ok : C.danger}
          />
          <text
            x={gpu.x + 51}
            y={137}
            textAnchor="middle"
            fontSize={10}
            fontWeight={700}
            fill={gpu.value >= 30 ? C.ok : C.danger}
          >
            {gpu.value >= 30 ? "✓" : "×"}
          </text>
        </motion.g>
      ))}
      <text
        x={240}
        y={171}
        textAnchor="middle"
        fontSize={8.5}
        fill="var(--muted-foreground)"
      >
        실제 30GB 요구량이라는 뜻이 아니라 선택 절차를 보여주는 예시
      </text>
      <text
        x={240}
        y={189}
        textAnchor="middle"
        fontSize={8.5}
        fontWeight={700}
        fill={C.danger}
      >
        프로젝트별 메모리 프로파일을 직접 측정
      </text>
    </g>
  );
}

function Msm() {
  const points = Array.from({ length: 6 });
  return (
    <g>
      <text
        x={240}
        y={18}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill="var(--foreground)"
      >
        MSM · multi-scalar multiplication
      </text>
      <DataBox
        x={22}
        y={45}
        w={94}
        label="curve points"
        sub="P₀ … Pₙ"
        color={C.memory}
      />
      <DataBox
        x={22}
        y={112}
        w={94}
        label="scalars"
        sub="s₀ … sₙ"
        color={C.compute}
      />
      {points.map((_, i) => (
        <motion.circle
          key={i}
          cx={145}
          cy={50 + i * 22}
          r={5}
          fill={i % 2 ? C.memory : C.compute}
          initial={false}
          animate={{ cx: 145, opacity: 1 }}
          transition={{ delay: i * 0.07 }}
        />
      ))}
      <ModuleBox
        x={181}
        y={70}
        w={116}
        h={62}
        label="Pippenger"
        sub="window → bucket"
        color={C.datacenter}
      />
      {[0, 1, 2, 3].map((i) => (
        <motion.path
          key={i}
          d={`M299 90 C330 ${60 + i * 30} 347 ${60 + i * 30} 369 ${60 + i * 30}`}
          fill="none"
          stroke={C.datacenter}
          strokeWidth={1.5}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.25 + i * 0.1 }}
        />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <DataBox
          key={i}
          x={371}
          y={42 + i * 34}
          w={82}
          h={26}
          label={`bucket ${i}`}
          color={C.datacenter}
        />
      ))}
      <text
        x={240}
        y={187}
        textAnchor="middle"
        fontSize={8.5}
        fill="var(--muted-foreground)"
      >
        연속 읽기 + 불규칙 누적 · 대역폭 수치만으로 커널 성능 확정 불가
      </text>
    </g>
  );
}

function Ntt() {
  const ys = [54, 89, 124, 159];
  return (
    <g>
      <text
        x={240}
        y={18}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill="var(--foreground)"
      >
        NTT · number theoretic transform
      </text>
      {[0, 1, 2, 3].map((stage) => {
        const x = 42 + stage * 122;
        return (
          <g key={stage}>
            <text
              x={x}
              y={37}
              textAnchor="middle"
              fontSize={8}
              fill="var(--muted-foreground)"
            >
              stage {stage}
            </text>
            {ys.map((y, i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={5}
                fill={stage % 2 ? C.memory : C.compute}
              />
            ))}
          </g>
        );
      })}
      {[0, 1, 2].flatMap((stage) =>
        ys.map((y, i) => {
          const fromX = 47 + stage * 122;
          const toX = 37 + (stage + 1) * 122;
          const targetY = ys[i ^ (1 << Math.min(stage, 1))];
          return (
            <motion.path
              key={`${stage}-${i}`}
              d={`M${fromX} ${y} C${fromX + 40} ${y} ${toX - 40} ${targetY} ${toX} ${targetY}`}
              fill="none"
              stroke={stage % 2 ? C.memory : C.compute}
              strokeWidth={1.3}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: stage * 0.2 + i * 0.04 }}
            />
          );
        }),
      )}
      <AlertBox
        x={167}
        y={165}
        w={146}
        h={28}
        label="stage 경계마다 load · store"
        color={C.danger}
      />
    </g>
  );
}

function Pipeline() {
  const stages = [
    { x: 14, label: "witness", sub: "CPU?", color: C.neutral },
    { x: 108, label: "NTT", sub: "GPU", color: C.compute },
    { x: 202, label: "MSM", sub: "GPU", color: C.memory },
    { x: 296, label: "hash", sub: "CPU/GPU", color: C.datacenter },
    { x: 390, label: "proof", sub: "output", color: C.ok },
  ];
  return (
    <g>
      <text
        x={240}
        y={18}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill="var(--foreground)"
      >
        종단 지연은 단계의 합
      </text>
      {stages.map((stage, i) => (
        <motion.g
          key={stage.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.12 }}
        >
          <ModuleBox
            x={stage.x}
            y={65}
            w={76}
            h={53}
            label={stage.label}
            sub={stage.sub}
            color={stage.color}
          />
          {i < stages.length - 1 && (
            <path
              d={`M${stage.x + 77} 91 H${stage.x + 92}`}
              stroke="var(--muted-foreground)"
              strokeWidth={1.5}
            />
          )}
        </motion.g>
      ))}
      <StatusBox
        x={112}
        y={136}
        w={256}
        h={48}
        label="profile timeline"
        sub="kernel + memcpy + synchronization"
        color={C.danger}
        progress={0.72}
      />
      <text x={240} y={151} textAnchor="middle" fontSize={8} fill={C.danger}>
        가장 긴 구간부터 최적화
      </text>
    </g>
  );
}

function Scaling() {
  return (
    <g>
      <text
        x={240}
        y={18}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill="var(--foreground)"
      >
        병렬화 단위가 확장 효율을 결정
      </text>
      <rect
        x={24}
        y={42}
        width={207}
        height={127}
        rx={10}
        fill="var(--card)"
        stroke="var(--border)"
      />
      <text
        x={127}
        y={61}
        textAnchor="middle"
        fontSize={9.5}
        fontWeight={700}
        fill={C.ok}
      >
        독립 증명 4개
      </text>
      {[0, 1, 2, 3].map((i) => (
        <ModuleBox
          key={i}
          x={42 + (i % 2) * 93}
          y={73 + Math.floor(i / 2) * 48}
          w={75}
          h={38}
          label={`GPU ${i}`}
          sub={`proof ${i}`}
          color={C.ok}
        />
      ))}
      <text x={127} y={190} textAnchor="middle" fontSize={8} fill={C.ok}>
        통신 거의 없음 · 수평 확장
      </text>

      <rect
        x={249}
        y={42}
        width={207}
        height={127}
        rx={10}
        fill="var(--card)"
        stroke="var(--border)"
      />
      <text
        x={352}
        y={61}
        textAnchor="middle"
        fontSize={9.5}
        fontWeight={700}
        fill={C.danger}
      >
        한 증명을 4-way 분할
      </text>
      {[0, 1, 2, 3].map((i) => (
        <DataBox
          key={i}
          x={269 + i * 44}
          y={78}
          w={38}
          h={30}
          label={`G${i}`}
          color={C.compute}
        />
      ))}
      <ModuleBox
        x={310}
        y={122}
        w={84}
        h={38}
        label="reduce"
        sub="merge buckets"
        color={C.danger}
      />
      {[0, 1, 2, 3].map((i) => (
        <motion.path
          key={i}
          d={`M${288 + i * 44} 109 L${352} 122`}
          stroke={C.danger}
          strokeWidth={1.2}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: i * 0.08 }}
        />
      ))}
      <text x={352} y={181} textAnchor="middle" fontSize={8} fill={C.danger}>
        합산 빈도 × 전송량 측정
      </text>
    </g>
  );
}

function Checklist() {
  const items = [
    { label: "peak VRAM", color: C.memory },
    { label: "kernel time", color: C.compute },
    { label: "memcpy / sync", color: C.datacenter },
    { label: "sustained clock", color: C.consumer },
  ];
  return (
    <g>
      <text
        x={240}
        y={18}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill="var(--foreground)"
      >
        재현 가능한 후보 비교
      </text>
      {items.map((item, i) => (
        <motion.g
          key={item.label}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <circle
            cx={72}
            cy={60 + i * 31}
            r={10}
            fill={`${C.ok}22`}
            stroke={C.ok}
          />
          <text
            x={72}
            y={64 + i * 31}
            textAnchor="middle"
            fontSize={9}
            fontWeight={700}
            fill={C.ok}
          >
            ✓
          </text>
          <DataBox
            x={95}
            y={46 + i * 31}
            w={134}
            h={27}
            label={item.label}
            color={item.color}
          />
          <rect
            x={249}
            y={51 + i * 31}
            width={176}
            height={17}
            rx={8.5}
            fill="var(--border)"
            opacity={0.3}
          />
          <motion.rect
            x={249}
            y={51 + i * 31}
            height={17}
            rx={8.5}
            fill={item.color}
            initial={false}
            width={80 + i * 27}
            animate={{ width: 80 + i * 27 }}
            transition={{ delay: 0.25 + i * 0.1 }}
          />
        </motion.g>
      ))}
      <AlertBox
        x={145}
        y={174}
        w={190}
        h={24}
        label="동일 입력 · 동일 버전 · warm-up 후 측정"
        color={C.ok}
      />
    </g>
  );
}

const SCENES = [CapacityGate, Msm, Ntt, Pipeline, Scaling, Checklist];

export default function WorkloadFitViz() {
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
