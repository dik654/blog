import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { AlertBox, ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { C, STEPS } from './ContextVizData';

function Step0() {
  return (<g>
    <ModuleBox x={30} y={20} w={100} h={45} label="Ethereum TX" sub="공개 원장" color={C.problem} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={160} y={22} width={280} height={40} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={170} y={38} fontSize={10} fill={C.problem} fontWeight={600}>from: 0xAlice</text>
      <text x={170} y={52} fontSize={10} fill={C.problem} fontWeight={600}>to: 0xBob  amount: 1000 USDC</text>
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <AlertBox x={160} y={75} w={200} h={35} label="Etherscan에서 누구나 추적 가능" color={C.problem} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <ModuleBox x={20} y={25} w={90} h={45} label="Account 모델" sub="잔액 기반" color={C.problem} />
    <motion.line x1={115} y1={48} x2={155} y2={48} stroke="var(--border)" strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
      <ModuleBox x={160} y={25} w={90} h={45} label="UTXO 모델" sub="출력 기반" color={C.utxo} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <ActionBox x={280} y={25} w={160} h={45} label="미사용 출력(Note)을 소비" sub="잔액 직접 노출 없음" color={C.utxo} />
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <DataBox x={20} y={30} w={100} h={28} label="Note (평문)" color={C.shield} />
    <motion.line x1={125} y1={44} x2={175} y2={44} stroke={C.shield} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={180} y={25} w={100} h={38} label="Poseidon Hash" sub="commitment" color={C.shield} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <DataBox x={310} y={30} w={120} h={28} label="0x2d8a..f1e2" sub="commitment" color={C.shield} />
    </motion.g>
    <text x={240} y={90} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      값·소유자가 해시 뒤에 은닉된다
    </text>
  </g>);
}

function Step3() {
  return (<g>
    <DataBox x={20} y={30} w={90} h={28} label="commitment" color={C.zk} />
    <motion.line x1={115} y1={44} x2={155} y2={44} stroke={C.zk} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={160} y={22} w={110} h={42} label="Groth16 Proof" sub="spendingKey 비공개" color={C.zk} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <ModuleBox x={300} y={25} w={130} h={45} label="Verifier.sol" sub="e(A,B)==e(α,β)·..." color={C.zk} />
    </motion.g>
    <motion.text x={240} y={95} textAnchor="middle" fontSize={10} fill={C.zk}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
      비밀키 없이 소유권 검증 완료
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function ContextViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 150" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
