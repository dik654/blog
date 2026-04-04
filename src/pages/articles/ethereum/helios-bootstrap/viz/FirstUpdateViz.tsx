import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './FirstUpdateVizData';

function Step0() {
  return (<g>
    <ModuleBox x={15} y={12} w={120} h={40} label="Store (초기화됨)" sub="finalized + committee" color={C.store} />
    <motion.line x1={140} y1={32} x2={175} y2={32} stroke={C.api} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={180} y={12} w={160} h={40} label="GET finality_update" sub="Beacon API" color={C.api} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <DataBox x={370} y={20} w={95} h={24} label="Update 수신" color={C.update} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <DataBox x={15} y={20} w={120} h={24} label="finality_update" color={C.update} />
    <motion.line x1={140} y1={32} x2={175} y2={32} stroke={C.update} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={180} y={12} w={130} h={40} label="validate + apply" sub="BLS 서명 검증" color={C.update} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <ModuleBox x={340} y={10} w={130} h={44} label="Store 갱신됨" sub="finalized ↑ optimistic ↑" color={C.store} />
    </motion.g>
  </g>);
}

const R = [Step0, Step1];

export default function FirstUpdateViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 70" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
