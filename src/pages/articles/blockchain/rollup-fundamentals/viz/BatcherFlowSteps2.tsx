import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };
const C = { fn: '#6366f1', ok: '#10b981', err: '#ef4444', field: '#f59e0b' };

export function BatcherStep1() {
  return (
    <g>
      <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
        <rect x={20} y={10} width={480} height={26} rx={6}
          fill={`${C.fn}10`} stroke={C.fn} strokeWidth={1.2} />
        <text x={260} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.fn}>
          AddL2Block(block *types.Block) error
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
        <rect x={20} y={50} width={480} height={22} rx={4} fill={`${C.ok}06`} stroke={C.ok} strokeWidth={0.6} />
        <text x={30} y={64} fontSize={10} fontWeight={600} fill={C.ok} fontFamily="monospace">Line 1:</text>
        <text x={85} y={64} fontSize={10} fill="var(--foreground)" fontFamily="monospace">if s.tip != eth.HeaderBlockID(block.ParentHash()) {'{'}</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
        <rect x={20} y={78} width={480} height={22} rx={4} fill={`${C.err}06`} stroke={C.err} strokeWidth={0.6} />
        <text x={30} y={92} fontSize={10} fontWeight={600} fill={C.err} fontFamily="monospace">Line 2:</text>
        <text x={85} y={92} fontSize={10} fill="var(--foreground)" fontFamily="monospace">  return ErrReorg  // ParentHash 불일치 → reorg 감지, 리셋 필요</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <rect x={20} y={106} width={480} height={22} rx={4} fill={`${C.field}06`} stroke={C.field} strokeWidth={0.6} />
        <text x={30} y={120} fontSize={10} fontWeight={600} fill={C.field} fontFamily="monospace">Line 3:</text>
        <text x={85} y={120} fontSize={10} fill="var(--foreground)" fontFamily="monospace">s.blocks.Enqueue(ToSizedBlock(block))  // 큐에 추가</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <rect x={20} y={134} width={480} height={22} rx={4} fill={`${C.ok}08`} stroke={C.ok} strokeWidth={0.8} />
        <text x={30} y={148} fontSize={10} fontWeight={600} fill={C.ok} fontFamily="monospace">Line 4:</text>
        <text x={85} y={148} fontSize={10} fill="var(--foreground)" fontFamily="monospace">s.tip = block.Hash()  // 팁 해시 갱신 → return nil (성공)</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <text x={260} y={180} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          정상: nil 반환 / reorg 감지: ErrReorg → 채널 매니저 전체 리셋
        </text>
      </motion.g>
    </g>
  );
}
