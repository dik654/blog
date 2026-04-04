import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = { opacity: 0, y: 4 };
const t = (d: number) => ({ delay: d });

export function StepHotStuffDelay() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.hs}
      initial={f} animate={{ opacity: 1, y: 0 }}>한계: HotStuff 3단계 지연</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'Phase 1: Prepare → QC₁ (2 msg delays)'}
    </motion.text>
    <motion.text x={15} y={56} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'Phase 2: Pre-commit → QC₂ (2 msg delays)'}
    </motion.text>
    <motion.text x={15} y={74} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'Phase 3: Commit → QC₃ (2 msg delays)'}
    </motion.text>
    <motion.text x={15} y={96} fontSize={10} fill={C.hs}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      {'O(n) 통신이지만 3단계 투표 = 높은 확정 지연'}
    </motion.text>
  </g>);
}

export function StepPBFTBroadcast() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.pbft}
      initial={f} animate={{ opacity: 1, y: 0 }}>한계: PBFT O(n²) 통신</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'PBFT: 2단계 투표 = 낮은 지연 (4 msg delays)'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill={C.pbft}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'Prepare/Commit: all-to-all broadcast → O(n²)'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'n=100 → 10,000 메시지/라운드 — 확장 불가'}
    </motion.text>
  </g>);
}

export function StepHybrid() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.hybrid}
      initial={f} animate={{ opacity: 1, y: 0 }}>핵심: Fast + Slow 하이브리드</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'Fast Path: PBFT 스타일 2단계 (4 delays)'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'Slow Path: HotStuff 3단계 fallback (7 delays)'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.hybrid}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'정상 시 Fast, 장애 시 Slow — 자동 경로 선택'}
    </motion.text>
  </g>);
}

export function StepPipeline() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.pipe}
      initial={f} animate={{ opacity: 1, y: 0 }}>파이프라인: 병렬 합의 인스턴스</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'Slot 1: L₁ propose(B₁), Slot 2: L₂ propose(B₂)...'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'여러 인스턴스 동시 실행 → 리더가 돌아가며 제안'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.pipe}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'처리량 = 슬롯 수 x 단일 처리량 (선형 증가)'}
    </motion.text>
  </g>);
}
