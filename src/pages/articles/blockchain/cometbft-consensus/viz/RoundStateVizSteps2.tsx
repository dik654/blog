import { motion } from 'framer-motion';
import { ModuleBox } from '@/components/viz/boxes';
import { C } from './RoundStateVizData';

export function StepPrecommit() {
  const cases = [
    { label: 'polka 없음', result: 'nil precommit', color: C.err },
    { label: 'polka for nil', result: 'unlock → nil', color: C.err },
    { label: 'polka for block', result: 'lock → precommit', color: C.precommit },
  ];
  return (<g>
    <ModuleBox x={10} y={25} w={110} h={42} label="enterPrecommit" color={C.precommit} />
    {cases.map((c, i) => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: i * 0.2 + 0.3 }}>
        <motion.line x1={125} y1={46} x2={165} y2={18 + i * 28}
          stroke={c.color} strokeWidth={0.6}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: i * 0.2 + 0.3 }} />
        <text x={170} y={22 + i * 28} fontSize={10} fill="var(--foreground)">{c.label}</text>
        <text x={295} y={22 + i * 28} fontSize={10} fill={c.color}>{'→ '}{c.result}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepCommit() {
  const steps = ['2/3+ precommit', 'SaveBlock', 'ApplyBlock', 'updateToState'];
  const colors = [C.commit, C.propose, C.precommit, C.commit];
  return (<g>
    {steps.map((s, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.15 }}>
        <rect x={10 + i * 100} y={28} width={88} height={30} rx={6}
          fill="var(--card)" stroke={colors[i]} strokeWidth={0.7} />
        <text x={54 + i * 100} y={47} textAnchor="middle" fontSize={10}
          fill={colors[i]}>{s}</text>
        {i < 3 && (
          <text x={100 + i * 100} y={47} fontSize={12}
            fill="var(--muted-foreground)">{'→'}</text>
        )}
      </motion.g>
    ))}
    <motion.text x={210} y={80} textAnchor="middle" fontSize={10} fill={C.commit}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      블록 확정 → 다음 높이(H+1)로 전진
    </motion.text>
  </g>);
}
