import { motion } from 'framer-motion';
import { C } from './CursorWalkVizData';

export function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      실제 워크로드: Stage vs RPC
    </text>
    <text x={20} y={42} fontSize={10} fill={C.rw}>
      Line 1: // Stage (동기화): walk_range(block#100..#200)
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.rw}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
      Line 2: let iter = cursor.walk_range(100..200)?
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.rw}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 3: // 순차 디스크 I/O → 높은 캐시 히트율
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill={C.key}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
      Line 4: // RPC (조회): seek_exact(tx_hash)
    </motion.text>
    <motion.text x={20} y={112} fontSize={10} fill={C.key}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 5: let (k, v) = cursor.seek_exact(0x3b7c..)?
    </motion.text>
    <motion.text x={20} y={132} fontSize={10} fill={C.leaf} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      커서가 두 워크로드 패턴을 모두 효율적으로 지원
    </motion.text>
  </g>);
}
