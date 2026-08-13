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
    label: "24GB에서 32GB로: 더 큰 작업 집합이 한 장에 머무름",
    body: "VRAM은 평균 사용량이 아니라 피크 할당량과 임시 버퍼를 포함해 판단",
  },
  {
    label: "GDDR7과 넓어진 버스가 순차 대역폭 상한을 높임",
    body: "RTX 5090의 이론 메모리 대역폭은 1,792GB/s, RTX 4090은 1,008GB/s",
  },
  {
    label: "처리량과 함께 전력·전원·열 밀도도 증가",
    body: "Founders Edition 기준 TGP 450W → 575W, 권장 시스템 전력 850W → 1,000W",
  },
  {
    label: "두 장을 꽂아도 하나의 48GB·64GB 메모리가 되지 않음",
    body: "GeForce에는 NVLink가 없고, 애플리케이션이 PCIe 전송과 데이터 분할을 직접 설계해야 함",
  },
  {
    label: "강점은 단일 노드의 높은 처리량, 제약은 밀집 배치와 운영성",
    body: "한두 장 프로토타이핑에는 매력적이지만 랙 단위 운영은 섀시·전력·지원까지 다시 계산",
  },
];

function Card({
  x,
  label,
  color,
}: {
  x: number;
  label: string;
  color: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={54}
        width={146}
        height={86}
        rx={10}
        fill="var(--card)"
        stroke="var(--border)"
      />
      <circle cx={x + 45} cy={96} r={25} fill={`${color}16`} stroke={color} />
      <circle cx={x + 45} cy={96} r={9} fill={color} opacity={0.75} />
      <rect
        x={x + 87}
        y={72}
        width={39}
        height={48}
        rx={4}
        fill={`${color}28`}
        stroke={color}
      />
      <text
        x={x + 73}
        y={158}
        textAnchor="middle"
        fontSize={9}
        fontWeight={700}
        fill={color}
      >
        {label}
      </text>
    </g>
  );
}

function Capacity() {
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
        VRAM 용량 비교
      </text>
      <StatusBox
        x={44}
        y={54}
        w={168}
        h={66}
        label="RTX 4090 · 24GB"
        sub="GDDR6X · 384-bit"
        color={C.consumer}
        progress={0.75}
      />
      <StatusBox
        x={268}
        y={54}
        w={168}
        h={66}
        label="RTX 5090 · 32GB"
        sub="GDDR7 · 512-bit"
        color={C.memory}
        progress={1}
      />
      <DataBox
        x={180}
        y={139}
        w={120}
        label="28GB 작업 집합"
        sub="weights + buffers"
        color={C.compute}
      />
      <motion.path
        d="M211 121 C211 135 212 137 220 140"
        fill="none"
        stroke={C.danger}
        strokeWidth={2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <motion.path
        d="M353 121 C353 135 296 137 280 140"
        fill="none"
        stroke={C.ok}
        strokeWidth={2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <text x={132} y={151} textAnchor="middle" fontSize={8} fill={C.danger}>
        spill
      </text>
      <text x={349} y={151} textAnchor="middle" fontSize={8} fill={C.ok}>
        상주
      </text>
      <text
        x={240}
        y={187}
        textAnchor="middle"
        fontSize={8.5}
        fill="var(--muted-foreground)"
      >
        용량 통과 전에는 코어·클럭 비교가 의미 없음
      </text>
    </g>
  );
}

function Bandwidth() {
  const dots = Array.from({ length: 9 });
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
        VRAM → SM 데이터 공급 폭
      </text>
      <ModuleBox
        x={35}
        y={73}
        w={93}
        h={55}
        label="GDDR6X"
        sub="RTX 4090"
        color={C.consumer}
      />
      <rect
        x={143}
        y={78}
        width={155}
        height={18}
        rx={9}
        fill="var(--border)"
        opacity={0.35}
      />
      {dots.slice(0, 5).map((_, i) => (
        <motion.circle
          key={`a-${i}`}
          cy={87}
          r={4}
          fill={C.consumer}
          initial={false}
          cx={155 + i * 27}
          animate={{ cx: 155 + i * 27, opacity: 1 }}
          transition={{ delay: i * 0.08 }}
        />
      ))}
      <ModuleBox
        x={35}
        y={132}
        w={93}
        h={55}
        label="GDDR7"
        sub="RTX 5090"
        color={C.memory}
      />
      <rect
        x={143}
        y={137}
        width={250}
        height={24}
        rx={12}
        fill="var(--border)"
        opacity={0.35}
      />
      {dots.map((_, i) => (
        <motion.circle
          key={`b-${i}`}
          cy={149}
          r={4}
          fill={C.memory}
          initial={false}
          cx={155 + i * 27}
          animate={{ cx: 155 + i * 27, opacity: 1 }}
          transition={{ delay: i * 0.06 }}
        />
      ))}
      <ModuleBox
        x={407}
        y={101}
        w={55}
        h={55}
        label="SM"
        sub="kernel"
        color={C.compute}
      />
      <text x={315} y={88} fontSize={8.5} fontWeight={700} fill={C.consumer}>
        1,008 GB/s
      </text>
      <text x={315} y={151} fontSize={8.5} fontWeight={700} fill={C.memory}>
        1,792 GB/s
      </text>
      <text
        x={240}
        y={194}
        textAnchor="middle"
        fontSize={8}
        fill="var(--muted-foreground)"
      >
        이론 상한 · 실제 처리량은 접근 패턴과 커널 구현에 따라 감소
      </text>
    </g>
  );
}

