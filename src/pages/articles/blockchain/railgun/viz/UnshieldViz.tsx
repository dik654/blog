import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './UnshieldVizData';

function Step0() {
  return (<g>
    <ModuleBox x={20} y={15} w={110} h={45} label="unshield()" sub="ERC-20 출금" color={C.proof} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={155} y={12} width={300} height={55} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={165} y={28} fontSize={10} fill="var(--foreground)">Bob이 500 USDC 출금</text>
      <text x={165} y={43} fontSize={10} fill="var(--muted-foreground)">to = 0xBob, token = 0xUSDC</text>
      <text x={165} y={58} fontSize={10} fill={C.transfer}>amount = 500</text>
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <ActionBox x={20} y={15} w={130} h={38} label="verifyProof()" sub="소유권 증명" color={C.proof} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={170} y={10} width={280} height={55} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={180} y={27} fontSize={10} fill="var(--muted-foreground)">publicInputs = [nullifier, root, to, token, amount]</text>
      <text x={180} y={42} fontSize={10} fill="var(--muted-foreground)">Bob이 commitment의 spendingKey 소유자</text>
      <text x={180} y={57} fontSize={11} fill={C.proof} fontWeight={600}>→ true</text>
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <ActionBox x={20} y={15} w={200} h={38} label="require(!nullifiers[0x55cd..])" sub="이중사용 방지" color={C.null} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={240} y={10} width={210} height={55} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={250} y={27} fontSize={10} fill="var(--muted-foreground)">nullifiers[0x55cd..] == false ✓</text>
      <text x={250} y={44} fontSize={10} fill={C.null} fontWeight={600}>false → true</text>
      <text x={250} y={58} fontSize={10} fill="var(--muted-foreground)">Note 소비 완료</text>
    </motion.g>
  </g>);
}

function Step3() {
  return (<g>
    <ActionBox x={15} y={12} w={140} h={38} label="transfer(Bob, 500)" sub="ERC-20 전송" color={C.transfer} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={175} y={8} width={280} height={60} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={185} y={26} fontSize={10} fill="var(--muted-foreground)">IERC20(0xUSDC).transfer(0xBob, 500)</text>
      <text x={185} y={42} fontSize={10} fill="var(--muted-foreground)">balances[0xRailgun]:</text>
      <text x={325} y={42} fontSize={11} fill={C.balance} fontWeight={600}>1000 → 500</text>
      <text x={185} y={58} fontSize={10} fill="var(--muted-foreground)">balances[0xBob]:</text>
      <text x={290} y={58} fontSize={11} fill={C.transfer} fontWeight={600}>0 → 500</text>
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function UnshieldViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 150" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
