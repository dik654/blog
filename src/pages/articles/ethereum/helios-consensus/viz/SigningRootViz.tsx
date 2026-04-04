import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox } from '@/components/viz/boxes';
import { C, STEPS } from './SigningRootVizData';

function Step0() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 29~31</text>
    <DataBox x={15} y={22} w={130} h={24} label="DOMAIN_SYNC_COMMITTEE" color={C.domain} />
    <motion.line x1={150} y1={34} x2={185} y2={34} stroke={C.domain} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={190} y={18} w={130} h={32} label="compute_domain()" sub="+ fork_version" color={C.domain} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <DataBox x={350} y={22} w={110} h={24} label="domain (32B)" color={C.domain} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 32~33</text>
    <DataBox x={15} y={22} w={90} h={24} label="header" color={C.ssz} />
    <DataBox x={115} y={22} w={90} h={24} label="domain" color={C.domain} />
    <motion.line x1={210} y1={34} x2={240} y2={34} stroke={C.root} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={245} y={18} w={130} h={32} label="signing_root()" sub="SSZ + domain" color={C.root} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <DataBox x={400} y={22} w={70} h={24} label="root" color={C.root} />
    </motion.g>
  </g>);
}

const R = [Step0, Step1];

export default function SigningRootViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 65" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
