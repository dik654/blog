import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { C, STEPS } from './BranchVizData';

function Step0() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 27~28</text>
    <DataBox x={15} y={22} w={120} h={24} label="committee_hash" color={C.leaf} />
    <motion.line x1={140} y1={34} x2={175} y2={34} stroke={C.branch} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={180} y={18} w={150} h={32} label="is_valid_merkle_branch" sub="leaf + branch[5]" color={C.branch} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <DataBox x={360} y={22} w={100} h={24} label="state_root" color={C.root} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 29~31</text>
    <rect x={20} y={22} width={200} height={40} rx={6} fill="var(--card)" stroke={C.branch} strokeWidth={0.8} />
    <text x={120} y={38} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.branch}>depth = 5</text>
    <text x={120} y={52} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">바이너리 Merkle 트리 5단계</text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={250} y={22} width={200} height={40} rx={6} fill="var(--card)" stroke={C.root} strokeWidth={0.8} />
      <text x={350} y={38} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.root}>index = 22</text>
      <text x={350} y={52} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Beacon State 내 committee 위치</text>
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 34~36</text>
    <ActionBox x={20} y={22} w={140} h={32} label="valid == false" sub="Merkle 불일치" color="#ef4444" />
    <motion.line x1={165} y1={38} x2={200} y2={38} stroke="#ef4444" strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <AlertBox x={205} y={18} w={250} h={40} label="Err: invalid branch" sub="위변조된 committee 거부" color="#ef4444" />
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function BranchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 80" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
