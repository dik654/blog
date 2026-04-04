import { motion } from 'framer-motion';
import { C } from './PagedAttentionVizData';
import { Block, Label } from './PagedAttentionVizParts';

export function Step3() {
  return (
    <g>
      <Label x={10} y={16} text="Copy-on-Write (Beam Search)" />
      <Block x={10} y={30} label="B0" color={C.shared} />
      <Block x={50} y={30} label="B1" color={C.shared} />
      <text x={45} y={26} fontSize={9} fill={C.shared}>공유 접두사</text>
      <motion.line x1={86} y1={42} x2={110} y2={70} stroke={C.alloc}
        strokeWidth={1.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
      <Block x={110} y={60} label="A2" color={C.alloc} />
      <text x={145} y={66} fontSize={9} fill={C.alloc}>Seq A</text>
      <motion.line x1={86} y1={42} x2={110} y2={110} stroke={C.cow}
        strokeWidth={1.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.2 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <Block x={110} y={100} label="B2'" color={C.cow} />
        <text x={145} y={106} fontSize={9} fill={C.cow}>Seq B (CoW)</text>
      </motion.g>
      <Label x={10} y={140} text="B0, B1은 공유 → 분기 시에만 복사" />
    </g>
  );
}

export function Step4() {
  return (
    <g>
      <Label x={10} y={20} text="메모리 효율 비교" />
      <rect x={10} y={35} width={100} height={18} rx={3} fill="#ef444422" stroke="#ef4444" strokeWidth={1} />
      <text x={60} y={48} textAnchor="middle" fontSize={9} fill="#ef4444">기존: 20-38% 낭비</text>
      <motion.rect x={10} y={60} width={0} height={18} rx={3} fill={`${C.shared}22`} stroke={C.shared} strokeWidth={1}
        animate={{ width: 16 }} transition={{ duration: 0.5 }} />
      <motion.text x={30} y={73} fontSize={9} fill={C.shared}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        vLLM: ~4%
      </motion.text>
      <Label x={10} y={105} text="처리량 향상" />
      <rect x={10} y={112} width={40} height={16} rx={3} fill={`${C.free}33`} />
      <text x={30} y={124} textAnchor="middle" fontSize={9} fill={C.free}>HF 1x</text>
      <motion.rect x={55} y={112} width={0} height={16} rx={3} fill={`${C.alloc}44`}
        animate={{ width: 240 }} transition={{ duration: 0.8 }} />
      <motion.text x={175} y={124} textAnchor="middle" fontSize={9} fontWeight="700" fill={C.alloc}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        vLLM: 최대 24x
      </motion.text>
    </g>
  );
}
