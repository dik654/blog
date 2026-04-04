import { motion } from 'framer-motion';
import { C } from './VoteSetVizData';

export function StepAddVote() {
  const steps = ['height/round/type 확인', 'GetByIndex(idx)', 'VerifySignature()', 'votes[idx] = vote'];
  return (<g>
    {steps.map((s, i) => (
      <motion.g key={s} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.15 }}>
        <rect x={20} y={18 + i * 24} width={180} height={20} rx={4}
          fill="var(--card)" stroke={C.vote} strokeWidth={0.5} />
        <text x={30} y={32 + i * 24} fontSize={10} fill="var(--foreground)">{`${i + 1}. ${s}`}</text>
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <rect x={230} y={35} width={160} height={40} rx={6} fill={`${C.ok}10`} stroke={C.ok} strokeWidth={0.8} />
      <text x={310} y={52} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.ok}>sum += VotingPower</text>
      <text x={310} y={66} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">bitArray[idx] = true</text>
    </motion.g>
  </g>);
}

export function StepMaj23() {
  const w = 280;
  const threshold = w * 2 / 3;
  return (<g>
    <rect x={70} y={30} width={w} height={12} rx={6} fill="var(--border)" opacity={0.3} />
    <motion.rect x={70} y={30} height={12} rx={6} fill={C.ok}
      initial={{ width: 0 }} animate={{ width: threshold + 20 }} transition={{ duration: 1 }} />
    <line x1={70 + threshold} y1={25} x2={70 + threshold} y2={48} stroke={C.vote} strokeWidth={1.2} strokeDasharray="3 2" />
    <text x={70 + threshold} y={20} textAnchor="middle" fontSize={10} fill={C.vote}>2/3 기준</text>
    <motion.text x={210} y={70} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
      {'maj23 = &vote.BlockID'}
    </motion.text>
    <motion.text x={210} y={90} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
      HasTwoThirdsMajority() = true → 다음 단계 진행
    </motion.text>
  </g>);
}
