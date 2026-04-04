import { motion } from 'framer-motion';
import { C } from './HistoricalVizData';

export function StepTableStructure() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      AccountChangeSets 테이블 구조
    </text>
    <text x={20} y={42} fontSize={10} fill={C.change}>
      Line 1: // Key = (BlockNumber, Address) 복합 키
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.change}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
      Line 2: (19_000_100, 0xd8dA..6045) → bal=30.9, nonce=143
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.change}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 3: (19_000_099, 0xA0b8..69E5) → bal=500.2, nonce=87
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.change}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 4: (19_000_099, 0xd8dA..6045) → bal=31.0, nonce=142
    </motion.text>
    <motion.text x={20} y={106} fontSize={10} fill={C.change}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 5: (19_000_001, 0xd8dA..6045) → bal=32.1, nonce=141
    </motion.text>
    <motion.text x={20} y={130} fontSize={10} fill={C.table}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      B+tree 범위 스캔 최적화 — 같은 블록의 변경을 한 번에 순회
    </motion.text>
    <motion.text x={20} y={148} fontSize={10} fill={C.key}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>
      cursor.walk_range((target+1)..=latest) → O(n) 순차 접근
    </motion.text>
  </g>);
}
