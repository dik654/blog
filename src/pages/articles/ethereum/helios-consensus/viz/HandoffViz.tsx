import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './HandoffVizData';

function Step0() {
  return (<g>
    <ModuleBox x={15} y={10} w={130} h={42} label="current (N)" sub="서명 검증 중" color={C.current} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <ModuleBox x={180} y={10} w={130} h={42} label="next (N+1)" sub="Update에서 수신" color={C.next} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <DataBox x={345} y={18} w={120} h={26} label="Merkle 검증됨" color={C.handoff} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <ModuleBox x={15} y={10} w={130} h={42} label="next → current" sub="핸드오프 완료" color={C.next} />
    <motion.line x1={150} y1={31} x2={190} y2={31} stroke={C.handoff} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ModuleBox x={195} y={10} w={160} h={42} label="Period N+1 시작" sub="새 committee로 검증" color={C.current} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <rect x={380} y={10} width={90} height={42} rx={6} fill="var(--card)" stroke={C.handoff} strokeWidth={0.8} />
      <text x={425} y={28} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.handoff}>next</text>
      <text x={425} y={42} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">대기 중</text>
    </motion.g>
  </g>);
}

const R = [Step0, Step1];

export default function HandoffViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 65" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
