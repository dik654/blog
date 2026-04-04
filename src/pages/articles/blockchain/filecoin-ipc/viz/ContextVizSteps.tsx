import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: IPC 개요 */
export function StepOverview() {
  return (<g>
    <ModuleBox x={130} y={8} w={160} h={35} label="Filecoin 메인넷" sub="보안 앵커" color={C.main} />
    <motion.line x1={210} y1={43} x2={120} y2={60} stroke={C.subnet} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.line x1={210} y1={43} x2={300} y2={60} stroke={C.subnet} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
      <ModuleBox x={50} y={60} w={130} h={35} label="서브넷 A" sub="Tendermint 합의" color={C.subnet} />
    </motion.g>
    <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
      <ModuleBox x={240} y={60} w={130} h={35} label="서브넷 B" sub="커스텀 합의" color={C.check} />
    </motion.g>
    <text x={210} y={110} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      각 서브넷이 독립 블록 생산 → 메인넷에 체크포인트
    </text>
  </g>);
}

/* Step 1: 서브넷 생성 & 참여 */
export function StepCreate() {
  return (<g>
    <ActionBox x={15} y={22} w={110} h={48} label="FIL 스테이크" sub="최소 요건 충족" color={C.stake} />
    <motion.line x1={130} y1={46} x2={170} y2={46} stroke={C.subnet} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ModuleBox x={175} y={22} w={120} h={48} label="서브넷 생성" sub="합의 타입 선택" color={C.subnet} />
    </motion.g>
    <motion.line x1={300} y1={46} x2={330} y2={46} stroke={C.check} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      <ActionBox x={335} y={22} w={75} h={48} label="검증자" sub="블록 생산" color={C.check} />
    </motion.g>
  </g>);
}

/* Step 2: 체크포인팅 & 크로스 메시지 */
export function StepCheckpoint() {
  return (<g>
    <ModuleBox x={10} y={18} w={110} h={42} label="서브넷 상태" sub="상태 루트 해시" color={C.subnet} />
    <motion.line x1={125} y1={39} x2={165} y2={39} stroke={C.check} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={170} y={18} w={110} h={42} label="2/3+ 서명" sub="체크포인트 커밋" color={C.check} />
    </motion.g>
    <motion.line x1={285} y1={39} x2={315} y2={39} stroke={C.main} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <ModuleBox x={320} y={18} w={90} h={42} label="메인넷" sub="finality" color={C.main} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
      <DataBox x={140} y={70} w={140} h={24} label="크로스 서브넷 메시지" color={C.cross} />
    </motion.g>
  </g>);
}
