import { motion } from 'framer-motion';
import { ModuleBox, DataBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 3: 3개 서브풀 */
export function StepSubpools() {
  const pools = [
    { label: 'Pending', sub: '즉시 실행', color: C.ok },
    { label: 'BaseFee', sub: 'fee 대기', color: C.base },
    { label: 'Queued', sub: 'nonce gap', color: C.err },
  ];
  return (<g>
    {pools.map((p, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12 }}>
        <ModuleBox x={20 + i * 135} y={18} w={115} h={45} label={p.label} sub={p.sub} color={p.color} />
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <motion.line x1={155} y1={45} x2={140} y2={45} stroke={C.ok} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
      <text x={148} y={40} fontSize={10} fill={C.ok}>승격</text>
    </motion.g>
    <text x={210} y={85} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      블록 상태 변경에 따라 TX가 서브풀 간 이동
    </text>
  </g>);
}

/* Step 4: trait 기반 */
export function StepTraits() {
  return (<g>
    <ModuleBox x={15} y={15} w={130} h={42} label="TransactionValidator"
      sub="검증 로직 교체" color={C.tx} />
    <ModuleBox x={170} y={15} w={130} h={42} label="TransactionOrdering"
      sub="정렬 기준 교체" color={C.pool} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <text x={210} y={78} textAnchor="middle" fontSize={11} fill={C.ok}>
        trait → 구현체만 교체하면 MEV 정렬 등 커스텀 가능
      </text>
    </motion.g>
  </g>);
}
