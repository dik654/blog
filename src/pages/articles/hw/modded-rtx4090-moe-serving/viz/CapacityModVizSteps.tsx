import { motion } from "framer-motion";
import {
  ModuleBox,
  DataBox,
  ActionBox,
  StatusBox,
  AlertBox,
} from "@/components/viz/boxes";
import { C, CHIP_XS } from "./CapacityModVizData";

/* ── 공용: 메모리 칩 하나 (순차 fade-in) ──────────────── */
function Chip({
  x,
  y,
  w = 24,
  h = 22,
  color,
  label,
  delay = 0,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  color: string;
  label: string;
  delay?: number;
}) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
    >
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={3}
        fill={color}
        fillOpacity={0.12}
        stroke={color}
        strokeWidth={0.9}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 3}
        textAnchor="middle"
        fontSize={7.5}
        fontWeight={700}
        fill={color}
      >
        {label}
      </text>
    </motion.g>
  );
}

/* ── 공용: 1GB → 2GB로 교체되는 칩 (색 전환 + 펄스) ────── */
function ChipSwap({
  x,
  y,
  w = 24,
  h = 22,
  delay = 0,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  delay?: number;
}) {
  return (
    <g>
      <motion.rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={3}
        fillOpacity={0.14}
        strokeWidth={0.9}
        initial={{ fill: C.chip1, stroke: C.chip1, scale: 1 }}
        animate={{ fill: C.chip2, stroke: C.chip2, scale: 1.16 }}
        transition={{
          fill: { delay, duration: 0.4 },
          stroke: { delay, duration: 0.4 },
          scale: { delay, duration: 0.22, repeat: 1, repeatType: "reverse" },
        }}
      />
      <motion.text
        x={x + w / 2}
        y={y + h / 2 + 3}
        textAnchor="middle"
        fontSize={7.5}
        fontWeight={700}
        initial={{ fill: C.chip1 }}
        animate={{ fill: C.chip2 }}
        transition={{ delay, duration: 0.4 }}
      >
        2G
      </motion.text>
    </g>
  );
}

/* ── Step 0: 정품 24GB — 이미 clamshell 구조 ──────────── */
export function Step0() {
  return (
    <g>
      <text
        x={240}
        y={12}
        textAnchor="middle"
        fontSize={9}
        fontWeight={700}
        fill={C.chip1}
      >
        PCB 앞면 · 1GB 칩 × 12
      </text>

      {CHIP_XS.map((x, i) => (
        <Chip
          key={`f${i}`}
          x={x}
          y={18}
          color={C.chip1}
          label="1G"
          delay={0.05 + i * 0.035}
        />
      ))}

      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <rect
          x={20}
          y={44}
          width={440}
          height={12}
          rx={3}
          fill={C.bus}
          fillOpacity={0.08}
          stroke={C.bus}
          strokeWidth={0.8}
        />
        <text
          x={240}
          y={52.5}
          textAnchor="middle"
          fontSize={8}
          fontWeight={700}
          fill={C.bus}
        >
          384-bit 버스 · 12채널 × 32-bit
        </text>
      </motion.g>

      {/* 채널 연결선: 앞칩 → 버스 → 뒷칩 (채널 하나가 칩 쌍을 공유) */}
      {CHIP_XS.map((x, i) => (
        <motion.line
          key={`l${i}`}
          x1={x + 12}
          y1={40}
          x2={x + 12}
          y2={62}
          stroke={C.bus}
          strokeWidth={0.8}
          strokeDasharray="2 2"
          opacity={0.45}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.55 + i * 0.02, duration: 0.25 }}
        />
      ))}

      {CHIP_XS.map((x, i) => (
        <Chip
          key={`b${i}`}
          x={x}
          y={62}
          color={C.chip1}
          label="1G"
          delay={0.65 + i * 0.035}
        />
      ))}
      <text
        x={240}
        y={98}
        textAnchor="middle"
        fontSize={9}
        fontWeight={700}
        fill={C.chip1}
      >
        PCB 뒷면 · 1GB 칩 × 12
      </text>

      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <ActionBox
          x={20}
          y={108}
          w={440}
          h={34}
          label="채널 1개 = 앞칩 1개 + 뒤칩 1개 공유 (clamshell)"
          sub="한 채널이 앞뒤 칩 쌍을 함께 읽고 쓴다"
          color={C.bus}
        />
      </motion.g>
      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.35 }}
      >
        <StatusBox
          x={140}
          y={150}
          w={200}
          h={40}
          label="정품 총 용량 24GB"
          sub="12채널 × 2GB(앞1+뒤1)"
          progress={0.5}
          color={C.capacity}
        />
      </motion.g>
    </g>
  );
}

