import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };
const C = { claim: '#6366f1', pos: '#10b981', val: '#f59e0b', clock: '#ec4899', err: '#ef4444' };

export function FaultStep0() {
  const fields = [
    { line: 'Position  {depth, indexAtDepth}', desc: '이진 트리 좌표', c: C.pos },
    { line: 'Value     common.Hash', desc: '상태 해시 (output root)', c: C.val },
    { line: 'Bond      *big.Int', desc: '예치금 (패배 시 몰수)', c: C.val },
    { line: 'CounteredBy common.Address', desc: '반박자 주소 (mutable)', c: C.err },
    { line: 'Claimant  common.Address', desc: '주장자 주소', c: C.claim },
    { line: 'Clock     Clock', desc: '체스 클럭: 남은 응답 시간', c: C.clock },
  ];
  return (
    <g>
      <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
        <rect x={40} y={8} width={440} height={26} rx={6}
          fill={`${C.claim}15`} stroke={C.claim} strokeWidth={1.2} />
        <text x={260} y={26} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.claim}>
          type Claim struct (ClaimData 임베딩)
        </text>
      </motion.g>
      {fields.map((f, i) => {
        const y = 44 + i * 27;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: 0.1 + i * 0.06 }}>
            <rect x={40} y={y} width={440} height={22} rx={4}
              fill={i % 2 === 0 ? '#ffffff04' : '#ffffff08'}
              stroke="var(--border)" strokeWidth={0.5} />
            <text x={50} y={y + 15} fontSize={10} fontWeight={600} fill={f.c} fontFamily="monospace">
              Line {i + 1}: {f.line}
            </text>
            <text x={340} y={y + 15} fontSize={10} fill="var(--foreground)">{f.desc}</text>
          </motion.g>
        );
      })}
    </g>
  );
}

export function FaultStep1() {
  return (
    <g>
      <text x={260} y={16} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">Position → TraceIndex (maxDepth=3 예시)</text>
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={20} y={28} width={480} height={22} rx={4} fill={`${C.pos}06`} stroke={C.pos} strokeWidth={0.6} />
        <text x={30} y={42} fontSize={10} fontWeight={600} fill={C.pos} fontFamily="monospace">
          Line 1: func (p Position) TraceIndex(maxDepth) uint64 {'{'}
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.2 }}>
        <rect x={20} y={56} width={480} height={22} rx={4} fill={`${C.val}06`} stroke={C.val} strokeWidth={0.6} />
        <text x={30} y={70} fontSize={10} fontWeight={600} fill={C.val} fontFamily="monospace">
          Line 2:   rd := maxDepth - p.depth  // 남은 깊이
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={20} y={84} width={480} height={22} rx={4} fill={`${C.val}06`} stroke={C.val} strokeWidth={0.6} />
        <text x={30} y={98} fontSize={10} fontWeight={600} fill={C.val} fontFamily="monospace">
          Line 3:   rhs := (1 {'<<'} rd) - 1  // 우측 패딩 비트
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.4 }}>
        <rect x={20} y={112} width={480} height={22} rx={4} fill={`${C.pos}08`} stroke={C.pos} strokeWidth={0.8} />
        <text x={30} y={126} fontSize={10} fontWeight={600} fill={C.pos} fontFamily="monospace">
          Line 4:   return (p.indexAtDepth {'<<'} rd) | rhs  // d=1,i=0 → ti=3
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <text x={260} y={156} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          TraceIndex = 실행 트레이스에서 몇 번째 step인지 — 이진 탐색의 기준점
        </text>
      </motion.g>
    </g>
  );
}
