import { motion } from 'framer-motion';
import { C } from './MmapVizData';

export function Step0() {
  return (
    <g>
      <rect x={20} y={20} width={130} height={120} rx={6}
        fill={`${C.proc}08`} stroke={C.proc} strokeWidth={1} />
      <text x={85} y={38} textAnchor="middle" fontSize={10}
        fontWeight={600} fill={C.proc}>Virtual Memory</text>
      {['0x00', '0x10', '0x20'].map((_, i) => (
        <rect key={i} x={30} y={50 + i * 28} width={110}
          height={20} rx={3} fill={`${C.proc}12`} stroke={C.proc}
          strokeWidth={0.5} />
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}>
        <line x1={155} y1={80} x2={210} y2={80}
          stroke={C.os} strokeWidth={1.5} />
        <polygon points="208,76 216,80 208,84" fill={C.os} />
        <text x={183} y={72} textAnchor="middle" fontSize={9}
          fontWeight={600} fill={C.os}>mmap()</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}>
        <rect x={220} y={20} width={130} height={120} rx={6}
          fill={`${C.disk}08`} stroke={C.disk} strokeWidth={1} />
        <text x={285} y={38} textAnchor="middle" fontSize={10}
          fontWeight={600} fill={C.disk}>DB File</text>
        {['pg0', 'pg1', 'pg2'].map((_, i) => (
          <rect key={i} x={230} y={50 + i * 28} width={110}
            height={20} rx={3} fill={`${C.disk}12`}
            stroke={C.disk} strokeWidth={0.5} />
        ))}
      </motion.g>
      <text x={200} y={165} textAnchor="middle" fontSize={10}
        fill={C.dim}>1:1 주소 대응</text>
    </g>
  );
}

export function Step1() {
  return (
    <g>
      <text x={20} y={28} fontSize={10} fontWeight={600}
        fill={C.proc}>Application Code</text>
      <rect x={20} y={38} width={160} height={30} rx={4}
        fill={`${C.proc}10`} stroke={C.proc} strokeWidth={1} />
      <text x={100} y={57} textAnchor="middle" fontSize={10}
        fontFamily="monospace" fill={C.proc}>*ptr = data[key]</text>
      <motion.line x1={100} y1={68} x2={100} y2={95}
        stroke={C.proc} strokeWidth={1.2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.3 }} />
      <polygon points="96,93 104,93 100,100" fill={C.proc} />
      <rect x={20} y={100} width={160} height={30} rx={4}
        fill={`${C.disk}10`} stroke={C.disk} strokeWidth={1} />
      <text x={100} y={120} textAnchor="middle" fontSize={10}
        fill={C.disk}>mmap region (zero-copy)</text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}>
        <rect x={220} y={50} width={140} height={28} rx={4}
          fill="none" stroke={C.dim} strokeWidth={1}
          strokeDasharray="4 3" />
        <text x={260} y={60} fontSize={9} fill={C.dim}>
          read() 없음
        </text>
        <text x={260} y={72} fontSize={9} fill={C.dim}>
          버퍼 복사 없음
        </text>
      </motion.g>
    </g>
  );
}
