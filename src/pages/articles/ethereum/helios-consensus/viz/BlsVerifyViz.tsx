import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox } from '@/components/viz/boxes';
import { C, STEPS } from './BlsVerifyVizData';

function Step0() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 35~36</text>
    <DataBox x={15} y={22} w={80} h={24} label="agg_pk" color={C.lhs} />
    <DataBox x={105} y={22} w={80} h={24} label="H(root)" color={C.lhs} />
    <motion.line x1={190} y1={34} x2={220} y2={34} stroke={C.lhs} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={225} y={18} w={100} h={32} label="pairing()" sub="e(pk, H(m))" color={C.lhs} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <DataBox x={355} y={22} w={100} h={24} label="lhs (GT)" color={C.lhs} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 37~38</text>
    <DataBox x={15} y={22} w={90} h={24} label="G1_gen" color={C.rhs} />
    <DataBox x={115} y={22} w={70} h={24} label="sig" color={C.rhs} />
    <motion.line x1={190} y1={34} x2={220} y2={34} stroke={C.rhs} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={225} y={18} w={100} h={32} label="pairing()" sub="e(G, sig)" color={C.rhs} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <DataBox x={355} y={22} w={100} h={24} label="rhs (GT)" color={C.rhs} />
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 39</text>
    <DataBox x={30} y={22} w={100} h={24} label="lhs (GT)" color={C.lhs} />
    <text x={155} y={36} fontSize={14} fontWeight={700} fill="var(--foreground)">=?</text>
    <DataBox x={190} y={22} w={100} h={24} label="rhs (GT)" color={C.rhs} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <rect x={320} y={18} width={140} height={32} rx={6} fill="var(--card)" stroke={C.result} strokeWidth={0.8} />
      <text x={390} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.result}>같으면 true</text>
      <text x={390} y={44} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">서명 유효 → 헤더 신뢰</text>
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function BlsVerifyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 65" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
