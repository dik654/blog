import { motion } from 'framer-motion';
import { ModuleBox, AlertBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 장군들의 합의 문제 */
export function StepGenerals() {
  const generals = [
    { x: 50, y: 15, label: 'G1' }, { x: 180, y: 15, label: 'G2' },
    { x: 310, y: 15, label: 'G3' }, { x: 180, y: 75, label: 'G4' },
  ];
  return (<g>
    {generals.map((g, i) => (
      <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: i * 0.1, type: 'spring', bounce: 0.3 }}>
        <circle cx={g.x + 30} cy={g.y + 18} r={15} fill="var(--card)"
          stroke={C.ok} strokeWidth={1.2} />
        <text x={g.x + 30} y={g.y + 22} textAnchor="middle" fontSize={10}
          fontWeight={600} fill={C.ok}>{g.label}</text>
      </motion.g>
    ))}
    <motion.text x={210} y={118} textAnchor="middle" fontSize={11}
      fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}>
      메시지만으로 공격/후퇴를 합의해야 함
    </motion.text>
  </g>);
}

/* Step 1: 배신자 이중 메시지 */
export function StepBetrayal() {
  return (<g>
    <ModuleBox x={20} y={15} w={85} h={40} label="정직 A" sub="공격 수신" color={C.ok} />
    <AlertBox x={160} y={15} w={100} h={40} label="배신자" sub="이중 메시지" color={C.byz} />
    <ModuleBox x={310} y={15} w={85} h={40} label="정직 B" sub="후퇴 수신" color={C.ok} />
    <motion.line x1={160} y1={35} x2={105} y2={35} stroke={C.ok} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
    <motion.line x1={260} y1={35} x2={310} y2={35} stroke={C.byz} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
    <motion.text x={130} y={28} textAnchor="middle" fontSize={10} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>공격</motion.text>
    <motion.text x={288} y={28} textAnchor="middle" fontSize={10} fill={C.byz}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>후퇴</motion.text>
    <motion.text x={210} y={85} textAnchor="middle" fontSize={11} fill={C.byz}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      A와 B가 서로 다른 결정 — 시스템 분열
    </motion.text>
    <motion.text x={210} y={108} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
      {'💡 이것이 비잔틴 장애(Byzantine Fault)'}
    </motion.text>
  </g>);
}
