import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox } from '@/components/viz/boxes';
import { C, STEPS } from './UpdateTypesVizData';

function Step0() {
  return (<g>
    <ModuleBox x={20} y={10} w={150} h={42} label="OptimisticUpdate" sub="매 12초 수신" color={C.optimistic} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <rect x={200} y={10} width={260} height={42} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={210} y={28} fontSize={10} fontWeight={600} fill={C.optimistic}>attested_header (최신)</text>
      <text x={210} y={42} fontSize={8} fill="var(--muted-foreground)">빠르지만 reorg 될 수 있음</text>
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <ModuleBox x={20} y={10} w={150} h={42} label="FinalityUpdate" sub="확정 시 수신" color={C.finality} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <rect x={200} y={10} width={260} height={42} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={210} y={28} fontSize={10} fontWeight={600} fill={C.finality}>finalized_header (확정)</text>
      <text x={210} y={42} fontSize={8} fill="var(--muted-foreground)">2/3 투표 → 영구적, 되돌릴 수 없음</text>
    </motion.g>
  </g>);
}

const R = [Step0, Step1];

export default function UpdateTypesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 65" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
