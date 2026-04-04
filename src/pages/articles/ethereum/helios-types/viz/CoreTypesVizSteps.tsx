import { motion } from 'framer-motion';
import { ModuleBox, DataBox } from '@/components/viz/boxes';
import { C } from './CoreTypesVizData';

/* ── helpers ── */
const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const drawLine = (d: number) => ({
  initial: { pathLength: 0 },
  animate: { pathLength: 1 },
  transition: { delay: d, duration: 0.3 },
});

/* ================================================================
   Step 0 — BeaconBlockHeader 5필드 카드, state_root 강조
   ================================================================ */
export function Step0() {
  const fields = [
    { name: 'slot', size: 'u64 (8B)', desc: '슬롯 번호', c: C.header },
    { name: 'proposer_index', size: 'u64 (8B)', desc: '제안자 인덱스', c: C.header },
    { name: 'parent_root', size: 'B256 (32B)', desc: '이전 블록 해시', c: C.header },
    { name: 'state_root', size: 'B256 (32B)', desc: '비콘 상태 루트', c: C.accent },
    { name: 'body_root', size: 'B256 (32B)', desc: '블록 바디 해시', c: C.header },
  ];

  return (
    <g>
      {/* 구조체 외곽 */}
      <motion.g {...fade(0)}>
        <rect x={30} y={8} width={220} height={175} rx={10}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <rect x={30} y={8} width={220} height={5} rx={2.5}
          fill={C.header} opacity={0.85} />
        <text x={140} y={28} textAnchor="middle"
          fontSize={10} fontWeight={700} fill="var(--foreground)">
          BeaconBlockHeader
        </text>
        <text x={140} y={40} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">
          5 fields · 112 bytes SSZ
        </text>
      </motion.g>

      {/* 필드 행 */}
      {fields.map((f, i) => {
        const y = 48 + i * 26;
        const isStateRoot = f.name === 'state_root';
        return (
          <motion.g key={f.name} {...fade(0.15 + i * 0.1)}>
            <rect x={40} y={y} width={200} height={22} rx={4}
              fill={isStateRoot ? `${C.accent}18` : `${f.c}08`}
              stroke={isStateRoot ? C.accent : 'transparent'}
              strokeWidth={isStateRoot ? 1.2 : 0} />
            <text x={50} y={y + 14} fontSize={9} fontWeight={600}
              fill={f.c} fontFamily="monospace">{f.name}</text>
            <text x={155} y={y + 14} fontSize={7.5}
              fill="var(--muted-foreground)">{f.size}</text>
            {isStateRoot && (
              <text x={232} y={y + 14} fontSize={7}
                fill={C.accent} fontWeight={700}>★</text>
            )}
          </motion.g>
        );
      })}

      {/* state_root 강조 화살표 → 설명 */}
      <motion.path
        d="M 250 126 L 280 126 L 280 80 L 300 80"
        fill="none" stroke={C.accent} strokeWidth={1.2}
        markerEnd="url(#arrowState)"
        {...drawLine(0.7)}
      />

      <motion.g {...fade(0.8)}>
        <rect x={305} y={40} width={155} height={80} rx={8}
          fill={`${C.accent}0a`} stroke={C.accent} strokeWidth={0.8} />
        <text x={382} y={58} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.accent}>
          모든 증명의 기준점
        </text>
        <text x={382} y={73} textAnchor="middle"
          fontSize={7.5} fill="var(--muted-foreground)">
          이 해시 하나로 비콘 체인
        </text>
        <text x={382} y={84} textAnchor="middle"
          fontSize={7.5} fill="var(--muted-foreground)">
          전체 상태 트리를 가리킨다
        </text>
        <text x={382} y={100} textAnchor="middle"
          fontSize={7} fill={C.accent} opacity={0.7}>
          state_root → execution_payload
        </text>
        <text x={382} y={111} textAnchor="middle"
          fontSize={7} fill={C.accent} opacity={0.7}>
          → EL state_root 추출
        </text>
      </motion.g>

      {/* Reth 비교 박스 */}
      <motion.g {...fade(1.0)}>
        <rect x={305} y={132} width={155} height={42} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} strokeDasharray="3 2" />
        <text x={382} y={149} textAnchor="middle"
          fontSize={7.5} fontWeight={600} fill={C.muted}>
          비교: Reth Header
        </text>
        <text x={382} y={163} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">
          15+ 필드 · RLP 인코딩 · 500B+
        </text>
      </motion.g>

      {/* marker */}
      <defs>
        <marker id="arrowState" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.accent} />
        </marker>
      </defs>
    </g>
  );
}

