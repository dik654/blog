import { motion } from 'framer-motion';
import { AlertBox, ActionBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 새 노드 동기화 필요 */
export function StepNewNode() {
  return (<g>
    {Array.from({ length: 6 }, (_, i) => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}>
        <rect x={10 + i * 55} y={35} width={45} height={24} rx={5}
          fill="var(--card)" stroke={C.full} strokeWidth={0.8} />
        <text x={32 + i * 55} y={51} textAnchor="middle" fontSize={10} fill={C.full}>#{i}</text>
        {i < 5 && <line x1={55 + i * 55} y1={47} x2={65 + i * 55} y2={47}
          stroke="var(--border)" strokeWidth={0.6} />}
      </motion.g>
    ))}
    <text x={360} y={51} fontSize={11} fill="var(--muted-foreground)">...</text>
    <motion.text x={210} y={85} textAnchor="middle" fontSize={11} fill={C.full}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      제네시스 → ... → 최신 따라잡기
    </motion.text>
  </g>);
}

/* Step 1: 전체 실행 = 느림 */
export function StepSlow() {
  return (<g>
    <AlertBox x={110} y={20} w={200} h={50}
      label="전체 블록 재실행" sub="수일~수주 소요" color={C.err} />
    <motion.text x={210} y={100} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      새 노드 투입이 비실용적
    </motion.text>
  </g>);
}

/* Step 2: 상태 다운로드 = 보안 위험 */
export function StepTrust() {
  return (<g>
    <ActionBox x={50} y={25} w={120} h={40} label="상태 다운로드" sub="빠르지만..." color={C.snap} />
    <motion.line x1={175} y1={45} x2={220} y2={45} stroke={C.err} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <AlertBox x={225} y={25} w={140} h={40} label="악의적 피어" sub="거짓 상태 가능" color={C.err} />
    </motion.g>
    <text x={210} y={90} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      Merkle proof 검증이 필수
    </text>
  </g>);
}
