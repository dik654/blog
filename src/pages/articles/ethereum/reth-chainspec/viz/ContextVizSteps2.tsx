import { motion } from 'framer-motion';
import { ModuleBox, DataBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 3: ForkCondition enum */
export function StepForkCondition() {
  const variants = [
    { name: 'Block(n)', color: C.chain },
    { name: 'TTD(d)', color: C.gen },
    { name: 'Timestamp(ts)', color: C.fork },
  ];
  return (<g>
    <ModuleBox x={15} y={18} w={110} h={50} label="ForkCondition" sub="enum" color={C.ok} />
    {variants.map((v, i) => (
      <motion.g key={v.name} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12 + 0.2 }}>
        <DataBox x={170} y={10 + i * 28} w={110} h={22} label={v.name} color={v.color} />
      </motion.g>
    ))}
    <motion.text x={350} y={40} fontSize={11} fill={C.ok} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      pattern matching
    </motion.text>
    <motion.text x={350} y={55} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      컴파일 시점 검증
    </motion.text>
  </g>);
}

/* Step 4: ChainSpec + BTreeMap */
export function StepChainSpec() {
  return (<g>
    <ModuleBox x={20} y={15} w={130} h={55} label="ChainSpec" sub="chain_id + genesis + forks" color={C.chain} />
    <motion.line x1={155} y1={42} x2={190} y2={42} stroke={C.chain} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={195} y={15} width={195} height={55} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={292} y={32} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.fork}>BTreeMap</text>
      <text x={292} y={45} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        {'Hardfork → ForkCondition'}
      </text>
      <text x={292} y={58} textAnchor="middle" fontSize={10} fill={C.ok}>정렬된 순서로 관리</text>
    </motion.g>
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      새 하드포크 = enum variant 하나 추가로 끝
    </motion.text>
  </g>);
}
