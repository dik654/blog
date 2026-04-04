import { motion } from 'framer-motion';
import { ModuleBox, DataBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 3: NodeBuilder typestate 패턴 */
export function StepTypestate() {
  return (<g>
    <ModuleBox x={15} y={15} w={155} h={50} label="NodeBuilder<..., ()>"
      sub="Components 미설정" color={C.builder} />
    <motion.line x1={175} y1={40} x2={210} y2={40} stroke={C.builder} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ModuleBox x={215} y={15} w={180} h={50} label="NodeBuilder<..., Comps>"
        sub="with_components() 호출 후" color={C.ok} />
    </motion.g>
    <motion.text x={210} y={90} textAnchor="middle" fontSize={11} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      Components=() 상태에서 launch() → 컴파일 에러
    </motion.text>
  </g>);
}

/* Step 4: trait impl 교체 */
export function StepTraitSwap() {
  const swaps = [
    { from: 'Executor', to: 'OPExecutor', color: C.comp },
    { from: 'Pool', to: 'CustomPool', color: C.ok },
    { from: 'PayloadBuilder', to: 'MevBuilder', color: C.cli },
  ];
  return (<g>
    {swaps.map((s, i) => (
      <motion.g key={s.from} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12 }}>
        <DataBox x={15} y={10 + i * 30} w={100} h={22} label={s.from} color={C.builder} />
        <text x={125} y={25 + i * 30} fontSize={11} fill="var(--muted-foreground)">→</text>
        <DataBox x={140} y={10 + i * 30} w={110} h={22} label={s.to} color={s.color} />
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <text x={320} y={35} fontSize={11} fill={C.ok} fontWeight={600}>프레임워크</text>
      <text x={320} y={50} fontSize={10} fill="var(--muted-foreground)">trait impl 교체만으로</text>
      <text x={320} y={62} fontSize={10} fill="var(--muted-foreground)">커스텀 노드 구성</text>
    </motion.g>
  </g>);
}
