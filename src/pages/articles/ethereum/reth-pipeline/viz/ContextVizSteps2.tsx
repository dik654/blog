import { motion } from 'framer-motion';
import { ActionBox, ModuleBox, StatusBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 3: 크래시 → 복구 불가 */
export function StepCrash() {
  const steps = [
    { label: '헤더', sub: '완료', color: C.ok },
    { label: '바디', sub: '완료', color: C.ok },
    { label: '실행', sub: '진행 중...', color: C.stage },
    { label: '머클', sub: '대기', color: C.block },
  ];
  return (<g>
    {steps.map((s, i) => (
      <ActionBox key={i} x={10 + i * 100} y={25} w={82} h={38} label={s.label} sub={s.sub} color={s.color} />
    ))}
    <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, type: 'spring' }}>
      <line x1={215} y1={18} x2={215} y2={70} stroke={C.err} strokeWidth={2} strokeDasharray="4 2" />
      <text x={215} y={12} textAnchor="middle" fontSize={11} fill={C.err}>💥 크래시</text>
    </motion.g>
    <motion.text x={210} y={90} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      중간 상태 없음 → 처음부터 다시
    </motion.text>
  </g>);
}

/* Step 4: Stage 분리 */
export function StepStageSplit() {
  const stages = [
    { label: 'Headers', sub: '헤더 검증', color: C.block },
    { label: 'Bodies', sub: '바디 수집', color: C.block },
    { label: 'Execution', sub: 'revm 실행', color: C.stage },
    { label: 'Merkle', sub: '루트 계산', color: C.db },
  ];
  return (<g>
    <defs><marker id="cs" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
      <path d="M0,0 L6,3 L0,6" fill={C.ok} /></marker></defs>
    {stages.map((s, i) => (
      <motion.g key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1, type: 'spring', bounce: 0.25 }}>
        <ModuleBox x={5 + i * 103} y={25} w={88} h={48} label={s.label} sub={s.sub} color={s.color} />
        {i < 3 && (
          <motion.line x1={93 + i * 103} y1={49} x2={108 + i * 103} y2={49}
            stroke={C.ok} strokeWidth={1.2} markerEnd="url(#cs)"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: i * 0.1 + 0.3, duration: 0.2 }} />
        )}
      </motion.g>
    ))}
    <text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.ok}>
      각 Stage가 독립적으로 execute() + unwind()
    </text>
  </g>);
}

/* Step 5: 체크포인트 + 롤백 */
export function StepCheckpoint() {
  const items = [
    { label: 'Headers', n: '18,400,000', p: 1 },
    { label: 'Bodies', n: '18,400,000', p: 1 },
    { label: 'Execution', n: '18,399,500', p: 0.85 },
  ];
  return (<g>
    {items.map((s, i) => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.12 }}>
        <StatusBox x={15 + i * 135} y={18} w={115} h={55} label={s.label}
          sub={`블록 ${s.n}`} color={s.p === 1 ? C.ok : C.stage} progress={s.p} />
      </motion.g>
    ))}
    <motion.text x={210} y={100} textAnchor="middle" fontSize={11} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      크래시 → 마지막 체크포인트에서 재개 / reorg → 해당 Stage만 unwind
    </motion.text>
  </g>);
}
