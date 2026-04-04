import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { C, STEPS } from './ParticipationVizData';

function Step0() {
  const bits = Array.from({ length: 32 }, (_, i) => i < 28 ? 1 : 0);
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 13~14</text>
    {bits.map((b, i) => (
      <motion.rect key={i} x={20 + i * 14} y={22} width={12} height={20} rx={2}
        fill={b ? C.active : C.inactive} opacity={b ? 0.8 : 0.2}
        initial={{ opacity: 0 }} animate={{ opacity: b ? 0.8 : 0.2 }}
        transition={{ delay: i * 0.02 }} />
    ))}
    <text x={20} y={56} fontSize={8} fill="var(--muted-foreground)">... 512비트 중 일부 표시 (1=참여, 0=미참여)</text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 15~17</text>
    <rect x={20} y={22} width={180} height={30} rx={6} fill="var(--card)" stroke={C.bit} strokeWidth={0.8} />
    <text x={110} y={38} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.bit}>.filter(bit == 1)</text>
    <text x={110} y={48} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">미참여 공개키 제외</text>
    <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
      <rect x={230} y={22} width={230} height={30} rx={6} fill="var(--card)" stroke={C.active} strokeWidth={0.8} />
      <text x={345} y={34} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.active}>participants: ~450/512</text>
      <text x={345} y={48} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">실제 서명에 참여한 공개키만</text>
    </motion.g>
  </g>);
}

const R = [Step0, Step1];

export default function ParticipationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 65" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
