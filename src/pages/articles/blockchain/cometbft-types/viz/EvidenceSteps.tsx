import { motion } from 'framer-motion';
import { AlertBox } from '@/components/viz/boxes';
import { C } from './EvidenceVizData';

export function StepStruct() {
  return (<g>
    <rect x={30} y={12} width={155} height={42} rx={6} fill="var(--card)" stroke={C.vote} strokeWidth={0.8} />
    <text x={107} y={30} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.vote}>VoteA (BlockID=0xABC)</text>
    <text x={107} y={45} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">H=100, R=0, Precommit</text>
    <rect x={30} y={62} width={155} height={42} rx={6} fill="var(--card)" stroke={C.err} strokeWidth={0.8} />
    <text x={107} y={80} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.err}>VoteB (BlockID=0xDEF)</text>
    <text x={107} y={95} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">H=100, R=0, Precommit</text>
    <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
      <line x1={190} y1={33} x2={225} y2={57} stroke={C.err} strokeWidth={0.8} strokeDasharray="3 2" />
      <line x1={190} y1={83} x2={225} y2={57} stroke={C.err} strokeWidth={0.8} strokeDasharray="3 2" />
      <AlertBox x={225} y={35} w={170} h={44} label="DuplicateVoteEvidence" sub="같은 H/R, 다른 Block" color={C.err} />
    </motion.g>
  </g>);
}

export function StepVerify() {
  const checks = ['Height == Height', 'Round == Round', 'Type == Type', 'BlockID != BlockID'];
  return (<g>
    {checks.map((c, i) => {
      const isLast = i === checks.length - 1;
      return (
        <motion.g key={c} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}>
          <rect x={40} y={15 + i * 24} width={200} height={20} rx={4}
            fill="var(--card)" stroke={isLast ? C.ok : C.vote} strokeWidth={isLast ? 1.2 : 0.5} />
          <text x={50} y={29 + i * 24} fontSize={10}
            fill={isLast ? C.ok : 'var(--foreground)'}>{`${i + 1}. ${c}`}</text>
          <text x={245} y={29 + i * 24} fontSize={10}
            fill={isLast ? C.ok : 'var(--muted-foreground)'}>{isLast ? '→ 유효!' : '→ 일치'}</text>
        </motion.g>
      );
    })}
  </g>);
}

export function StepEvidenceData() {
  const items = ['Evidence 0', 'Evidence 1', '...'];
  return (<g>
    <rect x={30} y={15} width={160} height={80} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
    <text x={110} y={30} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">EvidenceData</text>
    {items.map((it, i) => (
      <motion.g key={it} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12 }}>
        <rect x={45} y={38 + i * 18} width={130} height={14} rx={7}
          fill={`${C.err}12`} stroke={C.err} strokeWidth={0.5} />
        <text x={110} y={49 + i * 18} textAnchor="middle" fontSize={10} fill={C.err}>{it}</text>
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <line x1={195} y1={55} x2={240} y2={55} stroke={C.vote} strokeWidth={1} />
      <text x={240} y={42} fontSize={10} fill="var(--muted-foreground)">Hash() → Merkle root</text>
      <text x={240} y={58} fontSize={10} fontWeight={600} fill={C.vote}>Header.EvidenceHash</text>
      <text x={240} y={78} fontSize={10} fill="var(--muted-foreground)">→ 검증자 슬래싱 근거</text>
    </motion.g>
  </g>);
}