/* ── Step 1: 48GB 개조 — 칩 24개를 통째로 교체 ─────────── */
export function Step1() {
  return (
    <g>
      <text
        x={240}
        y={12}
        textAnchor="middle"
        fontSize={9}
        fontWeight={700}
        fill={C.chip2}
      >
        같은 24개 위치 — 1GB → 2GB 칩으로 교체
      </text>

      {CHIP_XS.map((x, i) => (
        <ChipSwap key={`f${i}`} x={x} y={18} delay={0.05 + i * 0.05} />
      ))}

      <g>
        <rect
          x={20}
          y={44}
          width={440}
          height={12}
          rx={3}
          fill={C.bus}
          fillOpacity={0.08}
          stroke={C.bus}
          strokeWidth={0.8}
        />
        <text
          x={240}
          y={52.5}
          textAnchor="middle"
          fontSize={8}
          fontWeight={700}
          fill={C.bus}
        >
          384-bit 버스 · 12채널 — 그대로
        </text>
      </g>

      {CHIP_XS.map((x, i) => (
        <line
          key={`l${i}`}
          x1={x + 12}
          y1={40}
          x2={x + 12}
          y2={62}
          stroke={C.bus}
          strokeWidth={0.8}
          strokeDasharray="2 2"
          opacity={0.45}
        />
      ))}

      {CHIP_XS.map((x, i) => (
        <ChipSwap key={`b${i}`} x={x} y={62} delay={0.75 + i * 0.05} />
      ))}
      <text
        x={240}
        y={98}
        textAnchor="middle"
        fontSize={9}
        fontWeight={700}
        fill={C.chip2}
      >
        칩 개수·배치는 불변 — 밀도만 2배
      </text>

      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.65 }}
      >
        <ModuleBox
          x={20}
          y={108}
          w={210}
          h={40}
          label="384-bit 버스 · 12채널"
          sub="클럭·배선 변경 없음"
          color={C.bus}
        />
        <StatusBox
          x={250}
          y={108}
          w={210}
          h={40}
          label="개조 후 총 용량 48GB"
          sub="12채널 × 2GB(칩) × 2"
          progress={1}
          color={C.chip2}
        />
      </motion.g>
      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
      >
        <ActionBox
          x={20}
          y={154}
          w={440}
          h={32}
          label="채널 수·클럭·버스 폭은 그대로 — 칩 용량만 교체"
          sub="1GB(8Gbit) → 2GB(16Gbit)"
          color={C.chip2}
        />
      </motion.g>
    </g>
  );
}

