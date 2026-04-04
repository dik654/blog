import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = { opacity: 0, y: 4 };
const t = (d: number) => ({ delay: d });

export function StepSlowEC() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.err}
      initial={f} animate={{ opacity: 1, y: 0 }}>한계: EC(Expected Consensus) 느린 확정</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'EC: 확률적 합의 — tipset 기반 최장 체인'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill={C.err}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'최종성: 900 에폭 = 7.5시간 (번복 확률 충분히 감소)'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'DeFi, 크로스체인 브릿지에 부적합 — 즉시 확정 필요'}
    </motion.text>
  </g>);
}

export function StepF3Added() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.f3}
      initial={f} animate={{ opacity: 1, y: 0 }}>구조: EC + F3(GossiPBFT) 이중 계층</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'EC 레이어: 블록 생산 (기존 합의 불변)'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill={C.f3}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'F3 레이어: PBFT 투표를 gossip으로 전파'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'EC 위에 확정 레이어만 추가 — 기존 체인 호환'}
    </motion.text>
  </g>);
}

export function StepPowerVote() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.ok}
      initial={f} animate={{ opacity: 1, y: 0 }}>투표: 2/3+ 스토리지 파워 가중치</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'SP₁: 30%, SP₂: 25%, SP₃: 20% 스토리지 파워'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'QUALITY → CONVERGE → DECIDE → FINALIZE'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.ok}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'30+25+20 = 75% >= 67% → 확정 (가중 정족수)'}
    </motion.text>
  </g>);
}

export function StepResult() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.ok}
      initial={f} animate={{ opacity: 1, y: 0 }}>결과: 7.5시간 → 수 분 확정</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'기존 EC: finality_time = 900 * 30s = 7.5시간'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill={C.ok}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'F3 추가: finality_time = 수 분 (PBFT 라운드)'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'Filecoin DeFi, 크로스체인 브릿지의 핵심 인프라'}
    </motion.text>
  </g>);
}
