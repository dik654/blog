import { motion } from 'framer-motion';

const C = {
  trait: '#6366f1', bundle: '#10b981', mdbx: '#f59e0b',
  static: '#6b7280',
};

export function StepOverview() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      Provider 4계층 — 위에서 아래로 탐색
    </text>
    <text x={20} y={42} fontSize={10} fill={C.trait}>
      Line 1: StateProvider trait  // 공통 인터페이스
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.bundle}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: BundleState  // in-memory 캐시 (miss → 다음)
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.mdbx}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: MDBX (B+tree)  // 디스크 DB (miss → 다음)
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.static}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: StaticFiles  // flat 아카이브 (finalized)
    </motion.text>
    <motion.text x={20} y={112} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      메모리 캐시 히트 시 디스크 접근 없음
    </motion.text>
  </g>);
}

export function StepTrait() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      StateProvider trait — 3개 메서드
    </text>
    <text x={20} y={42} fontSize={10} fill={C.trait}>
      Line 1: fn account(addr: Address) -&gt; Option&lt;Account&gt;
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.trait}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: fn storage(addr, key: B256) -&gt; Option&lt;U256&gt;
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.trait}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: fn bytecode_by_hash(hash: B256) -&gt; Option&lt;Bytecode&gt;
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      테스트 시 MockProvider 주입 가능 — trait 추상화
    </motion.text>
  </g>);
}
