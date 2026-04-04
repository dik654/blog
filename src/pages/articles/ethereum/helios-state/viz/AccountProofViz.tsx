import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox } from '@/components/viz/boxes';
import { C, STEPS } from './AccountProofVizData';

function Step0() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 12~13</text>
    <DataBox x={15} y={22} w={100} h={24} label="address (20B)" color={C.address} />
    <motion.line x1={120} y1={34} x2={155} y2={34} stroke={C.address} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={160} y={18} w={110} h={32} label="keccak256()" sub="해시" color={C.address} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <DataBox x={300} y={22} w={150} h={24} label="path (32B 니블 경로)" color={C.address} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 15~18</text>
    <DataBox x={15} y={22} w={110} h={24} label="account_proof" color={C.proof} />
    <DataBox x={135} y={22} w={90} h={24} label="state_root" color={C.proof} />
    <motion.line x1={230} y1={34} x2={260} y2={34} stroke={C.proof} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={265} y={18} w={110} h={32} label="verify_proof()" sub="MPT 역추적" color={C.proof} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <DataBox x={400} y={22} w={70} h={24} label="encoded" color={C.proof} />
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 20~22</text>
    <DataBox x={15} y={22} w={90} h={24} label="encoded" color={C.proof} />
    <motion.line x1={110} y1={34} x2={140} y2={34} stroke={C.account} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={145} y={18} w={120} h={32} label="RLP decode()" sub="Account 구조체" color={C.account} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <rect x={290} y={14} width={180} height={40} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={300} y={30} fontSize={9} fill={C.account} fontWeight={600}>nonce · balance</text>
      <text x={300} y={44} fontSize={9} fill="var(--muted-foreground)">storageRoot · codeHash</text>
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function AccountProofViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 70" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
