import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };
const C = { fn: '#6366f1', data: '#10b981', struct: '#f59e0b', out: '#ec4899' };

export function BatcherStep0() {
  return (
    <g>
      <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
        fill="var(--foreground)">Batcher 호출 체인 — 내부 코드 라인</text>
      <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
        <rect x={20} y={30} width={480} height={22} rx={4} fill={`${C.fn}08`} stroke={C.fn} strokeWidth={0.8} />
        <text x={30} y={44} fontSize={10} fontWeight={600} fill={C.fn} fontFamily="monospace">Line 1:</text>
        <text x={85} y={44} fontSize={10} fill="var(--foreground)" fontFamily="monospace">func (l *BatchSubmitter) loop() {'{'} l.loadBlocksIntoState(ctx) {'}'}</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={20} y={58} width={480} height={22} rx={4} fill={`${C.data}08`} stroke={C.data} strokeWidth={0.8} />
        <text x={30} y={72} fontSize={10} fontWeight={600} fill={C.data} fontFamily="monospace">Line 2:</text>
        <text x={85} y={72} fontSize={10} fill="var(--foreground)" fontFamily="monospace">s.channelManager.AddL2Block(block)  // L2 블록을 큐에 추가</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.2 }}>
        <rect x={20} y={86} width={480} height={22} rx={4} fill={`${C.struct}08`} stroke={C.struct} strokeWidth={0.8} />
        <text x={30} y={100} fontSize={10} fontWeight={600} fill={C.struct} fontFamily="monospace">Line 3:</text>
        <text x={85} y={100} fontSize={10} fill="var(--foreground)" fontFamily="monospace">s.channelManager.processBlocks()  // 큐 → 채널 압축</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={20} y={114} width={480} height={22} rx={4} fill={`${C.out}08`} stroke={C.out} strokeWidth={0.8} />
        <text x={30} y={128} fontSize={10} fontWeight={600} fill={C.out} fontFamily="monospace">Line 4:</text>
        <text x={85} y={128} fontSize={10} fill="var(--foreground)" fontFamily="monospace">txData, err := s.channelManager.TxData(l1Head)  // DA TX 생성</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <rect x={20} y={148} width={480} height={44} rx={6}
          fill={`${C.struct}06`} stroke={C.struct} strokeWidth={0.8} />
        <text x={30} y={164} fontSize={10} fontWeight={600} fill={C.struct}>channelManager struct</text>
        <text x={30} y={180} fontSize={10} fill="var(--foreground)" fontFamily="monospace">
          blocks: Queue | blockCursor: int | currentChannel: *channel | channelQueue: []*channel
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <rect x={20} y={204} width={200} height={24} rx={5}
          fill={`${C.data}10`} stroke={C.data} strokeWidth={0.8} />
        <text x={120} y={220} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.data}>
          입력: L2 Block
        </text>
        <rect x={300} y={204} width={200} height={24} rx={5}
          fill={`${C.out}10`} stroke={C.out} strokeWidth={0.8} />
        <text x={400} y={220} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.out}>
          출력: L1 TX (blob/calldata)
        </text>
      </motion.g>
    </g>
  );
}

export { BatcherStep1 } from './BatcherFlowSteps2';
export { BatcherStep2 } from './BatcherFlowSteps3';
export { BatcherStep3 } from './BatcherFlowSteps4';
