import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { C, STEPS } from './ShieldVizData';

function Step0() {
  return (<g>
    <ModuleBox x={30} y={20} w={110} h={45} label="shield()" sub="ERC-20 입금" color={C.erc20} />
    <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
      <rect x={170} y={22} width={270} height={40} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={180} y={38} fontSize={10} fill="var(--foreground)">msg.sender = 0xUser</text>
      <text x={180} y={52} fontSize={10} fill={C.erc20}>token = 0xUSDC, amount = 1000</text>
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <ActionBox x={15} y={15} w={140} h={35} label="transferFrom()" sub="0xUser → 0xRailgun" color={C.erc20} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <rect x={180} y={10} width={270} height={55} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={190} y={28} fontSize={10} fill="var(--muted-foreground)">balances[0xUser]:</text>
      <text x={310} y={28} fontSize={11} fill={C.erc20} fontWeight={600}>5000 → 4000</text>
      <text x={190} y={48} fontSize={10} fill="var(--muted-foreground)">balances[0xRailgun]:</text>
      <text x={330} y={48} fontSize={11} fill={C.erc20} fontWeight={600}>0 → 1000</text>
    </motion.g>
    <text x={240} y={90} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      ERC-20 allowance 필요 (사전 approve)
    </text>
  </g>);
}

function Step2() {
  return (<g>
    <ActionBox x={15} y={20} w={130} h={38} label="hashCommitment()" sub="Poseidon 해시" color={C.hash} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={165} y={15} width={290} height={55} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={175} y={32} fontSize={10} fill="var(--muted-foreground)">poseidon(0xa3f2.., 0xUSDC, 1000, 0x7b1e..)</text>
      <text x={175} y={52} fontSize={11} fill={C.hash} fontWeight={600}>→ commitment = 0x2d8a..f1e2</text>
    </motion.g>
  </g>);
}

function Step3() {
  return (<g>
    <ActionBox x={15} y={15} w={120} h={38} label="insertLeaf()" sub="Merkle 삽입" color={C.merkle} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={160} y={10} width={280} height={55} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={170} y={28} fontSize={10} fill="var(--muted-foreground)">leaves[42] ← 0x2d8a..f1e2</text>
      <text x={170} y={45} fontSize={10} fill="var(--muted-foreground)">nextIndex:</text>
      <text x={250} y={45} fontSize={11} fill={C.merkle} fontWeight={600}>42 → 43</text>
      <text x={170} y={58} fontSize={10} fill={C.merkle}>root 재계산 시작</text>
    </motion.g>
  </g>);
}

function Step4() {
  return (<g>
    <ActionBox x={15} y={20} w={100} h={38} label="emit Shield" sub="이벤트" color={C.event} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={140} y={15} width={310} height={55} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={150} y={32} fontSize={10} fill={C.event} fontWeight={600}>Shield(0x2d8a.., 0xf1e2..)</text>
      <text x={150} y={50} fontSize={10} fill="var(--muted-foreground)">온체인 공개: commitment + root</text>
      <text x={150} y={62} fontSize={10} fill={C.event}>비공개: 금액, 토큰 종류, 수신자</text>
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2, Step3, Step4];

export default function ShieldViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 150" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
