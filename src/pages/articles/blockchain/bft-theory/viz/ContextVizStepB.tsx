import { motion } from 'framer-motion';
import { AlertBox, ModuleBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 2: 합의 실패 (n=3, f=1) */
export function StepFailure() {
  const nodes = [
    { x: 60, y: 20, label: '정직1', ok: true },
    { x: 200, y: 20, label: '배신자', ok: false },
    { x: 130, y: 80, label: '정직2', ok: true },
  ];
  return (<g>
    {nodes.map((n, i) => (
      <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: i * 0.12, type: 'spring', bounce: 0.3 }}>
        <circle cx={n.x + 30} cy={n.y + 15} r={16} fill="var(--card)"
          stroke={n.ok ? C.ok : C.byz} strokeWidth={1.2} />
        <text x={n.x + 30} y={n.y + 19} textAnchor="middle" fontSize={10}
          fontWeight={600} fill={n.ok ? C.ok : C.byz}>{n.label}</text>
      </motion.g>
    ))}
    <AlertBox x={280} y={30} w={120} h={40}
      label="합의 불가" sub="n=3, f=1" color={C.byz} />
    <motion.text x={210} y={125} textAnchor="middle" fontSize={11} fill={C.byz}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      정직 2명 vs 배신 1명 — 다수결 불가능
    </motion.text>
  </g>);
}

/* Step 3: f < n/3 해결 */
export function StepThreshold() {
  const honest = [0, 1, 2, 3];
  return (<g>
    {honest.map((i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.08, type: 'spring' }}>
        <ModuleBox x={10 + i * 68} y={20} w={58} h={38}
          label={`N${i + 1}`} sub="정직" color={C.ok} />
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, type: 'spring' }}>
      <AlertBox x={292} y={20} w={80} h={38}
        label="배신자" sub="f=1" color={C.byz} />
    </motion.g>
    <motion.text x={210} y={82} textAnchor="middle" fontSize={12} fontWeight={600}
      fill={C.ok} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      {'n=5, f=1 → n > 3f ✓ 합의 가능'}
    </motion.text>
    <motion.text x={210} y={105} textAnchor="middle" fontSize={11}
      fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}>
      {'💡 정직 노드가 2/3 초과 → 배신자 무력화'}
    </motion.text>
  </g>);
}
