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
    label: "A100과 H100은 카드보다 서버 플랫폼에 가까움",
    body: "PCIe 카드와 SXM 모듈은 전력·냉각·연결 방식이 달라 같은 제품명만으로 비교할 수 없음",
  },
  {
    label: "HBM은 GPU 가까이에 넓은 인터페이스로 배치",
    body: "A100 SXM 80GB는 2,039GB/s, H100 SXM 80GB는 3.35TB/s의 공식 메모리 대역폭",
  },
  {
    label: "PCIe는 범용 슬롯, SXM은 HGX 베이스보드의 모듈",
    body: "SXM의 고전력과 NVLink 확장성은 전용 서버 설계를 전제로 얻는 특성",
  },
  {
    label: "NVLink·NVSwitch가 여러 GPU를 하나의 패브릭으로 연결",
    body: "통신 집약적인 분산 작업에서 CPU 루트를 우회해 GPU 간 교환 병목을 줄임",
  },
  {
    label: "MIG와 관리 도구는 처리량보다 운영률을 높이는 기능",
    body: "한 가속기를 격리된 인스턴스로 나눠 작은 작업을 동시에 수용하고 자원 낭비를 줄임",
  },
];

function Platform() {
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
        제품명 아래에 서로 다른 폼팩터
      </text>
      <ModuleBox
        x={24}
        y={45}
        w={130}
        h={56}
        label="A100 PCIe 80GB"
        sub="300W · 1,935GB/s"
        color={C.consumer}
      />
      <DataBox
        x={36}
        y={119}
        w={106}
        label="범용 서버"
        sub="PCIe Gen4"
        color={C.consumer}
      />
      <ModuleBox
        x={175}
        y={45}
        w={130}
        h={56}
        label="A100 SXM 80GB"
        sub="400W · 2,039GB/s"
        color={C.datacenter}
      />
      <DataBox
        x={187}
        y={119}
        w={106}
        label="HGX A100"
        sub="NVLink 600GB/s"
        color={C.datacenter}
      />
      <ModuleBox
        x={326}
        y={45}
        w={130}
        h={56}
        label="H100 SXM 80GB"
        sub="≤700W · 3.35TB/s"
        color={C.memory}
      />
      <DataBox
        x={338}
        y={119}
        w={106}
        label="HGX H100"
        sub="NVLink 900GB/s"
        color={C.memory}
      />
      <text
        x={240}
        y={181}
        textAnchor="middle"
        fontSize={8.5}
        fill="var(--muted-foreground)"
      >
        메모리 용량이 같아도 공급 속도와 시스템 경계가 다름
      </text>
    </g>
  );
}

function Hbm() {
  const stacks = [0, 1, 2, 3, 4];
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
        GPU 패키지 주변의 HBM 스택
      </text>
      <rect
        x={127}
        y={47}
        width={226}
        height={113}
        rx={18}
        fill="var(--card)"
        stroke="var(--border)"
      />
      <rect
        x={195}
        y={72}
        width={90}
        height={64}
        rx={8}
        fill={`${C.compute}25`}
        stroke={C.compute}
      />
      <text
        x={240}
        y={106}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill={C.compute}
      >
        GPU die
      </text>
      {stacks.map((i) => {
        const x = 140 + i * 42;
        return (
          <motion.g
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            {[0, 1, 2, 3].map((layer) => (
              <rect
                key={layer}
                x={x}
                y={54 + layer * 5}
                width={28}
                height={8}
                rx={2}
                fill={C.memory}
                opacity={0.35 + layer * 0.12}
              />
            ))}
            <path
              d={`M${x + 14} 78 V91 H193`}
              fill="none"
              stroke={C.memory}
              strokeWidth={1.2}
            />
          </motion.g>
        );
      })}
      <StatusBox
        x={18}
        y={67}
        w={94}
        h={57}
        label="A100 SXM"
        sub="2,039GB/s"
        color={C.datacenter}
        progress={0.61}
      />
      <StatusBox
        x={368}
        y={67}
        w={94}
        h={57}
        label="H100 SXM"
        sub="3.35TB/s"
        color={C.memory}
        progress={1}
      />
      <text
        x={240}
        y={184}
        textAnchor="middle"
        fontSize={8.5}
        fill="var(--muted-foreground)"
      >
        짧고 넓은 배선으로 GDDR보다 높은 대역폭 · 비용과 패키징 복잡도 증가
      </text>
    </g>
  );
}

