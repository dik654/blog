import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { C, STEPS } from './ExecuteVizData';

function Step0() {
  return (<g>
    <ModuleBox x={15} y={15} w={110} h={42} label="EntryPoint" sub="Phase 2" color={C.call} />
    <motion.line x1={130} y1={36} x2={185} y2={36} stroke={C.call} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ModuleBox x={190} y={15} w={130} h={42} label="Smart Account" sub="sender.call()" color={C.call} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <DataBox x={350} y={22} w={100} h={28} label="callData" sub="bytes" color={C.call} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <rect x={20} y={12} width={220} height={50} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
    <text x={30} y={30} fontSize={10} fill="var(--muted-foreground)">selector: 0xa9059cbb</text>
    <motion.text x={30} y={45} fontSize={10} fontWeight={600} fill={C.call}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      transfer(0x5678.., 500 USDC)
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ActionBox x={270} y={18} w={160} h={38} label="USDC.transfer()" sub="ERC-20 실행" color={C.state} />
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <motion.g initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }}>
      <rect x={15} y={12} width={200} height={40} rx={6} fill={`${C.state}08`} stroke={C.state} strokeWidth={0.7} />
      <text x={25} y={30} fontSize={10} fill="var(--muted-foreground)">balances[sender]:</text>
      <text x={25} y={44} fontSize={11} fontWeight={600} fill={C.state}>2000 → 1500 (-500)</text>
    </motion.g>
    <motion.g initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <rect x={240} y={12} width={200} height={40} rx={6} fill={`${C.state}08`} stroke={C.state} strokeWidth={0.7} />
      <text x={250} y={30} fontSize={10} fill="var(--muted-foreground)">balances[to]:</text>
      <text x={250} y={44} fontSize={11} fontWeight={600} fill={C.state}>300 → 800 (+500)</text>
    </motion.g>
    <text x={240} y={80} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      ERC-20 상태 변경 — Transfer 이벤트 발행
    </text>
  </g>);
}

function Step3() {
  return (<g>
    <rect x={30} y={15} width={400} height={50} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
    <motion.text x={40} y={34} fontSize={10} fill={C.event}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      UserOperationEvent(
    </motion.text>
    <motion.text x={60} y={48} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      hash, sender=0x1234, nonce=7, success=true, gasUsed=180000
    </motion.text>
    <motion.text x={40} y={60} fontSize={10} fill={C.event}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      )
    </motion.text>
    <text x={240} y={90} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      번들러 · 인덱서가 이벤트를 구독하여 결과 추적
    </text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function ExecuteViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl"><S /></svg>;
      }}
    </StepViz>
  );
}
