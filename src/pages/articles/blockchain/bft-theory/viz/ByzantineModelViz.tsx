import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { crash: '#f59e0b', byz: '#ef4444', ok: '#10b981' };
const f = { opacity: 0, y: 4 };
const t = (d: number) => ({ delay: d });

const STEPS = [
  { label: 'Crash Fault — 노드 정지' },
  { label: 'Byzantine Fault — 이중 메시지' },
  { label: '부분 동기 모델 — GST 이후' },
];

function StepCrash() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.crash}
      initial={f} animate={{ opacity: 1, y: 0 }}>Phase: Crash Fault</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'p₃: send(m) → timeout, 응답 없음'}
    </motion.text>
    <motion.text x={15} y={56} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'State: alive={p₁,p₂}, crashed={p₃}'}
    </motion.text>
    <motion.text x={15} y={76} fontSize={10} fill={C.ok}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'조건: n ≥ 2f+1 → 3 ≥ 2(1)+1=3  정족수 충족'}
    </motion.text>
    <motion.text x={15} y={98} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      Raft/Paxos: 거짓말 없이 멈추기만 → 2f+1로 충분
    </motion.text>
  </g>);
}

function StepByz() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.byz}
      initial={f} animate={{ opacity: 1, y: 0 }}>Phase: Byzantine Fault</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'p₂→p₁: send(⟨VOTE, v=1⟩)'}
    </motion.text>
    <motion.text x={15} y={56} fontSize={10} fill={C.byz}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'p₂→p₃: send(⟨VOTE, v=0⟩)  ← 서로 다른 값!'}
    </motion.text>
    <motion.text x={15} y={76} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'State: p₁.received=1, p₃.received=0  (불일치)'}
    </motion.text>
    <motion.text x={15} y={98} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      {'조건: n ≥ 3f+1 필요 → 거짓말 탐지에 추가 여분'}
    </motion.text>
  </g>);
}

function StepSync() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.ok}
      initial={f} animate={{ opacity: 1, y: 0 }}>Model: Partial Synchrony</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'t < GST: delay(m) = ∞  (상한 없음, 비동기)'}
    </motion.text>
    <motion.text x={15} y={56} fontSize={10} fill={C.ok}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'t ≥ GST: delay(m) ≤ Δ  (상한 존재, 동기)'}
    </motion.text>
    <motion.text x={15} y={76} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'Safety: GST 전후 모두 보장'}
    </motion.text>
    <motion.text x={15} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      {'Liveness: GST 이후에만 보장 (PBFT, Tendermint, HotStuff)'}
    </motion.text>
  </g>);
}

const R = [StepCrash, StepByz, StepSync];

export default function ByzantineModelViz() {
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
