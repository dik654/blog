import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = { opacity: 0, y: 4 };
const t = (d: number) => ({ delay: d });

export function StepProbFinality() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.chain}
      initial={f} animate={{ opacity: 1, y: 0 }}>확률적 최종성: 확인 수 → 번복 확률</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'1 confirm: P(reorg) ≈ 25% (매우 위험)'}
    </motion.text>
    <motion.text x={15} y={56} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'3 confirm: P(reorg) ≈ 5% (대부분 안전)'}
    </motion.text>
    <motion.text x={15} y={74} fontSize={10} fill={C.ok}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'6 confirm: P(reorg) < 0.1% (Bitcoin 기준 안전)'}
    </motion.text>
    <motion.text x={15} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      {'공격자 해시파워 q가 작을수록 기하급수 감소'}
    </motion.text>
  </g>);
}

export function StepVsBFT() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.chain}
      initial={f} animate={{ opacity: 1, y: 0 }}>비교: BFT vs 최장 체인</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'BFT: 결정론적 최종성, 소수 검증자 (n=100이하)'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'최장체인: 확률적 최종성, 대규모 참여 (n=10000+)'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.fork}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'트레이드오프: 안전성(BFT) vs 활성(최장 체인)'}
    </motion.text>
    <motion.text x={15} y={98} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      {'Eth2: LMD-GHOST(체인) + Casper FFG(BFT) 결합'}
    </motion.text>
  </g>);
}
