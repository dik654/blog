import { motion } from 'framer-motion';
import { C } from './MmapZeroCopyVizData';

export function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      Traditional read() — 2번 복사
    </text>
    <text x={20} y={42} fontSize={10} fill={C.disk}>
      Line 1: let buf = vec![0u8; 4096];
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.kern}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: read(fd, &amp;mut buf, 4096)  // syscall
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.slow}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // Disk → Kernel Buffer (memcpy 1회)
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.slow}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: // Kernel Buffer → App Buffer (memcpy 2회)
    </motion.text>
    <motion.text x={20} y={112} fontSize={10} fill={C.slow} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      2번 복사 = 느림 — 대량 I/O 시 병목
    </motion.text>
  </g>);
}

export function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      mmap — 0번 복사
    </text>
    <text x={20} y={42} fontSize={10} fill={C.app}>
      Line 1: let ptr = mmap(fd, 0, file_size, PROT_READ)
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.app}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: let value = *ptr.add(offset)  // 포인터 역참조
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.kern}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // MMU가 가상 → 물리 주소 변환 (page cache)
    </motion.text>
    <motion.text x={20} y={94} fontSize={10} fill={C.fast} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      복사 0회 — 포인터 역참조만으로 데이터 접근
    </motion.text>
  </g>);
}
