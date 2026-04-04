import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, AlertBox, DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './ValidateVizData';

function Step0() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 9~13</text>
    <DataBox x={15} y={22} w={130} h={24} label="signature_slot" color={C.slot} />
    <text x={165} y={36} fontSize={12} fontWeight={700} fill="var(--foreground)">{'>'}</text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <DataBox x={190} y={22} w={150} h={24} label="attested_header.slot" color={C.slot} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <rect x={370} y={18} width={100} height={32} rx={6} fill="var(--card)" stroke={C.slot} strokeWidth={0.8} />
      <text x={420} y={38} textAnchor="middle" fontSize={9} fill={C.slot}>순서 유효</text>
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 15~24</text>
    <ActionBox x={15} y={22} w={180} h={30} label="verify_sync_committee_sig()" sub="비트맵 → 합산 → 페어링" color={C.bls} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <rect x={220} y={18} width={240} height={38} rx={6} fill="var(--card)" stroke={C.bls} strokeWidth={0.8} />
      <text x={340} y={32} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.bls}>e(agg_pk, H(m)) == e(G, sig)</text>
      <text x={340} y={48} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">GT 비교 → 서명 유효 여부</text>
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 25~27</text>
    <ActionBox x={15} y={22} w={120} h={30} label="valid == false" sub="서명 무효" color={C.err} />
    <motion.line x1={140} y1={37} x2={180} y2={37} stroke={C.err} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <AlertBox x={185} y={18} w={250} h={38} label="Err: BLS verify failed" sub="위변조된 Update 거부" color={C.err} />
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function ValidateViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 70" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
