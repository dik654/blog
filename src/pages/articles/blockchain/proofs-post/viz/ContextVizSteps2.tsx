import { motion } from 'framer-motion';
import { ModuleBox, AlertBox, StatusBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 2: WinningPoSt */
export function StepWinning() {
  return (<g>
    <ModuleBox x={15} y={25} w={100} h={45} label="DRAND VRF" sub="랜덤 비콘" color={C.chain} />
    <motion.line x1={120} y1={48} x2={170} y2={48} stroke={C.winning} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ModuleBox x={175} y={25} w={110} h={45} label="당첨 SP" sub="WinningPoSt 증명" color={C.winning} />
    </motion.g>
    <motion.line x1={290} y1={48} x2={330} y2={48} stroke={C.winning} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      <StatusBox x={335} y={22} w={75} h={50} label="블록 생성" sub="보상 획득" color={C.winning} progress={1} />
    </motion.g>
    <text x={210} y={95} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      매 에폭(30초)마다 추첨 → 당첨 시 즉시 증명 제출
    </text>
  </g>);
}

/* Step 3: Fault & Recovery */
export function StepFault() {
  const items = [
    { label: '데드라인 미제출', color: C.fault },
    { label: 'Fault 선언', color: C.fault },
    { label: '패널티 부과', color: C.fault },
  ];
  return (<g>
    {items.map((s, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.15 }}>
        <AlertBox x={10 + i * 130} y={20} w={115} h={40} label={s.label} color={s.color} />
        {i < 2 && <text x={125 + i * 130} y={42} fontSize={10} fill="var(--muted-foreground)">→</text>}
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <StatusBox x={140} y={68} w={140} h={40} label="14일 내 Recovery"
        sub="복구 메시지 제출" color={C.ok} progress={0.6} />
    </motion.g>
  </g>);
}