/* ── Step 2: 대역폭 공식엔 밀도 항이 없다 ──────────────── */
export function Step2() {
  return (
    <g>
      <text
        x={240}
        y={14}
        textAnchor="middle"
        fontSize={8.5}
        fontWeight={700}
        fill="var(--foreground)"
      >
        GDDR6X 유효 대역폭 = 핀 speed × 버스 폭 ÷ 8
      </text>

      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DataBox
          x={12}
          y={40}
          w={92}
          h={44}
          label="21"
          sub="Gbps 핀 speed"
          color={C.bus}
        />
      </motion.g>
      <motion.text
        x={114}
        y={66}
        textAnchor="middle"
        fontSize={13}
        fontWeight={700}
        fill="var(--muted-foreground)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        ×
      </motion.text>

      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <DataBox
          x={122}
          y={40}
          w={92}
          h={44}
          label="384"
          sub="bit 버스 폭"
          color={C.bus}
        />
      </motion.g>
      <motion.text
        x={224}
        y={66}
        textAnchor="middle"
        fontSize={13}
        fontWeight={700}
        fill="var(--muted-foreground)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
      >
        ÷
      </motion.text>

      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <DataBox
          x={232}
          y={40}
          w={50}
          h={44}
          label="8"
          sub="bit→byte"
          color={C.bus}
        />
      </motion.g>
      <motion.text
        x={296}
        y={66}
        textAnchor="middle"
        fontSize={13}
        fontWeight={700}
        fill="var(--muted-foreground)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.95 }}
      >
        ≈
      </motion.text>

      <motion.g
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.05, duration: 0.35 }}
      >
        <DataBox
          x={308}
          y={34}
          w={158}
          h={56}
          label="1,008GB/s"
          sub="이론 유효 대역폭"
          color={C.capacity}
          outlined
        />
      </motion.g>

      {/* 밀도는 이 식에 없다 — 배제 표시 */}
      <motion.line
        x1={128}
        y1={88}
        x2={128}
        y2={104}
        stroke={C.alert}
        strokeWidth={0.8}
        strokeDasharray="2 2"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: 1, pathLength: 1 }}
        transition={{ delay: 1.3, duration: 0.3 }}
      />
      <motion.g
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4 }}
      >
        <circle
          cx={128}
          cy={96}
          r={7}
          fill="var(--card)"
          stroke={C.alert}
          strokeWidth={0.9}
        />
        <text
          x={128}
          y={98.5}
          textAnchor="middle"
          fontSize={8}
          fontWeight={700}
          fill={C.alert}
        >
          ✕
        </text>
      </motion.g>

      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <DataBox
          x={58}
          y={106}
          w={140}
          h={30}
          label="칩 밀도 1GB/2GB"
          sub="이 식엔 없음"
          color={C.muted}
        />
      </motion.g>

      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.65 }}
      >
        <ActionBox
          x={20}
          y={150}
          w={440}
          h={38}
          label="≈1,008GB/s — 개조 전후 동일"
          sub="핀 speed·버스 폭만 대역폭을 정한다"
          color={C.bus}
        />
      </motion.g>
    </g>
  );
}

