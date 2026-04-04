import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox } from '@/components/viz/boxes';
import { C, STEPS } from './ValidateVizData';

function Step0() {
  return (<g>
    <DataBox x={20} y={20} w={100} h={28} label="op.nonce: 7" color={C.nonce} />
    <text x={140} y={39} fontSize={12} fill="var(--muted-foreground)">==</text>
    <DataBox x={170} y={20} w={130} h={28} label="account.nonce: 7" color={C.nonce} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <rect x={330} y={25} width={60} height={22} rx={11} fill={`${C.sig}15`} stroke={C.sig} strokeWidth={1} />
      <text x={360} y={40} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.sig}>PASS</text>
    </motion.g>
    <text x={240} y={80} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      일치 → 계속 / 불일치 → AA25 revert
    </text>
  </g>);
}

function Step1() {
  return (<g>
    <rect x={40} y={20} width={100} height={35} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
    <text x={90} y={36} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.nonce}>7</text>
    <text x={90} y={50} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">현재 nonce</text>
    <motion.text x={170} y={40} fontSize={14} fill={C.nonce}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>→</motion.text>
    <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
      <rect x={200} y={20} width={100} height={35} rx={6} fill={`${C.sig}10`} stroke={C.sig} strokeWidth={0.8} />
      <text x={250} y={36} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.sig}>8</text>
      <text x={250} y={50} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">증가 후</text>
    </motion.g>
    <text x={240} y={85} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      _incrementNonce() — 즉시 증가
    </text>
  </g>);
}

function Step2() {
  return (<g>
    <rect x={15} y={15} width={260} height={45} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
    <text x={25} y={33} fontSize={10} fill="var(--muted-foreground)">maxFeePerGas * callGasLimit</text>
    <motion.text x={25} y={48} fontSize={10} fill={C.funds}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      30 gwei * 200,000 = 0.006 ETH
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <text x={285} y={35} fontSize={12} fill="var(--muted-foreground)">-</text>
      <DataBox x={300} y={20} w={110} h={28} label="deposit: 0.01" color={C.funds} />
    </motion.g>
    <motion.text x={240} y={85} textAnchor="middle" fontSize={10} fill={C.funds}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      missingFunds = 0 (예치금 충분)
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <ActionBox x={15} y={12} w={140} h={40} label="account.validateUserOp" sub="서명 검증 위임" color={C.sig} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={175} y={12} width={280} height={55} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={185} y={30} fontSize={10} fill={C.nonce}>1. ecrecover(hash, ecdsaSig) == owner</text>
      <text x={185} y={46} fontSize={10} fill={C.sig}>2. dilithium_verify(pk, hash, dilithiumSig)</text>
      <text x={185} y={62} fontSize={10} fill={C.funds}>3. return 0 (both valid)</text>
    </motion.g>
  </g>);
}

function Step4() {
  return (<g>
    <DataBox x={30} y={20} w={160} h={30} label="validationData: 0" color={C.sig} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <text x={210} y={40} fontSize={12} fill="var(--muted-foreground)">==</text>
      <rect x={230} y={22} width={50} height={26} rx={4} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={255} y={39} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">0</text>
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <rect x={310} y={22} width={80} height={26} rx={13} fill={`${C.sig}15`} stroke={C.sig} strokeWidth={1} />
      <text x={350} y={39} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.sig}>VALID</text>
    </motion.g>
    <text x={240} y={80} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      0이 아니면 AA24 signature error → revert
    </text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3, Step4];

export default function ValidateViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl"><S /></svg>;
      }}
    </StepViz>
  );
}
