import { motion } from 'framer-motion';

const L1 = '#6366f1', DA = '#f59e0b', PR = '#ec4899';

export function Step2() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={20} y={10} width={480} height={22} rx={4} fill={`${DA}06`} stroke={DA} strokeWidth={0.6} />
      <text x={30} y={24} fontSize={10} fontWeight={600} fill={DA} fontFamily="monospace">Line 1:</text>
      <text x={85} y={24} fontSize={10} fill="var(--foreground)" fontFamily="monospace">batchData := compress(serialize(txBatch))  // TX 수천 건 압축</text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={20} y={38} width={480} height={22} rx={4} fill={`${L1}06`} stroke={L1} strokeWidth={0.6} />
        <text x={30} y={52} fontSize={10} fontWeight={600} fill={L1} fontFamily="monospace">Line 2:</text>
        <text x={85} y={52} fontSize={10} fill="var(--foreground)" fontFamily="monospace">l1.SendTx(calldata: batchData)  // 또는 blob으로 DA 저장</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={20} y={66} width={480} height={22} rx={4} fill={`${L1}06`} stroke={L1} strokeWidth={0.6} />
        <text x={30} y={80} fontSize={10} fontWeight={600} fill={L1} fontFamily="monospace">Line 3:</text>
        <text x={85} y={80} fontSize={10} fill="var(--foreground)" fontFamily="monospace">// 누구나 L1 데이터로 L2 상태를 재구성 가능 → 시퀀서 없이도 복구</text>
      </motion.g>
      <motion.text x={260} y={110} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        Data Availability: L1에 TX 데이터 + 상태 루트를 기록
      </motion.text>
    </motion.g>
  );
}

export function Step3() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={20} y={10} width={480} height={22} rx={4} fill={`${DA}06`} stroke={DA} strokeWidth={0.6} />
      <text x={30} y={24} fontSize={10} fontWeight={600} fill={DA} fontFamily="monospace">Line 1:</text>
      <text x={85} y={24} fontSize={10} fill="var(--foreground)" fontFamily="monospace">// Optimistic: 7일 이의 없으면 확정, 이의 시 Fraud Proof</text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={20} y={38} width={480} height={22} rx={4} fill={`${PR}06`} stroke={PR} strokeWidth={0.6} />
        <text x={30} y={52} fontSize={10} fontWeight={600} fill={PR} fontFamily="monospace">Line 2:</text>
        <text x={85} y={52} fontSize={10} fill="var(--foreground)" fontFamily="monospace">// ZK Rollup: proof := zkProver.Prove(batch) → 수학적 즉시 확정</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={20} y={66} width={480} height={22} rx={4} fill={`${L1}06`} stroke={L1} strokeWidth={0.6} />
        <text x={30} y={80} fontSize={10} fontWeight={600} fill={L1} fontFamily="monospace">Line 3:</text>
        <text x={85} y={80} fontSize={10} fill="var(--foreground)" fontFamily="monospace">l1.VerifyProof(outputRoot, proof)  // L1 검증 → L2 상태 확정</text>
      </motion.g>
      <motion.text x={260} y={110} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        두 방식 모두 L1의 보안을 상속 — L2 자체 합의에 의존하지 않음
      </motion.text>
    </motion.g>
  );
}
