import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { fast: '#10b981', slow: '#6366f1', err: '#ef4444' };
const f = { opacity: 0, y: 4 };
const t = (d: number) => ({ delay: d });

const STEPS = [
  { label: 'Fast Path 시도 (2단계)' },
  { label: '모든 노드 정상 → Fast 성공' },
  { label: '장애 감지 → Slow Path 전환' },
];

function Step0() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.fast}
      initial={f} animate={{ opacity: 1, y: 0 }}>Fast Path: 2-Phase 시도</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'L→all: ⟨PROPOSE, view=v, B, QCₕᵢ⟩'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'pᵢ→L: ⟨VOTE, view=v, H(B)⟩σᵢ  (모든 n-f 필요)'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.fast}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'조건: n-f = 3f+1-f = 2f+1개 투표 (모든 정직 노드)'}
    </motion.text>
    <motion.text x={15} y={98} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      Fast path: Propose→Vote→Commit = 4 msg delays
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.fast}
      initial={f} animate={{ opacity: 1, y: 0 }}>Fast 성공: PBFT급 지연 + O(n) 통신</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'L: |votes| = n-f → fastQC = aggregate(n-f σ)'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'L→all: ⟨COMMIT, B, fastQC⟩  → 즉시 확정'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.fast}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'결과: 4 delays, O(n) 통신 — 최적 달성'}
    </motion.text>
    <motion.text x={15} y={98} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      {'모든 정직 노드 동의 = 장애 없는 정상 상태'}
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.err}
      initial={f} animate={{ opacity: 1, y: 0 }}>Fallback: Slow Path (HotStuff 3단계)</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'감지: |votes| < n-f → timeout 발동'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'Slow: Prepare→Pre-Commit→Commit (3-chain)'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.slow}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'결과: 7 delays — 안전하지만 느림'}
    </motion.text>
    <motion.text x={15} y={98} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      Slow 완료 후 다음 view에서 Fast 재시도
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function JolteonViz() {
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
