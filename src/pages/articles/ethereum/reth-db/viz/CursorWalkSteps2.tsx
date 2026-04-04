import { motion } from 'framer-motion';
import { C } from './CursorWalkVizData';

export function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      walk_range(10..50) — Leaf 체인 순회
    </text>
    <text x={20} y={42} fontSize={10} fill={C.key}>
      Line 1: cursor.seek(10)?  // Leaf [5|8|10] 도달
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.leaf}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: // next → Leaf [12|20|30]  (key &lt; 50 계속)
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.leaf}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // next → Leaf [35|42|48]  (key &lt; 50 계속)
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.dim}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: // next → Leaf [50|55|60]  (key=50 &gt;= 50, 중단)
    </motion.text>
    <motion.text x={20} y={114} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      seek 1회 + leaf 순차 이동 = 범위 조회에 최적
    </motion.text>
  </g>);
}
