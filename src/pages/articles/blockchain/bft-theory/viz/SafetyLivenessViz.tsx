import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { safe: '#6366f1', live: '#10b981', err: '#ef4444' };
const f = { opacity: 0, y: 4 };
const t = (d: number) => ({ delay: d });

const STEPS = [
  { label: 'Safety — 잘못된 합의 방지' },
  { label: 'Liveness — 합의 진행 보장' },
  { label: 'FLP — 비동기에서 둘 다 불가' },
];

function StepSafety() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.safe}
      initial={f} animate={{ opacity: 1, y: 0 }}>Property: Safety (Agreement)</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'∀ 정직 pᵢ, pⱼ: decide(pᵢ)=v ∧ decide(pⱼ)=v\' → v=v\''}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'Validity: decide(v) → v는 정직 노드가 제안한 값'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.safe}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'보장 범위: 비동기, 파티션 등 모든 상황에서 불변'}
    </motion.text>
    <motion.text x={15} y={98} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      Safety는 절대 위반 불가 — BFT 프로토콜의 핵심
    </motion.text>
  </g>);
}

function StepLiveness() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.live}
      initial={f} animate={{ opacity: 1, y: 0 }}>Property: Liveness (Termination)</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'∀ 정직 pᵢ: eventually decide(v)  (반드시 종료)'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'조건: t ≥ GST ∧ leader가 정직 → 합의 완료'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.live}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'진행 수단: timeout → view-change → 새 리더 선출'}
    </motion.text>
    <motion.text x={15} y={98} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      GST 이후에만 보장 — 비동기 구간에선 멈출 수 있음
    </motion.text>
  </g>);
}

function StepFLP() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.err}
      initial={f} animate={{ opacity: 1, y: 0 }}>Theorem: FLP Impossibility (1985)</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'비동기 + 결정론적 → Safety ∧ Liveness 동시 불가'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'증명: 1개 crash만으로 무한 연기(bivalent 상태) 가능'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.safe}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'BFT 해법: Safety는 항상 보장, Liveness는 GST 후 보장'}
    </motion.text>
    <motion.text x={15} y={98} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      부분 동기 가정으로 FLP 우회 → PBFT, HotStuff, Tendermint
    </motion.text>
  </g>);
}

const R = [StepSafety, StepLiveness, StepFLP];

export default function SafetyLivenessViz() {
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
