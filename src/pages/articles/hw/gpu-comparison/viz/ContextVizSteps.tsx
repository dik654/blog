import { motion } from "framer-motion";
import { AlertBox, DataBox, ModuleBox } from "@/components/viz/boxes";
import { C } from "./ContextVizData";

const arrow = "M0,-4 L8,0 L0,4 Z";

function FlowDot({
  delay,
  color,
  from,
  to,
}: {
  delay: number;
  color: string;
  from: number;
  to: number;
}) {
  return (
    <motion.circle
      cx={from}
      cy={100}
      r={4}
      fill={color}
      initial={false}
      animate={{ cx: to, opacity: 1 }}
      transition={{ duration: 0.8, delay }}
    />
  );
}

export function StepWorkload() {
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
        작업의 데이터 흐름부터 관찰
      </text>
      <DataBox
        x={22}
        y={76}
        w={92}
        label="입력 데이터"
        sub="points · scalars"
        color={C.memory}
      />
      <path d="M118 92 H183" stroke={C.memory} strokeWidth={2} />
      <path d={arrow} transform="translate(181 92)" fill={C.memory} />
      <ModuleBox
        x={188}
        y={63}
        w={104}
        h={58}
        label="GPU kernel"
        sub="load → compute → store"
        color={C.compute}
      />
      <path d="M296 92 H361" stroke={C.ok} strokeWidth={2} />
      <path d={arrow} transform="translate(359 92)" fill={C.ok} />
      <DataBox
        x={366}
        y={76}
        w={92}
        label="출력"
        sub="buckets · coeffs"
        color={C.ok}
      />
      {[0, 1, 2].map((i) => (
        <FlowDot
          key={i}
          delay={i * 0.18}
          color={C.memory}
          from={123}
          to={179}
        />
      ))}
      <motion.circle
        cx={302}
        cy={92}
        r={4}
        fill={C.ok}
        initial={false}
        animate={{ cx: 356, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.55 }}
      />
      <text
        x={240}
        y={151}
        textAnchor="middle"
        fontSize={9}
        fill="var(--muted-foreground)"
      >
        이동하는 바이트가 많은가 · 한 바이트당 연산이 많은가
      </text>
      <text
        x={240}
        y={170}
        textAnchor="middle"
        fontSize={9}
        fontWeight={700}
        fill={C.compute}
      >
        제품 비교 전에 커널 프로파일 확보
      </text>
    </g>
  );
}

export function StepCapacity() {
  const blocks = Array.from({ length: 8 });
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
        28GB 작업 집합을 24GB 카드에 올리는 경우
      </text>
      <rect
        x={30}
        y={49}
        width={270}
        height={78}
        rx={10}
        fill="var(--card)"
        stroke="var(--border)"
      />
      <text x={44} y={68} fontSize={9} fontWeight={700} fill={C.consumer}>
        GPU VRAM · 24GB
      </text>
      {blocks.map((_, i) => (
        <motion.rect
          key={i}
          x={44 + i * 29}
          y={78}
          width={22}
          height={30}
          rx={3}
          fill={i < 6 ? C.memory : C.danger}
          opacity={i < 6 ? 0.7 : 0.25}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: i * 0.08 }}
        />
      ))}
      <path
        d="M302 89 H351"
        stroke={C.danger}
        strokeWidth={2}
        strokeDasharray="4 3"
      />
      <path d={arrow} transform="translate(349 89)" fill={C.danger} />
      <AlertBox
        x={356}
        y={58}
        w={100}
        h={63}
        label="호스트 spill"
        sub="PCIe 왕복 발생"
        color={C.danger}
      />
      <motion.path
        d="M405 126 C405 160 160 161 160 130"
        fill="none"
        stroke={C.danger}
        strokeWidth={2}
        strokeDasharray="5 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
      <text
        x={240}
        y={178}
        textAnchor="middle"
        fontSize={9}
        fill="var(--muted-foreground)"
      >
        평균 사용량이 아니라 피크 작업 집합 + 버퍼 + 라이브러리 여유분까지 계산
      </text>
    </g>
  );
}

export function StepIntensity() {
  const memoryDots = Array.from({ length: 8 });
  const computeDots = Array.from({ length: 12 });
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
        같은 GPU에서도 커널에 따라 병목이 이동
      </text>
      <rect
        x={26}
        y={44}
        width={201}
        height={112}
        rx={10}
        fill="var(--card)"
        stroke="var(--border)"
      />
      <text
        x={126}
        y={63}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        fill={C.memory}
      >
        메모리 바운드
      </text>
      <rect
        x={45}
        y={79}
        width={116}
        height={14}
        rx={7}
        fill="var(--border)"
        opacity={0.35}
      />
      {memoryDots.map((_, i) => (
        <motion.circle
          key={i}
          cy={86}
          r={4}
          fill={C.memory}
          initial={false}
          cx={55 + i * 14}
          animate={{ cx: 55 + i * 14, opacity: 1 }}
          transition={{ delay: i * 0.07 }}
        />
      ))}
      <rect
        x={177}
        y={75}
        width={28}
        height={47}
        rx={5}
        fill={`${C.compute}22`}
        stroke={C.compute}
      />
      <text
        x={191}
        y={137}
        textAnchor="middle"
        fontSize={8}
        fill="var(--muted-foreground)"
      >
        ALU 대기
      </text>

      <rect
        x={253}
        y={44}
        width={201}
        height={112}
        rx={10}
        fill="var(--card)"
        stroke="var(--border)"
      />
      <text
        x={353}
        y={63}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        fill={C.compute}
      >
        계산 바운드
      </text>
      <rect
        x={272}
        y={79}
        width={36}
        height={14}
        rx={7}
        fill={`${C.memory}55`}
      />
      <g transform="translate(326 76)">
        {computeDots.map((_, i) => (
          <motion.rect
            key={i}
            x={(i % 4) * 23}
            y={Math.floor(i / 4) * 18}
            width={16}
            height={12}
            rx={2}
            fill={C.compute}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            transition={{ delay: i * 0.04 }}
          />
        ))}
      </g>
      <text
        x={353}
        y={143}
        textAnchor="middle"
        fontSize={8}
        fill="var(--muted-foreground)"
      >
        연산 유닛 포화
      </text>
      <text
        x={240}
        y={181}
        textAnchor="middle"
        fontSize={9}
        fontWeight={700}
        fill={C.ok}
      >
        대역폭과 코어 수를 한 줄 순위로 합치지 않기
      </text>
    </g>
  );
}
