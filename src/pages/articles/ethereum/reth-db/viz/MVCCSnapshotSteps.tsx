import { motion } from 'framer-motion';
import { C } from './MVCCSnapshotVizData';

export function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      문제: 읽기 중 쓰기하면?
    </text>
    <text x={20} y={42} fontSize={10} fill={C.rd}>
      Line 1: // Reader: page_7.get(key)  // 읽는 중
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.wr}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: // Writer: page_7.put(key, new_value)  // 동시 쓰기
    </motion.text>
    <motion.text x={20} y={78} fontSize={10} fill={C.err} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: // 충돌! Reader가 반쯤 바뀐 데이터를 읽게 됨
    </motion.text>
    <motion.text x={20} y={100} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      같은 페이지를 동시에 접근하면 일관성 없는 결과
    </motion.text>
  </g>);
}

export function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      MVCC 해결: Copy-on-Write
    </text>
    <text x={20} y={42} fontSize={10} fill={C.wr}>
      Line 1: let page_42 = page_7.clone()  // 원본 복사
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.wr}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: page_42.put(key, new_value)  // 복사본 수정
    </motion.text>
    <motion.text x={20} y={78} fontSize={10} fill={C.rd}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // Reader는 원본 page_7을 계속 참조
    </motion.text>
    <motion.text x={20} y={100} fontSize={10} fill={C.ok} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      Reader와 Writer가 서로 다른 페이지 → 충돌 없음
    </motion.text>
  </g>);
}