function FormFactor() {
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
        PCIe 카드와 SXM 모듈의 시스템 경계
      </text>
      <rect
        x={24}
        y={43}
        width={205}
        height={120}
        rx={10}
        fill="var(--card)"
        stroke="var(--border)"
      />
      <text
        x={126}
        y={62}
        textAnchor="middle"
        fontSize={9.5}
        fontWeight={700}
        fill={C.consumer}
      >
        PCIe
      </text>
      <rect
        x={49}
        y={79}
        width={154}
        height={51}
        rx={5}
        fill={`${C.consumer}16`}
        stroke={C.consumer}
      />
      <rect x={62} y={130} width={128} height={7} fill={C.datacenter} />
      <text
        x={126}
        y={151}
        textAnchor="middle"
        fontSize={8}
        fill="var(--muted-foreground)"
      >
        슬롯 장착 · CPU root 경유
      </text>

      <rect
        x={251}
        y={43}
        width={205}
        height={120}
        rx={10}
        fill="var(--card)"
        stroke="var(--border)"
      />
      <text
        x={353}
        y={62}
        textAnchor="middle"
        fontSize={9.5}
        fontWeight={700}
        fill={C.datacenter}
      >
        SXM + HGX
      </text>
      <rect
        x={311}
        y={75}
        width={84}
        height={60}
        rx={8}
        fill={`${C.datacenter}18`}
        stroke={C.datacenter}
      />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={285 + i * 45} cy={146} r={4} fill={C.memory} />
      ))}
      <motion.path
        d="M285 146 C300 119 301 113 311 107 M395 107 C405 113 407 119 420 146"
        fill="none"
        stroke={C.memory}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <text
        x={353}
        y={157}
        textAnchor="middle"
        fontSize={8}
        fill="var(--muted-foreground)"
      >
        전용 전력·냉각·NVLink 배선
      </text>
      <text
        x={240}
        y={187}
        textAnchor="middle"
        fontSize={8.5}
        fontWeight={700}
        fill={C.ok}
      >
        SXM은 독립 카드가 아니라 플랫폼 선택
      </text>
    </g>
  );
}

function Fabric() {
  const coords = [
    [66, 63],
    [66, 127],
    [170, 63],
    [170, 127],
    [310, 63],
    [310, 127],
    [414, 63],
    [414, 127],
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
        8-GPU HGX의 NVSwitch 패브릭
      </text>
      {coords.map(([x, y], i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.06 }}
        >
          <rect
            x={x - 34}
            y={y - 18}
            width={68}
            height={36}
            rx={7}
            fill="var(--card)"
            stroke={i < 4 ? C.datacenter : C.memory}
          />
          <text
            x={x}
            y={y + 3}
            textAnchor="middle"
            fontSize={8.5}
            fontWeight={700}
            fill="var(--foreground)"
          >
            GPU {i}
          </text>
        </motion.g>
      ))}
      <ModuleBox
        x={205}
        y={72}
        w={70}
        h={48}
        label="NVSwitch"
        sub="non-blocking"
        color={C.compute}
      />
      {coords.map(([x, y], i) => (
        <motion.path
          key={`p-${i}`}
          d={`M${x + (x < 240 ? 34 : -34)} ${y} L${x < 240 ? 205 : 275} ${96 + (y < 96 ? -8 : 8)}`}
          stroke={i < 4 ? C.datacenter : C.memory}
          strokeWidth={1.2}
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.35 + i * 0.05 }}
        />
      ))}
      <text
        x={240}
        y={181}
        textAnchor="middle"
        fontSize={8.5}
        fill="var(--muted-foreground)"
      >
        all-reduce처럼 반복 교환하는 작업에서 링크와 토폴로지가 처리량의 일부
      </text>
    </g>
  );
}

function Mig() {
  const slices = Array.from({ length: 7 });
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
        MIG · Multi-Instance GPU
      </text>
      <rect
        x={35}
        y={51}
        width={302}
        height={104}
        rx={12}
        fill="var(--card)"
        stroke="var(--border)"
      />
      {slices.map((_, i) => (
        <motion.rect
          key={i}
          x={48 + i * 40}
          y={66}
          width={32}
          height={72}
          rx={5}
          fill={i % 3 === 0 ? C.memory : i % 3 === 1 ? C.compute : C.datacenter}
          opacity={0.65}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: i * 0.08 }}
        />
      ))}
      <text
        x={186}
        y={172}
        textAnchor="middle"
        fontSize={8}
        fill="var(--muted-foreground)"
      >
        독립 인스턴스 · 메모리와 실행 자원 격리
      </text>
      <ModuleBox
        x={360}
        y={49}
        w={102}
        h={51}
        label="scheduler"
        sub="job placement"
        color={C.ok}
      />
      <DataBox
        x={370}
        y={117}
        w={82}
        label="작은 작업"
        sub="동시 수용"
        color={C.ok}
      />
      <motion.path
        d="M359 75 H339 M359 136 H339"
        stroke={C.ok}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <AlertBox
        x={18}
        y={165}
        w={110}
        h={28}
        label="성능 기능 ≠ 운영 기능"
        color={C.danger}
      />
      <text
        x={300}
        y={184}
        textAnchor="middle"
        fontSize={8.5}
        fontWeight={700}
        fill={C.ok}
      >
        유휴 슬롯을 줄여 클러스터 이용률 개선
      </text>
    </g>
  );
}

const SCENES = [Platform, Hbm, FormFactor, Fabric, Mig];

export default function DatacenterViz() {
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
