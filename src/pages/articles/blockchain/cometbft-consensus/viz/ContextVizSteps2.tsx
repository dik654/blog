import { motion } from 'framer-motion';
import { C } from './ContextVizData';

export function Step4() {
  const steps = ['NewRound', 'Propose', 'Prevote', 'Precommit', 'Commit'];
  const colors = [C.propose, C.propose, C.prevote, C.precommit, C.commit];
  return (<g>
    {steps.map((s, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}>
        <rect x={10 + i * 80} y={28} width={68} height={30} rx={15}
          fill={`${colors[i]}12`} stroke={colors[i]} strokeWidth={0.8} />
        <text x={44 + i * 80} y={47} textAnchor="middle" fontSize={10}
          fill={colors[i]}>{s}</text>
        {i < 4 && (
          <motion.text x={80 + i * 80} y={47} fontSize={12} fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 + 0.2 }}>
            {'→'}
          </motion.text>
        )}
      </motion.g>
    ))}
    <text x={210} y={80} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      각 전이: 2/3+ 투표 수집 또는 타임아웃
    </text>
  </g>);
}
