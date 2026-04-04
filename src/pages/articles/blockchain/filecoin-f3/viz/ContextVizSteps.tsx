import { motion } from 'framer-motion';
import { AlertBox, ActionBox, ModuleBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

export function StepProblem() {
  const blocks = Array.from({ length: 5 }, (_, i) => i);
  return (<g>
    {blocks.map((_, i) => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}>
        <rect x={10 + i * 55} y={35} width={42} height={26} rx={5}
          fill={`${C.ec}12`} stroke={C.ec} strokeWidth={0.8} />
        <text x={31 + i * 55} y={52} textAnchor="middle" fontSize={10} fill={C.ec}>E{i}</text>
        {i < 4 && <line x1={52 + i * 55} y1={48} x2={65 + i * 55} y2={48} stroke="var(--border)" strokeWidth={0.6} />}
      </motion.g>
    ))}
    <motion.text x={310} y={48} fontSize={11} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      ... 900 에폭 대기
    </motion.text>
    <AlertBox x={130} y={75} w={160} h={32} label="7.5시간 후에야 확정" sub="" color={C.err} />
  </g>);
}

export function StepWhy() {
  return (<g>
    <ActionBox x={30} y={20} w={160} h={40} label="Heaviest Chain Rule" sub="확률적 확정" color={C.ec} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <line x1={110} y1={65} x2={110} y2={85} stroke={C.err} strokeWidth={1} strokeDasharray="3 2" />
      <AlertBox x={30} y={85} w={160} h={32} label="대안 체인 가능성" sub="시간이 지나야 확률 0 수렴" color={C.err} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ActionBox x={230} y={20} w={160} h={40} label="BFT 확정성" sub="투표 기반 즉시 확정" color={C.f3} />
      <text x={310} y={80} textAnchor="middle" fontSize={11} fill={C.f3}>
        2/3+ 동의 = 되돌릴 수 없음
      </text>
    </motion.g>
  </g>);
}
