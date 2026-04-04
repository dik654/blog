import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './RotationVizData';

function Step0() {
  const items = [
    { label: '32 슬롯 = 1 에폭', x: 20 },
    { label: '256 에폭 = 1 period', x: 180 },
    { label: '≈ 27시간', x: 370 },
  ];
  return (<g>
    {items.map((it, i) => (
      <motion.g key={it.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.2 }}>
        <DataBox x={it.x} y={20} w={140} h={26} label={it.label} color={C.period} />
        {i < 2 && <motion.line x1={it.x + 145} y1={33} x2={it.x + 175} y2={33}
          stroke={C.epoch} strokeWidth={1} initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }} transition={{ delay: i * 0.2 + 0.15 }} />}
      </motion.g>
    ))}
  </g>);
}

function Step1() {
  return (<g>
    <DataBox x={20} y={18} w={100} h={26} label="slot" color={C.calc} />
    <motion.line x1={125} y1={31} x2={155} y2={31} stroke={C.calc} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <rect x={160} y={14} width={140} height={34} rx={6} fill="var(--card)" stroke={C.calc} strokeWidth={0.8} />
      <text x={230} y={30} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.calc}>slot / 8192</text>
      <text x={230} y={42} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">= period</text>
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <rect x={330} y={14} width={140} height={34} rx={6} fill="var(--card)" stroke={C.period} strokeWidth={0.8} />
      <text x={400} y={30} textAnchor="middle" fontSize={9} fill={C.period}>같은 period =</text>
      <text x={400} y={42} textAnchor="middle" fontSize={9} fill={C.period}>같은 위원회</text>
    </motion.g>
  </g>);
}

const R = [Step0, Step1];

export default function RotationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 60" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
