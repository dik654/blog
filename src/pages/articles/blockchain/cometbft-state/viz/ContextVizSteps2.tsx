import { motion } from 'framer-motion';
import { AlertBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

export function Step4() {
  return (<g>
    <AlertBox x={20} y={15} w={100} h={40} label="이중 투표" sub="비잔틴 증거" color={C.err} />
    <motion.line x1={125} y1={35} x2={160} y2={35} stroke={C.evidence} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={165} y={15} w={100} h={40} label="AddEvidence" sub="검증 → 풀 추가" color={C.evidence} />
    </motion.g>
    <motion.line x1={270} y1={35} x2={305} y2={35} stroke={C.evidence} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <DataBox x={310} y={20} w={90} h={30} label="블록에 포함" color={C.state} />
    </motion.g>
    <text x={210} y={80} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      제안자가 PendingEvidence() → 블록에 증거 삽입
    </text>
    <motion.text x={210} y={95} textAnchor="middle" fontSize={10} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
      증거 포함된 블록 확정 → 슬래싱
    </motion.text>
  </g>);
}
