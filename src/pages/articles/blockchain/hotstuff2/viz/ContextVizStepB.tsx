import { motion } from 'framer-motion';
import { ModuleBox, ActionBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 2: 낙관적 경로 */
export function StepOptimistic() {
  const protocols = [
    { label: 'PBFT', delays: '5', phases: '3', vc: 'O(n³)', color: C.err },
    { label: 'HotStuff', delays: '7', phases: '3', vc: 'O(n)', color: C.hs1 },
    { label: 'HotStuff-2', delays: '4', phases: '2', vc: 'O(n)', color: C.hs2 },
  ];
  return (<g>
    {protocols.map((p, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.15, type: 'spring' }}>
        <ModuleBox x={15 + i * 140} y={10} w={120} h={42}
          label={p.label} sub={`${p.delays} delays`} color={p.color} />
        <text x={75 + i * 140} y={68} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">{p.phases}단계 / VC {p.vc}</text>
      </motion.g>
    ))}
    <motion.text x={210} y={95} textAnchor="middle" fontSize={12} fontWeight={600}
      fill={C.hs2} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      최소 지연 + 선형 통신 = 최적 BFT
    </motion.text>
    <motion.text x={210} y={118} textAnchor="middle" fontSize={11}
      fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}>
      {'💡 Aptos DiemBFT v4가 이 접근 채택'}
    </motion.text>
  </g>);
}
