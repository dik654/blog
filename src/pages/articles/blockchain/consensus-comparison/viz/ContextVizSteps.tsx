import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = { opacity: 0, y: 4 };
const t = (d: number) => ({ delay: d });

export function StepProtocols() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.proto}
      initial={f} animate={{ opacity: 1, y: 0 }}>프로토콜 분류: 4가지 패밀리</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'Classical BFT: PBFT (O(n²), 2단계, 즉시 확정)'}
    </motion.text>
    <motion.text x={15} y={56} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'Linear BFT: HotStuff (O(n), 3단계, 리더 기반)'}
    </motion.text>
    <motion.text x={15} y={74} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'DAG BFT: Narwhal/Bullshark (분리된 합의)'}
    </motion.text>
    <motion.text x={15} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      {'확률적: Avalanche (서브샘플링), Nakamoto (최장 체인)'}
    </motion.text>
  </g>);
}

export function StepCriteria() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.perf}
      initial={f} animate={{ opacity: 1, y: 0 }}>비교 기준: 다차원 트레이드오프</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'처리량: TPS (msg complexity 영향)'}
    </motion.text>
    <motion.text x={15} y={56} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'지연: 커밋 msg delays (2 vs 3 vs 확률적)'}
    </motion.text>
    <motion.text x={15} y={74} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'확장성: O(n²) vs O(n) vs O(k log n)'}
    </motion.text>
    <motion.text x={15} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      {'최종성: 즉시(BFT) vs 확률적(Nakamoto/Avalanche)'}
    </motion.text>
  </g>);
}

export function StepSafetyLiveness() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.sec}
      initial={f} animate={{ opacity: 1, y: 0 }}>핵심: Safety vs Liveness 트레이드오프</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'Safety 우선 (BFT): f+1 장애 시 멈춤 (halt)'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'Liveness 우선 (최장체인): 항상 성장, 확정 느림'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.sec}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'FLP 불가능성: 비동기에서 둘 다 완벽 보장 불가'}
    </motion.text>
    <motion.text x={15} y={98} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      {'부분 동기 BFT: Safety 항상, Liveness GST 후 보장'}
    </motion.text>
  </g>);
}

export function StepUseCases() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.use}
      initial={f} animate={{ opacity: 1, y: 0 }}>용도별 최적 프로토콜 선택</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'결제/DeFi: BFT (즉시 확정, 소수 검증자)'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'대규모 L1: Avalanche (확장성, 수천 노드)'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'App-chain: Tendermint/CometBFT (즉시 확정+IBC)'}
    </motion.text>
    <motion.text x={15} y={98} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      {'은탄환은 없다 — 용도별 최적 프로토콜이 다름'}
    </motion.text>
  </g>);
}
