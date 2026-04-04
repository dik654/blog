import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';

const C = { bundle: '#10b981', mdbx: '#f59e0b', static: '#6b7280', ok: '#10b981' };

export function StepBundle() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      BundleState — revm 실행 결과 메모리 캐시
    </text>
    <text x={20} y={42} fontSize={10} fill={C.bundle}>
      Line 1: pub accounts: HashMap&lt;Address, BundleAccount&gt;
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.bundle}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: pub storage: HashMap&lt;Address, HashMap&lt;U256, StorageSlot&gt;&gt;
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill="#ef4444"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: pub reverts: Vec&lt;Vec&lt;(Address, AccountRevert)&gt;&gt;
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      reorg 시 reverts를 역순 적용하여 상태 복원
    </motion.text>
  </g>);
}

export function StepMDBX() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      MDBX — B+tree 기반 영속 저장소
    </text>
    <text x={20} y={42} fontSize={10} fill={C.mdbx}>
      Line 1: // MDBX: B+tree → 읽기 증폭 없음 (MVCC)
    </text>
    <motion.text x={20} y={58} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: // Geth: LevelDB (LSM-tree) → compaction 필요
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.mdbx}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: let tx = env.begin_ro_txn()  // 읽기 트랜잭션
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.mdbx}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: tx.get(table, key)?  // MVCC 스냅샷 읽기
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <DataBox x={340} y={86} w={120} h={26}
        label="읽기 증폭 0" sub="B+tree 이점" color={C.ok} />
    </motion.g>
  </g>);
}

export function StepStatic() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      StaticFiles — finalized 블록 아카이브
    </text>
    <text x={20} y={42} fontSize={10} fill={C.static}>
      Line 1: let offset = block_number - segment.start
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.static}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: let data = segment.read_at(offset)?  // O(1) 접근
    </motion.text>
    <motion.text x={20} y={76} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      // 파일: blocks_0-499999, blocks_500k-999k, ...
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      블록 번호 = 파일 오프셋 → O(1) 직접 접근
    </motion.text>
  </g>);
}
