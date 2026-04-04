import { motion } from 'framer-motion';

export function StepOverview() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      3가지 동기화 전략 비교
    </text>
    <text x={20} y={42} fontSize={10} fill="#6366f1">
      Line 1: Full Sync  // ~50시간, ~2TB, 제네시스부터 재실행
    </text>
    <motion.text x={20} y={58} fontSize={10} fill="#10b981"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: Snap Sync  // ~2-6시간, ~200GB, 상태만 다운로드
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill="#f59e0b"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: Live Sync  // 실시간, 증분, tip 추종
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      새 노드: Snap → tip 도달 → Live / 검증용: Full
    </motion.text>
  </g>);
}

export function StepFull() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      Full Sync — 제네시스부터 모든 블록 재실행
    </text>
    <text x={20} y={42} fontSize={10} fill="#8b5cf6">
      Line 1: pipeline.run([Headers, Bodies, Senders, Execution, Merkle])
    </text>
    <motion.text x={20} y={58} fontSize={10} fill="#8b5cf6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: // Headers → Bodies → Senders → Execution → Merkle
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill="#8b5cf6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // Genesis(Block 0) → Tip(Block ~19M) 순차 실행
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      모든 블록을 재실행하므로 수일 소요
    </motion.text>
  </g>);
}
