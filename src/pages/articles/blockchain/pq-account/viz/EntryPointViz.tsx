import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { C, STEPS } from './EntryPointVizData';

function Step0() {
  const ops = ['Op₀', 'Op₁', 'Op₂'];
  return (<g>
    <ModuleBox x={15} y={15} w={100} h={42} label="Bundler" sub="ops 배열 제출" color={C.phase1} />
    <motion.line x1={120} y1={36} x2={165} y2={36} stroke={C.phase1} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    {ops.map((op, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.15 + 0.3 }}>
        <DataBox x={170 + i * 95} y={22} w={80} h={28} label={op} color={C.phase1} />
      </motion.g>
    ))}
    <text x={280} y={80} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      handleOps(ops[], beneficiary) 진입
    </text>
  </g>);
}

function Step1() {
  return (<g>
    <ActionBox x={15} y={15} w={130} h={40} label="validatePrepayment" sub="nonce + 서명" color={C.phase1} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={170} y={15} width={280} height={55} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={180} y={32} fontSize={10} fill="var(--muted-foreground)">1. require(nonce == 7, "AA25")</text>
      <text x={180} y={47} fontSize={10} fill="var(--muted-foreground)">2. nonce++ → 8</text>
      <text x={180} y={62} fontSize={10} fill="var(--muted-foreground)">3. account.validateUserOp(op, hash, funds)</text>
    </motion.g>
    <text x={240} y={95} textAnchor="middle" fontSize={10} fill={C.phase1}>
      Phase 1: 모든 UserOp 사전 검증
    </text>
  </g>);
}

function Step2() {
  return (<g>
    <ActionBox x={15} y={15} w={120} h={40} label="_executeUserOp" sub="callData 실행" color={C.phase2} />
    <motion.line x1={140} y1={35} x2={185} y2={35} stroke={C.phase2} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={190} y={10} width={270} height={60} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={200} y={28} fontSize={10} fill="var(--muted-foreground)">sender.call(callData)</text>
      <text x={200} y={43} fontSize={10} fill={C.phase2}>→ transfer(0x5678, 500 USDC)</text>
      <text x={200} y={58} fontSize={10} fill="var(--muted-foreground)">balances[sender]: 2000→1500</text>
      <text x={350} y={58} fontSize={10} fill="var(--muted-foreground)">balances[to]: 300→800</text>
    </motion.g>
    <text x={240} y={95} textAnchor="middle" fontSize={10} fill={C.phase2}>
      Phase 2: 검증 통과된 UserOp만 실행
    </text>
  </g>);
}

function Step3() {
  return (<g>
    <rect x={30} y={18} width={150} height={40} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
    <text x={105} y={36} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">collected gas</text>
    <text x={105} y={50} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.phase3}>0.003 ETH</text>
    <motion.line x1={185} y1={38} x2={245} y2={38} stroke={C.phase3} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ModuleBox x={250} y={15} w={120} h={45} label="Bundler" sub="beneficiary" color={C.phase3} />
    </motion.g>
    <motion.text x={240} y={90} textAnchor="middle" fontSize={10} fill={C.phase3}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      _compensate(beneficiary, collected) — 가스비 정산
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function EntryPointViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl"><S /></svg>;
      }}
    </StepViz>
  );
}
