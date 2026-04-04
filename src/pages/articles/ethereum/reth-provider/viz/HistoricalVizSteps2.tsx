import { motion } from 'framer-motion';
import { C } from './HistoricalVizData';

export function StepReverseTrace() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      역추적 — 현재에서 과거로 패치 적용
    </text>
    <text x={20} y={42} fontSize={10} fill={C.current}>
      Line 1: let mut balance = current_balance  // 30.8 ETH
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.change}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: let cursor = tx.cursor(AccountChangeSets)?
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.change}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: for entry in cursor.walk_range((target+1)..=latest).rev() {'{'}
    </motion.text>
    <motion.text x={40} y={90} fontSize={10} fill={C.change}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4:     balance = entry.old_balance  // 30.9 → 31.0 → ...
    </motion.text>
    <motion.text x={20} y={106} fontSize={10} fill={C.change}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      Line 5: {'}'}
    </motion.text>
    <motion.text x={20} y={126} fontSize={10} fill={C.past} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      Line 6: balance == 32.1 ETH  // 목표 블록(#19M) 상태 복원
    </motion.text>
  </g>);
}
