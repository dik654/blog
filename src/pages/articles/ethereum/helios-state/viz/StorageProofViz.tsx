import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox } from '@/components/viz/boxes';
import { C, STEPS } from './StorageProofVizData';

function Step0() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 30~31</text>
    <DataBox x={15} y={22} w={100} h={24} label="storage key" color={C.key} />
    <motion.line x1={120} y1={34} x2={155} y2={34} stroke={C.key} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={160} y={18} w={110} h={32} label="keccak256()" sub="스토리지 경로" color={C.key} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <DataBox x={300} y={22} w={160} h={24} label="path (스토리지 트라이)" color={C.key} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 32~35</text>
    <DataBox x={15} y={22} w={110} h={24} label="storage_proof" color={C.proof} />
    <DataBox x={135} y={22} w={100} h={24} label="storage_root" color={C.proof} />
    <motion.line x1={240} y1={34} x2={270} y2={34} stroke={C.proof} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={275} y={18} w={110} h={32} label="verify_proof()" sub="중첩 트라이" color={C.proof} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <DataBox x={410} y={22} w={60} h={24} label="bytes" color={C.proof} />
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 36~39</text>
    <DataBox x={15} y={22} w={90} h={24} label="encoded" color={C.proof} />
    <motion.line x1={110} y1={34} x2={145} y2={34} stroke={C.value} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={150} y={18} w={120} h={32} label="RLP decode()" sub="U256 변환" color={C.value} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <DataBox x={300} y={22} w={160} h={24} label="storage value (U256)" color={C.value} />
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function StorageProofViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 70" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
