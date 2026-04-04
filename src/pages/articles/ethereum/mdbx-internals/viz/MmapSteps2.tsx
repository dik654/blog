import { motion } from 'framer-motion';
import { C } from './MmapVizData';

export function Step3() {
  return (
    <g>
      <text x={30} y={24} fontSize={11} fontWeight={600}
        fill={C.cow}>Copy-on-Write</text>
      {/* Original page */}
      <rect x={30} y={40} width={130} height={60} rx={6}
        fill={`${C.dim}10`} stroke={C.dim} strokeWidth={1} />
      <text x={95} y={62} textAnchor="middle" fontSize={11}
        fontWeight={500} fill={C.dim}>pg7 (원본)</text>
      <text x={95} y={82} textAnchor="middle" fontSize={10}
        fill={C.dim}>data = A</text>
      {/* Write arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}>
        <text x={185} y={48} fontSize={10} fontWeight={600}
          fill={C.cow}>write!</text>
        <line x1={160} y1={65} x2={208} y2={65}
          stroke={C.cow} strokeWidth={1.5} />
        <polygon points="206,60 214,65 206,70" fill={C.cow} />
      </motion.g>
      {/* New page */}
      <motion.g initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}>
        <rect x={220} y={40} width={140} height={60} rx={6}
          fill={`${C.cow}14`} stroke={C.cow} strokeWidth={1.4} />
        <text x={290} y={62} textAnchor="middle" fontSize={11}
          fontWeight={600} fill={C.cow}>pg42 (복사본)</text>
        <text x={290} y={82} textAnchor="middle" fontSize={10}
          fill={C.cow}>data = B</text>
      </motion.g>
      {/* Readers still see old */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}>
        <rect x={30} y={120} width={130} height={30} rx={5}
          fill={`${C.proc}10`} stroke={C.proc} strokeWidth={0.8} />
        <text x={95} y={140} textAnchor="middle" fontSize={10}
          fill={C.proc}>Reader → pg7 (변경 없음)</text>
        <rect x={220} y={120} width={140} height={30} rx={5}
          fill={`${C.cow}10`} stroke={C.cow} strokeWidth={0.8} />
        <text x={290} y={140} textAnchor="middle" fontSize={10}
          fill={C.cow}>Writer → pg42 (수정본)</text>
      </motion.g>
      <motion.text x={210} y={175} textAnchor="middle" fontSize={10}
        fill={C.dim} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}>
        원본 페이지를 건드리지 않으므로 읽기/쓰기가 서로 차단하지 않음
      </motion.text>
    </g>
  );
}

export function Step4() {
  return (
    <g>
      <text x={20} y={22} fontSize={10} fontWeight={600}
        fill={C.cow}>커밋 후: meta 페이지 원자적 업데이트</text>
      {/* Old tree */}
      <motion.g initial={{ opacity: 1 }} animate={{ opacity: 0.35 }}
        transition={{ delay: 0.5, duration: 0.3 }}>
        <rect x={20} y={40} width={80} height={80} rx={5}
          fill={`${C.dim}08`} stroke={C.dim} strokeWidth={0.8} />
        <text x={60} y={60} textAnchor="middle" fontSize={10}
          fill={C.dim}>Old Tree</text>
        <text x={60} y={78} textAnchor="middle" fontSize={9}
          fill={C.dim}>root → pg7</text>
      </motion.g>
      {/* Meta page */}
      <rect x={130} y={60} width={80} height={36} rx={5}
        fill={`${C.os}10`} stroke={C.os} strokeWidth={1.2} />
      <text x={170} y={78} textAnchor="middle" fontSize={10}
        fontWeight={600} fill={C.os}>Meta Page</text>
      <text x={170} y={92} textAnchor="middle" fontSize={8}
        fill={C.os}>txnid + root_pgno</text>
      {/* Arrow switch */}
      <motion.line x1={210} y1={78} x2={250} y2={78}
        stroke={C.cow} strokeWidth={1.5}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }} />
      <polygon points="248,74 256,78 248,82" fill={C.cow} />
      {/* New tree */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}>
        <rect x={260} y={40} width={100} height={80} rx={5}
          fill={`${C.cow}10`} stroke={C.cow} strokeWidth={1.2} />
        <text x={310} y={60} textAnchor="middle" fontSize={10}
          fontWeight={600} fill={C.cow}>New Tree</text>
        <text x={310} y={78} textAnchor="middle" fontSize={9}
          fill={C.cow}>root → pg42</text>
        <text x={310} y={96} textAnchor="middle" fontSize={9}
          fill={C.dim}>수정된 경로만 새 페이지</text>
      </motion.g>
    </g>
  );
}
