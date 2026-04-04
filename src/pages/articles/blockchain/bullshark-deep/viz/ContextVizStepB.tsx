import { motion } from 'framer-motion';
import { ModuleBox, ActionBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 2: 앵커 커밋 */
export function StepAnchorCommit() {
  return (<g>
    <ModuleBox x={30} y={15} w={110} h={40}
      label="Anchor W0" sub="Wave 0 앵커" color={C.anchor} />
    <ModuleBox x={270} y={15} w={110} h={40}
      label="Anchor W1" sub="Wave 1 앵커" color={C.anchor} />
    <motion.path d="M 140 35 C 205 35, 205 35, 270 35"
      stroke={C.dag} strokeWidth={1.5} fill="none"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }} />
    <motion.text x={205} y={30} textAnchor="middle" fontSize={10}
      fill={C.dag} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}>
      인과적 참조
    </motion.text>
    <motion.text x={210} y={82} textAnchor="middle" fontSize={12} fontWeight={600}
      fill={C.dag} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      W1 앵커가 W0 앵커를 참조 → W0 커밋!
    </motion.text>
    <motion.text x={210} y={108} textAnchor="middle" fontSize={11}
      fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}>
      {'💡 커밋 = 인과적 히스토리 전체를 확정'}
    </motion.text>
  </g>);
}

/* Step 3: 인과적 정렬 */
export function StepCausalOrder() {
  const items = [
    { label: '앵커', sub: 'committed', color: C.anchor },
    { label: '역추적', sub: 'DAG 탐색', color: C.dag },
    { label: '수집', sub: '도달 가능 정점', color: C.wave },
    { label: '정렬', sub: 'round→author', color: C.order },
  ];
  return (<g>
    {items.map((s, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12, type: 'spring' }}>
        <ActionBox x={10 + i * 103} y={25} w={88} h={40}
          label={s.label} sub={s.sub} color={s.color} />
        {i < 3 && (
          <motion.line x1={98 + i * 103} y1={45} x2={113 + i * 103} y2={45}
            stroke={C.order} strokeWidth={1}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: i * 0.12 + 0.2 }} />
        )}
      </motion.g>
    ))}
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.order}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      한 번의 앵커 커밋 → 여러 블록 동시 확정
    </motion.text>
    <motion.text x={210} y={118} textAnchor="middle" fontSize={11}
      fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}>
      {'💡 결정론적 정렬: 모든 노드가 같은 순서'}
    </motion.text>
  </g>);
}
