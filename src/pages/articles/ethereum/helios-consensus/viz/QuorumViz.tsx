import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { C, STEPS } from './QuorumVizData';

function Step0() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 20~23</text>
    <rect x={20} y={22} width={200} height={35} rx={6} fill="var(--card)" stroke={C.check} strokeWidth={0.8} />
    <text x={120} y={36} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.check}>participants * 3</text>
    <text x={120} y={50} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{'< pks.len() * 2 → reject'}</text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={250} y={22} width={100} height={35} rx={6} fill="var(--card)" stroke={C.pass} strokeWidth={0.8} />
      <text x={300} y={36} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.pass}>{'≥ 342/512'}</text>
      <text x={300} y={50} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">통과</text>
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <rect x={370} y={22} width={100} height={35} rx={6} fill="var(--card)" stroke={C.fail} strokeWidth={0.8} />
      <text x={420} y={36} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.fail}>{'< 342/512'}</text>
      <text x={420} y={50} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">거부</text>
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <rect x={20} y={22} width={440} height={12} rx={6} fill="var(--border)" opacity={0.3} />
    <motion.rect x={20} y={22} width={293} height={12} rx={6} fill={C.pass} opacity={0.6}
      initial={{ width: 0 }} animate={{ width: 293 }} transition={{ duration: 0.5 }} />
    <motion.rect x={313} y={22} width={147} height={12} rx={6} fill={C.fail} opacity={0.3}
      initial={{ width: 0 }} animate={{ width: 147 }} transition={{ delay: 0.5, duration: 0.3 }} />
    <text x={160} y={18} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.pass}>정직한 2/3 이상</text>
    <text x={386} y={18} textAnchor="middle" fontSize={9} fill={C.fail}>악의적 {'<'} 1/3</text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <text x={240} y={50} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">BFT 안전성: f {'<'} n/3 → 2/3 서명이면 안전</text>
    </motion.g>
  </g>);
}

const R = [Step0, Step1];

export default function QuorumViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 65" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
