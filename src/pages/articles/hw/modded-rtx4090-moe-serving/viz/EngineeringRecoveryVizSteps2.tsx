import { motion } from "framer-motion";
import { ModuleBox, DataBox, AlertBox, StatusBox } from "@/components/viz/boxes";
import { C } from "./EngineeringRecoveryVizData";

/** Step 3: C) Quantization — BF16 두꺼운 페이로드 → INT4 1/4 크기로 축소 */
export function Step3() {
  return (
    <g>
      <text
        x={240}
        y={16}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill={C.quantC}
      >
        C) Quantization
      </text>

      {/* 통신 시간 공식 */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <rect x={100} y={26} width={280} height={22} rx={7} fill="var(--card)" stroke={C.pcie} strokeWidth={0.8} />
        <text x={240} y={41} textAnchor="middle" fontSize={8.5} fontWeight={600} fill={C.pcie}>
          통신 시간 = 바이트 수 ÷ bandwidth
        </text>
      </motion.g>

      {/* 원래 크기 기준선 (BF16 폭 참조용, 정적) */}
      <rect x={60} y={80} width={250} height={30} rx={6} fill="none" stroke={C.pcie} strokeWidth={0.8} strokeDasharray="4 3" opacity={0.4} />

      {/* 페이로드 막대 — width+색이 함께 축소 */}
      <motion.rect
        x={60}
        y={80}
        height={30}
        rx={6}
        fill={C.quantC}
        initial={{ width: 250, fill: "#f59e0b" }}
        animate={{ width: 63, fill: "#fb923c" }}
        transition={{ delay: 1.0, duration: 0.8 }}
      />

      {/* 레이블 크로스페이드 */}
      <motion.text
        x={60}
        y={70}
        fontSize={9}
        fontWeight={700}
        fill="#f59e0b"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 0.9, duration: 0.3 }}
      >
        BF16 페이로드
      </motion.text>
      <motion.text
        x={60}
        y={70}
        fontSize={9}
        fontWeight={700}
        fill="#fb923c"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.3 }}
      >
        INT4 페이로드
      </motion.text>

      {/* 바이트 수 크로스페이드 */}
      <motion.text
        x={335}
        y={99}
        fontSize={8.5}
        fontWeight={600}
        fill="#f59e0b"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 0.9, duration: 0.3 }}
      >
        100 MB
      </motion.text>
      <motion.text
        x={335}
        y={99}
        fontSize={8.5}
        fontWeight={600}
        fill="#fb923c"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.3 }}
      >
        25 MB
      </motion.text>

      <motion.text
        x={240}
        y={132}
        textAnchor="middle"
        fontSize={7.5}
        fill="var(--muted-foreground)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9 }}
      >
        같은 텐서라도 bit 수를 낮추면 분자(바이트 수)가 그대로 줄어든다
      </motion.text>

      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.05 }}
      >
        <AlertBox
          x={80}
          y={150}
          w={320}
          h={38}
          label="정확도와 맞바꾸는 결정"
          sub="통신용 부분 적용 vs weight 전체 적용을 구분해야 함"
          color={C.warn}
        />
      </motion.g>
    </g>
  );
}

