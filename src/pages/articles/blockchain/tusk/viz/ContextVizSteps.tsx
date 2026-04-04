import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = { opacity: 0, y: 4 };
const t = (d: number) => ({ delay: d });

export function StepPartialSync() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.sync}
      initial={f} animate={{ opacity: 1, y: 0 }}>한계: Partial Sync 가정</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'t ≥ GST: delay(m) ≤ Δ → Liveness 보장'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill={C.err}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'t < GST: delay(m) = ∞ → 합의 진행 불가 (멈춤)'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'문제: GST 시점을 예측 불가 — DDoS 시 무한 대기'}
    </motion.text>
  </g>);
}

export function StepAsyncNeed() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.err}
      initial={f} animate={{ opacity: 1, y: 0 }}>동기: 비동기 합의의 필요성</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'위협: DDoS, Network Partition, Delay Injection'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'요구: ∀ delay(m), eventually decide(v) 보장'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.async}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'타이밍 가정 완전 제거 = 비동기 합의 프로토콜'}
    </motion.text>
  </g>);
}

export function StepRandomCoin() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.ok}
      initial={f} animate={{ opacity: 1, y: 0 }}>FLP 우회: Common Coin</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'FLP: 결정론적 비동기 합의 = 불가능 (1985)'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'해법: coin(r) = shared_random(r) → 리더 선택'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.ok}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'수렴: O(1) 라운드 안에 확률적으로 합의 완료'}
    </motion.text>
  </g>);
}

export function StepTusk() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.async}
      initial={f} animate={{ opacity: 1, y: 0 }}>Tusk = Narwhal DAG + 비동기 순서</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'Narwhal: DAG 구축 (데이터 가용성 계층)'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'Tusk: coin(wave) → 앵커 선택 → 순서 결정'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.async}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'Bullshark(부분동기) vs Tusk(비동기) — 같은 DAG'}
    </motion.text>
  </g>);
}
