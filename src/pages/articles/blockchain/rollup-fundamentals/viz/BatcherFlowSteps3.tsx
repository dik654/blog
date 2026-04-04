import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };
const C = { fn: '#6366f1', ok: '#10b981', field: '#f59e0b', ch: '#0ea5e9' };

export function BatcherStep2() {
  return (
    <g>
      <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
        <rect x={20} y={10} width={480} height={26} rx={6}
          fill={`${C.fn}10`} stroke={C.fn} strokeWidth={1.2} />
        <text x={260} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.fn}>
          processBlocks() error — 큐 → 채널 압축
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
        <rect x={20} y={50} width={480} height={22} rx={4} fill={`${C.field}06`} stroke={C.field} strokeWidth={0.6} />
        <text x={30} y={64} fontSize={10} fontWeight={600} fill={C.field} fontFamily="monospace">Line 1:</text>
        <text x={85} y={64} fontSize={10} fill="var(--foreground)" fontFamily="monospace">for i := s.blockCursor; ; i++ {'{'} block := s.blocks.PeekN(i)</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
        <rect x={20} y={78} width={480} height={22} rx={4} fill={`${C.ch}06`} stroke={C.ch} strokeWidth={0.6} />
        <text x={30} y={92} fontSize={10} fontWeight={600} fill={C.ch} fontFamily="monospace">Line 2:</text>
        <text x={85} y={92} fontSize={10} fill="var(--foreground)" fontFamily="monospace">  s.currentChannel.AddBlock(block)  // 블록 데이터 압축 추가</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <rect x={20} y={106} width={480} height={22} rx={4} fill={`${C.ch}06`} stroke={C.ch} strokeWidth={0.6} />
        <text x={30} y={120} fontSize={10} fontWeight={600} fill={C.ch} fontFamily="monospace">Line 3:</text>
        <text x={85} y={120} fontSize={10} fill="var(--foreground)" fontFamily="monospace">  if s.currentChannel.IsFull() {'{'} break {'}'} // 채널 용량 초과 시 중단</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <rect x={20} y={134} width={480} height={22} rx={4} fill={`${C.ok}08`} stroke={C.ok} strokeWidth={0.8} />
        <text x={30} y={148} fontSize={10} fontWeight={600} fill={C.ok} fontFamily="monospace">Line 4:</text>
        <text x={85} y={148} fontSize={10} fill="var(--foreground)" fontFamily="monospace">s.blockCursor += blocksAdded  // 다음 호출 시 이어서 진행</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <text x={260} y={180} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          blockCursor가 큐 내 위치를 추적 — 매번 처음부터 탐색하지 않음
        </text>
      </motion.g>
    </g>
  );
}
