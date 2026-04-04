import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { AlertBox, ActionBox } from '@/components/viz/boxes';
import { C, STEPS } from './ErrorVizData';

function Step0() {
  return (<g>
    <ActionBox x={15} y={15} w={160} h={35} label="checkpoint.slot 검사" sub="현재 − 54,000 비교" color={C.expired} />
    <motion.line x1={180} y1={32} x2={220} y2={32} stroke={C.expired} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <AlertBox x={225} y={10} w={230} h={44} label="Err: checkpoint expired" sub="검증자 집합 변경 위험" color={C.expired} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <ActionBox x={15} y={15} w={160} h={35} label="fork_version 비교" sub="mainnet vs sepolia" color={C.network} />
    <motion.line x1={180} y1={32} x2={220} y2={32} stroke={C.network} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <AlertBox x={225} y={10} w={230} h={44} label="Err: network mismatch" sub="도메인 불일치 → 서명 검증 실패" color={C.network} />
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <ActionBox x={15} y={15} w={180} h={35} label="is_valid_merkle_branch()" sub="committee → state_root" color={C.branch} />
    <motion.line x1={200} y1={32} x2={240} y2={32} stroke={C.branch} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <AlertBox x={245} y={10} w={220} h={44} label="Err: invalid branch" sub="위변조된 committee 거부" color={C.branch} />
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function ErrorViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 70" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
