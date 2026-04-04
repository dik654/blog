import { motion } from 'framer-motion';
import { ActionBox, ModuleBox, AlertBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: PDP vs PoRep */
export function StepCompare() {
  return (<g>
    <AlertBox x={15} y={20} w={150} h={52} label="PoRep (봉인 필수)" sub="원본 즉시 읽기 불가" color={C.porep} />
    <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
      <ModuleBox x={200} y={20} w={190} h={52} label="PDP (원본 그대로 증명)" sub="핫스토리지 = 즉시 읽기 가능" color={C.pdp} />
    </motion.g>
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.hot}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      핫스토리지에는 봉인이 불가능 → PDP가 필요
    </motion.text>
  </g>);
}

/* Step 1: SHA2 챌린지 */
export function StepChallenge() {
  return (<g>
    <ActionBox x={15} y={20} w={100} h={48} label="랜덤 오프셋" sub="DRAND 비콘" color={C.chain} />
    <motion.line x1={120} y1={44} x2={165} y2={44} stroke={C.sha} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ActionBox x={170} y={20} w={110} h={48} label="160B 읽기" sub="SHA256 해시" color={C.sha} />
    </motion.g>
    <motion.line x1={285} y1={44} x2={320} y2={44} stroke={C.pdp} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      <ModuleBox x={325} y={20} w={85} h={48} label="머클 대조" sub="루트 확인" color={C.pdp} />
    </motion.g>
    <text x={210} y={90} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      GPU 불필요 — 일반 디스크 + CPU로 충분
    </text>
  </g>);
}

/* Step 2: 온체인 검증 */
export function StepOnchain() {
  return (<g>
    <ModuleBox x={15} y={18} w={110} h={45} label="PDP Actor" sub="챌린지 스케줄" color={C.chain} />
    <motion.line x1={130} y1={40} x2={170} y2={40} stroke={C.chain} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={175} y={18} w={100} h={45} label="SP 증명 제출" sub="SHA256 + 머클" color={C.sha} />
    </motion.g>
    <motion.line x1={280} y1={40} x2={315} y2={40} stroke={C.pdp} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <ModuleBox x={320} y={18} w={85} h={45} label="온체인 검증" sub="SHA2 재계산" color={C.pdp} />
    </motion.g>
    <motion.text x={210} y={85} textAnchor="middle" fontSize={11} fill={C.chain}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
      챌린지 시점 예측 불가 → 상시 데이터 보관 필수
    </motion.text>
  </g>);
}
