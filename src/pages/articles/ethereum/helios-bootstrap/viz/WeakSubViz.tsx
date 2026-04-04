import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { C, STEPS } from './WeakSubVizData';

function Step0() {
  return (<g>
    <rect x={20} y={25} width={440} height={12} rx={6} fill="var(--border)" opacity={0.3} />
    <motion.rect x={20} y={25} width={320} height={12} rx={6} fill={C.safe} opacity={0.6}
      initial={{ width: 0 }} animate={{ width: 320 }} transition={{ duration: 0.6 }} />
    <text x={160} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.safe}>안전 구간</text>
    <text x={160} y={52} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">~27시간 (54,000 슬롯)</text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <line x1={340} y1={18} x2={340} y2={44} stroke={C.time} strokeWidth={1} strokeDasharray="3 2" />
      <text x={345} y={20} fontSize={8} fill={C.time}>현재 슬롯</text>
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <rect x={20} y={25} width={440} height={12} rx={6} fill="var(--border)" opacity={0.3} />
    <motion.rect x={20} y={25} width={200} height={12} rx={6} fill={C.safe} opacity={0.6}
      initial={{ width: 0 }} animate={{ width: 200 }} transition={{ duration: 0.4 }} />
    <motion.rect x={220} y={25} width={240} height={12} rx={6} fill={C.danger} opacity={0.4}
      initial={{ width: 0 }} animate={{ width: 240 }} transition={{ delay: 0.4, duration: 0.4 }} />
    <text x={110} y={20} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.safe}>안전</text>
    <text x={340} y={20} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>위험 (만료)</text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <text x={340} y={52} textAnchor="middle" fontSize={8} fill={C.danger}>검증자 집합 변경 가능 → 거부</text>
    </motion.g>
  </g>);
}

const R = [Step0, Step1];

export default function WeakSubViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 65" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
