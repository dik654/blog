import { motion } from 'framer-motion';
import { C } from './MmapVizData';

export function Step2() {
  return (
    <g>
      <text x={30} y={24} fontSize={11} fontWeight={600}
        fill={C.proc}>최초 접근 → Page Fault</text>
      {/* Application access */}
      <motion.rect x={60} y={38} width={140} height={30} rx={5}
        fill={`${C.proc}14`} stroke={C.proc} strokeWidth={1}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
      <text x={130} y={58} textAnchor="middle" fontSize={10}
        fill={C.proc}>접근: pg5</text>
      {/* FAULT arrow */}
      <motion.g initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <line x1={130} y1={68} x2={130} y2={90}
          stroke="#ef4444" strokeWidth={1.5} />
        <text x={155} y={84} fontSize={10} fontWeight={600}
          fill="#ef4444">FAULT!</text>
      </motion.g>
      {/* OS Kernel */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}>
        <rect x={30} y={96} width={200} height={34} rx={5}
          fill={`${C.os}10`} stroke={C.os} strokeWidth={1} />
        <text x={130} y={118} textAnchor="middle" fontSize={10}
          fill={C.os}>OS Kernel: load pg5</text>
      </motion.g>
      {/* Disk + arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}>
        <line x1={300} y1={113} x2={235} y2={113}
          stroke={C.os} strokeWidth={1.2} />
        <polygon points="237,109 230,113 237,117" fill={C.os} />
        <text x={267} y={107} textAnchor="middle" fontSize={10}
          fill={C.os}>4KB</text>
        <rect x={300} y={96} width={80} height={34} rx={5}
          fill={`${C.disk}10`} stroke={C.disk} strokeWidth={1} />
        <text x={340} y={118} textAnchor="middle" fontSize={10}
          fill={C.disk}>Disk</text>
      </motion.g>
      {/* Explanation */}
      <motion.text x={210} y={160} textAnchor="middle" fontSize={10}
        fill={C.dim} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}>
        이후 재접근: 물리 메모리에서 즉시 반환 (syscall 없음)
      </motion.text>
    </g>
  );
}
