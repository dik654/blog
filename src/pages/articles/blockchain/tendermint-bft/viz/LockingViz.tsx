import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { lock: '#f59e0b', ok: '#10b981', err: '#ef4444', bl: '#6366f1' };
const f = { opacity: 0, y: 4 };
const t = (d: number) => ({ delay: d });

const STEPS = [
  { label: 'Round r: Polka → 잠금 설정' },
  { label: '잠금 상태에서 Precommit 제한' },
  { label: 'Round r+1: 잠금이 Safety 보호' },
];

function Step0() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.lock}
      initial={f} animate={{ opacity: 1, y: 0 }}>State: Polka 형성 → Lock 설정</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'수신: |Prevote(h, r, H(B))| ≥ +2/3  → "Polka(B)"'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill={C.lock}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'설정: lockedValue = B, lockedRound = r'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'validValue = B, validRound = r  (유효 값도 갱신)'}
    </motion.text>
    <motion.text x={15} y={98} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      이 시점부터 B 외 다른 블록 Precommit 불가
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.bl}
      initial={f} animate={{ opacity: 1, y: 0 }}>Rule: 잠금 상태 Precommit 제한</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill={C.ok}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'lockedValue=B → Precommit(H(B)) 전송 가능'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill={C.err}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'lockedValue=B → Precommit(H(C)) 전송 불가 (C≠B)'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'Safety 보장: 두 블록이 동시 커밋되는 것 방지'}
    </motion.text>
    <motion.text x={15} y={98} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      {'잠금 해제: 더 높은 라운드 r\'>r에서 Polka(B\') 수신 시'}
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.ok}
      initial={f} animate={{ opacity: 1, y: 0 }}>Round r+1: 잠긴 블록 재제안</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'새 Proposer: validValue=B → Propose(B, pol_round=r)'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'정직 노드: lockedRound ≤ pol_round → Prevote(B)'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.ok}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'Polka(B) 재형성 → Precommit(B) → Commit(B)'}
    </motion.text>
    <motion.text x={15} y={98} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      {'Liveness: 정직 Proposer가 잠긴 블록 재제안 → 합의 완료'}
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function LockingViz() {
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
