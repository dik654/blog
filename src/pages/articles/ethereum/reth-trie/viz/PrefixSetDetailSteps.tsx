import { motion } from 'framer-motion';
import { C } from './PrefixSetDetailVizData';

export function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      PrefixSet.insert(key) — 변경 키 수집
    </text>
    <text x={20} y={42} fontSize={10} fill={C.change}>
      Line 1: let mut set = BTreeSet::new()
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.change}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
      Line 2: set.insert(0xa1c3..)  // 변경된 계정 1
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.change}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 3: set.insert(0xb2d4..)  // 변경된 계정 2
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.change}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 4: set.insert(0xa1c8..)  // 변경된 계정 3
    </motion.text>
    <motion.text x={20} y={110} fontSize={10} fill={C.key}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      Line 5: let prefix_set = PrefixSet::freeze(set)  // 불변 집합화
    </motion.text>
  </g>);
}

export function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      contains(prefix) — 재계산 여부 판단
    </text>
    <text x={20} y={42} fontSize={10} fill={C.key}>
      Line 1: fn contains(&amp;self, prefix: Nibbles) -&gt; bool {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.key}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:     self.set.range(prefix..).next()
    </motion.text>
    <motion.text x={40} y={74} fontSize={10} fill={C.match}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3:         .map(|k| k.has_prefix(&amp;prefix))  // 0xa1c3 발견!
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.key}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: {'}'}  // 0xa1 → true (재해시 필요)
    </motion.text>
  </g>);
}

export function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      Trie 순회 — Branch에서 PrefixSet 확인
    </text>
    <text x={20} y={42} fontSize={10} fill={C.change}>
      Line 1: // Root 순회 시작
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.change}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: if prefix_set.contains(branch_A.prefix) {'{'}
    </motion.text>
    <motion.text x={40} y={74} fontSize={10} fill={C.change}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3:     recurse(branch_A)  // 변경 있음 → 재귀
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.skip}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: // branch_B → contains() == false → skip
    </motion.text>
    <motion.text x={20} y={110} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      변경 없는 서브트리를 건너뛰어 O(변경 수)로 최적화
    </motion.text>
  </g>);
}
