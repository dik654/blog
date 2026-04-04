import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { hs1: '#6366f1', hs2: '#10b981', tc: '#f59e0b', err: '#ef4444' };
const f = { opacity: 0, y: 4 };
const t = (d: number) => ({ delay: d });

const STEPS = [
  { label: 'HotStuff: 3단계 투표' },
  { label: 'HotStuff-2: Pre-Commit 제거' },
  { label: 'TC(Timeout Certificate)로 안전성' },
];

function Step0() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.hs1}
      initial={f} animate={{ opacity: 1, y: 0 }}>HotStuff: 3-Phase Protocol</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'Phase 1: Prepare → QC₁ (2 msg delays)'}
    </motion.text>
    <motion.text x={15} y={56} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'Phase 2: Pre-Commit → QC₂ (2 msg delays)'}
    </motion.text>
    <motion.text x={15} y={74} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'Phase 3: Commit → QC₃ (2 msg delays)'}
    </motion.text>
    <motion.text x={15} y={98} fontSize={10} fill={C.hs1}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      {'합계: 7 msg delays — Pre-Commit이 지연 원인'}
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.hs2}
      initial={f} animate={{ opacity: 1, y: 0 }}>HotStuff-2: 2-Phase Protocol</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'Phase 1: Prepare → QC₁ (2 msg delays)'}
    </motion.text>
    <motion.text x={15} y={56} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'Phase 2: Commit → QC₂ (2 msg delays)'}
    </motion.text>
    <motion.text x={15} y={76} fontSize={10} fill={C.err}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'Pre-Commit 제거됨 — TC가 그 역할 대체'}
    </motion.text>
    <motion.text x={15} y={98} fontSize={10} fill={C.hs2}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      {'합계: 4 msg delays — HotStuff 대비 3 delays 절감'}
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.tc}
      initial={f} animate={{ opacity: 1, y: 0 }}>TC: Timeout Certificate</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'timeout(v) → ⟨TIMEOUT, v, highQC⟩σᵢ broadcast'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'TC = aggregate(2f+1 ⟨TIMEOUT, v, highQC⟩ 서명)'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.tc}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'새 리더: max(highQC in TC).block 기반 제안'}
    </motion.text>
    <motion.text x={15} y={98} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      {'View Change도 O(n) 유지 — Pre-Commit 없이 Safety 보존'}
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function TwoPhaseViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 480 115" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