/* ================================================================
   Step 1 — SyncAggregate: 512비트 격자 + 서명 96B
   ================================================================ */
export function Step1() {
  /* 512비트 참여 비트맵을 32x16 격자로 표현 */
  const bits = Array.from({ length: 512 }, (_, i) => {
    // 결정적 패턴 (약 70% 참여)
    const hash = ((i * 2654435761) >>> 0) % 100;
    return hash < 70;
  });

  const cols = 32;
  const cellW = 10;
  const cellH = 7;
  const gridX = 20;
  const gridY = 14;

  return (
    <g>
      {/* 제목 */}
      <motion.g {...fade(0)}>
        <text x={240} y={10} textAnchor="middle"
          fontSize={10} fontWeight={700} fill="var(--foreground)">
          SyncAggregate
        </text>
      </motion.g>

      {/* Bitvector<512> 격자 */}
      <motion.g {...fade(0.15)}>
        <text x={gridX} y={gridY + 112 + 12} fontSize={7.5} fontWeight={600}
          fill={C.agg}>sync_committee_bits</text>
        <text x={gridX + 170} y={gridY + 112 + 12} fontSize={7}
          fill="var(--muted-foreground)">Bitvector{'<'}512{'>'} (64 bytes)</text>
      </motion.g>

      {bits.map((on, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        return (
          <motion.rect
            key={i}
            x={gridX + col * cellW + 1}
            y={gridY + row * cellH + 1}
            width={cellW - 2}
            height={cellH - 2}
            rx={1.5}
            fill={on ? C.agg : '#6b7280'}
            opacity={on ? 0.65 : 0.12}
            {...fade(0.2 + (row * 0.02))}
          />
        );
      })}

      {/* 참여 카운트 */}
      <motion.g {...fade(0.5)}>
        <rect x={350} y={20} width={120} height={40} rx={6}
          fill={`${C.agg}12`} stroke={C.agg} strokeWidth={0.8} />
        <text x={410} y={36} textAnchor="middle"
          fontSize={8} fontWeight={600} fill={C.agg}>
          참여: ~358 / 512
        </text>
        <text x={410} y={50} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">
          {'≥'} 342 (2/3) → 정족수 충족
        </text>
      </motion.g>

      {/* BLS 서명 박스 */}
      <motion.g {...fade(0.7)}>
        <rect x={350} y={70} width={120} height={48} rx={6}
          fill="var(--card)" stroke={C.agg} strokeWidth={0.8} />
        <text x={410} y={86} textAnchor="middle"
          fontSize={8} fontWeight={600} fill={C.agg}>
          BLS Signature
        </text>
        <text x={410} y={99} textAnchor="middle"
          fontSize={7.5} fill="var(--muted-foreground)">
          G2 점 · 96 bytes
        </text>
        <text x={410} y={111} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">
          BLS12-381 곡선
        </text>
      </motion.g>

      {/* 총 크기 */}
      <motion.g {...fade(0.9)}>
        <rect x={120} y={150} width={240} height={28} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={167} textAnchor="middle"
          fontSize={8} fontWeight={600} fill="var(--foreground)">
          bits(64B) + signature(96B) = 총 160 bytes
        </text>
      </motion.g>
    </g>
  );
}
