import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };
const C = { fn: '#6366f1', blob: '#10b981', call: '#f59e0b', out: '#ec4899' };

export function BatcherStep3() {
  return (
    <g>
      <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
        <rect x={20} y={10} width={480} height={26} rx={6}
          fill={`${C.fn}10`} stroke={C.fn} strokeWidth={1.2} />
        <text x={260} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.fn}>
          TxData(l1Head) (txData, error) — DA 타입 선택
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
        <rect x={20} y={50} width={480} height={22} rx={4} fill={`${C.fn}06`} stroke={C.fn} strokeWidth={0.6} />
        <text x={30} y={64} fontSize={10} fontWeight={600} fill={C.fn} fontFamily="monospace">Line 1:</text>
        <text x={85} y={64} fontSize={10} fill="var(--foreground)" fontFamily="monospace">ch, err := s.getReadyChannel(l1Head)  // processBlocks() 내부 호출</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
        <rect x={20} y={78} width={480} height={22} rx={4} fill={`${C.blob}06`} stroke={C.blob} strokeWidth={0.6} />
        <text x={30} y={92} fontSize={10} fontWeight={600} fill={C.blob} fontFamily="monospace">Line 2:</text>
        <text x={85} y={92} fontSize={10} fill="var(--foreground)" fontFamily="monospace">if s.UseBlobs {'{'} // EIP-4844 blob TX (저렴한 DA)</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <rect x={20} y={106} width={480} height={22} rx={4} fill={`${C.call}06`} stroke={C.call} strokeWidth={0.6} />
        <text x={30} y={120} fontSize={10} fontWeight={600} fill={C.call} fontFamily="monospace">Line 3:</text>
        <text x={85} y={120} fontSize={10} fill="var(--foreground)" fontFamily="monospace">{'}'} else {'{'} // calldata TX (blob이 비쌀 때 대체)</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <rect x={20} y={134} width={480} height={22} rx={4} fill={`${C.out}08`} stroke={C.out} strokeWidth={0.8} />
        <text x={30} y={148} fontSize={10} fontWeight={600} fill={C.out} fontFamily="monospace">Line 4:</text>
        <text x={85} y={148} fontSize={10} fill="var(--foreground)" fontFamily="monospace">return nextTxData(ch)  // 채널에서 프레임 추출 → txData 반환</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <text x={260} y={180} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          UseBlobs 플래그로 blob/calldata 분기 — 가스 비용에 따라 동적 전환
        </text>
      </motion.g>
    </g>
  );
}
