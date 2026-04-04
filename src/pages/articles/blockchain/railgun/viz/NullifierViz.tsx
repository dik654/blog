import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, StatusBox } from '@/components/viz/boxes';
import { C, STEPS } from './NullifierVizData';

function Step0() {
  return (<g>
    <DataBox x={15} y={15} w={120} h={22} label="sk = 0x9c4d.." color={C.sk} />
    <DataBox x={15} y={45} w={120} h={22} label="leafIndex = 42" color={C.sk} />
    <motion.line x1={140} y1={40} x2={185} y2={40} stroke={C.sk} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={190} y={22} w={110} h={36} label="poseidon(sk, 42)" sub="결정론적" color={C.sk} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <DataBox x={325} y={27} w={140} h={26} label="null = 0xbe71..a3f2" color={C.null} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <rect x={20} y={15} width={420} height={50} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
    <text x={30} y={32} fontSize={10} fill="var(--foreground)">1차 사용: poseidon(0x9c4d.., 42) →</text>
    <text x={270} y={32} fontSize={10} fill={C.null} fontWeight={600}>0xbe71..a3f2</text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <text x={30} y={52} fontSize={10} fill="var(--foreground)">2차 사용: poseidon(0x9c4d.., 42) →</text>
      <text x={270} y={52} fontSize={10} fill={C.null} fontWeight={600}>0xbe71..a3f2 (동일!)</text>
    </motion.g>
    <motion.text x={240} y={90} textAnchor="middle" fontSize={10} fill={C.null}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      같은 (sk, idx) → 항상 같은 nullifier → 이중사용 탐지
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <ActionBox x={30} y={20} w={200} h={38} label="require(!nullifiers[0xbe71..])" sub="이중사용 체크" color={C.check} />
    <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
      <rect x={260} y={20} width={180} height={38} rx={6} fill="var(--card)" stroke={C.check} strokeWidth={0.8} />
      <text x={270} y={38} fontSize={10} fill="var(--muted-foreground)">nullifiers[0xbe71..] ==</text>
      <text x={400} y={38} fontSize={11} fill={C.check} fontWeight={600}>false</text>
      <text x={270} y={52} fontSize={10} fill={C.check}>→ 통과 ✓</text>
    </motion.g>
    <motion.text x={240} y={85} textAnchor="middle" fontSize={10} fill={C.null}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      true였다면 → revert("Already spent")
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <StatusBox x={30} y={15} w={200} h={50} label="nullifiers[0xbe71..]" sub="false → true" color={C.store} progress={1} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <rect x={260} y={18} width={180} height={44} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={270} y={36} fontSize={10} fill="var(--muted-foreground)">이후 같은 nullifier →</text>
      <text x={270} y={52} fontSize={10} fill={C.null} fontWeight={600}>require 실패 → 차단</text>
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function NullifierViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 150" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