function Power() {
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
        전력 예산은 GPU TGP로 끝나지 않음
      </text>
      <StatusBox
        x={35}
        y={48}
        w={180}
        h={57}
        label="RTX 4090 · 450W"
        sub="시스템 권장 850W"
        color={C.consumer}
        progress={450 / 575}
      />
      <StatusBox
        x={265}
        y={48}
        w={180}
        h={57}
        label="RTX 5090 · 575W"
        sub="시스템 권장 1,000W"
        color={C.danger}
        progress={1}
      />
      <motion.path
        d="M125 110 V135 H355 V110"
        fill="none"
        stroke={C.neutral}
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <ModuleBox
        x={182}
        y={126}
        w={116}
        h={52}
        label="노드 전력 예산"
        sub="CPU · SSD · fan 포함"
        color={C.datacenter}
      />
      <AlertBox
        x={18}
        y={132}
        w={130}
        h={47}
        label="케이블·커넥터"
        sub="정격과 체결 확인"
        color={C.danger}
      />
      <AlertBox
        x={332}
        y={132}
        w={130}
        h={47}
        label="지속 부하 열"
        sub="게임 피크와 다름"
        color={C.danger}
      />
      <text
        x={240}
        y={195}
        textAnchor="middle"
        fontSize={8}
        fill="var(--muted-foreground)"
      >
        장시간 CUDA 작업은 냉각 후의 지속 클럭으로 비교
      </text>
    </g>
  );
}

function MultiGpu() {
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
        각 GPU는 독립된 주소 공간
      </text>
      <Card x={26} label="GPU 0 · 24/32GB" color={C.consumer} />
      <Card x={308} label="GPU 1 · 24/32GB" color={C.consumer} />
      <ModuleBox
        x={190}
        y={35}
        w={100}
        h={50}
        label="CPU + RAM"
        sub="PCIe root"
        color={C.neutral}
      />
      <motion.path
        d="M172 83 C185 62 187 62 190 62 M290 62 C293 62 296 62 308 83"
        fill="none"
        stroke={C.neutral}
        strokeWidth={2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <motion.path
        d="M173 117 H307"
        stroke={C.danger}
        strokeWidth={2}
        strokeDasharray="5 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      <text
        x={240}
        y={110}
        textAnchor="middle"
        fontSize={8}
        fontWeight={700}
        fill={C.danger}
      >
        NVLink 없음
      </text>
      <DataBox
        x={194}
        y={136}
        w={92}
        label="sharding"
        sub="앱이 분할"
        color={C.compute}
      />
      <text
        x={240}
        y={187}
        textAnchor="middle"
        fontSize={8.5}
        fill="var(--muted-foreground)"
      >
        두 장의 VRAM 합계와 단일 작업의 최대 할당량은 다른 값
      </text>
    </g>
  );
}

function Fit() {
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
        컨슈머 GPU의 적합 범위
      </text>
      <ModuleBox
        x={28}
        y={54}
        w={128}
        h={60}
        label="잘 맞는 환경"
        sub="1–2 GPU workstation"
        color={C.ok}
      />
      <DataBox
        x={35}
        y={129}
        w={112}
        label="커널 개발"
        sub="profile · optimize"
        color={C.ok}
      />
      <ModuleBox
        x={176}
        y={54}
        w={128}
        h={60}
        label="조건부"
        sub="custom chassis"
        color={C.datacenter}
      />
      <DataBox
        x={184}
        y={129}
        w={112}
        label="소규모 prover"
        sub="전력·열 검증"
        color={C.datacenter}
      />
      <AlertBox
        x={324}
        y={54}
        w={128}
        h={60}
        label="주의 환경"
        sub="고밀도 24/7 rack"
        color={C.danger}
      />
      <DataBox
        x={332}
        y={129}
        w={112}
        label="운영 부담"
        sub="냉각 · 지원 · 교체"
        color={C.danger}
      />
      <text
        x={240}
        y={187}
        textAnchor="middle"
        fontSize={8.5}
        fontWeight={700}
        fill={C.compute}
      >
        구매가보다 시스템 통합 비용이 역전 지점 결정
      </text>
    </g>
  );
}

const SCENES = [Capacity, Bandwidth, Power, MultiGpu, Fit];

export default function ConsumerViz() {
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
