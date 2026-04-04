import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = { opacity: 0, y: 4 };
const t = (d: number) => ({ delay: d });

export function StepBFTLimit() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.bft}
      initial={f} animate={{ opacity: 1, y: 0 }}>한계: BFT O(n²) 통신 복잡도</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'PBFT: all-to-all → msgs = n(n-1) = O(n²)'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'HotStuff: O(n) 통신이지만 3단계 = 높은 지연'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.avax}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'수천 노드에서 확장 불가 — 새 패러다임 필요'}
    </motion.text>
  </g>);
}

export function StepSubsampling() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.snow}
      initial={f} animate={{ opacity: 1, y: 0 }}>핵심: 서브샘플링 질의</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'전체 N=1000+ 노드 중 k=20개 무작위 샘플링'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'query(k) → α개 이상 동의 시 색상 채택 (α > k/2)'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.ok}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'통신: O(k log n) — k 고정이므로 사실상 O(log n)'}
    </motion.text>
  </g>);
}

export function StepSnowEvolution() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.snow}
      initial={f} animate={{ opacity: 1, y: 0 }}>진화: Snowflake → Snowball</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'Snowflake: cnt ← 연속 α 동의 횟수'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'cnt ≥ β → decide(color) — 단순하지만 변동에 취약'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.ok}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'Snowball: confidence[c] += 1 — 누적 신뢰도로 안정화'}
    </motion.text>
  </g>);
}

export function StepAvalancheDAG() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.avax}
      initial={f} animate={{ opacity: 1, y: 0 }}>Avalanche: DAG + 충돌 그래프</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'TX를 DAG 정점으로 — 부모 참조로 연결'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'충돌: conflict(tx₁, tx₂) → Snowball로 하나 선택'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.avax}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'결정론적 BFT가 아닌 확률적 합의 패러다임'}
    </motion.text>
  </g>);
}
