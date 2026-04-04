import { motion } from 'framer-motion';
import { C } from './HistoricalVizData';

export function StepChangeSetIntro() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      ChangeSet — "변경 전 값"을 기록
    </text>
    <text x={20} y={42} fontSize={10} fill={C.change}>
      Line 1: // AccountChangeSets 테이블
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.change}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
      Line 2: key: (block=#19M, addr=0xd8dA..)
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.change}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 3: value: old_balance=32.1 ETH, old_nonce=142
    </motion.text>
    <motion.text x={20} y={94} fontSize={10} fill={C.table}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
      Line 4: // StorageChangeSets 테이블
    </motion.text>
    <motion.text x={20} y={110} fontSize={10} fill={C.table}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 5: key: (block=#19M, contract=USDT, slot=3)
    </motion.text>
    <motion.text x={20} y={126} fontSize={10} fill={C.table}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
      Line 6: value: old_value=42
    </motion.text>
    <motion.text x={20} y={148} fontSize={10} fill={C.past} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      핵심: "변경 전 값" 기록 → 역방향 적용으로 과거 복원
    </motion.text>
  </g>);
}
