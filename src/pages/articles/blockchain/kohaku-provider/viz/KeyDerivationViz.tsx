import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox } from '@/components/viz/boxes';
import { C, STEPS } from './KeyDerivationVizData';

function Step0() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 1</text>
    <DataBox x={15} y={22} w={120} h={24} label="니모닉 (12단어)" color={C.seed} />
    <motion.line x1={140} y1={34} x2={175} y2={34} stroke={C.seed} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={180} y={20} w={120} h={28} label="PBKDF2" sub="2048 라운드" color={C.seed} />
    </motion.g>
    <motion.line x1={305} y1={34} x2={340} y2={34} stroke={C.seed} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <DataBox x={345} y={22} w={110} h={24} label="seed (64 bytes)" color={C.seed} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 2</text>
    <DataBox x={15} y={22} w={100} h={24} label="seed (64B)" color={C.seed} />
    <motion.line x1={120} y1={34} x2={155} y2={34} stroke={C.key} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={160} y={18} w={110} h={32} label="HMAC-SHA512" sub="Bitcoin seed" color={C.key} />
    </motion.g>
    <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
      <DataBox x={295} y={15} w={130} h={22} label="master_key (32B)" color={C.key} />
      <DataBox x={295} y={42} w={130} h={22} label="chain_code (32B)" color={C.key} />
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 3~4</text>
    <DataBox x={15} y={22} w={120} h={24} label="master_key" color={C.key} />
    <motion.line x1={140} y1={34} x2={170} y2={34} stroke={C.path} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={175} y={18} w={140} h={32} label="derive_path()" sub="m/44'/60'/0'/0/0" color={C.path} />
    </motion.g>
    <motion.line x1={320} y1={34} x2={350} y2={34} stroke={C.path} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <DataBox x={355} y={22} w={100} h={24} label="child_key" color={C.path} />
    </motion.g>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 5~6</text>
    <DataBox x={15} y={22} w={100} h={24} label="child_key" color={C.path} />
    <motion.line x1={120} y1={34} x2={148} y2={34} stroke={C.addr} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
      <ActionBox x={153} y={20} w={100} h={28} label="secp256k1" sub="공개키 생성" color={C.addr} />
    </motion.g>
    <motion.line x1={258} y1={34} x2={283} y2={34} stroke={C.addr} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
      <ActionBox x={288} y={20} w={80} h={28} label="keccak256" sub="[12..]" color={C.addr} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      <DataBox x={380} y={22} w={90} h={24} label="0x1234..5678" color={C.addr} />
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function KeyDerivationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 90" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