/* ── Step 3: Before / After — 용량 2배, 대역폭 그대로 ──── */
export function Step3() {
  return (
    <g>
      <text
        x={120}
        y={14}
        textAnchor="middle"
        fontSize={9}
        fontWeight={700}
        fill={C.chip1}
      >
        Before · 정품
      </text>
      <text
        x={360}
        y={14}
        textAnchor="middle"
        fontSize={9}
        fontWeight={700}
        fill={C.chip2}
      >
        After · 48GB 개조
      </text>

      <line
        x1={240}
        y1={22}
        x2={240}
        y2={142}
        stroke="var(--border)"
        strokeWidth={0.8}
        strokeDasharray="4 3"
      />

      <motion.g
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <StatusBox
          x={20}
          y={26}
          w={200}
          h={54}
          label="24GB"
          sub="1GB 칩 × 24개"
          progress={0.5}
          color={C.chip1}
        />
      </motion.g>
      <motion.g
        initial={{ opacity: 0, x: 6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <StatusBox
          x={260}
          y={26}
          w={200}
          h={54}
          label="48GB"
          sub="2GB 칩 × 24개"
          progress={1}
          color={C.chip2}
        />
      </motion.g>

      <motion.g
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.45 }}
      >
        <circle
          cx={240}
          cy={53}
          r={15}
          fill="var(--card)"
          stroke={C.capacity}
          strokeWidth={0.9}
        />
        <text
          x={240}
          y={56}
          textAnchor="middle"
          fontSize={9}
          fontWeight={700}
          fill={C.capacity}
        >
          ×2
        </text>
      </motion.g>

      <motion.g
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <DataBox
          x={45}
          y={96}
          w={150}
          h={38}
          label="≈1,008GB/s"
          sub="21×384÷8"
          color={C.bus}
        />
      </motion.g>
      <motion.g
        initial={{ opacity: 0, x: 6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
      >
        <DataBox
          x={285}
          y={96}
          w={150}
          h={38}
          label="≈1,008GB/s"
          sub="21×384÷8"
          color={C.bus}
        />
      </motion.g>
      <motion.text
        x={240}
        y={120}
        textAnchor="middle"
        fontSize={14}
        fontWeight={700}
        fill={C.bus}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        =
      </motion.text>

      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
      >
        <ActionBox
          x={20}
          y={148}
          w={440}
          h={34}
          label="용량은 2배, 대역폭은 그대로"
          sub="밀도만 바뀌고 핀 speed·버스 폭은 불변"
          color={C.capacity}
        />
      </motion.g>
    </g>
  );
}

/* ── Step 4: 풀리는 문제 vs 안 풀리는 문제 ─────────────── */
export function Step4() {
  return (
    <g>
      <text
        x={240}
        y={14}
        textAnchor="middle"
        fontSize={9}
        fontWeight={700}
        fill="var(--foreground)"
      >
        개조가 푸는 문제 vs 못 푸는 문제
      </text>

      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <StatusBox
          x={20}
          y={30}
          w={210}
          h={54}
          label="용량 문제"
          sub="weight가 한 장에 들어가는가"
          progress={1}
          color={C.capacity}
        />
      </motion.g>
      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <AlertBox
          x={250}
          y={30}
          w={210}
          h={54}
          label="대역폭 문제"
          sub="decode마다 읽는 속도"
          color={C.alert}
        />
      </motion.g>

      <motion.g
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.55 }}
      >
        <circle
          cx={45}
          cy={100}
          r={10}
          fill="var(--card)"
          stroke={C.bus}
          strokeWidth={0.9}
        />
        <path
          d="M40 100 L44 104 L51 96"
          fill="none"
          stroke={C.bus}
          strokeWidth={1.1}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text x={62} y={98} fontSize={8} fontWeight={700} fill={C.bus}>
          해결됨
        </text>
        <text x={62} y={107} fontSize={7} fill="var(--muted-foreground)">
          48GB로 상주 여지 확대
        </text>
      </motion.g>

      <motion.g
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7 }}
      >
        <circle
          cx={275}
          cy={100}
          r={10}
          fill="var(--card)"
          stroke={C.alert}
          strokeWidth={0.9}
        />
        <text
          x={275}
          y={103}
          textAnchor="middle"
          fontSize={9}
          fontWeight={700}
          fill={C.alert}
        >
          ✕
        </text>
        <text x={292} y={98} fontSize={8} fontWeight={700} fill={C.alert}>
          그대로
        </text>
        <text x={292} y={107} fontSize={7} fill="var(--muted-foreground)">
          ≈1,008GB/s 동일 — 미해결
        </text>
      </motion.g>

      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95 }}
      >
        <ActionBox
          x={20}
          y={130}
          w={440}
          h={40}
          label="용량과 대역폭은 서로 다른 두 축"
          sub="밀도가 용량을, 핀 speed·버스 폭이 대역폭을 결정한다"
          color={C.capacity}
        />
      </motion.g>
    </g>
  );
}

/* ── Step 5: 공식 검증 밖의 개조 — 대가 ────────────────── */
export function Step5() {
  const risks = [
    "메모리 트레이닝(타이밍·전압)을 새 vBIOS가 다시 잡음 — 칩 로트마다 안정성이 다를 수 있음",
    "워런티 소멸 — 개조 순간부터 비공식 구성",
    "드라이버 업데이트가 커스텀 vBIOS와 충돌해도 NVIDIA 지원 채널을 쓸 수 없음",
  ];

  return (
    <g>
      <motion.g
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05 }}
      >
        <ModuleBox
          x={20}
          y={16}
          w={200}
          h={44}
          label="정품 vBIOS"
          sub="NVIDIA 공식 검증"
          color={C.bus}
        />
      </motion.g>
      <motion.g
        initial={{ opacity: 0, x: 6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
      >
        <AlertBox
          x={260}
          y={16}
          w={200}
          h={44}
          label="커스텀 vBIOS"
          sub="개조 업체 자체 트레이닝"
          color={C.alert}
        />
      </motion.g>

      <motion.line
        x1={360}
        y1={60}
        x2={360}
        y2={74}
        stroke={C.alert}
        strokeWidth={0.9}
        strokeDasharray="2 2"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: 1, pathLength: 1 }}
        transition={{ delay: 0.3, duration: 0.25 }}
      />

      {risks.map((r, i) => (
        <motion.g
          key={r}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + i * 0.22 }}
        >
          <AlertBox
            x={20}
            y={78 + i * 36}
            w={440}
            h={30}
            label={r}
            color={C.alert}
          />
        </motion.g>
      ))}
    </g>
  );
}
