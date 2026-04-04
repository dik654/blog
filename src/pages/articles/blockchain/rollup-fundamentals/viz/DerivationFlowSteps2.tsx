import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };
const C = { attr: '#ec4899', batch: '#f59e0b', ch: '#14b8a6', mux: '#10b981',
  frame: '#0ea5e9', l1r: '#3b82f6', l1t: '#6366f1' };

export function DerivStep2() {
  const stages = [
    { name: 'AttributesQueue', line: 'attrs := builder.PreparePayloadAttributes(batch)', c: C.attr },
    { name: 'BatchMux', line: 'singularBatch := mux.NextBatch(ctx)  // 타입 분기 + 타임스탬프 검증', c: C.batch },
    { name: 'ChannelInReader', line: 'batch := rlp.Decode(decompress(ch.Data()))  // zlib/brotli → RLP', c: C.ch },
  ];
  return (
    <g>
      <text x={260} y={16} textAnchor="middle" fontSize={12} fontWeight={700}
        fill="var(--foreground)">Pull 체인 상위: 의미 변환 (Batch → Attributes)</text>
      {stages.map((s, i) => {
        const y = 30 + i * 68;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.15 }}>
            <rect x={20} y={y} width={480} height={52} rx={6}
              fill={`${s.c}08`} stroke={s.c} strokeWidth={1.2} />
            <rect x={20} y={y} width={480} height={18} rx={6} fill={`${s.c}18`} />
            <rect x={20} y={y + 12} width={480} height={6} fill={`${s.c}08`} />
            <text x={30} y={y + 13} fontSize={11} fontWeight={700} fill={s.c}>{s.name}</text>
            <text x={30} y={y + 35} fontSize={10} fontWeight={600} fill={s.c} fontFamily="monospace">{s.line}</text>
            {i < stages.length - 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: i * 0.15 + 0.1 }}>
                <line x1={260} y1={y + 52} x2={260} y2={y + 68}
                  stroke={s.c} strokeWidth={1} />
                <text x={270} y={y + 63} fontSize={10} fill="#ec4899">pull</text>
              </motion.g>
            )}
          </motion.g>
        );
      })}
      <motion.text x={260} y={230} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        ChannelMux → FrameQueue → L1Retrieval → L1Traversal (다음 단계)
      </motion.text>
    </g>
  );
}

export function DerivStep3() {
  const stages = [
    { name: 'ChannelMux', line: 'ch := assembleFramesByID(frames)  // 타임아웃 초과 시 폐기', c: C.mux },
    { name: 'FrameQueue', line: 'frame := decodeFrame(rawBytes)  // 1 TX에 여러 Frame 가능', c: C.frame },
    { name: 'L1Retrieval', line: 'data := filterBatcherAddr(block)  // calldata 또는 blob 추출', c: C.l1r },
    { name: 'L1Traversal', line: 'ref := AdvanceL1Block()  // ParentHash 불일치 → ResetError', c: C.l1t },
  ];
  return (
    <g>
      <text x={260} y={16} textAnchor="middle" fontSize={12} fontWeight={700}
        fill="var(--foreground)">Pull 체인 하위: 물리 데이터 (L1 → Frame → Channel)</text>
      {stages.map((s, i) => {
        const y = 28 + i * 52;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.12 }}>
            <rect x={20} y={y} width={480} height={40} rx={6}
              fill={`${s.c}08`} stroke={s.c} strokeWidth={1.2} />
            <text x={30} y={y + 16} fontSize={11} fontWeight={700} fill={s.c}>{s.name}</text>
            <text x={30} y={y + 32} fontSize={10} fontWeight={600} fill={s.c} fontFamily="monospace">{s.line}</text>
            {i < stages.length - 1 && (
              <line x1={260} y1={y + 40} x2={260} y2={y + 52}
                stroke={s.c} strokeWidth={0.8} />
            )}
          </motion.g>
        );
      })}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
        <rect x={100} y={238 - 24} width={320} height={22} rx={5}
          fill={`${C.l1t}10`} stroke={C.l1t} strokeWidth={1} />
        <text x={260} y={234} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.l1t}>
          L1 RPC (eth_getBlockByNumber) — 데이터의 최종 출발점
        </text>
      </motion.g>
    </g>
  );
}
