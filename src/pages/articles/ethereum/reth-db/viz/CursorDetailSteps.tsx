import { motion } from 'framer-motion';
import { C } from './CursorDetailVizData';

export function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      seek_exact(key) — B+tree 탐색
    </text>
    <text x={20} y={42} fontSize={10} fill={C.key}>
      Line 1: let cursor = tx.cursor(PlainAccountState)?
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.key}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: cursor.seek_exact(0xd8dA..6045)?  // O(log n)
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.key}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // Root → Branch(0x00..7f) → Leaf(0xd8dA..)
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      B+tree 높이 3~4 → 수십만 계정도 3~4번 비교로 도달
    </motion.text>
  </g>);
}

export function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      walk_range(start..end) — 연속 읽기
    </text>
    <text x={20} y={42} fontSize={10} fill={C.leaf}>
      Line 1: let iter = cursor.walk_range(19_000_001..19_000_004)?
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.leaf}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: for (key, value) in iter {'{'}
    </motion.text>
    <motion.text x={40} y={74} fontSize={10} fill={C.leaf}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3:     process(key, value)  // 리프 체인 순차 순회
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.leaf}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: {'}'}  // 순차 디스크 I/O → 캐시 히트율 높음
    </motion.text>
  </g>);
}

export function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      upsert(key, value) — 삽입/갱신
    </text>
    <text x={20} y={42} fontSize={10} fill={C.rw}>
      Line 1: cursor.upsert(0xd8dA..6045, Account {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.rw}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:     balance: 30_800_000_000, nonce: 413
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.rw}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: {'}'})?  // 있으면 갱신, 없으면 삽입
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      B+tree 자동 split/merge — DbCursorRW trait
    </motion.text>
  </g>);
}
