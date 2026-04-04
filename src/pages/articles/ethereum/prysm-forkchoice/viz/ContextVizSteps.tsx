import { motion } from 'framer-motion';
import { ModuleBox, AlertBox, DataBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 포크 발생 */
export function StepFork() {
  return (<g>
    <rect x={170} y={10} width={80} height={24} rx={6} fill="var(--card)" stroke={C.fork} strokeWidth={1} />
    <text x={210} y={26} textAnchor="middle" fontSize={11} fill={C.fork}>Slot 4800</text>
    <motion.line x1={190} y1={34} x2={120} y2={60} stroke={C.fork} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.3 }} />
    <motion.line x1={230} y1={34} x2={300} y2={60} stroke={C.fork} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={70} y={60} w={100} h={24} label="4801-A w=90" color={C.fork} />
      <DataBox x={250} y={60} w={100} h={24} label="4801-B w=210" color={C.attest} />
    </motion.g>
    <text x={210} y={105} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      동일 슬롯에 2개 블록 — 어느 쪽이 정식 체인?
    </text>
  </g>);
}

/* Step 1: 공격자 포크 */
export function StepAttack() {
  return (<g>
    <AlertBox x={110} y={18} w={200} h={55} label="의도적 포크 공격"
      sub="수십만 투표를 실시간 집계 필요" color={C.err} />
    <motion.text x={210} y={100} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      느린 집계 → 체인 분열 위험
    </motion.text>
  </g>);
}

/* Step 2: 성능 문제 */
export function StepPerformance() {
  return (<g>
    <AlertBox x={40} y={18} w={140} h={50} label="배열 기반" sub="삭제 O(n) 재정렬" color={C.err} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ModuleBox x={240} y={18} w={140} h={50} label="트리 기반" sub="삭제 O(1) 포인터" color={C.ok} />
    </motion.g>
  </g>);
}

/* Step 3: LMD-GHOST */
export function StepLMDGHOST() {
  return (<g>
    <DataBox x={145} y={8} w={130} h={24} label="Justified (Ep 150)" color={C.fork} />
    <motion.line x1={210} y1={32} x2={140} y2={58} stroke={C.attest} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.line x1={210} y1={32} x2={280} y2={58} stroke={C.ok} strokeWidth={1.5}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <DataBox x={90} y={58} w={100} h={24} label="w=5,760 ETH" color={C.attest} />
      <DataBox x={230} y={58} w={100} h={24} label="w=13,440 ETH" color={C.ok} />
    </motion.g>
    <motion.text x={280} y={103} textAnchor="middle" fontSize={11} fill={C.ok} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      HEAD ← 가중치 최대
    </motion.text>
  </g>);
}

/* Step 4: doubly-linked-tree */
export function StepTree() {
  return (<g>
    <ModuleBox x={30} y={18} w={130} h={45} label="nodeByRoot" sub="O(1) 맵 탐색" color={C.head} />
    <motion.line x1={165} y1={40} x2={215} y2={40} stroke={C.head} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ModuleBox x={220} y={18} w={130} h={45} label="양방향 링크" sub="parent ↔ children" color={C.ok} />
    </motion.g>
    <motion.text x={210} y={88} textAnchor="middle" fontSize={11} fill={C.attest}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      Proposer Boost: 현재 슬롯 제안자 +40%
    </motion.text>
  </g>);
}
