import { motion } from 'framer-motion';
import { C, BLOCK_W, GAP } from './PagedAttentionVizData';
import { Block, Label } from './PagedAttentionVizParts';

export function Step0() {
  return (
    <g>
      <Label x={10} y={20} text="GPU 메모리 (전통적 할당)" />
      <rect x={10} y={30} width={200} height={30} rx={4} fill={`${C.alloc}22`} stroke={C.alloc} strokeWidth={1.5} />
      <rect x={10} y={30} width={80} height={30} rx={4} fill={`${C.alloc}44`} />
      <Label x={15} y={50} text="Req1: 사용 40%" />
      <Label x={95} y={50} text="← 낭비 60% →" />
      <rect x={10} y={70} width={200} height={30} rx={4} fill={`${C.alloc}22`} stroke={C.alloc} strokeWidth={1.5} />
      <rect x={10} y={70} width={120} height={30} rx={4} fill={`${C.alloc}44`} />
      <Label x={15} y={90} text="Req2: 사용 60%" />
      <rect x={220} y={30} width={120} height={70} rx={4} fill="none" stroke={C.free} strokeWidth={1} strokeDasharray="4 3" />
      <Label x={240} y={70} text="외부 단편화" />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={10} y={120} width={100} height={22} rx={4} fill="#ef444422" stroke="#ef4444" strokeWidth={1} />
        <text x={60} y={135} textAnchor="middle" fontSize={9} fontWeight="700" fill="#ef4444">20-38% 낭비</text>
      </motion.g>
    </g>
  );
}

export function Step1() {
  return (
    <g>
      <Label x={10} y={16} text="Logical Blocks" />
      <Label x={200} y={16} text="Physical Blocks (GPU)" />
      {[0, 1, 2].map(i => <Block key={`l${i}`} x={10 + i * (BLOCK_W + GAP)} y={24} label={`L${i}`} color={C.alloc} />)}
      <motion.line x1={130} y1={36} x2={190} y2={36} stroke={C.alloc} strokeWidth={1.5} strokeDasharray="4 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
      <text x={155} y={30} fontSize={9} fill="var(--muted-foreground)">Block Table</text>
      <Block x={200} y={24} label="P7" color={C.alloc} />
      <Block x={260} y={60} label="P3" color={C.alloc} />
      <Block x={310} y={24} label="P12" color={C.alloc} />
      <Block x={200} y={60} label="free" color={C.free} dim />
      <Block x={240} y={24} label="free" color={C.free} dim />
      <Block x={310} y={60} label="free" color={C.free} dim />
      <Label x={200} y={100} text="비연속 할당 → 외부 단편화 없음" />
    </g>
  );
}

export function Step2() {
  return (
    <g>
      <Label x={10} y={16} text="Decode: 토큰 생성 중" />
      {[0, 1, 2].map(i => <Block key={i} x={10 + i * (BLOCK_W + GAP)} y={24} label={`B${i}`} color={C.alloc} />)}
      <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
        <Block x={10 + 3 * (BLOCK_W + GAP)} y={24} label="B3" color={C.shared} />
        <text x={10 + 3 * (BLOCK_W + GAP) + 18} y={60} textAnchor="middle" fontSize={9} fill={C.shared}>new!</text>
      </motion.g>
      <rect x={10} y={80} width={160} height={12} rx={3} fill={`${C.free}22`} />
      <motion.rect x={10} y={80} width={0} height={12} rx={3} fill={`${C.alloc}66`} animate={{ width: 154 }} transition={{ duration: 0.6 }} />
      <Label x={10} y={108} text="마지막 블록에서만 미사용 슬롯 발생 (~4%)" />
    </g>
  );
}
