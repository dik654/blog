import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox } from '@/components/viz/boxes';
import { C, STEPS } from './AggPubkeyVizData';

function Step0() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 25~27</text>
    {[0, 1, 2].map(i => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15 }}>
        <DataBox x={20 + i * 70} y={22} w={60} h={22} label={`pk${i}`} color={C.pk} />
      </motion.g>
    ))}
    <text x={238} y={34} fontSize={10} fill="var(--muted-foreground)">... +</text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ActionBox x={270} y={18} w={90} h={30} label="fold(+)" sub="G1 덧셈" color={C.agg} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <DataBox x={385} y={22} w={80} h={22} label="agg_pk" color={C.agg} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <rect x={20} y={12} width={200} height={40} rx={6} fill="var(--card)" stroke={C.pk} strokeWidth={0.8} />
    <text x={120} y={28} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.pk}>개별 검증: O(n) 페어링</text>
    <text x={120} y={42} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">512번 페어링 연산</text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={260} y={12} width={200} height={40} rx={6} fill="var(--card)" stroke={C.agg} strokeWidth={0.8} />
      <text x={360} y={28} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.agg}>집계 검증: O(1) 페어링</text>
      <text x={360} y={42} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">2번 페어링 연산</text>
    </motion.g>
  </g>);
}

const R = [Step0, Step1];

export default function AggPubkeyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 65" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
