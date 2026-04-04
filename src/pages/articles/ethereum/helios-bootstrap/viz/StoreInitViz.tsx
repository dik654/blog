import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './StoreInitVizData';

function Step0() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 37</text>
    <DataBox x={15} y={22} w={130} h={24} label="boot.header" color={C.init} />
    <motion.line x1={150} y1={34} x2={185} y2={34} stroke={C.store} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ModuleBox x={190} y={12} w={170} h={40} label="store.finalized_header" sub="확정된 최신 헤더" color={C.store} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 38~39</text>
    <DataBox x={15} y={22} w={150} h={24} label="boot.sync_committee" color={C.field} />
    <motion.line x1={170} y1={34} x2={205} y2={34} stroke={C.store} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ModuleBox x={210} y={10} w={200} h={42} label="store.current_sync_committee" sub="512 BLS 공개키" color={C.store} />
    </motion.g>
  </g>);
}

function Step2() {
  const fields = [
    { label: 'optimistic_header', v: 'boot.header', y: 20 },
    { label: 'prev_max_participants', v: '0', y: 48 },
    { label: 'best_valid_update', v: 'None', y: 76 },
  ];
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 40~42</text>
    {fields.map((f, i) => (
      <motion.g key={f.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.15 }}>
        <DataBox x={15} y={f.y} w={160} h={22} label={f.label} color={C.store} />
        <text x={190} y={f.y + 14} fontSize={9} fill="var(--muted-foreground)">← {f.v}</text>
      </motion.g>
    ))}
  </g>);
}

const R = [Step0, Step1, Step2];

export default function StoreInitViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 110" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
