import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };
const Cs = ['#ec4899', '#f59e0b', '#14b8a6', '#10b981', '#0ea5e9', '#3b82f6', '#6366f1'];

interface Stage { name: string; line: string }
const CHAIN: Stage[] = [
  { name: 'AttributesQueue', line: 'attrs := builder.PreparePayloadAttributes(safeHead)' },
  { name: 'BatchMux',        line: 'batch := mux.NextBatch(ctx)  // Singular/Span 분기' },
  { name: 'ChannelInReader', line: 'raw := decompress(ch.Data())  // zlib/brotli 해제' },
  { name: 'ChannelMux',      line: 'ch := assembleFrames(frameQueue)  // ID별 조립' },
  { name: 'FrameQueue',      line: 'frame := decodeFrame(rawBytes)  // Frame{id, data}' },
  { name: 'L1Retrieval',     line: 'data := filterBatcherTxData(l1Block)  // blob/calldata' },
  { name: 'L1Traversal',     line: 'ref := l1Client.BlockByNumber(cursor)  // L1 블록 전진' },
];

export function DerivStep0() {
  return (
    <g>
      <text x={260} y={16} textAnchor="middle" fontSize={12} fontWeight={700}
        fill="var(--foreground)">Pull 호출 체인 (위에서 아래로 호출)</text>
      {CHAIN.map((s, i) => {
        const y = 26 + i * 28;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.07 }}>
            <rect x={20} y={y} width={480} height={22} rx={4}
              fill={`${Cs[i]}08`} stroke={Cs[i]} strokeWidth={0.8} />
            <text x={30} y={y + 15} fontSize={10} fontWeight={700} fill={Cs[i]}>{s.name}</text>
            <text x={170} y={y + 15} fontSize={10} fill="var(--foreground)" fontFamily="monospace">
              {s.line}
            </text>
            {i < CHAIN.length - 1 && (
              <line x1={80} y1={y + 22} x2={80} y2={y + 28}
                stroke={Cs[i]} strokeWidth={0.8} markerEnd="url(#df-arr)" />
            )}
          </motion.g>
        );
      })}
      <motion.text x={260} y={230} textAnchor="middle" fontSize={10} fill="#ec4899"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        Pull: 위(AttributesQueue)가 아래(L1Traversal)를 호출
      </motion.text>
    </g>
  );
}

export { DerivStep1 } from './DerivationFlowStepEntry';
