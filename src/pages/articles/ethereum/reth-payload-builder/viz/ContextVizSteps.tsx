import { motion } from 'framer-motion';
import { ModuleBox, AlertBox, ActionBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 검증자 역할 */
export function StepRole() {
  return (<g>
    <ModuleBox x={20} y={20} w={100} h={45} label="CL (Beacon)" sub="제안자 선정" color={C.cl} />
    <motion.line x1={125} y1={42} x2={170} y2={42} stroke={C.engine} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ModuleBox x={175} y={20} w={100} h={45} label="EL (Reth)" sub="블록 조립" color={C.engine} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <motion.line x1={280} y1={42} x2={315} y2={42} stroke={C.ok} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6 }} />
      <ActionBox x={320} y={25} w={85} h={38} label="New Block" sub="12초 내 완성" color={C.ok} />
    </motion.g>
  </g>);
}

/* Step 1: 시간 제한 */
export function StepTimeLimit() {
  return (<g>
    <rect x={30} y={30} width={350} height={12} rx={6} fill="var(--border)" opacity={0.2} />
    <motion.rect x={30} y={30} height={12} rx={6} fill={C.builder}
      initial={{ width: 0 }} animate={{ width: 250 }} transition={{ duration: 1.5, ease: 'linear' }} />
    <text x={30} y={26} fontSize={10} fill="var(--muted-foreground)">0초</text>
    <text x={380} y={26} fontSize={10} fill={C.err}>12초</text>
    <motion.text x={285} y={37} fontSize={10} fill="white" fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
      TX 선택+실행
    </motion.text>
    <AlertBox x={130} y={60} w={160} h={36} label="늦으면 빈 블록"
      sub="수수료 수익 = 0" color={C.err} />
  </g>);
}

/* Step 2: MEV 경쟁 */
export function StepMev() {
  return (<g>
    <ActionBox x={30} y={22} w={120} h={38} label="로컬 빌더" sub="기본 TX 정렬" color={C.builder} />
    <ActionBox x={270} y={22} w={120} h={38} label="MEV 빌더" sub="수익 최적화" color={C.ok} />
    <motion.text x={210} y={42} textAnchor="middle" fontSize={10} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      vs
    </motion.text>
    <motion.text x={210} y={85} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      로컬이 느리면 검증자가 MEV 블록 선택 → 수익 손실
    </motion.text>
  </g>);
}
