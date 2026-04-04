import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox } from '@/components/viz/boxes';
import { C, STEPS } from './GasEstimationVizData';

function Step0() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 1</text>
    <ActionBox x={15} y={22} w={130} h={28} label="get_block(latest)" sub="Helios 헤더 조회" color={C.base} />
    <motion.line x1={150} y1={36} x2={185} y2={36} stroke={C.base} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={190} y={24} w={160} h={24} label="base_fee = 25 gwei" color={C.base} />
    </motion.g>
    <motion.text x={420} y={38} fontSize={9} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      Merkle 검증됨
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 2</text>
    <ActionBox x={15} y={22} w={150} h={28} label="feeHistory(5, latest)" sub="25/75 퍼센타일" color={C.priority} />
    <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
      <rect x={190} y={18} width={260} height={40} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={200} y={34} fontSize={10} fill={C.priority} fontWeight={600}>P25: 1.2 gwei  |  P75: 2.5 gwei</text>
      <text x={200} y={50} fontSize={9} fill="var(--muted-foreground)">최근 5블록 우선순위 수수료 분포</text>
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 3</text>
    <ActionBox x={15} y={22} w={120} h={28} label="eth_call(tx)" sub="ProofDB 로컬 실행" color={C.limit} />
    <motion.line x1={140} y1={36} x2={175} y2={36} stroke={C.limit} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={180} y={24} w={110} h={24} label="gas_used: 21000" color={C.limit} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <DataBox x={310} y={24} w={140} h={24} label="gas_limit: 25200 (+20%)" color={C.limit} />
    </motion.g>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 4: EIP-1559</text>
    <rect x={30} y={22} width={400} height={55} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      <text x={45} y={40} fontSize={10} fill={C.base} fontWeight={600}>base_fee</text>
      <text x={115} y={40} fontSize={10} fill="var(--muted-foreground)">25 gwei</text>
      <text x={180} y={40} fontSize={10} fill="var(--foreground)">x 2 =</text>
      <text x={220} y={40} fontSize={10} fill={C.base} fontWeight={600}>50 gwei</text>
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <text x={45} y={58} fontSize={10} fill={C.priority} fontWeight={600}>+ max_priority</text>
      <text x={165} y={58} fontSize={10} fill="var(--muted-foreground)">2.5 gwei</text>
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <text x={45} y={72} fontSize={11} fill="var(--foreground)" fontWeight={700}>= max_fee: 52.5 gwei</text>
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function GasEstimationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 95" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
