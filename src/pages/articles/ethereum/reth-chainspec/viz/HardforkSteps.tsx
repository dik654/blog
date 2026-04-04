import { motion } from 'framer-motion';
import { C } from './HardforkDetailVizData';

export function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      ChainHardforks — BTreeMap 기반 관리
    </text>
    <text x={20} y={42} fontSize={10} fill={C.block}>
      Line 1: let hardforks: BTreeMap&lt;Hardfork, ForkCondition&gt;
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.block}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
      Line 2: // Frontier → London → Paris → Shanghai → Cancun
    </motion.text>
    <motion.text x={20} y={78} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      BTreeMap 키가 정렬되어 하드포크 순서를 자연 유지
    </motion.text>
  </g>);
}

export function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      ForkCondition::Block (Frontier~Istanbul)
    </text>
    <text x={20} y={42} fontSize={10} fill={C.block}>
      Line 1: ForkCondition::Block(12_965_000)  // London
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.block}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: // 블록 번호 12,965,000에 도달하면 EIP-1559 활성
    </motion.text>
    <motion.text x={20} y={78} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
      특정 블록 번호 도달 시 활성화
    </motion.text>
  </g>);
}

export function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      ForkCondition::TTD (The Merge)
    </text>
    <text x={20} y={42} fontSize={10} fill={C.ttd}>
      Line 1: ForkCondition::TTD(58_750_000_000_000_000_000_000)
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.ttd}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: // Total Terminal Difficulty: PoW → PoS 전환 지점
    </motion.text>
    <motion.text x={20} y={78} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
      모든 블록 난이도 합이 TTD 도달 시 PoS로 전환
    </motion.text>
  </g>);
}

export function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      ForkCondition::Timestamp (Shanghai~)
    </text>
    <text x={20} y={42} fontSize={10} fill={C.ts}>
      Line 1: ForkCondition::Timestamp(1_710_338_135)  // Cancun
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.ts}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: // 블록 타임스탬프 기준 → EIP-4844 활성
    </motion.text>
    <motion.text x={20} y={78} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
      PoS 이후: 블록 번호가 아닌 타임스탬프로 활성화
    </motion.text>
  </g>);
}

export function Step4() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      is_cancun_active(ts) → true/false
    </text>
    <text x={20} y={42} fontSize={10} fill={C.check}>
      Line 1: fn is_cancun_active(&amp;self, ts: u64) -&gt; bool {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.check}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:     let cond = self.fork(Hardfork::Cancun)?
    </motion.text>
    <motion.text x={40} y={74} fontSize={10} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3:     ts &gt;= 1710338135  // true → EIP-4844 활성
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.check}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: {'}'}
    </motion.text>
  </g>);
}
