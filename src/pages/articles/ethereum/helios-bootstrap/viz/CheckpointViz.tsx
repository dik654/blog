import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './CheckpointVizData';

function Step0() {
  return (<g>
    <ModuleBox x={20} y={12} w={120} h={38} label="Beacon Node" sub="checkpoint_sync_url" color={C.api} />
    <motion.line x1={145} y1={31} x2={185} y2={31} stroke={C.api} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={190} y={18} w={140} h={26} label="GET /bootstrap/{root}" color={C.api} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <DataBox x={350} y={18} w={110} h={26} label="Bootstrap JSON" color={C.api} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <ModuleBox x={20} y={12} w={120} h={38} label="하드코딩" sub="바이너리 내장" color={C.hard} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={170} y={8} width={290} height={46} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={180} y={26} fontSize={9} fontWeight={600} fill={C.hard}>mainnet: 0xa7e8..3f1c</text>
      <text x={180} y={40} fontSize={9} fill="var(--muted-foreground)">sepolia: 0xb3c1..7d2e | holesky: 0xc4f2..9a3b</text>
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <ModuleBox x={20} y={12} w={120} h={38} label="사용자 지정" sub="CLI / config" color={C.user} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <rect x={170} y={8} width={290} height={46} rx={6} fill="var(--card)" stroke={C.user} strokeWidth={0.8} />
      <text x={180} y={26} fontSize={9} fontWeight={600} fill={C.user}>--checkpoint 0x1234..5678</text>
      <text x={180} y={40} fontSize={9} fill="var(--muted-foreground)">감사된 루트 사용 → 가장 안전한 방법</text>
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function CheckpointViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 70" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