/** Step 4: D) Batching — 작은 batch(idle 큼) → 큰 batch(연산이 통신을 덮어씀) */
export function Step4() {
  return (
    <g>
      <text
        x={240}
        y={16}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill={C.batchD}
      >
        D) Batching — 통신을 연산 뒤에 숨긴다
      </text>

      {/* 통신 레인 (고정 길이) */}
      <text x={16} y={64} fontSize={7.5} fontWeight={600} fill="var(--foreground)">
        통신
      </text>
      <ModuleBox x={50} y={50} w={370} h={24} label="All-to-all 통신" sub="고정 시간" color={C.time} />

      {/* 연산 레인 */}
      <text x={16} y={100} fontSize={7.5} fontWeight={600} fill="var(--foreground)">
        연산
      </text>
      <rect x={50} y={86} width={370} height={24} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.8} />

      {/* 연산 막대 — batch가 커지며 폭이 늘어 통신 구간을 덮음 */}
      <motion.rect
        x={50}
        y={86}
        height={24}
        rx={6}
        fill={C.batchD}
        initial={{ width: 130 }}
        animate={{ width: 380 }}
        transition={{ delay: 1.0, duration: 0.9 }}
      />

      {/* idle 구간 — 연산이 못 덮은 나머지, 폭이 0으로 줄어듦 */}
      <motion.rect
        y={86}
        height={24}
        rx={4}
        fill={C.warn}
        fillOpacity={0.25}
        stroke={C.warn}
        strokeWidth={0.8}
        strokeDasharray="3 2"
        initial={{ x: 180, width: 170 }}
        animate={{ x: 430, width: 0 }}
        transition={{ delay: 1.0, duration: 0.9 }}
      />

      {/* 레이블 크로스페이드 */}
      <motion.text
        x={240}
        y={128}
        textAnchor="middle"
        fontSize={8}
        fontWeight={600}
        fill={C.warn}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 0.9, duration: 0.3 }}
      >
        batch 작음 → 통신 끝나길 기다리는 idle이 큼
      </motion.text>
      <motion.text
        x={240}
        y={128}
        textAnchor="middle"
        fontSize={8}
        fontWeight={600}
        fill={C.ok}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.3 }}
      >
        batch 큼 → 연산이 통신을 덮어써 idle이 사라짐
      </motion.text>

      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9 }}
      >
        <AlertBox
          x={70}
          y={150}
          w={340}
          h={36}
          label="batch 확대는 activation 메모리와 트레이드오프"
          sub="VRAM 여유(48GB 개조분)와 맞바꾸는 결정"
          color={C.warn}
        />
      </motion.g>
    </g>
  );
}

/** Step 5: 정리 — 4기법을 byte-reduction / time-hiding 두 그룹으로 시각적으로 묶기 */
export function Step5() {
  return (
    <g>
      <text
        x={240}
        y={16}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill={C.pcie}
      >
        네 기법 — 두 그룹, 하나의 상한
      </text>

      {/* 좌 클러스터 아우트라인 */}
      <motion.rect
        x={20}
        y={36}
        width={190}
        height={104}
        rx={9}
        fill="none"
        stroke={C.byte}
        strokeWidth={0.8}
        strokeDasharray="4 3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      />
      <text x={115} y={30} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.byte}>
        바이트 수 줄이기
      </text>

      {/* 우 클러스터 아우트라인 */}
      <motion.rect
        x={270}
        y={36}
        width={190}
        height={104}
        rx={9}
        fill="none"
        stroke={C.time}
        strokeWidth={0.8}
        strokeDasharray="4 3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
      />
      <text x={365} y={30} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.time}>
        시간을 연산으로 숨기기
      </text>

      {/* 4개 미니 박스 */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <DataBox x={30} y={44} w={170} h={40} label="A) Expert 배치" sub="경계 자체를 안 넘음" color={C.expertA} />
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
        <DataBox x={30} y={92} w={170} h={40} label="C) Quantization" sub="바이트 자체를 축소" color={C.quantC} />
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <DataBox x={280} y={44} w={170} h={40} label="B) TP → PP" sub="구간마다 1번 통신" color={C.ppB} />
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}>
        <DataBox x={280} y={92} w={170} h={40} label="D) Batching" sub="연산 뒤로 통신을 가림" color={C.batchD} />
      </motion.g>

      {/* 하단 상한 배너 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
        <StatusBox
          x={60}
          y={150}
          w={360}
          h={38}
          label="PCIe 상한 자체는 안 바뀐다"
          sub="효과는 원래 병목이 얼마나 심했는가에 비례"
          color={C.pcie}
          progress={1}
        />
      </motion.g>
    </g>
  );
}
