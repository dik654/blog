import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './SupraSealVizData';

function StepPC1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.pc1}>SupraSeal PC1 — 캐시 최적화</text>
    <text x={20} y={44} fontSize={10} fill={C.pc1}>Line 1: sha256_batch(nodes, L1_BATCH_SIZE)  // L1 캐시 적중률 극대화</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.opt}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: prefetch(next_parents)  // L2 미스 최소화 프리페치
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 순차 파이프라인 + 데이터 배치 → 처리량 극대화
    </motion.text>
  </g>);
}

function StepPC2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.pc2}>SupraSeal PC2 — GPU Poseidon</text>
    <text x={20} y={44} fontSize={10} fill={C.pc2}>Line 1: poseidon_batch_gpu(columns, COALESCED_ACCESS)</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.opt}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: // 코얼레싱 접근 → GPU 대역폭 극대화
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 커널 스케줄 최적화 — 유휴 시간 최소화
    </motion.text>
  </g>);
}

function StepC2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.c2}>SupraSeal C2 — 점 연산 최적화</text>
    <text x={20} y={44} fontSize={10} fill={C.c2}>Line 1: msm_window_naf(points, scalars, W=5)  // wNAF 최적화</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.c2}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: prefetch_memory(next_bucket)  // 메모리 지연 숨김
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 봉인 시간 50%+ 단축 — 동일 증명, 알고리즘만 개선
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={68} w={100} h={22} label="50%+ 단축" sub="동일 증명" color={C.opt} />
    </motion.g>
  </g>);
}

const R = [StepPC1, StepPC2, StepC2];

export default function SupraSealViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
