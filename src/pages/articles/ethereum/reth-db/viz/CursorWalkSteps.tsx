import { motion } from 'framer-motion';
import { C } from './CursorWalkVizData';

export function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      seek_exact(key=42) — B+tree 하강
    </text>
    <text x={20} y={42} fontSize={10} fill={C.key}>
      Line 1: // Root [20 | 60] → key=42 &lt; 60 → 왼쪽 자식
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.key}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: // Internal [30 | 45] → 30 &lt; 42 &lt; 45 → 중간 자식
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.leaf}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // Leaf [40 | 42 | 45] → key=42 발견!
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      각 노드에서 이진 탐색 → 3단계 하강으로 도달
    </motion.text>
  </g>);
}

export function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      seek_exact 복잡도: O(h x log m)
    </text>
    <text x={20} y={42} fontSize={10} fill={C.key}>
      Line 1: h = 3  // 트리 높이 (1M 키 기준)
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.key}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: log(m) = ~7  // m=128 키/노드 이진 탐색
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.leaf} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: 총 비교 = 3 x 7 = 21회  // 1M 키에서도
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      100만 키에서도 21회 비교로 도달
    </motion.text>
  </g>);
}
