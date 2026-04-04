import { motion } from 'framer-motion';
import { ModuleBox, ActionBox } from '@/components/viz/boxes';
import { C } from './RoundStateVizData';

export function StepNewRound() {
  const items = ['IncrementProposerPriority', 'Votes.SetRound', 'enterPropose'];
  const colors = [C.propose, C.prevote, C.propose];
  return (<g>
    <ModuleBox x={15} y={12} w={115} h={48} label="enterNewRound" sub="라운드 초기화" color={C.propose} />
    {items.map((s, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.15 + 0.3 }}>
        <motion.line x1={135} y1={36} x2={175} y2={18 + i * 24}
          stroke={colors[i]} strokeWidth={0.6}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * 0.15 + 0.3 }} />
        <ActionBox x={180} y={8 + i * 24} w={145} h={20} label={s} color={colors[i]} />
      </motion.g>
    ))}
    <motion.text x={210} y={95} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      라운드 차이만큼 제안자 우선순위 회전 후 Propose 진입
    </motion.text>
  </g>);
}

export function StepPropose() {
  return (<g>
    <ModuleBox x={20} y={15} w={110} h={48} label="enterPropose" sub="제안자 판별" color={C.propose} />
    <motion.line x1={135} y1={39} x2={175} y2={25} stroke={C.propose} strokeWidth={0.6}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
    <motion.line x1={135} y1={39} x2={175} y2={55} stroke={C.propose} strokeWidth={0.6}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ActionBox x={180} y={8} w={120} h={30} label="decideProposal" sub="블록 생성·서명" color={C.propose} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ActionBox x={180} y={45} w={120} h={30} label="timeoutPropose" sub="타임아웃 대기" color={C.err} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <text x={330} y={28} fontSize={10} fill={C.propose}>제안자일 때</text>
      <text x={330} y={65} fontSize={10} fill={C.err}>비제안자일 때</text>
    </motion.g>
    <text x={210} y={100} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      isProposalComplete() → enterPrevote 자동 진입
    </text>
  </g>);
}

export function StepPrevote() {
  const cases = [
    { label: 'LockedBlock 있음', result: '잠긴 블록 prevote', color: C.prevote },
    { label: 'ProposalBlock 유효', result: '제안 블록 prevote', color: C.prevote },
    { label: '제안 없음/무효', result: 'nil prevote', color: C.err },
  ];
  return (<g>
    <ModuleBox x={10} y={25} w={100} h={42} label="enterPrevote" color={C.prevote} />
    {cases.map((c, i) => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: i * 0.2 + 0.3 }}>
        <motion.line x1={115} y1={46} x2={155} y2={18 + i * 28}
          stroke={c.color} strokeWidth={0.6}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: i * 0.2 + 0.3 }} />
        <text x={160} y={22 + i * 28} fontSize={10} fill="var(--foreground)">{c.label}</text>
        <text x={295} y={22 + i * 28} fontSize={10} fill={c.color}>{'→ '}{c.result}</text>
      </motion.g>
    ))}
  </g>);
}
