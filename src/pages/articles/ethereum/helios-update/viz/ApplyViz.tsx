import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './ApplyVizData';

function Step0() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 34~38</text>
    <DataBox x={15} y={22} w={160} h={24} label="update.finalized.slot" color={C.finalized} />
    <text x={195} y={36} fontSize={12} fontWeight={700} fill="var(--foreground)">{'>'}</text>
    <DataBox x={215} y={22} w={150} h={24} label="store.finalized.slot" color={C.finalized} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ModuleBox x={390} y={14} w={80} h={36} label="교체" sub="↑ 갱신" color={C.finalized} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 40~43</text>
    <DataBox x={15} y={22} w={170} h={24} label="has_next_committee()" color={C.committee} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <text x={200} y={36} fontSize={10} fill={C.committee}>== true</text>
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ModuleBox x={270} y={14} w={190} h={36} label="current = next_committee" sub="period 경계 교체" color={C.committee} />
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 44~46</text>
    <DataBox x={15} y={22} w={170} h={24} label="update.attested_header" color={C.optimistic} />
    <motion.line x1={190} y1={34} x2={225} y2={34} stroke={C.optimistic} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ModuleBox x={230} y={14} w={200} h={36} label="store.optimistic_header" sub="항상 최신으로 교체" color={C.optimistic} />
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function ApplyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 65" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
