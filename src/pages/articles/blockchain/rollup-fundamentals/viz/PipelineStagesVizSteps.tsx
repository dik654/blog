import { motion } from 'framer-motion';
import { PIPELINE_STAGES } from '../PipelineStagesData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };
const BW = 105, BH = 44, HGAP = 12, VGAP = 16;
function pos(i: number) {
  const row = i < 4 ? 0 : 1;
  const col = i < 4 ? i : i - 4;
  return { x: 20 + col * (BW + HGAP), y: 20 + row * (BH + VGAP) };
}

export function PullArrowOverlay() {
  const first = pos(0), last = pos(6);
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <path d={`M${last.x + BW / 2},${last.y + BH + 8} L${last.x + BW / 2},${last.y + BH + 20} L${first.x + BW / 2},${last.y + BH + 20} L${first.x + BW / 2},${first.y + BH + 8}`}
        fill="none" stroke="#ec4899" strokeWidth={1.2} strokeDasharray="4 3" />
      <rect x={100} y={last.y + BH + 24} width={320} height={36} rx={4}
        fill="#ec489906" stroke="#ec4899" strokeWidth={0.6} />
      <text x={110} y={last.y + BH + 38} fontSize={10} fontWeight={600} fill="#ec4899" fontFamily="monospace">
        Line 1: attrib.NextAttributes() → batch.NextBatch() → ch.NextData()
      </text>
      <text x={110} y={last.y + BH + 52} fontSize={10} fill="var(--muted-foreground)" fontFamily="monospace">
        Line 2: // Pull 방향: 뒤(Attributes) → 앞(L1Traversal), 역압 자동 적용
      </text>
    </motion.g>
  );
}

export function StageDetailOverlay({ indices }: { indices: number[] }) {
  const DETAIL_LINES: Record<number, [string, string]> = {
    0: ['l1Block := l1Client.BlockByNumber(cursor)', '// L1 블록 순회 + reorg 감지'],
    1: ['txs := filterBatcherTxs(block, batcherAddr)', '// 배처 TX 필터 → calldata/blob 추출'],
    2: ['frames := decodeFrames(rawData)', '// raw → Frame{id, data} 디코딩'],
    3: ['if ch.IsReady() { return ch }', '// 같은 ID 프레임 조립, 타임아웃 드롭'],
    4: ['batch := decompress(channel.Data())', '// zlib/brotli 해제 → 배치 복원'],
    5: ['if batch.Timestamp < safeHead.Time { skip }', '// 타임스탬프 검증 + 순서 정렬'],
    6: ['attrs := PayloadAttributes{NoTxPool: true}', '// op-geth에 전달할 블록 속성'],
  };
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      {indices.map((idx) => {
        const s = PIPELINE_STAGES[idx];
        const { x, y } = pos(idx);
        const lines = DETAIL_LINES[idx] || ['', ''];
        const dy = y + BH + 6;
        return (
          <g key={idx}>
            <line x1={x + BW / 2} y1={y + BH} x2={x + BW / 2} y2={dy}
              stroke={s.color} strokeWidth={0.6} strokeDasharray="2 2" />
            <rect x={x - 20} y={dy} width={BW + 40} height={36} rx={4}
              fill={`${s.color}10`} stroke={s.color} strokeWidth={0.6} />
            <text x={x + BW / 2} y={dy + 14}
              textAnchor="middle" fontSize={10} fontWeight={600} fill={s.color} fontFamily="monospace">
              {lines[0].slice(0, 32)}{lines[0].length > 32 ? '...' : ''}
            </text>
            <text x={x + BW / 2} y={dy + 28}
              textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
              {lines[1]}
            </text>
          </g>
        );
      })}
    </motion.g>
  );
}

export function OpGethTarget() {
  const last = pos(6);
  return (
    <>
      <rect x={last.x + BW + 14} y={last.y + 6} width={65} height={32} rx={6}
        fill="#0ea5e910" stroke="#0ea5e9" strokeWidth={1.2} />
      <text x={last.x + BW + 46} y={last.y + 26} textAnchor="middle"
        fontSize={10} fontWeight={600} fill="#0ea5e9">op-geth</text>
      <line x1={last.x + BW} y1={last.y + BH / 2} x2={last.x + BW + 14} y2={last.y + BH / 2}
        stroke="#0ea5e9" strokeWidth={1} markerEnd="url(#ps-arr)" />
    </>
  );
}
