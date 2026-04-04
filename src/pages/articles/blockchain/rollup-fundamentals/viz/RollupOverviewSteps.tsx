import { motion } from 'framer-motion';

const L1 = '#6366f1', L2 = '#10b981', DA = '#f59e0b';

export function Step0() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={20} y={10} width={480} height={22} rx={4} fill={`${L1}06`} stroke={L1} strokeWidth={0.6} />
      <text x={30} y={24} fontSize={10} fontWeight={600} fill={L1} fontFamily="monospace">Line 1:</text>
      <text x={85} y={24} fontSize={10} fill="var(--foreground)" fontFamily="monospace">for _, tx := range block.Txs {'{'} ExecuteTx(stateDB, tx) {'}'}</text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={20} y={38} width={480} height={22} rx={4} fill={`${L1}06`} stroke={L1} strokeWidth={0.6} />
        <text x={30} y={52} fontSize={10} fontWeight={600} fill={L1} fontFamily="monospace">Line 2:</text>
        <text x={85} y={52} fontSize={10} fill="var(--foreground)" fontFamily="monospace">// 모든 노드가 모든 TX를 실행 → 처리량 한계 (~15 TPS)</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={20} y={66} width={480} height={22} rx={4} fill="#ef444406" stroke="#ef4444" strokeWidth={0.6} />
        <text x={30} y={80} fontSize={10} fontWeight={600} fill="#ef4444" fontFamily="monospace">Line 3:</text>
        <text x={85} y={80} fontSize={10} fill="var(--foreground)" fontFamily="monospace">baseFee = parentBaseFee * (gasUsed / gasTarget)  // 수요 폭증 → 가스비 폭등</text>
      </motion.g>
      <motion.text x={260} y={110} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        실행·검증·저장·합의를 한 체인에서 전부 수행 → 확장 한계
      </motion.text>
    </motion.g>
  );
}

export function Step1() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={20} y={10} width={480} height={22} rx={4} fill={`${L2}06`} stroke={L2} strokeWidth={0.6} />
      <text x={30} y={24} fontSize={10} fontWeight={600} fill={L2} fontFamily="monospace">Line 1:</text>
      <text x={85} y={24} fontSize={10} fill="var(--foreground)" fontFamily="monospace">sequencer.ProcessTx(tx)  // L2에서 TX 실행 + 상태 관리</text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={20} y={38} width={480} height={22} rx={4} fill={`${DA}06`} stroke={DA} strokeWidth={0.6} />
        <text x={30} y={52} fontSize={10} fontWeight={600} fill={DA} fontFamily="monospace">Line 2:</text>
        <text x={85} y={52} fontSize={10} fill="var(--foreground)" fontFamily="monospace">batcher.PostBatch(l1Client, batchData)  // 결과를 L1에 기록</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={20} y={66} width={480} height={22} rx={4} fill={`${L1}06`} stroke={L1} strokeWidth={0.6} />
        <text x={30} y={80} fontSize={10} fontWeight={600} fill={L1} fontFamily="monospace">Line 3:</text>
        <text x={85} y={80} fontSize={10} fill="var(--foreground)" fontFamily="monospace">l1.VerifyStateRoot(outputRoot)  // L1이 보안 + 최종 확정 담당</text>
      </motion.g>
      <motion.text x={260} y={110} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        L2도 블록체인 — 시퀀서가 블록을 생성하고 노드들이 검증
      </motion.text>
    </motion.g>
  );
}
