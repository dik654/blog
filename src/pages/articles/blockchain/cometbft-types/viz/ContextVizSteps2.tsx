import { motion } from 'framer-motion';
import { AlertBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

export function StepValidator() {
  const vals = [
    { name: 'Val A', vp: 40, pr: 40 },
    { name: 'Val B', vp: 30, pr: 30 },
    { name: 'Val C', vp: 30, pr: -70 },
  ];
  return (<g>
    <text x={210} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">
      IncrementProposerPriority()
    </text>
    {vals.map((v, i) => (
      <motion.g key={v.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12 }}>
        <rect x={20 + i * 140} y={26} width={120} height={48} rx={6}
          fill="var(--card)" stroke={v.pr < 0 ? C.val : C.ok} strokeWidth={v.pr === 40 ? 1.5 : 0.6} />
        <text x={80 + i * 140} y={42} textAnchor="middle" fontSize={11} fontWeight={600}
          fill="var(--foreground)">{v.name}</text>
        <text x={80 + i * 140} y={55} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          VP={v.vp}
        </text>
        <text x={80 + i * 140} y={67} textAnchor="middle" fontSize={10}
          fill={v.pr >= 0 ? C.ok : C.val}>
          priority={v.pr}
        </text>
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <line x1={62} y1={78} x2={62} y2={90} stroke={C.ok} strokeWidth={1.2} />
      <text x={62} y={100} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.ok}>제안자</text>
    </motion.g>
  </g>);
}

export function StepEvidence() {
  return (<g>
    <rect x={30} y={15} width={155} height={42} rx={6} fill="var(--card)" stroke={C.vote} strokeWidth={0.8} />
    <text x={107} y={33} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.vote}>VoteA (BlockID=0xABC)</text>
    <text x={107} y={48} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">H=100, R=0, Precommit</text>
    <rect x={30} y={65} width={155} height={42} rx={6} fill="var(--card)" stroke={C.err} strokeWidth={0.8} />
    <text x={107} y={83} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.err}>VoteB (BlockID=0xDEF)</text>
    <text x={107} y={98} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">H=100, R=0, Precommit</text>
    <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
      <line x1={190} y1={36} x2={225} y2={60} stroke={C.err} strokeWidth={0.8} strokeDasharray="3 2" />
      <line x1={190} y1={86} x2={225} y2={60} stroke={C.err} strokeWidth={0.8} strokeDasharray="3 2" />
      <AlertBox x={225} y={38} w={170} h={44} label="DuplicateVoteEvidence" sub="같은 H/R, 다른 Block" color={C.err} />
    </motion.g>
  </g>);
}
