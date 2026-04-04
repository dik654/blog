import { motion } from 'framer-motion';
import { C } from './MmapZeroCopyVizData';

export function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      Page Fault 흐름
    </text>
    <text x={20} y={42} fontSize={10} fill={C.slow}>
      Line 1: *ptr  // 첫 접근 → Page Fault 발생
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.slow}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: // OS가 4KB 페이지를 디스크에서 로드 (~100us)
    </motion.text>
    <motion.text x={20} y={78} fontSize={10} fill={C.fast}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: *ptr  // 이후 접근 → page cache hit (~50ns)
    </motion.text>
    <motion.text x={20} y={94} fontSize={10} fill={C.fast}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: // 2000x 속도 차이 — 핫 데이터는 메모리 속도
    </motion.text>
    <motion.text x={20} y={116} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      한 번 로드된 페이지는 메모리 속도로 반복 접근
    </motion.text>
  </g>);
}

export function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      MDBX에서의 효과 — mmap B+tree
    </text>
    <text x={20} y={42} fontSize={10} fill={C.app}>
      Line 1: // B+tree 노드가 mmap된 페이지
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.app}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: let root = &amp;pages[0]  // Root 페이지
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.app}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: let child = &amp;pages[root.child_ptr]  // 포인터 추적
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.app}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: let leaf = &amp;pages[child.child_ptr]  // Leaf 도달
    </motion.text>
    <motion.text x={20} y={114} fontSize={10} fill={C.fast} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      포인터 역참조만으로 root→leaf 트리 탐색 — memcpy 없음
    </motion.text>
  </g>);
}
