import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox } from '@/components/viz/boxes';
import { C, STEPS } from './TokenTrackingVizData';

function Step0() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 1: 슬롯 계산</text>
    <DataBox x={15} y={22} w={90} h={22} label="address" color={C.slot} />
    <DataBox x={115} y={22} w={100} h={22} label="BALANCE_SLOT" color={C.slot} />
    <motion.line x1={140} y1={50} x2={140} y2={58} stroke={C.slot} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ActionBox x={80} y={60} w={130} h={28} label="keccak256(encode)" sub="Solidity 매핑" color={C.slot} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <DataBox x={250} y={62} w={180} h={24} label="slot = 0x3a7f..c2d1" color={C.slot} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 2~3</text>
    <ActionBox x={15} y={22} w={130} h={30} label="get_proof()" sub="token_contract, [slot]" color={C.proof} />
    <motion.line x1={150} y1={37} x2={185} y2={37} stroke={C.proof} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={190} y={22} w={140} h={30} label="verify_storage_proof()" sub="Merkle 증명 검증" color={C.proof} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <DataBox x={350} y={24} w={110} h={26} label="balance_bytes" color={C.proof} />
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 4</text>
    <DataBox x={15} y={25} w={130} h={24} label="balance_bytes" color={C.proof} />
    <motion.line x1={150} y1={37} x2={185} y2={37} stroke={C.balance} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={190} y={22} w={130} h={30} label="U256::from_be_bytes" sub="빅엔디안 변환" color={C.balance} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <DataBox x={340} y={25} w={120} h={24} label="1,000 USDC" color={C.balance} />
    </motion.g>
    <motion.text x={240} y={75} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      1,000,000,000 raw / 10^6 decimals = 1,000 USDC
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 5~6: ERC-721</text>
    <DataBox x={15} y={22} w={100} h={22} label="tokenId" color={C.slot} />
    <DataBox x={125} y={22} w={100} h={22} label="OWNER_SLOT" color={C.slot} />
    <motion.line x1={140} y1={50} x2={140} y2={58} stroke={C.slot} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.2 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ActionBox x={60} y={60} w={160} h={28} label="verify_storage_proof()" sub="NFT 소유자 증명" color={C.proof} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <DataBox x={250} y={62} w={180} h={24} label="owner = 0xAlice..1234" color={C.proof} />
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function TokenTrackingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 100" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
