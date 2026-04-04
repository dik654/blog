import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './BLS12381VizData';

function Step0() {
  return (<g>
    <DataBox x={20} y={18} w={100} h={28} label="G1 (48B)" color={C.g1} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={150} y={14} width={310} height={36} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={160} y={32} fontSize={10} fontWeight={600} fill={C.g1}>공개키 = sk * G1_generator</text>
      <text x={160} y={44} fontSize={8} fill="var(--muted-foreground)">pk1 + pk2 + ... = aggregate_pk (덧셈 가능)</text>
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <DataBox x={20} y={18} w={100} h={28} label="G2 (96B)" color={C.g2} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={150} y={14} width={310} height={36} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={160} y={32} fontSize={10} fontWeight={600} fill={C.g2}>서명 = sk * H(message)</text>
      <text x={160} y={44} fontSize={8} fill="var(--muted-foreground)">H(m): hash_to_g2 — 메시지를 G2 점으로 매핑</text>
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <DataBox x={20} y={15} w={90} h={28} label="GT" color={C.gt} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={130} y={8} width={340} height={46} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={140} y={26} fontSize={10} fontWeight={600} fill={C.gt}>e(agg_pk, H(m)) == e(G, sig)</text>
      <text x={140} y={40} fontSize={9} fill="var(--muted-foreground)">lhs: 집계 공개키 × 메시지 해시</text>
      <text x={140} y={52} fontSize={9} fill="var(--muted-foreground)">rhs: 생성원 × 집계 서명</text>
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function BLS12381Viz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 65" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
